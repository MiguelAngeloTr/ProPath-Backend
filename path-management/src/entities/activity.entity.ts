import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Path } from './path.entity';
import { Comment } from './comment.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  hours: number;

  @Column({ type: 'timestamp' })
  initialDate: Date;

  @Column({ type: 'timestamp' })
  finalDate: Date;

  @Column({ type: 'float' })
  budget: number;

  @Column()
  state: string;

  @ManyToOne(() => Path, path => path.activities, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  path: Path;

  @Column()
  pathId: string;

  @OneToMany(() => Comment, comment => comment.activity, {
    cascade: true
  })
  comments: Comment[];
}