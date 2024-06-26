import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../config/database.config';
import { DatabaseModule } from './database/database.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MeetModule } from './meet/meet.module';
import { InfoModule } from './info/info.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    DatabaseModule,
    ChatRoomModule,
    AuthModule,
    UserModule,
    MeetModule,
    AppModule,
    InfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
