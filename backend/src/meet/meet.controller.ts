import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
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
    return this.meetService.save(meetDto, req['user']);
  }

  @Put('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  update(@Body() meetDto: MeetDto, @Req() req: Request) {
    return this.meetService.save(meetDto, req['user']);
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

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  detail(@Query('id') id: number, @Req() req: Request) {
    return this.meetService.detail(id, req['user']);
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  cancel(@Body('id') id: number, @Req() req: Request) {
    return this.meetService.cancel(id, req['user']);
  }

  @Get('by-hash')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  getByHash(@Query('hash') hash: string) {
    return this.meetService.getByHash(hash);
  }
  @Post('add-participant')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  addParticipant(
    @Body('meetId') meetId: number,
    @Body('userId') userId: number,
    @Req() req: Request,
  ) {
    return this.meetService.addParticipant(meetId, userId, req['user']);
  }

  @Delete('delete-participant')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  deleteParticipant(
    @Body('meetId') meetId: number,
    @Body('userId') userId: number,
    @Req() req: Request,
  ) {
    return this.meetService.deleteParticipant(meetId, userId, req['user']);
  }
}
