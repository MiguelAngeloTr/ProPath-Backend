import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Activity } from './activity.entity';
import { Path } from './path.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  authorId: string;

  @Column()
  authorName: string;

  @Column()
  message: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => Activity, activity => activity.comments, {
    onDelete: 'CASCADE',
    nullable: true
  })
  @JoinColumn()
  activity: Activity;

  @Column({ nullable: true })
  activityId: string;

  @ManyToOne(() => Path, path => path.comments, {
    onDelete: 'CASCADE',
    nullable: true
  })
  @JoinColumn()
  path: Path;

  @Column({ nullable: true })
  pathId: string;
}