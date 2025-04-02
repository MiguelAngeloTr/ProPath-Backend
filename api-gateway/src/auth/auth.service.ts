import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('Auth-Service') private readonly client: ClientProxy
  ) {}

  async login(loginDto: LoginDto) {
    return firstValueFrom(
      this.client.send({ cmd: 'login' }, loginDto)
    );
  }

  async register(registerDto: RegisterDto) {
    return firstValueFrom(
      this.client.send({ cmd: 'register' }, registerDto)
    );
  }

  async verifyToken(token: string) {
    return firstValueFrom(
      this.client.send({ cmd: 'verify_token' }, token)
    );
  }

  async refreshToken(refreshToken: string) {
    return firstValueFrom(
      this.client.send({ cmd: 'refresh_token' }, refreshToken)
    );
  }

  async logout(userId: string) {
    return firstValueFrom(
      this.client.send({ cmd: 'logout' }, userId)
    );
  }
}