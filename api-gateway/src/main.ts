import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Path-Gateway');
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
    
  app.enableCors({
    origin: true,
    credentials: true
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('ProPath API')
    .setDescription('Documentación de la API para la aplicación ProPath')
    .setVersion('1.0')
    .addTag('path-management/paths', 'Operaciones relacionadas con la gestión de paths')
    .addTag('path-management/activities', 'Operaciones relacionadas con actividades')
    .addTag('path-management/comments', 'Operaciones relacionadas con comentarios')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none', // none | list | full
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    }
  });
  
  await app.listen(envs.PORT);

  logger.log(`Path Gateway is running on port ${envs.PORT}`);
  logger.log(`Swagger documentation is available at http://localhost:${envs.PORT}/api/docs`);
}
bootstrap();
