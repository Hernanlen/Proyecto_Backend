import { useContext, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

// 1. Definimos exactamente lo que el backend de Pedidos nos pide
interface CheckoutFormInputs {
  direccionEnvio: string;
  metodoPago: string;
}

export const DatosCompra = () => {
  const { cart } = useContext(CartContext);
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormInputs>();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);

  // Calculamos el total a cobrar leyendo desde el carrito
  const total = cart?.reduce((acc: number, item: any) => acc + Number(item.producto.precio) * item.cantidad, 0) || 0;

  const onSubmit: SubmitHandler<CheckoutFormInputs> = async (data) => {
    if (cart.length === 0) {
      alert("No tienes productos en tu carrito para comprar.");
      return;
    }

    try {
      setProcesando(true);
      
      // 2. Enviamos la compra a NestJS
      await api.post('/pedidos/checkout', {
        direccionEnvio: data.direccionEnvio,
        metodoPago: data.metodoPago
      });

      alert('¡Compra realizada con éxito! Tu pedido ha sido registrado.');
      
      // 3. Forzamos una recarga para limpiar el carrito visual y volver al inicio
      window.location.href = '/';
      
    } catch (error: any) {
      console.error("Error al procesar la compra", error);
      const msg = error.response?.data?.message || 'Error al procesar tu pedido';
      alert(msg);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Finalizar Compra</h2>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* FORMULARIO DE ENVÍO */}
        <div style={{ flex: '1', minWidth: '300px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '15px' }}>Datos de Envío</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Dirección de entrega completa</label>
              <textarea 
                {...register('direccionEnvio', { 
                  required: "La dirección es obligatoria",
                  minLength: { value: 10, message: "La dirección es muy corta" }
                })} 
                placeholder="Ej. Calle Los Pinos #123, Zona Sur..." 
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }} 
              />
              {errors.direccionEnvio && <span style={{ color: 'red', fontSize: '12px' }}>{errors.direccionEnvio.message}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Método de Pago</label>
              <select 
                {...register('metodoPago', { required: "Selecciona un método de pago" })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Seleccione una opción...</option>
                <option value="Tarjeta de Crédito">Tarjeta de Crédito / Débito</option>
                <option value="Transferencia Bancaria">Transferencia Bancaria (QR)</option>
                <option value="Efectivo al recibir">Efectivo al recibir (Contraentrega)</option>
              </select>
              {errors.metodoPago && <span style={{ color: 'red', fontSize: '12px' }}>{errors.metodoPago.message}</span>}
            </div>

            <button 
              type="submit" 
              disabled={procesando}
              style={{ padding: '12px 20px', background: procesando ? '#94a3b8' : '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: procesando ? 'not-allowed' : 'pointer', marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>
              {procesando ? 'Procesando pago...' : 'Confirmar Pedido'}
            </button>
          </form>
        </div>

        {/* RESUMEN DE COMPRA LATERAL */}
        <div style={{ flex: '0.5', minWidth: '250px', background: '#f8fafc', padding: '20px', borderRadius: '8px', height: 'fit-content', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '15px' }}>Resumen del Pedido</h3>
          
          <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '10px', marginBottom: '10px' }}>
            <p>Total de productos: <strong>{cart?.length || 0}</strong></p>
          </div>
          
          <h2 style={{ color: '#0f172a', margin: '0' }}>Total a pagar:</h2>
          <h1 style={{ color: '#16a34a', marginTop: '5px' }}>{total.toFixed(2)} Bs</h1>
        </div>

      </div>
    </div>
  );
};