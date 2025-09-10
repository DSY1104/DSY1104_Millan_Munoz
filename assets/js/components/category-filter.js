// Incluye el filtro de categoría en catalog.html de forma modular
export function includeCategoryFilter(
  targetSelector = "#category-filter-placeholder"
) {
  return fetch("/components/category-filter.html")
    .then((res) => res.text())
    .then((html) => {
      const wrapper = document.querySelector(targetSelector);
      if (!wrapper) return false;
      wrapper.innerHTML = html.trim();
      return true;
    });
}

// Inicializa la lógica de filtrado y accesibilidad para el filtro de categorías
export function setupCategoryFilter(categories, onSelect, onClear) {
  const aside = document.querySelector("#category-filter-placeholder");
  if (!aside) return;
  const categoriesList = aside.querySelector(".categories-list");
  const clearBtn = aside.querySelector("#clear-category-filter");
  const hamburger = aside.querySelector("#category-filter-hamburger");
  const collapsible = aside.querySelector("#category-filter-collapsible");

  // Rellenar categorías dinámicamente
  categoriesList.innerHTML = "";
  categories.forEach((cat) => {
    // cat: { id, nombre }
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

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      onSelect(btn.dataset.category);
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
