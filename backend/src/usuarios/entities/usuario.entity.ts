import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios') // Asegúrate de que el nombre coincida con tu tabla en MySQL
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  // Aquí definimos que si no te mandan nada, por defecto sea "cliente"
  @Column({ type: 'varchar', default: 'cliente' })
  rol: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;
}

/*
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios') // Asegúrate de que el nombre coincida con tu tabla en MySQL
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number=0;

  @Column({ type: 'varchar', length: 100 })
  nombre: string='';

  @Column({ type: 'varchar', length: 100 })
  apellido: string='';

  @Column({ type: 'varchar', unique: true })
  email: string='';

  @Column({ type: 'varchar' })
  password: string='';

  // Aquí definimos que si no te mandan nada, por defecto sea "cliente"
  @Column({ type: 'varchar', default: 'cliente' })
  rol: string='';

  @Column({ type: 'boolean', default: true })
  estado: boolean=true;
}
*/