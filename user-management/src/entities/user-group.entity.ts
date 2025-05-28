import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity({ name: 'user_groups' })
export class UserGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userGroups, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroups, { onDelete: 'CASCADE' })
  group: Group;

  @Column({ type: 'varchar', length: 50 })
  role: string;



}
