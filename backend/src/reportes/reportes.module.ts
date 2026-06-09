import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { DetallePedido } from '../pedidos/entities/detalle-pedido.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, DetallePedido, Producto, Categoria]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}
