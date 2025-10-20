import React, { useState, useEffect } from "react";
import eventData from "/src/assets/data/eventData.json";

const mockEvents = eventData.techAndGamingEvents.map(event => ({
  ...event,
}));

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [modalEvent, setModalEvent] = useState(null);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setEvents(mockEvents);
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setEvents((prev) => prev.slice().sort(() => 0.5 - Math.random()));
        setFade(true);
      }, 700);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="events landing-section">
      <section className="events-header">
        <h1>Échale un ojo a los próximos eventos</h1>
        <p className="events-subtitle">
          Lo mejor del Gaming, la tecnología y el entretenimiento digital a lo largo de Chile.
        </p>
      </section>
      <section
        className="events-list-index"
        style={{
          display: "flex",
          gap: "1.2rem",
          flexWrap: "wrap",
          alignItems: "stretch",
          justifyContent: "center",
          marginBottom: "2.5rem",
          opacity: fade ? 1 : 0,
          transition: "opacity 0.7s",
        }}
      >
        {events.slice(0, 3).map((event, idx) => (
          <div key={idx} className="event-blog-card">
            <h3 className="event-title" style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>{event.name}</h3>
            <p className="event-description" style={{ marginBottom: "1.2rem" }}>{event.description}</p>
            <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end" }}>
              <button
                className="event-more-btn"
                style={{ background: "var(--accent-green,#1a237e)", color: "#454545", border: "none", borderRadius: "6px", padding: "0.5em 1.2em", fontSize: "1rem", cursor: "pointer", transition: "background 0.2s" }}
                onClick={() => setModalEvent(event)}
              >
                Más información
              </button>
            </div>
          </div>
        ))}
      </section>
      {/* Modal */}
      {modalEvent && (
        <div
          style={{
            display: "flex", position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.65)", zIndex: 9999, justifyContent: "center", alignItems: "center"
          }}
          onClick={e => {
            if (e.target === e.currentTarget) setModalEvent(null);
          }}
        >
          <div style={{ background: "#181a1f", color: "#fff", borderRadius: 16, maxWidth: 700, width: "96vw", padding: "2rem 1.5rem", position: "relative", boxShadow: "0 8px 32px rgba(30,144,255,0.18)", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <button
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer" }}
              onClick={() => setModalEvent(null)}
            >
              &times;
            </button>
            <h2 style={{ color: "var(--accent-blue,#39a7ff)" }}>{modalEvent.name}</h2>
            <p>{modalEvent.description}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span>Lugar: {modalEvent.location}</span>
              <span>Región: {modalEvent.region}</span>
              <span>Fechas: {modalEvent.dates}</span>
              <span>Horario: {modalEvent.hours}</span>
            </div>
            <div style={{ marginTop: "1.2rem" }}>
              <label style={{ fontWeight: 600, color: "#fff" }}>Mapa del evento:</label>
              <div style={{ marginTop: "0.5rem", minHeight: 120, background: "#23272f", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: "0.95rem" }}>
                {modalEvent.image ? (
                  <img src={modalEvent.image} alt={`Mapa de ${modalEvent.location}`} style={{ maxWidth: "100%", borderRadius: 8, boxShadow: "0 2px 12px #0002" }} />
                ) : (
                  "(Aquí puedes añadir una imagen del mapa)"
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}