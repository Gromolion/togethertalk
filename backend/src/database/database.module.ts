import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.postgres.host'),
        port: configService.get('database.postgres.port'),
        username: configService.get('database.postgres.user'),
        password: configService.get('database.postgres.password'),
        database: configService.get('database.postgres.database'),
        entities: ['./entities/*.entity.ts'],
        synchronize: configService.get('database.postgres.synchronize'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri:
          'mongodb://' +
          configService.get('database.mongo.user') +
          ':' +
          configService.get('database.mongo.password') +
          '@' +
          configService.get('database.mongo.host') +
          ':' +
          configService.get('database.mongo.port'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
