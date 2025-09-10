// Interactividad modular para la página de Soporte
// Inyecta títulos y textos en support-container de forma dinámica

export function initSupportInteractive() {
  const leftTitles = [
    { id: "support-faq", label: "Preguntas, Reclamos, Sugerencias" },
    { id: "support-envios", label: "Envíos y Devoluciones" },
    { id: "support-contacto", label: "Contáctanos!" },
  ];
  const rightTexts = [
    "En LevelUp tu satisfacción es nuestra prioridad. Escuchar a nuestros clientes nos ayuda a mejorar continuamente. ¡Sé parte de nuestra comunidad!",
    "Información sobre tiempos de envío, políticas de devolución y seguimiento de pedidos. Si no quedas conforme, nosotros tampoco.",
    `¿Necesitas ayuda? ¡Encantados de ayudarte! A través de Whatsapp estamos disponibles de Lunes a Viernes de 8am a 19hrs<br>
    <a href="https://wa.me/56944682126?text=Hola%20Soporte%20de%20LevelUp%2C%20%C2%A1Necesito%20de%20tu%20ayuda!%20%C2%BFEst%C3%A1s%20disponible%20para%20atender%20a%20mis%20peticiones%3F" target="_blank" rel="noopener" class="whatsapp-btn" aria-label="Abrir chat de soporte técnico en WhatsApp">
      Contáctanos por WhatsApp
    </a>`,
  ];

  const left = document.querySelector(".support-left");
  const right = document.querySelector(".support-right");
  if (!left || !right) return;

  left.innerHTML = "";
  leftTitles.forEach((item, idx) => {
    const el = document.createElement(idx === 0 ? "h2" : "h3");
    el.textContent = item.label;
    el.className = "support-title-item";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-pressed", idx === 0 ? "true" : "false");
    el.dataset.idx = idx;
    if (idx === 0) el.classList.add("active");
    el.addEventListener("click", () => showText(idx));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") showText(idx);
    });
    left.appendChild(el);
  });

  right.innerHTML = `<p class="support-fade" style="opacity:1">${rightTexts[0]}</p>`;

  function showText(idx) {
    left.querySelectorAll(".support-title-item").forEach((el, i) => {
      el.classList.toggle("active", i === idx);
      el.setAttribute("aria-pressed", i === idx ? "true" : "false");
    });
    const p = right.querySelector(".support-fade");
    if (p) {
      p.style.transition = "opacity 0.3s";
      p.style.opacity = 0;
      setTimeout(() => {
        p.innerHTML = rightTexts[idx];
        p.style.opacity = 1;
      }, 300);
    }
  }
}
