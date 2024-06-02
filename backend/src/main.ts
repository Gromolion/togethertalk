import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressPeerServer } from 'peer';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const server = app.getHttpServer();
  const peerServer = ExpressPeerServer(server);

  peerServer.on('join-room', () => {
    console.log('join-room');
  });

  app.use('/peerjs', peerServer);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(3000);
}

bootstrap();
