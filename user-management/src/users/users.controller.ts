import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto} from '../dto/user.dto';
import { MessagePattern } from '@nestjs/microservices';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //usuarios

  @MessagePattern({ cmd: 'get_all_users' })
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(id: string) {
    return this.usersService.findUserById(id);
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(user: UserDto) {
    return this.usersService.createUser(user);
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(data: { id: string; user: UserDto }) {
    const { id, user } = data;
    return this.usersService.updateUser(id, user);
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(id: string) {
    return this.usersService.removeUser(id);
  }
 
}
