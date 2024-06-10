import { Module } from '@nestjs/common';
import { MeetService } from './meet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meet } from '../entities/meet.entity';
import { MeetController } from './meet.controller';
import { UserModule } from '../user/user.module';

@Module({
  providers: [MeetService],
  imports: [TypeOrmModule.forFeature([Meet]), UserModule],
  controllers: [MeetController],
})
export class MeetModule {}
