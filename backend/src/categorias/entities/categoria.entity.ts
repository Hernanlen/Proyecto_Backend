import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity'; // Importamos Producto

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ length: 100, unique: true })
  nombre: string = '';

  @Column('text', { nullable: true })
  descripcion: string = '';

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date = new Date();

  // Relación: Una categoría tiene MUCHOS productos
  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}