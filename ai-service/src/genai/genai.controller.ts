import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GenAIService } from './genai.service';

@Controller()
export class GenAIController {
  constructor(private readonly genAIService: GenAIService) {}

  @MessagePattern({ cmd: 'recommend_path' })
  async recommendPath(currentPath: any) {
    return this.genAIService.generatePathRecommendation(currentPath);
  }
}