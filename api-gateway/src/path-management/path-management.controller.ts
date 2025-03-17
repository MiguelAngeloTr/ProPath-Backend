import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from "@nestjs/common";
import { PathManagementService } from "./path-management.service";
import { PathDto, ActivitieDto } from "./path.dto";

@Controller('path-management')
export class PathManagementController {
  constructor(private readonly pathManagementService: PathManagementService) {}

  // Path endpoints
  @Get('paths')
  async getAllPaths() {
    try {
      return await this.pathManagementService.getAllPaths();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('paths/:id')
  async getPathById(@Param('id') id: string) {
    try {
      return await this.pathManagementService.getPathById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post('paths')
  async createPath(@Body() path: PathDto) {
    try {
      return await this.pathManagementService.createPath(path);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('paths/:id')
  async updatePath(@Param('id') id: string, @Body() path: PathDto) {
    try {
      return await this.pathManagementService.updatePath(id, path);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('paths/:id/send')
  async sendPath(@Param('id') id: string) {
    try {
      return await this.pathManagementService.sendPath(id);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('paths/:id/approve')
  async approvePath(@Param('id') id: string) {
    try {
      return await this.pathManagementService.approvePath(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('paths/:id/activate')
  async activatePath(@Param('id') id: string) {
    try {
      return await this.pathManagementService.activatePath(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('paths/:id/reject')
  async rejectPath(@Param('id') id: string) {
    try {
      return await this.pathManagementService.rejectPath(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('paths/:id')
  async deletePath(@Param('id') id: string) {
    try {
      return await this.pathManagementService.deletePath(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('users/:userId/paths')
  async getPathsByUserId(@Param('userId') userId: string) {
    try {
      return await this.pathManagementService.getPathsByUserId(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Activity endpoints
  @Get('activities')
  async getAllActivities() {
    try {
      return await this.pathManagementService.getAllActivities();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('activities/:id')
  async getActivityById(@Param('id') id: string) {
    try {
      return await this.pathManagementService.getActivityById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post('activities')
  async createActivity(@Body() activity: ActivitieDto) {
    try {
      return await this.pathManagementService.createActivity(activity);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('activities/:id')
  async updateActivity(@Param('id') id: string, @Body() activity: ActivitieDto) {
    try {
      return await this.pathManagementService.updateActivity(id, activity);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('activities/:id')
  async deleteActivity(@Param('id') id: string) {
    try {
      return await this.pathManagementService.deleteActivity(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('paths/:pathId/activities')
  async getActivitiesByPath(@Param('pathId') pathId: string) {
    try {
      return await this.pathManagementService.getActivitiesByPath(pathId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // User endpoints
  // @Get('users')
  // async getAllUsers() {
  //   try {
  //     return await this.pathManagementService.getAllUsers();
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // @Get('users/:id')
  // async getUserById(@Param('id') id: number) {
  //   try {
  //     return await this.pathManagementService.getUserById(id);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  //   }
  // }

  // @Post('users')
  // async createUser(@Body() user: UserDto) {
  //   console.log(user);
  //   try {
  //     return await this.pathManagementService.createUser(user);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // @Put('users/:id')
  // async updateUser(@Param('id') id: number, @Body() user: UserDto) {
  //   try {
  //     return await this.pathManagementService.updateUser(id, user);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // @Delete('users/:id')
  // async deleteUser(@Param('id') id: number) {
  //   try {
  //     return await this.pathManagementService.deleteUser(id);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // @Get('users/:id/with-paths')
  // async getUserWithPaths(@Param('id') id: number) {
  //   try {
  //     return await this.pathManagementService.getUserWithPaths(id);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  //   }
  // }
}