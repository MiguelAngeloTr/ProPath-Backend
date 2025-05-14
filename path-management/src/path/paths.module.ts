import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PathsController } from './paths.controller';
import { PathsService } from './paths.service';
import { Path } from '../entities/path.entity';
import {Quartile} from '../entities/quartile.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Path, Quartile])],
  controllers: [PathsController],
  providers: [PathsService],
  exports: [PathsService],
})
export class PathsModule {}