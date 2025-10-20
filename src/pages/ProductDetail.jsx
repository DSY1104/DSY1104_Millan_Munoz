import React from "react";

export default function ProductDetailPage() {

  return (
    <div>
      <div className="content-wrapper">
        <main>
          <section id="detalle-producto" className="section">
            <div id="product-detail-container">
              {/* Aquí se cargará el detalle del producto por JS, ahora por React */}
              {/* <ProductDetail product={product} /> */}
              <p>Detalle del producto aquí.</p>
            </div>
          </section>
          {/* Reviews Section */}
          <section id="reviews-section" className="section">
            <div id="reviews-container">
              {/* Reviews will be loaded here by JS, ahora por React */}
              {/* <ReviewsSection reviews={reviews} /> */}
              <p>Reviews aquí.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
