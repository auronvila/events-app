import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';

@Controller('/events')
export class EventsController {
  private events: EventEntity[] = [];

  @Get('/get-all')
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id) {
    const event = this.events.find((event) => event.id === parseInt(id));
    return event;
  }

  @Post()
  create(@Body() reqBody: CreateEventDto) {
    const event = {
      ...reqBody,
      date: new Date(reqBody.date),
      id: this.events.length + 1,
    };
    this.events.push(event);
    return event;
  }

  @Patch(':id')
  update(@Param('id') id, @Body() input: UpdateEventDto) {
    const index = this.events.findIndex((event) => event.id === parseInt(id));
    this.events[index] = {
      ...this.events[index],
      ...input,
      date: input.date ? new Date(input.date) : this.events[index].date,
    };
    return this.events[index];
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id) {
    this.events.filter((event) => event.id !== parseInt(id));
  }
}
