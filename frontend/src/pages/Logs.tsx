import { useState, useEffect } from 'react';
import api from '../services/api';
// Puedes reutilizar el mismo CSS de usuarios si ya tiene estilos para tablas y tarjetas
import './usuarios.css'; 

interface Log {
  id: number;
  usuarioId: number;
  accion: string;
  tablaAfectada: string | null;
  registroId: number | null;
  fecha: string;
}

export const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarLogs();
  }, []);

  const cargarLogs = async () => {
    try {
      setCargando(true);
      const response = await api.get('/logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error al cargar la bitácora', error);
    } finally {
      setCargando(false);
    }
  };

  // Función para darle formato legible a la fecha
  const formatearFecha = (fechaString: string) => {
    const opciones: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
  };

  // Función para asignar colores a las tablas afectadas
  const getColorTabla = (tabla: string | null) => {
    switch (tabla) {
      case 'usuarios': return { bg: '#dbeafe', color: '#1e3a8a' }; // Azul
      case 'pedidos': return { bg: '#fef08a', color: '#854d0e' }; // Amarillo/Naranja
      case 'productos': return { bg: '#dcfce7', color: '#14532d' }; // Verde
      default: return { bg: '#f1f5f9', color: '#475569' }; // Gris
    }
  };

  // Filtro de búsqueda en tiempo real
  const logsFiltrados = logs.filter(log => 
    log.accion.toLowerCase().includes(busqueda.toLowerCase()) ||
    (log.tablaAfectada && log.tablaAfectada.toLowerCase().includes(busqueda.toLowerCase()))
  );

  if (cargando) return <p style={{ padding: '20px' }}>Cargando bitácora del sistema...</p>;

  return (
    <div className="usuarios-container">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 className="titulo" style={{ margin: 0 }}>Bitácora del Sistema</h2>
        
        {/* Buscador */}
        <input 
          type="text" 
          placeholder="🔍 Buscar por acción o módulo..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '300px', outline: 'none' }}
        />
      </div>

      <div className="cards" style={{ marginBottom: '20px' }}>
        <div className="card-metric"><h4>Total de Registros</h4><p>{logs.length}</p></div>
        <div className="card-metric"><h4>Mostrando</h4><p>{logsFiltrados.length}</p></div>
      </div>

      <div className="card" style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <table className="tabla" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '15px 12px', color: '#64748b' }}>Fecha y Hora</th>
              <th style={{ padding: '15px 12px', color: '#64748b' }}>Admin ID</th>
              <th style={{ padding: '15px 12px', color: '#64748b' }}>Acción Realizada</th>
              <th style={{ padding: '15px 12px', color: '#64748b' }}>Módulo</th>
              <th style={{ padding: '15px 12px', color: '#64748b' }}>Registro ID</th>
            </tr>
          </thead>

          <tbody>
            {logsFiltrados.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No se encontraron registros que coincidan con la búsqueda.</td></tr>
            ) : (
              logsFiltrados.map(log => {
                const colores = getColorTabla(log.tablaAfectada);
                return (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>
                      {formatearFecha(log.fecha)}
                    </td>
                    
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#0f172a' }}>
                      #{log.usuarioId}
                    </td>
                    
                    <td style={{ padding: '12px', color: '#334155' }}>
                      {log.accion}
                    </td>
                    
                    <td style={{ padding: '12px' }}>
                      {log.tablaAfectada ? (
                        <span style={{ 
                          backgroundColor: colores.bg, color: colores.color, 
                          padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize' 
                        }}>
                          {log.tablaAfectada}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>Sistema</span>
                      )}
                    </td>

                    <td style={{ padding: '12px', color: '#64748b', fontWeight: 'bold' }}>
                      {log.registroId ? `#${log.registroId}` : '-'}
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