import { Entity, PrimaryColumn, OneToMany} from 'typeorm';
import { Path } from './path.entity';

@Entity()
export class Quartile{
    @PrimaryColumn()
    year: number;
    @PrimaryColumn()
    quartile: string;

    @OneToMany(() => Path, path => path.quartile)
    paths: Path[];
}