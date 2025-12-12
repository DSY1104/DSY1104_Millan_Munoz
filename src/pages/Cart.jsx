import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../hooks/useUser";
import couponsData from "../assets/data/coupons.json";
import { saveCurrentUser } from "../services/userService";
import { initiateCheckout } from "../services/cartService";
import "/src/styles/pages/cart.css";

export default function Cart() {
   const navigate = useNavigate();
   const { items, carritoId, updateQuantity, removeFromCart, clearCart, getTotals, applyCoupon, removeCoupon } =
      useCart();
   const { authUser, isAuthenticated } = useAuth(); // Only auth data (JWT, loginTime)
   const { user, loading } = useUser(); // Full user profile data

   // Debug logging
   useEffect(() => {
      console.log("[Cart] Auth state:", { authUser, isAuthenticated });
      console.log("[Cart] User data:", { user, loading });
   }, [authUser, isAuthenticated, user, loading]);

   const [step, setStep] = useState(1); // 1 = cart items, 2 = checkout form
   const [showCouponModal, setShowCouponModal] = useState(false);
   const [shippingText, setShippingText] = useState("");
   const [deliveryText, setDeliveryText] = useState("");
   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
   const [couponCode, setCouponCode] = useState("");
   const [couponError, setCouponError] = useState("");
   const [processingPayment, setProcessingPayment] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
   } = useForm();

   const totals = getTotals();

   // Calculate DUOC discount if user is authenticated and has lifetime discount
   const duocDiscount = isAuthenticated && authUser?.hasLifetimeDiscount ? Math.round(totals.subtotal * 0.2) : 0;

   const finalTotal = totals.total - duocDiscount;

   // Load shipping info and delivery date
   useEffect(() => {
      // Get user profile for shipping address from UserContext
      if (user) {
         console.log(user.address);
         const region = user.address?.region || "-";
         const city = user.address?.city || "-";
         let address = user.address?.addressLine1 || "-";
         if (user.address?.addressLine2) address += ", " + user.address?.addressLine2;
         setShippingText(`Enviar a: ${address}, ${city}, ${region}`);

         // Pre-fill form with user profile data when in checkout step
         if (step === 2) {
            setValue("fullName", `${user.personal.firstName} ${user.personal.lastName}` || "");
            setValue("email", user.email || "");
            setValue("phone", user.personal.phone || "");
            setValue("rut", user.rut || "");
            setValue("addressLine1", user.address?.addressLine1 || "");
            setValue("addressLine2", user.address?.addressLine2 || "");
            setValue("city", user.address?.city || "");
            setValue("region", user.address?.region || "");
            setValue("postalCode", user.address?.postalCode || "");
         }
      } else {
         // If no user, set default shipping text
         setShippingText("");
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
      const entrega = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 7);
      const fechaEntrega = `${entrega.getDate()} de ${meses[entrega.getMonth()]}`;
      setDeliveryText(`Si compras hoy, recibes antes del ${fechaEntrega}`);
   }, [user, step, setValue]);

   const handleCheckout = () => {
      if (items.length === 0) {
         alert("Tu carrito está vacío");
         return;
      }

      if (!isAuthenticated || !user) {
         alert("Debes iniciar sesión para realizar la compra");
         return;
      }

      // Move to step 2 (checkout form)
      setStep(2);
   };

   const handlePayment = async (data) => {
      if (!selectedPaymentMethod) {
         alert("Por favor selecciona un método de pago");
         return;
      }

      if (!isAuthenticated || !user || !carritoId) {
         alert("Error: No se pudo procesar el carrito. Por favor intenta nuevamente.");
         return;
      }

      if (items.length === 0) {
         alert("Tu carrito está vacío");
         return;
      }

      try {
         setProcessingPayment(true);

         // Get the return URL for Transbank callback
         const returnUrl = `${window.location.origin}/payment-confirm`;

         // Initiate checkout with Carrito Service
         const checkoutResponse = await initiateCheckout({
            carritoId: carritoId,
            returnUrl: returnUrl,
            notasCliente: data.notes || "", // Optional customer notes
         });

         console.log("Checkout initiated:", checkoutResponse);

         // Store checkout data in sessionStorage for payment confirmation
         sessionStorage.setItem(
            "pendingCheckout",
            JSON.stringify({
               numeroOrden: checkoutResponse.numeroOrden,
               pedidoId: checkoutResponse.pedidoId,
               montoTotal: checkoutResponse.montoTotal,
               shippingData: data,
               pointsEarned: Math.floor(totals.subtotal / 1000),
            })
         );

         // Redirect to Transbank payment page
         // Create a form and submit it to Transbank
         const form = document.createElement("form");
         form.method = "POST";
         form.action = checkoutResponse.transbankUrl;

         const tokenInput = document.createElement("input");
         tokenInput.type = "hidden";
         tokenInput.name = "token_ws";
         tokenInput.value = checkoutResponse.transbankToken;
         form.appendChild(tokenInput);

         document.body.appendChild(form);
         form.submit();
      } catch (error) {
         console.error("Error processing checkout:", error);
         setProcessingPayment(false);

         const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Error al procesar el pago. Por favor intenta nuevamente.";

         alert(errorMessage);
      }
   };

   const handleBackToCart = () => {
      setStep(1);
   };

   const handleContinueShopping = () => {
      navigate("/products");
   };

   const handleApplyCoupon = () => {
      setCouponError("");

      if (!couponCode.trim()) {
         setCouponError("Por favor ingresa un código de cupón");
         return;
      }

      let coupon = null;
      let isUserCoupon = false;

      // First, check general coupons
      coupon = couponsData.find((c) => c.code.toLowerCase() === couponCode.trim().toLowerCase() && !c.isUsed);

      // If not found in general coupons, check user coupons
      if (!coupon && user?.coupons) {
         coupon = user.coupons.find((c) => c.code.toLowerCase() === couponCode.trim().toLowerCase() && !c.isUsed);
         isUserCoupon = !!coupon;
      }

      if (!coupon) {
         setCouponError("Código de cupón inválido o ya usado");
         return;
      }

      // Check if coupon is expired
      const expirationDate = new Date(coupon.expiresAt);
      const today = new Date();
      if (expirationDate < today) {
         setCouponError("Este cupón ha expirado");
         return;
      }

      // Check minimum purchase requirement
      if (totals.subtotal < coupon.minPurchase) {
         setCouponError(`Este cupón requiere una compra mínima de $${coupon.minPurchase.toLocaleString("es-CL")}`);
         return;
      }

      // If it's a user coupon, mark it as used in localStorage
      if (isUserCoupon && user) {
         const updatedUser = {
            ...user,
            coupons: user.coupons.map((c) => (c.code === coupon.code ? { ...c, isUsed: true } : c)),
         };
         saveCurrentUser(updatedUser);
         // Dispatch event to update UserContext
         document.dispatchEvent(
            new CustomEvent("userLoggedIn", {
               detail: updatedUser,
            })
         );
      }

      // Apply coupon
      applyCoupon(coupon);
      setCouponCode("");
      setCouponError("");
   };

   const handleRemoveCoupon = () => {
      removeCoupon();
      setCouponCode("");
      setCouponError("");
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
                        : `Tienes ${totals.count} ${totals.count === 1 ? "producto" : "productos"} en tu carrito`}
                  </p>
               </section>

               {/* Cart Content */}
               <div className={`cart-content ${step === 1 && items.length === 0 ? "empty" : ""}`}>
                  {/* Empty Cart State */}
                  {step === 1 && items.length === 0 ? (
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
                        {/* Cart Items or Checkout Form */}
                        <section className="cart-items-section">
                           {step === 1 ? (
                              // Step 1: Cart Items
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
                                    <button className="btn btn-secondary" onClick={handleContinueShopping}>
                                       Seguir Comprando
                                    </button>
                                    <button
                                       className="btn btn-danger empty-cart-btn"
                                       onClick={() => {
                                          if (window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
                                             clearCart();
                                          }
                                       }}
                                    >
                                       Vaciar carrito
                                    </button>
                                 </div>
                              </>
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
                        <aside className="cart-summary">
                           <div className="summary-card">
                              <h3>Resumen del Pedido</h3>

                              <div className="shipping-info">
                                 <div className="shipping-address">{shippingText}</div>
                                 <div className="delivery-estimate" style={{ color: "#000", fontSize: "0.85rem" }}>
                                    {deliveryText}
                                 </div>
                              </div>

                              {/* Coupon Section */}
                              {step === 1 && (
                                 <div className="coupon-section">
                                    <h4 className="coupon-title">¿Tienes un cupón?</h4>
                                    {totals.appliedCoupon ? (
                                       <div className="applied-coupon">
                                          <div className="coupon-info">
                                             <div className="coupon-code-badge">🎟️ {totals.appliedCoupon.code}</div>
                                             <p className="coupon-description">{totals.appliedCoupon.description}</p>
                                          </div>
                                          <button
                                             className="btn-remove-coupon"
                                             onClick={handleRemoveCoupon}
                                             title="Eliminar cupón"
                                          >
                                             ✕
                                          </button>
                                       </div>
                                    ) : (
                                       <div className="coupon-input-group">
                                          <input
                                             type="text"
                                             className="coupon-input"
                                             placeholder="Ingresa tu código"
                                             value={couponCode}
                                             onChange={(e) => {
                                                setCouponCode(e.target.value.toUpperCase());
                                                setCouponError("");
                                             }}
                                             onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                   handleApplyCoupon();
                                                }
                                             }}
                                          />
                                          <button className="btn-apply-coupon" onClick={handleApplyCoupon}>
                                             Aplicar
                                          </button>
                                       </div>
                                    )}
                                    {couponError && <p className="coupon-error">{couponError}</p>}
                                 </div>
                              )}

                              <div className="summary-line">
                                 <span>
                                    Subtotal ({totals.count} {totals.count === 1 ? "producto" : "productos"})
                                 </span>
                                 <span>${totals.subtotal.toLocaleString("es-CL")}</span>
                              </div>

                              {/* Coupon discount */}
                              {totals.discount > 0 && (
                                 <div className="summary-line discount-line">
                                    <span>Descuento cupón</span>
                                    <span className="discount-amount">-${totals.discount.toLocaleString("es-CL")}</span>
                                 </div>
                              )}

                              {/* DUOC Lifetime Discount */}
                              {duocDiscount > 0 && (
                                 <div className="summary-line discount-line">
                                    <span>🎓 Descuento DUOC (20%)</span>
                                    <span className="discount-amount">-${duocDiscount.toLocaleString("es-CL")}</span>
                                 </div>
                              )}

                              <div className="summary-line total-line">
                                 <span>Total</span>
                                 <span className="total-amount">${finalTotal.toLocaleString("es-CL")}</span>
                              </div>

                              <div className="points-info">
                                 <p>
                                    🌟 Ganarás <strong>{pointsEarned} puntos</strong> con esta compra
                                 </p>
                                 {duocDiscount > 0 && (
                                    <p style={{ color: "#10b981", marginTop: "0.5rem" }}>
                                       🎓 Ahorraste ${duocDiscount.toLocaleString("es-CL")} con tu descuento DUOC
                                    </p>
                                 )}
                                 {isAuthenticated && !authUser?.hasLifetimeDiscount && (
                                    <p
                                       style={{
                                          color: "#6b7280",
                                          fontSize: "0.875rem",
                                          marginTop: "0.5rem",
                                       }}
                                    >
                                       💡 ¿Eres de DUOC? Registra tu correo @duoc.cl o @profesor.duoc.cl para obtener
                                       20% de descuento de por vida
                                    </p>
                                 )}
                              </div>

                              <button
                                 className="btn btn-primary checkout-btn"
                                 onClick={step === 1 ? handleCheckout : handleSubmit(handlePayment)}
                              >
                                 {step === 1 ? "Proceder al Pago" : "Realizar Pago"}
                              </button>
                           </div>
                        </aside>
                     </>
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

      const stock = item.stock || Infinity;
      if (qty > stock) {
         alert(`No hay suficiente stock. Disponible: ${stock} unidades`);
         return;
      }

      onUpdateQuantity(item.id, qty);
   };

   const itemTotal = item.price * item.qty;
   const stock = item.stock || Infinity;
   const isAtMaxStock = item.qty >= stock;

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
            {item.metadata?.marca && <p className="cart-item-brand">{item.metadata.marca}</p>}
            <p className="cart-item-price">${item.price.toLocaleString("es-CL")} c/u</p>
            {stock !== Infinity && (
               <p className="cart-item-stock">
                  Stock disponible: <strong>{stock}</strong>
               </p>
            )}
         </div>

         <div className="cart-item-quantity">
            <label htmlFor={`qty-${item.id}`}>Cantidad:</label>
            <div className="quantity-controls">
               <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(item.qty - 1)}
                  aria-label="Disminuir cantidad"
                  disabled={item.qty <= 1}
               >
                  -
               </button>
               <input
                  id={`qty-${item.id}`}
                  type="number"
                  min="1"
                  max={stock}
                  value={item.qty}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="qty-input"
               />
               <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(item.qty + 1)}
                  aria-label="Aumentar cantidad"
                  disabled={isAtMaxStock}
                  title={isAtMaxStock ? `Stock máximo: ${stock}` : ""}
               >
                  +
               </button>
            </div>
            {isAtMaxStock && stock !== Infinity && <p className="stock-warning">Stock máximo alcanzado</p>}
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
function CheckoutForm({ register, errors, selectedPaymentMethod, setSelectedPaymentMethod, onBack }) {
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
                     {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
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
                     {errors.rut && <span className="error-message">{errors.rut.message}</span>}
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
                     {errors.email && <span className="error-message">{errors.email.message}</span>}
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
                              value: /^(\+?56)?[\s]?(0?9)[\s]?\d{4}[\s]?\d{4}$/,
                              message: "Teléfono inválido (formato chileno)",
                           },
                        })}
                     />
                     {errors.phone && <span className="error-message">{errors.phone.message}</span>}
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
                  {errors.addressLine1 && <span className="error-message">{errors.addressLine1.message}</span>}
               </div>

               <div className="form-group">
                  <label htmlFor="addressLine2">Depto, Oficina, etc. (Opcional)</label>
                  <input id="addressLine2" type="text" placeholder="Depto 401" {...register("addressLine2")} />
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
                     {errors.city && <span className="error-message">{errors.city.message}</span>}
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
                        <option value="Región Metropolitana">Región Metropolitana</option>
                        <option value="Región de Valparaíso">Región de Valparaíso</option>
                        <option value="Región del Biobío">Región del Biobío</option>
                        <option value="Región de La Araucanía">Región de La Araucanía</option>
                        <option value="Región de Los Lagos">Región de Los Lagos</option>
                        <option value="Región de Antofagasta">Región de Antofagasta</option>
                        <option value="Región de Coquimbo">Región de Coquimbo</option>
                        <option value="Región de O'Higgins">Región de O'Higgins</option>
                        <option value="Región del Maule">Región del Maule</option>
                        <option value="Región de Ñuble">Región de Ñuble</option>
                        <option value="Región de Los Ríos">Región de Los Ríos</option>
                        <option value="Región de Aysén">Región de Aysén</option>
                        <option value="Región de Magallanes">Región de Magallanes</option>
                        <option value="Región de Arica y Parinacota">Región de Arica y Parinacota</option>
                        <option value="Región de Tarapacá">Región de Tarapacá</option>
                        <option value="Región de Atacama">Región de Atacama</option>
                     </select>
                     {errors.region && <span className="error-message">{errors.region.message}</span>}
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
                     {errors.postalCode && <span className="error-message">{errors.postalCode.message}</span>}
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
                        className={`payment-method ${selectedPaymentMethod === method.id ? "selected" : ""}`}
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
               {!selectedPaymentMethod && <p className="payment-hint">Por favor selecciona un método de pago</p>}
            </div>

            {/* Customer Notes (Optional) */}
            <div className="form-section">
               <h3 className="form-section-title">Notas de Entrega (Opcional)</h3>
               <div className="form-group">
                  <label htmlFor="notes">Instrucciones especiales o comentarios</label>
                  <textarea
                     id="notes"
                     rows="3"
                     placeholder="Ej: Tocar el timbre, dejar en conserjería, etc."
                     {...register("notes")}
                  />
               </div>
            </div>
         </form>
      </div>
   );
}
