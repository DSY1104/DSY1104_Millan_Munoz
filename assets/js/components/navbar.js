// Navbar inicialización directa (sin esperar DOMContentLoaded)
console.log("Navbar cargado correctamente");

const navbarToggle = document.querySelector(".navbar-toggle");
const navbarMenu = document.getElementById("navbar-menu");
const cartCount = document.getElementById("cart-count");
const navbarLinks = document.querySelectorAll(".navbar-link");
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const userMenuBtn = document.getElementById("user-menu-btn");
const loginBtn = document.getElementById("login-btn");
const userMenu = document.getElementById("user-menu");
const logoutBtn = document.getElementById("logout-btn");

// Check login status and update UI
function updateLoginState() {
  // Wait for login system to be available
  if (!window.LevelUpLogin) {
    // Default to logged out state
    if (loginBtn && userMenuBtn) {
      loginBtn.style.display = "flex";
      userMenuBtn.style.display = "none";
    }
    return;
  }

  const isLoggedIn = window.LevelUpLogin.isLoggedIn();
  
  if (loginBtn && userMenuBtn) {
    if (isLoggedIn) {
      loginBtn.style.display = "none";
      userMenuBtn.style.display = "flex";
    } else {
      loginBtn.style.display = "flex";
      userMenuBtn.style.display = "none";
    }
  }
}

// Open login modal
function openLoginModal() {
  if (window.LevelUpLogin) {
    window.LevelUpLogin.open();
  } else {
    console.error("Login system not available. Attempting to load...");
    // Try to wait a bit and retry
    setTimeout(() => {
      if (window.LevelUpLogin) {
        window.LevelUpLogin.open();
      } else {
        alert("Sistema de login no disponible. Por favor, recarga la página.");
      }
    }, 1000);
  }
}

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

// Alternar menú de usuario
function toggleUserMenu() {
  userMenu.classList.toggle("active");
}

// Cerrar menús al hacer clic fuera
function closeMenusOnClickOutside(event) {
  if (!event.target.closest(".navbar-user")) {
    userMenu.classList.remove("active");
  }

  if (
    !event.target.closest(".navbar-menu") &&
    !event.target.closest(".navbar-toggle")
  ) {
    navbarMenu.classList.remove("active");
    navbarToggle.setAttribute("aria-expanded", "false");
  }
}

// Cerrar menú al hacer clic en enlace (mobile)
function closeMenu() {
  if (window.innerWidth <= 768) {
    navbarMenu.classList.remove("active");
    navbarToggle.setAttribute("aria-expanded", "false");
  }
}

// Cerrar sesión
function logout() {
  try {
    let logoutSuccess = false;
    
    // Use the proper logout method from the login system
    if (window.LevelUpLogin && window.LevelUpLogin.logout) {
      logoutSuccess = window.LevelUpLogin.logout();
    } else {
      // Fallback: manual cleanup if login system not available
      console.warn("Login system not available, using fallback logout");
      localStorage.removeItem("userProfile");
      localStorage.removeItem("userSession");
      // Clear cookies manually
      document.cookie = "userSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "rememberLogin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      logoutSuccess = true;
    }

    // Clear any profile-related data
    localStorage.removeItem("userProfile");
    
    // Close user menu
    if (userMenu) {
      userMenu.classList.remove("active");
    }
    
    // Update UI immediately
    updateLoginState();
    
    if (logoutSuccess) {
      // Show success message
      alert("Sesión cerrada correctamente");

      // Redirect to home page with proper path resolution
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/').filter(segment => segment !== '');
      
      // Remove filename if present
      if (pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.html')) {
        pathSegments.pop();
      }
      
      const depth = pathSegments.length;
      let homePath;
      
      if (depth === 0) {
        homePath = "index.html";
      } else if (depth === 1) {
        homePath = "../index.html";
      } else {
        homePath = "../../index.html";
      }
      
      // Small delay to allow UI updates to process
      setTimeout(() => {
        window.location.href = homePath;
      }, 100);
    } else {
      alert("Error al cerrar sesión. Por favor, inténtalo de nuevo.");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    alert("Error al cerrar sesión. Por favor, recarga la página.");
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
    userMenu.classList.remove("active");
  }
}

// Event listeners
if (navbarToggle) navbarToggle.addEventListener("click", toggleMenu);
if (userMenuBtn) userMenuBtn.addEventListener("click", toggleUserMenu);
if (loginBtn) loginBtn.addEventListener("click", openLoginModal);
if (logoutBtn) logoutBtn.addEventListener("click", logout);

navbarLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

addToCartButtons.forEach((button) => {
  button.addEventListener("click", addToCart);
});

// Cerrar menús al hacer clic fuera
document.addEventListener("click", closeMenusOnClickOutside);

// Listen for logout events
window.addEventListener("userLoggedOut", () => {
  updateLoginState();
  console.log("User logged out - UI updated");
});

window.addEventListener("resize", handleResize);

// Check for login state changes - start after a delay to allow login system to load
setTimeout(() => {
  updateLoginState(); // Initial check
  setInterval(updateLoginState, 2000); // Check every 2 seconds
}, 1000);

// Inicializar
loadCartCount();
handleResize(); // Establecer estado inicial correcto
updateLoginState(); // Initial login state check

console.log("Navbar inicializado correctamente");
