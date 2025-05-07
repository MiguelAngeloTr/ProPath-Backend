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

  async updatePathsCoachFromGroup(userId: string): Promise<PathDto[]> {
    try {
      // 1. Primero buscar grupos a los que pertenece el usuario con rol 'P'
      const userGroups = await this.usersClient.getUserGroupsByUserId(userId, 'P');
      console.log(userGroups[0])
      if (!userGroups || userGroups.length === 0) {
        throw new Error('El usuario no pertenece a ningún grupo con rol Profesional');
      }
      
      // 2. Para cada grupo, buscar al mentor (usuario con rol 'M')
      let mentorId = null;
      for (const userGroup of userGroups) {
        const groupWithMentor = await this.usersClient.getGroupMentor(userGroup.groupId);
        console.log(groupWithMentor)
        
        if (groupWithMentor && groupWithMentor.mentorId) {
          mentorId = groupWithMentor.mentorId;
          break; // Usar el primer mentor que encontremos
        }
      }
      
      if (!mentorId) {
        throw new Error('No se encontró mentor en ninguno de los grupos del usuario');
      }
      
      // 3. Actualizar todos los paths del usuario con el mentorId
      const updatedPaths = await firstValueFrom(
        this.client.send({ cmd: 'update_paths_coach' }, { userId, mentorId })
      );
      
      return updatedPaths;
    } catch (error) {
      throw new Error(`Error al actualizar el coach de los paths: ${error.message}`);
    }
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