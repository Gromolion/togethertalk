import { Module } from '@nestjs/common';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { UserModule } from '../user/user.module';

@Module({
  providers: [InfoService],
  controllers: [InfoController],
  imports: [UserModule],
})
export class InfoModule {}
