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
    date: "2025-09-10",
    image: "../../assets/image/blog/audio.webp",
    featured: true,
    readingTime: "5 min",
    slug: "auriculares-gaming-2025",
  },
  {
    id: 2,
    title: "Guía completa para configurar tu setup gaming",
    description:
      "Todo lo que necesitas saber para crear el setup gaming perfecto. Desde la iluminación RGB hasta la ergonomía del espacio de trabajo.",
    category: "guias",
    date: "2025-09-08",
    image: "../../assets/image/blog/pc.webp",
    featured: false,
    readingTime: "8 min",
    slug: "setup-gaming-completo",
  },
  {
    id: 3,
    title: "Nuevos lanzamientos de monitores 4K para gaming",
    description:
      "Los monitores 4K más esperados del año ya están aquí. Conoce sus especificaciones, precios y disponibilidad en LevelUp.",
    category: "noticias",
    date: "2025-09-05",
    image: "../../assets/image/blog/monitor.webp",
    featured: false,
    readingTime: "4 min",
    slug: "monitores-4k-gaming",
  },
  {
    id: 4,
    title: "Borderlands 4: Todo lo que sabemos sobre el esperado shooter-RPG",
    description:
      "Gearbox Software regresa con una nueva aventura épica llena de acción, humor y millones de armas. Descubre todas las novedades.",
    category: "gaming",
    date: "2025-09-11",
    image: "../../assets/image/blog/games.webp",
    featured: true,
    readingTime: "6 min",
    slug: "borderlands-4-preview",
  },
  {
    id: 5,
    title:
      "Review: PlayStation 5 Pro - La consola definitiva para gamers exigentes",
    description:
      "Sony eleva el listón con su nueva consola de gama alta. Después de semanas de pruebas intensivas, te contamos si vale la pena.",
    category: "reviews",
    date: "2025-09-10",
    image: "../../assets/image/blog/ps5.webp",
    featured: false,
    readingTime: "8 min",
    slug: "ps5-pro-review",
  },
  {
    id: 6,
    title: "Gaming en 2025: Las tendencias que están redefiniendo la industria",
    description:
      "Desde el cloud gaming hasta la integración de IA, exploramos las tendencias más importantes que están moldeando el futuro.",
    category: "gaming",
    date: "2025-09-09",
    image: "../../assets/image/blog/trends.webp",
    featured: false,
    readingTime: "7 min",
    slug: "gaming-trends-2025",
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
  // Navegar directamente a la página estática usando el slug
  window.location.href = `posts/${article.slug}.html`;
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
