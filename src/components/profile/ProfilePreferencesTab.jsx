import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../../hooks/useUser";

const categoriesList = [
  { id: "JM", nombre: "Juegos de Mesa" },
  { id: "CO", nombre: "Consolas" },
  { id: "CG", nombre: "Computadores y Gaming" },
  { id: "AC", nombre: "Accesorios" },
  { id: "MO", nombre: "Monitores" },
  { id: "AU", nombre: "Audio" },
];

export default function ProfilePreferencesTab() {
  const { user, updatePreferences } = useUser();
  const [profile, setProfile] = useState(user?.preferences || {});
  const [successMsg, setSuccessMsg] = useState("");
  const timeoutRef = useRef();

  // Update form when user data changes
  useEffect(() => {
    if (user?.preferences) {
      setProfile(user.preferences);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "favoriteCategories") {
      setProfile((prev) => {
        const favs = prev.favoriteCategories.includes(value)
          ? prev.favoriteCategories.filter((cat) => cat !== value)
          : [...prev.favoriteCategories, value];
        return { ...prev, favoriteCategories: favs };
      });
    } else if (type === "checkbox") {
      setProfile((prev) => ({ ...prev, [name]: checked }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePreferences(profile);
      setSuccessMsg("Preferencias guardadas correctamente");
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setSuccessMsg("Error al guardar preferencias");
      console.error(error);
    }
  };

  return (
    <section className="tab-content active" id="preferences-tab">
      <h2>Preferencias</h2>
      <form
        className="profile-form"
        id="preferences-form"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="form-group">
          <label>Categorías Favoritas</label>
          <div
            className="checkbox-group"
            id="favorite-categories"
            style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
          >
            {categoriesList.map((cat) => (
              <label
                key={cat.id}
                className="checkbox-label"
                style={{ marginRight: 12 }}
              >
                <input
                  type="checkbox"
                  name="favoriteCategories"
                  value={cat.id}
                  checked={profile.favoriteCategories.includes(cat.id)}
                  onChange={handleChange}
                />
                <span className="checkmark" /> {cat.nombre}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="preferred-platform">Plataforma Preferida</label>
          <select
            id="preferred-platform"
            name="preferredPlatform"
            value={profile.preferredPlatform}
            onChange={handleChange}
          >
            <option value="pc">PC</option>
            <option value="playstation">PlayStation</option>
            <option value="xbox">Xbox</option>
            <option value="switch">Nintendo Switch</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="gaming-hours">Horas de juego semanales</label>
          <select
            id="gaming-hours"
            name="gamingHours"
            value={profile.gamingHours}
            onChange={handleChange}
          >
            <option value="0-5">0-5</option>
            <option value="6-15">6-15</option>
            <option value="16-30">16-30</option>
            <option value=">30">Más de 30</option>
          </select>
        </div>
        <div className="form-group">
          <label className="preference">
            <input
              type="checkbox"
              name="notifyOffers"
              checked={!!profile.notifyOffers}
              onChange={handleChange}
            />
            Recibir ofertas y promociones
          </label>
        </div>
        <div className="form-group">
          <label className="preference">
            <input
              type="checkbox"
              name="notifyNewProducts"
              checked={!!profile.notifyNewProducts}
              onChange={handleChange}
            />
            Notificarme de nuevos productos
          </label>
        </div>
        <div className="form-group">
          <label className="preference">
            <input
              type="checkbox"
              name="notifyRestocks"
              checked={!!profile.notifyRestocks}
              onChange={handleChange}
            />
            Avisarme cuando haya reposiciones
          </label>
        </div>
        <div className="form-group">
          <label className="preference">
            <input
              type="checkbox"
              name="notifyNewsletter"
              checked={!!profile.notifyNewsletter}
              onChange={handleChange}
            />
            Suscribirme al newsletter
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
        {successMsg && <div className="success-message">{successMsg}</div>}
      </form>
    </section>
  );
}
