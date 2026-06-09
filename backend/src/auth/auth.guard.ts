import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request); // Buscamos el token
    
    if (!token) {
      throw new UnauthorizedException('No enviaste el token de acceso');
    }
    
    try {
      // Intentamos descifrar el token con nuestra palabra secreta
      // Reemplaza la parte de la verificación en canActivate:
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET // Ahora lee desde el .env
      });
      
      // Si es válido, pegamos los datos del usuario (id, email, rol) a la petición
      // para poder usarlos en el controlador
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('El token es inválido o ha expirado');
    }
    return true; // ¡Déjalo pasar!
  }

  // Función auxiliar para extraer el token de la cabecera "Authorization: Bearer <token>"
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  
}