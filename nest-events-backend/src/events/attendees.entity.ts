import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { EventEntity } from './event.entity';

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected,
}

@Entity({ name: 'attendee' })
export class AttendeesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Column()
  name: string;

  @ManyToOne(() => EventEntity, (event) => event.attendees)
  @JoinColumn()
  event: EventEntity;

  @Column('enum', { enum: AttendeeAnswerEnum, default: AttendeeAnswerEnum.Accepted })
  answer: AttendeeAnswerEnum;
}