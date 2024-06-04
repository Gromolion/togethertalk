import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import LoginUserResponseInterface from './response/loginUser.response.interface';
import { User } from 'src/entities/user.entity';
import LoginUserDto from './dto/loginUser.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginUserDto): Promise<LoginUserResponseInterface> {
    const user = await this.userService.findUser(loginDto.login);

    if (!user || !(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    return {
      user: user,
      token: await this.grantAccessToken(user),
      expiresIn: 18000,
    };
  }

  async resetPassword(login: string) {
    const user = await this.userService.findUser(login);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    user.resetPasswordHash = await hash(
      uuidv4(),
      parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS),
    );

    await this.userService.save(user);

    return user.resetPasswordHash;
  }

  async resetPasswordByHash(
    resetHash: string,
    password: string,
  ): Promise<true> {
    this.logger.log(resetHash);
    this.logger.log(password);
    const user = await this.userService.findByResetPasswordHash(resetHash);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    user.resetPasswordHash = null;
    user.password = await hash(
      password,
      parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS),
    );

    await this.userService.save(user);

    return true;
  }

  private async grantAccessToken(user: User) {
    return await this.jwtService.signAsync(
      {
        userId: user.id,
        login: user.login,
      },
      { secret: process.env.JWT_SECRET || '' },
    );
  }
}
