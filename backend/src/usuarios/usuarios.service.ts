import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt'; 
import { LogsService } from '../logs/logs.service'; // 🌟 Importamos el servicio de auditoría

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private readonly logsService: LogsService, // 🌟 Inyectamos el servicio
  ) {}
  
  // Asumimos un adminId por defecto (1) por si tu controlador aún no envía quién hace la acción
  async create(createUsuarioDto: CreateUsuarioDto, adminId: number = 1) {
    const { password, ...restoDeDatos } = createUsuarioDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = this.usuarioRepository.create({
      ...restoDeDatos,
      password: hashedPassword,
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    // 🌟 Disparador de Log
    await this.logsService.registrarUsuario(
      adminId, 
      `Creación de nuevo usuario: ${usuarioGuardado.email}`, 
      'usuarios', 
      usuarioGuardado.id
    );

    const { password: _, ...usuarioSinPassword } = usuarioGuardado;
    return usuarioSinPassword;
  }

  async findAll() {
    return await this.usuarioRepository.find();
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto, adminId: number = 1) {
    // Si el administrador está enviando una contraseña nueva, debemos encriptarla antes de guardar
    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    await this.usuarioRepository.update(id, updateUsuarioDto);

    // 🌟 Disparador de Log
    // Identificamos si fue una desactivación (borrado lógico) o una edición normal
    const accion = updateUsuarioDto.estado !== undefined 
      ? `Cambio de estado del usuario ID ${id} a ${updateUsuarioDto.estado ? 'Activo' : 'Inactivo'}`
      : `Actualización de datos del usuario ID ${id}`;

    await this.logsService.registrarUsuario(adminId, accion, 'usuarios', id);

    return this.findOne(id);
  }

  async remove(id: number, adminId: number = 1) {
    const usuarioAEliminar = await this.findOne(id); // Verificamos que exista primero
    await this.usuarioRepository.delete(id);

    // 🌟 Disparador de Log
    await this.logsService.registrarUsuario(
      adminId, 
      `Eliminación física del usuario: ${usuarioAEliminar.email}`, 
      'usuarios', 
      id
    );

    return { message: `Usuario #${id} eliminado correctamente` };
  }

  async findByEmailWithPassword(email: string) {
    return await this.usuarioRepository.findOne({
      where: { email },
          select: { 
      id: true, 
      nombre: true, 
      email: true, 
      password: true, 
      rol: true 
    },
    });
  }
}