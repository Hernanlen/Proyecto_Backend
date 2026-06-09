import { useState, useEffect } from "react";
import api from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  AreaChart, // 🌟 Cambiado de BarChart
  Area,      // 🌟 Cambiado de Bar
} from 'recharts';
import "./reportes.css";

// Interfaces
interface MetricaReporte {
  id: number | string;
  titulo: string;
  total: string | number;
}

interface DatosGrafico {
  nombre: string;
  cantidad: number;
}

export const Reportes = () => {
  const [reportes, setReportes] = useState<MetricaReporte[]>([]);
  const [datosGrafico, setDatosGrafico] = useState<DatosGrafico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerReportes = async () => {
      try {
        setCargando(true);
        const response = await api.get('/reportes/resumen');
        setReportes(response.data.metricas);
        setDatosGrafico(response.data.grafico);
        setError("");
      } catch (err) {
        console.error("Error al obtener los reportes del servidor", err);
        
        // Fallback: Datos de prueba si el backend aún no envía esta estructura
        setReportes([
          { id: 1, titulo: "Ingresos del día", total: "Bs 1200" },
          { id: 2, titulo: "Productos vendidos", total: 35 },
          { id: 3, titulo: "Nuevos Usuarios", total: 10 }
        ]);

        setDatosGrafico([
          { nombre: "Ollas", cantidad: 15 },
          { nombre: "Sartenes", cantidad: 12 },
          { nombre: "Utensilios", cantidad: 8 }
        ]);

        setError("Mostrando datos de prueba. Falta conectar con el endpoint /reportes/resumen.");
      } finally {
        setCargando(false);
      }
    };

    obtenerReportes();
  }, []);

  // 🖨️ Función para Generar y Descargar el PDF
  const generarPDF = () => {
    const doc = new jsPDF();

    // Título y Fecha
    doc.setFontSize(20);
    doc.text("Reporte General - ESSEN", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    const fechaActual = new Date().toLocaleDateString('es-ES');
    doc.text(`Fecha de emisión: ${fechaActual}`, 14, 30);

    // Tabla de Resumen
    const tableData = reportes.map(r => [r.titulo, r.total]);

    autoTable(doc, {
      startY: 40,
      head: [['Indicador', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }, // Color azul (Tailwind bg-blue-500)
    });

    // Agregar datos del gráfico al final del PDF
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Ventas por Categoría", 14, finalY + 15);

    const chartData = datosGrafico.map(g => [g.nombre, g.cantidad.toString()]);
    
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Categoría', 'Cantidad Vendida']],
      body: chartData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }, // Color verde (Tailwind bg-emerald-500)
    });

    // Descargar el archivo
    doc.save(`Reporte_Essen_${fechaActual.replace(/\//g, '-')}.pdf`);
  };

  if (cargando) return <p style={{ padding: '20px' }}>Calculando métricas y armando gráficos...</p>;

  return (
    <div className="reportes-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* 🔝 CABECERA Y BOTÓN PDF */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: "#1e293b" }}>Reportes Rápidos</h1>
        
        <button 
          onClick={generarPDF}
          style={{
            background: "#ef4444", color: "white", padding: "10px 20px", 
            borderRadius: "6px", border: "none", cursor: "pointer", 
            fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          📄 Descargar PDF
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px', background: '#fef08a', color: '#854d0e', marginBottom: '20px', borderRadius: '4px', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* 🔢 TARJETAS DE MÉTRICAS */}
      <div className="reportes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        {reportes.map(r => (
          <div className="card" key={r.id} style={{ background: "white", padding: '25px', textAlign: 'center', borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <h3 style={{ color: '#475569', fontSize: '16px', marginBottom: '10px', textTransform: "uppercase", letterSpacing: "1px" }}>
              {r.titulo}
            </h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', margin: '0' }}>
              {r.total}
            </p>
          </div>
        ))}
      </div>

      {/* 📊 GRÁFICO ESTADÍSTICO */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", height: "400px" }}>
  <h3 style={{ marginBottom: "20px", color: "#334155" }}>Evolución de Productos Vendidos</h3>
  
  <ResponsiveContainer width="100%" height="90%">
    <AreaChart data={datosGrafico} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      
      {/* 🎨 MAGIA VISUAL: Definimos un gradiente de color para el relleno */}
      <defs>
        <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
        </linearGradient>
      </defs>

      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
      
      <XAxis 
        dataKey="nombre" 
        axisLine={false} 
        tickLine={false} 
        tick={{ fill: '#64748b' }} 
        dy={10} 
      />
      
      <YAxis 
        axisLine={false} 
        tickLine={false} 
        tick={{ fill: '#64748b' }} 
        dx={-10} 
      />
      
      <Tooltip 
        contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
      />
      
      <Legend verticalAlign="top" height={36}/>
      
      {/* 📈 LA LÍNEA: type="monotone" hace curvas suaves. 
          Si quieres picos triangulares afilados, cámbialo a type="linear" */}
      <Area 
        type="monotone" 
        dataKey="cantidad" 
        name="Unidades Vendidas" 
        stroke="#2563eb" 
        strokeWidth={3}
        fillOpacity={1} 
        fill="url(#colorVentas)" 
        activeDot={{ r: 6, strokeWidth: 0, fill: '#1e40af' }} // Un punto resaltado al pasar el mouse
      />
      
    </AreaChart>
  </ResponsiveContainer>
</div>

    </div>
  );
};