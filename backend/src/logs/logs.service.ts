import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLogDto } from './dto/create-log.dto';
import { Log } from './entities/log.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
  ) {}

  // 1. Método genérico de creación adaptado a las columnas reales de tu DB
  async create(createLogDto: CreateLogDto) {
    const nuevoLog = this.logsRepository.create({
      accion: createLogDto.accion,
      tablaAfectada: createLogDto.tablaAfectada ?? null,
      registroId: createLogDto.registroId ?? null,
      usuario: { id: createLogDto.usuarioId || 1 },
    });

    return this.logsRepository.save(nuevoLog);
  }

  // 2. Método para listar la bitácora con el usuario legible
  async findAll(usuarioId?: number) {
    const query = this.logsRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.usuario', 'usuario');

    if (usuarioId) {
      query.where('log.usuario_id = :usuarioId', { usuarioId });
    }

    const logs = await query
      .orderBy('log.fecha', 'DESC')
      .addOrderBy('log.id', 'DESC')
      .getMany();

    return logs.map((log) => ({
      id: log.id,
      accion: log.accion,
      fecha: log.fecha,
      usuario: log.usuario ? `${log.usuario.nombre} ${log.usuario.apellido}` : `Usuario #${log.usuarioId}`,
      usuarioId: log.usuarioId,
      tablaAfectada: log.tablaAfectada,
      registroId: log.registroId,
    }));
  }

  // 3. El "Notario" principal que llama tu UsuariosService
  async registrar(usuarioId: number, accion: string, tablaAfectada: string, registroId: number) {
    try {
      const nuevoLog = this.logsRepository.create({
        usuario: { id: usuarioId || 1 },
        accion: accion,
        tablaAfectada: tablaAfectada,
        registroId: registroId,
      });
      await this.logsRepository.save(nuevoLog);
    } catch (error) {
      console.error('Error al guardar el log de auditoría:', error);
    }
  }

  // 4. Alias de compatibilidad (Por si algún archivo sigue llamando a registrarUsuario)
  async registrarUsuario(usuarioId: number, accion: string, tablaAfectada: string, registroId: number) {
    return this.registrar(usuarioId, accion, tablaAfectada, registroId);
  }
}