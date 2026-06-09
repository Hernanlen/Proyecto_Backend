import { Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './layout.css';

export const Layout = () => {
  const navigate = useNavigate();

  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  // Protegemos el reduce por si cart aún no ha cargado (cart?.reduce)
  const totalItems = cart?.reduce((acc: number, item: any) => acc + item.cantidad, 0) || 0;

  // Función para cerrar sesión y sacar al usuario al inicio automáticamente
  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <div>
      {/* 🔝 HEADER GLOBAL */}
      <header className="header">
        {/* Un pequeño estilo para que parezca clickeable */}
        <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>ESSEN</h1>

        <nav>
          {/* 🟢 1. RUTAS PÚBLICAS (Siempre visibles) */}
          <button onClick={() => navigate('/productos')}>Productos</button>
          <button onClick={() => navigate('/acerca')}>Acerca</button>

          {/* 🔵 2. RUTAS DE CLIENTE (Solo visibles si el usuario inició sesión) */}
          {user && (
            <>
              <button onClick={() => navigate('/carrito')}>
                Carrito ({totalItems})
              </button>
              {/* Actualizamos "Pacientes" a "Checkout" para mantener la lógica de tienda */}
            </>
          )}

          {/* 🔴 3. RUTAS DE ADMINISTRADOR (Solo visibles si el rol es 'admin') */}
          {user?.rol === 'admin' && (
            <>
              <button onClick={() => navigate('/usuarios')}>Usuarios</button>
              <button onClick={() => navigate('/logs')}>Logs</button>
              <button onClick={() => navigate('/reportes')}>Reportes</button>
              <button onClick={() => navigate('/pedidos')}>Pedidos</button> 
            </>
          )}

          {/* 🔐 BOTONES DE SESIÓN (Dinámicos) */}
          {!user ? (
            <button onClick={() => navigate('/login')}>
              Iniciar Sesión
            </button>
          ) : (
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión ({user.nombre})
            </button>
          )}
        </nav>
      </header>

      {/* 📦 CONTENIDO DINÁMICO */}
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};