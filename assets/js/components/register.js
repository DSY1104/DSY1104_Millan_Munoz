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

  // Referral code validation (alphanumeric 6-10 characters)
  function validateReferralCode(code) {
    if (!code) return true; // Optional field
    const alphanumericRegex = /^[a-zA-Z0-9]{6,10}$/;
    return alphanumericRegex.test(code);
  }

  // Mock function to check if referral code exists and is valid
  function isValidReferralCode(code) {
    if (!code) return false;
    // Mock validation - in real app this would check against database
    // For demo purposes, codes starting with 'LEVEL' or 'GAME' are valid
    const validPrefixes = ["LEVEL", "GAME", "DUOC", "REF"];
    return validPrefixes.some((prefix) =>
      code.toUpperCase().startsWith(prefix)
    );
  }

  // Calculate referral points for new user and referrer
  function calculateReferralPoints(referralCode) {
    if (!referralCode) return { newUser: 0, referrer: 0 };

    // Mock points calculation based on code type
    const code = referralCode.toUpperCase();
    if (code.startsWith("LEVEL")) {
      return { newUser: 500, referrer: 300 };
    } else if (code.startsWith("GAME")) {
      return { newUser: 400, referrer: 250 };
    } else if (code.startsWith("DUOC")) {
      return { newUser: 600, referrer: 400 };
    } else {
      return { newUser: 300, referrer: 200 };
    }
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

    // Referral code validation and feedback
    const referralCodeInput = modalRoot.querySelector(
      "#register-referral-code"
    );
    const referralCodeError = modalRoot.querySelector(
      "[data-error-referral-code]"
    );
    const referralCodeSuccess = modalRoot.querySelector(
      "[data-success-referral-code]"
    );
    const referralCodeFormat = modalRoot.querySelector(
      "[data-format-referral-code]"
    );

    referralCodeInput.addEventListener("focus", () => {
      if (!referralCodeInput.value.trim()) {
        referralCodeFormat.hidden = false;
      }
    });

    referralCodeInput.addEventListener("blur", () => {
      referralCodeFormat.hidden = true;
    });

    referralCodeInput.addEventListener("input", () => {
      const code = referralCodeInput.value.trim();

      // Reset feedback
      referralCodeError.hidden = true;
      referralCodeSuccess.hidden = true;

      if (!code) {
        referralCodeFormat.hidden = false;
        return;
      }

      referralCodeFormat.hidden = true;

      // Format validation
      if (!validateReferralCode(code)) {
        referralCodeError.hidden = false;
        return;
      }

      // Check if code exists (mock validation)
      if (isValidReferralCode(code)) {
        referralCodeSuccess.hidden = false;
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
        referralCode: form.referralCode.value.trim(),
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

      // Referral code validation (optional but must be valid if provided)
      if (
        formData.referralCode &&
        !validateReferralCode(formData.referralCode)
      ) {
        errors.referralCode = true;
        valid = false;
      }

      // Show/hide error messages
      Object.keys(errors).forEach((field) => {
        const errorEl = modalRoot.querySelector(`[data-error-${field}]`);
        if (errorEl) errorEl.hidden = false;
      });

      // Hide error messages for valid fields
      [
        "run",
        "nombre",
        "apellidos",
        "email",
        "birthdate",
        "password",
        "referralCode",
      ].forEach((field) => {
        if (!errors[field]) {
          const errorEl = modalRoot.querySelector(`[data-error-${field}]`);
          if (errorEl) errorEl.hidden = true;
        }
      });

      if (!valid) return;

      // Calculate referral points if code is provided and valid
      let referralPoints = { newUser: 0, referrer: 0 };
      if (formData.referralCode && isValidReferralCode(formData.referralCode)) {
        referralPoints = calculateReferralPoints(formData.referralCode);
      }

      // Create user registration data
      const userData = {
        ...formData,
        isDuocStudent: isDuocEmail(formData.email),
        hasLifetimeDiscount: isDuocEmail(formData.email),
        registrationDate: new Date().toISOString(),
        id: Date.now().toString(), // Simple ID generation
        referralPoints: referralPoints.newUser,
        usedReferralCode: formData.referralCode || null,
      };

      // Don't store password in plain text (in real app, this would be hashed server-side)
      delete userData.password;

      // Store in localStorage
      storage.local.set("userRegistration", userData);

      // Also store in users array for future reference
      const existingUsers = storage.local.get("users") || [];
      existingUsers.push(userData);
      storage.local.set("users", existingUsers);

      // Award referral points to the new user if applicable
      if (referralPoints.newUser > 0) {
        const currentPoints = storage.local.get("userPoints") || 0;
        const newPointsTotal = currentPoints + referralPoints.newUser;
        storage.local.set("userPoints", newPointsTotal);

        // Store referral transaction for history
        const referralTransactions =
          storage.local.get("referralTransactions") || [];
        referralTransactions.push({
          type: "referral_bonus",
          points: referralPoints.newUser,
          referralCode: formData.referralCode,
          date: new Date().toISOString(),
          userId: userData.id,
        });
        storage.local.set("referralTransactions", referralTransactions);
      }

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
        referralPoints: referralPoints.newUser,
        referralCode: formData.referralCode,
      });

      // TODO: call actual registration API endpoint here

      closeModal();

      // Show success message with points information
      let successMessage = "¡Registro exitoso!";

      if (userData.hasLifetimeDiscount) {
        successMessage += " 🎓 Descuento del 20% activado de por vida.";
      }

      if (referralPoints.newUser > 0) {
        successMessage += ` 🎯 Has ganado ${referralPoints.newUser} puntos LevelUp por usar el código de referido!`;
      }

      alert(successMessage);
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
