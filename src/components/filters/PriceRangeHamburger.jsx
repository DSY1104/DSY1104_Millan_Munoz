import React, { useState } from "react";
import "/src/styles/components/filter-sidebar.css";

export default function PriceRangeHamburger({
  minPrice,
  maxPrice,
  onApply,
  isOpen,
  onToggle,
}) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice || "");
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice || "");

  const handleApply = () => {
    onApply({
      min: localMinPrice ? parseInt(localMinPrice) : null,
      max: localMaxPrice ? parseInt(localMaxPrice) : null,
    });
  };

  const handleClear = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    onApply({ min: null, max: null });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onToggle(false);
    }
  };

  return (
    <>
      <button
        className="filter-sidebar__hamburger"
        type="button"
        onClick={() => onToggle((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls="price-range-content"
        aria-label="Mostrar/Ocultar filtro de precio"
      >
        <span className="filter-sidebar__hamburger-title">Rango de Precio</span>
      </button>

      <div
        className={`filter-sidebar__collapsible${
          isOpen ? " filter-sidebar__collapsible--open" : ""
        }`}
        id="price-range-content"
        role="region"
        aria-label="Filtro de rango de precio"
      >
        <div className="price-range-inputs">
          <div className="price-input-group">
            <label htmlFor="min-price" className="price-input-label">
              Precio Mínimo
            </label>
            <input
              id="min-price"
              type="number"
              className="price-input"
              placeholder="$ 0"
              min="0"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
            />
          </div>

          <div className="price-input-group">
            <label htmlFor="max-price" className="price-input-label">
              Precio Máximo
            </label>
            <input
              id="max-price"
              type="number"
              className="price-input"
              placeholder="$ 999999"
              min="0"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="price-range-actions">
          <button
            type="button"
            className="price-apply-btn"
            onClick={handleApply}
          >
            Aplicar
          </button>
          <button
            type="button"
            className="price-clear-btn"
            onClick={handleClear}
          >
            Limpiar
          </button>
        </div>
      </div>
    </>
  );
}
