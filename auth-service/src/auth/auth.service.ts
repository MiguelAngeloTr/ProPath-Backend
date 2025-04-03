import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { RegisterDto, TokenPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(userData: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.authRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create new user
    const newUser = await this.authRepository.create(userData);

    // Generate tokens
    const tokens = await this.generateTokens({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // Update refresh token in database
    await this.authRepository.updateRefreshToken(newUser.id, tokens.refreshToken);

    // Return user and tokens
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

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
}