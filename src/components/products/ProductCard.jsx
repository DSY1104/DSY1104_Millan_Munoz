import React from "react";
import "/src/styles/components/_product-card.css";

export default function ProductCard({
  imagen = "",
  nombre = "",
  marca = "",
  precioCLP = "",
  rating = null,
  onAddToCart = () => {},
}) {
  return (
    <div className="product-card">
      <img src={imagen} alt={nombre} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{nombre}</h3>
        <p className="product-brand">{marca}</p>
        <p className="product-price">${precioCLP}</p>
        {rating !== null && <p className="product-rating">⭐ {rating}</p>}
        <button className="add-to-cart" onClick={onAddToCart}>Agregar al carrito</button>
      </div>
    </div>
  );
}