import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Path } from '../entities/path.entity';
import { PathDto } from '../dtos/path.dto';


@Injectable()
export class PathsService {
  constructor(
    @InjectRepository(Path)
    private readonly pathRepository: Repository<Path>,
  ) {}

  async findAll(): Promise<Path[]> {
    return this.pathRepository.find({ relations: ['activities'] });
  }

  async findById(id: string): Promise<Path> {
    const path = await this.pathRepository.findOne({ 
      where: { id },
      relations: ['activities'] 
    });
    
    if (!path) {
      throw new NotFoundException(`Path with ID ${id} not found`);
    }
    
    return path;
  }

  async findByUserId(userId: string): Promise<Path[]> {
    return this.pathRepository.find({
      where: { userId },
      relations: ['activities'],
    });
  }

  async create(createPathDto: PathDto): Promise<Path> {
    const path = this.pathRepository.create(createPathDto);
    return this.pathRepository.save(path);
  }

  async update(id: string, updatePathDto: PathDto): Promise<Path> {
    await this.findById(id);
    await this.pathRepository.update(id, updatePathDto);
    return this.findById(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.pathRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}