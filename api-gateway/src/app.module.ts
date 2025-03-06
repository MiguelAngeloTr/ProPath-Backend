import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { PathManagementService } from './path-management/path-management.service';
import { PathManagementController } from './path-management/path-management.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'Path-Management-Service',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001
        }
      }
    ])
  ],
  controllers: [PathManagementController],
  providers: [PathManagementService],
})
export class AppModule {}
