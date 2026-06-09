import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { Carrito } from './entities/carrito.entity';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
  ) {}

  // Método para agregar o actualizar un producto en el carrito
  async agregarItem(usuarioId: number, createCarritoDto: CreateCarritoDto) {
    const { productoId, cantidad } = createCarritoDto;

    // 1. Buscamos si el usuario ya tiene este producto en su carrito
    let itemExistente = await this.carritoRepository.findOne({
      where: { 
        usuario: { id: usuarioId }, 
        producto: { id: productoId } 
      }
    });

    if (itemExistente) {
      // 2. Si ya existe, solo sumamos la cantidad
      itemExistente.cantidad += cantidad;
      return await this.carritoRepository.save(itemExistente);
    } else {
      // 3. Si no existe, creamos un nuevo registro en el carrito
      const nuevoItem = this.carritoRepository.create({
        cantidad,
        usuario: { id: usuarioId },
        producto: { id: productoId }
      });
      return await this.carritoRepository.save(nuevoItem);
    }
  }

  // Método para ver todo el carrito de un usuario específico
  async verCarritoDeUsuario(usuarioId: number) {
    return await this.carritoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: { producto: { categoria: true } }, // Traemos los datos de la olla para mostrarlos en el frontend
    });
  }
  // Agregar debajo de los métodos existentes en CarritoService
  async eliminarItem(usuarioId: number, carritoId: number) {
    // Buscamos el ítem asegurándonos de que pertenezca al usuario que lo pide
    const item = await this.carritoRepository.findOne({
      where: { 
        id: carritoId, 
        usuario: { id: usuarioId } 
      }
    });

    if (!item) {
      // Si no existe o no es suyo, arrojamos un error de NestJS
      throw new NotFoundException('El producto no se encontró en tu carrito');
    }

    // Lo eliminamos de la base de datos
    await this.carritoRepository.remove(item);
    return { mensaje: 'Producto eliminado del carrito exitosamente' };
  }
}