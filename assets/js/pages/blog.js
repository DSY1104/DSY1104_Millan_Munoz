/*
===========================================
JAVASCRIPT PARA PÁGINA DE BLOG
===========================================
*/

// Datos de artículos placeholder
const blogArticles = [
  {
    id: 1,
    title: "Los mejores auriculares gaming de 2024",
    description:
      "Descubre nuestra selección de auriculares gaming que te darán la ventaja competitiva que necesitas. Desde audio 7.1 hasta cancelación de ruido.",
    category: "reviews",
    date: "2024-09-10",
    image:
      "https://via.placeholder.com/400x200/1e90ff/ffffff?text=Auriculares+Gaming",
    featured: true,
    readingTime: "5 min",
    slug: "mejores-auriculares-gaming-2024",
  },
  {
    id: 2,
    title: "Guía completa para configurar tu setup gaming",
    description:
      "Todo lo que necesitas saber para crear el setup gaming perfecto. Desde la iluminación RGB hasta la ergonomía del espacio de trabajo.",
    category: "guias",
    date: "2024-09-08",
    image:
      "https://via.placeholder.com/400x200/39ff14/000000?text=Setup+Gaming",
    featured: false,
    readingTime: "8 min",
    slug: "guia-setup-gaming-perfecto",
  },
  {
    id: 3,
    title: "Nuevos lanzamientos de monitores 4K para gaming",
    description:
      "Los monitores 4K más esperados del año ya están aquí. Conoce sus especificaciones, precios y disponibilidad en LevelUp.",
    category: "noticias",
    date: "2024-09-05",
    image:
      "https://via.placeholder.com/400x200/ff6b35/ffffff?text=Monitores+4K",
    featured: false,
    readingTime: "4 min",
    slug: "nuevos-monitores-4k-gaming",
  },
  {
    id: 4,
    title: "Review: Teclado mecánico RGB para pros",
    description:
      "Probamos el último teclado mecánico RGB diseñado para jugadores profesionales. ¿Vale la pena la inversión?",
    category: "reviews",
    date: "2024-09-03",
    image: "https://via.placeholder.com/400x200/9d4edd/ffffff?text=Teclado+RGB",
    featured: false,
    readingTime: "6 min",
    slug: "review-teclado-mecanico-rgb",
  },
  {
    id: 5,
    title: "Evento LevelUp: Torneo de gaming",
    description:
      "¡Prepárate para el torneo de gaming más grande del año! Premios increíbles, competencia épica y diversión garantizada.",
    category: "eventos",
    date: "2024-08-30",
    image:
      "https://via.placeholder.com/400x200/f72585/ffffff?text=Torneo+Gaming",
    featured: false,
    readingTime: "3 min",
    slug: "evento-torneo-gaming-levelup",
  },
  {
    id: 6,
    title: "Top 10 juegos más esperados",
    description:
      "Los juegos que todo gamer está esperando. Desde AAA hasta indies prometedores que marcarán tendencia este año.",
    category: "gaming",
    date: "2024-08-28",
    image:
      "https://via.placeholder.com/400x200/4cc9f0/000000?text=Top+10+Juegos",
    featured: false,
    readingTime: "7 min",
    slug: "top-10-juegos-mas-esperados",
  },
  {
    id: 7,
    title: "Cómo optimizar tu PC para gaming",
    description:
      "Consejos profesionales para sacar el máximo rendimiento de tu PC gaming sin gastar una fortuna en actualizaciones.",
    category: "guias",
    date: "2024-08-25",
    image:
      "https://via.placeholder.com/400x200/7209b7/ffffff?text=Optimizar+PC",
    featured: false,
    readingTime: "10 min",
    slug: "optimizar-pc-gaming",
  },
  {
    id: 8,
    title: "Las mejores ofertas de gaming este mes",
    description:
      "No te pierdas las ofertas más increíbles en productos gaming. Descuentos especiales solo por tiempo limitado.",
    category: "noticias",
    date: "2024-08-22",
    image:
      "https://via.placeholder.com/400x200/f77f00/ffffff?text=Ofertas+Gaming",
    featured: true,
    readingTime: "4 min",
    slug: "mejores-ofertas-gaming-mes",
  },
];

// Variables globales
let filteredArticles = [...blogArticles];
let currentCategory = "all";
let currentSort = "date-desc";

// Elementos DOM
const articlesContainer = document.getElementById("articles-container");
const categoryFilter = document.getElementById("category-filter");
const sortSelect = document.getElementById("sort-select");
const loadingIndicator = document.getElementById("loading-indicator");
const emptyState = document.getElementById("empty-state");

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
  renderArticles();
});

// Configurar event listeners
function setupEventListeners() {
  categoryFilter.addEventListener("change", handleCategoryFilter);
  sortSelect.addEventListener("change", handleSort);
}

// Manejar filtro por categoría
function handleCategoryFilter(event) {
  currentCategory = event.target.value;
  filterAndRenderArticles();
}

// Manejar ordenamiento
function handleSort(event) {
  currentSort = event.target.value;
  filterAndRenderArticles();
}

// Filtrar y renderizar artículos
function filterAndRenderArticles() {
  showLoading();

  // Simular una pequeña carga para mejor UX
  setTimeout(() => {
    filterArticles();
    sortArticles();
    renderArticles();
    hideLoading();
  }, 300);
}

// Filtrar artículos por categoría
function filterArticles() {
  if (currentCategory === "all") {
    filteredArticles = [...blogArticles];
  } else {
    filteredArticles = blogArticles.filter(
      (article) => article.category === currentCategory
    );
  }
}

// Ordenar artículos
function sortArticles() {
  switch (currentSort) {
    case "date-desc":
      filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "date-asc":
      filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case "title-asc":
      filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "title-desc":
      filteredArticles.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }
}

// Renderizar artículos
function renderArticles() {
  if (filteredArticles.length === 0) {
    showEmptyState();
    return;
  }

  hideEmptyState();

  const articlesHTML = filteredArticles
    .map((article) => createArticleCard(article))
    .join("");
  articlesContainer.innerHTML = articlesHTML;

  // Agregar event listeners a las tarjetas
  setupArticleCardListeners();
}

// Crear tarjeta de artículo
function createArticleCard(article) {
  const formattedDate = formatDate(article.date);
  const featuredClass = article.featured ? "featured" : "";

  return `
    <article class="article-card ${featuredClass}" 
             data-article-id="${article.id}"
             tabindex="0"
             role="button"
             aria-label="Leer artículo: ${article.title}">
      <div class="article-image">
        <img src="${article.image}" 
             alt="Imagen del artículo: ${article.title}"
             loading="lazy">
      </div>
      
      <div class="article-content">
        <div class="article-meta">
          <span class="article-category" aria-label="Categoría: ${getCategoryName(
            article.category
          )}">
            ${getCategoryName(article.category)}
          </span>
          <time class="article-date" datetime="${
            article.date
          }" aria-label="Fecha de publicación: ${formattedDate}">
            ${formattedDate}
          </time>
        </div>
        
        <h2 class="article-title">${article.title}</h2>
        <p class="article-description">${article.description}</p>
        
        <div class="article-footer">
          <button class="read-more-btn" 
                  aria-label="Leer más sobre: ${article.title}">
            Leer más
          </button>
          <span class="article-reading-time" aria-label="Tiempo de lectura: ${
            article.readingTime
          }">
            📖 ${article.readingTime}
          </span>
        </div>
      </div>
    </article>
  `;
}

// Configurar listeners para las tarjetas de artículos
function setupArticleCardListeners() {
  const articleCards = document.querySelectorAll(".article-card");

  articleCards.forEach((card) => {
    // Click handler
    card.addEventListener("click", handleArticleClick);

    // Keyboard handler
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleArticleClick(event);
      }
    });
  });
}

// Manejar click en artículo
function handleArticleClick(event) {
  const articleId = event.currentTarget.getAttribute("data-article-id");
  const article = blogArticles.find((a) => a.id === parseInt(articleId));

  if (article) {
    navigateToArticle(article);
  }
}

// Navegar al detalle del artículo
function navigateToArticle(article) {
  // Guardar artículo en localStorage para la página de detalle
  localStorage.setItem("currentArticle", JSON.stringify(article));

  // Navegar a la página de detalle
  window.location.href = `posts/post-${article.id
    .toString()
    .padStart(2, "0")}.html`;
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

// Mostrar estado de carga
function showLoading() {
  loadingIndicator.classList.add("active");
  loadingIndicator.setAttribute("aria-hidden", "false");
  articlesContainer.style.opacity = "0.5";
}

// Ocultar estado de carga
function hideLoading() {
  loadingIndicator.classList.remove("active");
  loadingIndicator.setAttribute("aria-hidden", "true");
  articlesContainer.style.opacity = "1";
}

// Mostrar estado vacío
function showEmptyState() {
  emptyState.classList.add("active");
  emptyState.setAttribute("aria-hidden", "false");
  articlesContainer.innerHTML = "";
}

// Ocultar estado vacío
function hideEmptyState() {
  emptyState.classList.remove("active");
  emptyState.setAttribute("aria-hidden", "true");
}

// Función para buscar artículos (para futura implementación)
function searchArticles(query) {
  if (!query.trim()) {
    filteredArticles = [...blogArticles];
  } else {
    filteredArticles = blogArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
    );
  }
  sortArticles();
  renderArticles();
}

// Función para añadir nuevo artículo (para administradores)
function addArticle(newArticle) {
  const articleWithId = {
    ...newArticle,
    id: Math.max(...blogArticles.map((a) => a.id)) + 1,
    date: new Date().toISOString().split("T")[0],
  };

  blogArticles.unshift(articleWithId);
  filterAndRenderArticles();

  console.log("Nuevo artículo añadido:", articleWithId);
}

// Exportar funciones para uso global
window.BlogPage = {
  searchArticles,
  addArticle,
  blogArticles,
};
