import React, { useState, useEffect } from "react";
import "/src/styles/pages/cart.css";

export default function Cart() {
  // Simulación de datos del carrito y usuario
  const [cartItems, setCartItems] = useState([]); // [{id, name, price, ...}]
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [points, setPoints] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [shippingText, setShippingText] = useState("");
  const [deliveryText, setDeliveryText] = useState("");

  // Simula datos de usuario y calcula textos de envío
  useEffect(() => {
    // Simulación de profile
    const profile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const region = profile.region || "-";
    const city = profile.city || "-";
    let address = profile.addressLine1 || "-";
    if (profile.addressLine2) address += ", " + profile.addressLine2;
    setShippingText(`Enviar a: ${address}, ${city}, ${region}`);

    // Fecha estimada de entrega (hoy + 7 días)
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    const hoy = new Date();
    const entrega = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 7);
    const fechaEntrega = `${entrega.getDate()} de ${meses[entrega.getMonth()]}`;
    setDeliveryText(`Si compras hoy, recibes antes del ${fechaEntrega}`);
  }, []);

  // Simula cálculo de totales y puntos
  useEffect(() => {
    const sub = cartItems.reduce((acc, item) => acc + item.price, 0);
    setSubtotal(sub);
    setTotal(sub - discount);
    setPoints(Math.floor(sub / 1000)); // Ejemplo: 1 punto por cada $1000
  }, [cartItems, discount]);

  // Handlers
  const handleEmptyCart = () => setCartItems([]);
  const handleCheckout = () => alert("Proceder al pago");
  const handleSelectCoupon = () => setShowCouponModal(true);
  const handleRemoveCoupon = () => {
    setCoupon(null);
    setDiscount(0);
  };
  const handleApplyCoupon = (c) => {
    setCoupon(c);
    setDiscount(c.discount || 0);
    setShowCouponModal(false);
  };

  return (
    <div>
      <main className="cart-main">
        <div className="cart-container">
          {/* Cart Header */}
          <section className="cart-header">
            <h1>Carrito de Compras</h1>
            <p className="cart-subtitle">Revisa tus productos antes de finalizar la compra</p>
          </section>

          {/* Cart Content */}
          <div className="cart-content">
            {/* Cart Items */}
            <section className="cart-items-section">
              <div className="cart-items">
                {cartItems.length === 0 ? (
                  <p>Tu carrito está vacío.</p>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      {/* Aquí puedes usar tu componente ProductCard si lo deseas */}
                      <span>{item.name}</span> <span>${item.price}</span>
                    </div>
                  ))
                )}
              </div>
              <button className="btn btn-danger empty-cart-btn" onClick={handleEmptyCart} style={{margin: "1.5em auto 0 auto", display: "block", minWidth: 180}}>
                Vaciar carrito
              </button>
            </section>

            {/* Cart Summary */}
            <aside className="cart-summary">
              <div className="summary-card">
                <h3>Resumen del Pedido</h3>
                <div style={{margin: "0 0 0.5em 0", fontSize: "1.08em", fontWeight: 500, color: "var(--color-on-surface)", textAlign: "left"}}>{shippingText}</div>
                <div style={{marginBottom: "1.2em", fontSize: "0.98em", color: "var(--color-on-surface)", opacity: 0.8, textAlign: "left"}}>{deliveryText}</div>
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                {/* Coupon Section */}
                <div className="coupon-section">
                  <div className="coupon-header">
                    <h4>Cupones</h4>
                    <button className="btn btn-link" onClick={handleSelectCoupon}>
                      Seleccionar Cupón
                    </button>
                  </div>
                  {coupon && (
                    <div className="applied-coupon">
                      <div className="coupon-info">
                        <span className="coupon-icon">🎫</span>
                        <div className="coupon-details">
                          <span className="coupon-name">{coupon.name}</span>
                          <span className="coupon-discount">-${coupon.discount}</span>
                        </div>
                        <button className="btn btn-link remove-coupon" onClick={handleRemoveCoupon}>×</button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Discount Line */}
                {discount > 0 && (
                  <div className="summary-line discount-line">
                    <span>Descuento</span>
                    <span className="discount-amount">-${discount}</span>
                  </div>
                )}
                <div className="summary-line total-line">
                  <span>Total</span>
                  <span className="total-amount">${total}</span>
                </div>
                <div className="points-info">
                  <p>🌟 Ganarás <strong>{points} puntos</strong> con esta compra</p>
                </div>
                <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
                  Proceder al Pago
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      {/* Coupon Selection Modal */}
      {showCouponModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Seleccionar Cupón</h3>
              <button className="modal-close" onClick={() => setShowCouponModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="available-coupons">
                {/* Aquí puedes renderizar los cupones disponibles */}
                <button className="btn btn-secondary" onClick={() => handleApplyCoupon({name: "Cupón Ejemplo", discount: 1000})}>
                  Aplicar Cupón Ejemplo
                </button>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowCouponModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
