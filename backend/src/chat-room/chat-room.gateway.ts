import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: '*:*', namespace: 'chat-room' })
export class ChatRoomGateway implements OnGatewayDisconnect {
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('join-room')
  async handleConnection(client: Socket, userId: string) {
    const chatRoomUUID: string =
      client.handshake.headers['chat-room-uuid']?.toString();

    client.join(`room_${chatRoomUUID}`);

    client.to(`room_${chatRoomUUID}`).emit(`user-connected`, userId, client.id);

    this.logger.log(`Client ${client.id} connected to ${chatRoomUUID}`);
  }

  async handleDisconnect(client: Socket) {
    const chatRoomUUID: string =
      client.handshake.headers['chat-room-uuid']?.toString();

    client.leave(`room_${chatRoomUUID}`);

    client.to(`room_${chatRoomUUID}`).emit(`user-disconnected`, client.id);

    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
