import { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./Productos.css";

// --- TIPOS ---
type BackendProducto = {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number | string;
  stock?: number;
  imagenUrl?: string | null;
  categoria?: {
    id: number;
    nombre: string;
  } | null;
  categoria_id?: number; // Por si el backend lo manda directo
};

type ProductoVista = BackendProducto & {
  precio: number;
  img: string;
};

type FormProducto = {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoriaId?: number | string;
};

type Categoria = {
  id: number;
  nombre: string;
};

// --- CONFIGURACIÓN DE IMÁGENES ---
const imagenFallback = "/favicon.svg";
const apiBaseUrl = "https://tienda-backend-q62q.onrender.com";

const resolverImagen = (imagenUrl?: string | null) => {
  if (!imagenUrl) return imagenFallback;
  if (/^(https?:|data:|blob:)/.test(imagenUrl)) return imagenUrl;
  if (imagenUrl.startsWith("/")) return `${apiBaseUrl.replace(/\/api\/?$/, "")}${imagenUrl}`;
  return `${apiBaseUrl.replace(/\/api\/?$/, "")}/${imagenUrl}`;
};

const normalizarProducto = (producto: BackendProducto): ProductoVista => ({
  ...producto,
  precio: Number(producto.precio),
  // 🌟 El salvavidas: si "imagenUrl" no existe, intenta leer "imagen_url"
  img: resolverImagen(producto.imagenUrl || (producto as any).imagen_url),
});

export const Productos = () => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); 
  const isAdmin = user?.rol === "admin";

  const [productos, setProductos] = useState<ProductoVista[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [categoriaError, setCategoriaError] = useState("");
  
  // 🌟 NUEVO: Estado para saber qué filtro presionó el usuario
  const [categoriaActiva, setCategoriaActiva] = useState<number | 'todas'>('todas');

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<FormProducto>();

  // --- FUNCIONES DE CARGA ---
  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");
      setCategoriaError("");
      
      // 1. Cargamos productos
      const resProductos = await api.get<BackendProducto[]>("/productos");
      setProductos(resProductos.data.map(normalizarProducto));

      // 2. Cargamos categorías
      try {
        const resCategorias = await api.get<Categoria[]>("/categorias");
        setCategorias(resCategorias.data);
      } catch (catErr) {
        setCategorias([]);
        setCategoriaError("No se pudieron cargar las categorías. No será posible crear ni editar productos hasta que el servidor las entregue.");
      }

    } catch (err) {
      console.error("Error al cargar datos", err);
      setError("No se pudieron cargar los productos del servidor.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- FUNCIONES ADMIN (CRUD) ---
  const onSubmitForm: SubmitHandler<FormProducto> = async (data) => {
    try {
      const payload = {
        ...data,
        precio: Number(data.precio),
        stock: Number(data.stock),
        categoriaId: data.categoriaId ? Number(data.categoriaId) : undefined,
      };

      if (editandoId) {
        await api.put(`/productos/${editandoId}`, payload);
        alert("Producto actualizado");
      } else {
        await api.post("/productos", payload);
        alert("Producto creado exitosamente");
      }

      setMostrarForm(false);
      setEditandoId(null);
      reset();
      cargarDatos();
    } catch (error: any) {
      console.error("Error completo:", error);
      if (error.response && error.response.data) {
        const mensajeBackend = error.response.data.message || error.response.data;
        alert(`El servidor rechazó los datos: ${JSON.stringify(mensajeBackend)}`);
      } else {
        alert("Hubo un error al guardar el producto.");
      }
    }
  };

  const iniciarEdicion = (p: ProductoVista) => {
    setEditandoId(p.id);
    setValue("nombre", p.nombre);
    setValue("descripcion", p.descripcion || "");
    setValue("precio", p.precio);
    setValue("stock", p.stock || 0);
    setValue("imagenUrl", p.imagenUrl || "");
    
    // Asignamos la categoría al formulario si existe
    const catId = p.categoria?.id || p.categoria_id;
    if (catId) setValue("categoriaId", catId);
    
    setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const eliminarProducto = async (id: number) => {
    if (!window.confirm("¿Seguro de eliminar este producto?")) return;
    try {
      await api.delete(`/productos/${id}`);
      await cargarDatos();
    } catch (error) {
      alert("No se pudo eliminar el producto. Podría estar en un pedido activo.");
    }
  };

  // 🌟 NUEVO: Lógica matemática para filtrar la lista antes de mostrarla
  const productosFiltrados = categoriaActiva === 'todas' 
    ? productos 
    : productos.filter(p => {
        const catId = p.categoria?.id || p.categoria_id;
        return catId === categoriaActiva;
      });

  return (
    <div className="productos-container">
      <h1 className="titulo">Catálogo ESSEN</h1>

      {/* --- PANEL ADMIN --- */}
      {isAdmin && (
        <div style={{ marginBottom: "20px", padding: "15px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, color: "#334155" }}>Modo Administrador</h3>
            {!mostrarForm && (
              <button onClick={() => setMostrarForm(true)} style={{ background: "#10b981", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                + Añadir Nuevo Producto
              </button>
            )}
          </div>

          {mostrarForm && (
            <form onSubmit={handleSubmit(onSubmitForm)} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px", background: "white", padding: "15px", borderRadius: "8px" }}>
              <h4>{editandoId ? "Editar Producto" : "Registrar Producto"}</h4>
              
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input {...register("nombre", { required: true })} placeholder="Nombre" style={{ flex: "1 1 200px", padding: "8px" }} />
                <input type="number" step="0.01" {...register("precio", { required: true })} placeholder="Precio (Bs)" style={{ flex: "1 1 100px", padding: "8px" }} />
                <input type="number" {...register("stock", { required: true })} placeholder="Stock" style={{ flex: "1 1 100px", padding: "8px" }} />
                
                {/* 🌟 AHORA EL ADMIN PUEDE ELEGIR LA CATEGORÍA AL CREAR */}
                <select {...register("categoriaId")} style={{ flex: "1 1 150px", padding: "8px" }}>
                  <option value="">Selecciona Categoría...</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              
              <input {...register("imagenUrl")} placeholder="URL de la imagen (Opcional)" style={{ padding: "8px" }} />
              <textarea {...register("descripcion")} placeholder="Descripción detallada" style={{ padding: "8px", minHeight: "60px" }} />
              
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" style={{ background: "#3b82f6", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px" }}>Guardar</button>
                <button type="button" onClick={() => { setMostrarForm(false); setEditandoId(null); reset(); }} style={{ background: "#ef4444", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px" }}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 🌟 BARRA DE FILTROS DE CATEGORÍAS (Para Clientes y Admins) */}
      {!cargando && !error && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "30px" }}>
          <button 
            onClick={() => setCategoriaActiva('todas')}
            style={{ 
              padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "bold", transition: "0.2s",
              background: categoriaActiva === 'todas' ? "#334155" : "#e2e8f0", 
              color: categoriaActiva === 'todas' ? "white" : "#475569" 
            }}
          >
            Ver Todo
          </button>
          
          {categorias.map(c => (
            <button 
              key={c.id}
              onClick={() => setCategoriaActiva(c.id)}
              style={{ 
                padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "bold", transition: "0.2s",
                background: categoriaActiva === c.id ? "#ea580c" : "#e2e8f0", // Naranja Essen cuando está activo
                color: categoriaActiva === c.id ? "white" : "#475569" 
              }}
            >
              {c.nombre}
            </button>
          ))}
        </div>
      )}

      {/* --- ESTADOS --- */}
      {cargando && <p className="productos-estado">Cargando catálogo...</p>}
      {!cargando && error && <p className="productos-error">{error}</p>}
      {!cargando && categoriaError && <p className="productos-error">{categoriaError}</p>}
      
      {/* --- GRILLA DE PRODUCTOS FILTRADOS --- */}
      {!cargando && !error && productosFiltrados.length === 0 && (
        <p className="productos-estado" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          No hay productos disponibles en esta categoría en este momento.
        </p>
      )}

      {!cargando && !error && productosFiltrados.length > 0 && (
        <div className="productos-grid">
          {/* Mapeamos el arreglo ya filtrado */}
          {productosFiltrados.map((p) => (
            <div className="producto-card" key={p.id}>
              <div className="img-container">
                <img src={p.img} alt={p.nombre} />
              </div>

              <div className="info">
                <h3>{p.nombre}</h3>
                {p.descripcion && <p className="descripcion" style={{ fontSize: "13px", color: "#64748b", margin: "8px 0" }}>{p.descripcion}</p>}
                <p className="precio">{p.precio.toFixed(2)} Bs</p>
                {typeof p.stock === "number" && (
                  <p className="stock" style={{ color: p.stock > 5 ? "#16a34a" : "#dc2626" }}>
                    {p.stock > 0 ? `Stock: ${p.stock}` : "Agotado"}
                  </p>
                )}
              </div>

              <button onClick={() => addToCart(p)} disabled={typeof p.stock === "number" && p.stock <= 0}>
                {typeof p.stock === "number" && p.stock <= 0 ? "Sin stock" : "Agregar al carrito"}
              </button>

              {isAdmin && (
                <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                  <button onClick={() => iniciarEdicion(p)} style={{ flex: 1, background: "#eab308", border: "none", padding: "6px", borderRadius: "4px" }}>Editar</button>
                  <button onClick={() => eliminarProducto(p.id)} style={{ flex: 1, background: "#ef4444", color: "white", border: "none", padding: "6px", borderRadius: "4px" }}>Eliminar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};