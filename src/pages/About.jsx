import React, { useEffect, useMemo, useRef, useState } from "react";
import "/src/styles/pages/about.css";


const LEFT_TITLES = [
  { id: "about-title", label: "Sobre Nosotros" },
  { id: "about-mision", label: "Misión" },
  { id: "about-vision", label: "Visión" },
];


const RIGHT_TEXTS = [
  "Level-Up Gamer es una tienda online dedicada a satisfacer las necesidades de los entusiastas de los videojuegos en Chile. Lanzada hace dos años como respuesta a la creciente demanda durante la pandemia, Level-Up Gamer ofrece una amplia gama de productos para gamers, desde consolas y accesorios hasta computadores y sillas especializadas. Aunque no cuenta con una ubicación física, realiza despachos a todo el país.",
  "Proporcionar productos de alta calidad para gamers en todo Chile, ofreciendo una experiencia de compra única y personalizada, con un enfoque en la satisfacción del cliente y el crecimiento de la comunidad gamer.",
  "Ser la tienda online líder en productos para gamers en Chile, reconocida por su innovación, servicio al cliente excepcional, y un programa de fidelización basado en gamificación que recompense a nuestros clientes más fieles.",
];


export default function About() {
  const [active, setActive] = useState(0);
  const pRef = useRef(null);


  // Fade effect similar to vanilla version
  useEffect(() => {
    const el = pRef.current;
    if (!el) return;
    el.style.transition = "opacity 0.3s";
    el.style.opacity = 0;
    const t = setTimeout(() => {
      el.style.opacity = 1;
    }, 300);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <>
      <main className="main-content">
      <header className="about-header">
        <h1>LevelUp</h1>
        <p className="about-subtitle">Tu centro gamer.</p>
      </header>
      <main>
        <div className="about-container">
          <div className="about-left">
            {LEFT_TITLES.map((item, idx) => {
              const Tag = idx === 0 ? "h1" : "h2";
              const isActive = idx === active;
              return (
                <Tag
                  key={item.id}
                  className={`about-title ${isActive ? "active" : ""}`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setActive(idx);
                  }}
                >
                  {item.label}
                </Tag>
              );
            })}
          </div>
          <div className="about-right">
            <p ref={pRef} className="about-fade" style={{ opacity: 1 }}>
              {RIGHT_TEXTS[active]}
            </p>
          </div>
        </div>
      </main>
    </main>
    </>
  );
}


