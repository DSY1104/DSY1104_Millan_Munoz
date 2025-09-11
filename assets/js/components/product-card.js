// Renderiza una tarjeta de producto a partir de un objeto producto y un contenedor destino
export function renderProductCard(product, container) {
  // Clona el template HTML
  // Ruta dinámica del template según ubicación del HTML
  const templatePath =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/"
      ? "components/product-card.html"
      : "/components/product-card.html";
  fetch(templatePath)
    .then((res) => res.text())
    .then((template) => {
      const temp = document.createElement("div");
      temp.innerHTML = template.trim();
      const card = temp.firstElementChild;

      // Imagen y alt
      const img = card.querySelector(".product-image");
      img.src = product.imagen;
      img.alt = product.nombre;
      img.title = product.nombre;
      img.setAttribute("aria-label", product.nombre);
      img.onerror = function () {
        this.onerror = null;
        this.src = `/assets/image/products/placeholder.webp`;
      };

      // Nombre y marca
      card.querySelector(".product-name").textContent = product.nombre;
      const brand = card.querySelector(".product-brand");
      brand.textContent = product.marca || "";

      // Precio CLP
      card.querySelector(
        ".product-price"
      ).textContent = `$${product.precioCLP.toLocaleString("es-CL")}`;

      // Badge categoría o agotado
      const badge = card.querySelector(".product-category");
      if (product.stock === 0) {
        badge.textContent = "Agotado";
        badge.style.background = "#b22222";
        badge.style.color = "#fff";
      } else {
        badge.textContent = product.categoriaId;
        badge.style.background = product.categoryColor || "";
      }

      // Rating (estrellas)
      const rating = card.querySelector(".product-rating");
      rating.innerHTML = renderStars(product.rating);

      // Botón accesible
      const btn = card.querySelector(".add-to-cart");
      btn.setAttribute("aria-label", `Agregar ${product.nombre} al carrito`);
      if (product.stock === 0) {
        btn.disabled = true;
        btn.textContent = "Sin stock";
        btn.classList.add("disabled");
      } else {
        btn.addEventListener("click", () => {
          if (typeof window.addToCart === "function") {
            window.addToCart({
              id: product.code,
              name: product.nombre,
              price: product.precioCLP,
              image: product.imagen,
              qty: 1,
              metadata: {
                marca: product.marca,
                categoriaId: product.categoriaId,
              },
            });
          }
        });
      }

      // Hacer toda la tarjeta clickeable (excepto el botón Añadir)
      card.style.cursor = "pointer";
      card.addEventListener("click", (e) => {
        // Evitar conflicto con el botón Añadir
        if (e.target.closest(".add-to-cart")) return;
        window.location.href = `/pages/products/detail.html?code=${encodeURIComponent(
          product.code
        )}`;
      });

      // Reiniciar animación si ya existe (para recarga dinámica)
      card.style.animation = "none";
      void card.offsetWidth; // trigger reflow
      card.style.animation = null;
      container.appendChild(card);
    });
}

// Renderiza estrellas según rating (0-5)
export function renderStars(rating) {
  const full = "★".repeat(Math.floor(rating));
  const empty = "☆".repeat(5 - Math.floor(rating));
  return `<span>${full}${empty}</span> <span style="font-size:0.9em;color:#fff;">${rating.toFixed(
    1
  )}</span>`;
}
