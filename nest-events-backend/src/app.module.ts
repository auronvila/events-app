import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'process';
import 'dotenv/config';
import { EventEntity } from './entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
      port: Number(process.env.DB_PORT) ? Number(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [EventEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([EventEntity]),
  ],
  controllers: [AppController, EventsController],
  providers: [AppService],
})
export class AppModule {
}
