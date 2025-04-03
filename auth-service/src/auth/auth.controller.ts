import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

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
}