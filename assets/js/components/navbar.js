document.addEventListener("DOMContentLoaded", function () {
  console.log("Navbar cargado correctamente");

  const navbarToggle = document.querySelector(".navbar-toggle");
  const navbarMenu = document.getElementById("navbar-menu");
  const cartCount = document.getElementById("cart-count");
  const navbarLinks = document.querySelectorAll(".navbar-link");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  // Cargar contador del carrito
  function loadCartCount() {
    const count = localStorage.getItem("cartCount") || 0;
    if (cartCount) {
      cartCount.textContent = count;
    }
  }

  // Alternar menú móvil
  function toggleMenu() {
    const isExpanded = navbarToggle.getAttribute("aria-expanded") === "true";
    navbarToggle.setAttribute("aria-expanded", !isExpanded);
    navbarMenu.classList.toggle("active");
  }

  // Cerrar menú al hacer clic en enlace (mobile)
  function closeMenu() {
    if (window.innerWidth <= 768) {
      navbarMenu.classList.remove("active");
      navbarToggle.setAttribute("aria-expanded", "false");
    }
  }

  // Agregar producto al carrito
  function addToCart() {
    let count = parseInt(localStorage.getItem("cartCount")) || 0;
    count++;
    localStorage.setItem("cartCount", count);
    cartCount.textContent = count;

    // Efecto visual
    cartCount.style.transform = "scale(1.3)";
    setTimeout(() => {
      cartCount.style.transform = "scale(1)";
    }, 300);
  }

  // Cerrar menú al redimensionar a desktop
  function handleResize() {
    if (window.innerWidth > 768) {
      navbarMenu.classList.remove("active");
      navbarToggle.setAttribute("aria-expanded", "false");
    }
  }

  // Event listeners
  navbarToggle.addEventListener("click", toggleMenu);

  navbarLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });

  window.addEventListener("resize", handleResize);

  // Inicializar
  loadCartCount();
  handleResize(); // Establecer estado inicial correcto

  console.log("Navbar inicializado correctamente");
});
