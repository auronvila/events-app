import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, Logger, NotFoundException,
  Param, ParseUUIDPipe,
  Patch,
  Post,
  Query, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { EventEntity } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { ListEvents } from './input/list-events';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(EventEntity) private readonly repository: Repository<EventEntity>,
    private readonly eventsService: EventsService,
  ) {
  }

  @Get('/get-all')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    return await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(filter, {
      total: true,
      currentPage: filter.page,
      limit: 5,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<EventEntity> {
    try {
      const event = await this.eventsService.getEvent(id);
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
    const result = await this.eventsService.deleteEvent(id);

    if (result.affected !== 1) {
      throw new NotFoundException();
    }
  }
}
