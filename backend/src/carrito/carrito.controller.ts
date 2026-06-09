import { Controller, Get, Post, Body, UseGuards, Request,Delete, Param } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { AuthGuard } from '../auth/auth.guard'; // Importamos el guardia
@Controller('carrito')
@UseGuards(AuthGuard) // ¡Protegemos TODAS las rutas del carrito!
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post()
  agregar(@Request() req, @Body() createCarritoDto: CreateCarritoDto) {
    // req.user.sub contiene el ID del usuario que sacamos del Token JWT
    const usuarioId = req.user.sub; 
    return this.carritoService.agregarItem(usuarioId, createCarritoDto);
  }

  @Get()
  verMiCarrito(@Request() req) {
    const usuarioId = req.user.sub;
    return this.carritoService.verCarritoDeUsuario(usuarioId);
  }
  @Delete(':id')
  eliminar(@Request() req, @Param('id') carritoId: string) {
    const usuarioId = req.user.sub; // Extraemos quién es el usuario desde el JWT
    return this.carritoService.eliminarItem(usuarioId, +carritoId);
  }
}