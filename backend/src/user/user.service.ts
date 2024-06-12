import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

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
}
