import React, { useState } from "react";
import "../../styles/components/redeem-modal.css";

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

function generateCouponId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `COUP-${timestamp}-${random}`.toUpperCase();
}

function calculateExpiryDate() {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 90);
  return expiryDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
}

export default function RedeemPointsModal({
  show,
  onClose,
  userPoints,
  userId,
  onSuccess,
}) {
  const [selectedTier, setSelectedTier] = useState(null);
  const [message, setMessage] = useState(null);

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    setMessage(null);
  };

  const handleConfirmRedeem = () => {
    if (!selectedTier) return;

    if (userPoints < selectedTier.pointsCost) {
      setMessage({
        type: "error",
        text: "No tienes suficientes puntos para canjear este cupón.",
      });
      return;
    }

    // Create new coupon with structure matching users.json
    const newCoupon = {
      id: generateCouponId(),
      name: selectedTier.name,
      value: selectedTier.couponValue,
      code: `${selectedTier.name.toUpperCase()}-${Date.now()
        .toString(36)
        .toUpperCase()}`,
      expiresAt: calculateExpiryDate(),
      isUsed: false,
    };

    // Get existing user coupons from localStorage
    const userCouponsKey = `userCoupons_${userId}`;
    const existingCoupons = JSON.parse(
      localStorage.getItem(userCouponsKey) || "[]"
    );

    // Add new coupon
    const updatedCoupons = [newCoupon, ...existingCoupons];
    localStorage.setItem(userCouponsKey, JSON.stringify(updatedCoupons));

    // Update user points
    const userPointsKey = `userPoints_${userId}`;
    const newPoints = userPoints - selectedTier.pointsCost;
    localStorage.setItem(userPointsKey, newPoints.toString());

    console.log("[RedeemPointsModal] Coupon created:", newCoupon);
    console.log(
      "[RedeemPointsModal] Points deducted:",
      selectedTier.pointsCost
    );
    console.log("[RedeemPointsModal] New points balance:", newPoints);

    // Call success callback to refresh parent component
    if (onSuccess) {
      onSuccess(newCoupon, newPoints);
    }

    // Show success message briefly then close
    setMessage({
      type: "success",
      text: `¡Cupón de $${selectedTier.couponValue.toLocaleString()} canjeado exitosamente!`,
    });

    setTimeout(() => {
      setSelectedTier(null);
      setMessage(null);
      onClose();
    }, 1500);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="redeem-modal-overlay" onClick={handleBackdropClick}>
      <div className="redeem-modal-content">
        <button
          className="redeem-modal-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        <div className="redeem-modal-header">
          <h3>Canjear Puntos por Cupón</h3>
          <p className="redeem-modal-points">
            Tienes <strong>{userPoints.toLocaleString()}</strong> puntos
            disponibles
          </p>
        </div>

        {message && (
          <div className={`redeem-modal-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="redeem-tiers-grid">
          {COUPON_TIERS.map((tier) => {
            const canAfford = userPoints >= tier.pointsCost;
            const isSelected = selectedTier?.name === tier.name;

            return (
              <div
                key={tier.name}
                className={`redeem-tier-card ${
                  canAfford ? "affordable" : "unaffordable"
                } ${isSelected ? "selected" : ""}`}
                onClick={() => canAfford && handleTierSelect(tier)}
                style={{ borderColor: tier.color }}
              >
                <div className="tier-icon">{tier.icon}</div>
                <div className="tier-name">{tier.name}</div>
                <div className="tier-value">
                  ${tier.couponValue.toLocaleString()}
                </div>
                <div className="tier-cost">
                  {tier.pointsCost.toLocaleString()} puntos
                </div>
                <div className="tier-description">{tier.description}</div>

                {/* {!canAfford && (
                  <div className="tier-insufficient">Puntos insuficientes</div>
                )} */}
              </div>
            );
          })}
        </div>

        {selectedTier && (
          <div className="redeem-modal-footer">
            <div className="redeem-confirmation">
              <p>
                <strong>
                  {selectedTier.icon} {selectedTier.name}
                </strong>{" "}
                - Cupón de ${selectedTier.couponValue.toLocaleString()}
              </p>
              <p className="redeem-details">
                Se descontarán{" "}
                <strong>{selectedTier.pointsCost.toLocaleString()}</strong>{" "}
                puntos. Te quedarán{" "}
                <strong>
                  {(userPoints - selectedTier.pointsCost).toLocaleString()}
                </strong>{" "}
                puntos.
              </p>
            </div>
            <button
              className="btn-redeem-confirm"
              onClick={handleConfirmRedeem}
            >
              Confirmar Canje
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
