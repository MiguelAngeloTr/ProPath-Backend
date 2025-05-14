import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable, firstValueFrom } from "rxjs";
import { PathDto, ActivitieDto, UpdateActivityDto } from "./dto/path.dto";
import { CommentDto } from "./dto/comment.dto";
import { UsersManagementService } from '../users-management/users-management.service';

@Injectable()
export class PathManagementService {
  constructor(
    @Inject('Path-Management-Service') private readonly client: ClientProxy,
    private readonly usersClient: UsersManagementService
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
    try {
      const coachGroups = await this.usersClient.getUserGroupsByUserId(coachId, 'M');
      
      if (!coachGroups || coachGroups.length === 0) {
        throw new Error('The coach is not a mentor in any group');
      }
      
      // 2. Extract professional user IDs directly from the userGroups array
      let groupMemberIds: string[] = [];
      
      for (const coachGroup of coachGroups) {
        const userGroups = coachGroup.group.userGroups;
        
        if (userGroups && userGroups.length > 0) {
          const professionalIds = userGroups
            .filter(userGroup => userGroup.role === 'P')
            .map(userGroup => userGroup.user.id);
          
          groupMemberIds = [...groupMemberIds, ...professionalIds];
        }
      }
      
      if (groupMemberIds.length === 0) {
        throw new Error('No professional members found in the groups mentored by this coach');
      }
      console.log('Group member IDs:', groupMemberIds);
      const pathsInReview = await firstValueFrom(
        this.client.send({ cmd: 'get_coach_paths_in_review' }, {
          memberIds: groupMemberIds
        })
      );
      
      return pathsInReview;
    } catch (error) {
      throw new Error(`Error fetching paths in review for coach: ${error.message}`);
    }
  }

  async getPathsAdminReview(): Promise<PathDto[]> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_admin_paths_in_review' }, {})
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

  async updateActivity(id: string, activity: UpdateActivityDto): Promise<ActivitieDto> {
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