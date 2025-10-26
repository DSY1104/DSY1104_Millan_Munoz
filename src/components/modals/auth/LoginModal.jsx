import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import "../../../styles/components/_modal.css";

export default function LoginModal() {
  const {
    showLoginModal,
    closeLoginModal,
    switchToRegister,
    login,
    isAuthenticated,
  } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const emailInputRef = useRef(null);

  // Focus on email input when modal opens
  useEffect(() => {
    if (showLoginModal && emailInputRef.current) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  }, [showLoginModal]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showLoginModal) {
        closeLoginModal();
      }
    };

    if (showLoginModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.classList.add("modal-open");
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("modal-open");
    };
  }, [showLoginModal, closeLoginModal]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {
      email: !validateEmail(formData.email),
      password: formData.password.length < 6,
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }

    // Call login function (now async)
    const result = await login(
      formData.email,
      formData.password,
      formData.remember
    );

    if (result.success) {
      // Reset form
      setFormData({ email: "", password: "", remember: false });
      setErrors({ email: false, password: false });
    } else {
      // Handle login error - show error message to user
      console.error("Login failed:", result.error);
      alert(
        result.error ||
          "Error al iniciar sesión. Por favor, verifica tus credenciales."
      );
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeLoginModal();
    }
  };

  if (!showLoginModal) return null;

  return (
    <div
      className={`lu-modal${showLoginModal ? " active" : ""}`}
      id="login-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        className="lu-modal__backdrop"
        onClick={handleBackdropClick}
        aria-label="Cerrar modal"
      ></div>
      <div className="lu-modal__dialog" role="document">
        <div className="lu-modal__content">
          <button
            className="lu-modal__close"
            aria-label="Cerrar"
            onClick={closeLoginModal}
          >
            &times;
          </button>
          <header className="lu-modal__header">
            <h2 id="login-modal-title">Ingresar</h2>
          </header>
          <div className="lu-modal__body">
            <form id="login-form" onSubmit={handleSubmit} noValidate>
              <div className="form-control">
                <label htmlFor="login-email">Correo electrónico</label>
                <input
                  ref={emailInputRef}
                  type="email"
                  id="login-email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="tucorreo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p className="form-hint" id="email-error" role="alert">
                    Ingresa un correo válido.
                  </p>
                )}
              </div>

              <div className="form-control">
                <label htmlFor="login-password">Contraseña</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  autoComplete="current-password"
                  required
                  minLength="6"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                {errors.password && (
                  <p className="form-hint" id="password-error" role="alert">
                    Mínimo 6 caracteres.
                  </p>
                )}
              </div>

              <div className="form-row form-remember">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    id="login-remember"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  <span>Recordarme</span>
                </label>
                <a
                  href="#"
                  className="alt-link"
                  onClick={(e) => {
                    e.preventDefault();
                    switchToRegister();
                  }}
                >
                  Crear cuenta
                </a>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" id="login-submit">
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
