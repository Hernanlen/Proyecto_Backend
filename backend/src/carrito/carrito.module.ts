import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { Carrito } from './entities/carrito.entity';
import { AuthModule } from '../auth/auth.module'; // 1. Importamos el archivo

@Module({
  // Registramos la entidad
  imports: [TypeOrmModule.forFeature([Carrito]), AuthModule], 
  controllers: [CarritoController],
  providers: [CarritoService],
})
export class CarritoModule {}