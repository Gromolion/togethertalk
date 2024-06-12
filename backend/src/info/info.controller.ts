import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { InfoService } from './info.service';

@Controller('info')
export class InfoController {
  constructor(private infoService: InfoService) {}

  @Get('autocomplete')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  autocomplete(@Query('query') query: string, @Query('type') type: string) {
    return this.infoService.autocomplete(query, type);
  }
}
