import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  email: string='';

  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password: string='';
}