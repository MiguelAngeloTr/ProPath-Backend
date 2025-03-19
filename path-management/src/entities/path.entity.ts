import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Activity } from './activity.entity';
import { Comment } from './comment.entity';

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

  @OneToMany(() => Comment, comment => comment.path, {
    cascade: true
  })
  comments: Comment[];

  @Column()
  userId: string;

  @Column({ nullable: true })
  coachId: string;
}