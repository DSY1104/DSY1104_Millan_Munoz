import React, { useState } from "react";
import "/src/styles/pages/support.css";

const leftTitles = [
  { id: "support-faq", label: "Preguntas, Reclamos, Sugerencias" },
  { id: "support-envios", label: "Envíos y Devoluciones" },
  { id: "support-contacto", label: "Contáctanos!" },
];
const rightTexts = [
  "En LevelUp tu satisfacción es nuestra prioridad. Escuchar a nuestros clientes nos ayuda a mejorar continuamente. ¡Sé parte de nuestra comunidad!",
  "Información sobre tiempos de envío, políticas de devolución y seguimiento de pedidos. Si no quedas conforme, nosotros tampoco.",
  `¿Necesitas ayuda? ¡Encantados de ayudarte! A través de Whatsapp estamos disponibles de Lunes a Viernes de 8am a 19hrs<br />\
    <a href=\"https://wa.me/56944682126?text=Hola%20Soporte%20de%20LevelUp%2C%20%C2%A1Necesito%20de%20tu%20ayuda!%20%C2%BFEst%C3%A1s%20disponible%20para%20atender%20a%20mis%20peticiones%3F\" target=\"_blank\" rel=\"noopener\" class=\"whatsapp-btn\" aria-label=\"Abrir chat de soporte técnico en WhatsApp\">Contáctanos por WhatsApp</a>`,
];

export default function SupportPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fade, setFade] = useState(true);

  const handleSelect = (idx) => {
    setFade(false);
    setTimeout(() => {
      setActiveIdx(idx);
      setFade(true);
    }, 300);
  };

  return (
    <div>
      <main className="support__main-content">
        <header className="support-header">
          <h1>Soporte</h1>
          <p className="support-subtitle">
            Ayuda y recursos para resolver tus dudas y problemas. Porque la
            confianza la construimos en conjunto 😁
          </p>
        </header>
        <main>
          <div className="support-container">
            <div className="support-left">
              {leftTitles.map((item, idx) => {
                const Tag = idx === 0 ? "h2" : "h3";
                return (
                  <Tag
                    key={item.id}
                    className={`support-title-item${
                      activeIdx === idx ? " active" : ""
                    }`}
                    tabIndex={0}
                    role="button"
                    aria-pressed={activeIdx === idx}
                    onClick={() => handleSelect(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleSelect(idx);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {item.label}
                  </Tag>
                );
              })}
            </div>
            <div className="support-right">
              <p
                className="support-fade"
                style={{
                  opacity: fade ? 1 : 0,
                  transition: "opacity 0.3s",
                }}
                dangerouslySetInnerHTML={{ __html: rightTexts[activeIdx] }}
              />
            </div>
          </div>
        </main>
      </main>
    </div>
  );
}
