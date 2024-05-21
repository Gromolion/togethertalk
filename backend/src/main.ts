import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressPeerServer } from 'peer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const server = app.getHttpServer();
  const peerServer = ExpressPeerServer(server);

  app.use('/peerjs', peerServer);

  await app.listen(3000);
}

bootstrap();
