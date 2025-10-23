import React, { useState, useEffect, useRef } from "react";

const defaultProfile = {
  addressLine1: "Av. Providencia 1234",
  addressLine2: "Departamento 56",
  city: "Santiago",
  region: "metropolitan",
  postalCode: "7500000",
  country: "chile",
  deliveryNotes: "Portero disponible de 9:00 a 18:00. Favor tocar timbre del departamento.",
};

const regions = [
  { value: "metropolitan", label: "Región Metropolitana" },
  { value: "valparaiso", label: "Valparaíso" },
  { value: "biobio", label: "Biobío" },
  { value: "araucania", label: "La Araucanía" },
  { value: "antofagasta", label: "Antofagasta" },
  { value: "loslagos", label: "Los Lagos" },
  { value: "coquimbo", label: "Coquimbo" },
  { value: "ohiggins", label: "O'Higgins" },
  { value: "maule", label: "Maule" },
  { value: "tarapaca", label: "Tarapacá" },
  { value: "magallanes", label: "Magallanes" },
  { value: "atacama", label: "Atacama" },
  { value: "arica", label: "Arica y Parinacota" },
  { value: "aysen", label: "Aysén" },
  { value: "losrios", label: "Los Ríos" },
];

const countries = [
  { value: "chile", label: "Chile" },
  { value: "argentina", label: "Argentina" },
  { value: "peru", label: "Perú" },
  { value: "brasil", label: "Brasil" },
  { value: "otro", label: "Otro" },
];

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

export default function ProfileAddressTab() {
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
    setSuccessMsg("Dirección guardada correctamente");
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <section className="tab-content active" id="address-tab">
      <h2>Dirección</h2>
      <form className="profile-form" id="address-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label htmlFor="address-line1">Dirección</label>
          <input
            type="text"
            id="address-line1"
            name="addressLine1"
            value={profile.addressLine1}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address-line2">Departamento, oficina, etc.</label>
          <input
            type="text"
            id="address-line2"
            name="addressLine2"
            value={profile.addressLine2}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">Ciudad</label>
          <input
            type="text"
            id="city"
            name="city"
            value={profile.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="region">Región</label>
          <select
            id="region"
            name="region"
            value={profile.region}
            onChange={handleChange}
            required
          >
            {regions.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="postal-code">Código Postal</label>
          <input
            type="text"
            id="postal-code"
            name="postalCode"
            value={profile.postalCode}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">País</label>
          <select
            id="country"
            name="country"
            value={profile.country}
            onChange={handleChange}
            required
          >
            {countries.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="delivery-notes">Notas de entrega</label>
          <textarea
            id="delivery-notes"
            name="deliveryNotes"
            value={profile.deliveryNotes}
            onChange={handleChange}
            rows={2}
          />
        </div>
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        {successMsg && <div className="success-message">{successMsg}</div>}
      </form>
    </section>
  );
}
