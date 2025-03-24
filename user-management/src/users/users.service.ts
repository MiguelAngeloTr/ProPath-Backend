import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { group } from 'console';

//import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  //Encontrar todos los usuarios y sus grupos
  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['userGroups','userGroups.user'] });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where:{id},
      relations: ['userGroups','userGroups.user']
    })

    if(!user){
      throw new NotFoundException()
    }
    return user;
  }

    async createUser(CreateUserDto: UserDto): Promise<User>{
      const group = this.userRepository.create(CreateUserDto);
      return this.userRepository.save(group); 
    }
  
    async updateUser(id: string, updateGroupDto: UserDto):Promise<User> {
       await this.findUserById(id)
       await this.userRepository.update(id, updateGroupDto)
      return this.findUserById(id);
    }
  
    async removeUser(id: string): Promise<User> {
      const user = await this.findUserById(id);
      await this.userRepository.delete(id);
      return user;
    }
}

