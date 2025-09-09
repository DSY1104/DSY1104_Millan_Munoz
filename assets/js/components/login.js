// Dynamic loader and controller for login modal
// Fetches '/components/login.html' and injects into DOM on first load.
// Uses storage.js for cookie-based login persistence.

import { storage } from "../utils/storage.js";

(function () {
  const COMPONENT_URL = "/components/login.html";
  let modalRoot; // .lu-modal element
  let isLoaded = false;

  async function loadComponent() {
    if (isLoaded) return modalRoot;
    try {
      const res = await fetch(COMPONENT_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar login component");
      const html = await res.text();
      const temp = document.createElement("div");
      temp.innerHTML = html.trim();
      modalRoot = temp.firstElementChild;
      document.body.appendChild(modalRoot);
      wireUp();
      isLoaded = true;
      return modalRoot;
    } catch (err) {
      console.error("[login-modal] error:", err);
    }
  }

  function openModal() {
    if (!modalRoot) {
      loadComponent().then(() => {
        requestAnimationFrame(() => activateModal());
      });
    } else {
      activateModal();
    }
  }

  function activateModal() {
    modalRoot.hidden = false;
    modalRoot.classList.add("active");
    document.body.classList.add("modal-open");
    const firstInput = modalRoot.querySelector("input[type=email]");
    firstInput && firstInput.focus();
    document.addEventListener("keydown", escListener);
  }

  function closeModal() {
    if (!modalRoot) return;
    modalRoot.classList.remove("active");
    modalRoot.hidden = true; // simple hide (could animate out later)
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", escListener);
  }

  function escListener(e) {
    if (e.key === "Escape") closeModal();
  }

  // Check if user is already logged in
  function checkExistingLogin() {
    const session = storage.cookies.get("userSession");
    const remember = storage.cookies.get("rememberLogin");

    if (session && session.isAuthenticated) {
      console.log("[login-modal] existing session found", session);
      return session;
    }
    return null;
  }

  // Logout function
  function logout() {
    try {
      // Clear authentication cookies
      storage.cookies.remove("userSession");
      storage.cookies.remove("rememberLogin");
      
      // Clear any localStorage data related to user session
      localStorage.removeItem("userSession");
      localStorage.removeItem("rememberLogin");
      
      console.log("[login-modal] user logged out successfully");
      
      // Trigger any UI updates that might be listening
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      
      return true;
    } catch (error) {
      console.error("[login-modal] error during logout:", error);
      return false;
    }
  }

  function wireUp() {
    // backdrop & close buttons
    modalRoot.querySelectorAll("[data-login-dismiss]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    // Switch to register modal
    const switchToRegister = modalRoot.querySelector(
      "[data-switch-to-register]"
    );
    switchToRegister?.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal();
      window.LevelUpRegister?.open();
    });

    const form = modalRoot.querySelector("#login-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const password = form.password.value;
      const remember = form.remember.checked; // future localStorage usage

      // Simple front validation
      let valid = true;
      const emailErr = modalRoot.querySelector("[data-error-email]");
      const passErr = modalRoot.querySelector("[data-error-password]");

      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        emailErr.hidden = false;
        valid = false;
      } else {
        emailErr.hidden = true;
      }
      if (password.length < 6) {
        passErr.hidden = false;
        valid = false;
      } else {
        passErr.hidden = true;
      }

      if (!valid) return;

      // Simulate successful login and persist user data
      const userData = {
        email,
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
      };

      // Use cookies for persistence based on "remember me" choice
      if (remember) {
        // Remember for 30 days
        storage.cookies.set("userSession", userData, {
          days: 30,
          secure: location.protocol === "https:",
          sameSite: "Lax",
        });
        storage.cookies.set("rememberLogin", true, {
          days: 30,
          secure: location.protocol === "https:",
          sameSite: "Lax",
        });
      } else {
        // Session-only (expires when browser closes)
        storage.cookies.set("userSession", userData, {
          secure: location.protocol === "https:",
          sameSite: "Lax",
        });
      }

      console.log("[login-modal] login successful", {
        email,
        remember,
        stored: storage.cookies.get("userSession"),
      });

      // TODO: call actual auth API endpoint here

      closeModal();
    });
  }

  // Public trigger: create a global dispatcher for now
  window.LevelUpLogin = {
    open: openModal,
    logout: logout,
    getSession: () => storage.cookies.get("userSession"),
    isLoggedIn: () => {
      const session = storage.cookies.get("userSession");
      return session && session.isAuthenticated;
    },
  };

  // Auto-load component on first interaction (e.g., user presses a login button if added later)
  // For immediate availability on landing page uncomment next line:
  document.addEventListener("DOMContentLoaded", () => {
    loadComponent();
    // Check for existing login on page load
    const existingSession = checkExistingLogin();
    if (existingSession) {
      console.log("[login-modal] restored session for:", existingSession.email);
    }
  });
})();
