// Dynamic loader and controller for register modal
// Fetches '/components/register.html' and injects into DOM on first load.
// Uses storage.js for localStorage-based registration persistence.

import { storage } from "../utils/storage.js";

(function () {
  const COMPONENT_URL = "/components/register.html";
  let modalRoot; // .lu-modal element
  let isLoaded = false;

  // Allowed email domains
  const ALLOWED_DOMAINS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];
  const DUOC_DOMAINS = ["duoc.cl", "profesor.duoc.cl"];

  async function loadComponent() {
    if (isLoaded) return modalRoot;
    try {
      const res = await fetch(COMPONENT_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar register component");
      const html = await res.text();
      const temp = document.createElement("div");
      temp.innerHTML = html.trim();
      modalRoot = temp.firstElementChild;
      document.body.appendChild(modalRoot);
      wireUp();
      isLoaded = true;
      return modalRoot;
    } catch (err) {
      console.error("[register-modal] error:", err);
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
    const firstInput = modalRoot.querySelector("input[name=nombre]");
    firstInput && firstInput.focus();
    document.addEventListener("keydown", escListener);
  }

  function closeModal() {
    if (!modalRoot) return;
    modalRoot.classList.remove("active");
    modalRoot.hidden = true;
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", escListener);
  }

  function escListener(e) {
    if (e.key === "Escape") closeModal();
  }

  // RUN validation (Chilean ID format)
  function validateRUN(run) {
    if (!run) return true; // Optional field
    const cleanRUN = run.replace(/[^0-9kK]/g, "");
    if (cleanRUN.length < 8 || cleanRUN.length > 9) return false;

    const body = cleanRUN.slice(0, -1);
    const checkDigit = cleanRUN.slice(-1).toUpperCase();

    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const remainder = sum % 11;
    const expectedDigit =
      remainder < 2
        ? remainder.toString()
        : remainder === 10
        ? "K"
        : (11 - remainder).toString();

    return checkDigit === expectedDigit;
  }

  // Age validation (must be >= 18)
  function validateAge(birthdate) {
    if (!birthdate) return false;
    const today = new Date();
    const birth = new Date(birthdate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }

  // Email format validation with regex
  function validateEmailFormat(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Email domain validation
  function validateEmailDomain(email) {
    if (!email) return false;
    const domain = email.split("@")[1]?.toLowerCase();
    return ALLOWED_DOMAINS.includes(domain);
  }

  // Complete email validation (format + domain)
  function validateEmail(email) {
    return validateEmailFormat(email) && validateEmailDomain(email);
  }

  // Check if email qualifies for DUOC discount
  function isDuocEmail(email) {
    if (!email) return false;
    const domain = email.split("@")[1]?.toLowerCase();
    return DUOC_DOMAINS.includes(domain);
  }

  function wireUp() {
    // backdrop & close buttons
    modalRoot.querySelectorAll("[data-register-dismiss]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    // Switch to login modal
    const switchToLogin = modalRoot.querySelector("[data-switch-to-login]");
    switchToLogin?.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal();
      window.LevelUpLogin?.open();
    });

    // Email domain checking for discount notice
    const emailInput = modalRoot.querySelector("#register-email");
    const discountNotice = modalRoot.querySelector("[data-discount-notice]");

    emailInput.addEventListener("input", () => {
      const email = emailInput.value.trim();
      if (isDuocEmail(email)) {
        discountNotice.hidden = false;
      } else {
        discountNotice.hidden = true;
      }
    });

    const form = modalRoot.querySelector("#register-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        run: form.run.value.trim(),
        nombre: form.nombre.value.trim(),
        apellidos: form.apellidos.value.trim(),
        email: form.email.value.trim(),
        birthdate: form.birthdate.value,
        password: form.password.value,
        referrer: form.referrer.value.trim(),
      };

      // Validation
      let valid = true;
      const errors = {};

      // RUN validation (optional)
      if (formData.run && !validateRUN(formData.run)) {
        errors.run = true;
        valid = false;
      }

      // Required fields
      if (!formData.nombre) {
        errors.nombre = true;
        valid = false;
      }
      if (!formData.apellidos) {
        errors.apellidos = true;
        valid = false;
      }

      // Email validation
      if (
        !formData.email ||
        formData.email.length > 100 ||
        !validateEmail(formData.email)
      ) {
        errors.email = true;
        valid = false;
      }

      // Age validation
      if (!formData.birthdate || !validateAge(formData.birthdate)) {
        errors.birthdate = true;
        valid = false;
      }

      // Password validation
      if (!formData.password || formData.password.length < 6) {
        errors.password = true;
        valid = false;
      }

      // Show/hide error messages
      Object.keys(errors).forEach((field) => {
        const errorEl = modalRoot.querySelector(`[data-error-${field}]`);
        if (errorEl) errorEl.hidden = false;
      });

      // Hide error messages for valid fields
      ["run", "nombre", "apellidos", "email", "birthdate", "password"].forEach(
        (field) => {
          if (!errors[field]) {
            const errorEl = modalRoot.querySelector(`[data-error-${field}]`);
            if (errorEl) errorEl.hidden = true;
          }
        }
      );

      if (!valid) return;

      // Create user registration data
      const userData = {
        ...formData,
        isDuocStudent: isDuocEmail(formData.email),
        hasLifetimeDiscount: isDuocEmail(formData.email),
        registrationDate: new Date().toISOString(),
        id: Date.now().toString(), // Simple ID generation
      };

      // Don't store password in plain text (in real app, this would be hashed server-side)
      delete userData.password;

      // Store in localStorage
      storage.local.set("userRegistration", userData);

      // Also store in users array for future reference
      const existingUsers = storage.local.get("users") || [];
      existingUsers.push(userData);
      storage.local.set("users", existingUsers);

      // Also create a basic session
      const sessionData = {
        email: userData.email,
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
        fromRegistration: true,
      };
      storage.cookies.set("userSession", sessionData, {
        secure: location.protocol === "https:",
        sameSite: "Lax",
      });

      console.log("[register-modal] registration successful", {
        email: userData.email,
        isDuocStudent: userData.isDuocStudent,
        hasDiscount: userData.hasLifetimeDiscount,
      });

      // TODO: call actual registration API endpoint here

      closeModal();

      // Show success message or redirect
      alert(
        `¡Registro exitoso! ${
          userData.hasLifetimeDiscount
            ? "🎓 Descuento del 20% activado de por vida."
            : ""
        }`
      );
    });
  }

  // Public API
  window.LevelUpRegister = {
    open: openModal,
    getRegistration: () => storage.local.get("userRegistration"),
  };

  // Auto-load component on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    loadComponent();
  });
})();
