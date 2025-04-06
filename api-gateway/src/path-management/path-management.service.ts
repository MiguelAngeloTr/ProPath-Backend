import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable, firstValueFrom } from "rxjs";
import { PathDto, ActivitieDto } from "./dto/path.dto";
import { CommentDto } from "./dto/comment.dto";

@Injectable()
export class PathManagementService {
  constructor(
    @Inject('Path-Management-Service') private readonly client: ClientProxy
  ) {}

  // Path operations
  async getAllPaths(): Promise<PathDto[]> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_all_paths' }, {})
    );
  }

  async getPathById(id: string): Promise<PathDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_path_by_id' }, id)
    );
  }

  async getPathsByCoachInReview(coachId: string): Promise<PathDto[]> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_coach_paths_in_review' }, coachId)
    );
  }

  async createPath(path: PathDto): Promise<PathDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'create_path' }, path)
    );
  }

  async updatePath(id: string, path: PathDto): Promise<PathDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'update_path' }, { id, path })
    );
  }

  async sendPath(id: string): Promise<PathDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'send_path' }, id)
    );
  }

  async approvePath(id: string): Promise<PathDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'approve_path' }, id)
    );
  }

  async activatePath(id: string): Promise<PathDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'activate_path' }, id)
    );
  }

  async rejectPath(id: string): Promise<PathDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'reject_path' }, id)
    );
  }

  async deletePath(id: string): Promise<boolean> {
    return firstValueFrom(
      this.client.send({ cmd: 'delete_path' }, id)
    );
  }

  async getPathsByUserId(userId: string): Promise<PathDto[]> {
    return firstValueFrom(
      
      this.client.send({ cmd: 'get_user_paths' }, userId)
    );
  }

  // Activity operations
  async getAllActivities(): Promise<ActivitieDto[]> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_all_activities' }, {})
    );
  }

  async getActivityById(id: string): Promise<ActivitieDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_activity_by_id' }, id)
    );
  }

  async createActivity(activity: ActivitieDto): Promise<ActivitieDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'create_activity' }, activity)
    );
  }

  async updateActivity(id: string, activity: ActivitieDto): Promise<ActivitieDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'update_activity' }, { id, activity })
    );
  }

  async deleteActivity(id: string): Promise<boolean> {
    return firstValueFrom(
      this.client.send({ cmd: 'delete_activity' }, id)
    );
  }

  async getActivitiesByPath(pathId: string): Promise<ActivitieDto[]> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_activities_by_path' }, pathId)
    );
  }

  // Comment operations
 
  async createComment(comment: CommentDto): Promise<CommentDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'create_comment' }, comment)
    );
  }
}