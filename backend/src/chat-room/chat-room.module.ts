import { Module } from '@nestjs/common';
import { ChatRoomGateway } from './chat-room.gateway';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [ChatRoomGateway],
})
export class ChatRoomModule {}
