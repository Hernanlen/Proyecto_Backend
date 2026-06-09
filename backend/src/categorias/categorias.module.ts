import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { Categoria } from './entities/categoria.entity';
import { AuthModule } from '../auth/auth.module'; // 1. Importamos el archivo

@Module({
  imports: [TypeOrmModule.forFeature([Categoria]), AuthModule], // Registramos la entidad
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}