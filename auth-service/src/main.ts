import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config/envs';
import e from 'express';

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
  
  await app.listen();
  console.log('Auth service is listening on port 3002');
}
bootstrap();