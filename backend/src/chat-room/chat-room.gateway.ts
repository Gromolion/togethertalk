import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { User } from '../entities/user.entity';
import SocketWithUser from './socketWithUser';

@WebSocketGateway({ cors: '*:*', namespace: 'chat-room' })
export class ChatRoomGateway implements OnGatewayDisconnect {
  private logger: Logger = new Logger('ChatGateway');

  @UseGuards(AuthGuard)
  @SubscribeMessage('join-room')
  async handleConnection(
    client: SocketWithUser & { user: User },
    peerId: string,
  ) {
    const chatRoomUUID: string = client.handshake.headers[
      'chat-room-uuid'
    ] as string;

    client.join(`room_${chatRoomUUID}`);

    client
      .to(`room_${chatRoomUUID}`)
      .emit(`user-connected`, client.user, peerId);

    this.logger.log(`Client ${client.id} connected to ${chatRoomUUID}`);
  }

  async handleDisconnect(client: Socket) {
    const chatRoomUUID: string =
      client.handshake.headers['chat-room-uuid']?.toString();

    client.leave(`room_${chatRoomUUID}`);

    client.to(`room_${chatRoomUUID}`).emit(`user-disconnected`, client.id);

    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('videoTrackChange')
  async handleVideoTrackChange(
    client: Socket,
    body: {
      socketId: string;
      enabled: boolean;
    },
  ) {
    const chatRoomUUID: string =
      client.handshake.headers['chat-room-uuid']?.toString();

    client.to(`room_${chatRoomUUID}`).emit(`videoTrackChanged`, body);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('audioTrackChange')
  async handleAudioTrackChange(
    client: Socket,
    body: {
      socketId: string;
      enabled: boolean;
    },
  ) {
    const chatRoomUUID: string =
      client.handshake.headers['chat-room-uuid']?.toString();

    client.to(`room_${chatRoomUUID}`).emit(`audioTrackChanged`, body);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('sendMessage')
  async handleNewMessage(
    client: Socket,
    body: {
      user: string;
      type: 'text' | 'file';
      content: string;
      time: string;
    },
  ) {
    const chatRoomUUID: string =
      client.handshake.headers['chat-room-uuid']?.toString();

    client.to(`room_${chatRoomUUID}`).emit(`newMessage`, body);
  }
}
