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
    <div className="app-container">
      {/* 🔝 HEADER GLOBAL MEJORADO */}
      <header className="header">
        <div className="header-container">
          {/* Logo con efecto hover */}
          <div className="logo-area" onClick={() => navigate('/')}>
            <span className="logo-icon">🍳</span>
            <h1 className="logo-text">ESSEN</h1>
            <span className="logo-badge">Premium</span>
          </div>

          {/* Barra de navegación desktop */}
          <nav className="nav-links">
            {/* 🟢 1. RUTAS PÚBLICAS (Siempre visibles) */}
            <button className="nav-btn" onClick={() => navigate('/productos')}>
              <span className="btn-icon">🛒</span>
              Productos
            </button>
            <button className="nav-btn" onClick={() => navigate('/acerca')}>
              <span className="btn-icon">📖</span>
              Acerca
            </button>

            {/* 🔵 2. RUTAS DE CLIENTE (Solo visibles si el usuario inició sesión) */}
            {user && (
              <button className="nav-btn cart-btn" onClick={() => navigate('/carrito')}>
                <span className="btn-icon">🛍️</span>
                Carrito
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </button>
            )}

            {/* 🔴 3. RUTAS DE ADMINISTRADOR (Solo visibles si el rol es 'admin') */}
            {user?.rol === 'admin' && (
              <>
                <button className="nav-btn admin-btn" onClick={() => navigate('/usuarios')}>
                  <span className="btn-icon">👥</span>
                  Usuarios
                </button>
                <button className="nav-btn admin-btn" onClick={() => navigate('/logs')}>
                  <span className="btn-icon">📋</span>
                  Logs
                </button>
                <button className="nav-btn admin-btn" onClick={() => navigate('/reportes')}>
                  <span className="btn-icon">📊</span>
                  Reportes
                </button>
                <button className="nav-btn admin-btn" onClick={() => navigate('/pedidos')}>
                  <span className="btn-icon">📦</span>
                  Pedidos
                </button>
              </>
            )}
          </nav>

          {/* 🔐 BOTONES DE SESIÓN (Dinámicos) */}
          <div className="auth-area">
            {!user ? (
              <button className="btn-login" onClick={() => navigate('/login')}>
                <span className="btn-icon">🔐</span>
                Iniciar Sesión
              </button>
            ) : (
              <div className="user-menu">
                <span className="user-greeting">
                  👋 Hola, <strong>{user.nombre}</strong>
                </span>
                <button onClick={handleLogout} className="btn-logout">
                  <span className="btn-icon">🚪</span>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 📦 CONTENIDO DINÁMICO */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer opcional para darle más estructura (puedes quitarlo si no lo deseas) */}
      <footer className="footer">
        <p>© 2026 ESSEN Premium Kitchen - Calidad que perdura</p>
      </footer>
    </div>
  );
};