import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Activity } from './activity.entity';

@Entity()
export class Path {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  state: string;

  @OneToMany(() => Activity, activity => activity.path, {
    cascade: true
  })
  activities: Activity[];

  @Column()
  userId: string;

  @Column({ nullable: true })
  coachId: string;
}