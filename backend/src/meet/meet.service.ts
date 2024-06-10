import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Meet } from '../entities/meet.entity';
import MeetDto from './dto/meet.dto';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';
import MeetShort from './response/meetShort.response.interface';
import * as moment from 'moment-timezone';

@Injectable()
export class MeetService {
  constructor(
    @InjectRepository(Meet) private readonly meetRepository: Repository<Meet>,
  ) {}

  public async create(meetDto: MeetDto, initiator: User): Promise<MeetShort> {
    const meetHash = await hash(
      uuidv4(),
      parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS),
    );
    let meet = new Meet(
      meetDto.theme,
      meetDto.description,
      moment(meetDto.dateTime).unix(),
      initiator,
      meetHash,
    );

    meet.participants = [initiator];

    meet = await this.meetRepository.save(meet);

    return {
      id: meet.id,
      theme: meet.theme,
      initiator: meet.initiator,
      participantsCount: meet.participants.length,
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
      endDateTime: moment(listAt).endOf('day').subtract(15, 'minutes').unix(),
    });

    if (!user.isAdmin) {
      qb.leftJoinAndSelect('meet.participants', 'participants')
        .leftJoinAndSelect('meet.initiator', 'initiator')
        .andWhere(
          new Brackets((qb) =>
            qb
              .where('participants.id = :userId', { userId: user.id })
              .orWhere('initiator.id = :initiator', { initiator: user.id }),
          ),
        );
    }

    return (
      await qb
        .offset((page - 1) * perPage)
        .limit(perPage)
        .getMany()
    ).map((meet) => {
      return {
        id: meet.id,
        theme: meet.theme,
        initiator: meet.initiator,
        participantsCount: meet.participants?.length ?? 0,
        meetAt: moment.unix(meet.meetAt).format('YYYY-MM-DD HH:mm'),
        hash: meet.hash,
      };
    });
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
  }

  public async getByHash(hash: string) {
    const meet = await this.meetRepository.findOneBy({ hash: hash });

    if (!meet) return null;

    return {
      id: meet.id,
      theme: meet.theme,
      initiator: meet.initiator,
      participantsCount: meet.participants?.length ?? 0,
      meetAt: moment.unix(meet.meetAt).format('YYYY-MM-DD HH:mm'),
      hash: meet.hash,
    };
  }
}
