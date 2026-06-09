import { Module, forwardRef } from '@nestjs/common'; // 🌟 1. Importamos forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { Carrito } from '../carrito/entities/carrito.entity';
import { LogsModule } from '../logs/logs.module';
import { AuthModule } from '../auth/auth.module'; // 🌟 2. Importamos el AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Pedido, Carrito]),
    LogsModule,
    forwardRef(() => AuthModule) // 🌟 3. Creamos el puente de regreso
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService]
})
export class UsuariosModule {}