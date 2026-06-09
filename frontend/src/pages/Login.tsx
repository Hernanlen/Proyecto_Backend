import { useForm, SubmitHandler } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import zxcvbn from "zxcvbn";
import "./login.css";

// 1. Definimos la estructura exacta que esperamos del formulario
interface LoginFormInputs {
  email: string;
  password: string;
}

export const Login = () => {
  // Le pasamos la interfaz a useForm para un tipado estricto
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [captchaValido, setCaptchaValido] = useState(false);
  const [fuerzaPass, setFuerzaPass] = useState(0);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    if (!captchaValido) {
      alert("Completa el CAPTCHA");
      return;
    }

    const res = await login(data.email, data.password);

    if (res.success) {
      navigate("/");
    } else {
      // 2. Mostramos el mensaje de error EXACTO que nos envía NestJS
      alert(res.message || "Error al intentar iniciar sesión");
    }
  };

  const evaluarPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = zxcvbn(e.target.value);
    setFuerzaPass(result.score);
  };

  const niveles = ["Muy débil", "Débil", "Regular", "Fuerte", "Muy fuerte"];
  const colores = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#14532d"];

  // 3. Extraemos el registro del password para no generar conflictos con el onChange
  const passwordRegister = register("password", {
    required: "La contraseña es obligatoria",
    minLength: {
      value: 6,
      message: "Mínimo 6 caracteres"
    }
  });

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Iniciar Sesión</h2>

        {/* EMAIL */}
        <input
          {...register("email", {
            required: "El correo es obligatorio",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Correo inválido"
            }
          })}
          type="email"
          placeholder="Correo"
        />
        {errors.email && <span className="error">{errors.email.message}</span>}

        {/* PASSWORD */}
        <input
          {...passwordRegister}
          type="password"
          placeholder="Contraseña"
          onChange={(e) => {
            passwordRegister.onChange(e); // Mantiene funcionando la validación de react-hook-form
            evaluarPassword(e);           // Ejecuta tu medidor de fuerza visual
          }}
        />

        {/* BARRA DE FUERZA DE CONTRASEÑA */}
        <span style={{ color: colores[fuerzaPass], fontSize: "12px", display: "block", margin: "4px 0" }}>
          {niveles[fuerzaPass]}
        </span>
        {errors.password && <span className="error">{errors.password.message}</span>}

        {/* CAPTCHA */}
        <div className="captcha" style={{ margin: "15px 0" }}>
          <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            onChange={() => setCaptchaValido(true)}
          />
        </div>

        <button type="submit" disabled={!captchaValido}>
          Ingresar
        </button>

        <p onClick={() => navigate('/')} style={{ cursor: "pointer", marginTop: "15px", textAlign: "center" }}>
          ← Volver al inicio
        </p>
        <p onClick={() => navigate('/registro')} style={{ cursor: "pointer", marginTop: "10px", textAlign: "center", color: "#64748b" }}>
          ¿No tienes cuenta? Regístrate aquí
        </p>
      </form>
    </div>
  );
};