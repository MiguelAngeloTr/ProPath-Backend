import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SimpleEntity } from './entities/simple.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(SimpleEntity)
    private simpleEntityRepository: Repository<SimpleEntity>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testDatabaseConnection(): Promise<string> {
    try {
      // Intentar realizar una operación básica en la base de datos
      await this.simpleEntityRepository.find();
      return 'Conexión a la base de datos exitosa!';
    } catch (error) {
      return `Error al conectar a la base de datos: ${error.message}`;
    }
  }
  
  async createSimpleEntity(): Promise<SimpleEntity> {
    const entity = new SimpleEntity();
    entity.nombre = 'Ejemplo';
    entity.descripcion = 'Esta es una descripción de ejemplo';
    
    return this.simpleEntityRepository.save(entity);
  }
  
  async findAllEntities(): Promise<SimpleEntity[]> {
    return this.simpleEntityRepository.find();
  }
}