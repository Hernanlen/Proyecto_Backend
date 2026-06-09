import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  // RUTA CLIENTE: Procesar la compra
  @UseGuards(AuthGuard)
  @Post('checkout')
  procesarCompra(@Request() req, @Body() createPedidoDto: CreatePedidoDto) {
    const usuarioId = req.user.sub; 
    return this.pedidosService.procesarCompra(usuarioId, createPedidoDto);
  }

  // ¡NUEVA RUTA CLIENTE!: Ver mis compras anteriores
  @UseGuards(AuthGuard)
  @Get('mis-pedidos')
  misPedidos(@Request() req) {
    const usuarioId = req.user.sub;
    return this.pedidosService.findMisPedidos(usuarioId);
  }

  // RUTA ADMIN: Ver todas las ventas de la tienda
  @UseGuards(AuthGuard, RolesGuard) // Exigimos login Y rol específico
  @Roles('admin') // Solo administradores
  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }
}