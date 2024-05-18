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

  async find(id: number): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ id: id });
  }
}
