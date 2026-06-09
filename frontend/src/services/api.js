import axios from 'axios';

// 1. Creamos la conexión base apuntando a tu backend de NestJS
const api = axios.create({
  baseURL: 'http://localhost:3000', // El puerto donde corre tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. El Interceptor: Un "policía de aduana" que revisa cada petición antes de salir
api.interceptors.request.use(
  (config) => {
    // Buscamos si hay un token guardado en el navegador
    const token = localStorage.getItem('token');
    
    // Si hay token, se lo pegamos a la cabecera de autorización
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;