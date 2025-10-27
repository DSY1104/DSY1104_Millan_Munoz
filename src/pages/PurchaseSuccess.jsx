import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "/src/styles/pages/purchase-success.css";

export default function PurchaseSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Get order data from navigation state
    if (location.state && location.state.orderData) {
      setOrderData(location.state.orderData);
    } else {
      // If no order data, redirect to home
      navigate("/");
    }
  }, [location, navigate]);

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (!orderData) {
    return null;
  }

  return (
    <div className="purchase-success-page">
      <main className="purchase-success-main">
        <div className="purchase-success-container">
          {/* Success Icon and Message */}
          <div className="success-header">
            <div className="success-icon">✓</div>
            <h1 className="success-title">¡Compra Exitosa!</h1>
            <p className="success-message">
              Tu pedido ha sido procesado correctamente
            </p>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="order-info-card">
              <h2>Resumen de tu Pedido</h2>

              {/* Order Number and Date */}
              <div className="order-details">
                <div className="order-detail-item">
                  <span className="detail-label">Número de Orden:</span>
                  <span className="detail-value">{orderData.orderNumber}</span>
                </div>
                <div className="order-detail-item">
                  <span className="detail-label">Fecha:</span>
                  <span className="detail-value">{orderData.orderDate}</span>
                </div>
                <div className="order-detail-item">
                  <span className="detail-label">Método de Pago:</span>
                  <span className="detail-value">
                    {orderData.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="shipping-details">
                <h3>Información de Envío</h3>
                <div className="shipping-info-grid">
                  <div className="shipping-info-item">
                    <span className="info-label">Nombre:</span>
                    <span className="info-value">
                      {orderData.shipping.fullName}
                    </span>
                  </div>
                  <div className="shipping-info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">
                      {orderData.shipping.email}
                    </span>
                  </div>
                  <div className="shipping-info-item">
                    <span className="info-label">Teléfono:</span>
                    <span className="info-value">
                      {orderData.shipping.phone}
                    </span>
                  </div>
                  <div className="shipping-info-item full-width">
                    <span className="info-label">Dirección:</span>
                    <span className="info-value">
                      {orderData.shipping.addressLine1}
                      {orderData.shipping.addressLine2 &&
                        `, ${orderData.shipping.addressLine2}`}
                    </span>
                  </div>
                  <div className="shipping-info-item">
                    <span className="info-label">Ciudad:</span>
                    <span className="info-value">
                      {orderData.shipping.city}
                    </span>
                  </div>
                  <div className="shipping-info-item">
                    <span className="info-label">Región:</span>
                    <span className="info-value">
                      {orderData.shipping.region}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Purchased */}
              <div className="items-section">
                <h3>Productos Comprados</h3>
                <div className="items-list">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-image">
                        <img src={item.image.replace('/src/assets/images/', '/assets/images/')} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-quantity">Cantidad: {item.qty}</p>
                      </div>
                      <div className="item-price">
                        ${(item.price * item.qty).toLocaleString("es-CL")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="price-summary">
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>
                    ${orderData.pricing.subtotal.toLocaleString("es-CL")}
                  </span>
                </div>
                {orderData.pricing.discount > 0 && (
                  <div className="price-row discount-row">
                    <span>Descuento cupón:</span>
                    <span>
                      -${orderData.pricing.discount.toLocaleString("es-CL")}
                    </span>
                  </div>
                )}
                {orderData.pricing.duocDiscount > 0 && (
                  <div className="price-row discount-row">
                    <span>🎓 Descuento DUOC (20%):</span>
                    <span>
                      -${orderData.pricing.duocDiscount.toLocaleString("es-CL")}
                    </span>
                  </div>
                )}
                <div className="price-row total-row">
                  <span>Total Pagado:</span>
                  <span>
                    ${orderData.pricing.total.toLocaleString("es-CL")}
                  </span>
                </div>
              </div>

              {/* Points Earned */}
              {orderData.pointsEarned > 0 && (
                <div className="points-earned">
                  <p>
                    🌟 Has ganado{" "}
                    <strong>{orderData.pointsEarned} puntos</strong> con esta
                    compra
                  </p>
                </div>
              )}

              {/* Delivery Estimate */}
              <div className="delivery-estimate">
                <p>
                  📦 Tu pedido llegará antes del{" "}
                  <strong>{orderData.deliveryDate}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="success-actions">
            <button
              className="btn btn-primary"
              onClick={handleContinueShopping}
            >
              Seguir Comprando
            </button>
            <button className="btn btn-secondary" onClick={handleGoHome}>
              Volver al Inicio
            </button>
          </div>

          {/* Additional Info */}
          <div className="success-footer">
            <p>
              Recibirás un correo de confirmación en{" "}
              <strong>{orderData.shipping.email}</strong>
            </p>
            <p className="footer-note">
              Puedes revisar el estado de tu pedido en tu perfil
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
