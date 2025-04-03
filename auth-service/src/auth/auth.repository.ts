import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUser } from './entities/auth-user.entity';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(AuthUser)
    private readonly repository: Repository<AuthUser>,
  ) {}

  async findById(id: string): Promise<AuthUser | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    return this.repository.findOne({ where: { email } });
  }

  async create(registerDto: RegisterDto): Promise<AuthUser> {
    const user = this.repository.create({
      id: registerDto.id,
      email: registerDto.email.toLowerCase(),
      password: registerDto.password,
      role: registerDto.role,
    });
    return this.repository.save(user);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await this.repository.update(id, { refreshToken });
  }
}