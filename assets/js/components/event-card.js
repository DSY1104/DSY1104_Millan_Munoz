// Renderiza una tarjeta de evento a partir de un objeto evento y un contenedor destino
export function renderEventCard(event, container) {
  const card = document.createElement("div");
  card.className = "event-card";

  card.innerHTML = `
    <div class="event-card-row">
      <img class="event-map-image" 
        src="${event.image ? event.image : "/assets/image/icon/login.svg"}"
        alt="Mapa de ${event.location}" 
        title="Mapa de ${event.location}" 
        aria-label="Mapa de ${event.location}" 
        onerror="this.onerror=null;this.src='/assets/image/icon/login.svg';"
      />
      <div class="event-card-info">
        <h3 class="event-title">${event.name}</h3>
        <p class="event-location"><strong>Lugar:</strong> ${event.location}</p>
        <p class="event-region"><strong>Región:</strong> ${event.region}</p>
        <p class="event-dates"><strong>Fechas:</strong> ${event.dates}</p>
        <p class="event-hours"><strong>Horario:</strong> ${event.hours}</p>
        <p class="event-description">${event.description}</p>
      </div>
    </div>
  `;

  container.appendChild(card);
}
