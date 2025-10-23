import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import "../../../styles/components/_modal.css";

// Allowed email domains
const ALLOWED_DOMAINS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];
const DUOC_DOMAINS = ["duoc.cl", "profesor.duoc.cl"];

export default function RegisterModal() {
  const { showRegisterModal, closeRegisterModal, switchToLogin, register } =
    useAuth();

  const [formData, setFormData] = useState({
    run: "",
    nombre: "",
    apellidos: "",
    email: "",
    birthdate: "",
    password: "",
    referralCode: "",
  });

  const [errors, setErrors] = useState({});
  const [showDuocDiscount, setShowDuocDiscount] = useState(false);
  const [referralCodeStatus, setReferralCodeStatus] = useState({
    valid: false,
    message: "",
    showFormat: false,
  });

  const nombreInputRef = useRef(null);

  // Focus on first input when modal opens
  useEffect(() => {
    if (showRegisterModal && nombreInputRef.current) {
      setTimeout(() => {
        nombreInputRef.current?.focus();
      }, 100);
    }
  }, [showRegisterModal]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showRegisterModal) {
        closeRegisterModal();
      }
    };

    if (showRegisterModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.classList.add("modal-open");
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("modal-open");
    };
  }, [showRegisterModal, closeRegisterModal]);

  // RUN validation (Chilean ID format)
  const validateRUN = (run) => {
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
  };

  // Age validation (must be >= 18)
  const validateAge = (birthdate) => {
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
  };

  // Email validation
  const validateEmailFormat = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmailDomain = (email) => {
    if (!email) return false;
    const domain = email.split("@")[1]?.toLowerCase();
    return ALLOWED_DOMAINS.includes(domain);
  };

  const validateEmail = (email) => {
    return validateEmailFormat(email) && validateEmailDomain(email);
  };

  const isDuocEmail = (email) => {
    if (!email) return false;
    const domain = email.split("@")[1]?.toLowerCase();
    return DUOC_DOMAINS.includes(domain);
  };

  // Referral code validation
  const validateReferralCode = (code) => {
    if (!code) return true; // Optional field
    const alphanumericRegex = /^[a-zA-Z0-9]{6,10}$/;
    return alphanumericRegex.test(code);
  };

  const isValidReferralCode = (code) => {
    if (!code) return false;
    // Mock validation - codes starting with specific prefixes are valid
    const validPrefixes = ["LEVEL", "GAME", "DUOC", "REF"];
    return validPrefixes.some((prefix) =>
      code.toUpperCase().startsWith(prefix)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Email domain checking for discount notice
    if (name === "email") {
      setShowDuocDiscount(isDuocEmail(value));
    }

    // Referral code validation feedback
    if (name === "referralCode") {
      const code = value.trim();
      if (!code) {
        setReferralCodeStatus({ valid: false, message: "", showFormat: false });
        return;
      }

      if (!validateReferralCode(code)) {
        setReferralCodeStatus({
          valid: false,
          message:
            "El código debe tener entre 6 y 10 caracteres alfanuméricos.",
          showFormat: false,
        });
        return;
      }

      if (isValidReferralCode(code)) {
        setReferralCodeStatus({
          valid: true,
          message: "✓ Código válido. ¡Ganarás puntos LevelUp al registrarte!",
          showFormat: false,
        });
      } else {
        setReferralCodeStatus({
          valid: false,
          message: "Código no válido.",
          showFormat: false,
        });
      }
    }
  };

  const handleReferralCodeFocus = () => {
    if (!formData.referralCode.trim()) {
      setReferralCodeStatus((prev) => ({ ...prev, showFormat: true }));
    }
  };

  const handleReferralCodeBlur = () => {
    setReferralCodeStatus((prev) => ({ ...prev, showFormat: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};

    // RUN validation (optional)
    if (formData.run && !validateRUN(formData.run)) {
      newErrors.run = "Formato de RUN inválido.";
    }

    // Required fields
    if (!formData.nombre.trim()) {
      newErrors.nombre = "Nombre es requerido.";
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "Apellidos son requeridos.";
    }

    // Email validation
    if (
      !formData.email ||
      formData.email.length > 100 ||
      !validateEmail(formData.email)
    ) {
      newErrors.email = "Email inválido o dominio no permitido.";
    }

    // Age validation
    if (!formData.birthdate || !validateAge(formData.birthdate)) {
      newErrors.birthdate = "Debes ser mayor de 18 años.";
    }

    // Password validation
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres.";
    }

    // Referral code validation (optional but must be valid if provided)
    if (formData.referralCode && !validateReferralCode(formData.referralCode)) {
      newErrors.referralCode =
        "El código debe tener entre 6 y 10 caracteres alfanuméricos.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Calculate referral points if code is provided and valid
    let referralPoints = { newUser: 0, referrer: 0 };
    if (formData.referralCode && isValidReferralCode(formData.referralCode)) {
      const code = formData.referralCode.toUpperCase();
      if (code.startsWith("LEVEL")) {
        referralPoints = { newUser: 500, referrer: 300 };
      } else if (code.startsWith("GAME")) {
        referralPoints = { newUser: 400, referrer: 250 };
      } else {
        referralPoints = { newUser: 300, referrer: 200 };
      }
    }

    // Prepare registration data
    const registrationData = {
      ...formData,
      isDuocEmail: isDuocEmail(formData.email),
      referralPoints,
      registeredAt: new Date().toISOString(),
    };

    // Call register function
    const result = register(registrationData);

    if (result.success) {
      // Reset form
      setFormData({
        run: "",
        nombre: "",
        apellidos: "",
        email: "",
        birthdate: "",
        password: "",
        referralCode: "",
      });
      setErrors({});
      setShowDuocDiscount(false);
      setReferralCodeStatus({ valid: false, message: "", showFormat: false });
    } else {
      console.error("Registration failed:", result.error);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeRegisterModal();
    }
  };

  if (!showRegisterModal) return null;

  return (
    <div
      className={`lu-modal${showRegisterModal ? " active" : ""}`}
      id="register-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
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
            onClick={closeRegisterModal}
          >
            &times;
          </button>
          <header className="lu-modal__header">
            <h2 id="register-modal-title">Crear cuenta</h2>
          </header>
          <div className="lu-modal__body">
            <form id="register-form" onSubmit={handleSubmit} noValidate>
              <div className="form-control">
                <label htmlFor="register-run">RUN (opcional)</label>
                <input
                  type="text"
                  id="register-run"
                  name="run"
                  placeholder="12.345.678-9"
                  value={formData.run}
                  onChange={handleChange}
                  aria-invalid={!!errors.run}
                  aria-describedby={errors.run ? "run-error" : undefined}
                />
                {errors.run && (
                  <p className="form-hint" id="run-error" role="alert">
                    {errors.run}
                  </p>
                )}
              </div>

              <div className="form-row">
                <div className="form-control half">
                  <label htmlFor="register-nombre">Nombre</label>
                  <input
                    ref={nombreInputRef}
                    type="text"
                    id="register-nombre"
                    name="nombre"
                    required
                    placeholder="Juan"
                    value={formData.nombre}
                    onChange={handleChange}
                    aria-invalid={!!errors.nombre}
                    aria-describedby={
                      errors.nombre ? "nombre-error" : undefined
                    }
                  />
                  {errors.nombre && (
                    <p className="form-hint" id="nombre-error" role="alert">
                      {errors.nombre}
                    </p>
                  )}
                </div>
                <div className="form-control half">
                  <label htmlFor="register-apellidos">Apellidos</label>
                  <input
                    type="text"
                    id="register-apellidos"
                    name="apellidos"
                    required
                    placeholder="Pérez González"
                    value={formData.apellidos}
                    onChange={handleChange}
                    aria-invalid={!!errors.apellidos}
                    aria-describedby={
                      errors.apellidos ? "apellidos-error" : undefined
                    }
                  />
                  {errors.apellidos && (
                    <p className="form-hint" id="apellidos-error" role="alert">
                      {errors.apellidos}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="register-email">Correo electrónico</label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  autoComplete="email"
                  required
                  maxLength="100"
                  placeholder="tucorreo@duoc.cl"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p className="form-hint" id="email-error" role="alert">
                    {errors.email}
                  </p>
                )}
                {showDuocDiscount && (
                  <div className="discount-notice">
                    🎓 ¡Descuento del 20% de por vida por ser de la comunidad
                    DUOC!
                  </div>
                )}
              </div>

              <div className="form-control">
                <label htmlFor="register-birthdate">Fecha de nacimiento</label>
                <input
                  type="date"
                  id="register-birthdate"
                  name="birthdate"
                  required
                  value={formData.birthdate}
                  onChange={handleChange}
                  aria-invalid={!!errors.birthdate}
                  aria-describedby={
                    errors.birthdate ? "birthdate-error" : undefined
                  }
                />
                {errors.birthdate && (
                  <p className="form-hint" id="birthdate-error" role="alert">
                    {errors.birthdate}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label htmlFor="register-password">Contraseña</label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  autoComplete="new-password"
                  required
                  minLength="6"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                {errors.password && (
                  <p className="form-hint" id="password-error" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label htmlFor="register-referral-code">
                  Código de referido (opcional)
                </label>
                <input
                  type="text"
                  id="register-referral-code"
                  name="referralCode"
                  placeholder="Ej: ABC123"
                  maxLength="10"
                  value={formData.referralCode}
                  onChange={handleChange}
                  onFocus={handleReferralCodeFocus}
                  onBlur={handleReferralCodeBlur}
                  aria-invalid={!!errors.referralCode}
                  aria-describedby={
                    errors.referralCode ? "referralCode-error" : undefined
                  }
                />
                {errors.referralCode && (
                  <p className="form-hint" id="referralCode-error" role="alert">
                    {errors.referralCode}
                  </p>
                )}
                {!errors.referralCode && referralCodeStatus.message && (
                  <p
                    className={`form-hint ${
                      referralCodeStatus.valid ? "success" : ""
                    }`}
                    role="status"
                  >
                    {referralCodeStatus.message}
                  </p>
                )}
                {referralCodeStatus.showFormat && (
                  <p
                    className="form-hint"
                    style={{ color: "#666", fontSize: "0.65rem" }}
                  >
                    Formato: 6-10 caracteres alfanuméricos (A-Z, 0-9)
                  </p>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  id="register-submit"
                >
                  Crear cuenta
                </button>
                <p className="alt-text">
                  ¿Ya tienes cuenta?{" "}
                  <a
                    href="#"
                    className="alt-link"
                    onClick={(e) => {
                      e.preventDefault();
                      switchToLogin();
                    }}
                  >
                    Ingresar
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
