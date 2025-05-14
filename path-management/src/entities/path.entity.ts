import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Activity } from './activity.entity';
import { Comment } from './comment.entity';
import { Quartile } from './quartile.entity';

@Entity()
export class Path {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ['R', 'M', 'A', 'E'],
    default: 'R' 
  })
  state: string;

  @OneToMany(() => Activity, activity => activity.path, {
    cascade: true
  })
  activities: Activity[];

  @OneToMany(() => Comment, comment => comment.path, {
    cascade: true
  })
  comments: Comment[];

  @ManyToOne(()=> Quartile, quartile => quartile.paths, {nullable: true})
  @JoinColumn()
  
  quartile: Quartile;
  @Column()
  userId: string;

  @Column({ nullable: true })
  coachId: string;
}