// Incluye el filtro de marca en catalog.html de forma modular
export function includeBrandFilter(
  targetSelector = "#brand-filter-placeholder"
) {
  return fetch("/components/brand-filter.html")
    .then((res) => res.text())
    .then((html) => {
      const wrapper = document.querySelector(targetSelector);
      if (!wrapper) return false;
      wrapper.innerHTML = html.trim();
      return true;
    });
}

// Inicializa la lógica de filtrado y accesibilidad para el filtro de marcas
export function setupBrandFilter(brands, onSelect, onClear) {
  const aside = document.querySelector("#brand-filter-placeholder");
  if (!aside) return;
  const brandsList = aside.querySelector(".brands-list");
  const clearBtn = aside.querySelector("#clear-brand-filter");
  const hamburger = aside.querySelector("#brand-filter-hamburger");
  const collapsible = aside.querySelector("#brand-filter-collapsible");

  // Rellenar marcas dinámicamente
  brandsList.innerHTML = "";
  brands.forEach((brand) => {
    const btn = document.createElement("button");
    btn.className = "tile-btn brand-btn";
    btn.textContent = brand;
    btn.setAttribute("data-brand", brand);
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("aria-pressed", "false");
    brandsList.appendChild(btn);
  });

  const brandBtns = brandsList.querySelectorAll(".brand-btn");

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

  brandBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      brandBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      onSelect(btn.dataset.brand);
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
      brandBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
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
