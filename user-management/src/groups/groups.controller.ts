import { Controller, Param } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupDto } from 'src/dto/group.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserRole } from 'src/dto/user.dto';


@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

   //grupos 

   @MessagePattern({ cmd: 'get_all_groups' })
   async getAllGroups() {
     return this.groupsService.findAllGroups();
   }
 
   @MessagePattern({ cmd: 'get_group_by_id' })
   async getGroupById(id: string) {
     return this.groupsService.findGroupById(id);
   }
   
   @MessagePattern({ cmd: 'create_group' })
   async createGroup(group: GroupDto) {
     return this.groupsService.createGroup(group);
   } 
 
   @MessagePattern({ cmd: 'update_group' })
   async updateGroup(data: { id: string; group: GroupDto }) {
     const { id, group } = data;
     return this.groupsService.updateGroup(id, group);
   }
 
   @MessagePattern({ cmd: 'delete_group' })
   async deleteGroup(id: string) {
     return this.groupsService.removeGroup(id);
   }

   @MessagePattern({ cmd: 'add_user' })
   async addUserToGroup(@Payload() data: { userId: string; groupId: string; role: UserRole }) {
    return this.groupsService.addUserToGroup(data.userId, data.groupId, data.role );
   }

   @MessagePattern({ cmd: 'remove_user' })
   async removeUserFromGroup(userGroupId: string) {
     return this.groupsService.removeUserFromGroup(userGroupId);
   }

    @MessagePattern({ cmd: 'get_user_groups_by_user_id' })
    async getUserGroupsByUserId(@Payload() data: { userId: string, role?: string }) {
      return this.groupsService.findUserGroupsByUserId(data.userId, data.role);
    }
  
    @MessagePattern({ cmd: 'get_group_mentor' })
    async getGroupMentor(groupId: string) {
      return this.groupsService.findGroupMentor(groupId);
    }

}
