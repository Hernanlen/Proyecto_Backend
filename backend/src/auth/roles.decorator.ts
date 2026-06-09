import { SetMetadata } from '@nestjs/common';

// Este decorador nos permitirá poner @Roles('admin') encima de cualquier ruta
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);