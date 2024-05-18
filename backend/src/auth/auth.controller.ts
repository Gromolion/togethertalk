import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
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
}
