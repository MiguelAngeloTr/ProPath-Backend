import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import { ActivityDto } from '../dtos/activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
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
    const activity = this.activityRepository.create(activityDto);
    return this.activityRepository.save(activity);
  }

  async update(id: string, activityDto: ActivityDto): Promise<Activity> {
    await this.findById(id);
    await this.activityRepository.update(id, activityDto);
    return this.findById(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.activityRepository.delete(id);
    return result ? true : false;
  }
}