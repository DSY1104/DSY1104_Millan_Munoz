/*
===========================================
JAVASCRIPT PARA DETALLE DE ARTÍCULO
===========================================
*/

// Contenido completo de los artículos
const articleContent = {
  1: {
    title: "Los mejores auriculares gaming de 2024",
    category: "reviews",
    date: "2024-09-10",
    readingTime: "5 min",
    image:
      "https://via.placeholder.com/800x300/1e90ff/ffffff?text=Auriculares+Gaming",
    content: `
      <h2>La revolución del audio gaming</h2>
      <p>El mundo del gaming ha evolucionado enormemente en los últimos años, y el audio no se ha quedado atrás. Los auriculares gaming de 2024 ofrecen una experiencia sonora inmersiva que puede marcar la diferencia entre la victoria y la derrota.</p>
      
      <h2>Características que debes buscar</h2>
      <p>Al elegir auriculares gaming, es fundamental considerar varios aspectos clave. La calidad del sonido 7.1 surround te permitirá localizar enemigos con precisión, mientras que un micrófono de alta calidad asegurará una comunicación clara con tu equipo.</p>
      
      <p>La comodidad también es crucial, especialmente durante sesiones de gaming prolongadas. Los mejores auriculares cuentan con almohadillas de memory foam y diademas ajustables que distribuyen el peso de manera uniforme.</p>
      
      <h2>Nuestras recomendaciones top</h2>
      <p>Después de exhaustivas pruebas, hemos seleccionado los modelos que destacan por su excelente relación calidad-precio, innovación tecnológica y satisfacción del usuario. Cada uno ofrece características únicas que los hacen ideales para diferentes tipos de gamers.</p>
      
      <p>Ya seas un competidor profesional que necesita la máxima precisión sonora, o un casual gamer que busca una experiencia inmersiva, tenemos la opción perfecta para ti en nuestra selección.</p>
    `,
  },
  2: {
    title: "Guía completa para configurar tu setup gaming",
    category: "guias",
    date: "2024-09-08",
    readingTime: "8 min",
    image:
      "https://via.placeholder.com/800x300/39ff14/000000?text=Setup+Gaming",
    content: `
      <h2>Creando el espacio perfecto</h2>
      <p>Un buen setup gaming va más allá de tener componentes potentes. Se trata de crear un ambiente que potencie tu rendimiento y haga que cada sesión de juego sea memorable.</p>
      
      <h2>Ergonomía: La base de todo</h2>
      <p>La ergonomía es fundamental para mantener la salud durante largas sesiones de gaming. Una silla gaming de calidad, un escritorio a la altura adecuada y una posición correcta del monitor pueden prevenir lesiones y mejorar tu concentración.</p>
      
      <h2>Iluminación RGB inteligente</h2>
      <p>La iluminación RGB no es solo estética; puede mejorar la atmósfera de juego y reducir la fatiga visual. Aprende a configurar perfiles de color que complementen tus juegos favoritos y creen la ambientación perfecta.</p>
      
      <h2>Organización y gestión de cables</h2>
      <p>Un setup organizado no solo se ve profesional, sino que también facilita el mantenimiento y mejora el flujo de aire. Te enseñamos las mejores técnicas para manejar cables y mantener tu espacio limpio y funcional.</p>
    `,
  },
  3: {
    title: "Nuevos lanzamientos de monitores 4K para gaming",
    category: "noticias",
    date: "2024-09-05",
    readingTime: "4 min",
    image:
      "https://via.placeholder.com/800x300/ff6b35/ffffff?text=Monitores+4K",
    content: `
      <h2>La era del 4K gaming ha llegado</h2>
      <p>Los nuevos monitores 4K para gaming están redefiniendo los estándares de calidad visual. Con tasas de refresco de hasta 144Hz y tecnologías HDR avanzadas, estos displays ofrecen una experiencia visual sin precedentes.</p>
      
      <h2>Tecnologías destacadas</h2>
      <p>Los monitores de este año incorporan tecnologías como OLED, Mini-LED y Quantum Dot que proporcionan colores más vibrantes, negros más profundos y un contraste excepcional. Además, la compatibilidad con G-Sync y FreeSync elimina el tearing y stuttering.</p>
      
      <h2>Disponibilidad y precios</h2>
      <p>Aunque inicialmente los precios eran prohibitivos, la competencia ha hecho que los monitores 4K gaming sean más accesibles. En LevelUp encontrarás las mejores ofertas y opciones de financiamiento para hacer realidad tu setup soñado.</p>
    `,
  },
  4: {
    title: "Review: Teclado mecánico RGB para pros",
    category: "reviews",
    date: "2024-09-03",
    readingTime: "6 min",
    image: "https://via.placeholder.com/800x300/9d4edd/ffffff?text=Teclado+RGB",
    content: `
      <h2>Análisis completo del teclado definitivo</h2>
      <p>Este teclado mecánico RGB representa la evolución natural de los periféricos gaming. Con switches personalizados, retroiluminación avanzada y construcción premium, está diseñado para satisfacer las demandas más exigentes.</p>
      
      <h2>Rendimiento en competición</h2>
      <p>Durante nuestras pruebas intensivas, el teclado demostró una respuesta excepcional con tiempos de actuación de apenas 1ms. Los switches proporcionan un feedback táctil perfecto que mejora significativamente la precisión en juegos competitivos.</p>
      
      <h2>Personalización sin límites</h2>
      <p>El software incluido permite personalizar cada tecla individualmente, crear macros complejas y sincronizar la iluminación con otros periféricos. La configuración por perfiles hace que adaptarse a diferentes juegos sea instantáneo.</p>
      
      <h2>Veredicto final</h2>
      <p>Con una construcción sólida, características premium y un precio competitivo, este teclado se posiciona como una excelente inversión para gamers serios que buscan llevar su rendimiento al siguiente nivel.</p>
    `,
  },
  5: {
    title: "Evento LevelUp: Torneo de gaming",
    category: "eventos",
    date: "2024-08-30",
    readingTime: "3 min",
    image:
      "https://via.placeholder.com/800x300/f72585/ffffff?text=Torneo+Gaming",
    content: `
      <h2>El evento gaming del año</h2>
      <p>LevelUp se enorgullece en presentar el torneo de gaming más espectacular de la temporada. Con premios valorados en más de $50,000 y la participación de los mejores equipos profesionales del país.</p>
      
      <h2>Modalidades y categorías</h2>
      <p>El torneo incluirá competencias en múltiples títulos: CS2, League of Legends, Valorant y FIFA 24. Habrá categorías para profesionales, semi-profesionales y amateurs, asegurando que todos puedan participar.</p>
      
      <h2>Cómo participar</h2>
      <p>Las inscripciones están abiertas hasta el 15 de septiembre. Visita nuestro sitio web, completa tu registro y prepárate para la competencia más emocionante del año. ¡Los cupos son limitados!</p>
      
      <h2>Premios y reconocimientos</h2>
      <p>Además de los premios en efectivo, los ganadores recibirán equipamiento gaming de última generación, contratos de patrocinio y la oportunidad de representar a LevelUp en competencias internacionales.</p>
    `,
  },
  6: {
    title: "Top 10 juegos más esperados",
    category: "gaming",
    date: "2024-08-28",
    readingTime: "7 min",
    image:
      "https://via.placeholder.com/800x300/4cc9f0/000000?text=Top+10+Juegos",
    content: `
      <h2>Los títulos que definirán el gaming</h2>
      <p>El 2024 promete ser un año excepcional para los videojuegos. Desde secuelas muy esperadas hasta nuevas IPs que prometen revolucionar sus géneros, nuestra lista incluye los títulos que no puedes perderte.</p>
      
      <h2>Innovación en cada género</h2>
      <p>Veremos avances significativos en inteligencia artificial, gráficos ray-tracing y mecánicas de gameplay innovadoras. Los desarrolladores están aprovechando al máximo el hardware de nueva generación para crear experiencias únicas.</p>
      
      <h2>Lo que viene en los próximos meses</h2>
      <p>Desde RPGs épicos hasta shooters revolucionarios, cada mes traerá nuevos lanzamientos que mantendrán a los gamers pegados a sus pantallas. Prepara tu wishlist y tu presupuesto porque será un año costoso para los fanáticos.</p>
      
      <h2>Reservas y ediciones especiales</h2>
      <p>En LevelUp ya tenemos disponibles las reservas para los títulos más esperados. No te quedes sin tu copia y aprovecha nuestras ofertas exclusivas para pre-orders.</p>
    `,
  },
  // Agregar más contenido según sea necesario
};

// Variables globales
let currentArticle = null;

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  loadArticle();
});

// Cargar artículo desde localStorage o URL
function loadArticle() {
  // Intentar cargar desde localStorage primero
  const storedArticle = localStorage.getItem("currentArticle");

  if (storedArticle) {
    currentArticle = JSON.parse(storedArticle);
    renderArticle();
  } else {
    // Si no hay artículo guardado, extraer ID de la URL
    const urlPath = window.location.pathname;
    const match = urlPath.match(/post-(\d+)\.html/);

    if (match) {
      const articleId = parseInt(match[1]);
      loadArticleById(articleId);
    } else {
      showError();
    }
  }
}

// Cargar artículo por ID
function loadArticleById(id) {
  // En una aplicación real, esto haría una petición al servidor
  // Por ahora, usamos datos locales
  const articleData = articleContent[id];

  if (articleData) {
    currentArticle = {
      id,
      ...articleData,
    };
    renderArticle();
  } else {
    showError();
  }
}

// Renderizar artículo
function renderArticle() {
  if (!currentArticle) {
    showError();
    return;
  }

  const articleContainer = document.getElementById("article-content");
  const loadingIndicator = articleContainer.querySelector(".loading-indicator");

  // Ocultar indicador de carga
  loadingIndicator.style.display = "none";

  // Actualizar título de la página
  document.title = `${currentArticle.title} - LevelUp Blog`;

  // Crear contenido del artículo
  const articleHTML = `
    <div class="article-hero">
      <img src="${currentArticle.image}" 
           alt="Imagen del artículo: ${currentArticle.title}"
           loading="eager">
    </div>
    
    <div class="article-meta-detail">
      <div>
        <span class="article-category">${getCategoryName(
          currentArticle.category
        )}</span>
        <h1 class="article-title">${currentArticle.title}</h1>
      </div>
      <div>
        <time class="article-date" datetime="${currentArticle.date}">
          ${formatDate(currentArticle.date)}
        </time>
        <span class="article-reading-time">📖 ${
          currentArticle.readingTime
        }</span>
      </div>
    </div>
    
    <div class="article-content-detail">
      ${currentArticle.content}
    </div>
  `;

  articleContainer.innerHTML = articleHTML;

  // Cargar artículos relacionados
  loadRelatedArticles();
}

// Cargar artículos relacionados
function loadRelatedArticles() {
  if (!currentArticle) return;

  // Simular artículos relacionados (en una app real vendría del servidor)
  const relatedArticles = [
    {
      id: 4,
      title: "Review: Teclado mecánico RGB para pros",
      description:
        "Probamos el último teclado mecánico RGB diseñado para jugadores profesionales.",
      category: "reviews",
      date: "2024-09-03",
      image:
        "https://via.placeholder.com/400x200/9d4edd/ffffff?text=Teclado+RGB",
      readingTime: "6 min",
    },
    {
      id: 5,
      title: "Evento LevelUp: Torneo de gaming",
      description: "¡Prepárate para el torneo de gaming más grande del año!",
      category: "eventos",
      date: "2024-08-30",
      image:
        "https://via.placeholder.com/400x200/f72585/ffffff?text=Torneo+Gaming",
      readingTime: "3 min",
    },
  ];

  const relatedContainer = document.getElementById(
    "related-articles-container"
  );
  const relatedHTML = relatedArticles
    .map((article) => createRelatedArticleCard(article))
    .join("");
  relatedContainer.innerHTML = relatedHTML;

  // Agregar event listeners
  setupRelatedArticleListeners();
}

// Crear tarjeta de artículo relacionado
function createRelatedArticleCard(article) {
  return `
    <article class="article-card" 
             data-article-id="${article.id}"
             tabindex="0"
             role="button"
             aria-label="Leer artículo relacionado: ${article.title}">
      <div class="article-image">
        <img src="${article.image}" 
             alt="Imagen del artículo: ${article.title}"
             loading="lazy">
      </div>
      
      <div class="article-content">
        <div class="article-meta">
          <span class="article-category">${getCategoryName(
            article.category
          )}</span>
          <time class="article-date" datetime="${article.date}">
            ${formatDate(article.date)}
          </time>
        </div>
        
        <h3 class="article-title">${article.title}</h3>
        <p class="article-description">${article.description}</p>
        
        <div class="article-footer">
          <button class="read-more-btn">Leer más</button>
          <span class="article-reading-time">📖 ${article.readingTime}</span>
        </div>
      </div>
    </article>
  `;
}

// Configurar listeners para artículos relacionados
function setupRelatedArticleListeners() {
  const relatedCards = document.querySelectorAll(
    "#related-articles-container .article-card"
  );

  relatedCards.forEach((card) => {
    card.addEventListener("click", handleRelatedArticleClick);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleRelatedArticleClick(event);
      }
    });
  });
}

// Manejar click en artículo relacionado
function handleRelatedArticleClick(event) {
  const articleId = event.currentTarget.getAttribute("data-article-id");

  // Actualizar URL y cargar nuevo artículo
  const newUrl = `post-${articleId.padStart(2, "0")}.html`;
  window.history.pushState({}, "", newUrl);

  loadArticleById(parseInt(articleId));

  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Mostrar error
function showError() {
  const articleContainer = document.getElementById("article-content");
  articleContainer.innerHTML = `
    <div class="empty-state active">
      <h3>Artículo no encontrado</h3>
      <p>Lo sentimos, el artículo que buscas no está disponible.</p>
      <a href="../index.html" class="back-button">Volver al blog</a>
    </div>
  `;
}

// Formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("es-ES", options);
}

// Obtener nombre de categoría
function getCategoryName(category) {
  const categoryNames = {
    gaming: "Gaming",
    reviews: "Reviews",
    noticias: "Noticias",
    guias: "Guías",
    eventos: "Eventos",
  };
  return categoryNames[category] || category;
}

// Limpiar localStorage al salir
window.addEventListener("beforeunload", function () {
  // Solo limpiar si vamos a otra página que no sea del blog
  if (!document.referrer.includes("/blog/")) {
    localStorage.removeItem("currentArticle");
  }
});
