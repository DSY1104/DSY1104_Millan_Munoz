import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "/src/styles/components/_product-card.css";

export default function ProductCard({
  // Support both old format and Inventario API format
  idProducto,
  code = "",
  imagen = "",
  nombre = "",
  marca = "",
  precioCLP = "",
  categoriaId = "",
  categoria, // Inventario API: categoria object with idCategoria and nombreCategoria
  rating = null,
  stock = 0,
}) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Derive categoryId from either categoriaId or categoria.idCategoria
  const derivedCategoryId = categoriaId || categoria?.idCategoria || "";
  const productCode = code || idProducto?.toString() || "";

  const handleCardClick = (e) => {
    // Don't navigate if clicking the add to cart button
    if (e.target.closest(".product-card__button")) {
      return;
    }
    if (productCode) {
      navigate(`/products/${productCode}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (stock <= 0) {
      return;
    }

    const button = e.currentTarget;

    // Prevent double-clicks
    if (button.disabled) {
      return;
    }

    console.log("ProductCard: Adding to cart", { code: productCode, nombre, qty: 1 });

    addToCart({
      id: productCode,
      name: nombre,
      price: precioCLP,
      qty: 1,
      stock: stock,
      image: imagen,
      metadata: {
        marca: marca,
        categoriaId: derivedCategoryId,
      },
    });

    // Visual feedback
    const originalText = button.textContent;
    button.textContent = "¡Añadido!";
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 1200);
  };

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {derivedCategoryId && (
        <span className="product-card__category">{derivedCategoryId}</span>
      )}
      <div className="product-card__image-wrapper">
        <img src={imagen} alt={nombre} className="product-card__image" />
      </div>
      <div className="product-card__info">
        <div className="product-card__meta-row">
          <h3 className="product-card__name">{nombre}</h3>
        </div>
        <p className="product-card__brand">{marca}</p>
        <p className="product-card__price">
          ${precioCLP.toLocaleString("es-CL")}
        </p>
        <button
          className="product-card__button"
          onClick={handleAddToCart}
          disabled={stock <= 0}
        >
          {stock <= 0 ? "Sin stock" : "comprar"}
        </button>
      </div>
    </div>
  );
}
