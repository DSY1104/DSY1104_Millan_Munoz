// Renderiza una tarjeta de producto a partir de un objeto producto y un contenedor destino
export function renderProductCard(product, container) {
  // Clona el template HTML
  fetch("/components/product-card.html")
    .then((res) => res.text())
    .then((template) => {
      const temp = document.createElement("div");
      temp.innerHTML = template.trim();
      const card = temp.firstElementChild;

      // Imagen y alt
      const img = card.querySelector(".product-image");
      img.src = product.imagen;
      img.alt = product.nombre;

      // Nombre
      card.querySelector(".product-name").textContent = product.nombre;

      // Precio CLP
      card.querySelector(
        ".product-price"
      ).textContent = `$${product.precioCLP.toLocaleString("es-CL")}`;

      // Badge categoría (solo muestra el ID, para mostrar el nombre real se requiere lookup externo)
      const badge = card.querySelector(".product-category");
      badge.textContent = product.categoriaId;
      badge.style.background = product.categoryColor || "";

      // Rating (estrellas)
      const rating = card.querySelector(".product-rating");
      rating.innerHTML = renderStars(product.rating);

      // Botón accesible
      const btn = card.querySelector(".add-to-cart");
      btn.setAttribute("aria-label", `Agregar ${product.nombre} al carrito`);
      btn.addEventListener("click", () => {
        if (typeof window.addToCart === "function") window.addToCart(product);
      });

      container.appendChild(card);
    });
}

// Renderiza estrellas según rating (0-5)
function renderStars(rating) {
  const full = "★".repeat(Math.floor(rating));
  const empty = "☆".repeat(5 - Math.floor(rating));
  return `<span>${full}${empty}</span> <span style="font-size:0.9em;color:#fff;">${rating.toFixed(
    1
  )}</span>`;
}
