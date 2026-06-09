import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity'; // Importamos tu entidad
@Injectable()
export class ProductosService {
  // Inyectamos el repositorio para poder hablar con la tabla de MySQL
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  create(createProductoDto: CreateProductoDto) {
    return 'This action adds a new producto';
  }

  // REEMPLAZAMOS EL TEXTO DE RELLENO POR LA CONSULTA A LA BASE DE DATOS
  async findAll() {
    return await this.productoRepository.find({
      relations: { categoria: true }, // Le decimos que traiga los datos de la categoría anidada
    });
  }
  
  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}