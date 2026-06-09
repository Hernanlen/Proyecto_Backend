import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  apellido: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  // Agregamos el rol como opcional. Si el frontend no lo manda, 
  // tu base de datos debería poner 'cliente' por defecto.
  @IsString()
  @IsOptional()
  rol?: string;
}

/*
import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string='';

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  apellido: string='';

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string='';

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string='';

  // Agregamos el rol como opcional. Si el frontend no lo manda, 
  // tu base de datos debería poner 'cliente' por defecto.
  @IsString()
  @IsOptional()
  rol?: string;
}
*/
