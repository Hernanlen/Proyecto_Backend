import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user, loading } = useContext(AuthContext);

  // Mientras averiguamos si está logueado, no mostramos nada raro
  if (loading) return <div>Cargando accesos...</div>;

  // Si no hay usuario en absoluto, patada al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si la puerta exige roles específicos y el usuario no tiene el correcto, patada al inicio
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  // Si todo está en orden, le abrimos la puerta a la pantalla que solicitó (<Outlet />)
  return <Outlet />;
};