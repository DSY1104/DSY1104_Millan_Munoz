import React from "react";
import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";
import "/src/styles/pages/error-boundary.css";

export default function ErrorBoundary() {
  const navigate = useNavigate();
  const error = useRouteError();

  console.error("Error caught by boundary:", error);

  // Determine error type
  let errorTitle = "¡Algo salió mal!";
  let errorMessage = "Ha ocurrido un error inesperado.";
  let errorDetails = null;

  if (isRouteErrorResponse(error)) {
    // Router error (404, etc.)
    if (error.status === 404) {
      errorTitle = "404 - Página no encontrada";
      errorMessage = "La página que buscas no existe o ha sido movida.";
    } else if (error.status === 401) {
      errorTitle = "401 - No autorizado";
      errorMessage = "No tienes permiso para acceder a esta página.";
    } else if (error.status === 503) {
      errorTitle = "503 - Servicio no disponible";
      errorMessage = "El servicio está temporalmente fuera de servicio.";
    } else {
      errorTitle = `${error.status} - ${error.statusText}`;
      errorMessage = error.data?.message || error.statusText;
    }
  } else if (error instanceof Error) {
    // JavaScript error
    errorTitle = "Error de aplicación";
    errorMessage = error.message;
    errorDetails = error.stack;
  }

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="error-boundary-page">
      <div className="error-boundary-container">
        <div className="error-boundary-content">
          {/* Error Icon */}
          <div className="error-icon">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M12 8V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </div>

          {/* Error Title */}
          <h1 className="error-boundary-title">{errorTitle}</h1>

          {/* Error Message */}
          <p className="error-boundary-message">{errorMessage}</p>

          {/* Error Details (in development) */}
          {import.meta.env.DEV && errorDetails && (
            <details className="error-details">
              <summary>Detalles técnicos (solo en desarrollo)</summary>
              <pre className="error-stack">{errorDetails}</pre>
            </details>
          )}

          {/* Helpful Info */}
          <div className="error-info">
            <p className="error-info-title">¿Qué puedes hacer?</p>
            <ul className="error-info-list">
              <li>Recargar la página</li>
              <li>Volver a la página anterior</li>
              <li>Ir a la página principal</li>
              <li>Contactar soporte si el problema persiste</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="error-boundary-actions">
            <button className="btn btn-primary" onClick={handleReload}>
              🔄 Recargar Página
            </button>
            <button className="btn btn-secondary" onClick={handleGoHome}>
              🏠 Ir al Inicio
            </button>
            <button className="btn btn-secondary" onClick={handleGoBack}>
              ← Volver Atrás
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/support")}
            >
              💬 Contactar Soporte
            </button>
          </div>

          {/* Additional Help */}
          <div className="error-help">
            <p>
              Si el problema continúa, por favor contacta a nuestro equipo de
              soporte con el código de error y la hora en que ocurrió.
            </p>
            <p className="error-timestamp">
              Hora: {new Date().toLocaleString("es-CL")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
