import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, Logger, NotFoundException,
  Param, ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { EventEntity } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

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
      this.logger.error(`Error while fetching event with ID ${id}: ${error.message}`);
      throw error;
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
    if (!event) {
      throw new NotFoundException('Event not found');
    }
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
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    await this.repository.remove(event);
  }
}
