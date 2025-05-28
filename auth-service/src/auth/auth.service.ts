import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { AuthRepository } from './auth.repository';
import { RegisterDto, TokenPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(userData: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.authRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Generar contraseña si no se proporciona una
    const generatedPassword = !userData.password ? this.generateSecurePassword() : null;

    console.log('Generated Password:', generatedPassword);
    
    // Crear el objeto de datos completo del usuario
    const userToCreate = {
      ...userData,
      password: generatedPassword || userData.password,
    };

    console.log('User to create:', userToCreate);

    // Create new user
    const newUser = await this.authRepository.create(userToCreate);

    // Return user and tokens
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      ...(generatedPassword ? { generatedPassword } : {}),

    };
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('User found:', user);
    // Generate tokens
    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Update refresh token in database
    await this.authRepository.updateRefreshToken(user.id, tokens.refreshToken);

    // Return user and tokens
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  }

  private generateSecurePassword(length: number = 12): string {
    // Generate a random password using crypto
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  async verifyToken(token: string) {
    try {
      // Verify the token and extract payload
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Return the decoded payload
      return {
        isValid: true,
        user: {
          id: payload.id,
          email: payload.email,
          role: payload.role,
        },
      };
    } catch (error) {
      return {
        isValid: false,
        message: error.message,
      };
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync<TokenPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Find user by id
      const user = await this.authRepository.findById(payload.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Update refresh token in database
      await this.authRepository.updateRefreshToken(user.id, tokens.refreshToken);

      // Return new tokens
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  async logout(userId: string) {
    // Remove refresh token from database
    await this.authRepository.updateRefreshToken(userId, null);
    return { success: true };
  }
  
  async findByEmail(email: string) {
    const user = await this.authRepository.findByEmail(email.toLowerCase());
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }
  private async generateTokens(payload: TokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
    // Métodos para el restablecimiento de contraseña
  
  async createPasswordResetToken(data: { email: string; code: string; expiresInMinutes: number }): Promise<{ token: string, expires: Date } | null> {
    try {
      // Verificar si el usuario existe
      const user = await this.authRepository.findByEmail(data.email.toLowerCase());
      if (!user) {
        return null; // No informar al cliente si el email existe o no para evitar enumerar usuarios
      }
      
      // Crear token en la base de datos
      const token = await this.authRepository.createPasswordResetToken(
        data.email.toLowerCase(), 
        data.code, 
        data.expiresInMinutes
      );
      
      return {
        token: data.code,
        expires: token.expiresAt
      };
    } catch (error) {
      console.error('Error creating password reset token:', error);
      return null;
    }
  }
  
  async resetPassword(email: string, code: string, newPassword: string): Promise<boolean> {
    try {
      // Buscar token válido
      const resetToken = await this.authRepository.findValidResetToken(
        email.toLowerCase(), 
        code
      );
      
      if (!resetToken) {
        throw new BadRequestException('Código inválido o expirado');
      }
      
      // Buscar usuario
      const user = await this.authRepository.findByEmail(email.toLowerCase());
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      
      // Actualizar contraseña
      await this.authRepository.updatePassword(user.id, newPassword);
      
      // Marcar token como usado
      await this.authRepository.markResetTokenAsUsed(resetToken.id);
      
      return true;
    } catch (error) {
      throw new BadRequestException(`Error al restablecer contraseña: ${error.message}`);
    }
  }
}