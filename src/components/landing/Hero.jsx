import React from "react";
import { Link } from "react-router-dom";
import "/src/styles/components/_hero.css";

export default function Hero() {
  return (
    <section className="hero" aria-label="Promoción principal">
      <div className="hero-media">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/img/hero-fallback.jpg"
          preload="auto"
          tabIndex={-1}
        >
          <source
            src="/media/video/Homepage_Looping_Video.webm"
            type="video/webm"
            media="(min-width: 769px)"
          />
          <source
            src="/media/video/Homepage_Looping_Video_Vertical.webm"
            type="video/webm"
            media="(max-width: 768px)"
          />
          {/* Imagen fallback para navegadores que no soportan video */}
          <img src="/assets/img/hero-fallback.jpg" alt="Promoción LevelUp" />
        </video>
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <h1 className="hero-claim">
          Los mejores productos para el Gamer que llevas en ti.
        </h1>
        <p className="hero-desc">
          PC´s, consolas y accesorios para todos los gustos.
        </p>
        <Link to="/products" className="hero-cta">
          Llévame a los productos
        </Link>
      </div>
    </section>
  );
}
