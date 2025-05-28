import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log("Request: ",request.cookies);
    
    // Intentar obtener el token de la cookie primero
    let token = request.cookies?.access_token;
    
    // Si no hay token en cookie, intentar obtenerlo del header de autorización
    if (!token) {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('No authentication token provided');
      }
      token = authHeader.split(' ')[1];
    }
    
    // Verificar el token
    const response = await this.authService.verifyToken(token);
    
    if (!response.isValid) {
      throw new UnauthorizedException('Invalid authentication token');
    }
    
    // Añadir el usuario al request para usarlo en los controladores
    request.user = response.user;
    return true;
  }
}