import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    // 1. Buscamos al usuario por su email.
    // OJO: Como le pusimos select: false a la contraseña en la entidad,
    // debemos buscarlo armando una consulta especial con el queryBuilder.
    const usuario = await this.usuariosService.findByEmailWithPassword(email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Comparamos la contraseña en texto plano con el hash guardado
    const isMatch = await bcrypt.compare(pass, usuario.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Si todo es correcto, armamos el "Payload" (la info que llevará el token)
    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };

    // 4. Devolvemos el token firmado
    return {
      token: await this.jwtService.signAsync(payload),
      userData: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    };
  }
}