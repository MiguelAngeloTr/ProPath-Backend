import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, 
    private readonly jwtService: JwtService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(), 
      context.getClass()
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role;
    console.log(request.user)
    console.log(userRole)
    console.log(requiredRoles)

    // Verifica si el rol del usuario está incluido en los roles requeridos
    if (!requiredRoles.includes(userRole)) {
      throw new UnauthorizedException('No tienes permiso para acceder a este recurso');
    }

    return true;
  }
}