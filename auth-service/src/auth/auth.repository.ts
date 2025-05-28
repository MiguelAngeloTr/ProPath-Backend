import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { AuthUser } from './entities/auth-user.entity';
import { RegisterDto } from './dto/auth.dto';
import { PasswordResetToken } from './entities/password-reset-token.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(AuthUser)
    private readonly repository: Repository<AuthUser>,
    
    @InjectRepository(PasswordResetToken)
    private readonly resetTokenRepository: Repository<PasswordResetToken>,
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
  
  async updatePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    user.password = newPassword;
    await this.repository.save(user);
  }
  
  // Métodos para tokens de restablecimiento de contraseña
  async createPasswordResetToken(email: string, code: string, expiresInMinutes: number): Promise<PasswordResetToken> {
    // Crear fecha de expiración
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
    
    // Crear token
    const resetToken = this.resetTokenRepository.create({
      email,
      code,
      isUsed: false,
      expiresAt
    });
    
    return this.resetTokenRepository.save(resetToken);
  }
  
  async findValidResetToken(email: string, code: string): Promise<PasswordResetToken | null> {
    const now = new Date();
    
    return this.resetTokenRepository.findOne({
      where: {
        email,
        code,
        isUsed: false,
        expiresAt: MoreThan(now)
      }
    });
  }
  
  async markResetTokenAsUsed(id: string): Promise<void> {
    await this.resetTokenRepository.update(id, { isUsed: true });
  }
}