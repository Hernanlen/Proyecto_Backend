import React, { useEffect, useState } from 'react';
import { getProductos } from '../services/productos.service';
import { Producto } from '../types/producto';
import './Productos.css'; // Asumiendo que mantienes tu archivo de estilos

export const Productos = () => {
  // Estado para guardar las ollas y sartenes
  const [productos, setProductos] = useState<Producto[]>([]);
  // Estado para manejar la pantalla de carga
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Función asíncrona para traer los datos
    const cargarCatálogo = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar los productos de Essen:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarCatálogo();
  }, []); // El arreglo vacío indica que solo se ejecuta una vez al montar el componente

  if (loading) {
    return <div className="loading-spinner">Cargando catálogo...</div>;
  }

  return (
    <div className="productos-container">
      <h2>Catálogo Oficial</h2>
      
      <div className="grid-productos">
        {productos.map((producto) => (
          <div key={producto.id} className="tarjeta-producto">
            {/* Si no hay imagen, mostramos un recuadro gris temporal */}
            <div className="imagen-placeholder">
              {producto.imagenUrl ? (
                <img src={producto.imagenUrl} alt={producto.nombre} />
              ) : (
                <span>Sin imagen</span>
              )}
            </div>
            
            <div className="info-producto">
              <span className="categoria-badge">
                {producto.categoria?.nombre || 'Sin categoría'}
              </span>
              <h3>{producto.nombre}</h3>
              <p className="descripcion-corta">{producto.descripcion}</p>
              
              <div className="detalles-tecnicos">
                {producto.diametro && <span>Ø {producto.diametro}</span>}
                {producto.capacidad && <span>{producto.capacidad}</span>}
              </div>

              <div className="precio-y-accion">
                <span className="precio">${producto.precio}</span>
                <button className="btn-agregar" disabled={producto.stock === 0}>
                  {producto.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;