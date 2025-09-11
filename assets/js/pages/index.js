import { renderProductCard } from "../components/product-card.js";
import { renderEventCard } from "../components/event-card.js";
import {
  getEventsFromLocalStorage,
  saveEventsToLocalStorage,
} from "../../data/eventsData.js";

// Inicializa los eventos en localStorage si no existen
import { techAndGamingEvents } from "../../data/eventsData.js";
if (!localStorage.getItem("techAndGamingEvents")) {
  saveEventsToLocalStorage(techAndGamingEvents);
}

// Renderizar eventos en el index principal
document.addEventListener("DOMContentLoaded", () => {
  // ... Tarjetas de productos aleatorios eliminadas ...
  const eventsContainer = document.getElementById("events-list-index");
  if (!eventsContainer) return;
  const events = getEventsFromLocalStorage();
  if (events.length === 0) return;
  // Mostrar 3 eventos aleatorios y rotar cada 15s con fade
  function renderRandomEvents() {
    const shuffled = events.slice().sort(() => 0.5 - Math.random());
    // Fade out
    eventsContainer.style.transition = "opacity 0.7s";
    eventsContainer.style.opacity = 0;
    setTimeout(() => {
      eventsContainer.innerHTML = "";
      shuffled.slice(0, 3).forEach((event, idx) => {
        const card = document.createElement("div");
        card.className = "event-blog-card";
        card.innerHTML =
          '<h3 class="event-title" style="font-size:1.3rem; margin-bottom:0.5rem;">' +
          event.name +
          "</h3>" +
          '<p class="event-description" style="margin-bottom:1.2rem;">' +
          event.description +
          "</p>" +
          '<div style="margin-top:auto; display:flex; justify-content:flex-end;">' +
          '<button class="event-more-btn" data-event-idx="' +
          events.indexOf(event) +
          '" style="background:var(--accent-green,#1a237e);color:#454545;border:none;border-radius:6px;padding:0.5em 1.2em;font-size:1rem;cursor:pointer;transition:background 0.2s;">Más información</button>' +
          "</div>";
        eventsContainer.appendChild(card);
      });
      // Fade in
      setTimeout(() => {
        eventsContainer.style.opacity = 1;
      }, 50);
    }, 700);
  }
  renderRandomEvents();
  setInterval(renderRandomEvents, 15000);

  // Modal base
  let modal = document.getElementById("event-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "event-modal";
    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "rgba(0,0,0,0.65)";
    modal.style.zIndex = "9999";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.innerHTML = `
  <div id="event-modal-content" style="background:#181a1f; color:#fff; border-radius:16px; max-width:700px; width:96vw; padding:2rem 1.5rem; position:relative; box-shadow:0 8px 32px rgba(30,144,255,0.18); display:flex; flex-direction:column; gap:1.1rem;">
        <button id="event-modal-close" style="position:absolute; top:1rem; right:1rem; background:none; border:none; color:#fff; font-size:1.5rem; cursor:pointer;">&times;</button>
        <h2 id="event-modal-title" style="color:var(--accent-blue,#39a7ff);"></h2>
        <p id="event-modal-description"></p>
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <span id="event-modal-location"></span>
          <span id="event-modal-region"></span>
          <span id="event-modal-dates"></span>
          <span id="event-modal-hours"></span>
        </div>
        <div style="margin-top:1.2rem;">
          <label style="font-weight:600; color:#fff;">Mapa del evento:</label>
          <div id="event-modal-map" style="margin-top:0.5rem; min-height:120px; background:#23272f; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#aaa; font-size:0.95rem;">(Aquí puedes añadir una imagen del mapa)</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Evento para cerrar modal
  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.id === "event-modal-close") {
      modal.style.display = "none";
    }
  });

  // Evento para abrir modal con info
  eventsContainer.addEventListener("click", function (e) {
    const btn = e.target.closest(".event-more-btn");
    if (!btn) return;
    const idx = btn.getAttribute("data-event-idx");
    const event = events[idx];
    if (!event) return;
    document.getElementById("event-modal-title").textContent = event.name;
    document.getElementById("event-modal-description").textContent =
      event.description;
    document.getElementById("event-modal-location").textContent =
      "Lugar: " + event.location;
    document.getElementById("event-modal-region").textContent =
      "Región: " + event.region;
    document.getElementById("event-modal-dates").textContent =
      "Fechas: " + event.dates;
    document.getElementById("event-modal-hours").textContent =
      "Horario: " + event.hours;
    document.getElementById("event-modal-map").innerHTML = event.image
      ? `<img src="${event.image}" alt="Mapa de ${event.location}" style="max-width:100%;border-radius:8px;box-shadow:0 2px 12px #0002;" />`
      : "(Aquí puedes añadir una imagen del mapa)";
    modal.style.display = "flex";
  });
});
