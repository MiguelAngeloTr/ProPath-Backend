import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { PasswordResetRequestDto, PasswordResetVerifyDto } from './dto/password-reset.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login' })
  async login(data: LoginDto) {
    return this.authService.login(data.email, data.password);
  }

  @MessagePattern({ cmd: 'register' })
  async register(userData: RegisterDto) {
    return this.authService.register(userData);
  }

  @MessagePattern({ cmd: 'verify_token' })
  async verifyToken(token: string) {
    return this.authService.verifyToken(token);
  }

  @MessagePattern({ cmd: 'refresh_token' })
  async refreshToken(refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @MessagePattern({ cmd: 'logout' })
  async logout(userId: string) {
    return this.authService.logout(userId);
  }
    @MessagePattern({ cmd: 'create_reset_token' })
  async createResetToken(data: { email: string; code: string; expiresInMinutes: number }) {
    return this.authService.createPasswordResetToken(data);
  }
  
  @MessagePattern({ cmd: 'reset_password' })
  async resetPassword(data: PasswordResetVerifyDto) {
    return this.authService.resetPassword(data.email, data.code, data.newPassword);
  }
  
  @MessagePattern({ cmd: 'find_by_email' })
  async findByEmail(email: string) {
    return this.authService.findByEmail(email);
  }
}