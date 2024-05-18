import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = this.extractTokenFromHandshake(client);

    if (!token) {
      client.disconnect();
      throw new UnauthorizedException();
    }

    try {
      if (
        !this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET || '',
        })
      ) {
        throw new UnauthorizedException();
      }
    } catch {
      client.disconnect();
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
