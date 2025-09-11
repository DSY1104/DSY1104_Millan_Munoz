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
  // Ensure UI elements exist
  if (!loginBtn || !userMenuBtn) {
    return;
  }

  // Wait for login system to be available
  if (!window.LevelUpLogin) {
    // Default to logged out state when login system isn't ready
    loginBtn.style.display = "flex";
    userMenuBtn.style.display = "none";
    return;
  }

  try {
    const isLoggedIn = window.LevelUpLogin.isLoggedIn();

    if (isLoggedIn) {
      loginBtn.style.display = "none";
      userMenuBtn.style.display = "flex";
    } else {
      loginBtn.style.display = "flex";
      userMenuBtn.style.display = "none";
    }
  } catch (error) {
    console.warn("Error checking login state:", error);
    // Fallback to logged out state on error
    loginBtn.style.display = "flex";
    userMenuBtn.style.display = "none";
  }
}

// Open login modal
function openLoginModal() {
  if (window.LevelUpLogin) {
    window.LevelUpLogin.open();
  } else {
    console.log("Login system loading, please wait...");
    // Wait for login system to become available with exponential backoff
    waitForLoginSystem()
      .then(() => {
        window.LevelUpLogin.open();
      })
      .catch(() => {
        alert("Sistema de login no disponible. Por favor, recarga la página.");
      });
  }
}

// Helper function to wait for login system with timeout
function waitForLoginSystem(maxAttempts = 10, attempt = 1) {
  return new Promise((resolve, reject) => {
    if (window.LevelUpLogin) {
      resolve();
      return;
    }

    if (attempt >= maxAttempts) {
      console.error("Login system failed to load after maximum attempts");
      reject(new Error("Login system not available"));
      return;
    }

    const delay = Math.min(100 * Math.pow(1.5, attempt - 1), 2000); // Exponential backoff, max 2s
    setTimeout(() => {
      waitForLoginSystem(maxAttempts, attempt + 1)
        .then(resolve)
        .catch(reject);
    }, delay);
  });
}

// Cargar contador del carrito (suma real de cantidades)
function loadCartCount() {
  let count = 0;
  try {
    const cartData = JSON.parse(localStorage.getItem("cart:data"));
    if (cartData && Array.isArray(cartData.items)) {
      count = cartData.items.reduce((sum, item) => sum + (item.qty || 1), 0);
    }
  } catch {}
  if (cartCount) {
    cartCount.textContent = count;
  }
}

// Escuchar cambios en el carrito para actualizar el contador
document.addEventListener("cart:changed", loadCartCount);

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
      document.cookie =
        "userSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "rememberLogin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
      const pathSegments = currentPath
        .split("/")
        .filter((segment) => segment !== "");

      // Remove filename if present
      if (
        pathSegments.length > 0 &&
        pathSegments[pathSegments.length - 1].includes(".html")
      ) {
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

// Nueva función global para agregar productos al carrito real
import { cart } from "../pages/cart.js";
window.addToCart = function (product) {
  try {
    cart.add(product);
    // Disparar evento para actualizar UI
    document.dispatchEvent(new CustomEvent("cart:changed"));
    // Efecto visual
    if (cartCount) {
      cartCount.style.transform = "scale(1.3)";
      setTimeout(() => {
        cartCount.style.transform = "scale(1)";
      }, 300);
    }
  } catch (e) {
    alert("No se pudo agregar el producto al carrito");
    console.error(e);
  }
};

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

// Cerrar menús al hacer clic fuera
document.addEventListener("click", closeMenusOnClickOutside);

// Listen for logout events
window.addEventListener("userLoggedOut", () => {
  updateLoginState();
  console.log("User logged out - UI updated");
});

window.addEventListener("resize", handleResize);

// Check for login state changes - wait for login system to be available
function initializeLoginStateMonitoring() {
  waitForLoginSystem(20) // Give more time for initial load
    .then(() => {
      console.log("Login system available, starting state monitoring");
      updateLoginState(); // Initial check
      setInterval(updateLoginState, 2000); // Check every 2 seconds
    })
    .catch(() => {
      console.warn(
        "Login system not available, using fallback state monitoring"
      );
      // Fallback: check periodically if login system becomes available
      const fallbackCheck = setInterval(() => {
        if (window.LevelUpLogin) {
          clearInterval(fallbackCheck);
          console.log(
            "Login system became available, starting state monitoring"
          );
          updateLoginState();
          setInterval(updateLoginState, 2000);
        }
      }, 1000);

      // Stop fallback after 30 seconds
      setTimeout(() => {
        clearInterval(fallbackCheck);
      }, 30000);
    });
}

initializeLoginStateMonitoring();

// Inicializar
loadCartCount();
handleResize(); // Establecer estado inicial correcto
updateLoginState(); // Initial login state check

console.log("Navbar inicializado correctamente");
