// Interactividad para la página About: mostrar texto a la derecha al hacer click en la izquierda con fade

document.addEventListener("DOMContentLoaded", function () {
  const leftTitles = [
    { id: "about-title", label: "Sobre Nosotros" },
    { id: "about-mision", label: "Misión" },
    { id: "about-vision", label: "Visión" },
  ];
  const rightTexts = [
    "Level-Up Gamer es una tienda online dedicada a satisfacer las necesidades de los entusiastas de los videojuegos en Chile. Lanzada hace dos años como respuesta a la creciente demanda durante la pandemia, Level-Up Gamer ofrece una amplia gama de productos para gamers, desde consolas y accesorios hasta computadores y sillas especializadas. Aunque no cuenta con una ubicación física, realiza despachos a todo el país.",
    "Proporcionar productos de alta calidad para gamers en todo Chile, ofreciendo una experiencia de compra única y personalizada, con un enfoque en la satisfacción del cliente y el crecimiento de la comunidad gamer.",
    "Ser la tienda online líder en productos para gamers en Chile, reconocida por su innovación, servicio al cliente excepcional, y un programa de fidelización basado en gamificación que recompense a nuestros clientes más fieles.",
  ];

  // Estructura HTML dinámica
  const left = document.querySelector(".about-left");
  const right = document.querySelector(".about-right");
  if (!left || !right) return;

  // Limpiar y crear títulos clickeables
  left.innerHTML = "";
  leftTitles.forEach((item, idx) => {
    const el = document.createElement(idx === 0 ? "h1" : "h2");
    el.textContent = item.label;
    el.className = "about-title";
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

  // Inicializar texto visible
  right.innerHTML = `<p class="about-fade" style="opacity:1">${rightTexts[0]}</p>`;

  function showText(idx) {
    // Cambiar estado activo
    left.querySelectorAll(".about-title").forEach((el, i) => {
      el.classList.toggle("active", i === idx);
      el.setAttribute("aria-pressed", i === idx ? "true" : "false");
    });
    // Fade out
    const p = right.querySelector(".about-fade");
    if (p) {
      p.style.transition = "opacity 0.3s";
      p.style.opacity = 0;
      setTimeout(() => {
        p.innerHTML = rightTexts[idx];
        p.style.opacity = 1;
      }, 300);
    }
  }
});
