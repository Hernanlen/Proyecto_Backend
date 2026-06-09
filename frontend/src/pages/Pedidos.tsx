import { useState, useEffect } from 'react';
import api from '../services/api';
import './usuarios.css'; // Reutilizamos los estilos de tu tabla de usuarios

interface DetallePedido {
  producto: string;
  cantidad: number;
  precio: number;
}

interface Pedido {
  id: number;
  fecha: string;
  cliente: string;
  direccion: string;
  total: number;
  estado: 'Pendiente' | 'Enviado' | 'Entregado' | 'Cancelado';
  detalles: DetallePedido[];
}

export const Pedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Modal para ver los productos exactos que compraron
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        setCargando(true);
        // Consumimos tu backend para traer el historial de ventas
        const response = await api.get('/pedidos');
        setPedidos(response.data);
      } catch (err) {
        console.error('Error al cargar pedidos', err);
        
        // Fallback de contingencia: Datos de prueba para que veas cómo lucirá
        setPedidos([
          {
            id: 101,
            fecha: '2026-06-07T10:30:00Z',
            cliente: 'Laura Gómez',
            direccion: 'Av. Las Américas #123, Zona Sur',
            total: 1850.50,
            estado: 'Pendiente',
            detalles: [{ producto: 'Olla Clásica Marsala', cantidad: 1, precio: 1850.50 }]
          },
          {
            id: 102,
            fecha: '2026-06-06T15:45:00Z',
            cliente: 'Carlos Mamani',
            direccion: 'Calle Comercio Esq. Bueno, Edif. Central',
            total: 1450.00,
            estado: 'Enviado',
            detalles: [{ producto: 'Olla con Mango Aqua', cantidad: 1, precio: 1450.00 }]
          }
        ]);
        setError('Mostrando pedidos de simulación. Falta conectar con GET /pedidos en NestJS.');
      } finally {
        setCargando(false);
      }
    };

    cargarPedidos();
  }, []);

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      // await api.patch(`/pedidos/${id}/estado`, { estado: nuevoEstado });
      setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado as any } : p));
    } catch (error) {
      alert('Error al actualizar el estado en el servidor');
    }
  };

  // Colores dinámicos para los estados
  const colorEstado = (estado: string) => {
    switch(estado) {
      case 'Pendiente': return { bg: '#fef08a', text: '#854d0e' }; // Amarillo
      case 'Enviado': return { bg: '#bfdbfe', text: '#1e3a8a' };   // Azul
      case 'Entregado': return { bg: '#bbf7d0', text: '#166534' }; // Verde
      case 'Cancelado': return { bg: '#fecaca', text: '#991b1b' }; // Rojo
      default: return { bg: '#e2e8f0', text: '#475569' };
    }
  };

  if (cargando) return <p style={{ padding: '20px' }}>Cargando bandeja de pedidos...</p>;

  return (
    <div className="usuarios-container">
      <h2 className="titulo" style={{ marginBottom: '20px' }}>Gestión de Pedidos</h2>

      {error && (
        <div style={{ padding: '10px', background: '#fef08a', color: '#854d0e', marginBottom: '20px', borderRadius: '4px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* MODAL PARA VER EL DETALLE DEL PEDIDO (LAS OLLAS) */}
      {pedidoSeleccionado && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginTop: 0 }}>Detalle de Orden #{pedidoSeleccionado.id}</h3>
            <p><strong>Cliente:</strong> {pedidoSeleccionado.cliente}</p>
            <p><strong>Dirección:</strong> {pedidoSeleccionado.direccion}</p>
            
            <hr style={{ margin: '15px 0', border: '1px solid #e2e8f0' }} />
            
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {pedidoSeleccionado.detalles.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>{item.cantidad}x {item.producto}</span>
                  <span style={{ fontWeight: 'bold' }}>Bs {item.precio.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            
            <hr style={{ margin: '15px 0', border: '1px solid #e2e8f0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
              <span>TOTAL PAGADO:</span>
              <span>Bs {pedidoSeleccionado.total.toFixed(2)}</span>
            </div>

            <button onClick={() => setPedidoSeleccionado(null)} style={{ marginTop: '20px', width: '100%', background: '#3b82f6', color: 'white', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}

      {/* TABLA PRINCIPAL */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="tabla" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px' }}># Orden</th>
              <th style={{ padding: '12px' }}>Fecha</th>
              <th style={{ padding: '12px' }}>Cliente</th>
              <th style={{ padding: '12px' }}>Total</th>
              <th style={{ padding: '12px' }}>Estado Actual</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Acciones Administrativas</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No hay pedidos registrados</td></tr>
            ) : (
              pedidos.map(p => {
                const colores = colorEstado(p.estado);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#3b82f6' }}>#{p.id}</td>
                    <td style={{ padding: '12px' }}>{new Date(p.fecha).toLocaleDateString()}</td>
                    <td style={{ padding: '12px' }}>{p.cliente}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>Bs {p.total.toFixed(2)}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: colores.bg, color: colores.text, padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                        {p.estado}
                      </span>
                    </td>
                    <td style={{ padding: '12px', display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      
                      {/* Botón para ver los productos */}
                      <button onClick={() => setPedidoSeleccionado(p)} style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        👁️ Ver
                      </button>

                      {/* Selector para cambiar el estado */}
                      <select 
                        value={p.estado} 
                        onChange={(e) => cambiarEstado(p.id, e.target.value)}
                        style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};