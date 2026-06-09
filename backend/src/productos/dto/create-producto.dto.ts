import { IsString, IsNumber, IsPositive, IsOptional, MinLength } from 'class-validator';

export class CreateProductoDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(3, { message: 'El nombre es muy corto' })
  nombre: string='';

  @IsString()
  descripcion: string='';

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio: number=0;

  @IsNumber()
  stock: number=0;

  @IsOptional() // Le decimos que este campo no es obligatorio
  @IsString()
  diametro?: string;

  @IsOptional()
  @IsString()
  capacidad?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;

  @IsOptional()
  @IsNumber()
  categoriaId?: number;
}