// Incluye el sidebar de categorías en catalog.html de forma modular
export function includeCategoryTiles(targetSelector = ".catalog-main-layout") {
  return fetch("/components/category-tiles.html")
    .then((res) => res.text())
    .then((html) => {
      const wrapper = document.querySelector(targetSelector);
      if (!wrapper) return false;
      // Si ya existe, no volver a insertar
      if (wrapper.querySelector(".category-tiles")) return true;
      const temp = document.createElement("div");
      temp.innerHTML = html.trim();
      const aside = temp.firstElementChild;
      wrapper.insertBefore(aside, wrapper.firstChild);
      return true;
    });
}

// Inicializa la lógica de filtrado, accesibilidad y hamburguesa para los tiles
export function setupCategoryTilesFilter(
  renderFiltered,
  getSelectedCategory,
  setSelectedCategory
) {
  const aside = document.querySelector(".category-tiles");
  if (!aside) return;
  const tileBtns = aside.querySelectorAll(".tile-btn");
  const clearBtn = aside.querySelector(".tile-clear-btn");
  const hamburger = aside.querySelector(".tiles-hamburger");
  const collapsible = aside.querySelector(".tiles-collapsible");

  // Por defecto, menú cerrado
  if (collapsible) {
    collapsible.classList.remove("open");
    if (hamburger) hamburger.setAttribute("aria-expanded", "false");
  }

  // Hamburguesa: mostrar/ocultar menú SIEMPRE
  if (hamburger && collapsible) {
    hamburger.addEventListener("click", () => {
      // En móvil, abrir/cerrar todo el sidebar
      const sidebar = aside;
      if (window.innerWidth <= 900) {
        const isOpen = sidebar.classList.toggle("open");
        hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      } else {
        const isOpen = collapsible.classList.toggle("open");
        hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }
    });
    // Cerrar con ESC
    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (window.innerWidth <= 900) {
          aside.classList.remove("open");
        } else {
          collapsible.classList.remove("open");
        }
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  tileBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tileBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      setSelectedCategory(btn.dataset.category);
      renderFiltered();
      // NO cerrar menú tras seleccionar categoría
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
      tileBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
      setSelectedCategory(null);
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
