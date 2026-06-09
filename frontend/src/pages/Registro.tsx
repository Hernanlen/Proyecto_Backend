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
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Crear Cuenta</h2>

        {/* NOMBRE */}
        <input
          {...register("nombre", { required: "El nombre es obligatorio" })}
          type="text"
          placeholder="Nombre"
        />
        {errors.nombre && <span className="error">{errors.nombre.message}</span>}

        {/* APELLIDO */}
        <input
          {...register("apellido", { required: "El apellido es obligatorio" })}
          type="text"
          placeholder="Apellido"
          style={{ marginTop: "10px" }}
        />
        {errors.apellido && <span className="error">{errors.apellido.message}</span>}

        {/* EMAIL */}
        <input
          {...register("email", {
            required: "El correo es obligatorio",
            pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" }
          })}
          type="email"
          placeholder="Correo electrónico"
          style={{ marginTop: "10px" }}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}

        {/* PASSWORD */}
        <input
          {...passwordRegister}
          type="password"
          placeholder="Crea una contraseña"
          style={{ marginTop: "10px" }}
          onChange={(e) => {
            passwordRegister.onChange(e);
            evaluarPassword(e);
          }}
        />
        <span style={{ color: colores[fuerzaPass], fontSize: "12px", display: "block", margin: "4px 0" }}>
          Seguridad: {niveles[fuerzaPass]}
        </span>
        {errors.password && <span className="error">{errors.password.message}</span>}

        {/* CONFIRMAR PASSWORD */}
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
          style={{ marginTop: "5px" }}
        />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}

        {/* CAPTCHA */}
        <div className="captcha" style={{ margin: "15px 0" }}>
          <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            onChange={() => setCaptchaValido(true)}
          />
        </div>

        <button type="submit" disabled={!captchaValido || cargando}>
          {cargando ? "Registrando..." : "Crear mi cuenta"}
        </button>

        <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}>
          ¿Ya tienes cuenta? <span onClick={() => navigate('/login')} style={{ color: "#3b82f6", cursor: "pointer", textDecoration: "underline" }}>Inicia sesión aquí</span>
        </p>

        <p onClick={() => navigate('/')} style={{ cursor: "pointer", marginTop: "10px", textAlign: "center", color: "#64748b" }}>
          ← Volver a la tienda
        </p>
      </form>
    </div>
  );
};