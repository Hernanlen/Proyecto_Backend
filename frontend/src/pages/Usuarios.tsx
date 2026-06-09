import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import zxcvbn from 'zxcvbn';
import api from '../services/api';
import './usuarios.css';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado: boolean;
}

interface UsuarioFormInputs {
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  rol: string;
}

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [fuerza, setFuerza] = useState(0);
  const [cargando, setCargando] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UsuarioFormInputs>();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const response = await api.get('/usuarios');
      const dataNormalizada = response.data.map((u: any) => ({
        ...u,
        estado: u.estado !== undefined ? u.estado : true 
      }));
      setUsuarios(dataNormalizada);
    } catch (error) {
      console.error('Error al cargar usuarios', error);
    } finally {
      setCargando(false);
    }
  };

  // 🌟 CORREGIDO: Usamos la interfaz correcta de Usuarios
  const onSubmitForm: SubmitHandler<UsuarioFormInputs> = async (data) => {
    try {
      const payload = { ...data };

      // EL TRUCO SALVAVIDAS: Si la contraseña está vacía, la borramos del paquete
      if (!payload.password || payload.password.trim() === "") {
        delete payload.password;
      }

      if (editandoId) {
        await api.patch(`/usuarios/${editandoId}`, payload);
        alert("Usuario actualizado con éxito");
      } else {
        await api.post("/usuarios", payload);
        alert("Usuario creado exitosamente");
      }

      // 🌟 CORREGIDO: Usamos las funciones que existen en este archivo
      cerrarModal();
      cargarUsuarios();

    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar el usuario.");
    }
  };

  const iniciarEdicion = (usuario: Usuario) => {
    setEditandoId(usuario.id);
    setValue('nombre', usuario.nombre);
    setValue('apellido', usuario.apellido);
    setValue('email', usuario.email);
    setValue('rol', usuario.rol);
    setIsModalOpen(true);
  };

  const eliminarUsuario = async (id: number) => {
    if (!window.confirm("⚠️ ADVERTENCIA: ¿Estás seguro de ELIMINAR permanentemente este usuario? Si tiene pedidos registrados, esto podría causar errores en la base de datos. Se recomienda usar 'Desactivar'.")) {
      return;
    }
    try {
      await api.delete(`/usuarios/${id}`);
      setUsuarios(usuarios.filter(u => u.id !== id));
      alert('Usuario eliminado permanentemente');
    } catch (error) {
      alert('Error al eliminar. Es posible que este usuario tenga pedidos vinculados y PostgreSQL bloquee el borrado por seguridad.');
    }
  };

  const toggleEstado = async (id: number, estadoActual: boolean) => {
    try {
      // await api.patch(`/usuarios/${id}`, { estado: !estadoActual });
      setUsuarios(usuarios.map(u => u.id === id ? { ...u, estado: !estadoActual } : u ));
    } catch (error) {
      alert('Error al cambiar el estado del usuario');
    }
  };

  const evaluarPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = zxcvbn(e.target.value);
    setFuerza(result.score);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditandoId(null);
    reset();
    setFuerza(0);
  };

  const niveles = ['Muy Débil', 'Débil', 'Intermedia', 'Fuerte', 'Muy Fuerte'];
  const colores = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14532d'];
  const activos = usuarios.filter(u => u.estado).length;

  const passwordRegister = register('password', { 
    required: editandoId ? false : "Contraseña obligatoria", 
    minLength: { value: 6, message: "Mínimo 6 caracteres" } 
  });

  if (cargando) return <p style={{ padding: '20px' }}>Cargando usuarios...</p>;

  return (
    <div className="usuarios-container">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="titulo" style={{ margin: 0 }}>Gestión de Usuarios</h2>
        <button 
          onClick={() => { cerrarModal(); setIsModalOpen(true); }}
          style={{ background: '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Agregar Usuario
        </button>
      </div>

      <div className="cards" style={{ marginBottom: '20px' }}>
        <div className="card-metric"><h4>Usuarios Activos</h4><p>{activos}</p></div>
        <div className="card-metric"><h4>Total Usuarios</h4><p>{usuarios.length}</p></div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b' }}>
              {editandoId ? '✏️ Editar Usuario' : 'Registrar Nuevo Usuario'}
            </h3>

            {/* 🌟 CORREGIDO: Apunta a onSubmitForm */}
            <form onSubmit={handleSubmit(onSubmitForm)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <input {...register('nombre', { required: "Requerido" })} placeholder="Nombre" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  {errors.nombre && <span style={{ color: 'red', fontSize: '12px' }}>{errors.nombre.message}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <input {...register('apellido', { required: "Requerido" })} placeholder="Apellido" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  {errors.apellido && <span style={{ color: 'red', fontSize: '12px' }}>{errors.apellido.message}</span>}
                </div>
              </div>

              <div>
                <input type="email" {...register('email', { required: "Correo obligatorio" })} placeholder="Correo electrónico" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</span>}
              </div>

              <div>
                <input 
                  type="password"
                  {...passwordRegister}
                  placeholder={editandoId ? "Nueva contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  onChange={(e) => {
                    passwordRegister.onChange(e);
                    evaluarPassword(e);
                  }}
                />
                <div style={{ color: colores[fuerza], fontSize: '12px', marginTop: '4px', fontWeight: 'bold' }}>
                  Seguridad: {niveles[fuerza]}
                </div>
                {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</span>}
              </div>

              <div>
                <select {...register('rol', { required: "Selecciona un rol" })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                  <option value="">Seleccione un Rol...</option>
                  <option value="admin">Administrador</option>
                  <option value="cliente">Cliente</option>
                </select>
                {errors.rol && <span style={{ color: 'red', fontSize: '12px' }}>{errors.rol.message}</span>}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#10b981', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                  {editandoId ? 'Actualizar' : 'Guardar'}
                </button>
                <button type="button" onClick={cerrarModal} style={{ flex: 1, background: '#ef4444', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cancelar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="tabla" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px' }}>Usuario</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Rol</th>
              <th style={{ padding: '12px' }}>Estado</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No hay usuarios registrados</td></tr>
            ) : (
              usuarios.map(u => (
                <tr key={u.id} className={!u.estado ? 'inactivo' : ''} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#334155' }}>{u.nombre} {u.apellido}</td>
                  <td style={{ padding: '12px' }}>{u.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`rol ${u.rol}`} style={{ background: u.rol === 'admin' ? '#fef08a' : '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>
                      {u.rol.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${u.estado ? 'activo' : 'inactivo'}`} style={{ color: u.estado ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
                      {u.estado ? '● Activo' : '○ Inactivo'}
                    </span>
                  </td>
                  
                  <td style={{ padding: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    
                    <button 
                      onClick={() => iniciarEdicion(u)}
                      style={{ background: '#f59e0b', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                      title="Editar Usuario"
                    >
                      ✏️ Editar
                    </button>

                    <button 
                      onClick={() => toggleEstado(u.id, u.estado)}
                      style={{ background: u.estado ? '#64748b' : '#10b981', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                      title={u.estado ? "Desactivar acceso" : "Permitir acceso"}
                    >
                      {u.estado ? '⛔ Suspender' : '✅ Activar'}
                    </button>

                    <button 
                      onClick={() => eliminarUsuario(u.id)}
                      style={{ background: '#ef4444', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                      title="Eliminar permanentemente"
                    >
                      🗑️ Eliminar
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};