import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Leemos qué roles exige la ruta actual
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Si la ruta no exige ningún rol específico, lo dejamos pasar
    if (!requiredRoles) {
      return true;
    }

    // Obtenemos los datos del usuario (el AuthGuard los puso aquí previamente)
    const { user } = context.switchToHttp().getRequest();

    // Verificamos si el usuario tiene el rol necesario
    if (!user || !requiredRoles.includes(user.rol)) {
      throw new ForbiddenException('Acceso denegado: Se requieren permisos de Administrador');
    }

    return true;
  }
}