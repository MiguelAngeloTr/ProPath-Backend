import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PathsService } from './paths.service';
import { PathDto } from '../dtos/path.dto';

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

  @MessagePattern({ cmd: 'create_path' })
  async createPath(createPathDto: PathDto) {
    return this.pathsService.create(createPathDto);
  }

  @MessagePattern({ cmd: 'update_path' })
  async updatePath(data: { id: string; path: PathDto }) {
    const { id, path } = data;
    return this.pathsService.update(id, path);
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