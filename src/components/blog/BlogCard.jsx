import React from "react";
import { Link } from "react-router";

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

export default function BlogCard({ article }) {
  const formattedDate = formatDate(article.date);
  const featuredClass = article.featured ? "blog__article-card--featured" : "";

  return (
    <Link to={`/blog/${article.slug}`} className="blog__article-card-link">
      <article
        className={`blog__article-card ${featuredClass}`}
        data-article-id={article.id}
      >
        <div className="blog__article-image">
          <img
            src={article.image}
            alt={`Imagen del artículo: ${article.title}`}
            loading="lazy"
          />
        </div>
        <div className="blog__article-content">
          <div className="blog__article-meta">
            <span
              className="blog__article-category"
              aria-label={`Categoría: ${
                categoryNames[article.category] || article.category
              }`}
            >
              {categoryNames[article.category] || article.category}
            </span>
            <time
              className="blog__article-date"
              dateTime={article.date}
              aria-label={`Fecha de publicación: ${formattedDate}`}
            >
              {formattedDate}
            </time>
          </div>
          <h2 className="blog__article-title">{article.title}</h2>
          <p className="blog__article-description">{article.description}</p>
          <div className="blog__article-footer">
            <span className="blog__read-more-btn" aria-hidden="true">
              Leer más
            </span>
            <span
              className="blog__article-reading-time"
              aria-label={`Tiempo de lectura: ${article.readingTime}`}
            >
              📖 {article.readingTime}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
