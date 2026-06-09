import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

// 1. Definimos la interfaz para los datos financieros
interface EstadisticaMensual {
  mes: string;
  ventas: number;
  pedidos: number;
}

export const Dashboard = () => {
  const [estadisticas, setEstadisticas] = useState<EstadisticaMensual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        setLoading(true);
        // Intentamos traer la data real de tu backend NestJS
        const response = await api.get('/pedidos/estadisticas');
        setEstadisticas(response.data);
        setError('');
      } catch (err) {
        console.error("Error al cargar estadísticas reales", err);
        
        // 2. Fallback: Si la ruta aún no existe en NestJS, mostramos estos datos de prueba
        const mockComercial: EstadisticaMensual[] = [
          { mes: 'Enero', ventas: 1500, pedidos: 12 },
          { mes: 'Febrero', ventas: 2300, pedidos: 18 },
          { mes: 'Marzo', ventas: 3400, pedidos: 25 },
          { mes: 'Abril', ventas: 2800, pedidos: 20 },
        ];
        setEstadisticas(mockComercial);
        setError('Mostrando datos de prueba. Falta crear el endpoint /pedidos/estadisticas en NestJS.');
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Cargando panel de control...</p>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Dashboard Administrativo - ESSEN</h2>
      
      {/* Alerta si estamos usando datos falsos */}
      {error && (
        <div style={{ padding: '10px', background: '#fef08a', color: '#854d0e', marginBottom: '20px', borderRadius: '4px' }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '400px' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#475569' }}>Ingresos vs Cantidad de Pedidos por Mes</h3>
        
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={estadisticas} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            
            {/* Usamos dos ejes Y: Uno para dinero (izq) y otro para cantidad (der) */}
            <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
            <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
            
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="ventas" fill="#3b82f6" name="Ingresos (Bs)" />
            <Bar yAxisId="right" dataKey="pedidos" fill="#10b981" name="Cantidad de Pedidos" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};