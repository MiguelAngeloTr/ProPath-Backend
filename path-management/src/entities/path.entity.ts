import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Activity } from './activity.entity';
import { User } from './user.entity';

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

  @Column({ type: 'float' })
  totalHours: number;

  @Column({ type: 'float' })
  totalBudget: number;

  @OneToMany(() => Activity, activity => activity.path, {
    cascade: true
  })
  activities: Activity[];

  @ManyToOne(() => User, user => user.paths)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;
}
