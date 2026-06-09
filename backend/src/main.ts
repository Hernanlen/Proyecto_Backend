import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Importamos el Pipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ¡ACTIVAMOS LA VALIDACIÓN GLOBAL!
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina cualquier dato basura que el usuario envíe y no esté en el DTO
      forbidNonWhitelisted: true, // Lanza un error si envían datos no permitidos
      transform: true, // Transforma automáticamente los strings numéricos a números reales
    })
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
}
bootstrap();