import React, { useState, useEffect } from "react";
import "/src/styles/pages/profile.css";
import ProfilePersonalTab from "../components/profile/ProfilePersonalTab";
import ProfilePreferencesTab from "../components/profile/ProfilePreferencesTab";
import ProfileAddressTab from "../components/profile/ProfileAddressTab";
import ProfileGamingTab from "../components/profile/ProfileGamingTab";
import ProfileCouponsTab from "../components/profile/ProfileCouponsTab";
import ProfileSecurityTab from "../components/profile/ProfileSecurityTab";


export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState({
    firstName: "Usuario",
    lastName: "Gamer",
    memberSince: "2024",
    level: "Bronze",
    points: 0,
    purchases: 0,
    reviews: 0,
    favorites: 0,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile((prev) => ({
          ...prev,
          ...parsed,
        }));
      }
    } catch {
      // ignore
    }
  }, [activeTab]);

  return (
    <div>
      <main className="profile-main">
        <div className="profile-container">
          <section className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <img
                  id="profile-avatar-img"
                  src="../../assets/image/icon/login.svg"
                  alt="Avatar del usuario"
                />
                <button
                  className="avatar-change-btn"
                  id="change-avatar-btn"
                  aria-label="Cambiar avatar"
                >
                  📷
                </button>
              </div>
              <div className="profile-info">
                <h1 id="profile-display-name">{profile.firstName} {profile.lastName}</h1>
                <p className="profile-status" id="profile-status">
                  Miembro desde {profile.memberSince || "2024"}
                </p>
                <div className="profile-level-section">
                  <p className="profile-level">
                    <span id="user-level-icon">🥉</span>
                    <span id="user-level-name">{profile.level || "Bronze"}</span>
                    <span className="points-display">
                      (<span id="user-points">{profile.points ?? 0}</span> puntos)
                    </span>
                    <button className="btn btn-secondary btn-small" id="redeem-points-btn">
                      Canjear Puntos
                    </button>
                  </p>
                  <div className="level-progress">
                    <div className="progress-bar-container">
                      <div className="progress-bar" id="level-progress-bar">
                        <div className="progress-fill" id="level-progress-fill"></div>
                      </div>
                      <div className="progress-text">
                        <span id="progress-points">{profile.points ?? 0}</span> /
                        <span id="next-level-points">1000</span>
                        <span className="next-level-name">
                          hacia <span id="next-level-name">Silver</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value" id="total-purchases">{profile.purchases ?? 0}</span>
                <span className="stat-label">Compras</span>
              </div>
              <div className="stat-item">
                <span className="stat-value" id="user-points-stat">{profile.points ?? 0}</span>
                <span className="stat-label">Puntos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value" id="wishlist-items">{profile.favorites ?? 0}</span>
                <span className="stat-label">Favoritos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value" id="reviews-count">{profile.reviews ?? 0}</span>
                <span className="stat-label">Reseñas</span>
              </div>
            </div>
          </section>

          
          <nav className="profile-tabs">
            <button className={`tab-btn${activeTab === "personal" ? " active" : ""}`} onClick={() => setActiveTab("personal")}>
              Información Personal
            </button>
            <button className={`tab-btn${activeTab === "preferences" ? " active" : ""}`} onClick={() => setActiveTab("preferences")}>Preferencias</button>
            <button className={`tab-btn${activeTab === "address" ? " active" : ""}`} onClick={() => setActiveTab("address")}>Dirección</button>
            <button className={`tab-btn${activeTab === "gaming" ? " active" : ""}`} onClick={() => setActiveTab("gaming")}>Perfil Gamer</button>
            <button className={`tab-btn${activeTab === "coupons" ? " active" : ""}`} onClick={() => setActiveTab("coupons")}>Mis Cupones</button>
            <button className={`tab-btn${activeTab === "security" ? " active" : ""}`} onClick={() => setActiveTab("security")}>Seguridad</button>
          </nav>

          {/* Contenido de tabs */}
          <div className="profile-content">
            {activeTab === "personal" && (
              <section className="tab-content active" id="personal-tab">
                <ProfilePersonalTab />
              </section>
            )}
            {activeTab === "preferences" && (
              <section className="tab-content active" id="preferences-tab">
                <ProfilePreferencesTab />
              </section>
            )}
            {activeTab === "address" && (
              <section className="tab-content active" id="address-tab">
                <ProfileAddressTab />
              </section>
            )}
            {activeTab === "gaming" && (
              <section className="tab-content active" id="gaming-tab">
                <ProfileGamingTab />
              </section>
            )}
            {activeTab === "coupons" && (
              <section className="tab-content active" id="coupons-tab">
                <ProfileCouponsTab />

              </section>
            )}
            {activeTab === "security" && (
              <section className="tab-content active" id="security-tab">
                <ProfileSecurityTab />
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
