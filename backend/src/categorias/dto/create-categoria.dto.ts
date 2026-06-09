import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateCategoriaDto {
  @IsString({ message: 'El nombre de la categoría debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 letras' })
  nombre: string='';

  @IsOptional() // La descripción no es obligatoria
  @IsString({ message: 'La descripción debe ser un texto' })
  descripcion?: string;
}