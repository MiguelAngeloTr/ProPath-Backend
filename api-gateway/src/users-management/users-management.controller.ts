import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Put, UseGuards } from '@nestjs/common';
import { UsersManagementService } from './users-management.service';
import { UserDto } from './dto/users.dto';
import { GroupDto, AddUser } from './dto/groups.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";


@UseGuards(JwtAuthGuard)
@ApiTags('users-management')
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

  @Get('group/:id')
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

  @Post('groups/add-user')
  async addUserToGroup(@Body() userGroup: AddUser ) {
    return this.usersManagementService.addUserToGroup(userGroup.userId, userGroup.groupId, userGroup.role);
  }

  @Delete('groups/remove-user/:userGroupId')
  async removeUserFromGroup(@Param('userGroupId') userGroupId: string) {
    try {
      return await this.usersManagementService.removeUserFromGroup(userGroupId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  
  

  
}
