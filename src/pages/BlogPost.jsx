import { useParams, Link, Navigate, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { getArticleBySlug } from "../services/blogService";
import "../styles/pages/blog-post.css";

export default function BlogPost() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get full content from loader (JSON file)
  const content = useLoaderData();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleBySlug(slug);
        setArticle(data);
      } catch (error) {
        console.error("Error loading article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  // Show loading state
  if (loading) {
    return (
      <div className="blog-post">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
          Cargando artículo...
        </div>
      </div>
    );
  }

  // If article not found, redirect to 404
  if (!article || !content) {
    return <Navigate to="/404" replace />;
  }

  // Render different content types
  const renderContent = (block, index) => {
    switch (block.type) {
      case "paragraph":
        return <p key={index}>{block.text}</p>;

      case "heading":
        const HeadingTag = `h${block.level}`;
        return <HeadingTag key={index}>{block.text}</HeadingTag>;

      case "list":
        return (
          <ul key={index}>
            {block.items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        );

      case "tips":
        return (
          <div key={index} className="blog-post__tips-box">
            <h4>{block.title}</h4>
            <ul>
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        );

      case "comparison":
        return (
          <div key={index} className="blog-post__comparison-table">
            <h4>{block.title}</h4>
            <table>
              <thead>
                <tr>
                  {block.headers.map((header, i) => (
                    <th key={i}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "specs":
        return (
          <div key={index} className="blog-post__specs-table">
            <h4>{block.title}</h4>
            <table>
              <thead>
                <tr>
                  {block.headers.map((header, i) => (
                    <th key={i}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "alert":
        return (
          <div key={index} className="blog-post__alert-box">
            <h4>{block.title}</h4>
            <p>{block.text}</p>
          </div>
        );

      case "rating":
        return (
          <div key={index} className="blog-post__rating-box">
            <div className="blog-post__rating-score">
              <span className="blog-post__rating-score-value">
                {block.score}
              </span>
              <span className="blog-post__rating-score-max">
                /{block.maxScore}
              </span>
            </div>
            <div className="blog-post__rating-info">
              <h4>{block.title}</h4>
              <p>{block.description}</p>
            </div>
          </div>
        );

      case "stats":
        return (
          <div key={index} className="blog-post__stats-grid">
            <h4>{block.title}</h4>
            <div className="blog-post__stats-container">
              {block.items.map((stat, i) => (
                <div key={i} className="blog-post__stat-card">
                  <div className="blog-post__stat-number">{stat.number}</div>
                  <div className="blog-post__stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Category labels mapping
  const categoryLabels = {
    reviews: "Análisis",
    guias: "Guías",
    noticias: "Noticias",
    gaming: "Gaming",
  };

  return (
    <div className="blog-post">
      {/* Breadcrumbs */}
      <nav className="blog-post__breadcrumbs">
        <Link to="/">Inicio</Link>
        <span className="blog-post__breadcrumbs-separator">/</span>
        <Link to="/blog">Blog</Link>
        <span className="blog-post__breadcrumbs-separator">/</span>
        <span className="blog-post__breadcrumbs-current">{article.title}</span>
      </nav>

      {/* Hero Section */}
      <header className="blog-post__hero">
        <div className="blog-post__hero-content">
          <div className="blog-post__meta">
            <span className="blog-post__category">
              {categoryLabels[article.category]}
            </span>
            <span className="blog-post__reading-time">
              {article.readingTime} de lectura
            </span>
          </div>

          <h1>{content.title}</h1>

          {content.subtitle && (
            <p className="blog-post__subtitle">{content.subtitle}</p>
          )}

          <div className="blog-post__author-info">
            <div className="blog-post__author-avatar">
              {content.author.avatar}
            </div>
            <div className="blog-post__author-details">
              <span className="blog-post__author-name">
                {content.author.name}
              </span>
              <span className="blog-post__author-role">
                {content.author.role}
              </span>
            </div>
            <time className="blog-post__date">
              {new Date(content.date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>

        <figure className="blog-post__hero-image">
          <img src={content.heroImage} alt={content.title} />
          {content.heroCaption && (
            <figcaption>{content.heroCaption}</figcaption>
          )}
        </figure>
      </header>

      {/* Article Content */}
      <article className="blog-post__content">
        <div className="blog-post__content-wrapper">
          {content.content.map((block, index) => renderContent(block, index))}
        </div>
      </article>

      {/* Share Section */}
      <section className="blog-post__share">
        <h3>Compartir este artículo</h3>
        <div className="blog-post__share-buttons">
          <button
            className="blog-post__share-btn blog-post__share-btn--facebook"
            aria-label="Compartir en Facebook"
          >
            <i className="fab fa-facebook-f"></i> Facebook
          </button>
          <button
            className="blog-post__share-btn blog-post__share-btn--twitter"
            aria-label="Compartir en Twitter"
          >
            <i className="fab fa-twitter"></i> Twitter
          </button>
          <button
            className="blog-post__share-btn blog-post__share-btn--linkedin"
            aria-label="Compartir en LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i> LinkedIn
          </button>
          <button
            className="blog-post__share-btn blog-post__share-btn--whatsapp"
            aria-label="Compartir en WhatsApp"
          >
            <i className="fab fa-whatsapp"></i> WhatsApp
          </button>
        </div>
      </section>

      {/* Back to Blog */}
      <div className="blog-post__back">
        <Link to="/blog" className="blog-post__back-btn">
          ← Volver al Blog
        </Link>
      </div>
    </div>
  );
}
