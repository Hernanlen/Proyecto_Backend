import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { Pedido } from './entities/pedido.entity';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { Carrito } from '../carrito/entities/carrito.entity';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido) private pedidoRepository: Repository<Pedido>,
    @InjectRepository(DetallePedido) private detalleRepository: Repository<DetallePedido>,
    @InjectRepository(Carrito) private carritoRepository: Repository<Carrito>,
  ) {}

  async procesarCompra(usuarioId: number, createPedidoDto: CreatePedidoDto) {
    // 1. Obtener todos los items del carrito del usuario (con los datos del producto)
    const itemsCarrito = await this.carritoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: { producto: true },
    });

    if (itemsCarrito.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    // 2. Calcular el total a pagar sumando (precio * cantidad) de cada item
    let totalPedido = 0;
    itemsCarrito.forEach(item => {
      totalPedido += item.producto.precio * item.cantidad;
    });

    // 3. Crear el Pedido Principal (El "Recibo")
    const nuevoPedido = this.pedidoRepository.create({
      usuario: { id: usuarioId },
      total: totalPedido,
      direccionEnvio: createPedidoDto.direccionEnvio,
      metodoPago: createPedidoDto.metodoPago,
      estado: 'procesando',
    });
    const pedidoGuardado = await this.pedidoRepository.save(nuevoPedido);

    // 4. Crear los Detalles del Pedido (Congelando el precio actual)
    const detallesPromises = itemsCarrito.map(item => {
      const nuevoDetalle = this.detalleRepository.create({
        pedido: { id: pedidoGuardado.id },
        producto: { id: item.producto.id },
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio, // Guardamos el precio en este momento exacto
      });
      return this.detalleRepository.save(nuevoDetalle);
    });
    await Promise.all(detallesPromises); // Ejecutamos todos los guardados en paralelo

    // 5. Vaciar el carrito del usuario
    await this.carritoRepository.remove(itemsCarrito);

    return {
      mensaje: 'Compra procesada exitosamente',
      pedidoId: pedidoGuardado.id,
      total: totalPedido
    };
  }

  async findAll() {
    const pedidos = await this.pedidoRepository
      .createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.usuario', 'usuario')
      .leftJoinAndSelect('pedido.detalles', 'detalle')
      .leftJoinAndSelect('detalle.producto', 'producto')
      .orderBy('pedido.fechaPedido', 'DESC')
      .addOrderBy('pedido.id', 'DESC')
      .getMany();

    return pedidos.map(p => ({
      id: p.id,
      fecha: p.fechaPedido,
      cliente: p.usuario ? `${p.usuario.nombre} ${p.usuario.apellido}` : 'Cliente Desconocido',
      direccion: p.direccionEnvio,
      total: Number(p.total),
      estado: p.estado,
      detalles: p.detalles ? p.detalles.map(d => ({
        producto: d.producto ? d.producto.nombre : 'Producto sin nombre',
        cantidad: d.cantidad,
        precio: Number(d.precioUnitario)
      })) : []
    }));
  }
  // Devuelve únicamente las compras del usuario que lo solicita
  async findMisPedidos(usuarioId: number) {
    return await this.pedidoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: {
        detalles: {
          producto: true
        }
      },// Traemos el recibo y qué ollas compró
      order: { fechaPedido: 'DESC' }, // Ordenamos del más reciente al más antiguo
    });
  }
}
