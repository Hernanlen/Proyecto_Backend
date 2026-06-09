import "./acerca.css";

export const Acerca = () => {
  return (
    <div className="acerca-container">

      {/* 🌟 ENCABEZADO */}
      <section className="acerca-header">
        <h1>Nuestra Historia: Revolucionando la Cocina</h1>
        <p className="subtitle">
          Más que ollas y sartenes, somos el punto de encuentro de la familia. 
          Descubre cómo una pasión por la metalurgia transformó la gastronomía hogareña.
        </p>
      </section>

      {/* 🏛️ SECCIÓN DE 3 COLUMNAS */}
      <section className="acerca-columnas">
        
        {/* Columna 1: Origen */}
        <div className="columna-card">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGPD6PyWKAgNybL8qcenYPPoorf_qQkrO04g&s" 
            alt="Tradición y metalurgia" 
          />
          <h3>Nuestros Orígenes</h3>
          <p>
            Nacimos en 1980 en Venado Tuerto, Santa Fe (Argentina). La visión de Wilder Yasci 
            y su familia fue aplicar su experiencia en la fundición de aluminio para crear 
            un producto innovador. Desde entonces, pasamos de ser una pequeña fundición a una 
            marca líder internacional, manteniendo siempre nuestra esencia artesanal y calidad inquebrantable.
          </p>
        </div>

        {/* Columna 2: Tecnología */}
        <div className="columna-card">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9ejl6Fe7tq_WIf9ISH0gZdT_Oqi0VtEzprQ&s" 
            alt="Cocción en proceso" 
          />
          <h3>El "Efecto Horno"</h3>
          <p>
            Nuestra mayor innovación. El grosor del aluminio fundido y el cierre perfecto de 
            nuestras tapas permiten que el calor se distribuya de manera uniforme. Esto significa 
            que puedes hornear, asar y freír directamente sobre la hornalla, ahorrando hasta 
            un 70% de gas y conservando todas las vitaminas y minerales de tus alimentos.
          </p>
        </div>

        {/* Columna 3: Propósito */}
        <div className="columna-card">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop" 
            alt="Compartiendo en familia" 
          />
          <h3>Propósito y Comunidad</h3>
          <p>
            Nuestra misión es fomentar la cultura de la comida casera, rica y saludable. 
            Creemos que el acto de cocinar es un acto de amor. Además, al diseñar piezas 
            que duran toda la vida, reducimos el impacto ambiental y fomentamos un consumo 
            responsable y sostenible en los hogares de toda Latinoamérica.
          </p>
        </div>

      </section>

      {/* 🤝 CIERRE */}
      <section className="acerca-footer">
        <h2>Únete a la familia ESSEN</h2>
        <p>
          Cada producto que llega a tu cocina es el resultado de décadas de perfeccionamiento, 
          diseñado para acompañarte en tus mejores momentos.
        </p>
      </section>

    </div>
  );
};