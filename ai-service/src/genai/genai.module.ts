import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GenAIController } from './genai.controller';
import { GenAIService } from './genai.service';

@Module({
  imports: [ConfigModule],
  controllers: [GenAIController],
  providers: [GenAIService],
})
export class GenAIModule {}