import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetallePedido } from './detalle-pedido.entity'; // ¡Importación agregada!

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @CreateDateColumn({ name: 'fecha_pedido' })
  fechaPedido: Date = new Date();

  @Column('decimal', { precision: 10, scale: 2 })
  total: number = 0;

  @Column({ type: 'enum', enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'], default: 'pendiente' })
  estado: string = 'pendiente';

  // Le decimos explícitamente cómo se llama la columna en MySQL
  @Column({ name: 'direccion_envio' }) 
  direccionEnvio: string;

  @Column({ name: 'metodo_pago', length: 50, nullable: true })
  metodoPago: string = '';

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // ¡Relación habilitada!
  @OneToMany(() => DetallePedido, (detalle) => detalle.pedido)
  detalles: DetallePedido[];
}