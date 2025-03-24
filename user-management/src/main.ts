import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    
    {
      transport: Transport.TCP,
      options: {
        port: envs.PORT 
        
      }
    }
  );

  await app.listen();
  console.log('user management microservice is listening on', envs.PORT);
  
}
bootstrap();
