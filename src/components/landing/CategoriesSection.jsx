import React from "react";

const categories = [
  {
    id: "JM",
    name: "JUEGOS DE MESA",
    image: "/src/assets/images/categories/juegos-de-mesa.png",
    href: "pages/products/catalog.html?cat=JM",
  },
  {
    id: "AC",
    name: "ACCESORIOS",
    image: "https://assets.corsair.com/image/upload/f_auto/q_auto/v1716913780/akamai/hybris/homepage/refresh/category-tile-headsets.png",
    href: "pages/products/catalog.html?cat=AC",
  },
  {
    id: "FA",
    name: "FUENTES DE ALIMENTACIÓN",
    image: "https://assets.corsair.com/image/upload/f_auto/q_auto/v1716913783/akamai/hybris/homepage/refresh/category-tile-psu.png",
    href: "pages/products/catalog.html?cat=FA",
  },
  {
    id: "CG",
    name: "COMPUTADORES GAMER",
    image: "https://assets.corsair.com/image/upload/f_auto/q_auto/v1717186447/akamai/hybris/homepage/refresh/alternates/category-tile-cases-alt1.png",
    href: "pages/products/catalog.html?cat=CG",
  },
  {
    id: "MS",
    name: "MOUSE",
    image: "https://assets.corsair.com/image/upload/f_auto/q_auto/v1748382136/akamai/hybris/homepage/refresh/category-tile-Gaming-Mice.png",
    href: "pages/products/catalog.html?cat=MS",
  },
  {
    id: "MP",
    name: "MOUSEPAD",
    image: "/src/assets/images/categories/mousepad.png",
    href: "pages/products/catalog.html?cat=MP",
  },
  {
    id: "SG",
    name: "SILLAS GAMER",
    image: "https://assets.corsair.com/image/upload/f_auto/q_auto/v1721335978/akamai/hybris/homepage/refresh/category-tile-furniture.png",
    href: "pages/products/catalog.html?cat=SG",
  },
  {
    id: "PP",
    name: "POLERAS",
    image: "/src/assets/images/categories/poleras.png",
    href: "pages/products/catalog.html?cat=PP",
  },
  {
    id: "PG",
    name: "POLERONES",
    image: "/src/assets/images/categories/polerones.png",
    href: "pages/products/catalog.html?cat=PG",
  },
];

function CategoryTile({ name, image, href }) {
  return (
    <a
      data-bannertype="Product Categories"
      data-bannername={name}
      style={{ "--background-image": `url(${image})` }}
      role="button"
      tabIndex={0}
      aria-label={`Visit ${name} - Opens in the current Tab`}
      href={href}
      className="BentoBox_product-card__1IZaK NOPE"
    >
      <h2>{name}</h2>
      <p className="BentoBox_link-text__1UaLx">
        COMPRAR AHORA
        <img
          src="https://assets.corsair.com/image/upload/f_auto,q_auto/content/tlc-lp-design/memory/icon-right-arrow-yellow.png"
          alt="right facing arrow"
        />
      </p>
    </a>
  );
}

export default function CategoriesSection() {
  return (
    <section className="categories landing-section">
      <section className="events-header">
        <h1>Principales Categorías</h1>
        <p className="events-subtitle">Ve lo que LevelUP tiene para ti</p>
      </section>
      <section
        id="categories-list-index"
        className="categories-list-index"
        style={{ marginBottom: "2.5rem" }}
      >
        <div className="BentoBox_section-container__yBYID">
          <div>
            <div className="BentoBox_bento-container__23r4y">
              <div
                id="categorasdeproducto"
                aria-hidden="false"
                className="BentoBox_bento-content-item__3UayJ BentoBox_top-center-copy__3UeyQ BentoBox_active__1FGCg"
              >
                <div className="BentoBox_bento-tiles__3e5Y-">
                  <div className="BentoBox_left-column__3nDnA BentoBox_style-two__2WnXc">
                    {/* Primer bloque: Juegos de mesa, Accesorios, Fuentes, Computadores */}
                    <CategoryTile {...categories[0]} />
                    <div className="BentoBox_product-card-double__3Aavy NOPE">
                      <CategoryTile {...categories[1]} />
                      <CategoryTile {...categories[2]} />
                    </div>
                    <CategoryTile {...categories[3]} />
                  </div>
                  <div className="BentoBox_right-column__2p8kY">
                    <div className="BentoBox_product-card-double__3Aavy NOPE">
                      <CategoryTile {...categories[4]} />
                      <CategoryTile {...categories[5]} />
                    </div>
                    <CategoryTile {...categories[6]} />
                    <div className="BentoBox_product-card-double__3Aavy NOPE">
                      <CategoryTile {...categories[7]} />
                      <CategoryTile {...categories[8]} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
