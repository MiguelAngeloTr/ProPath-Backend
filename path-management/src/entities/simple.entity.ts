import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SimpleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;
}