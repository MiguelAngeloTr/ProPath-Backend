import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    
    {
      transport: Transport.TCP,
      options: {
        host: envs.HOST,
        port: envs.PORT 
        
      }
    }
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true}));
  await app.listen();
  console.log('user management microservice is listening on', envs.PORT);
  
}
bootstrap();
