import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  // Añade estas dos líneas para que el backend las acepte al actualizar
  estado?: boolean;
  password?: string;
}