import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('carrito')
export class Carrito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { default: 1 })
  cantidad: number;

  @CreateDateColumn({ name: 'fecha_agregado' })
  fechaAgregado: Date;

  // Relación: Este item en el carrito pertenece a UN usuario
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // Relación: Este item en el carrito es UN producto específico
  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;
}