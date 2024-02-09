import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, NotFoundException,
  Param, ParseUUIDPipe,
  Patch,
  Post, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events')
export class EventsController {

  constructor(@InjectRepository(EventEntity) private readonly repository: Repository<EventEntity>) {
  }

  @Get('/get-all')
  async findAll() {
    return await this.repository.find();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<EventEntity> {
    try {
      const event = await this.repository.findOne({ where: { id } });
      if (!event) {
        throw new NotFoundException('Event not found');
      }
      return event;
    } catch (error) {
      throw new NotFoundException('Event not found');
    }
  }

  // you can use pipes (validators) locally and create groups and based on the groups you can create validation cases
  // you can see the create-event-dto.ts file to see what I mean.
  // @UsePipes(new ValidationPipe({ groups: ['create'] }))
  @Post()
  @HttpCode(201)
  async create(@Body() reqBody: CreateEventDto) {
    await this.repository.save({
      ...reqBody,
      date: new Date(reqBody.date),
    });
  }

  // you can use pipes (validators) locally and create groups and based on the groups you can create validation cases
  // you can see the create-event-dto.ts file to see what I mean.
  // @UsePipes(new ValidationPipe({ groups: ['update'] }))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOne({ where: { id } });
    return await this.repository.save({
      ...event,
      ...input,
      date: input.date ? new Date(input.date) : event.date,
    });
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const event = await this.repository.findOne({ where: { id } });
    await this.repository.remove(event);
  }
}
