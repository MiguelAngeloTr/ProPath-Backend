import { Body, Controller, Get, Post, Headers, UnauthorizedException, UseGuards, Request, Param, Res, Req, HttpStatus } from '@nestjs/common';
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
    response.cookie('access_token', authResult.loginResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // true en producción
      sameSite: 'lax', // 'strict' en producción
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias en milisegundos
    });
    
    // Configurar refresh token en cookie HTTP-only
    response.cookie('refresh_token', authResult.loginResponse.refreshToken, {
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
      user: authResult.userData,
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  async refreshToken(@Req() request, @Res({ passthrough: true }) response: Response) {
    // Intentar obtener el refresh token de la cookie primero
    let refreshToken = request.cookies?.refresh_token;
    
    // Si no hay token en cookie, intentar obtenerlo del body
    if (!refreshToken && request.body?.refreshToken) {
      refreshToken = request.body.refreshToken;
    }
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }
    
    const tokens = await this.authService.refreshToken(refreshToken);
    
    // Actualizar cookies
    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Tokens refreshed successfully'
    };
  }

  @Post('logout')
  async logout(@Req() request, @Res({ passthrough: true }) response: Response) {
    // Obtener el token de la cookie o del header
    const token = request.cookies?.access_token || 
                 (request.headers.authorization?.startsWith('Bearer ') ? 
                  request.headers.authorization.split(' ')[1] : null);
    
    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      // Verificar el token y obtener el userId
      const verified = await this.authService.verifyToken(token);
      if (!verified.isValid) {
        throw new UnauthorizedException('Invalid authentication token');
      }
      
      // Logout con el ID extraído del token
      await this.authService.logout(verified.user.id);
      
      // Limpiar las cookies
      response.clearCookie('access_token');
      response.clearCookie('refresh_token', { path: '/auth/refresh' });
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Logout successful'
      };
    } catch (error) {
      // Limpiar las cookies de todos modos
      response.clearCookie('access_token');
      response.clearCookie('refresh_token', { path: '/auth/refresh' });
      
      throw new UnauthorizedException('Logout failed: ' + error.message);
    }
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