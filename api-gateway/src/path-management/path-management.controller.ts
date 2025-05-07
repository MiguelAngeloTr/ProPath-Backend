import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus, Request, UseGuards } from "@nestjs/common";
import { PathManagementService } from "./path-management.service";
import { PathDto, ActivitieDto, UpdateActivityDto } from "./dto/path.dto";
import { CommentDto } from "./dto/comment.dto";
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('path-management')
@Controller('path-management')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PathManagementController {
  constructor(private readonly pathManagementService: PathManagementService) {}

  // ============================================================ //
  // ==================== Endpoints de Paths ==================== //
  // ============================================================ //

  // -------------------- Obtener paths del usuario autenticado -------------------- //

  @ApiTags('path-management/paths')
  @ApiOperation({
    summary: 'Obtener paths del usuario autenticado',
    description: 'Recupera todos los paths de aprendizaje asociadas al usuario actualmente autenticado.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de paths del usuario encontradas con éxito',
    type: [PathDto]
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron paths para el usuario especificado'
  })
  @Get('user/paths')
  async getPathsByUserId(@Request() req) {
    try {
      console.log(req.user);
      const userId = req.user.id;
      console.log(userId);
      return await this.pathManagementService.getPathsByUserId(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // -------------------- Actualizar paths con el mentor del grupo (Borrable, la use para hacer pruebas) -------------------- //

  @ApiTags('path-management/paths')
  @ApiOperation({
    summary: 'Actualizar mentor del path desde grupo',
    description: 'Actualiza el coachId de los paths de un usuario con el ID del mentor de su grupo'
  })
  @ApiParam({
    name: 'userId',
    description: 'Identificador único del usuario',
    example: '123456'
  })
  @ApiResponse({
    status: 200,
    description: 'Paths actualizados exitosamente con el mentor del grupo',
    type: [PathDto]
  })
  @ApiResponse({
    status: 400,
    description: 'Error al actualizar los paths con el mentor del grupo'
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado o no pertenece a ningún grupo con mentor'
  })
  @Put('paths/user/:userId/update-coach')
  async updatePathsCoachFromGroup(@Param('userId') userId: string) {
    try {
      return await this.pathManagementService.updatePathsCoachFromGroup(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // -------------------- Crear nuevo path de aprendizaje -------------------- //

  @ApiTags('path-management/paths')
  @ApiOperation({
   
    summary: 'Crear nuevo path de aprendizaje',
    description: 'Crea un nuevo path de aprendizaje para el usuario autenticado.'
  })
  @ApiBody({
    type: PathDto,
    description: 'Datos del path a crear',
    examples: {
      ejemplo: {
        value: {
          name: "Desarrollo Full Stack con React y Node.js",
          description: "Ruta de aprendizaje completa para aprender desarrollo web desde cero con React en el frontend y Node.js en el backend"
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Path creado exitosamente',
    type: PathDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos'
  })
  @Post('paths')
  async createPath(@Body() path: PathDto, @Request() req) {
    try {
      console.log(path);
      const userId = req.user.id;
      path = { ...path, userId };
      return await this.pathManagementService.createPath(path);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // -------------------- Obtener todos los paths -------------------- //

  @ApiTags('path-management/paths')
  @ApiOperation({
    summary: 'Obtener todos los paths',
    description: 'Recupera listado completo de todos los paths de aprendizaje disponibles.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de paths recuperada con éxito',
    type: [PathDto]
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor'
  })
  @Get('paths')
  async getAllPaths() {
    try {
      return await this.pathManagementService.getAllPaths();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // -------------------- Obtener un path por ID -------------------- //

  @ApiTags('path-management/paths')
  @ApiOperation({
    summary: 'Obtener path por ID',
    description: 'Recupera un path de aprendizaje específico según su identificador único.'
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del path',
    example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'
  })
  @ApiResponse({
    status: 200,
    description: 'Ruta encontrada con éxito',
    type: PathDto
  })
  @ApiResponse({
    status: 404,
    description: 'Ruta no encontrada'
  })
  @Get('paths/:id')
  async getPathById(@Param('id') id: string) {
    try {
      return await this.pathManagementService.getPathById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // -------------------- Obtener paths en revisión por coach/mentor -------------------- //
  
  @ApiTags('path-management/paths')
  @ApiOperation({
    summary: 'Obtener path en revisión por mentor',
    description: 'Recupera todos los paths que están en estado de revisión (M) para un mentor específico.'
  })
  @ApiParam({
    name: 'coachId',
    description: 'Identificador único del coach/mentor',
    example: '789012'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de paths en revisión encontrada con éxito',
    type: [PathDto]
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron paths en revisión para el mentor (coach) especificado'
  })
  @Get('paths/:coachId/paths-in-review')
  async getPathsByCoachInReview(@Param('coachId') coachId: string) {
    try {
      return await this.pathManagementService.getPathsByCoachInReview(coachId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // -------------------- Actualizar path de aprendizaje -------------------- //

  @ApiTags('path-management/paths')
  @ApiOperation({
    summary: 'Actualizar path existente',
    description: 'Actualiza los datos de una path de aprendizaje existente.'
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del path a actualizar',
    example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'
  })
  @ApiBody({
    type: PathDto,
    description: 'Datos actualizados de la path',
    examples: {
      ejemplo: {
        value: {
          name: "Desarrollo Full Stack Actualizado",
          description: "Descripción actualizada de la path de aprendizaje"
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Ruta actualizada exitosamente',
    type: PathDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({
    status: 404,
    description: 'Ruta no encontrada'
  })
  @Put('paths/:id')
  async updatePath(@Param('id') id: string, @Body() path: PathDto) {
    try {
      return await this.pathManagementService.updatePath(id, path);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // -------------------- Enviar path a revisión  -------------------- //

  @ApiTags('path-management/paths')
  @ApiOperation({
    summary: 'Enviar path a revisión',
    description: 'Envía un path para revisión al mentor, cambiando su estado a "M" (Revisión mentor). El path debe tener exactamente 32 horas en actividades.'
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único de la path',
    example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'
  })
  @ApiResponse({
    status: 200,
    description: 'Ruta enviada a revisión exitosamente',
    type: PathDto
  })
  @ApiResponse({
    status: 400,
    description: 'La path no cumple con las 32 horas requeridas'
  })
  @Put('paths/:id/send')
  async sendPath(@Param('id') id: string, @Request() req) {
    try {
      await this.pathManagementService.updatePathsCoachFromGroup(req.userId);
      return await this.pathManagementService.sendPath(id);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // -------------------- Aprobar path (Acción del Mentor) -------------------- //

  @ApiTags('path-management/paths')
  @ApiOperation({
    summary: 'Aprobar path',
    description: 'Aprueba un path de aprendizaje, cambiando su estado a "A" (Aprobado/Revisión admin).'
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del path',
    example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'
  })
  @ApiResponse({
    status: 200,
    description: 'Path aprobada exitosamente',
    type: PathDto
  })
  @ApiResponse({
    status: 400,
    description: 'Error al aprobar el path'
  })
  @Put('paths/:id/approve')
  async approvePath(@Param('id') id: string) {
    try {
      return await this.pathManagementService.approvePath(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // -------------------- Activar path (Acción del Admin) -------------------- //

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Administrador)
  @ApiTags('path-management/paths')
  @ApiOperation({
    summary: 'Activar path',
    description: 'Activa un path de aprendizaje aprobada, cambiando su estado a "E" (En curso).'
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del path',
    example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'
  })
  @ApiResponse({
    status: 200,
    description: 'Path activado exitosamente',
    type: PathDto
  })
  @ApiResponse({
    status: 400,
    description: 'Error al activar el path'
  })
  @Put('paths/:id/activate')
  async activatePath(@Param('id') id: string) {
    try {
      return await this.pathManagementService.activatePath(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // -------------------- Rechazar path (Acción del Mentor y/o el Admin) -------------------- //

  @ApiTags('path-management/paths')
  @ApiOperation({
    summary: 'Rechazar path',
    description: 'Rechaza un path de aprendizaje, cambiando su estado a "R" (Rechazado/Inicial).'
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del path',
    example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'
  })
  @ApiResponse({
    status: 200,
    description: 'Path rechazada exitosamente',
    type: PathDto
  })
  @ApiResponse({
    status: 400,
    description: 'Error al rechazar el path'
  })
  @Put('paths/:id/reject')
  async rejectPath(@Param('id') id: string) {
    try {
      return await this.pathManagementService.rejectPath(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // -------------------- Eliminar path de aprendizaje -------------------- //

  @ApiTags('path-management/paths')
  @ApiOperation({
    summary: 'Eliminar path',
    description: 'Elimina un path de aprendizaje y todas sus actividades asociadas.'
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del path a eliminar',
    example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'
  })
  @ApiResponse({
    status: 200,
    description: 'Path eliminad exitosamente',
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor'
  })
  @Delete('paths/:id')
  async deletePath(@Param('id') id: string) {
    try {
      return await this.pathManagementService.deletePath(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ================================================================== //  
  // ==================== Endpoints de Actividades ==================== //
  // ================================================================== //

  // -------------------- Obtener actividades del usuario autenticado -------------------- //

  @ApiTags('path-management/activities')
  @ApiOperation({
    summary: 'Obtener todas las actividades',
    description: 'Recupera listado completo de todas las actividades disponibles.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de actividades recuperada con éxito',
    type: [ActivitieDto]
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor'
  })
  @Get('activities')
  async getAllActivities() {
    try {
      return await this.pathManagementService.getAllActivities();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiTags('path-management/activities')
  @ApiOperation({
    summary: 'Obtener actividad por ID',
    description: 'Recupera una actividad específica según su identificador único.'
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único de la actividad',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
  })
  @ApiResponse({
    status: 200,
    description: 'Actividad encontrada con éxito',
    type: ActivitieDto
  })
  @ApiResponse({
    status: 404,
    description: 'Actividad no encontrada'
  })
  @Get('activities/:id')
  async getActivityById(@Param('id') id: string) {
    try {
      return await this.pathManagementService.getActivityById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @ApiTags('path-management/activities')
  @ApiOperation({
    summary: 'Crear nueva actividad',
    description: 'Crea una nueva actividad asociada a un path de aprendizaje.'
  })
  @ApiBody({
    type: ActivitieDto,
    description: 'Datos de la actividad a crear',
    examples: {
      ejemplo: {
        value: {
          name: "Curso de React.js",
          description: "Desarrollar el curso de React.js desde cero, cubriendo todos los aspectos fundamentales y avanzados.",
          hours: 8,
          initialDate: "2025-04-15T09:00:00.000Z",
          finalDate: "2025-04-20T18:00:00.000Z",
          budget: 100000,
          state: "P",
          pathId: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7"
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Actividad creada exitosamente',
    type: ActivitieDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos'
  })
  @Post('activity')
  async createActivity(@Body() activity: ActivitieDto) {
    try {
      return await this.pathManagementService.createActivity(activity);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiTags('path-management/activities')
  @ApiOperation({
    summary: 'Actualizar actividad existente',
    description: 'Actualiza los datos de una actividad existente.'
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único de la actividad a actualizar',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
  })
  @ApiBody({
    type: ActivitieDto,
    description: 'Datos actualizados de la actividad',
    examples: {
      ejemplo: {
        value: {
          name: "Desarrollo de página de inicio actualizada",
          description: "Descripción actualizada de la actividad",
          hours: 10,
          state: "E"
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Actividad actualizada exitosamente',
    type: ActivitieDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos'
  })
  @Put('activity/:id')
  async updateActivity(@Param('id') id: string, @Body() activity: UpdateActivityDto) {
    try {
      return await this.pathManagementService.updateActivity(id, activity);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiTags('path-management/activities')
  @ApiOperation({
    summary: 'Eliminar actividad',
    description: 'Elimina una actividad y sus comentarios asociados.'
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único de la actividad a eliminar',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
  })
  @ApiResponse({
    status: 200,
    description: 'Actividad eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor'
  })
  @Delete('activity/:id')
  async deleteActivity(@Param('id') id: string) {
    try {
      return await this.pathManagementService.deleteActivity(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiTags('path-management/activities')
  @ApiOperation({
    summary: 'Obtener actividades por path',
    description: 'Recupera todas las actividades asociadas a un path de aprendizaje específico.'
  })
  @ApiParam({
    name: 'pathId',
    description: 'Identificador único del path',
    example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de actividades del path encontradas con éxito',
    type: [ActivitieDto]
  })
  @ApiResponse({
    status: 404,
    description: 'Path no encontrada o sin actividades'
  })
  @Get('paths/:pathId/activities')
  async getActivitiesByPath(@Param('pathId') pathId: string) {
    try {
      return await this.pathManagementService.getActivitiesByPath(pathId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Comment endpoints
  @ApiTags('path-management/comments')
  @ApiOperation({
    summary: 'Crear nuevo comentario',
    description: 'Crea un nuevo comentario asociado a una actividad o a un path.'
  })
  @ApiBody({
    type: CommentDto,
    description: 'Datos del comentario a crear',
    examples: {
      comentarioActividad: {
        summary: 'Comentario en una actividad',
        value: {
          authorId: "123456",
          authorName: "Juan Pérez",
          message: "Este es un comentario sobre la actividad. Sugiero mejorar la definición de los objetivos.",
          activityId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
        }
      },
      comentarioRuta: {
        summary: 'Comentario en un path',
        value: {
          authorId: "123456",
          authorName: "Juan Pérez",
          message: "Este es un comentario sobre el path. La distribución de horas me parece adecuada.",
          pathId: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7"
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Comentario creado exitosamente',
    type: CommentDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos'
  })
  @Post('comments')
  async createComment(@Body() comment: CommentDto) {
    try {
      return await this.pathManagementService.createComment(comment);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}