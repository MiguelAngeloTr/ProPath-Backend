import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupDto } from 'src/dto/group.dto';
import { Group } from 'src/entities/group.entity';
import { Repository } from 'typeorm';


@Injectable()
export class GroupsService {

  constructor (
    @InjectRepository(Group)
     private readonly groupRepository: Repository<Group>
  ) {}
  

  //Encontrar todos los grupos y sus usuarios
  async findAllGroups(): Promise<Group[]> {
    return this.groupRepository.find({ relations: ['userGroups','userGroups.user'] });
  }

  //Encontrar grupos por Id

  async findGroupById(id: string):Promise<Group> {
    const group = await this.groupRepository.findOne({
      where:{id},
      relations:['userGroups','userGroups.user']
    });
    if(!group){
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group ;
  }
 //Crear grupo 
  async createGroup(CreateGroupDto: GroupDto): Promise<Group>{
    const group = this.groupRepository.create(CreateGroupDto);
    return this.groupRepository.save(group); 
  }

  async updateGroup(id: string, updateGroupDto: GroupDto):Promise<Group> {
     await this.findGroupById(id)
     await this.groupRepository.update(id, updateGroupDto)
    return this.findGroupById(id);
  }

  async removeGroup(id: string): Promise<Group> {
    const group = await this.findGroupById(id);
    await this.groupRepository.delete(id);
    return group;
  }
  
 

  
}
