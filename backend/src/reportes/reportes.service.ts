import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { DetallePedido } from '../pedidos/entities/detalle-pedido.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Pedido) private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(DetallePedido) private readonly detalleRepository: Repository<DetallePedido>,
  ) {}

  async generarResumen() {
    const resumenVentas = await this.pedidoRepository
      .createQueryBuilder('pedido')
      .select('COALESCE(SUM(pedido.total), 0)', 'totalVentas')
      .addSelect('COALESCE(COUNT(pedido.id), 0)', 'pedidosTotales')
      .addSelect('COALESCE(AVG(pedido.total), 0)', 'promedioPorPedido')
      .getRawOne();

    const clientesActivos = await this.pedidoRepository
      .createQueryBuilder('pedido')
      .select('COUNT(DISTINCT pedido.usuario_id)', 'clientesActivos')
      .getRawOne();

    const productosVendidos = await this.detalleRepository
      .createQueryBuilder('detalle')
      .select('COALESCE(SUM(detalle.cantidad), 0)', 'productosVendidos')
      .getRawOne();

    const ventasPorCategoria = await this.detalleRepository
      .createQueryBuilder('detalle')
      .leftJoin('detalle.producto', 'producto')
      .leftJoin('producto.categoria', 'categoria')
      .select('COALESCE(categoria.nombre, :sinCategoria)', 'categoria')
      .addSelect('SUM(detalle.cantidad)', 'cantidad')
      .setParameter('sinCategoria', 'Sin categoría')
      .groupBy('categoria')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    return {
      metricas: [
        {
          id: 'total-ventas',
          titulo: 'Ingresos Totales',
          total: `Bs ${Number(resumenVentas?.totalVentas ?? 0).toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        },
        {
          id: 'pedidos-totales',
          titulo: 'Pedidos Totales',
          total: Number(resumenVentas?.pedidosTotales ?? 0),
        },
        {
          id: 'productos-vendidos',
          titulo: 'Productos Vendidos',
          total: Number(productosVendidos?.productosVendidos ?? 0),
        },
        {
          id: 'clientes-activos',
          titulo: 'Clientes Activos',
          total: Number(clientesActivos?.clientesActivos ?? 0),
        },
        {
          id: 'ticket-promedio',
          titulo: 'Ticket Promedio',
          total: `Bs ${Number(resumenVentas?.promedioPorPedido ?? 0).toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        },
      ],
      grafico: ventasPorCategoria.map((item) => ({
        nombre: item.categoria,
        cantidad: Number(item.cantidad),
      })),
    };
  }
}
