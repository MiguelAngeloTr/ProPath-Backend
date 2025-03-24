import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Put } from '@nestjs/common';
import { UsersManagementService } from './users-management.service';
import { UserDto } from './dto/users.dto';
import { GroupDto } from './dto/groups.dto';

@Controller('users-management')
export class UsersManagementController {
  constructor(private readonly usersManagementService: UsersManagementService) {}

  @Get('users')
  async getAllUsers() {
    try {
      return await this.usersManagementService.getAllUsers();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    try {
      return await this.usersManagementService.getUserById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post('users')
  async createUser(@Body() user: UserDto) {
    console.log(user);
    try {
      return await this.usersManagementService.createUser(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() user: UserDto) {
    try {
      return await this.usersManagementService.updateUser(id, user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.usersManagementService.deleteUser(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('groups')
  async getAllGroups() {
    try {
      return await this.usersManagementService.getAllGroups();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('groups/:id')
  async getGroupById(@Param('id') id: string) {
    try {
      return await this.usersManagementService.getGroupById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post('groups')
  async createGroup(@Body() group: GroupDto) {
    try {
      return await this.usersManagementService.createGroup(group);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('groups/:id')
  async updateGroup(@Param('id') id: string, @Body() group: GroupDto) {
    try {
      return await this.usersManagementService.updateGroup(id, group);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('groups/:id')
  async deleteGroup(@Param('id') id: string) {
    try {
      return await this.usersManagementService.deleteGroup(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  
}
