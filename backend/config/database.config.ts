import * as process from 'process';
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  postgres: {
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    synchronize: !!process.env.SYNCHRONIZE_ENTITIES,
  },
  mongo: {
    port: parseInt(process.env.MONGO_PORT) || 27017,
    host: process.env.MONGO_HOST,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
  },
}));
