import { renderStars } from "../../js/components/product-card.js";
import { cart } from "./cart.js";

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
          <span class="product-detail-price">$${product.precioCLP.toLocaleString("es-CL")}</span>
          <span class="product-detail-rating">${renderStars(product.rating)}</span>
        </div>
        <p class="product-detail-description">${product.descripcion}</p>
        <ul class="product-detail-specs">
          ${product.specs.map((spec) => `<li>${spec}</li>`).join("")}
        </ul>
        <div class="quantity-selector" style="margin: 1em 0; display: flex; align-items: center; gap: 0.5em;">
          <button type="button" class="qty-btn" id="qty-minus" aria-label="Disminuir cantidad" ${agotado ? "disabled" : ""}>-</button>
          <input type="number" id="qty-input" min="1" max="${product.stock}" value="1" style="width: 3em; text-align: center;" ${agotado ? "disabled" : ""} />
          <button type="button" class="qty-btn" id="qty-plus" aria-label="Aumentar cantidad" ${agotado ? "disabled" : ""}>+</button>
          <span style="font-size:0.9em; color:#888;">(Stock: ${product.stock})</span>
        </div>
        <div id="qty-error" style="color: #b22222; font-size: 0.95em; min-height: 1.2em;"></div>
        <button class="add-to-cart${agotado ? " disabled" : ""}" aria-label="Agregar ${product.nombre} al carrito" ${agotado ? "disabled" : ""}>${agotado ? "Sin stock" : "Añadir al carrito"}</button>
      </div>
    </div>
  `;

  if (!agotado) {
    const qtyInput = document.getElementById("qty-input");
    const minusBtn = document.getElementById("qty-minus");
    const plusBtn = document.getElementById("qty-plus");
    const addToCartBtn = container.querySelector(".add-to-cart");
    const errorDiv = document.getElementById("qty-error");

    function validateQty() {
      let val = parseInt(qtyInput.value, 10);
      if (isNaN(val) || val < 1) {
        qtyInput.value = 1;
        val = 1;
      } else if (val > product.stock) {
        qtyInput.value = product.stock;
        val = product.stock;
      }
      if (val > product.stock) {
        errorDiv.textContent = `No puedes añadir más de ${product.stock} unidades.`;
        addToCartBtn.disabled = true;
      } else if (val < 1) {
        errorDiv.textContent = "La cantidad debe ser al menos 1.";
        addToCartBtn.disabled = true;
      } else {
        errorDiv.textContent = "";
        addToCartBtn.disabled = false;
      }
      return val;
    }

    minusBtn.addEventListener("click", () => {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) - 1);
      validateQty();
    });
    plusBtn.addEventListener("click", () => {
      qtyInput.value = Math.min(product.stock, parseInt(qtyInput.value, 10) + 1);
      validateQty();
    });
    qtyInput.addEventListener("input", validateQty);

    addToCartBtn.addEventListener("click", () => {
      const qty = validateQty();
      if (qty < 1 || qty > product.stock) return;
      cart.add({
        id: product.code,
        name: product.nombre,
        price: product.precioCLP,
        qty: qty,
        image: product.imagen,
        metadata: {
          marca: product.marca,
          categoriaId: product.categoriaId,
        },
      });
      // Notificar a la UI del carrito para actualizar el contador
      document.dispatchEvent(new CustomEvent("cart:changed", { detail: cart.get() }));
      addToCartBtn.textContent = "¡Añadido!";
      addToCartBtn.disabled = true;
      setTimeout(() => {
        addToCartBtn.textContent = "Añadir al carrito";
        addToCartBtn.disabled = false;
      }, 1200);
    });
  }
}

// Cargar datos y renderizar
fetch("../../assets/data/products.json")
  .then((res) => res.json())
  .then((products) => {
    const code = getProductCodeFromURL();
    const product = products.find((p) => p.code === code);
    renderProductDetail(product);
  });
