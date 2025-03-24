import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { UserGroup } from './user-group.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'char', length: 2 })
  idType: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  email: string;

  @Column({ type: 'char', length: 1 })
  role: string;

  @Column({ type: 'varchar', length: 50 })
  country: string;

  @Column({ type: 'varchar', length: 50 })
  city: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  profilePictureUrl?: string;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
  userGroups: UserGroup[];
}
