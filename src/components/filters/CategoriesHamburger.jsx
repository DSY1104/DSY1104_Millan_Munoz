import React, { useState } from "react";

export default function CategoryHamburger({ categories, selected, onSelect }) {
  const [open, setOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        className="tiles-hamburger"
        aria-label="Mostrar/Ocultar categorías"
        aria-expanded={open}
        aria-controls="category-filter-collapsible"
        id="category-filter-hamburger"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
      >
        <span className="hamburger-title">Categoría</span>
      </button>
      <div
        className={`tiles-collapsible${open ? " open" : ""}`}
        id="category-filter-collapsible"
        style={{ transition: "max-height 0.3s", overflow: "hidden" }}
      >
        <nav className="categories-list" role="list">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`tile-btn category-btn${
                selected === cat.id ? " selected" : ""
              }`}
              data-category={cat.id}
              tabIndex="0"
              aria-pressed={selected === cat.id}
              onClick={() => onSelect(cat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(cat.id);
                }
              }}
            >
              {cat.nombre}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
