import React from "react";
import "/src/styles/components/_product-card.css";

export default function ProductCard({
  imagen = "",
  nombre = "",
  marca = "",
  precioCLP = "",
  categoriaId = "",
  rating = null,
  onAddToCart = () => {},
}) {
  return (
    <div className="product-card">
      {categoriaId && (
        <span className="product-category badge">{categoriaId}</span>
      )}
      <div className="product-image-wrapper">
        <img src={imagen} alt={nombre} className="product-image" />
      </div>
      <div className="product-info">
        <div className="product-meta-row">
          <h3 className="product-name">{nombre}</h3>
          {rating !== null && <span className="product-rating">⭐ {rating}</span>}
        </div>
        <p className="product-brand">{marca}</p>
        <p className="product-price">${precioCLP}</p>
        <button className="add-to-cart" onClick={onAddToCart}>Agregar al carrito</button>
      </div>
    </div>
  );
}