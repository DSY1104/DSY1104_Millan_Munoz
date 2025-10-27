import React from "react";
import PropTypes from "prop-types";

/**
 * CartSummary Component
 * Displays order summary with subtotal, discount, shipping, and total
 */
export default function CartSummary({
  subtotal = 0,
  discount = 0,
  shipping = 0,
  couponDiscount = 0,
  duocDiscount = 0,
  onCheckout,
  onApplyCoupon,
  showCouponInput = false,
}) {
  const total = Math.max(
    0,
    subtotal - discount - couponDiscount - duocDiscount + shipping
  );

  const [couponCode, setCouponCode] = React.useState("");
  const [couponError, setCouponError] = React.useState("");

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Por favor ingresa un código de cupón");
      return;
    }

    if (onApplyCoupon) {
      const result = onApplyCoupon(couponCode);
      if (result === false) {
        setCouponError("Cupón inválido o ya usado");
      } else {
        setCouponError("");
        setCouponCode("");
      }
    }
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <div className="cart-summary" data-testid="cart-summary">
      <h2 className="cart-summary__title">Resumen del Pedido</h2>

      <div className="cart-summary__row">
        <span>Subtotal:</span>
        <span data-testid="summary-subtotal">
          ${subtotal.toLocaleString("es-CL")}
        </span>
      </div>

      {discount > 0 && (
        <div className="cart-summary__row cart-summary__row--discount">
          <span>Descuento:</span>
          <span data-testid="summary-discount">
            -${discount.toLocaleString("es-CL")}
          </span>
        </div>
      )}

      {couponDiscount > 0 && (
        <div className="cart-summary__row cart-summary__row--discount">
          <span>Cupón:</span>
          <span data-testid="summary-coupon-discount">
            -${couponDiscount.toLocaleString("es-CL")}
          </span>
        </div>
      )}

      {duocDiscount > 0 && (
        <div className="cart-summary__row cart-summary__row--discount">
          <span>Descuento DUOC (20%):</span>
          <span data-testid="summary-duoc-discount">
            -${duocDiscount.toLocaleString("es-CL")}
          </span>
        </div>
      )}

      {shipping > 0 && (
        <div className="cart-summary__row">
          <span>Envío:</span>
          <span data-testid="summary-shipping">
            ${shipping.toLocaleString("es-CL")}
          </span>
        </div>
      )}

      {shipping === 0 && subtotal > 0 && (
        <div className="cart-summary__row cart-summary__row--success">
          <span>Envío:</span>
          <span data-testid="summary-shipping">Gratis</span>
        </div>
      )}

      <div className="cart-summary__divider" />

      <div className="cart-summary__row cart-summary__row--total">
        <span>Total:</span>
        <span data-testid="summary-total">
          ${total.toLocaleString("es-CL")}
        </span>
      </div>

      {showCouponInput && (
        <div className="cart-summary__coupon" data-testid="coupon-section">
          <input
            type="text"
            className="cart-summary__coupon-input"
            placeholder="Código de cupón"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value);
              setCouponError("");
            }}
            data-testid="coupon-input"
          />
          <button
            className="cart-summary__coupon-btn"
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim()}
            data-testid="apply-coupon-btn"
          >
            Aplicar
          </button>
          {couponError && (
            <p
              className="cart-summary__coupon-error"
              data-testid="coupon-error"
            >
              {couponError}
            </p>
          )}
        </div>
      )}

      {onCheckout && (
        <button
          className="cart-summary__checkout-btn"
          onClick={handleCheckout}
          disabled={subtotal === 0}
          data-testid="checkout-btn"
        >
          Proceder al Pago
        </button>
      )}
    </div>
  );
}

CartSummary.propTypes = {
  subtotal: PropTypes.number,
  discount: PropTypes.number,
  shipping: PropTypes.number,
  couponDiscount: PropTypes.number,
  duocDiscount: PropTypes.number,
  onCheckout: PropTypes.func,
  onApplyCoupon: PropTypes.func,
  showCouponInput: PropTypes.bool,
};

CartSummary.defaultProps = {
  subtotal: 0,
  discount: 0,
  shipping: 0,
  couponDiscount: 0,
  duocDiscount: 0,
  onCheckout: null,
  onApplyCoupon: null,
  showCouponInput: false,
};
