import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../../hooks/useUser";

export default function ProfilePersonalTab() {
  const { user, updatePersonal } = useUser();
  const [profile, setProfile] = useState(user?.personal || {});
  const [successMsg, setSuccessMsg] = useState("");
  const timeoutRef = useRef();

  // Update form when user data changes
  useEffect(() => {
    if (user?.personal) {
      setProfile(user.personal);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePersonal(profile);
      setSuccessMsg("Información personal guardada correctamente");
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setSuccessMsg("Error al guardar la información");
      console.error(error);
    }
  };

  return (
    <section className="tab-content active" id="personal-tab">
      <h2>Información Personal</h2>
      <form
        className="profile-form"
        id="personal-form"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="form-group">
          <label htmlFor="first-name">Nombre</label>
          <input
            type="text"
            id="first-name"
            name="firstName"
            value={profile.firstName || ""}
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
            value={profile.lastName || ""}
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
            value={user?.email || ""}
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
            value={profile.phone || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthdate">Fecha de Nacimiento</label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={profile.birthdate || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Biografía</label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
            rows={3}
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
