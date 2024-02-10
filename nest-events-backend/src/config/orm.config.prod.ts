import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EventEntity } from '../events/event.entity';
import { registerAs } from '@nestjs/config';

export default registerAs('orm.config', (): TypeOrmModuleOptions => {
  const {
    DB_HOST = 'localhost',
    DB_PORT = 5432,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
  } = process.env;

  if (!DB_USERNAME || !DB_PASSWORD || !DB_NAME) {
    throw new Error('One or more required environment variables are missing for database connection.');
  }

  return {
    type: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [EventEntity],
    synchronize: false,
  };
});
