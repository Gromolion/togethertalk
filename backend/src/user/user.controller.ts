import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserService } from './user.service';
import UserDto from './dto/user.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  private logger = new Logger();

  constructor(private userService: UserService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  createOrUpdate(@Body() user: UserDto, @Req() req: Request) {
    this.userService.createOrUpdate(user, req['user']);
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  delete(@Body('id') id: number, @Req() req: Request) {
    this.userService.delete(id, req['user']);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  list(@Query('page') page: number, @Query('perPage') perPage: number) {
    return this.userService.list(page, perPage);
  }

  @Post(':id/avatar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.userService.setAvatar(id, file, req['user']);
  }

  @Delete(':id/avatar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  removeAvatar(@Param('id') id: number, @Req() req: Request) {
    return this.userService.removeAvatar(id, req['user']);
  }
}
