import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AIService } from './genai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('genai')
@Controller('genai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @ApiOperation({
    summary: 'Recomendar path de aprendizaje',
    description: 'Genera recomendaciones para un path de aprendizaje basado en el path actual del usuario'
  })
  @ApiBody({
    description: 'Path actual del usuario',
    type: Object
  })
  @ApiResponse({
    status: 200,
    description: 'Path recomendado generado con éxito',
    type: Object
  })
  @Post('recommend-path')
  async recommendPath(@Body() currentPath: any) {
    return this.aiService.recommendPath(currentPath);
  }
}