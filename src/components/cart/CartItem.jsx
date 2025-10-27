import React from "react";
import PropTypes from "prop-types";

/**
 * CartItem Component
 * Displays a single item in the shopping cart with quantity controls
 */
export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  if (!item) {
    return null;
  }

  const { id, name, price, qty, image, stock } = item;

  const handleQuantityChange = (newQty) => {
    const quantity = Math.max(1, Math.min(newQty, stock || 999));
    if (onUpdateQuantity) {
      onUpdateQuantity(id, quantity);
    }
  };

  const handleIncrement = () => {
    if (qty < (stock || 999)) {
      handleQuantityChange(qty + 1);
    }
  };

  const handleDecrement = () => {
    if (qty > 1) {
      handleQuantityChange(qty - 1);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(id);
    }
  };

  const subtotal = price * qty;

  return (
    <div className="cart-item" data-testid={`cart-item-${id}`}>
      <div className="cart-item__image">
        {image ? (
          <img src={image.replace('/src/assets/images/', '/assets/images/')} alt={name} />
        ) : (
          <div className="cart-item__image-placeholder">No image</div>
        )}
      </div>

      <div className="cart-item__details">
        <h3 className="cart-item__name">{name}</h3>
        <p className="cart-item__price">${price?.toLocaleString("es-CL")}</p>
        {stock && stock < 10 && (
          <p className="cart-item__stock-warning">
            Solo quedan {stock} unidades
          </p>
        )}
      </div>

      <div className="cart-item__quantity">
        <button
          className="cart-item__quantity-btn"
          onClick={handleDecrement}
          disabled={qty <= 1}
          aria-label="Disminuir cantidad"
          data-testid="decrease-qty"
        >
          -
        </button>
        <span className="cart-item__quantity-value" data-testid="item-quantity">
          {qty}
        </span>
        <button
          className="cart-item__quantity-btn"
          onClick={handleIncrement}
          disabled={qty >= (stock || 999)}
          aria-label="Aumentar cantidad"
          data-testid="increase-qty"
        >
          +
        </button>
      </div>

      <div className="cart-item__subtotal" data-testid="item-subtotal">
        ${subtotal.toLocaleString("es-CL")}
      </div>

      <button
        className="cart-item__remove"
        onClick={handleRemove}
        aria-label={`Eliminar ${name}`}
        data-testid="remove-item"
      >
        ×
      </button>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    qty: PropTypes.number.isRequired,
    image: PropTypes.string,
    stock: PropTypes.number,
  }).isRequired,
  onUpdateQuantity: PropTypes.func,
  onRemove: PropTypes.func,
};

CartItem.defaultProps = {
  onUpdateQuantity: null,
  onRemove: null,
};
