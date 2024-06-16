import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import UserDto from './dto/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createOrUpdate(dto: UserDto, currentUser: User) {
    if (!currentUser.isAdmin && dto.id !== currentUser.id) {
      throw new BadRequestException('Доступ запрещен');
    }

    let user: User;

    if (
      !dto.id ||
      !(await this.usersRepository.exist({ where: { id: dto.id } }))
    ) {
      user = new User(
        dto.login,
        await hash(
          dto.password,
          parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS),
        ),
        dto.email,
        dto.firstName,
        dto.lastName,
        dto.position,
      );
    } else {
      user = await this.find(dto.id);
      user.login = dto.login;
      if (dto.password)
        user.password = await hash(
          dto.password,
          parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS),
        );
      user.email = dto.email;
      user.firstName = dto.firstName;
      user.lastName = dto.lastName;
      user.position = dto.position;
    }

    await this.save(user);
  }

  async delete(id: number, currentUser: User) {
    if (!currentUser.isAdmin) {
      throw new BadRequestException('Доступ запрещен');
    }

    const user = await this.find(id);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    await this.usersRepository.remove(user);
  }

  async list(page: number, perPage: number) {
    return {
      list: await this.usersRepository
        .createQueryBuilder('user')
        .offset((page - 1) * perPage)
        .limit(perPage)
        .orderBy('user.id', 'ASC')
        .getMany(),
      totalCount: await this.usersRepository.count(),
    };
  }

  async findUser(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ login: username });
  }

  async findByResetPasswordHash(hash: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ resetPasswordHash: hash });
  }

  async find(id: number): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ id: id });
  }

  async save(user: User) {
    await this.usersRepository.save(user);
  }

  findByQuery(query: string): Promise<User[]> {
    const qb = this.usersRepository.createQueryBuilder('user');

    const tokens = query.split(' ');

    for (let i = 0; i < tokens.length; i++) {
      if (!tokens[i]) continue;
      qb.andWhere(
        `user.firstName LIKE '%${tokens[i]}%' OR user.lastName LIKE '%${tokens[i]}%'`,
      );
    }

    return qb.getMany();
  }

  async setAvatar(id: number, avatar: Express.Multer.File, currentUser: User) {
    if (!currentUser.isAdmin && id !== currentUser.id) {
      throw new BadRequestException('Доступ запрещен');
    }

    const user = await this.find(id);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    user.avatar = avatar.buffer.toString('base64');

    await this.usersRepository.save(user);

    return user.avatar;
  }

  async removeAvatar(id: number, currentUser: User) {
    if (!currentUser.isAdmin && id !== currentUser.id) {
      throw new BadRequestException('Доступ запрещен');
    }

    const user = await this.find(id);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    user.avatar = null;

    await this.usersRepository.save(user);
  }
}
