import { renderProductCard } from "../components/product-card.js";

fetch("../../assets/data/products.json")
  .then((res) => res.json())
  .then((products) => {
    const container = document.getElementById("product-list");
    products.forEach((product) => renderProductCard(product, container));
  });
