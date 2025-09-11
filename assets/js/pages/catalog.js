// =============================================================================
// CATALOG PAGE WITH PAGINATION
// =============================================================================

// Imports
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
import { renderProductCard } from "../components/product-card.js";

// =============================================================================
// GLOBAL VARIABLES
// =============================================================================

let allProducts = [];
let filteredProducts = [];
let lastSortPrice = "precio-asc";
let lastSortRating = "none";

// Pagination variables
let currentPage = 1;
const PRODUCTS_PER_PAGE = 12;
let totalPages = 1;

// Filter state
let selectedCategory = null;
let selectedBrand = null;
let selectedRating = null;

// DOM elements
const container = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const sortPrice = document.getElementById("sort-price");
const sortRating = document.getElementById("sort-rating");

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

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

// Sort estable
function stableSort(arr, cmp) {
  return arr.slice().sort((a, b) => cmp(a, b));
}

// =============================================================================
// FILTER GETTERS/SETTERS
// =============================================================================

function getSelectedCategory() {
  return selectedCategory;
}

function setSelectedCategory(val) {
  selectedCategory = val;
  resetPagination();
  updateQueryString();
}

function getSelectedBrand() {
  return selectedBrand;
}

function setSelectedBrand(val) {
  selectedBrand = val;
  resetPagination();
  updateQueryString();
}

function getSelectedRating() {
  return selectedRating;
}

function setSelectedRating(val) {
  selectedRating = val;
  resetPagination();
  updateQueryString();
}

// =============================================================================
// PAGINATION FUNCTIONS
// =============================================================================

function resetPagination() {
  currentPage = 1;
}

function scrollToTop() {
  const productSection = document.getElementById('productos');
  if (productSection) {
    productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function focusPaginationControls() {
  setTimeout(() => {
    const paginationControls = document.getElementById('pagination-controls');
    if (paginationControls) {
      paginationControls.setAttribute('tabindex', '-1');
      paginationControls.focus();
      paginationControls.removeAttribute('tabindex');
    }
  }, 100);
}

function createPageButton(pageNum) {
  const button = document.createElement('button');
  button.textContent = pageNum;
  button.className = `pagination-btn page-btn ${pageNum === currentPage ? 'active' : ''}`;
  if (pageNum !== currentPage) {
    button.onclick = () => {
      currentPage = pageNum;
      renderFiltered();
      scrollToTop();
      focusPaginationControls();
    };
  }
  return button;
}

function renderPaginationControls() {
  // Remove existing pagination controls
  const existingPagination = document.getElementById('pagination-controls');
  if (existingPagination) {
    existingPagination.remove();
  }

  // Don't show pagination if no products or only one page
  if (filteredProducts.length === 0 || totalPages <= 1) {
    return;
  }

  // Create pagination container
  const paginationContainer = document.createElement('div');
  paginationContainer.id = 'pagination-controls';
  paginationContainer.className = 'pagination-controls';

  // Create pagination info
  const startItem = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length);
  
  const paginationInfo = document.createElement('div');
  paginationInfo.className = 'pagination-info';
  paginationInfo.innerHTML = `
    <span>Mostrando ${startItem}-${endItem} de ${filteredProducts.length} productos</span>
  `;

  // Create pagination buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'pagination-buttons';

  // Previous button
  const prevButton = document.createElement('button');
  prevButton.innerHTML = '← Anterior';
  prevButton.className = 'pagination-btn';
  prevButton.disabled = currentPage === 1;
  if (!prevButton.disabled) {
    prevButton.onclick = () => {
      currentPage--;
      renderFiltered();
      scrollToTop();
      focusPaginationControls();
    };
  }
  buttonsContainer.appendChild(prevButton);

  // Page number buttons (show 5 pages max)
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  // Adjust start page if we're near the end
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // First page if not visible
  if (startPage > 1) {
    const firstPageBtn = createPageButton(1);
    buttonsContainer.appendChild(firstPageBtn);
    if (startPage > 2) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'pagination-ellipsis';
      ellipsis.textContent = '...';
      buttonsContainer.appendChild(ellipsis);
    }
  }

  // Page buttons
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = createPageButton(i);
    buttonsContainer.appendChild(pageBtn);
  }

  // Last page if not visible
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'pagination-ellipsis';
      ellipsis.textContent = '...';
      buttonsContainer.appendChild(ellipsis);
    }
    const lastPageBtn = createPageButton(totalPages);
    buttonsContainer.appendChild(lastPageBtn);
  }

  // Next button
  const nextButton = document.createElement('button');
  nextButton.innerHTML = 'Siguiente →';
  nextButton.className = 'pagination-btn';
  nextButton.disabled = currentPage === totalPages;
  if (!nextButton.disabled) {
    nextButton.onclick = () => {
      currentPage++;
      renderFiltered();
      scrollToTop();
      focusPaginationControls();
    };
  }
  buttonsContainer.appendChild(nextButton);

  // Assemble pagination controls
  paginationContainer.appendChild(paginationInfo);
  paginationContainer.appendChild(buttonsContainer);

  // Insert after product list
  const productSection = document.getElementById('productos');
  productSection.appendChild(paginationContainer);
}

// =============================================================================
// URL/QUERY STRING MANAGEMENT
// =============================================================================

function updateQueryString() {
  const params = new URLSearchParams();
  if (getSelectedCategory()) params.set("cat", getSelectedCategory());
  if (getSelectedBrand()) params.set("brand", getSelectedBrand());
  if (getSelectedRating() !== null) params.set("rating", getSelectedRating());
  if (searchInput && searchInput.value.trim() !== "") params.set("q", searchInput.value.trim());
  if (sortPrice && sortPrice.value !== "none") params.set("sortPrice", sortPrice.value);
  if (sortRating && sortRating.value !== "none") params.set("sortRating", sortRating.value);
  if (currentPage > 1) params.set("page", currentPage);
  const qs = params.toString();
  const url = qs ? `${location.pathname}?${qs}` : location.pathname;
  window.history.replaceState({}, "", url);
}

function restoreFromQueryString() {
  const params = new URLSearchParams(window.location.search);
  let changed = false;
  
  // Búsqueda
  if (params.has("q") && searchInput) {
    searchInput.value = params.get("q");
    changed = true;
  }
  
  // Orden precio
  if (params.has("sortPrice") && sortPrice) {
    sortPrice.value = params.get("sortPrice");
    changed = true;
  }
  
  // Orden rating
  if (params.has("sortRating") && sortRating) {
    sortRating.value = params.get("sortRating");
    changed = true;
  }
  
  // Page
  if (params.has("page")) {
    currentPage = parseInt(params.get("page")) || 1;
    changed = true;
  }
  
  // Note: Category, brand, and rating filters are handled by their respective components
  
  if (changed) renderFiltered();
}

// =============================================================================
// SORTING FUNCTIONS
// =============================================================================

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

// =============================================================================
// MAIN RENDERING FUNCTION
// =============================================================================

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
  
  // Ordenamiento: si precio está en 'none', solo rating; si no, primero rating, luego precio
  const sortPriceVal = sortPrice?.value || lastSortPrice;
  const sortRatingVal = sortRating?.value || lastSortRating;
  if (sortPriceVal === "none") {
    filtered = stableSort(filtered, getSortRatingFn(sortRatingVal));
  } else {
    filtered = stableSort(filtered, getSortRatingFn(sortRatingVal));
    filtered = stableSort(filtered, getSortPriceFn(sortPriceVal));
  }

  // Store filtered products for pagination
  filteredProducts = filtered;
  
  // Calculate pagination
  totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  
  // Ensure current page is valid
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }
  if (currentPage < 1) {
    currentPage = 1;
  }

  // Update URL with current page
  updateQueryString();

  // Clear container
  container.innerHTML = "";
  
  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="no-products-message fade-in" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; min-height: 220px; text-align: center;">
        <img src="../../assets/image/icon/login.svg" alt="Sin resultados" style="width: 80px; margin-bottom: 1em; opacity: 0.7;" />
        <span class="no-products-title" style="color: var(--accent-blue); font-size: 1.5em;">No encontramos productos</span>
        <span class="no-products-sub" style="color: #888; font-size: 1.1em;">Prueba ajustando los filtros, revisa la ortografía o explora otras categorías.<br>¡Siempre hay algo nuevo por descubrir!</span>
      </div>
    `;
    renderPaginationControls();
    return;
  }

  // Calculate products for current page
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentPageProducts = filteredProducts.slice(startIndex, endIndex);
  
  // Render products for current page
  currentPageProducts.forEach((product) => renderProductCard(product, container));
  
  // Render pagination controls
  renderPaginationControls();
}

// =============================================================================
// DATA LOADING AND FILTER SETUP
// =============================================================================

// Obtener marcas únicas de products.json
function getUniqueBrandsFromProducts(products) {
  const set = new Set();
  products.forEach((p) => {
    if (p.marca && typeof p.marca === "string" && p.marca.trim() !== "")
      set.add(p.marca.trim());
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}

// Initialize filters and load data
function initializeCatalog() {
  fetch("../../assets/data/products.json")
    .then((res) => res.json())
    .then((products) => {
      allProducts = products.map((p, idx) => ({ ...p, _idx: idx }));
      
      // Set up category filter
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
      
      // Set up brand filter
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
      
      // Set up rating filter
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
      
      // Restore state from URL and render
      restoreFromQueryString();
      renderFiltered();
    })
    .catch((error) => {
      console.error("Error loading products:", error);
    });
}

// =============================================================================
// EVENT LISTENERS
// =============================================================================

// Clear all filters button
document.addEventListener("DOMContentLoaded", () => {
  const clearAllBtn = document.getElementById("clear-all-filters");
  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      setSelectedCategory(null);
      setSelectedBrand(null);
      setSelectedRating(null);
      if (searchInput) searchInput.value = "";
      if (sortPrice) sortPrice.value = "precio-asc";
      if (sortRating) sortRating.value = "none";
      resetPagination();
      renderFiltered();
    });
  }
});

// Search and sort event handlers
const debouncedRender = debounce(() => {
  resetPagination();
  renderFiltered();
}, 250);

const handleSortChange = () => {
  resetPagination();
  renderFiltered();
};

if (searchInput) searchInput.addEventListener("input", debouncedRender);
if (sortPrice) sortPrice.addEventListener("change", handleSortChange);
if (sortRating) sortRating.addEventListener("change", handleSortChange);

// =============================================================================
// INITIALIZATION
// =============================================================================

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initializeCatalog);
