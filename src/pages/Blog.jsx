import React, { useState } from "react";
import "/src/styles/pages/blog.css";

export default function BlogPage() {
  // Estados para filtro, orden y artículos
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("date-desc");
  // Aquí podrías cargar los artículos desde un archivo o API
  const [articles, setArticles] = useState([]); // Simulado vacío
  const [loading, setLoading] = useState(false);

  // Puedes agregar lógica para cargar y filtrar artículos aquí

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
                        onChange={e => setCategory(e.target.value)}
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
                        <label htmlFor="sort-select" className="sort-label">Ordenar por:</label>
                        <select
                        id="sort-select"
                        className="sort-select"
                        aria-label="Ordenar artículos"
                        value={sort}
                        onChange={e => setSort(e.target.value)}
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
                    {/* Aquí renderiza los artículos dinámicamente */}
                    {loading ? (
                        <div className="loading-indicator" aria-hidden="false">
                        <p>Cargando artículos...</p>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="empty-state" aria-hidden="false">
                        <h3>No se encontraron artículos</h3>
                        <p>Intenta cambiar los filtros para ver más contenido.</p>
                        </div>
                    ) : (
                        articles.map(article => (
                        <div key={article.id} className="article-card">
                            {/* Renderiza la información del artículo aquí */}
                        </div>
                        ))
                    )}
                    </div>
                </section>
                </main>
            </div>
        </main>
    </div>
  );
}
