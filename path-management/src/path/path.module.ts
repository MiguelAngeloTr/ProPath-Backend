import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PathsController } from './path.controller';
import { PathsService } from './path.service';
import { Path } from '../entities/path.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Path])],
  controllers: [PathsController],
  providers: [PathsService],
  exports: [PathsService],
})
export class PathsModule {}