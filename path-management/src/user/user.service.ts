import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInfo } from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id } 
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findWithPaths(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['paths', 'paths.activities'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async create(userInfo: UserInfo): Promise<User> {
    const user = this.userRepository.create(userInfo);
    console.log(user);
    return this.userRepository.save(user);
  }

  async update(id: number, userInfo: UserInfo): Promise<User> {
    await this.findById(id);
    await this.userRepository.update(id, userInfo);
    return this.findById(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result ? true : false;
  }
}