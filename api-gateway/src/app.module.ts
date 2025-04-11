import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PathManagementService } from './path-management/path-management.service';
import { PathManagementController } from './path-management/path-management.controller';
import { envs } from './config';
import { UsersManagementController } from './users-management/users-management.controller';
import { UsersManagementService } from './users-management/users-management.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AIController } from './genai/genai.controller';
import { AIService } from './genai/genai.service';
import { SmtpService } from './smtp/smtp.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'Path-Management-Service',
        transport: Transport.TCP,
        options: {
          host: envs.pathMicroserviceHost,
          port: envs.pathMicroservicePort
        }
      },
      {
        name: 'Users-Management-Service',
        transport: Transport.TCP,
        options: {
          host: envs.UserMicroserviceHost,
          port: envs.UserMicroservicePort
        }
      },
      {
        name: 'Auth-Service',
        transport: Transport.TCP,
        options: {
          host: envs.AuthMicroserviceHost,
          port: envs.AuthMicroservicePort
        }
      },
      {
        name: 'AI-Service',
        transport: Transport.TCP,
        options: {
          host: envs.AIMicroserviceHost,
          port: envs.AIMicroservicePort
        }
      },
      {
        name: 'SMTP-Service',
        transport: Transport.TCP,
        options: {
          host: envs.SMTPMicroserviceHost,
          port: envs.SMTPMicroservicePort
        }
      }
    ]),
  ],
  controllers: [PathManagementController, UsersManagementController, AuthController, AIController], 
  providers: [PathManagementService, UsersManagementService, AuthService, JwtService, AIService, SmtpService], 
})
export class AppModule {}