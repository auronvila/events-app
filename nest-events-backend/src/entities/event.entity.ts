import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({length:100})
  name: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  address: string;
}
