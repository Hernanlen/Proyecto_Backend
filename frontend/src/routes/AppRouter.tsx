import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

// Componentes estructurales
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";

// Vistas Públicas
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Productos } from "../pages/Productos";

// Vistas Privadas (Clientes y Admin)
import { Carrito } from "../pages/carrito";
import { DatosCompra } from "../pages/Datos_compra";

// Vistas Protegidas Exclusivas (Solo Admin)
import { Dashboard } from "../pages/Dashboard";
import { Usuarios } from "../pages/Usuarios";

export const AppRouter = () => {
  return (
    // Envolvemos toda la app con nuestros Contextos para que la info viaje a cualquier pantalla
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* RUTA TOTALMENTE AISLADA: El login no necesita menú de navegación */}
            <Route path="/login" element={<Login />} />

            {/* RUTAS CON DISEÑO COMPARTIDO: Todas estas pantallas tendrán el menú superior (Layout) */}
            <Route element={<Layout />}>
              
              {/* Públicas: Cualquiera puede entrar */}
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />

              {/* Privadas: Debes estar logueado para comprar */}
              <Route element={<ProtectedRoute allowedRoles={['cliente', 'admin']} />}>
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/checkout" element={<DatosCompra />} />
              </Route>

              {/* Administrativas: Estrictamente para gestionar el negocio */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/usuarios" element={<Usuarios />} />
                
              </Route>

            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default AppRouter;