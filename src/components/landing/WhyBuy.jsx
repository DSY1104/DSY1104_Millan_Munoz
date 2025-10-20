import React from "react";
import "/src/styles/components/_landing_why-buy.css";

const whyBuyItems = [
  {
    href: "/lm/es/s/buy-direct#selection",
    img: "https://assets.corsair.com/image/upload/f_auto,q_auto/akamai/hybris/homepage/refresh/hp-icon-why-buy-exclusives.png",
    alt: "",
    text: "productos y sets exclusivos",
    aria: "productos y sets exclusivos - Opens in the current Tab",
  },
  {
    href: "/lm/es/s/buy-direct#ship",
    img: "https://assets.corsair.com/image/upload/f_auto,q_auto/akamai/hybris/homepage/refresh/hp-icon-why-buy-shipping.png",
    alt: "",
    text: "SE ENVÍA GRATIS EL SIGUIENTE DÍA HÁBIL*",
    aria: "SE ENVÍA GRATIS EL SIGUIENTE DÍA HÁBIL* - Opens in the current Tab",
  },
  {
    href: "/lm/es/s/buy-direct#chat",
    img: "https://assets.corsair.com/image/upload/f_auto,q_auto/akamai/hybris/homepage/refresh/hp-icon-why-buy-live-chat.png",
    alt: "",
    text: "CHAT EN VIVO CON ESPECIALISTAS EN PRODUCTOS",
    aria: "CHAT EN VIVO CON ESPECIALISTAS EN PRODUCTOS - Opens in the current Tab",
  },
  {
    href: "/lm/es/s/buy-direct#returns",
    img: "https://assets.corsair.com/image/upload/f_auto,q_auto/akamai/hybris/homepage/refresh/hp-icons-why-buy-returns.png",
    alt: "",
    text: "60 DÍAS DE DEVOLUCIONES SIN RIESGO",
    aria: "60 DÍAS DE DEVOLUCIONES SIN RIESGO - Opens in the current Tab",
  },
];

export default function WhyBuySection() {
  return (
    <div className="why-buy landing-section" style={{ background: "transparent" }}>
      <div>
        <div id="home" className="text-white">
          <section id="why-buy">
            <div className="copy-container">
              <h2 style={{ fontSize: 24 }}>¿POR QUÉ COMPRAR EN LEVELUP?</h2>
            </div>
            {whyBuyItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="why-buy-link"
                data-bannertype="Why Buy"
                data-bannermessage={item.text}
                aria-label={item.aria}
                target="_blank"
                rel="noopener"
              >
                <img src={item.img} alt={item.alt} title="" />
                <p>{item.text}</p>
              </a>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
