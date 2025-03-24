import { Controller } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupDto } from 'src/dto/group.dto';
import { MessagePattern } from '@nestjs/microservices';
import { Group } from 'src/entities/group.entity';


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
}
