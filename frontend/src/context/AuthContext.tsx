import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

// 1. Definimos la forma exacta del usuario que devuelve NestJS
export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

// 2. Definimos todo lo que este Contexto va a compartir
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

// 3. Creamos el contexto aplicándole la interfaz
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// 4. Tipamos los props (children) del Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error: any) {
      // Mejora: Capturamos el mensaje de error real que envía NestJS (ej. "Contraseña incorrecta")
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};