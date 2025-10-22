import React from "react";

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

export default function BlogCard({ article, onClick }) {
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
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(article.slug);
        }
      }}
    >
      <div className="article-image">
        <img
          src={article.image}
          alt={`Imagen del artículo: ${article.title}`}
          loading="lazy"
        />
      </div>
      <div className="article-content">
        <div className="article-meta">
          <span
            className="article-category"
            aria-label={`Categoría: ${
              categoryNames[article.category] || article.category
            }`}
          >
            {categoryNames[article.category] || article.category}
          </span>
          <time
            className="article-date"
            dateTime={article.date}
            aria-label={`Fecha de publicación: ${formattedDate}`}
          >
            {formattedDate}
          </time>
        </div>
        <h2 className="article-title">{article.title}</h2>
        <p className="article-description">{article.description}</p>
        <div className="article-footer">
          <button
            className="read-more-btn"
            aria-label={`Leer más sobre: ${article.title}`}
            onClick={(e) => {
              e.stopPropagation();
              onClick(article.slug);
            }}
          >
            Leer más
          </button>
          <span
            className="article-reading-time"
            aria-label={`Tiempo de lectura: ${article.readingTime}`}
          >
            📖 {article.readingTime}
          </span>
        </div>
      </div>
    </article>
  );
}
