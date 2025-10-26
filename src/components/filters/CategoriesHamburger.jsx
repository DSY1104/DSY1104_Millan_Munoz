import React from "react";

export default function CategoryHamburger({
  categories,
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
        aria-label="Mostrar/Ocultar categorías"
        aria-expanded={isOpen}
        aria-controls="category-filter-collapsible"
        onClick={() => onToggle((v) => !v)}
        onKeyDown={handleKeyDown}
      >
        <span className="filter-sidebar__hamburger-title">Categoría</span>
      </button>
      <div
        className={`filter-sidebar__collapsible${
          isOpen ? " filter-sidebar__collapsible--open" : ""
        }`}
        id="category-filter-collapsible"
      >
        <nav className="filter-sidebar__list" role="list">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-sidebar__item${
                selected === cat.id ? " filter-sidebar__item--selected" : ""
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
