import React, { useState } from "react";
import CategoryHamburger from "./CategoriesHamburger.jsx";
import BrandHamburger from "./BrandHamburger.jsx";
import RatingHamburger from "./RatingHamburger.jsx";
import PriceRangeHamburger from "./PriceRangeHamburger.jsx";
import "/src/styles/components/filter-sidebar.css";

export default function FilterSidebar({
  categories = [],
  brands = [],
  selectedCategory,
  selectedBrand,
  selectedRating,
  minPrice,
  maxPrice,
  onCategorySelect,
  onBrandSelect,
  onRatingSelect,
  onPriceRangeApply,
  onClearFilters,
}) {
  // Lift state up: control which hamburger is open from parent
  const [openCategory, setOpenCategory] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const [openPriceRange, setOpenPriceRange] = useState(false);

  // Helper to collapse all hamburgers
  const collapseAll = () => {
    setOpenCategory(false);
    setOpenBrand(false);
    setOpenRating(false);
    setOpenPriceRange(false);
  };

  // Wrap selection handlers to collapse after selection
  const handleCategorySelect = (categoryId) => {
    onCategorySelect(categoryId);
    collapseAll();
  };

  const handleBrandSelect = (brand) => {
    onBrandSelect(brand);
    collapseAll();
  };

  const handleRatingSelect = (rating) => {
    onRatingSelect(rating);
    collapseAll();
  };

  const handlePriceRangeApply = (priceRange) => {
    onPriceRangeApply(priceRange);
    collapseAll();
  };

  return (
    <aside className="filter-sidebar">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.2em",
        }}
      >
        <h2 className="filter-sidebar__header">Filtros</h2>
        <button
          className="filter-sidebar__clear-all"
          type="button"
          onClick={onClearFilters}
        >
          Limpiar Filtro
        </button>
      </div>

      <CategoryHamburger
        categories={categories}
        selected={selectedCategory}
        onSelect={handleCategorySelect}
        isOpen={openCategory}
        onToggle={setOpenCategory}
      />

      <BrandHamburger
        brands={brands}
        selected={selectedBrand}
        onSelect={handleBrandSelect}
        isOpen={openBrand}
        onToggle={setOpenBrand}
      />

      <RatingHamburger
        selected={selectedRating}
        onSelect={handleRatingSelect}
        isOpen={openRating}
        onToggle={setOpenRating}
      />

      <PriceRangeHamburger
        minPrice={minPrice}
        maxPrice={maxPrice}
        onApply={handlePriceRangeApply}
        isOpen={openPriceRange}
        onToggle={setOpenPriceRange}
      />
    </aside>
  );
}
