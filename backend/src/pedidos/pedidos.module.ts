import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Pedido } from './entities/pedido.entity';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { Carrito } from '../carrito/entities/carrito.entity'; // Importamos el Carrito
import { AuthModule } from '../auth/auth.module'; // 1. Importamos el archivo

@Module({
  // ¡Agregamos Carrito al arreglo!
  imports: [TypeOrmModule.forFeature([Pedido, DetallePedido, Carrito]), AuthModule], 
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}