import React from "react";
import PropTypes from "prop-types";
import CartItem from "./CartItem";

/**
 * CartDetail Component
 * Displays the list of cart items and handles cart operations
 */
export default function CartDetail({
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  showClearButton = true,
}) {
  const handleClearCart = () => {
    if (
      items.length > 0 &&
      window.confirm("¿Estás seguro de que deseas vaciar el carrito?")
    ) {
      if (onClearCart) {
        onClearCart();
      }
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="cart-detail cart-detail--empty"
        data-testid="cart-detail-empty"
      >
        <div className="cart-detail__empty-state">
          <i className="cart-detail__empty-icon">🛒</i>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos para comenzar a comprar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-detail" data-testid="cart-detail">
      <div className="cart-detail__header">
        <h2 className="cart-detail__title">
          Carrito de Compras ({items.length}{" "}
          {items.length === 1 ? "producto" : "productos"})
        </h2>
        {showClearButton && (
          <button
            className="cart-detail__clear-btn"
            onClick={handleClearCart}
            data-testid="clear-cart-btn"
          >
            Vaciar Carrito
          </button>
        )}
      </div>

      <div className="cart-detail__items">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemoveItem}
          />
        ))}
      </div>

      <div className="cart-detail__footer">
        <p className="cart-detail__item-count" data-testid="total-items">
          Total de productos:{" "}
          {items.reduce((sum, item) => sum + (item.qty || 0), 0)}
        </p>
      </div>
    </div>
  );
}

CartDetail.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      qty: PropTypes.number.isRequired,
      image: PropTypes.string,
      stock: PropTypes.number,
    })
  ),
  onUpdateQuantity: PropTypes.func,
  onRemoveItem: PropTypes.func,
  onClearCart: PropTypes.func,
  showClearButton: PropTypes.bool,
};

CartDetail.defaultProps = {
  items: [],
  onUpdateQuantity: null,
  onRemoveItem: null,
  onClearCart: null,
  showClearButton: true,
};
