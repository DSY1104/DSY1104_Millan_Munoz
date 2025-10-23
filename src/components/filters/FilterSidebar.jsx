import React from "react";
import CategoryHamburger from "./CategoriesHamburger.jsx";
import BrandHamburger from "./BrandHamburger.jsx";
import RatingHamburger from "./RatingHamburger.jsx";

export default function FilterSidebar({
  categories = [],
  brands = [],
  selectedCategory,
  selectedBrand,
  selectedRating,
  onCategorySelect,
  onBrandSelect,
  onRatingSelect,
  onClearFilters,
}) {
  return (
    <aside id="catalog-sidebar">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.2em",
        }}
      >
        <h2
          className="filters-header"
          style={{
            color: "var(--accent-blue)",
            fontSize: "1.3em",
            fontFamily: "var(--font-body, Roboto, sans-serif)",
            fontWeight: 700,
            letterSpacing: "0.02em",
            margin: 0,
          }}
        >
          Filtros
        </h2>
        <button
          id="clear-all-filters"
          type="button"
          style={{
            marginLeft: "1em",
            padding: "0.3em 1em",
            fontSize: "0.95em",
            background: "var(--accent-blue)",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={onClearFilters}
        >
          Limpiar Filtro
        </button>
      </div>

      <CategoryHamburger
        categories={categories}
        selected={selectedCategory}
        onSelect={onCategorySelect}
      />

      <BrandHamburger
        brands={brands}
        selected={selectedBrand}
        onSelect={onBrandSelect}
      />

      <RatingHamburger selected={selectedRating} onSelect={onRatingSelect} />
    </aside>
  );
}
