import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCart } from "../context/CartContext";
import "/src/styles/pages/cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart, getTotals } =
    useCart();

  const [step, setStep] = useState(1); // 1 = cart items, 2 = checkout form
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [shippingText, setShippingText] = useState("");
  const [deliveryText, setDeliveryText] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const totals = getTotals();

  // Load shipping info and delivery date
  useEffect(() => {
    // Get user profile for shipping address
    const profile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const region = profile.region || "-";
    const city = profile.city || "-";
    let address = profile.addressLine1 || "-";
    if (profile.addressLine2) address += ", " + profile.addressLine2;
    setShippingText(`Enviar a: ${address}, ${city}, ${region}`);

    // Pre-fill form with user profile data if available
    if (step === 2 && profile) {
      setValue("fullName", profile.name || "");
      setValue("email", profile.email || "");
      setValue("phone", profile.phone || "");
      setValue("rut", profile.rut || "");
      setValue("addressLine1", profile.addressLine1 || "");
      setValue("addressLine2", profile.addressLine2 || "");
      setValue("city", profile.city || "");
      setValue("region", profile.region || "");
      setValue("postalCode", profile.postalCode || "");
    }

    // Calculate estimated delivery date (today + 7 days)
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    const hoy = new Date();
    const entrega = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 7
    );
    const fechaEntrega = `${entrega.getDate()} de ${meses[entrega.getMonth()]}`;
    setDeliveryText(`Si compras hoy, recibes antes del ${fechaEntrega}`);
  }, [step, setValue]);

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    // Move to step 2 (checkout form)
    setStep(2);
  };

  const handlePayment = (data) => {
    if (!selectedPaymentMethod) {
      alert("Por favor selecciona un método de pago");
      return;
    }

    // TODO: Process payment
    console.log("Payment data:", {
      ...data,
      paymentMethod: selectedPaymentMethod,
    });
    alert(
      `Pago procesado exitosamente con ${selectedPaymentMethod}\n\nDatos de envío:\n${
        data.fullName
      }\n${data.addressLine1}, ${
        data.city
      }\n\nTotal: $${totals.total.toLocaleString("es-CL")}`
    );

    // Clear cart after successful payment
    clearCart();
    setStep(1);
    navigate("/");
  };

  const handleBackToCart = () => {
    setStep(1);
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  // Calculate points (1 point per $1000 CLP spent)
  const pointsEarned = Math.floor(totals.subtotal / 1000);

  return (
    <div>
      <main className="cart-main">
        <div className="cart-container">
          {/* Cart Header */}
          <section className="cart-header">
            <h1>Carrito de Compras</h1>
            <p className="cart-subtitle">
              {items.length === 0
                ? "Tu carrito está vacío"
                : `Tienes ${totals.count} ${
                    totals.count === 1 ? "producto" : "productos"
                  } en tu carrito`}
            </p>
          </section>

          {/* Cart Content */}
          <div className="cart-content">
            {/* Cart Items or Checkout Form */}
            <section className="cart-items-section">
              {step === 1 ? (
                // Step 1: Cart Items
                items.length === 0 ? (
                  <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Tu carrito está vacío</h2>
                    <p>¡Agrega productos para comenzar tu compra!</p>
                    <button
                      className="btn btn-primary"
                      onClick={handleContinueShopping}
                      style={{ marginTop: "1.5rem" }}
                    >
                      Ver Productos
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="cart-items">
                      {items.map((item) => (
                        <CartItem
                          key={item.id}
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeFromCart}
                        />
                      ))}
                    </div>
                    <div className="cart-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={handleContinueShopping}
                      >
                        Seguir Comprando
                      </button>
                      <button
                        className="btn btn-danger empty-cart-btn"
                        onClick={() => {
                          if (
                            window.confirm(
                              "¿Estás seguro de que quieres vaciar el carrito?"
                            )
                          ) {
                            clearCart();
                          }
                        }}
                      >
                        Vaciar carrito
                      </button>
                    </div>
                  </>
                )
              ) : (
                // Step 2: Checkout Form
                <CheckoutForm
                  register={register}
                  errors={errors}
                  selectedPaymentMethod={selectedPaymentMethod}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                  onBack={handleBackToCart}
                />
              )}
            </section>

            {/* Cart Summary */}
            {items.length > 0 && (
              <aside className="cart-summary">
                <div className="summary-card">
                  <h3>Resumen del Pedido</h3>

                  <div className="shipping-info">
                    <div className="shipping-address">{shippingText}</div>
                    <div className="delivery-estimate">{deliveryText}</div>
                  </div>

                  <div className="summary-line">
                    <span>
                      Subtotal ({totals.count}{" "}
                      {totals.count === 1 ? "producto" : "productos"})
                    </span>
                    <span>${totals.subtotal.toLocaleString("es-CL")}</span>
                  </div>

                  {/* Coupon Section - TODO: Implement later */}
                  {totals.discount > 0 && (
                    <div className="summary-line discount-line">
                      <span>Descuento</span>
                      <span className="discount-amount">
                        -${totals.discount.toLocaleString("es-CL")}
                      </span>
                    </div>
                  )}

                  <div className="summary-line total-line">
                    <span>Total</span>
                    <span className="total-amount">
                      ${totals.total.toLocaleString("es-CL")}
                    </span>
                  </div>

                  <div className="points-info">
                    <p>
                      🌟 Ganarás <strong>{pointsEarned} puntos</strong> con esta
                      compra
                    </p>
                  </div>

                  <button
                    className="btn btn-primary checkout-btn"
                    onClick={
                      step === 1 ? handleCheckout : handleSubmit(handlePayment)
                    }
                  >
                    {step === 1 ? "Proceder al Pago" : "Realizar Pago"}
                  </button>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Cart Item Component
function CartItem({ item, onUpdateQuantity, onRemove }) {
  const handleQuantityChange = (newQty) => {
    const qty = parseInt(newQty);
    if (isNaN(qty) || qty < 1) return;
    onUpdateQuantity(item.id, qty);
  };

  const itemTotal = item.price * item.qty;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img
          src={item.image}
          alt={item.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/image/products/fallback.png";
          }}
        />
      </div>

      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        {item.metadata?.marca && (
          <p className="cart-item-brand">{item.metadata.marca}</p>
        )}
        <p className="cart-item-price">
          ${item.price.toLocaleString("es-CL")} c/u
        </p>
      </div>

      <div className="cart-item-quantity">
        <label htmlFor={`qty-${item.id}`}>Cantidad:</label>
        <div className="quantity-controls">
          <button
            className="qty-btn"
            onClick={() => handleQuantityChange(item.qty - 1)}
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <input
            id={`qty-${item.id}`}
            type="number"
            min="1"
            value={item.qty}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="qty-input"
          />
          <button
            className="qty-btn"
            onClick={() => handleQuantityChange(item.qty + 1)}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-item-total">
        <p className="item-total-label">Total:</p>
        <p className="item-total-price">${itemTotal.toLocaleString("es-CL")}</p>
      </div>

      <button
        className="cart-item-remove"
        onClick={() => {
          if (window.confirm(`¿Eliminar ${item.name} del carrito?`)) {
            onRemove(item.id);
          }
        }}
        aria-label={`Eliminar ${item.name}`}
      >
        ×
      </button>
    </div>
  );
}

// Checkout Form Component
function CheckoutForm({
  register,
  errors,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  onBack,
}) {
  const paymentMethods = [
    { id: "credit-card", name: "Tarjeta de Crédito", icon: "💳" },
    { id: "debit-card", name: "Tarjeta de Débito", icon: "💳" },
    { id: "transfer", name: "Transferencia Bancaria", icon: "🏦" },
    { id: "paypal", name: "PayPal", icon: "🅿️" },
  ];

  return (
    <div className="checkout-form-container">
      <button className="btn btn-secondary back-btn" onClick={onBack}>
        ← Volver al Carrito
      </button>

      <h2 className="checkout-title">Información de Envío</h2>

      <form className="checkout-form">
        {/* Personal Information */}
        <div className="form-section">
          <h3 className="form-section-title">Datos Personales</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">
                Nombre Completo <span className="required">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                className={errors.fullName ? "error" : ""}
                {...register("fullName", {
                  required: "El nombre completo es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres",
                  },
                })}
              />
              {errors.fullName && (
                <span className="error-message">{errors.fullName.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="rut">
                RUT <span className="required">*</span>
              </label>
              <input
                id="rut"
                type="text"
                placeholder="12.345.678-9"
                className={errors.rut ? "error" : ""}
                {...register("rut", {
                  required: "El RUT es obligatorio",
                  pattern: {
                    value: /^[0-9]+-[0-9kK]{1}$/,
                    message: "Formato de RUT inválido (ej: 12345678-9)",
                  },
                })}
              />
              {errors.rut && (
                <span className="error-message">{errors.rut.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                className={errors.email ? "error" : ""}
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                Teléfono <span className="required">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+56 9 1234 5678"
                className={errors.phone ? "error" : ""}
                {...register("phone", {
                  required: "El teléfono es obligatorio",
                  pattern: {
                    value: /^(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}$/,
                    message: "Teléfono inválido (formato chileno)",
                  },
                })}
              />
              {errors.phone && (
                <span className="error-message">{errors.phone.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="form-section">
          <h3 className="form-section-title">Dirección de Envío</h3>

          <div className="form-group">
            <label htmlFor="addressLine1">
              Dirección (Calle y Número) <span className="required">*</span>
            </label>
            <input
              id="addressLine1"
              type="text"
              placeholder="Av. Libertador Bernardo O'Higgins 1234"
              className={errors.addressLine1 ? "error" : ""}
              {...register("addressLine1", {
                required: "La dirección es obligatoria",
                minLength: {
                  value: 5,
                  message: "La dirección debe tener al menos 5 caracteres",
                },
              })}
            />
            {errors.addressLine1 && (
              <span className="error-message">
                {errors.addressLine1.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="addressLine2">
              Depto, Oficina, etc. (Opcional)
            </label>
            <input
              id="addressLine2"
              type="text"
              placeholder="Depto 401"
              {...register("addressLine2")}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">
                Ciudad/Comuna <span className="required">*</span>
              </label>
              <input
                id="city"
                type="text"
                placeholder="Santiago"
                className={errors.city ? "error" : ""}
                {...register("city", {
                  required: "La ciudad es obligatoria",
                })}
              />
              {errors.city && (
                <span className="error-message">{errors.city.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="region">
                Región <span className="required">*</span>
              </label>
              <select
                id="region"
                className={errors.region ? "error" : ""}
                {...register("region", {
                  required: "La región es obligatoria",
                })}
              >
                <option value="">Selecciona una región</option>
                <option value="Región Metropolitana">
                  Región Metropolitana
                </option>
                <option value="Región de Valparaíso">
                  Región de Valparaíso
                </option>
                <option value="Región del Biobío">Región del Biobío</option>
                <option value="Región de La Araucanía">
                  Región de La Araucanía
                </option>
                <option value="Región de Los Lagos">Región de Los Lagos</option>
                <option value="Región de Antofagasta">
                  Región de Antofagasta
                </option>
                <option value="Región de Coquimbo">Región de Coquimbo</option>
                <option value="Región de O'Higgins">Región de O'Higgins</option>
                <option value="Región del Maule">Región del Maule</option>
                <option value="Región de Ñuble">Región de Ñuble</option>
                <option value="Región de Los Ríos">Región de Los Ríos</option>
                <option value="Región de Aysén">Región de Aysén</option>
                <option value="Región de Magallanes">
                  Región de Magallanes
                </option>
                <option value="Región de Arica y Parinacota">
                  Región de Arica y Parinacota
                </option>
                <option value="Región de Tarapacá">Región de Tarapacá</option>
                <option value="Región de Atacama">Región de Atacama</option>
              </select>
              {errors.region && (
                <span className="error-message">{errors.region.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Código Postal</label>
              <input
                id="postalCode"
                type="text"
                placeholder="8320000"
                {...register("postalCode", {
                  pattern: {
                    value: /^[0-9]{7}$/,
                    message: "Código postal inválido (7 dígitos)",
                  },
                })}
              />
              {errors.postalCode && (
                <span className="error-message">
                  {errors.postalCode.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="form-section">
          <h3 className="form-section-title">Método de Pago</h3>

          <div className="payment-methods">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`payment-method ${
                  selectedPaymentMethod === method.id ? "selected" : ""
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <span className="payment-icon">{method.icon}</span>
                <span className="payment-name">{method.name}</span>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={() => setSelectedPaymentMethod(method.id)}
                />
              </div>
            ))}
          </div>
          {!selectedPaymentMethod && (
            <p className="payment-hint">
              Por favor selecciona un método de pago
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
