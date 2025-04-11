import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ActivitiesService } from './activities.service';
import { UpdateActivityDto, ActivityDto } from '../dtos/activity.dto';

@Controller()
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @MessagePattern({ cmd: 'get_all_activities' })
  async getAllActivities() {
    return this.activitiesService.findAll();
  }

  @MessagePattern({ cmd: 'get_activity_by_id' })
  async getActivityById(id: string) {
    return this.activitiesService.findById(id);
  }

  @MessagePattern({ cmd: 'create_activity' })
  async createActivity(createActivityDto: ActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @MessagePattern({ cmd: 'update_activity' })
  async updateActivity(data: { id: string; activity: UpdateActivityDto }) {
    const { id, activity } = data;
    return this.activitiesService.update(id, activity);
  }

  @MessagePattern({ cmd: 'delete_activity' })
  async deleteActivity(id: string) {
    return this.activitiesService.remove(id);
  }

  @MessagePattern({ cmd: 'get_activities_by_path' })
  async getActivitiesByPath(pathId: string) {
    return this.activitiesService.findByPathId(pathId);
  }
}