import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import { UpdateActivityDto, ActivityDto } from '../dtos/activity.dto';
import { PathsService } from '../path/paths.service';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private readonly pathsService: PathsService,
  ) {}

  async findAll(): Promise<Activity[]> {
    return this.activityRepository.find();
  }

  async findById(id: string): Promise<Activity> {
    const activity = await this.activityRepository.findOne({ 
      where: { id } 
    });
    
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    
    return activity;
  }

  async findByPathId(pathId: string): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { pathId },
    });
  }

  async create(activityDto: ActivityDto): Promise<Activity> {
    const currentHours = await this.pathsService.calculateTotalHours(activityDto.pathId);
    
    const totalHoursAfterAddition = currentHours + activityDto.hours;
    
    if (totalHoursAfterAddition > 32) {
      throw new BadRequestException(
        `La actividad no puede ser agregada. El path superaría el límite de 32 horas. ` +
        `Horas actuales: ${currentHours}, Horas de la nueva actividad: ${activityDto.hours}, ` +
        `Total: ${totalHoursAfterAddition}`
      );
    }
    
    const activity = this.activityRepository.create(activityDto);
    return this.activityRepository.save(activity);
  }

  async update(id: string, activityDto: UpdateActivityDto): Promise<Activity> {
    const existingActivity = await this.findById(id);
    
    // Solo extraer propiedades válidas de UpdateActivityDto
    const validFields = ['name', 'description', 'hours', 'initialDate', 'finalDate', 'budget'];
    const filteredDto: Partial<UpdateActivityDto> = Object.keys(activityDto)
      .filter(key => validFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = activityDto[key];
        return obj;
      }, {} as Partial<UpdateActivityDto>);
    
    // Realizar la validación de horas solo si ese campo está presente
    if (filteredDto.hours !== undefined) {
      const pathId = existingActivity.pathId;
      const currentHours = await this.pathsService.calculateTotalHours(pathId);
      const hoursWithoutThisActivity = currentHours - existingActivity.hours;
      const totalHoursAfterUpdate = hoursWithoutThisActivity + filteredDto.hours;
  
      if (totalHoursAfterUpdate > 32) {
        throw new BadRequestException(
          `La actividad no puede ser actualizada. El path superaría el límite de 32 horas. ` +
          `Horas actuales (sin esta actividad): ${hoursWithoutThisActivity}, ` +
          `Horas deseadas: ${filteredDto.hours}, Total: ${totalHoursAfterUpdate}`
        );
      }
    }
    
    await this.activityRepository.update(id, filteredDto);
    return this.findById(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.activityRepository.delete(id);
    return result ? true : false;
  }
}