import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  // 1. CREAR PRODUCTO (Guarda en la BD)
  async create(createProductoDto: CreateProductoDto) {
    let categoria: Categoria | undefined = undefined;

    if (createProductoDto.categoriaId !== undefined && createProductoDto.categoriaId !== null) {
      const categoriaEncontrada = await this.categoriaRepository.findOne({
        where: { id: createProductoDto.categoriaId },
      });

      if (!categoriaEncontrada) {
        categoria = undefined;
      } else {
        categoria = categoriaEncontrada;
      }
    }

    const nuevoProducto = this.productoRepository.create({
      nombre: createProductoDto.nombre,
      descripcion: createProductoDto.descripcion,
      precio: createProductoDto.precio,
      stock: createProductoDto.stock,
      diametro: createProductoDto.diametro,
      capacidad: createProductoDto.capacidad,
      material: createProductoDto.material,
      imagenUrl: createProductoDto.imagenUrl,
      categoria,
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
    const productoExistente = await this.findOne(id); // Verificamos que exista primero

    if (updateProductoDto.categoriaId !== undefined) {
      if (updateProductoDto.categoriaId !== null && updateProductoDto.categoriaId > 0) {
        const categoria = await this.categoriaRepository.findOne({
          where: { id: updateProductoDto.categoriaId },
        });

        if (!categoria) {
          productoExistente.categoria = undefined;
        } else {
          productoExistente.categoria = categoria;
        }
      } else {
        productoExistente.categoria = undefined;
      }
    }

    productoExistente.nombre = updateProductoDto.nombre ?? productoExistente.nombre;
    productoExistente.descripcion = updateProductoDto.descripcion ?? productoExistente.descripcion;
    productoExistente.precio = updateProductoDto.precio ?? productoExistente.precio;
    productoExistente.stock = updateProductoDto.stock ?? productoExistente.stock;
    productoExistente.diametro = updateProductoDto.diametro ?? productoExistente.diametro;
    productoExistente.capacidad = updateProductoDto.capacidad ?? productoExistente.capacidad;
    productoExistente.material = updateProductoDto.material ?? productoExistente.material;
    productoExistente.imagenUrl = updateProductoDto.imagenUrl ?? productoExistente.imagenUrl;

    delete (productoExistente as any).categoriaId;

    return await this.productoRepository.save(productoExistente);
  }

  // 5. ELIMINAR PRODUCTO (Borrado físico)
  async remove(id: number) {
    const producto = await this.findOne(id); // Verificamos que exista
    await this.productoRepository.remove(producto); // Lo eliminamos de verdad
    return { message: `Producto eliminado exitosamente` };
  }
}