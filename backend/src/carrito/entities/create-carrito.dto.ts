// src/carrito/dto/create-carrito.dto.ts
import { IsInt, IsNotEmpty, Min, IsPositive } from 'class-validator';

export class CreateCarritoDto {
  
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  @IsInt({ message: 'El ID del producto debe ser un número entero' })
  @IsPositive({ message: 'El ID del producto debe ser positivo' })
  productoId: number;

  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'Debes agregar al menos 1 artículo al carrito' })
  cantidad: number;

}