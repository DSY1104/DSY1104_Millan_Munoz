import React, { useState } from "react";

export default function RatingHamburger({ selected, onSelect }) {
  const [open, setOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const ratings = [0, 1, 2, 3, 4, 5];

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <>
      <button
        className="tiles-hamburger"
        aria-label="Mostrar/Ocultar ratings"
        aria-expanded={open}
        aria-controls="rating-filter-collapsible"
        id="rating-filter-hamburger"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
      >
        <span className="hamburger-title">Rating</span>
      </button>
      <div
        className={`tiles-collapsible${open ? " open" : ""}`}
        id="rating-filter-collapsible"
        style={{ transition: "max-height 0.3s", overflow: "hidden" }}
      >
        <nav className="ratings-list" role="list">
          {ratings.map((rating) => (
            <button
              key={rating}
              className={`tile-btn rating-btn${
                selected === rating ? " selected" : ""
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
