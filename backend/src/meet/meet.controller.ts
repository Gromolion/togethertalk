import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MeetService } from './meet.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import MeetDto from './dto/meet.dto';
import { Request } from 'express';
import ListDto from './dto/list.dto';

@Controller('meet')
export class MeetController {
  constructor(private meetService: MeetService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  create(@Body() meetDto: MeetDto, @Req() req: Request) {
    return this.meetService.create(meetDto, req['user']);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  list(@Query() listDto: ListDto, @Req() req: Request) {
    return this.meetService.findAtDate(
      listDto.listAt,
      listDto.page,
      listDto.perPage,
      req['user'],
    );
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  cancel(@Body('id') id: number, @Req() req: Request) {
    return this.meetService.cancel(id, req['user']);
  }
}
