import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserService } from './user.service';
import UserDto from './dto/user.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  create(@Body() user: UserDto, @Req() req: Request) {
    this.userService.createOrUpdate(user, req['user']);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  list(@Query('page') page: number, @Query('perPage') perPage: number) {
    return this.userService.list(page, perPage);
  }
}
