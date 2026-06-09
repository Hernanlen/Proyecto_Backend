import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('logs_sistema')
export class Log {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario?: Usuario;

  @RelationId((log: Log) => log.usuario)
  usuarioId: number = 0;

  @Column()
  accion: string = '';

  // 🌟 Le decimos explícitamente a MySQL que esto es un VARCHAR
  @Column({ type: 'varchar', name: 'tabla_afectada', nullable: true })
  tablaAfectada: string | null = null;

  // 🌟 Le decimos explícitamente a MySQL que esto es un INT (Entero)
  @Column({ type: 'int', name: 'registro_id', nullable: true })
  registroId: number | null = null;

  @CreateDateColumn()
  fecha: Date = new Date();
}