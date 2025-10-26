import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../../hooks/useUser";

const genres = [
  { value: "rpg", label: "RPG" },
  { value: "fps", label: "FPS" },
  { value: "moba", label: "MOBA" },
  { value: "estrategia", label: "Estrategia" },
  { value: "deportes", label: "Deportes" },
  { value: "simulacion", label: "Simulación" },
  { value: "aventura", label: "Aventura" },
  { value: "carreras", label: "Carreras" },
  { value: "otros", label: "Otros" },
];

const skillLevels = [
  { value: "beginner", label: "Principiante" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
  { value: "pro", label: "Pro" },
];

const streamingPlatformsList = [
  { value: "twitch", label: "Twitch" },
  { value: "youtube", label: "YouTube Gaming" },
  { value: "facebook", label: "Facebook Gaming" },
  { value: "trovo", label: "Trovo" },
  { value: "kick", label: "Kick" },
];

export default function ProfileGamingTab() {
  const { user, updateGaming } = useUser();
  const [profile, setProfile] = useState(user?.gaming || {});
  const [successMsg, setSuccessMsg] = useState("");
  const timeoutRef = useRef();

  // Update form when user data changes
  useEffect(() => {
    if (user?.gaming) {
      setProfile(user.gaming);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "streamingPlatforms") {
      setProfile((prev) => {
        const platforms = prev.streamingPlatforms.includes(value)
          ? prev.streamingPlatforms.filter((p) => p !== value)
          : [...prev.streamingPlatforms, value];
        return { ...prev, streamingPlatforms: platforms };
      });
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateGaming(profile);
      setSuccessMsg("Perfil gamer guardado correctamente");
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setSuccessMsg("Error al guardar perfil gamer");
      console.error(error);
    }
  };

  return (
    <section className="tab-content active" id="gaming-tab">
      <h2>Perfil de Gaming</h2>
      <form
        className="profile-form"
        id="gaming-form"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="form-group">
          <label htmlFor="gamer-tag">Gamer Tag</label>
          <input
            type="text"
            id="gamer-tag"
            name="gamerTag"
            value={profile.gamerTag}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="favorite-genre">Género Favorito</label>
          <select
            id="favorite-genre"
            name="favoriteGenre"
            value={profile.favoriteGenre}
            onChange={handleChange}
            required
          >
            {genres.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="skill-level">Nivel de Habilidad</label>
          <select
            id="skill-level"
            name="skillLevel"
            value={profile.skillLevel}
            onChange={handleChange}
            required
          >
            {skillLevels.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Plataformas de Streaming</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {streamingPlatformsList.map((p) => (
              <label
                key={p.value}
                className="checkbox-label"
                style={{ marginRight: 12 }}
              >
                <input
                  type="checkbox"
                  name="streamingPlatforms"
                  value={p.value}
                  checked={profile.streamingPlatforms.includes(p.value)}
                  onChange={handleChange}
                />
                <span className="checkmark" /> {p.label}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="favorite-games">Juegos Favoritos</label>
          <textarea
            id="favorite-games"
            name="favoriteGames"
            value={profile.favoriteGames}
            onChange={handleChange}
            rows={2}
            placeholder="Ej: The Witcher 3, Civilization VI, Stardew Valley..."
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
        {successMsg && <div className="success-message">{successMsg}</div>}
      </form>
    </section>
  );
}
