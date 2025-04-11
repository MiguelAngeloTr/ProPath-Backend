import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PathsService } from './paths.service';
import { UpdatePathDto, PathDto } from '../dtos/path.dto';

@Controller()
export class PathsController {
  constructor(private readonly pathsService: PathsService) {}

  @MessagePattern({ cmd: 'get_all_paths' })
  async getAllPaths() {
    return this.pathsService.findAll();
  }

  @MessagePattern({ cmd: 'get_path_by_id' })
  async getPathById(id: string) {
    return this.pathsService.findById(id);
  }

  @MessagePattern({ cmd: 'get_coach_paths_in_review' })
  async getCoachPathsInReview(coachId: string) {
    return this.pathsService.findByCoachIdAndStateM(coachId);
  }

  @MessagePattern({ cmd: 'create_path' })
  async createPath(createPathDto: PathDto) {
    return this.pathsService.create(createPathDto);
  }

  @MessagePattern({ cmd: 'update_path' })
  async updatePath(data: { id: string; path: UpdatePathDto }) {
    const { id, path } = data;
    return this.pathsService.update(id, path);
  }

  @MessagePattern({ cmd: 'send_path' })
  async sendPath(id: string) {
    return this.pathsService.sendPath(id);
  }

  @MessagePattern({ cmd: 'approve_path' })
  async approvePath(id: string) {
    return this.pathsService.approvePath(id);
  }

  @MessagePattern({ cmd: 'activate_path' })
  async activatePath(id: string) {
    return this.pathsService.activatePath(id);
  }

  @MessagePattern({ cmd: 'reject_path' })
  async rejectPath(id: string) {
    return this.pathsService.rejectPath(id);
  }

  @MessagePattern({ cmd: 'delete_path' })
  async deletePath(id: string) {
    return this.pathsService.remove(id);
  }

  @MessagePattern({ cmd: 'get_user_paths' })
  async getUserPaths(userId: string) {
    return this.pathsService.findByUserId(userId);
  }
}