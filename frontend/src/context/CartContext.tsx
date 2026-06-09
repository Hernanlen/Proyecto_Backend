import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: any) => {
  // 1. Traemos al usuario actual para saber si está logueado
  const { user } = useContext(AuthContext); 
  const [cart, setCart] = useState<any[]>([]);

  // ✅ Cargar carrito desde la Base de Datos al iniciar sesión
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await api.get("/carrito");
          setCart(response.data); // NestJS nos devuelve los ítems con sus productos
        } catch (error) {
          console.error("Error al cargar el carrito de la BD", error);
        }
      } else {
        setCart([]); // Si cierra sesión, vaciamos el carrito visual
      }
    };
    fetchCart();
  }, [user]); // Se vuelve a ejecutar si el usuario cambia

  // ✅ Agregar producto (Directo a NestJS)
  const addToCart = async (producto: any) => {
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    try {
      // Le enviamos a NestJS lo que pide nuestro DTO: productoId y cantidad
      await api.post("/carrito", {
        productoId: producto.id,
        cantidad: 1,
      });

      // Recargamos el carrito desde el backend para tener los datos sincronizados
      const response = await api.get("/carrito");
      setCart(response.data);
    } catch (error) {
      console.error("Error al agregar al carrito", error);
      alert("Hubo un error al agregar el producto.");
    }
  };

  // ✅ Eliminar (Usando el ID del ítem en el carrito)
  const removeFromCart = async (carritoId: number) => {
    try {
      await api.delete(`/carrito/${carritoId}`);
      // Actualizamos la vista filtrando el que acabamos de borrar
      setCart(cart.filter((item) => item.id !== carritoId));
    } catch (error) {
      console.error("Error al eliminar del carrito", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        // (Nota: updateCantidad requeriría que creemos un método PATCH en NestJS si lo quieres implementar después)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};