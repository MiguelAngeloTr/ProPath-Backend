import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Path } from '../entities/path.entity';
import { UpdatePathDto,PathDto } from '../dtos/path.dto';
import { Quartile } from '../entities/quartile.entity';



@Injectable()
export class PathsService {
  constructor(
    @InjectRepository(Path)
    private readonly pathRepository: Repository<Path>,
    @InjectRepository(Quartile)
    private readonly quartileRepository: Repository<Quartile>

  ) {}

  async findAll(): Promise<Path[]> {
    return this.pathRepository.find({ relations: ['activities', 'quartile'] });
  }

  async findById(id: string): Promise<Path> {
    const path = await this.pathRepository.findOne({ 
      where: { id },
      relations: ['activities','quartile'] 
    });
    
    if (!path) {
      throw new NotFoundException(`Path with ID ${id} not found`);
    }
    
    return path;
  }

  async findByUserId(userId: string): Promise<Path[]> {
    const path = await this.pathRepository.find({
      where: { userId },
      relations: ['activities', 'activities.comments','comments', 'quartile'],
    });
    return {
      ...path
    };
  }

  
  async findCoachPathsInReview(memberIds: string[]): Promise<Path[]> {
  return this.pathRepository.find({
    where: {
      state: 'M', // Paths in mentor review state
      userId: In(memberIds) // Only include paths created by users in the coach's group
    },
    relations: ['activities', 'activities.comments', 'comments', 'quartile']
  });
}

  async findByStateA(): Promise<Path[]> {
    return this.pathRepository.find({
      where: {
        state: 'A' // Estado 'A' = Revisión admin
      },
      relations: ['activities', 'comments','quartile'],
    });
  }

  async create(createPathDto: PathDto): Promise<Path> {
    const path = this.pathRepository.create(createPathDto);
    const quartile = await this.createQuartile();
    path.quartile = quartile; // Asignar el cuatrimestre al path
    return this.pathRepository.save(path);
  }

  async createQuartile(){
    const date = new Date();
    const month = date.getMonth(); // Los meses en JavaScript son 0-indexed (0-11)
    const year :number = new Date().getFullYear();

    const quartileNumber = Math.floor( month / 3) + 1; // 1, 2, 3 o 4
    let quartile: string = '';
    switch (quartileNumber) {
      case 1:
        quartile = 'Q1';
        break;
      case 2:
        quartile = 'Q2'; 
        break;
      case 3:
        quartile = 'Q3'; 
        break;
      case 4:
        quartile = 'Q4';
        break;
    
    }
    let quartileEntity = await this.quartileRepository.findOne({ where: { year, quartile } });
    if (!quartileEntity) {
      const newQuartile = this.quartileRepository.create({ year, quartile });
      quartileEntity = await this.quartileRepository.save(newQuartile);
    }

    return quartileEntity;
  }

  async update(id: string, updatePathDto: UpdatePathDto): Promise<Path> {
    await this.findById(id);
    console.log('updatePathDto', updatePathDto);
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
    await this.pathRepository.update(id, { state: state });
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

  // async updatePathsCoach(userId: string, coachId: string): Promise<Path[]> {
  //   // Buscar todos los paths del usuario
  //   const paths = await this.pathRepository.find({
  //     where: { userId }
  //   });
    
  //   if (!paths || paths.length === 0) {
  //     throw new NotFoundException(`No se encontraron paths para el usuario con ID ${userId}`);
  //   }
    
  //   // Actualizar el coachId en todos los paths
  //   for (const path of paths) {
  //     path.coachId = coachId;
  //   }

  //   await this.pathRepository.update(userId, { coachId });
    
  //   // Guardar los cambios
  //   return paths;
  // }
}