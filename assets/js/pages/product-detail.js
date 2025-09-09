import { renderStars } from "../../js/components/product-card.js";

// Obtener el código del producto desde la URL
function getProductCodeFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

// Renderizar el detalle del producto
function renderProductDetail(product) {
  const container = document.getElementById("product-detail-container");
  if (!product) {
    container.innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }
  const agotado = product.stock === 0;
  container.innerHTML = `
    <div class="product-detail-card">
      <div class="product-detail-image" style="position:relative;">
        <img src="../../${product.imagen}" alt="${product.nombre}" />
        ${agotado ? '<span class="badge-agotado">Agotado</span>' : ""}
      </div>
      <div class="product-detail-info">
        <h2>${product.nombre}</h2>
        <div class="product-detail-brand">${product.marca || ""}</div>
        <div class="product-detail-meta">
          <span class="product-detail-price">$${product.precioCLP.toLocaleString(
            "es-CL"
          )}</span>
          <span class="product-detail-rating">${renderStars(
            product.rating
          )}</span>
        </div>
        <p class="product-detail-description">${product.descripcion}</p>
        <ul class="product-detail-specs">
          ${product.specs.map((spec) => `<li>${spec}</li>`).join("")}
        </ul>
        <button class="add-to-cart${
          agotado ? " disabled" : ""
        }" aria-label="Agregar ${product.nombre} al carrito" ${
    agotado ? "disabled" : ""
  }>${agotado ? "Sin stock" : "Añadir al carrito"}</button>
      </div>
    </div>
  `;
}

// Cargar datos y renderizar
fetch("../../assets/data/products.json")
  .then((res) => res.json())
  .then((products) => {
    const code = getProductCodeFromURL();
    const product = products.find((p) => p.code === code);
    renderProductDetail(product);
  });
