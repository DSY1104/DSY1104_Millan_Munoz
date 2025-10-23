import React, { useState } from "react";

export default function BrandHamburger({ brands = [], selected, onSelect }) {
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
        aria-label="Mostrar/Ocultar marcas"
        aria-expanded={open}
        aria-controls="brand-filter-collapsible"
        id="brand-filter-hamburger"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
      >
        <span className="hamburger-title">Marca</span>
      </button>
      <div
        className={`tiles-collapsible${open ? " open" : ""}`}
        id="brand-filter-collapsible"
        style={{ transition: "max-height 0.3s", overflow: "hidden" }}
      >
        <nav className="brands-list" role="list">
          {brands.map((brand) => (
            <button
              key={brand}
              className={`tile-btn brand-btn${
                selected === brand ? " selected" : ""
              }`}
              data-brand={brand}
              tabIndex="0"
              aria-pressed={selected === brand}
              onClick={() => onSelect(brand)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(brand);
                }
              }}
            >
              {brand}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
