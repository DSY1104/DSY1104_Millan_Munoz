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
