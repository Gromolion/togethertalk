import * as process from 'process';
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  postgres: {
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: !!process.env.SYNCHRONIZE_ENTITIES,
  },
}));
