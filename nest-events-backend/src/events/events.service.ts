import { Injectable, Logger } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { EventEntity } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendeeAnswerEnum } from './attendees.entity';
import { ListEvents, WhenEventFilter } from './input/list-events';
import { paginate, PaginateOptions } from '../pagination/paginator';


@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(@InjectRepository(EventEntity) private readonly eventsRepository: Repository<EventEntity>) {
  }

  private getEventsBaseQuery() {
    return this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public getEventsWithAttendeeCountQuery() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted', 'e.attendees', 'attendee', (qb) => qb.where('attendee.answer = :answer', { answer: AttendeeAnswerEnum.Accepted }))
      .loadRelationCountAndMap(
        'e.attendeeMaybe', 'e.attendees', 'attendee', (qb) => qb.where('attendee.answer = :answer', { answer: AttendeeAnswerEnum.Maybe }))
      .loadRelationCountAndMap(
        'e.attendeeRejected', 'e.attendees', 'attendee', (qb) => qb.where('attendee.answer = :answer', { answer: AttendeeAnswerEnum.Rejected }));

  }

  public async getEvent(id: string): Promise<EventEntity | undefined> {
    const query = this.getEventsWithAttendeeCountQuery()
      .andWhere('e.id = :id', { id });

    this.logger.debug(query.getSql());

    return query.getOne();
  }

  private async getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
    let query = this.getEventsBaseQuery();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      if (filter.when == WhenEventFilter.Today) {
        query = query.andWhere(
          `e.date >= now() AND e.date <= now() + interval '1 day'`,
        );
      }
      if (filter.when == WhenEventFilter.Tomorrow) {
        query = query.andWhere(
          `e.date >= now() + interval '1 day' AND e.date <= now() + interval '2 day'`,
        );
      }

      if (filter.when == WhenEventFilter.ThisWeek) {
        query = query.andWhere(`date_part('week', e.date) = date_part('week', now())`);
      }

      if (filter.when == WhenEventFilter.NextWeek) {
        query = query.andWhere(`date_part('week', e.date) = date_part('week', now()) + 1`);
      }
    }
    return await query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions,
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      paginateOptions,
    );
  }

  public async deleteEvent(id: string): Promise<DeleteResult> {
    return await this.eventsRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}