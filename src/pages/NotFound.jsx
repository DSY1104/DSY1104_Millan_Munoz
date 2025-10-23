import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import "/src/styles/pages/not-found.css";

export default function NotFound() {
  const navigate = useNavigate();
  const error = useRouteError();

  // Check if this is a routing error or a general error
  const isRouteError =
    error?.status === 404 || error?.statusText === "Not Found";
  const errorMessage =
    error?.statusText || error?.message || "Página no encontrada";

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          {/* Animated 404 */}
          <div className="error-code">
            <span className="four">4</span>
            <span className="zero">0</span>
            <span className="four">4</span>
          </div>

          {/* Error message */}
          <h1 className="error-title">
            {isRouteError ? "¡Oops! Página no encontrada" : "¡Algo salió mal!"}
          </h1>

          <p className="error-description">
            {isRouteError
              ? "La página que buscas no existe o ha sido movida."
              : errorMessage}
          </p>

          {/* Search suggestion */}
          <div className="error-suggestions">
            <p>Puedes intentar:</p>
            <ul>
              <li>Verificar la URL ingresada</li>
              <li>Volver a la página anterior</li>
              <li>Ir a la página principal</li>
              <li>Explorar nuestro catálogo de productos</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="error-actions">
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              🏠 Ir al Inicio
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              ← Volver Atrás
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/products")}
            >
              🛍️ Ver Productos
            </button>
          </div>

          {/* Decorative element */}
          <div className="error-decoration">
            <div className="floating-icon">🔍</div>
            <div className="floating-icon">📦</div>
            <div className="floating-icon">🎮</div>
          </div>
        </div>
      </div>
    </div>
  );
}
