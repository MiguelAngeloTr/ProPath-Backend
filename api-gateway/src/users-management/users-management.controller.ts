
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Put, UseGuards } from '@nestjs/common';
import { UsersManagementService } from './users-management.service';
import { UserDto } from './dto/users.dto';
import { GroupDto, AddUser } from './dto/groups.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserResponseDto } from './dto/user-response.dto';


@UseGuards(JwtAuthGuard)
@ApiTags('users-management')
@Controller('users-management')
export class UsersManagementController {
  constructor(private readonly usersManagementService: UsersManagementService) {}



  @Get('users')
  @ApiOperation({ summary: 'Obtener todos los usuarios', description: 'Devuelve la lista de todos los usuarios con sus grupos asociados.' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    type: UserResponseDto,
    isArray: true,
    schema: {
      example: [
        {
          id: '680532aa-6a71-432e-a2ba-5a98c40a9dc8',
          documentId: '134122',
          idType: 'CC',
          name: 'simon',
          email: 'simon.colonia@uao.edu.co',
          role: 'A',
          country: 'Colombia',
          city: 'Cali',
          birthDate: '2025-04-04',
          profilePictureUrl: null,
          userGroups: [
            {
              id: '92438071-2850-4685-9d60-9b422f73a727',
              group: {
                id: 'GRP001',
                name: 'FrontEnd',
                description: 'jajajajaja no es BackEnd'
              },
              role: 'P'
            }
          ]
        },
        {
          id: 'd383dc7a-66a5-41a9-9bc2-4efa7c5c3a33',
          documentId: '123412',
          idType: 'CC',
          name: 'Simonski',
          email: 'simonski@uao.edu.co',
          role: 'P',
          country: 'Colombia',
          city: 'Bogotá',
          birthDate: '2025-02-06',
          profilePictureUrl: null,
          userGroups: [
            {
              id: '30e11278-fe8a-45b4-a858-c6228bade150',
              group: {
                id: 'GRP001',
                name: 'FrontEnd',
                description: 'jajajajaja no es BackEnd'
              },
              role: 'P'
            }
          ]
        },
        {
          id: 'ed57cd6e-2ba2-453b-b8e6-963c988f4d8f',
          documentId: '1234567890',
          idType: 'CC',
          name: 'cuelloo',
          email: 'juancuellloo@awdad.com',
          role: 'A',
          country: 'Colombia',
          city: 'Cali',
          birthDate: '2004-02-28',
          profilePictureUrl: null,
          userGroups: []
        }
      ]
    }
  })
  async getAllUsers() {
    try {
      return await this.usersManagementService.getAllUsers();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get('users/:id')
  @ApiOperation({ summary: 'Obtener usuario por ID', description: 'Devuelve la información de un usuario específico, incluyendo sus grupos.' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: UserResponseDto, schema: { example: {
    id: 'a1b2c3d4-5678-1234-9abc-def012345678',
    idType: 'CC',
    name: 'Juan Perez',
    email: 'juan.perez@email.com',
    role: 'P',
    country: 'Colombia',
    city: 'Bogotá',
    birthDate: '1990-01-01',
    profilePictureUrl: 'https://example.com/profile.jpg',
    userGroups: [
      {
        id: 'b1e2c3d4-5678-1234-9abc-def012345678',
        role: 'mentor',
        groupId: 'a1b2c3d4-5678-1234-9abc-def012345678',
      }
    ]
  } } })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserById(@Param('id') id: string) {
    try {
      return await this.usersManagementService.getUserById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  

  @Delete('users/:id')
  @ApiOperation({ summary: 'Eliminar usuario', description: 'Elimina un usuario por su ID.' })
  @ApiParam({ name: 'id', description: 'ID del usuario a eliminar' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado', schema: { example: true } })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.usersManagementService.deleteUser(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('groups')
  @ApiOperation({ summary: 'Obtener todos los grupos', description: 'Devuelve la lista de todos los grupos con sus usuarios asociados.' })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos',
    isArray: true,
    schema: {
      example: [
        {
          id: 'd8294b78-dbe0-413a-917e-760bcb410066',
          name: 'BackEnd',
          description: 'BackEnd',
          userGroups: [
            {
              id: '31065dc6-1f8c-4f35-a188-ca65b54965c6',
              user: {
                id: '680532aa-6a71-432e-a2ba-5a98c40a9dc8',
                documentId: '134122',
                idType: 'CC',
                name: 'simon',
                email: 'simon.colonia@uao.edu.co',
                role: 'A',
                country: 'Colombia',
                city: 'Cali',
                birthDate: '2025-04-04',
                profilePictureUrl: null
              },
              role: 'P'
            }
          ]
        },
        {
          id: '18a149bd-0e90-4134-a2c3-d0867f9450ed',
          name: 'BackEnd',
          description: 'BackEnd',
          userGroups: []
        }
      ]
    }
  })
  async getAllGroups() {
    try {
      return await this.usersManagementService.getAllGroups();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('group/:id')
  @ApiOperation({ summary: 'Obtener grupo por ID', description: 'Devuelve la información de un grupo específico, incluyendo sus usuarios.' })
  @ApiParam({ name: 'id', description: 'ID del grupo' })
  @ApiResponse({
    status: 200,
    description: 'Grupo encontrado',
    schema: {
      example: {
        id: 'd8294b78-dbe0-413a-917e-760bcb410066',
        name: 'BackEnd',
        description: 'BackEnd',
        userGroups: [
          {
            id: '31065dc6-1f8c-4f35-a188-ca65b54965c6',
            user: {
              id: '680532aa-6a71-432e-a2ba-5a98c40a9dc8',
              documentId: '134122',
              idType: 'CC',
              name: 'simon',
              email: 'simon.colonia@uao.edu.co',
              role: 'A',
              country: 'Colombia',
              city: 'Cali',
              birthDate: '2025-04-04',
              profilePictureUrl: null
            },
            role: 'P'
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
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
