import { IsNumber, IsPositive, Min } from 'class-validator';

export class CreateCarritoDto {
  @IsNumber({}, { message: 'El ID del producto debe ser un número válido' })
  @IsPositive()
  productoId: number=0;

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'Debes agregar al menos 1 producto' })
  cantidad: number=0;
}