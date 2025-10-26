import React from "react";

export default function BrandHamburger({
  brands = [],
  selected,
  onSelect,
  isOpen,
  onToggle,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onToggle(false);
    }
  };

  return (
    <>
      <button
        className="filter-sidebar__hamburger"
        aria-label="Mostrar/Ocultar marcas"
        aria-expanded={isOpen}
        aria-controls="brand-filter-collapsible"
        onClick={() => onToggle((v) => !v)}
        onKeyDown={handleKeyDown}
      >
        <span className="filter-sidebar__hamburger-title">Marca</span>
      </button>
      <div
        className={`filter-sidebar__collapsible${
          isOpen ? " filter-sidebar__collapsible--open" : ""
        }`}
        id="brand-filter-collapsible"
      >
        <nav className="filter-sidebar__list" role="list">
          {brands.map((brand) => (
            <button
              key={brand}
              className={`filter-sidebar__item${
                selected === brand ? " filter-sidebar__item--selected" : ""
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
