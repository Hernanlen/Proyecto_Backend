import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ReCAPTCHA from "react-google-recaptcha";
import zxcvbn from "zxcvbn";
import "./login.css"; // Reutiliza los estilos del login

// 1. Agregamos nombre y apellido a la interfaz de TypeScript
interface RegistroFormInputs {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Registro = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegistroFormInputs>();
  const navigate = useNavigate();

  const [captchaValido, setCaptchaValido] = useState(false);
  const [fuerzaPass, setFuerzaPass] = useState(0);
  const [cargando, setCargando] = useState(false);

  const onSubmit: SubmitHandler<RegistroFormInputs> = async (data) => {
    if (!captchaValido) {
      alert("Por favor, completa el CAPTCHA");
      return;
    }

    try {
      setCargando(true);
      
      // 2. Enviamos el nombre y apellido hacia NestJS junto con las credenciales
      await api.post("/usuarios", {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: data.password,
        rol: "cliente" // Sigue registrándose por defecto como cliente
      });

      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      navigate("/login");

    } catch (error: any) {
      console.error("Error al registrar", error);
      alert(error.response?.data?.message || "Hubo un error al crear tu cuenta. Tal vez el correo ya existe.");
    } finally {
      setCargando(false);
    }
  };

  const evaluarPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = zxcvbn(e.target.value);
    setFuerzaPass(result.score);
  };

  const niveles = ["Muy débil", "Débil", "Regular", "Fuerte", "Muy fuerte"];
  const colores = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#14532d"];

  const passwordRegister = register("password", {
    required: "La contraseña es obligatoria",
    minLength: { value: 6, message: "Mínimo 6 caracteres" }
  });

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <div className="logo-icon">🍳</div>
          <h2>Crear Cuenta</h2>
          <p>Únete a la comunidad ESSEN Premium</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* NOMBRE */}
          <div className="input-group">
            <label>Nombre completo</label>
            <input
              {...register("nombre", { required: "El nombre es obligatorio" })}
              type="text"
              placeholder="Tu nombre"
              className={errors.nombre ? "error-input" : ""}
            />
            {errors.nombre && <span className="error-message">{errors.nombre.message}</span>}
          </div>

          {/* APELLIDO */}
          <div className="input-group">
            <label>Apellido</label>
            <input
              {...register("apellido", { required: "El apellido es obligatorio" })}
              type="text"
              placeholder="Tu apellido"
              className={errors.apellido ? "error-input" : ""}
            />
            {errors.apellido && <span className="error-message">{errors.apellido.message}</span>}
          </div>

          {/* EMAIL */}
          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" }
              })}
              type="email"
              placeholder="tu@email.com"
              className={errors.email ? "error-input" : ""}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Contraseña</label>
            <input
              {...passwordRegister}
              type="password"
              placeholder="Crea una contraseña segura"
              className={errors.password ? "error-input" : ""}
              onChange={(e) => {
                passwordRegister.onChange(e);
                evaluarPassword(e);
              }}
            />
            {watch('password') && watch('password').length > 0 && (
              <div className="password-strength">
                <div className="strength-bar-container">
                  <div 
                    className="strength-bar" 
                    style={{ 
                      width: `${(fuerzaPass + 1) * 20}%`, 
                      backgroundColor: colores[fuerzaPass],
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                <span className="strength-text" style={{ color: colores[fuerzaPass] }}>
                  🔒 {niveles[fuerzaPass]}
                </span>
              </div>
            )}
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          {/* CONFIRMAR PASSWORD */}
          <div className="input-group">
            <label>Confirmar contraseña</label>
            <input
              {...register("confirmPassword", {
                required: "Debes confirmar tu contraseña",
                validate: (val: string) => {
                  if (watch('password') !== val) {
                    return "Las contraseñas no coinciden";
                  }
                },
              })}
              type="password"
              placeholder="Repite tu contraseña"
              className={errors.confirmPassword ? "error-input" : ""}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
          </div>

          {/* CAPTCHA */}
          <div className="captcha-container">
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={() => setCaptchaValido(true)}
            />
          </div>

          {/* BOTÓN DE REGISTRO */}
          <button 
            type="submit" 
            disabled={!captchaValido || cargando}
            className="btn-registro"
          >
            {cargando ? (
              <span className="loading-spinner">⌛</span>
            ) : (
              <span>✨</span>
            )}
            {cargando ? "Registrando..." : "Crear mi cuenta"}
          </button>

          {/* ENLACES ADICIONALES */}
          <div className="registro-footer">
            <p>
              ¿Ya tienes cuenta? 
              <span onClick={() => navigate('/login')} className="link-login">
                Inicia sesión aquí
              </span>
            </p>
            <p onClick={() => navigate('/')} className="link-back">
              ← Volver a la tienda
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};