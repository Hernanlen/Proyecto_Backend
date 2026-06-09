import { useNavigate } from "react-router-dom";
import "./home.css";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* 🎯 HERO */}
      <section className="hero">
        <div className="hero-text">
          <h2>Transforma tu cocina en un espacio de alta gama</h2>
          <p>
            Descubre el secreto de la cocción perfecta. Nuestros utensilios de aluminio fundido 
            distribuyen el calor de manera uniforme, permitiéndote cocinar más sano, 
            ahorrando gas y realzando los sabores naturales de tus alimentos. 
            Calidad heredada que dura toda la vida.
          </p>
          <button onClick={() => navigate('/productos')}>
            Explorar Colección Premium
          </button>
        </div>
      </section>

      {/* 🧱 CATEGORÍAS */}
      <section className="categorias">
        <h2>Nuestras Líneas Exclusivas</h2>
        <div className="grid">

          <div className="card" onClick={() => navigate('/productos')}>
            <div className="card-image-container">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs5di8Q6I42rfaiXtoW98b6VQxFixZvjH8Eg&s" alt="Ollas de alta gama" />
            </div>
            <h3>Ollas y Cacerolas</h3>
            <p>
              El corazón de tu cocina. Diseñadas con cierre hermético que permite el "efecto horno", 
              conservando los nutrientes y vitaminas de tus vegetales sin necesidad de usar exceso de agua o aceite. 
              Ideales para guisos, carnes y cocciones lentas.
            </p>
          </div>

          <div className="card" onClick={() => navigate('/productos')}>
            <div className="card-image-container">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcAYaxyGLh91eEcjy11Job6FX4m6dahRt_rw&s" alt="Sartenes profesionales" />
            </div>
            <h3>Sartenes y Woks</h3>
            <p>
              Salteados perfectos y carnes selladas en su punto justo. Nuestra tecnología antiadherente 
              de última generación facilita una limpieza rápida y te permite cocinar con el mínimo de grasas, 
              cuidando la salud de tu familia todos los días.
            </p>
          </div>

          <div className="card" onClick={() => navigate('/productos')}>
            <div className="card-image-container">
              <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop" alt="Bazar y accesorios" />
            </div>
            <h3>Complementos y Bazar</h3>
            <p>
              Las herramientas precisas diseñadas para el chef moderno. Desde espátulas de silicona 
              resistentes al calor que protegen tu antiadherente, hasta utensilios ergonómicos que 
              hacen que la preparación de tus recetas sea un verdadero placer.
            </p>
          </div>

        </div>
      </section>

      {/* ⭐ BENEFICIOS */}
      <section className="beneficios">
        <div className="beneficio">
          <div className="icon">🚚</div>
          <h3>Logística y Envíos Seguros</h3>
          <p>Llevamos la excelencia hasta la puerta de tu hogar de forma rápida y segura, para que puedas empezar a cocinar diferente cuanto antes.</p>
        </div>

        <div className="beneficio">
          <div className="icon">💳</div>
          <h3>Facilidades de Pago</h3>
          <p>Invertir en tu cocina nunca fue tan simple. Aceptamos pagos mediante código QR, transferencias bancarias directas o pago contra entrega.</p>
        </div>

        <div className="beneficio">
          <div className="icon">🔥</div>
          <h3>Garantía de Por Vida</h3>
          <p>Piezas robustas diseñadas para pasar de generación en generación. El aluminio de alta pureza asegura una resistencia inigualable al paso del tiempo.</p>
        </div>
      </section>

      {/* 📢 CTA FINAL */}
      <section className="cta">
        <div className="cta-content">
          <h2>¿Listo para elevar tus recetas al siguiente nivel?</h2>
          <p>Únete a las miles de familias que ya disfrutan de una cocina más rápida, rica y económica gracias a nuestra tecnología de cocción.</p>
          <button onClick={() => navigate('/productos')}>
            Ver Catálogo Completo
          </button>
        </div>
      </section>

      {/* 🔻 FOOTER */}
      <footer className="footer">
        <div className="footer-links">
          <span>Términos y Condiciones</span> | <span>Cuidado de tus Piezas</span> | <span>Contacto</span>
        </div>
        <p>© 2026 ESSEN Premium Kitchen - Inspirando Momentos en la Cocina</p>
      </footer>

    </div>
  );
};