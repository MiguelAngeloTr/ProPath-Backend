import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { UserDto } from "./dto/users.dto";
import { GroupDto } from "./dto/groups.dto";

@Injectable()
export class UsersManagementService {
  constructor(
    @Inject('Users-Management-Service') private readonly client: ClientProxy
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_all_users' }, {})
    );
  }

  async getUserById(id: string): Promise<UserDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_user_by_id' }, id)
    );
  }

  async createUser(user: UserDto): Promise<UserDto> {
    console.log(user);
    return firstValueFrom(
      this.client.send({ cmd: 'create_user' }, user)
    );
  }

  async updateUser(id: string, user: UserDto): Promise<UserDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'update_user' }, { id, user })
    );
  }

  async deleteUser(id: string): Promise<boolean> {
    return firstValueFrom(
      this.client.send({ cmd: 'delete_user' }, id)
    );
  }

  async getUserGroupsByUserId(userId: string, role?: string): Promise<any> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_user_groups_by_user_id' }, { userId, role })
    );
  }

  async getGroupMentor(groupId: string): Promise<any> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_group_mentor' }, groupId)
    );
  }

  // Grupos

  async getAllGroups(): Promise<GroupDto[]> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_all_groups' }, {})
    );
  }

  async getGroupById(id: string): Promise<GroupDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_group_by_id' }, id)
    );
  }

  async createGroup(group: GroupDto): Promise<GroupDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'create_group' }, group)
    );
  }

  async updateGroup(id: string, group: GroupDto): Promise<GroupDto> {
    return firstValueFrom(
      this.client.send({ cmd: 'update_group' }, { id, group })
    );
  }

  async deleteGroup(id: string): Promise<boolean> {
    return firstValueFrom(
      this.client.send({ cmd: 'delete_group' }, id)
    );
  }

  async addUserToGroup(userId: string, groupId: string, role: string): Promise<any> {
    return firstValueFrom(
      this.client.send({ cmd: 'add_user' }, { userId, groupId, role }) // Se incluye 'role'
    );
  }

  async removeUserFromGroup(userGroupId: string): Promise<boolean> {
    return firstValueFrom(
      this.client.send({ cmd: 'remove_user' }, userGroupId)
    );
  }
  




}
