import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    // Si no se requieren roles específicos, permite el acceso
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    
    const token = authHeader.split(' ')[1];
    const response = await this.authService.verifyToken(token);
    
    if (!response.isValid) {
      return false;
    }
    
    // Añadir el usuario al request para usarlo en los controladores
    request.user = response.user;
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    return requiredRoles.includes(response.user.role);
  }
}