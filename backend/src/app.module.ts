import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // 🌟 Mantén esto aquí
import { AuthModule } from './auth/auth.module';
import { CarritoModule } from './carrito/carrito.module';
import { CategoriasModule } from './categorias/categorias.module';
import { LogsModule } from './logs/logs.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ProductosModule } from './productos/productos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    // 🌟 1. ConfigModule va PRIMERO para cargar las variables a tiempo
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    // 🌟 2. TypeORM con la propiedad "url" agregada
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // 🚀 ESTO ES VITAL PARA RENDER
      host: process.env.DATABASE_URL ? undefined : (process.env.DB_HOST || 'localhost'),
      port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DATABASE_URL ? undefined : (process.env.DB_USERNAME || 'postgres'),
      password: process.env.DATABASE_URL ? undefined : (process.env.DB_PASSWORD || '123456'),
      database: process.env.DATABASE_URL ? undefined : (process.env.DB_DATABASE || 'essen_ecommerce'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
      logging: true,
    }),

    AuthModule,
    ProductosModule,
    CategoriasModule,
    UsuariosModule,
    PedidosModule,
    CarritoModule,
    LogsModule,
    ReportesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}