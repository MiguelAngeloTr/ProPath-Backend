import { Body, Controller, Get, Post, Headers, UnauthorizedException, UseGuards, Request, Param, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {

    const authResult = await this.authService.login(loginDto);
    
    // Configurar access token en cookie HTTP-only
    response.cookie('access_token', authResult.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // true en producción
      sameSite: 'lax', // 'strict' en producción
      maxAge: 15 * 60 * 1000 // 15 minutos en milisegundos
    });
    
    // Configurar refresh token en cookie HTTP-only
    response.cookie('refresh_token', authResult.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      path: '/auth/refresh', // Restringir a la ruta de refresh
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días en milisegundos
    });
    
    // Devolver datos del usuario sin tokens en la respuesta
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      user: authResult.user
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { userId: string }) {
    return this.authService.logout(body.userId);
  }

  @Get('verify')
  async verifyToken(@Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = auth.split(' ')[1];
    return this.authService.verifyToken(token);
  }
}