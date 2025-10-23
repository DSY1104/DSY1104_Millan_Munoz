import React, { useState, useMemo, useEffect } from "react";
import "/src/styles/pages/blog.css";
import BlogCard from "../components/blog/BlogCard";
import { getAllArticles } from "../services/blogService";

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("date-desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await getAllArticles();
        setArticles(data);
        setError(null);
      } catch (err) {
        console.error("Error loading blog articles:", err);
        setError(
          "No se pudieron cargar los artículos. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    let filtered =
      category === "all"
        ? [...articles]
        : articles.filter((a) => a.category === category);
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
  }, [articles, category, sort]);

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

  return (
    <div>
      <main className="main-content">
        <header className="blog-header">
          <h1 style={{ color: "#fff" }}>Blog LevelUp</h1>
          <p style={{ color: "#fff" }}>
            Descubre las últimas noticias, reviews y tendencias del mundo gaming
          </p>
        </header>

        {loading && !error && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
            Cargando artículos...
          </div>
        )}

        {error && (
          <div
            style={{ textAlign: "center", padding: "3rem", color: "#ff6b6b" }}
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="content-wrapper">
            <main className="blog-main">
              {/* Filtros y ordenamiento */}
              <section
                className="blog-controls"
                aria-label="Controles de filtrado y ordenamiento"
              >
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
                <div className="articles-container" id="articles-container">
                  {filteredArticles.length === 0 ? (
                    <div
                      className="empty-state active"
                      id="empty-state"
                      aria-hidden="false"
                    >
                      <h3>No se encontraron artículos</h3>
                      <p>Intenta cambiar los filtros para ver más contenido.</p>
                    </div>
                  ) : (
                    filteredArticles.map((article) => (
                      <BlogCard key={article.id} article={article} />
                    ))
                  )}
                </div>
              </section>
              {/* Loading indicator */}
              {loading && (
                <div
                  className="loading-indicator active"
                  id="loading-indicator"
                  aria-hidden="false"
                >
                  <p>Cargando artículos...</p>
                </div>
              )}
            </main>
          </div>
        )}
      </main>
    </div>
  );
}
