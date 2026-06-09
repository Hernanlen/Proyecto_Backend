import { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Importamos el hook para navegar
import { CartContext } from "../context/CartContext";
import "./carrito.css";

export const Carrito = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate(); // Inicializamos el navegador

  // 1. Actualizamos la matemática para leer item.producto.precio
  const total = cart.reduce(
    (acc: number, item: any) => acc + Number(item.producto.precio) * item.cantidad,
    0
  );

  return (
    <div className="carrito-container">
      <h1>Tu Carrito</h1>

      {cart.length === 0 ? (
        <p className="empty">Tu carrito está vacío 🛒</p>
      ) : (
        <div className="carrito-content">
          {/* 🧾 LISTA */}
          <div className="carrito-list">
            {cart.map((item: any) => (
              <div className="carrito-item" key={item.id}>
                
                {/* 2. Leemos los datos desde item.producto */}
                {/* Nota: Asumimos que guardaste la URL en imagenUrl, puedes usar tu fallback visual si no hay foto */}
                <img src={item.producto.imagenUrl || "/favicon.svg"} alt={item.producto.nombre} />

                <div className="info">
                  <h3>{item.producto.nombre}</h3>
                  <p>{Number(item.producto.precio).toFixed(2)} Bs</p>
                </div>

                {/* Dejamos la cantidad como solo lectura temporalmente hasta agregar el PATCH en el backend */}
                <input
                  type="number"
                  readOnly
                  value={item.cantidad}
                  title="Para cambiar la cantidad, elimina el producto y vuelve a agregarlo"
                />

                <p className="subtotal">
                  {(Number(item.producto.precio) * item.cantidad).toFixed(2)} Bs
                </p>

                <button onClick={() => removeFromCart(item.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* 💰 RESUMEN */}
          <div className="carrito-resumen">
            <h2>Resumen</h2>

            <div className="resumen-line">
              <span>Total:</span>
              <span>{total.toFixed(2)} Bs</span>
            </div>

            {/* 3. Conectamos el botón para que lleve a la pantalla de pago */}
            <button 
              className="btn-comprar"
              onClick={() => navigate('/checkout')}
            >
              Finalizar compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};