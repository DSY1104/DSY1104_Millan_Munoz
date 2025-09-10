// Incluye el filtro de rating en catalog.html de forma modular
export function includeRatingFilter(
  targetSelector = "#rating-filter-placeholder"
) {
  return fetch("/components/rating-filter.html")
    .then((res) => res.text())
    .then((html) => {
      const wrapper = document.querySelector(targetSelector);
      if (!wrapper) return false;
      wrapper.innerHTML = html.trim();
      return true;
    });
}

// Inicializa la lógica de filtrado y accesibilidad para el filtro de rating
export function setupRatingFilter(onSelect, onClear) {
  const aside = document.querySelector("#rating-filter-placeholder");
  if (!aside) return;
  const ratingsList = aside.querySelector(".ratings-list");
  const clearBtn = aside.querySelector("#clear-rating-filter");
  const hamburger = aside.querySelector("#rating-filter-hamburger");
  const collapsible = aside.querySelector("#rating-filter-collapsible");

  // Rellenar ratings dinámicamente (0 a 5 estrellas)
  ratingsList.innerHTML = "";
  for (let i = 0; i <= 5; i++) {
    const btn = document.createElement("button");
    btn.className = "tile-btn rating-btn";
    btn.innerHTML = `${"★".repeat(i)}${"☆".repeat(
      5 - i
    )} <span class="rating-label">${i} estrellas</span>`;
    btn.setAttribute("data-rating", i);
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("aria-pressed", "false");
    ratingsList.appendChild(btn);
  }

  const ratingBtns = ratingsList.querySelectorAll(".rating-btn");

  // Por defecto, menú cerrado
  if (collapsible) {
    collapsible.classList.remove("open");
    if (hamburger) hamburger.setAttribute("aria-expanded", "false");
  }

  // Hamburguesa: mostrar/ocultar menú
  if (hamburger && collapsible) {
    hamburger.addEventListener("click", () => {
      const isOpen = collapsible.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        collapsible.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  ratingBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      ratingBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      onSelect(Number(btn.dataset.rating));
    });
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      ratingBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
      onClear();
      if (collapsible && hamburger) {
        collapsible.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
    clearBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        clearBtn.click();
      }
    });
  }
}
