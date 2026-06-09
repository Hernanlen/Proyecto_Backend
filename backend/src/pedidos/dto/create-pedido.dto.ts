import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreatePedidoDto {
  @IsString({ message: 'La dirección de envío debe ser un texto' })
  @IsNotEmpty({ message: 'La dirección de envío es obligatoria' })
  @MinLength(10, { message: 'La dirección es muy corta, sé más específico' })
  direccionEnvio: string='';

  @IsString()
  @IsNotEmpty({ message: 'Debes seleccionar un método de pago' })
  metodoPago: string='';
}