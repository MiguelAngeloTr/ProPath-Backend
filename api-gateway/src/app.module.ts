import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PathManagementService } from './path-management/path-management.service';
import { PathManagementController } from './path-management/path-management.controller';
import { envs } from './config';
import { UsersManagementController } from './users-management/users-management.controller';
import { UsersManagementService } from './users-management/users-management.service'; // <-- IMPORTAR EL SERVICIO

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
      }
    ]),
  ],
  controllers: [PathManagementController, UsersManagementController], 
  providers: [PathManagementService, UsersManagementService], 
})
export class AppModule {}
