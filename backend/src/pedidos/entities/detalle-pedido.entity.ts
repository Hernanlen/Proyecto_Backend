import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { CreateDateColumn } from 'typeorm'; // Asegúrate de importar esto arriba

// Agrégalo dentro de tu clase Pedido:

@Entity('detalles_pedido')
export class DetallePedido {
  @PrimaryGeneratedColumn()
  id: number = 0;

  
  @Column('int', { default: 1 })
  cantidad: number = 1;

  // Este campo es crucial: guarda el precio histórico
  // Le decimos que en la base de datos se usa el guion bajo
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_unitario' })
  precioUnitario: number;

  // Relación: Este detalle pertenece a UN pedido
  @ManyToOne(() => Pedido) // Más adelante agregaremos (pedido) => pedido.detalles
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  // Relación: Este detalle hace referencia a UN producto
  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;
  
}