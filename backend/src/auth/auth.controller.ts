import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth') // Ruta base: http://localhost:3000/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // Ruta completa: http://localhost:3000/auth/login
  async login(@Body() loginDto: LoginDto) {
    // Le pasamos el email y la contraseña a nuestra lógica de negocio
    return await this.authService.login(loginDto.email, loginDto.password);
  }
}