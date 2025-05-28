import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GenAIModule } from './genai/genai.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        GEMINI_API_KEY: Joi.string().required(),
        PORT: Joi.number().default(3004),
      }),
    }),
    GenAIModule,
  ],
})
export class AppModule {}