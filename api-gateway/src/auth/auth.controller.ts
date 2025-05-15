import { Body, Controller, Get, Post, Headers, UnauthorizedException, UseGuards, Request, Param, Res, Req, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PasswordResetRequestDto, PasswordResetVerifyDto } from '../smtp/dto/password-reset.dto';

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

  @ApiOperation({
    summary: 'Solicitar código de recuperación de contraseña',
    description: 'Envía un código de verificación al correo electrónico del usuario para restablecer su contraseña'
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', example: 'usuario@ejemplo.com' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud procesada correctamente'
  })
  @Post('request-password-reset')
  async requestPasswordReset(@Body() data: PasswordResetRequestDto) {
    try {
      console.log('Solicitud de recuperación de contraseña:', data);
      await this.authService.requestPasswordReset(data.email);
      // Siempre devolver el mismo mensaje para evitar enumerar usuarios
      return {
        statusCode: HttpStatus.OK,
        message: 'Si el correo existe en nuestro sistema, recibirá un código de verificación para restablecer su contraseña'
      };
    } catch (error) {
      console.error('Error en solicitud de recuperación:', error);
      // Siempre devolver el mismo mensaje para evitar enumerar usuarios
      return {
        statusCode: HttpStatus.OK,
        message: 'Si el correo existe en nuestro sistema, recibirá un código de verificación para restablecer su contraseña'
      };
    }
  }

  @ApiOperation({
    summary: 'Restablecer contraseña con código de verificación',
    description: 'Verifica el código de recuperación y establece una nueva contraseña para el usuario'
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'code', 'newPassword'],
      properties: {
        email: { type: 'string', example: 'usuario@ejemplo.com' },
        code: { type: 'string', example: '123456' },
        newPassword: { type: 'string', example: 'NuevaContraseña123!' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida exitosamente'
  })
  @ApiResponse({
    status: 400,
    description: 'Código inválido o expirado'
  })
  @Post('reset-password')
  async resetPassword(@Body() data: PasswordResetVerifyDto) {
    try {
      const result = await this.authService.resetPassword(data);
      return {
        statusCode: HttpStatus.OK,
        message: 'Contraseña restablecida exitosamente'
      };
    } catch (error) {
      throw new HttpException("El codigo ingresado no es correcto", HttpStatus.BAD_REQUEST);
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