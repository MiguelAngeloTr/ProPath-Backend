import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserGroup } from './user-group.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  documentId: string;

  @Column({ type: 'char', length: 2 })
  idType: string;

  @Column({ type: 'varchar'})
  name: string;

  @Column({ type: 'varchar'})
  email: string;

  @Column({ type: 'char', length: 1 })
  role: string;

  @Column({ type: 'varchar'})
  country: string;

  @Column({ type: 'varchar'})
  city: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'varchar', nullable: true })
  profilePictureUrl?: string;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
  userGroups: UserGroup[];
}
