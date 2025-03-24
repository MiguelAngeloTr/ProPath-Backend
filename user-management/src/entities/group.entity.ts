import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { UserGroup } from './user-group.entity';

@Entity({ name: 'groups' })
export class Group {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 300 })
  description: string;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroups: UserGroup[];
}
