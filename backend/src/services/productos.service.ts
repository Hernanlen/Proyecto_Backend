import api from './api';

// Función para pedir la lista de ollas y sartenes
export const getProductos = async () => {
  const response = await api.get('/productos');
  return response.data; // Esto devolverá el JSON que vimos en el navegador
};