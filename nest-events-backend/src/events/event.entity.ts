import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AttendeesEntity } from './attendees.entity';

@Entity('event')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  address: string;

  @OneToMany(() => AttendeesEntity, (attendee) => attendee.event)
  attendees: AttendeesEntity[];

  attendeeCount?: number;

  attendeeRejected?: number;

  attendeeMaybe?: number;

  attendeeAccepted?: number;
}
