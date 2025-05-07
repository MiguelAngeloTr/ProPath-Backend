import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Path } from '../entities/path.entity';
import { UpdatePathDto,PathDto } from '../dtos/path.dto';


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
    const path = await this.pathRepository.find({
      where: { userId },
      relations: ['activities', 'activities.comments','comments'],
    });
    return {
      ...path
    };
  }
  
  async findByCoachIdAndStateM(coachId: string): Promise<Path[]> {
    return this.pathRepository.find({
      where: { 
        coachId: coachId,
        state: 'M' // Estado 'M' = Revisión mentor
      },
      relations: ['activities', 'comments'],
    });
  }

  async create(createPathDto: PathDto): Promise<Path> {
    const path = this.pathRepository.create(createPathDto);
    return this.pathRepository.save(path);
  }

  async update(id: string, updatePathDto: UpdatePathDto): Promise<Path> {
    await this.findById(id);
    await this.pathRepository.update(id, updatePathDto);
    return this.findById(id);
  }

  async calculateTotalHours(id: string): Promise<number> {
    const path = await this.findById(id);

    if (!path.activities || path.activities.length === 0) {
      return 0;
    }
    return path.activities.reduce((acc, activity) => acc + activity.hours, 0);
  }

  async calculateTotalBudget(id: string): Promise<number> {
    const path = await this.findById(id);

    if (!path.activities || path.activities.length === 0) {
      return 0;
    }

    return path.activities.reduce((acc, activity) => acc + activity.budget, 0);
  }

  async updateStatus(id: string, state: string): Promise<Path> {
    const path = await this.findById(id);
    path.state = state;
    await this.pathRepository.update(id, { state });
    return path;
  }

  async sendPath(id: string): Promise<Path> {
    const totalHours = await this.calculateTotalHours(id);
    
    if (totalHours !== 32) {
      throw new BadRequestException(`El path no cumple las 32 horas requeridas. Actual: ${totalHours} horas.`);
    }

    return this.updateStatus(id, 'M');
  }

  async approvePath(id: string): Promise<Path> {

    return this.updateStatus(id, 'A');
  }

  async activatePath(id: string): Promise<Path> {

    return this.updateStatus(id, 'E');
  }

  async rejectPath(id: string): Promise<Path> {
    return this.updateStatus(id, 'R');
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.pathRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
  async updatePathsCoach(userId: string, coachId: string): Promise<Path[]> {
    // Buscar todos los paths del usuario
    const paths = await this.pathRepository.find({
      where: { userId }
    });
    
    if (!paths || paths.length === 0) {
      throw new NotFoundException(`No se encontraron paths para el usuario con ID ${userId}`);
    }
    
    // Actualizar el coachId en todos los paths
    for (const path of paths) {
      path.coachId = coachId;
    }
    
    // Guardar los cambios
    return this.pathRepository.save(paths);
  }
}