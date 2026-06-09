import { Routes, Route } from 'react-router-dom';
import { Logs } from './pages/Logs'; // Ajusta la ruta según tu estructura
// Componentes estructurales
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute'; // Asegúrate de tener este archivo creado

// Vistas Públicas
import { Home } from './pages/Home';
import { Productos } from './pages/Productos';
import { Acerca } from './pages/Acerca';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard'; // Nueva vista para el dashboard de admin
// Vistas Privadas
import { Carrito } from './pages/carrito';
import { DatosCompra } from './pages/Datos_compra'; // Renombrado de Pacientes a DatosCompra
import { Registro } from './pages/Registro'; // Nueva vista para registro de usuarios
// Vistas de Administrador
import { Reportes } from './pages/Reportes';
import {Usuarios } from './pages/Usuarios'; // Nueva vista para gestión de usuarios
import {Pedidos} from './pages/Pedidos'; // Nueva vista para reportes de ventas
export default function App() {
  return (
    <Routes>
      {/* 🔓 SIN NAVBAR: Ruta totalmente aislada */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* 🔝 TODAS LAS RUTAS CON NAVBAR */}
      <Route element={<Layout />}>
        
        {/* RUTAS PÚBLICAS: Cualquiera puede entrar */}
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/acerca" element={<Acerca />} />

        {/* RUTAS PRIVADAS (CLIENTES Y ADMIN): Protegidas para compras */}
        <Route element={<ProtectedRoute allowedRoles={['cliente', 'admin']} />}>
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<DatosCompra />} /> {/* Actualicé la ruta a /checkout por convención */}
        </Route>

        {/* RUTAS ADMINISTRATIVAS: Solo para ti, para auditar y ver reportes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        
          <Route path="/ususarios" element={<Dashboard />} /> {/* Nueva ruta para el dashboard de admin */}
          <Route path="/logs" element={<Logs />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/pedidos" element={<Pedidos />} />
        </Route>

      </Route>
    </Routes>
  );
}