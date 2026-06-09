export interface Categoria {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  diametro?: string;
  capacidad?: string;
  material?: string;
  imagenUrl?: string;
  categoria?: Categoria; // Incluimos la categoría anidada que configuramos en el backend
}