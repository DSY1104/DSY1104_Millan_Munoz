import React from "react";
import "/src/styles/components/_landing_why-buy.css";

const whyBuyItems = [
  {
    img: "https://assets.corsair.com/image/upload/f_auto,q_auto/akamai/hybris/homepage/refresh/hp-icon-why-buy-exclusives.png",
    text: "productos y sets exclusivos",
  },
  {
    img: "https://assets.corsair.com/image/upload/f_auto,q_auto/akamai/hybris/homepage/refresh/hp-icon-why-buy-shipping.png",
    text: "SE ENVÍA GRATIS EL SIGUIENTE DÍA HÁBIL*",
  },
  {
    img: "https://assets.corsair.com/image/upload/f_auto,q_auto/akamai/hybris/homepage/refresh/hp-icon-why-buy-live-chat.png",
    text: "CHAT EN VIVO CON ESPECIALISTAS EN PRODUCTOS",
  },
  {
    img: "https://assets.corsair.com/image/upload/f_auto,q_auto/akamai/hybris/homepage/refresh/hp-icons-why-buy-returns.png",
    text: "60 DÍAS DE DEVOLUCIONES SIN RIESGO",
  },
];

export default function WhyBuySection() {
  return (
    <div
      className="why-buy landing-section"
      style={{ background: "transparent" }}
    >
      <div>
        <div id="home" className="text-white">
          <section id="why-buy">
            <div className="copy-container">
              <h2 style={{ fontSize: 24 }}>¿POR QUÉ COMPRAR EN LEVELUP?</h2>
            </div>
            {whyBuyItems.map((item, idx) => (
              <div key={idx} className="why-buy-link">
                <img src={item.img} alt="" />
                <p>{item.text}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
