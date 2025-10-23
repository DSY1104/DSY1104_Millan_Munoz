
import React, { useState, useEffect, useRef } from "react";

const defaultProfile = {
  firstName: "Alex",
  lastName: "Rodriguez",
  email: "alex.rodriguez@levelup.cl",
  phone: "+56 9 1234 5678",
  birthdate: "1995-03-15",
  bio: "Apasionado gamer desde la infancia. Me encantan los RPGs y los juegos de estrategia. Siempre buscando nuevas aventuras virtuales y compartiendo experiencias con la comunidad gaming.",
};

function loadUserProfile() {
  try {
    const stored = localStorage.getItem("userProfile");
    return stored ? { ...defaultProfile, ...JSON.parse(stored) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

function saveUserProfile(profile) {
  localStorage.setItem("userProfile", JSON.stringify(profile));
}

export default function ProfilePersonalTab() {
  const [profile, setProfile] = useState(defaultProfile);
  const [successMsg, setSuccessMsg] = useState("");
  const timeoutRef = useRef();

  useEffect(() => {
    setProfile(loadUserProfile());
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUserProfile(profile);
    setSuccessMsg("Información personal guardada correctamente");
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <section className="tab-content active" id="personal-tab">
      <h2>Información Personal</h2>
      <form className="profile-form" id="personal-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label htmlFor="first-name">Nombre</label>
          <input
            type="text"
            id="first-name"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last-name">Apellido</label>
          <input
            type="text"
            id="last-name"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            readOnly
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Teléfono</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthdate">Fecha de Nacimiento</label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={profile.birthdate}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Biografía</label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        {successMsg && <div className="success-message">{successMsg}</div>}
      </form>
    </section>
  );
}
