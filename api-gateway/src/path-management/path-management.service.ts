import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable, firstValueFrom } from "rxjs";
import { PathDto, ActivitieDto } from "./path.dto";

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

  // User operations
  // async getAllUsers(): Promise<UserDto[]> {
  //   return firstValueFrom(
  //     this.client.send({ cmd: 'get_all_users' }, {})
  //   );
  // }

  // async getUserById(id: number): Promise<UserDto> {
  //   return firstValueFrom(
  //     this.client.send({ cmd: 'get_user_by_id' }, id)
  //   );
  // }

  // async createUser(user: UserDto): Promise<UserDto> {
  //   console.log(user);
  //   return firstValueFrom(
  //     this.client.send({ cmd: 'create_user' }, user)
  //   );
  // }

  // async updateUser(id: number, user: UserDto): Promise<UserDto> {
  //   return firstValueFrom(
  //     this.client.send({ cmd: 'update_user' }, { id, user })
  //   );
  // }

  // async deleteUser(id: number): Promise<boolean> {
  //   return firstValueFrom(
  //     this.client.send({ cmd: 'delete_user' }, id)
  //   );
  // }

  // async getUserWithPaths(id: number): Promise<UserDto> {
  //   return firstValueFrom(
  //     this.client.send({ cmd: 'get_user_with_paths' }, id)
  //   );
  // }
}