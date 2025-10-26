import React, { useState, useEffect } from "react";
import { getAllEvents } from "../../services/eventService";
import "/src/styles/components/_event-card.css";

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [modalEvent, setModalEvent] = useState(null);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getAllEvents();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error("Error loading events:", err);
        setError(
          "No se pudieron cargar los eventos. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

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
          Lo mejor del Gaming, la tecnología y el entretenimiento digital a lo
          largo de Chile.
        </p>
      </section>

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
          Cargando eventos...
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#ff6b6b" }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <section
          className="events-list-index"
          style={{
            opacity: fade ? 1 : 0,
            transition: "opacity 0.7s",
          }}
        >
          {events.slice(0, 3).map((event, idx) => (
            <div key={idx} className="event-blog-card">
              <h3 className="event-title">{event.name}</h3>
              <p className="event-description">{event.description}</p>
              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="event-more-btn"
                  onClick={() => setModalEvent(event)}
                >
                  Más información
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Modal */}
      {modalEvent && (
        <div
          style={{
            display: "flex",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.65)",
            zIndex: 9999,
            justifyContent: "center",
            alignItems: "center",
            padding: "2vh",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalEvent(null);
          }}
        >
          <div
            style={{
              background: "#181a1f",
              color: "#fff",
              borderRadius: 16,
              maxWidth: 700,
              width: "96vw",
              maxHeight: "96vh",
              padding: "2rem 1.5rem",
              position: "relative",
              boxShadow: "0 8px 32px rgba(30,144,255,0.18)",
              display: "flex",
              flexDirection: "column",
              gap: "1.1rem",
              overflowY: "auto",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "1.5rem",
                cursor: "pointer",
                zIndex: 1,
              }}
              onClick={() => setModalEvent(null)}
            >
              &times;
            </button>
            <h2
              style={{
                color: "var(--accent-blue,#39a7ff)",
                paddingRight: "2rem",
              }}
            >
              {modalEvent.name}
            </h2>
            <p>{modalEvent.description}</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <span>
                <strong>Lugar:</strong> {modalEvent.location}
              </span>
              <span>
                <strong>Región:</strong> {modalEvent.region}
              </span>
              <span>
                <strong>Fechas:</strong> {modalEvent.dates}
              </span>
              <span>
                <strong>Horario:</strong> {modalEvent.hours}
              </span>
            </div>
            <div style={{ marginTop: "1.2rem" }}>
              <label style={{ fontWeight: 600, color: "#fff" }}>
                Mapa del evento:
              </label>
              <div
                style={{
                  marginTop: "0.5rem",
                  minHeight: 120,
                  background: "#23272f",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#aaa",
                  fontSize: "0.95rem",
                }}
              >
                {modalEvent.image ? (
                  <img
                    src={modalEvent.image}
                    alt={`Mapa de ${modalEvent.location}`}
                    style={{
                      maxWidth: "100%",
                      borderRadius: 8,
                      boxShadow: "0 2px 12px #0002",
                    }}
                  />
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
