import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('SMTP-Microservice');
  
  // Create HTTP app for health checks

  // Create microservice for internal communication
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
  
  await app.listen();
  
  logger.log(`HTTP server running on port ${envs.PORT}`);
}
bootstrap();
