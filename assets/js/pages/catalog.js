import {
  includeCategoryFilter,
  setupCategoryFilter,
} from "../components/category-filter.js";
import {
  includeBrandFilter,
  setupBrandFilter,
} from "../components/brand-filter.js";
import {
  includeRatingFilter,
  setupRatingFilter,
} from "../components/rating-filter.js";
// Obtener marcas únicas de products.json
function getUniqueBrandsFromProducts(products) {
  const set = new Set();
  products.forEach((p) => {
    if (p.marca && typeof p.marca === "string" && p.marca.trim() !== "")
      set.add(p.marca.trim());
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}
// Obtener categorías desde categories.json y poblar el filtro con el nombre

// Inicializar filtros después de cargar productos
fetch("../../assets/data/products.json")
  .then((res) => res.json())
  .then((products) => {
    allProducts = products.map((p, idx) => ({ ...p, _idx: idx }));
    // Filtro de categoría
    fetch("../../assets/data/categories.json")
      .then((res) => res.json())
      .then((categoriesData) => {
        includeCategoryFilter("#category-filter-placeholder").then(() => {
          setupCategoryFilter(
            categoriesData,
            (selectedCategoryId) => {
              setSelectedCategory(selectedCategoryId);
              renderFiltered();
            },
            () => {
              setSelectedCategory(null);
              renderFiltered();
            }
          );
        });
      });
    // Filtro de marca
    const brands = getUniqueBrandsFromProducts(allProducts);
    includeBrandFilter("#brand-filter-placeholder").then(() => {
      setupBrandFilter(
        brands,
        (selectedBrandName) => {
          setSelectedBrand(selectedBrandName);
          renderFiltered();
        },
        () => {
          setSelectedBrand(null);
          renderFiltered();
        }
      );
    });
    // Filtro de rating
    includeRatingFilter("#rating-filter-placeholder").then(() => {
      setupRatingFilter(
        (selectedRating) => {
          setSelectedRating(selectedRating);
          renderFiltered();
        },
        () => {
          setSelectedRating(null);
          renderFiltered();
        }
      );
    });
    renderFiltered();
  });
import {
  includeCategoriesTiles,
  setupCategoriesTilesFilter,
} from "../components/categories-tiles.js";
// Obtener categorías desde el archivo JSON
function getAvailableCategories() {
  // Este fetch es síncrono para el setup, pero la data ya está cargada en allProducts
  // Se asume que las categorías están en assets/data/categories.json
  // Si no, puedes ajustar para usar allProducts.map(p => p.categoriaId)
  return [
    { id: "JM", nombre: "Juegos de Mesa" },
    { id: "AC", nombre: "Accesorios" },
    { id: "CO", nombre: "Consolas" },
    { id: "CG", nombre: "PC Gamers" },
    { id: "SG", nombre: "Sillas" },
    { id: "MS", nombre: "Mouse" },
    { id: "MP", nombre: "Mousepad" },
    { id: "PP", nombre: "Poleras" },
    { id: "PG", nombre: "Polerones" },
    { id: "ST", nombre: "Servicio Técnico" },
  ];
}

// Normaliza texto para búsqueda (quita acentos y pasa a minúsculas)
function normalizeText(str) {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

// Debounce util
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

let allProducts = [];
let lastSortPrice = "precio-asc";
let lastSortRating = "none";

const container = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const sortPrice = document.getElementById("sort-price");
const sortRating = document.getElementById("sort-rating");

import {
  includeCategoryTiles,
  setupCategoryTilesFilter,
} from "../components/category-tiles.js";
import {
  includeBrandTiles,
  setupBrandTilesFilter,
} from "../components/brand-tiles.js";
import {
  includeRatingTiles,
  setupRatingTilesFilter,
} from "../components/rating-tiles.js";

// Modular: categoría seleccionada y exponer getter/setter
let selectedCategory = null;
function getSelectedCategory() {
  return selectedCategory;
}
function setSelectedCategory(val) {
  selectedCategory = val;
}

// Modular: marca seleccionada y exponer getter/setter
let selectedBrand = null;
function getSelectedBrand() {
  return selectedBrand;
}
function setSelectedBrand(val) {
  selectedBrand = val;
}

// Obtener marcas únicas de los productos cargados
function getAvailableBrands() {
  const brands = new Set();
  allProducts.forEach((p) => {
    if (p.marca && typeof p.marca === "string" && p.marca.trim() !== "") {
      brands.add(p.marca.trim());
    }
  });
  return Array.from(brands).sort((a, b) => a.localeCompare(b, "es"));
}

// Modular: rating seleccionado y exponer getter/setter
let selectedRating = null;
function getSelectedRating() {
  return selectedRating;
}
function setSelectedRating(val) {
  selectedRating = val;
}

// Incluir sidebars modulares y setear lógica de filtros SOLO cuando estén en el DOM
includeCategoriesTiles("#category-tiles-placeholder").then(() => {
  setupCategoriesTilesFilter(
    renderFiltered,
    getSelectedCategory,
    setSelectedCategory,
    getAvailableCategories
  );
});
includeBrandTiles("#brand-tiles-placeholder").then(() => {
  setupBrandTilesFilter(
    renderFiltered,
    getSelectedBrand,
    setSelectedBrand,
    getAvailableBrands
  );
  includeRatingTiles("#rating-tiles-placeholder").then(() => {
    setupRatingTilesFilter(
      renderFiltered,
      getSelectedRating,
      setSelectedRating
    );
  });
});

import { renderProductCard } from "../components/product-card.js";

fetch("../../assets/data/products.json")
  .then((res) => res.json())
  .then((products) => {
    allProducts = products.map((p, idx) => ({ ...p, _idx: idx })); // _idx para sort estable
    renderFiltered();
  });

function renderFiltered() {
  let filtered = allProducts;
  const q = normalizeText(searchInput?.value || "");
  if (q) {
    filtered = filtered.filter(
      (p) =>
        normalizeText(p.nombre).includes(q) || normalizeText(p.code).includes(q)
    );
  }
  // Filtro por categoría destacada
  if (selectedCategory) {
    filtered = filtered.filter((p) => {
      return (
        p.categoriaId === selectedCategory ||
        (p.categoria &&
          normalizeText(p.categoria).includes(normalizeText(selectedCategory)))
      );
    });
  }
  // Filtro por marca
  if (selectedBrand) {
    filtered = filtered.filter((p) => p.marca === selectedBrand);
  }
  // Filtro por rating: productos con rating >= N y < N+1 (ej: 3 estrellas muestra 3.0 a 3.9)
  if (selectedRating !== null) {
    filtered = filtered.filter((p) => {
      if (typeof p.rating !== "number") return false;
      return p.rating >= selectedRating && p.rating < selectedRating + 1;
    });
  }
  // Ordenamiento estable: primero rating (si corresponde), luego precio
  filtered = stableSort(
    filtered,
    getSortRatingFn(sortRating?.value || lastSortRating)
  );
  filtered = stableSort(
    filtered,
    getSortPriceFn(sortPrice?.value || lastSortPrice)
  );
  container.innerHTML = "";
  if (filtered.length === 0) {
    container.innerHTML = `<div class="no-products-message fade-in">
      <span class="no-products-title">Caracoles! No hay nada que coincida con tu búsqueda.</span>
      <span class="no-products-sub">Intenta modificando los filtros aplicados.</span>
    </div>`;
    return;
  }
  filtered.forEach((product) => renderProductCard(product, container));
}

function getSortPriceFn(type) {
  lastSortPrice = type;
  if (type === "precio-asc")
    return (a, b) => a.precioCLP - b.precioCLP || a._idx - b._idx;
  if (type === "precio-desc")
    return (a, b) => b.precioCLP - a.precioCLP || a._idx - b._idx;
  return (a, b) => a._idx - b._idx;
}

function getSortRatingFn(type) {
  lastSortRating = type;
  if (type === "rating-asc")
    return (a, b) => a.rating - b.rating || a._idx - b._idx;
  if (type === "rating-desc")
    return (a, b) => b.rating - a.rating || a._idx - b._idx;
  return (a, b) => a._idx - b._idx;
}

// Sort estable
function stableSort(arr, cmp) {
  return arr.slice().sort((a, b) => cmp(a, b));
}

// Importación única

const debouncedRender = debounce(renderFiltered, 250);
if (searchInput) searchInput.addEventListener("input", debouncedRender);
if (sortPrice) sortPrice.addEventListener("change", renderFiltered);
if (sortRating) sortRating.addEventListener("change", renderFiltered);
