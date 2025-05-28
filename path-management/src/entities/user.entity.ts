// import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { Path } from './path.entity';

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   idType: string;

//   @Column()
//   name: string;

//   @Column({ unique: true })
//   email: string;

//   @Column()
//   role: string;

//   @Column()
//   country: string;

//   @Column()
//   city: string;

//   @Column()
//   birthDate: string;

//   @Column({ nullable: true })
//   profilePictureUrl: string;

//   @OneToMany(() => Path, path => path.user)
//   paths: Path[];
// }
