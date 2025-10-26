import React, { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";

// Utilidades para localStorage (simples, inspiradas en storage.js)
const storage = {
  get: (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return localStorage.getItem(key);
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      localStorage.setItem(key, value);
    }
  },
};

// Configuración de tiers de cupones
const COUPON_TIERS = [
  {
    name: "Bronze",
    pointsCost: 1000,
    couponValue: 1000,
    color: "#CD7F32",
    icon: "🥉",
    description: "Cupón de $1.000 CLP",
  },
  {
    name: "Silver",
    pointsCost: 2500,
    couponValue: 2000,
    color: "#C0C0C0",
    icon: "🥈",
    description: "Cupón de $2.000 CLP",
  },
  {
    name: "Gold",
    pointsCost: 5000,
    couponValue: 5000,
    color: "#FFD700",
    icon: "🥇",
    description: "Cupón de $5.000 CLP",
  },
  {
    name: "Platinum",
    pointsCost: 10000,
    couponValue: 10000,
    color: "#E5E4E2",
    icon: "💎",
    description: "Cupón de $10.000 CLP",
  },
];

function getUserPoints() {
  return storage.get("userPoints") || 0;
}

function setUserPoints(points) {
  storage.set("userPoints", Math.max(0, points));
}

function getUserCoupons() {
  return storage.get("userCoupons") || [];
}

function setUserCoupons(coupons) {
  storage.set("userCoupons", coupons);
}

function generateCouponId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `COUP-${timestamp}-${random}`.toUpperCase();
}

function calculateExpiryDate() {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 90);
  return expiryDate.toISOString();
}

function getCouponStats(coupons) {
  const now = new Date();
  const available = coupons.filter(
    (c) => !c.isUsed && new Date(c.expiresAt || c.expiryDate) > now
  );
  const used = coupons.filter((c) => c.isUsed);
  const expired = coupons.filter(
    (c) => !c.isUsed && new Date(c.expiresAt || c.expiryDate) < now
  );
  return {
    total: coupons.length,
    available: available.length,
    used: used.length,
    expired: expired.length,
    totalValue: available.reduce((sum, c) => sum + c.value, 0),
    totalUsedValue: used.reduce((sum, c) => sum + c.value, 0),
    availableCoupons: available,
    usedCoupons: used,
    expiredCoupons: expired,
  };
}

function ProfileCouponsTab({ refreshTrigger, onOpenRedeemModal }) {
  const { user } = useUser();
  const [coupons, setCoupons] = useState([]);
  const [points, setPoints] = useState(0);
  const [filter, setFilter] = useState("available");

  // Load coupons from user data and localStorage
  const loadCoupons = () => {
    if (user) {
      // Merge coupons from users.json with localStorage coupons
      const userCouponsKey = `userCoupons_${user.id}`;
      const storedCoupons = JSON.parse(
        localStorage.getItem(userCouponsKey) || "[]"
      );
      const baseCoupons = user.coupons || [];

      // Combine both sources, remove duplicates by ID
      const allCoupons = [...storedCoupons, ...baseCoupons];
      const uniqueCoupons = Array.from(
        new Map(allCoupons.map((c) => [c.id, c])).values()
      );

      setCoupons(uniqueCoupons);

      // Get points from localStorage or user data
      const userPointsKey = `userPoints_${user.id}`;
      const storedPoints = localStorage.getItem(userPointsKey);
      const currentPoints =
        storedPoints !== null
          ? parseInt(storedPoints)
          : user.stats?.points || 0;
      setPoints(currentPoints);

      console.log("[ProfileCouponsTab] Loaded coupons:", uniqueCoupons);
      console.log("[ProfileCouponsTab] Current points:", currentPoints);
    }
  };

  // Update coupons and points when user changes or refreshTrigger changes
  useEffect(() => {
    loadCoupons();
  }, [user, refreshTrigger]);

  function handleFilter(tab) {
    setFilter(tab);
  }
  function getEmptyMessage(type) {
    switch (type) {
      case "available":
        return "No tienes cupones disponibles.<br/>¡Canjea tus puntos por cupones para empezar a ahorrar!";
      case "used":
        return "No has usado cupones aún.";
      case "expired":
        return "No tienes cupones expirados.";
      default:
        return "No hay cupones.";
    }
  }

  function renderCouponCard(coupon, type) {
    const expiryDate = coupon.expiresAt || coupon.expiryDate;
    const isExpired = new Date(expiryDate) < new Date();
    const daysUntilExpiry = Math.ceil(
      (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    // Get tier info based on coupon name or value
    const tierName = coupon.tier || coupon.name || "Bronze";
    const tierInfo =
      COUPON_TIERS.find((t) => t.name === tierName) || COUPON_TIERS[0];

    let statusText =
      type === "available"
        ? "Disponible"
        : type === "used"
        ? "Usado"
        : "Expirado";
    let expiryText = "";
    if (type === "available") {
      expiryText =
        daysUntilExpiry <= 7
          ? `Expira en ${daysUntilExpiry} día${
              daysUntilExpiry !== 1 ? "s" : ""
            }`
          : `Expira el ${new Date(expiryDate).toLocaleDateString()}`;
    } else if (type === "used") {
      const usedDate = coupon.usedDate || coupon.usedAt;
      expiryText = usedDate
        ? `Usado el ${new Date(usedDate).toLocaleDateString()}`
        : "Usado";
    } else {
      expiryText = `Expiró el ${new Date(expiryDate).toLocaleDateString()}`;
    }

    return (
      <div className={`coupon-card ${type}`} key={coupon.id}>
        <div className="coupon-header">
          <div className="coupon-tier">
            <span className="tier-icon">{tierInfo.icon}</span>
            <span className="tier-name">{tierName}</span>
          </div>
          <div className={`coupon-status ${type}`}>{statusText}</div>
        </div>
        <div className="coupon-value">
          <span className="coupon-amount">
            ${coupon.value.toLocaleString()}
          </span>
          <div className="coupon-description">
            Cupón de ${coupon.value.toLocaleString()} CLP
          </div>
        </div>
        <div className="coupon-details">
          <div className="coupon-id">{coupon.code || coupon.id}</div>
          <div className="coupon-expiry">{expiryText}</div>
        </div>
      </div>
    );
  }

  // Stats y cupones filtrados
  const stats = getCouponStats(coupons);
  const filteredCoupons =
    filter === "available"
      ? stats.availableCoupons
      : filter === "used"
      ? stats.usedCoupons
      : stats.expiredCoupons;

  return (
    <section className="tab-content active" id="coupons-tab">
      <h2>Mis Cupones</h2>
      {/* Estadísticas */}
      <div className="coupon-stats">
        <div className="stat-card">
          <div className="stat-value" id="available-coupons-count">
            {stats.available}
          </div>
          <div className="stat-label">Cupones Disponibles</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" id="total-coupon-value">
            ${stats.totalValue.toLocaleString()}
          </div>
          <div className="stat-label">Valor Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" id="used-coupons-count">
            {stats.used}
          </div>
          <div className="stat-label">Cupones Usados</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" id="total-saved-amount">
            ${stats.totalUsedValue.toLocaleString()}
          </div>
          <div className="stat-label">Total Ahorrado</div>
        </div>
      </div>

      {/* Tabs de filtro */}
      <div className="coupon-filter-tabs">
        <button
          className={`filter-tab${filter === "available" ? " active" : ""}`}
          onClick={() => handleFilter("available")}
          data-filter="available"
        >
          Disponibles <span id="available-count">{stats.available}</span>
        </button>
        <button
          className={`filter-tab${filter === "used" ? " active" : ""}`}
          onClick={() => handleFilter("used")}
          data-filter="used"
        >
          Usados <span id="used-count">{stats.used}</span>
        </button>
        <button
          className={`filter-tab${filter === "expired" ? " active" : ""}`}
          onClick={() => handleFilter("expired")}
          data-filter="expired"
        >
          Expirados <span id="expired-count">{stats.expired}</span>
        </button>
      </div>

      {/* Grilla de cupones */}
      <div className="coupon-filter-content active" id={`${filter}-coupons`}>
        <div className="coupons-grid" id={`${filter}-coupons-grid`}>
          {filteredCoupons.length === 0 ? (
            <div
              className="no-coupons-message"
              dangerouslySetInnerHTML={{ __html: getEmptyMessage(filter) }}
            />
          ) : (
            filteredCoupons.map((coupon) => renderCouponCard(coupon, filter))
          )}
        </div>
      </div>

      {/* Botón para canjear puntos por cupones */}
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <button className="btn btn-secondary" onClick={onOpenRedeemModal}>
          Canjear puntos por cupón
        </button>
      </div>
    </section>
  );
}

export default ProfileCouponsTab;
