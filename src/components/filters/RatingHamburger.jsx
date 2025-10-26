import React from "react";

export default function RatingHamburger({
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

  const ratings = [0, 1, 2, 3, 4, 5];

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <>
      <button
        className="filter-sidebar__hamburger"
        aria-label="Mostrar/Ocultar ratings"
        aria-expanded={isOpen}
        aria-controls="rating-filter-collapsible"
        onClick={() => onToggle((v) => !v)}
        onKeyDown={handleKeyDown}
      >
        <span className="filter-sidebar__hamburger-title">Rating</span>
      </button>
      <div
        className={`filter-sidebar__collapsible${
          isOpen ? " filter-sidebar__collapsible--open" : ""
        }`}
        id="rating-filter-collapsible"
      >
        <nav className="filter-sidebar__list" role="list">
          {ratings.map((rating) => (
            <button
              key={rating}
              className={`filter-sidebar__item${
                selected === rating ? " filter-sidebar__item--selected" : ""
              }`}
              data-rating={rating}
              tabIndex="0"
              aria-pressed={selected === rating}
              onClick={() => onSelect(rating)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(rating);
                }
              }}
            >
              {renderStars(rating)}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
