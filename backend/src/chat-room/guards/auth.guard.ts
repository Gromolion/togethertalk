import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import SocketWithUser from '../socketWithUser';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<SocketWithUser>();
    const token = this.extractTokenFromHandshake(client);

    if (!token) {
      client.disconnect();
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || '',
      });
      client.user = await this.userService.find(payload.userId);
    } catch {
      client.disconnect();
      throw new UnauthorizedException();
    }

    if (!client.user) {
      client.disconnect();
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHandshake(
    client: SocketWithUser,
  ): string | undefined {
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
