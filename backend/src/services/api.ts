import axios from 'axios';

// Creamos la instancia base apuntando a nuestro backend
const api = axios.create({
  baseURL: process.env.API_URL || 'https://tienda-backend-q62q.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Antes de que salga la petición, revisa si hay un token guardado
api.interceptors.request.use(
  (config) => {
    // Asumimos que cuando hagamos el Login, guardaremos el token aquí
    const token = localStorage.getItem('token'); 
    
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