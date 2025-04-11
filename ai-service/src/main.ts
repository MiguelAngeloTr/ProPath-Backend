import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import {envs} from './config/';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: envs.HOST,
        port: envs.PORT,
      },
    },
  );
  
  const logger = new Logger('AI-Service');
  
  await app.listen();
  logger.log('AI service microservice is listening on port 3004');
}
bootstrap();