import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupDto } from 'src/dto/group.dto';
import { UserRole } from 'src/dto/user.dto';
import { Group } from 'src/entities/group.entity';
import { UserGroup } from 'src/entities/user-group.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class GroupsService {

  constructor (
    @InjectRepository(Group)
     private readonly groupRepository: Repository<Group>,

     @InjectRepository(User)
    private readonly userRepository: Repository<User>,

     @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
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
  


  // Agregar un usuario a un grupo con rol
  async addUserToGroup(userId: string, groupId: string, role: string) {
    console.log('📌 Iniciando addUserToGroup con:', { userId, groupId, role });
  
    // Buscar el usuario
    const user = await this.userRepository.findOne({ where: { id: userId } });
    console.log('🔍 Usuario encontrado:', user);
  
    if (!user) throw new Error('Usuario no encontrado');
  
    // Buscar el grupo
    const group = await this.groupRepository.findOne({ where: { id: groupId } });
    console.log('🔍 Grupo encontrado:', group);
  
    if (!group) throw new Error('Grupo no encontrado');
  
    // Verificar si el usuario ya está en el grupo
    const existingUserGroup = await this.userGroupRepository.findOne({ 
      where: { user: { id: userId }, group: { id: groupId } }
    });
  
    if (existingUserGroup) {
      console.log('⚠️ El usuario ya pertenece al grupo.');
      throw new Error('El usuario ya está en el grupo');
    }
  
    // Si se intenta agregar un usuario con rol "M" (Mentor), verificar que no exista otro mentor
    if (role === "M") {
      const existingMentor = await this.userGroupRepository.findOne({
        where: { 
          group: { id: groupId },
          role: 'M'
        }
      });
  
      if (existingMentor) {
        console.log('⚠️ El grupo ya tiene un mentor asignado.');
        throw new Error('El grupo ya tiene un mentor asignado. Solo puede haber un mentor por grupo.');
      }
    }
  
    // Agregar usuario al grupo con el rol
    console.log('✅ Agregando usuario al grupo con rol:', role);
    await this.userGroupRepository.save({ user, group, role });
  
    console.log('🚀 Usuario agregado con éxito');
    return { status: 'success', message: 'Usuario agregado al grupo' };
  }

  

  
  
 

  
}
