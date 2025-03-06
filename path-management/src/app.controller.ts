import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SimpleEntity } from './entities/simple.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('test-db')
  async testDb(): Promise<string> {
    return this.appService.testDatabaseConnection();
  }
  
  @Post('create-entity')
  async createEntity(): Promise<SimpleEntity> {
    return this.appService.createSimpleEntity();
  }
  
  @Get('entities')
  async findAllEntities(): Promise<SimpleEntity[]> {
    return this.appService.findAllEntities();
  }
}