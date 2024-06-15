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
  Res,
  UseGuards,
} from '@nestjs/common';
import { MeetService } from './meet.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import MeetDto from './dto/meet.dto';
import { Request, Response } from 'express';
import ListDto from './dto/list.dto';
import FilterDto from './dto/filter.dto';

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

  @Get('report')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  report(@Query() filter: FilterDto, @Req() req: Request) {
    return this.meetService.report(filter, req['user']);
  }

  @Get('report-download')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async reportDownload(
    @Query() filter: FilterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const workbook = await this.meetService.reportDownload(filter, req['user']);
    workbook.writeToBuffer().then((buffer) => {
      res.end(Buffer.from(buffer).toString('base64'));
    });
  }
}
