import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import LoginUserResponseInterface from './response/loginUser.response.interface';
import { User } from 'src/entities/user.entity';
import LoginUserDto from './dto/loginUser.dto';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger('Auth');

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginUserDto): Promise<LoginUserResponseInterface> {
    this.logger.log(
      await hash(
        loginDto.password,
        parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS),
      ),
    );
    const user = await this.userService.findUser(loginDto.login);

    if (!user || !(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException();
    }

    return {
      user: user,
      token: await this.grantAccessToken(user),
      expiresIn: 18000,
    };
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
