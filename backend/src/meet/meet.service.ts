import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meet } from '../entities/meet.entity';
import MeetDto from './dto/meet.dto';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';
import * as moment from 'moment-timezone';
import { UserService } from '../user/user.service';
import FilterDto from './dto/filter.dto';
import * as excel from 'excel4node';

@Injectable()
export class MeetService {
  constructor(
    @InjectRepository(Meet) private readonly meetRepository: Repository<Meet>,
    private userService: UserService,
  ) {}

  public async save(meetDto: MeetDto, initiator: User) {
    let meet: Meet;

    if (
      !meetDto.id ||
      !(await this.meetRepository.exist({ where: { id: meetDto.id } }))
    ) {
      const meetHash = await hash(
        uuidv4(),
        parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS),
      );

      meet = new Meet(
        meetDto.theme,
        meetDto.description,
        moment(meetDto.dateTime).unix(),
        initiator,
        meetHash,
      );

      meet.participants = [initiator];
    } else {
      meet = await this.meetRepository.findOne({
        where: { id: meetDto.id },
        relations: {
          initiator: true,
          participants: true,
        },
      });
      meet.theme = meetDto.theme;
      meet.description = meetDto.description;
      meet.meetAt = moment(meetDto.dateTime).unix();
    }

    meet = await this.meetRepository.save(meet);

    return {
      id: meet.id,
      theme: meet.theme,
      description: meet.description,
      initiator: meet.initiator,
      participants: meet.participants,
      meetAt: moment.unix(meet.meetAt).format('YYYY-MM-DD HH:mm'),
      hash: meet.hash,
    };
  }

  public async detail(id: number, user: User) {
    const meet = await this.meetRepository.findOne({
      where: { id: id },
      relations: {
        participants: true,
        initiator: true,
      },
    });

    if (
      !user.isAdmin &&
      !meet.participants.find((participant) => participant.id === user.id)
    ) {
      throw new BadRequestException('Вы не приглашены на встречу');
    }

    return {
      id: meet.id,
      theme: meet.theme,
      description: meet.description,
      initiator: meet.initiator,
      participants: meet.participants.map((participant) => {
        return {
          id: participant.id,
          firstName: participant.firstName,
          lastName: participant.lastName,
        };
      }),
      meetAt: moment.unix(meet.meetAt).format('YYYY-MM-DD HH:mm'),
      hash: meet.hash,
    };
  }

  public async findAtDate(
    listAt: string,
    page: number,
    perPage: number,
    user: User,
  ) {
    const qb = this.meetRepository.createQueryBuilder('meet');

    qb.where('meet.meetAt >= :dateTime', {
      dateTime: moment(listAt).subtract(15, 'minutes').unix(),
    }).andWhere('meet.meetAt < :endDateTime', {
      endDateTime: moment(listAt).endOf('day').unix(),
    });

    qb.leftJoinAndSelect('meet.participants', 'participants').leftJoinAndSelect(
      'meet.initiator',
      'initiator',
    );

    if (!user.isAdmin) {
      qb.andWhere('participants.id = :userId', { userId: user.id });
    }

    const list = (
      await qb
        .skip((page - 1) * perPage)
        .take(perPage)
        .getMany()
    ).map((meet) => {
      return {
        id: meet.id,
        theme: meet.theme,
        description: meet.description,
        initiator: meet.initiator,
        participants: meet.participants.map((participant) => {
          return {
            id: participant.id,
            firstName: participant.firstName,
            lastName: participant.lastName,
          };
        }),
        meetAt: moment.unix(meet.meetAt).format('YYYY-MM-DD HH:mm'),
        hash: meet.hash,
      };
    });

    return {
      list,
      totalCount: await qb.getCount(),
    };
  }

  public async cancel(id: number, user: User) {
    const meet = await this.meetRepository.findOne({
      where: { id: id },
      relations: {
        initiator: true,
      },
    });

    if (!meet) {
      throw new BadRequestException('Встреча не найдена');
    }

    if (meet.initiator.id === user.id) {
      await this.meetRepository.remove(meet);
      return;
    }

    meet.participants = meet.participants.filter(
      (participant) => participant.id !== user.id,
    );

    await this.meetRepository.save(meet);
  }

  public async getByHash(hash: string) {
    const meet = await this.meetRepository.findOne({
      where: {
        hash: hash,
      },
      relations: {
        initiator: true,
        participants: true,
      },
    });

    if (!meet) return null;

    return {
      id: meet.id,
      theme: meet.theme,
      description: meet.description,
      initiator: meet.initiator,
      participants: meet.participants.map((participant) => {
        return {
          id: participant.id,
          firstName: participant.firstName,
          lastName: participant.lastName,
        };
      }),
      meetAt: moment.unix(meet.meetAt).format('YYYY-MM-DD HH:mm'),
      hash: meet.hash,
    };
  }

  public async addParticipant(meetId: number, userId: number, user: User) {
    const meet = await this.meetRepository.findOne({
      where: {
        id: meetId,
      },
      relations: {
        initiator: true,
        participants: true,
      },
    });

    if (!meet) {
      throw new BadRequestException('Встреча не найдена');
    }

    if (!user.isAdmin && meet.initiator.id !== user.id) {
      throw new UnauthorizedException('Доступ запрещен');
    }

    const participant = await this.userService.find(userId);

    if (!participant) {
      throw new BadRequestException('Пользователь не найден');
    }

    meet.participants.push(participant);

    await this.meetRepository.save(meet);

    return {
      id: participant.id,
      firstName: participant.firstName,
      lastName: participant.lastName,
    };
  }

  public async deleteParticipant(meetId: number, userId: number, user: User) {
    const meet = await this.meetRepository.findOne({
      where: {
        id: meetId,
      },
      relations: {
        initiator: true,
        participants: true,
      },
    });

    if (!meet) {
      throw new BadRequestException('Встреча не найдена');
    }

    if (meet.initiator.id === userId) {
      throw new BadRequestException('Вы не можете отозвать приглашение у себя');
    }

    if (!user.isAdmin && meet.initiator.id !== user.id) {
      throw new UnauthorizedException('Доступ запрещен');
    }

    meet.participants = meet.participants.filter(
      (participant) => participant.id !== userId,
    );

    await this.meetRepository.save(meet);
  }

  public async report(filter: FilterDto, user: User) {
    if (!user.isAdmin) {
      throw new UnauthorizedException('Доступ запрещен');
    }

    const qb = this.meetRepository.createQueryBuilder('meet');

    if (filter.dateFrom) {
      qb.andWhere('meet.meetAt >= :dateFrom', {
        dateFrom: moment(filter.dateFrom).unix(),
      });
    }
    if (filter.dateTo) {
      qb.andWhere('meet.meetAt <= :dateTo', {
        dateTo: moment(filter.dateTo).unix(),
      });
    }

    qb.leftJoinAndSelect('meet.participants', 'participants').leftJoinAndSelect(
      'meet.initiator',
      'initiator',
    );

    if (filter.users) {
      const subQuery = this.meetRepository.manager
        .createQueryBuilder()
        .select('participants.meetId')
        .from('meet_participants', 'participants')
        .groupBy('participants.meetId')
        .having('array_agg(participants.userId) @> :participantsIds')
        .getQuery();

      qb.andWhere(`meet.id in (${subQuery})`, {
        participantsIds: filter.users,
      });
    }

    return (
      await qb
        .offset((filter.page - 1) * filter.perPage)
        .limit(filter.perPage)
        .orderBy('meet.meetAt')
        .getMany()
    ).map((meet) => {
      return {
        id: meet.id,
        theme: meet.theme,
        description: meet.description,
        initiator: meet.initiator,
        participants: meet.participants.map((participant) => {
          return {
            id: participant.id,
            firstName: participant.firstName,
            lastName: participant.lastName,
          };
        }),
        meetAt: moment.unix(meet.meetAt).format('YYYY-MM-DD HH:mm'),
        hash: meet.hash,
      };
    });
  }

  async reportDownload(filter: FilterDto, user: User) {
    const meets = await this.report(filter, user);

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Встречи');

    const headerStyle = workbook.createStyle({
      font: {
        bold: true,
      },
    });

    worksheet.column(1).setWidth(5);
    worksheet.column(2).setWidth(20);
    worksheet.column(3).setWidth(40);
    worksheet.column(4).setWidth(15);
    worksheet.column(5).setWidth(15);
    worksheet.column(6).setWidth(40);
    worksheet.column(7).setWidth(20);

    worksheet.cell(1, 1).string('ID').style(headerStyle);
    worksheet.cell(1, 2).string('Тема').style(headerStyle);
    worksheet.cell(1, 3).string('Описание').style(headerStyle);
    worksheet.cell(1, 4).string('Инициатор').style(headerStyle);
    worksheet.cell(1, 5).string('Дата и время').style(headerStyle);
    worksheet.cell(1, 6).string('Участники').style(headerStyle);
    worksheet.cell(1, 7).string('Хеш').style(headerStyle);

    meets.forEach((meet, i) => {
      worksheet.cell(i + 2, 1).number(meet.id);
      worksheet.cell(i + 2, 2).string(meet.theme);
      worksheet.cell(i + 2, 3).string(meet.description);
      worksheet
        .cell(i + 2, 4)
        .string(meet.initiator.firstName + ' ' + meet.initiator.lastName);
      worksheet
        .cell(i + 2, 5)
        .string(moment(meet.meetAt).format('DD.MM.YYYY H:mm'));
      worksheet
        .cell(i + 2, 6)
        .string(
          meet.participants
            .map((user) => user.firstName + ' ' + user.lastName)
            .join(', '),
        );
      worksheet.cell(i + 2, 7).string(meet.hash);
    });

    return workbook;
  }
}
