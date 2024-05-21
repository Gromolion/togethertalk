import { Socket } from 'socket.io';
import { User } from 'src/entities/user.entity';

export default class SocketWithUser extends Socket {
  user: User;
}
