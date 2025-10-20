import React, { useState, useMemo } from "react";
import "/src/styles/pages/blog.css";

const blogArticles = [
  {
    id: 1,
    title: "Los mejores auriculares gaming de 2024",
    description:
      "Descubre nuestra selección de auriculares gaming que te darán la ventaja competitiva que necesitas. Desde audio 7.1 hasta cancelación de ruido.",
    category: "reviews",
    date: "2025-09-10",
    image: "/src/assets/images/blog/audio.webp",
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
    image: "/src/assets/images/blog/pc.webp",
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
    image: "/src/assets/images/blog/monitor.webp",
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
    image: "/src/assets/images/blog/games.webp",
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
    image: "/src/assets/images/blog/ps5.webp",
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
    image: "/src/assets/images/blog/trends.webp",
    featured: false,
    readingTime: "7 min",
    slug: "gaming-trends-2025",
  },
];

const categoryNames = {
  gaming: "Gaming",
  reviews: "Reviews",
  noticias: "Noticias",
  guias: "Guías",
  eventos: "Eventos",
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("es-ES", options);
}

export default function BlogPage() {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("date-desc");
  const [loading, setLoading] = useState(false);

  const filteredArticles = useMemo(() => {
    let filtered =
      category === "all"
        ? [...blogArticles]
        : blogArticles.filter((a) => a.category === category);
    switch (sort) {
      case "date-desc":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "date-asc":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    return filtered;
  }, [category, sort]);

  function handleCategoryChange(e) {
    setLoading(true);
    setCategory(e.target.value);
    setTimeout(() => setLoading(false), 300);
  }
  function handleSortChange(e) {
    setLoading(true);
    setSort(e.target.value);
    setTimeout(() => setLoading(false), 300);
  }
  function handleArticleClick(slug) {
    window.location.href = `posts/${slug}.html`;
  }

  return (
    <div>
        <main className="main-content">
      <header className="blog-header">
        <h1 style={{ color: "#fff" }}>Blog LevelUp</h1>
        <p style={{ color: "#fff" }}>
          Descubre las últimas noticias, reviews y tendencias del mundo gaming
        </p>
      </header>
      <div className="content-wrapper">
        <main className="blog-main">
          {/* Filtros y ordenamiento */}
          <section className="blog-controls" aria-label="Controles de filtrado y ordenamiento">
            <div className="controls-container">
              <div className="filter-section">
                <label htmlFor="category-filter" className="filter-label">
                  Filtrar por categoría:
                </label>
                <select
                  id="category-filter"
                  className="filter-select"
                  aria-label="Filtrar artículos por categoría"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="all">Todas las categorías</option>
                  <option value="gaming">Gaming</option>
                  <option value="reviews">Reviews</option>
                  <option value="noticias">Noticias</option>
                  <option value="guias">Guías</option>
                  <option value="eventos">Eventos</option>
                </select>
              </div>
              <div className="sort-section">
                <label htmlFor="sort-select" className="sort-label">
                  Ordenar por:
                </label>
                <select
                  id="sort-select"
                  className="sort-select"
                  aria-label="Ordenar artículos"
                  value={sort}
                  onChange={handleSortChange}
                >
                  <option value="date-desc">Más recientes</option>
                  <option value="date-asc">Más antiguos</option>
                  <option value="title-asc">Título A-Z</option>
                  <option value="title-desc">Título Z-A</option>
                </select>
              </div>
            </div>
          </section>
          {/* Grid de artículos */}
          <section className="blog-grid" aria-label="Artículos del blog">
            <div className="articles-container" id="articles-container" style={{ opacity: loading ? 0.5 : 1 }}>
              {loading ? null : filteredArticles.length === 0 ? (
                <div className="empty-state active" id="empty-state" aria-hidden="false">
                  <h3>No se encontraron artículos</h3>
                  <p>Intenta cambiar los filtros para ver más contenido.</p>
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} onClick={handleArticleClick} />
                ))
              )}
            </div>
          </section>
          {/* Loading indicator */}
          {loading && (
            <div className="loading-indicator active" id="loading-indicator" aria-hidden="false">
              <p>Cargando artículos...</p>
            </div>
          )}
        </main>
      </div>
      </main>
    </div>
  );
}

function ArticleCard({ article, onClick }) {
  const formattedDate = formatDate(article.date);
  const featuredClass = article.featured ? "featured" : "";
  return (
    <article
      className={`article-card ${featuredClass}`}
      data-article-id={article.id}
      tabIndex={0}
      role="button"
      aria-label={`Leer artículo: ${article.title}`}
      onClick={() => onClick(article.slug)}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(article.slug);
        }
      }}
    >
      <div className="article-image">
        <img src={article.image} alt={`Imagen del artículo: ${article.title}`} loading="lazy" />
      </div>
      <div className="article-content">
        <div className="article-meta">
          <span className="article-category" aria-label={`Categoría: ${categoryNames[article.category] || article.category}`}>
            {categoryNames[article.category] || article.category}
          </span>
          <time className="article-date" dateTime={article.date} aria-label={`Fecha de publicación: ${formattedDate}`}>
            {formattedDate}
          </time>
        </div>
        <h2 className="article-title">{article.title}</h2>
        <p className="article-description">{article.description}</p>
        <div className="article-footer">
          <button className="read-more-btn" aria-label={`Leer más sobre: ${article.title}`}
            onClick={e => { e.stopPropagation(); onClick(article.slug); }}>
            Leer más
          </button>
          <span className="article-reading-time" aria-label={`Tiempo de lectura: ${article.readingTime}`}>
            📖 {article.readingTime}
          </span>
        </div>
      </div>
    </article>
  );
}
