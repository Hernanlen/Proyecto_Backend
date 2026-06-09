import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
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

  // SOLO LOS ADMINS PUEDEN ELIMINAR PRODUCTOS
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}