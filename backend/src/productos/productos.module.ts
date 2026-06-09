import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { AuthModule } from '../auth/auth.module'; // 1. Importamos el archivo

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Categoria]),
    AuthModule // 2. Lo agregamos al arreglo de imports
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}