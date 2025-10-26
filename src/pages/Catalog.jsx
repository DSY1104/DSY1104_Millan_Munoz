import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "/src/components/products/ProductCard.jsx";
import "/src/styles/pages/catalog.css";
import FilterSidebar from "/src/components/filters/FilterSidebar.jsx";
import { getAllProducts } from "../services/catalogService";
import { getAllCategories } from "../services/categoryService";
import { IconError404 } from "@tabler/icons-react";

const PRODUCTS_PER_PAGE = 12;

function normalizeText(str) {
  return str
    ? str
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
    : "";
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [sortPrice, setSortPrice] = useState("precio-asc");
  const [sortRating, setSortRating] = useState("none");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle category from query parameter
  useEffect(() => {
    const catParam = searchParams.get("cat");
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error("Error loading catalog data:", err);
        setError(
          "No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const uniqueBrands = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.marca && typeof p.marca === "string" && p.marca.trim() !== "")
        set.add(p.marca.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    const q = normalizeText(search);
    if (q) {
      filtered = filtered.filter(
        (p) =>
          normalizeText(p.nombre).includes(q) ||
          normalizeText(p.code).includes(q)
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) =>
          p.categoriaId === selectedCategory ||
          (p.categoria &&
            normalizeText(p.categoria).includes(
              normalizeText(selectedCategory)
            ))
      );
    }
    if (selectedBrand) {
      filtered = filtered.filter((p) => p.marca === selectedBrand);
    }
    if (selectedRating !== null) {
      filtered = filtered.filter(
        (p) =>
          typeof p.rating === "number" &&
          p.rating >= selectedRating &&
          p.rating < selectedRating + 1
      );
    }
    if (minPrice !== null) {
      filtered = filtered.filter((p) => p.precioCLP >= minPrice);
    }
    if (maxPrice !== null) {
      filtered = filtered.filter((p) => p.precioCLP <= maxPrice);
    }
    if (sortPrice !== "none") {
      filtered = filtered.slice().sort((a, b) => {
        if (sortPrice === "precio-asc") return a.precioCLP - b.precioCLP;
        if (sortPrice === "precio-desc") return b.precioCLP - a.precioCLP;
        return a._idx - b._idx;
      });
    }
    if (sortRating !== "none") {
      filtered = filtered.slice().sort((a, b) => {
        if (sortRating === "rating-asc") return a.rating - b.rating;
        if (sortRating === "rating-desc") return b.rating - a.rating;
        return a._idx - b._idx;
      });
    }
    return filtered;
  }, [
    products,
    search,
    sortPrice,
    sortRating,
    selectedCategory,
    selectedBrand,
    selectedRating,
    minPrice,
    maxPrice,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedRating(null);
    setMinPrice(null);
    setMaxPrice(null);
    setSearch("");
    setSortPrice("precio-asc");
    setSortRating("none");
    setCurrentPage(1);
    // Clear query parameters
    setSearchParams({});
  };

  const handlePriceRangeApply = ({ min, max }) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    sortPrice,
    sortRating,
    selectedCategory,
    selectedBrand,
    selectedRating,
    minPrice,
    maxPrice,
  ]);

  return (
    <div>
      <main className="catalog__main-content">
        <header className="catalog-header">
          <h1>Catálogo de Productos</h1>
          <p className="catalog-subtitle">
            Explora nuestra amplia gama de productos y encuentra lo que
            necesitas para llevar tu experiencia gamer al siguiente nivel.
          </p>
        </header>

        {loading && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
            Cargando catálogo...
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
            <main className="catalog-main-layout">
              <FilterSidebar
                categories={categories}
                brands={uniqueBrands}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
                selectedRating={selectedRating}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onCategorySelect={setSelectedCategory}
                onBrandSelect={setSelectedBrand}
                onRatingSelect={setSelectedRating}
                onPriceRangeApply={handlePriceRangeApply}
                onClearFilters={handleClearFilters}
              />
              <section id="productos" className="section">
                <form
                  id="catalog-controls"
                  autoComplete="off"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="search"
                    id="search-input"
                    placeholder="Buscar por nombre o código..."
                    aria-label="Buscar producto"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <select
                    id="sort-price"
                    aria-label="Ordenar por precio"
                    value={sortPrice}
                    onChange={(e) => setSortPrice(e.target.value)}
                  >
                    <option value="none">Precio: Sin orden</option>
                    <option value="precio-asc">Precio: Ascendente</option>
                    <option value="precio-desc">Precio: Descendente</option>
                  </select>
                  <select
                    id="sort-rating"
                    aria-label="Ordenar por rating"
                    value={sortRating}
                    onChange={(e) => setSortRating(e.target.value)}
                  >
                    <option value="none">Rating: Sin orden</option>
                    <option value="rating-desc">Rating: Descendente</option>
                    <option value="rating-asc">Rating: Ascendente</option>
                  </select>
                </form>
                <div className="catalog__product-grid" id="product-list">
                  {paginatedProducts.length === 0 ? (
                    <div
                      className="catalog__no-products-message catalog__fade-in"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        minHeight: 220,
                        textAlign: "center",
                      }}
                    >
                      <img
                        src="src/assets/images/catalog/not-found.svg"
                        alt="Sin resultados"
                        style={{ width: 80, marginBottom: "1em", opacity: 0.7 }}
                      />

                      <span
                        className="catalog__no-products-title"
                        style={{
                          color: "var(--accent-blue)",
                          fontSize: "1.5em",
                        }}
                      >
                        No encontramos productos
                      </span>
                      <span
                        className="catalog__no-products-sub"
                        style={{
                          color: "#888",
                          fontSize: "1.1em",
                          fontFamily: "Roboto, sans-serif",
                        }}
                      >
                        Prueba ajustando los filtros, revisa la ortografía o
                        explora otras categorías.
                        <br />
                        ¡Siempre hay algo nuevo por descubrir!
                      </span>
                    </div>
                  ) : (
                    paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id || product.code}
                        {...product}
                      />
                    ))
                  )}
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pagination-controls" id="pagination-controls">
                    <div className="pagination-info">
                      <span>
                        Mostrando {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}-
                        {Math.min(
                          currentPage * PRODUCTS_PER_PAGE,
                          filteredProducts.length
                        )}{" "}
                        de {filteredProducts.length} productos
                      </span>
                    </div>
                    <div className="pagination-buttons">
                      <button
                        className="pagination-btn pagination-btn--prev"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        aria-label="Página anterior"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="pagination-icon"
                        >
                          <path d="M15 6l-6 6l6 6" />
                        </svg>
                        <span className="pagination-btn__text">Anterior</span>
                      </button>
                      {/* Page number buttons (max 5) */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (pageNum) =>
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            Math.abs(pageNum - currentPage) <= 2
                        )
                        .map((pageNum, idx, arr) => (
                          <React.Fragment key={pageNum}>
                            {idx > 0 && pageNum - arr[idx - 1] > 1 ? (
                              <span key={`ellipsis-${pageNum}`}>...</span>
                            ) : null}
                            <button
                              key={pageNum}
                              className={`pagination-btn page-btn${
                                pageNum === currentPage ? " active" : ""
                              }`}
                              onClick={() => setCurrentPage(pageNum)}
                              disabled={pageNum === currentPage}
                            >
                              {pageNum}
                            </button>
                          </React.Fragment>
                        ))}
                      <button
                        className="pagination-btn pagination-btn--next"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        aria-label="Página siguiente"
                      >
                        <span className="pagination-btn__text">Siguiente</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="pagination-icon"
                        >
                          <path d="M9 6l6 6l-6 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </main>
          </div>
        )}
      </main>
    </div>
  );
}
