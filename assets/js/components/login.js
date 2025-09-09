// Dynamic loader and controller for login modal
// Fetches '/components/login.html' and injects into DOM on first load.
// Note: Actual API auth and persistent storage not implemented yet.

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
    const firstInput = modalRoot.querySelector("input[type=email]");
    firstInput && firstInput.focus();
    document.addEventListener("keydown", escListener);
  }

  function closeModal() {
    if (!modalRoot) return;
    modalRoot.classList.remove("active");
    modalRoot.hidden = true; // simple hide (could animate out later)
    document.removeEventListener("keydown", escListener);
  }

  function escListener(e) {
    if (e.key === "Escape") closeModal();
  }

  function wireUp() {
    // backdrop & close buttons
    modalRoot.querySelectorAll("[data-login-dismiss]").forEach((el) => {
      el.addEventListener("click", closeModal);
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

      // Placeholder for API call / auth logic
      console.log("[login-modal] submit", {
        email,
        passwordLength: password.length,
        remember,
      });
      // TODO: call auth API, set user in localStorage, handle errors

      closeModal();
    });
  }

  // Public trigger: create a global dispatcher for now
  window.LevelUpLogin = { open: openModal };

  // Auto-load component on first interaction (e.g., user presses a login button if added later)
  // For immediate availability on landing page uncomment next line:
  document.addEventListener("DOMContentLoaded", () => {
    loadComponent();
  });
})();
