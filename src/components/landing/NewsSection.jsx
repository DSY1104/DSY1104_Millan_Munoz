import React from "react";
import "/src/styles/components/_landing_news.css";

const featuredArticles = [
  {
    href: "/pages/blog/posts/borderlands-4-preview.html",
    img: "/src/assets/images/blog/borderlands.webp",
    category: "GAMING",
    title: "Borderlands 4: Todo lo que sabemos sobre el esperado shooter-RPG",
  },
  {
    href: "/pages/blog/posts/monitores-4k-gaming.html",
    img: "/src/assets/images/blog/monitor.webp",
    category: "NOTICIAS",
    title: "Nuevos lanzamientos de monitores 4K para gaming 2024",
  },
  {
    href: "/pages/blog/posts/setup-gaming-completo.html",
    img: "/src/assets/images/blog/pc.webp",
    category: "GUÍAS",
    title: "Guía completa para configurar tu setup gaming perfecto",
  },
];

const latestArticles = [
  {
    href: "/pages/blog/posts/setup-gaming-completo.html",
    img: "/src/assets/images/blog/pc.webp",
    category: "GUÍAS",
    title: "Guía completa para configurar tu setup gaming perfecto",
  },
  {
    href: "/pages/blog/posts/monitores-4k-gaming.html",
    img: "/src/assets/images/blog/monitor.webp",
    category: "NOTICIAS",
    title: "Nuevos lanzamientos de monitores 4K para gaming 2024",
  },
  {
    href: "/pages/blog/posts/borderlands-4-preview.html",
    img: "/src/assets/images/blog/borderlands.webp",
    category: "GAMING",
    title: "Borderlands 4: Todo lo que sabemos sobre el esperado shooter-RPG",
  },
];

function ArticleCard({ href, img, category, title }) {
  return (
    <a href={href} className="article" role="button" aria-label={`Link to the ${title} blog page - Opens in the current Tab`}>
      <img loading="lazy" src={img} alt={title} />
      <div className="text-container">
        <h3>{category}</h3>
        <p>{title}</p>
      </div>
    </a>
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
              Encuentra las últimas noticias, guías y consejos para mejorar tu experiencia gamer y tecnológica.
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
