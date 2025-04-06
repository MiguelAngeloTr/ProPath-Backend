import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
async function bootstrap() {
  const logger = new Logger('Path-Gateway');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true
  });
  await app.listen(envs.PORT);

  logger.log(`Path Gateway is running on port ${envs.PORT}`);




  
}
bootstrap();
