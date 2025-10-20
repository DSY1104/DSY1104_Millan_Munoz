import React from "react";
import "/src/styles/components/_landing-categories.css";

const categories = [
  {
    name: "JUEGOS DE MESA",
    image: "/src/assets/images/categories/juegos-de-mesa.png",
    href: "/pages/products/catalog.html?cat=JM",
  },
  {
    name: "ACCESORIOS",
    image: "https://assets.corsair.com/image/upload/f_auto/q_auto/v1716913780/akamai/hybris/homepage/refresh/category-tile-headsets.png",
    href: "/pages/products/catalog.html?cat=AC",
  },
  {
    name: "FUENTES DE ALIMENTACIÓN",
    image: "https://assets.corsair.com/image/upload/f_auto/q_auto/v1716913783/akamai/hybris/homepage/refresh/category-tile-psu.png",
    href: "/pages/products/catalog.html?cat=FA",
  },
  {
    name: "COMPUTADORES GAMER",
    image: "https://assets.corsair.com/image/upload/f_auto/q_auto/v1717186447/akamai/hybris/homepage/refresh/alternates/category-tile-cases-alt1.png",
    href: "/pages/products/catalog.html?cat=CG",
  },
  {
    name: "MOUSE",
    image: "https://assets.corsair.com/image/upload/f_auto/q_auto/v1748382136/akamai/hybris/homepage/refresh/category-tile-Gaming-Mice.png",
    href: "/pages/products/catalog.html?cat=MS",
  },
  {
    name: "MOUSEPAD",
    image: "/src/assets/images/categories/mousepad.png",
    href: "/pages/products/catalog.html?cat=MP",
  },
  {
    name: "SILLAS GAMER",
    image: "/src/assets/images/categories/sillas-gamer.png",
    href: "/pages/products/catalog.html?cat=SG",
  },
  {
    name: "POLERAS",
    image: "/src/assets/images/categories/poleras.png",
    href: "/pages/products/catalog.html?cat=PP",
  },
  {
    name: "POLERONES",
    image: "/src/assets/images/categories/polerones.png",
    href: "/pages/products/catalog.html?cat=PG",
  },
];

export default function CategoriesSection() {
  return (
    <section className="categories landing-section">
      <section className="events-header">
        <h1>Principales Categorías</h1>
        <p className="events-subtitle">Ve lo que LevelUP tiene para ti</p>
      </section>
      <section className="categories-list-index" style={{ marginBottom: "2.5rem" }}>
        <div className="BentoBox_section-container__yBYID">
          <div>
            <div className="BentoBox_bento-container__23r4y">
              <div className="BentoBox_bento-content-item__3UayJ BentoBox_top-center-copy__3UeyQ BentoBox_active__1FGCg">
                <div className="BentoBox_bento-tiles__3e5Y-" style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem" }}>
                  {categories.map((cat, idx) => (
                    <a
                      key={cat.name}
                      href={cat.href}
                      className="BentoBox_product-card__1IZaK NOPE"
                      style={{
                        backgroundImage: `url(${cat.image})`,
                        display: "block",
                        minWidth: "220px",
                        maxWidth: "320px",
                        borderRadius: "12px",
                        padding: "1.2rem",
                        color: "#fff",
                        textDecoration: "none",
                        boxShadow: "0 2px 12px #0002",
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Visit ${cat.name} - Opens in the current Tab`}
                    >
                      <h2>{cat.name}</h2>
                      <p className="BentoBox_link-text__1UaLx">
                        COMPRAR AHORA
                        <img
                          src="https://assets.corsair.com/image/upload/f_auto,q_auto/content/tlc-lp-design/memory/icon-right-arrow-yellow.png"
                          alt="right facing arrow"
                        />
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
