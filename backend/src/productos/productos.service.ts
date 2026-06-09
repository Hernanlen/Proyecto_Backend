import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  // 1. CREAR PRODUCTO (Guarda en la BD)
  async create(createProductoDto: CreateProductoDto) {
    const nuevoProducto = this.productoRepository.create({
      ...createProductoDto,
      categoria: createProductoDto.categoriaId
        ? ({ id: createProductoDto.categoriaId } as any)
        : undefined,
    });

    return await this.productoRepository.save(nuevoProducto);
  }

  // 2. OBTENER TODOS (Esta ya la tenías perfecta)
  async findAll() {
    return await this.productoRepository.find({
      relations: { categoria: true },
    });
  }

  // 3. OBTENER UNO SOLO
  async findOne(id: number) {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: { categoria: true },
    });
    
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  // 4. ACTUALIZAR PRODUCTO
  async update(id: number, updateProductoDto: UpdateProductoDto) {
    await this.findOne(id); // Verificamos que exista primero

    const payload: any = { ...updateProductoDto };
    if (updateProductoDto.categoriaId !== undefined) {
      payload.categoria = { id: updateProductoDto.categoriaId };
      delete payload.categoriaId;
    }

    await this.productoRepository.update(id, payload);
    return this.findOne(id);
  }

  // 5. ELIMINAR PRODUCTO (Borrado físico)
  async remove(id: number) {
    const producto = await this.findOne(id); // Verificamos que exista
    await this.productoRepository.remove(producto); // Lo eliminamos de verdad
    return { message: `Producto eliminado exitosamente` };
  }
}