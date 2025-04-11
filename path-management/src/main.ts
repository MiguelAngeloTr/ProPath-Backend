import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { env } from 'process';

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
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false, // Cambia a false para permitir propiedades extra
      transformOptions: {
        enableImplicitConversion: true // Ayuda con la conversión automática de tipos
      }
    }),
  );
  
  await app.listen();
  console.log('Path management microservice is listening on port 3001');
}
bootstrap();