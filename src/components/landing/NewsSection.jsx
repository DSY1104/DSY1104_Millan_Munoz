import React from "react";
import { Link } from "react-router-dom";
import "/src/styles/components/_landing_news.css";

const featuredArticles = [
  {
    slug: "borderlands-4-preview",
  img: "/assets/images/blog/borderlands.webp",
    category: "GAMING",
    title: "Borderlands 4: Todo lo que sabemos sobre el esperado shooter-RPG",
  },
  {
    slug: "monitores-4k-gaming",
  img: "/assets/images/blog/monitor.webp",
    category: "NOTICIAS",
    title: "Nuevos lanzamientos de monitores 4K para gaming 2024",
  },
  {
    slug: "setup-gaming-completo",
  img: "/assets/images/blog/pc.webp",
    category: "GUÍAS",
    title: "Guía completa para configurar tu setup gaming perfecto",
  },
];

const latestArticles = [
  {
    slug: "setup-gaming-completo",
  img: "/assets/images/blog/pc.webp",
    category: "GUÍAS",
    title: "Guía completa para configurar tu setup gaming perfecto",
  },
  {
    slug: "monitores-4k-gaming",
  img: "/assets/images/blog/monitor.webp",
    category: "NOTICIAS",
    title: "Nuevos lanzamientos de monitores 4K para gaming 2024",
  },
  {
    slug: "borderlands-4-preview",
  img: "/assets/images/blog/borderlands.webp",
    category: "GAMING",
    title: "Borderlands 4: Todo lo que sabemos sobre el esperado shooter-RPG",
  },
];

function ArticleCard({ slug, img, category, title }) {
  return (
    <Link
      to={`/blog/${slug}`}
      className="article"
      aria-label={`Leer artículo: ${title}`}
    >
      <img loading="lazy" src={img} alt={title} />
      <div className="text-container">
        <h3>{category}</h3>
        <p>{title}</p>
      </div>
    </Link>
  );
}

export default function NewsSection() {
  return (
    <section className="news landing-section">
      <section id="guides">
        <div className="width-restrict">
          <section className="events-header">
            <h1>Noticias, Guías y Consejos</h1>
            <p className="events-subtitle">
              Encuentra las últimas noticias, guías y consejos para mejorar tu
              experiencia gamer y tecnológica.
            </p>
          </section>
          <div className="article-group">
            <div className="article-container active">
              {featuredArticles.map((a, idx) => (
                <ArticleCard key={idx} {...a} />
              ))}
            </div>
            <div className="article-container">
              {latestArticles.map((a, idx) => (
                <ArticleCard key={idx} {...a} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
