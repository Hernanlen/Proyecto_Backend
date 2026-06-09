import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto'; // 🌟 NUEVO: Importamos el DTO de actualización
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // TODOS PUEDEN VER EL CATÁLOGO (Ruta pública)
  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  // SOLO LOS ADMINS PUEDEN CREAR PRODUCTOS
  @UseGuards(AuthGuard, RolesGuard) // El orden importa
  @Roles('admin') // Etiquetamos la ruta
  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  // 🌟 NUEVO: SOLO LOS ADMINS PUEDEN EDITAR PRODUCTOS
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id') // Aquí definimos que acepte peticiones PATCH como las de tu React
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(+id, updateProductoDto); // El "+" convierte el string a número
  }

  // SOLO LOS ADMINS PUEDEN ELIMINAR PRODUCTOS
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}