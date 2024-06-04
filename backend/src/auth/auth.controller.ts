import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GuestGuard } from './guard/guest.guard';
import LoginUserDto from './dto/loginUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GuestGuard)
  login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GuestGuard)
  async resetPassword(@Body('login') login: string) {
    return {
      hash: await this.authService.resetPassword(login),
    };
  }

  @Post('reset-password-by-hash')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GuestGuard)
  async resetPasswordByHash(
    @Body('hash') hash: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPasswordByHash(hash, password);
  }
}
