import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('productos')
export class Producto {
  
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ length: 150 })
  nombre: string = '';

  @Column('text')
  descripcion: string = '';

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number = 0;

  @Column('int', { default: 0 })
  stock: number = 0;

  // ELIMINAMOS categoriaId: number = 0; Y AGREGAMOS ESTO:
  @ManyToOne(() => Categoria, (categoria) => categoria.productos, { nullable: true })
  @JoinColumn({ name: 'categoria_id' }) // Vincula con la columna real de MySQL
  categoria?: Categoria;

  @Column({ length: 50, nullable: true })
  diametro: string = '';

  @Column({ length: 50, nullable: true })
  capacidad: string = '';

  @Column({ length: 100, nullable: true })
  material: string = '';

  @Column({ name: 'imagen_url', length: 255, nullable: true })
  imagenUrl: string = '';

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date = new Date();
}