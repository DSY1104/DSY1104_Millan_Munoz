// Incluye el sidebar de rating en catalog.html de forma modular
export function includeRatingTiles(
  targetSelector = "#rating-tiles-placeholder"
) {
  return fetch("/components/rating-tiles.html")
    .then((res) => res.text())
    .then((html) => {
      const wrapper = document.querySelector(targetSelector);
      if (!wrapper) return false;
      // Si ya existe, no volver a insertar
      if (wrapper.querySelector(".ratings-list")) return true;
      wrapper.innerHTML = html.trim();
      return true;
    });
}

// Inicializa la lógica de filtrado y accesibilidad para los tiles de rating
export function setupRatingTilesFilter(
  renderFiltered,
  getSelectedRating,
  setSelectedRating
) {
  const aside = document.querySelector("#rating-tiles-placeholder");
  if (!aside) return;
  const ratingsList = aside.querySelector(".ratings-list");
  const clearBtn = aside.querySelector("#clear-rating-filter");
  const hamburger = aside.querySelector("#ratings-hamburger");
  const collapsible = aside.querySelector("#ratings-collapsible");

  // Rellenar ratings dinámicamente (de 5 a 0 estrellas)
  ratingsList.innerHTML = "";
  for (let i = 5; i >= 0; i--) {
    const btn = document.createElement("button");
    btn.className = "tile-btn rating-btn";
    btn.setAttribute("data-rating", i);
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = `${"★".repeat(
      i
    )}${'<span style="color:#444">★</span>'.repeat(
      5 - i
    )} <span style="font-size:0.95em;color:#aaa;">${i}+</span>`;
    ratingsList.appendChild(btn);
  }

  const ratingBtns = ratingsList.querySelectorAll(".rating-btn");

  // Por defecto, menú cerrado
  if (collapsible) {
    collapsible.classList.remove("open");
    if (hamburger) hamburger.setAttribute("aria-expanded", "false");
  }

  // Hamburguesa: mostrar/ocultar menú SIEMPRE
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
      setSelectedRating(Number(btn.dataset.rating));
      renderFiltered();
      // NO cerrar menú tras seleccionar rating
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
      setSelectedRating(null);
      renderFiltered();
      if (collapsible) {
        collapsible.classList.remove("open");
        if (hamburger) hamburger.setAttribute("aria-expanded", "false");
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
