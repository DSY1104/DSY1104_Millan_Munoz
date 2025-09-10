// Incluye el sidebar de categorías en catalog.html de forma modular
export function includeCategoriesTiles(
  targetSelector = "#categories-tiles-placeholder"
) {
  return fetch("/components/categories-tiles.html")
    .then((res) => res.text())
    .then((html) => {
      const wrapper = document.querySelector(targetSelector);
      if (!wrapper) return false;
      // Si ya existe, no volver a insertar
      if (wrapper.querySelector(".categories-list")) return true;
      wrapper.innerHTML = html.trim();
      return true;
    });
}

// Inicializa la lógica de filtrado y accesibilidad para los tiles de categorías
export function setupCategoriesTilesFilter(
  renderFiltered,
  getSelectedCategory,
  setSelectedCategory,
  getAvailableCategories
) {
  const aside = document.querySelector("#categories-tiles-placeholder");
  if (!aside) return;
  const categoriesList = aside.querySelector(".categories-list");
  const clearBtn = aside.querySelector("#clear-category-filter");
  const hamburger = aside.querySelector("#categories-hamburger");
  const collapsible = aside.querySelector("#categories-collapsible");

  // Rellenar categorías dinámicamente
  const categories = getAvailableCategories();
  categoriesList.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "tile-btn category-btn";
    btn.textContent = cat.nombre;
    btn.setAttribute("data-category", cat.id);
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("aria-pressed", "false");
    categoriesList.appendChild(btn);
  });

  const categoryBtns = categoriesList.querySelectorAll(".category-btn");

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

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      setSelectedCategory(btn.dataset.category);
      renderFiltered();
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
      categoryBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
      setSelectedCategory(null);
      renderFiltered();
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
