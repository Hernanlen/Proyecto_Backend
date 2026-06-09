import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LogsService } from './logs.service';

@Injectable()
export class LogsInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const method = request.method as string;
    const originalUrl = (request.originalUrl || request.url || '') as string;

    if (!this.debeRegistrar(method, originalUrl)) {
      return next.handle();
    }

    const inicio = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          void this.logsService.create({
            accion: this.obtenerAccion(method),
            modulo: 'usuarios',
            descripcion: `${method} ${originalUrl} completado en ${Date.now() - inicio}ms`,
            usuarioId: request.user?.id ?? null,
            usuarioEmail: request.user?.email ?? null,
            ip: request.ip ?? request.socket?.remoteAddress ?? null,
            userAgent: request.headers?.['user-agent'] ?? null,
          });
        },
      }),
    );
  }

  private debeRegistrar(method: string, originalUrl: string) {
    const url = originalUrl.toLowerCase();

    return (
      url.includes('/usuarios') &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())
    );
  }

  private obtenerAccion(method: string) {
    const acciones: Record<string, string> = {
      POST: 'crear',
      PUT: 'actualizar',
      PATCH: 'actualizar',
      DELETE: 'eliminar',
    };

    return acciones[method.toUpperCase()] ?? method.toLowerCase();
  }
}
