import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import "/src/styles/pages/profile.css";
import ProfilePersonalTab from "../components/profile/ProfilePersonalTab";
import ProfilePreferencesTab from "../components/profile/ProfilePreferencesTab";
import ProfileAddressTab from "../components/profile/ProfileAddressTab";
import ProfileGamingTab from "../components/profile/ProfileGamingTab";
import ProfileCouponsTab from "../components/profile/ProfileCouponsTab";
import ProfileSecurityTab from "../components/profile/ProfileSecurityTab";
import RedeemPointsModal from "../components/modals/RedeemPointsModal";
import { IconUserCircle, IconCameraRotate } from "@tabler/icons-react";
import { UserProvider } from "../context/UserContext";

export default function UserProfile() {
  const userData = useLoaderData();
  const [activeTab, setActiveTab] = useState("personal");
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(
    userData.stats?.points || 0
  );
  const [refreshCoupons, setRefreshCoupons] = useState(0);

  // Extract profile data from loaded user
  const profile = {
    firstName: userData.personal?.firstName || "Usuario",
    lastName: userData.personal?.lastName || "Gamer",
    memberSince: userData.personal?.memberSince || "2024",
    level: userData.stats?.level || "Bronze",
    points: currentPoints,
    purchases: userData.stats?.purchases || 0,
    reviews: userData.stats?.reviews || 0,
    favorites: userData.stats?.favorites || 0,
  };

  const handleRedeemSuccess = (newCoupon, newPoints) => {
    setCurrentPoints(newPoints);
    setRefreshCoupons((prev) => prev + 1); // Trigger refresh in ProfileCouponsTab
    console.log(
      "[UserProfile] Coupon redeemed successfully, points updated:",
      newPoints
    );
  };

  // Calculate level progress
  const getLevelInfo = (level, points) => {
    const levels = {
      Bronze: { max: 1000, next: "Silver", icon: "🥉" },
      Silver: { max: 5000, next: "Gold", icon: "🥈" },
      Gold: { max: 10000, next: "Platinum", icon: "🥇" },
      Platinum: { max: 20000, next: "Diamond", icon: "💎" },
      Diamond: { max: Infinity, next: "Max", icon: "💠" },
    };
    return levels[level] || levels.Bronze;
  };

  const levelInfo = getLevelInfo(profile.level, profile.points);
  const progressPercentage =
    levelInfo.max !== Infinity
      ? Math.min((profile.points / levelInfo.max) * 100, 100)
      : 100;

  return (
    <UserProvider initialUser={userData}>
      <div>
        <main className="profile-main">
          <div className="profile-container">
            <section className="profile-header">
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  <IconUserCircle
                    id="profile-avatar-img"
                    size={92}
                    color="#fff"
                  />
                  <button
                    className="avatar-change-btn"
                    id="change-avatar-btn"
                    aria-label="Cambiar avatar"
                  >
                    <IconCameraRotate size={20} color="#fff" />
                  </button>
                </div>
                <div className="profile-info">
                  <h1 id="profile-display-name">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="profile-status" id="profile-status">
                    Miembro desde {profile.memberSince}
                  </p>
                  <div className="profile-level-section">
                    <p className="profile-level">
                      <span id="user-level-icon">{levelInfo.icon}</span>
                      <span id="user-level-name">{profile.level}</span>
                      <span className="points-display">
                        (<span id="user-points">{profile.points}</span> puntos)
                      </span>
                      <button
                        className="btn btn-secondary btn-small"
                        id="redeem-points-btn"
                        onClick={() => setShowRedeemModal(true)}
                      >
                        Canjear Puntos
                      </button>
                    </p>
                    <div className="level-progress">
                      <div className="progress-bar-container">
                        <div className="progress-bar" id="level-progress-bar">
                          <div
                            className="progress-fill"
                            id="level-progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="progress-text">
                          <span id="progress-points">{profile.points}</span> /
                          <span id="next-level-points">{levelInfo.max}</span>
                          <span className="next-level-name">
                            hacia{" "}
                            <span id="next-level-name">{levelInfo.next}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value" id="total-purchases">
                    {profile.purchases}
                  </span>
                  <span className="stat-label">Compras</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value" id="user-points-stat">
                    {profile.points}
                  </span>
                  <span className="stat-label">Puntos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value" id="wishlist-items">
                    {profile.favorites}
                  </span>
                  <span className="stat-label">Favoritos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value" id="reviews-count">
                    {profile.reviews}
                  </span>
                  <span className="stat-label">Reseñas</span>
                </div>
              </div>
            </section>

            <nav className="profile-tabs">
              <button
                className={`tab-btn${
                  activeTab === "personal" ? " active" : ""
                }`}
                onClick={() => setActiveTab("personal")}
              >
                Información Personal
              </button>
              <button
                className={`tab-btn${
                  activeTab === "preferences" ? " active" : ""
                }`}
                onClick={() => setActiveTab("preferences")}
              >
                Preferencias
              </button>
              <button
                className={`tab-btn${activeTab === "address" ? " active" : ""}`}
                onClick={() => setActiveTab("address")}
              >
                Dirección
              </button>
              <button
                className={`tab-btn${activeTab === "gaming" ? " active" : ""}`}
                onClick={() => setActiveTab("gaming")}
              >
                Perfil Gamer
              </button>
              <button
                className={`tab-btn${activeTab === "coupons" ? " active" : ""}`}
                onClick={() => setActiveTab("coupons")}
              >
                Mis Cupones
              </button>
              <button
                className={`tab-btn${
                  activeTab === "security" ? " active" : ""
                }`}
                onClick={() => setActiveTab("security")}
              >
                Seguridad
              </button>
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
                  <ProfileCouponsTab
                    refreshTrigger={refreshCoupons}
                    onOpenRedeemModal={() => setShowRedeemModal(true)}
                  />
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

        {/* Redeem Points Modal */}
        <RedeemPointsModal
          show={showRedeemModal}
          onClose={() => setShowRedeemModal(false)}
          userPoints={currentPoints}
          userId={userData.id}
          onSuccess={handleRedeemSuccess}
        />
      </div>
    </UserProvider>
  );
}
