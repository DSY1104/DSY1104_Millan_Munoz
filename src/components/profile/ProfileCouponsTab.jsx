import React, { useEffect, useState } from "react";

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
	const available = coupons.filter(c => !c.isUsed && new Date(c.expiryDate) > now);
	const used = coupons.filter(c => c.isUsed);
	const expired = coupons.filter(c => !c.isUsed && new Date(c.expiryDate) < now);
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

function ProfileCouponsTab() {
	const [coupons, setCoupons] = useState([]);
	const [points, setPoints] = useState(0);
	const [filter, setFilter] = useState("available");
	const [message, setMessage] = useState(null);
	const [showRedeem, setShowRedeem] = useState(false);
	const [selectedTier, setSelectedTier] = useState(null);

	useEffect(() => {
		setCoupons(getUserCoupons());
		setPoints(getUserPoints());
	}, []);

	// Actualiza stats y cupones tras canje o uso
	function refreshData() {
		setCoupons(getUserCoupons());
		setPoints(getUserPoints());
	}

	function handleFilter(tab) {
		setFilter(tab);
	}

	function handleRedeemClick() {
		setShowRedeem(true);
		setSelectedTier(null);
	}

	function handleTierSelect(tier) {
		setSelectedTier(tier);
	}

	function handleConfirmRedeem() {
		if (!selectedTier) return;
		if (points < selectedTier.pointsCost) {
			setMessage({ type: "error", text: "No tienes suficientes puntos." });
			return;
		}
		// Crear cupón
		const newCoupon = {
			id: generateCouponId(),
			tier: selectedTier.name,
			value: selectedTier.couponValue,
			pointsCost: selectedTier.pointsCost,
			issuedDate: new Date().toISOString(),
			expiryDate: calculateExpiryDate(),
			isUsed: false,
			usedDate: null,
			color: selectedTier.color,
			icon: selectedTier.icon,
			description: selectedTier.description,
		};
		const updatedCoupons = [newCoupon, ...coupons];
		setUserCoupons(updatedCoupons);
		setUserPoints(points - selectedTier.pointsCost);
		setMessage({
			type: "success",
			text: `¡Cupón de $${selectedTier.couponValue.toLocaleString()} canjeado exitosamente! Se descontaron ${selectedTier.pointsCost.toLocaleString()} puntos.`,
		});
		setShowRedeem(false);
		setSelectedTier(null);
		setTimeout(() => setMessage(null), 4000);
		refreshData();
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
		const isExpired = new Date(coupon.expiryDate) < new Date();
		const daysUntilExpiry = Math.ceil((new Date(coupon.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
		let statusText = type === "available" ? "Disponible" : type === "used" ? "Usado" : "Expirado";
		let expiryText = "";
		if (type === "available") {
			expiryText = daysUntilExpiry <= 7 ? `Expira en ${daysUntilExpiry} día${daysUntilExpiry !== 1 ? "s" : ""}` : `Expira el ${new Date(coupon.expiryDate).toLocaleDateString()}`;
		} else if (type === "used") {
			expiryText = `Usado el ${new Date(coupon.usedDate).toLocaleDateString()}`;
		} else {
			expiryText = `Expiró el ${new Date(coupon.expiryDate).toLocaleDateString()}`;
		}
		return (
			<div className={`coupon-card ${type}`} key={coupon.id}>
				<div className="coupon-header">
					<div className="coupon-tier">
						<span className="tier-icon">{coupon.icon}</span>
						<span className="tier-name">{coupon.tier}</span>
					</div>
					<div className={`coupon-status ${type}`}>{statusText}</div>
				</div>
				<div className="coupon-value">
					<span className="coupon-amount">${coupon.value.toLocaleString()}</span>
					<div className="coupon-description">{coupon.description}</div>
				</div>
				<div className="coupon-details">
					<div className="coupon-id">{coupon.id}</div>
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
			{message && (
				<div className={`coupon-message ${message.type}`}>{message.text}</div>
			)}
			{/* Estadísticas */}
			<div className="coupon-stats">
				<div className="stat-card">
					<div className="stat-value" id="available-coupons-count">{stats.available}</div>
					<div className="stat-label">Cupones Disponibles</div>
				</div>
				<div className="stat-card">
					<div className="stat-value" id="total-coupon-value">${stats.totalValue.toLocaleString()}</div>
					<div className="stat-label">Valor Total</div>
				</div>
				<div className="stat-card">
					<div className="stat-value" id="used-coupons-count">{stats.used}</div>
					<div className="stat-label">Cupones Usados</div>
				</div>
				<div className="stat-card">
					<div className="stat-value" id="total-saved-amount">${stats.totalUsedValue.toLocaleString()}</div>
					<div className="stat-label">Total Ahorrado</div>
				</div>
			</div>

			{/* Tabs de filtro */}
			<div className="coupon-filter-tabs">
				<button className={`filter-tab${filter === "available" ? " active" : ""}`} onClick={() => handleFilter("available")} data-filter="available">
					Disponibles <span id="available-count">{stats.available}</span>
				</button>
				<button className={`filter-tab${filter === "used" ? " active" : ""}`} onClick={() => handleFilter("used")} data-filter="used">
					Usados <span id="used-count">{stats.used}</span>
				</button>
				<button className={`filter-tab${filter === "expired" ? " active" : ""}`} onClick={() => handleFilter("expired")} data-filter="expired">
					Expirados <span id="expired-count">{stats.expired}</span>
				</button>
			</div>

			{/* Grilla de cupones */}
			<div className="coupon-filter-content active" id={`${filter}-coupons`}>
				<div className="coupons-grid" id={`${filter}-coupons-grid`}>
					{filteredCoupons.length === 0 ? (
						<div className="no-coupons-message" dangerouslySetInnerHTML={{ __html: getEmptyMessage(filter) }} />
					) : (
						filteredCoupons.map((coupon) => renderCouponCard(coupon, filter))
					)}
				</div>
			</div>

			{/* Botón para canjear puntos por cupones */}
			<div style={{ marginTop: 32, textAlign: "center" }}>
				<button className="btn btn-secondary" onClick={handleRedeemClick}>
					Canjear puntos por cupón
				</button>
			</div>

			{/* Modal de canje de cupones */}
			{showRedeem && (
				<div className="modal redeem-modal" style={{ display: "block" }}>
					<div className="modal-content" style={{ maxWidth: 480, margin: "40px auto", background: "#fff", borderRadius: 8, padding: 24, position: "relative" }}>
						<button className="modal-close" style={{ position: "absolute", top: 8, right: 12 }} onClick={() => setShowRedeem(false)}>&times;</button>
						<h3>Canjear puntos por cupón</h3>
						<div style={{ marginBottom: 16 }}>Tienes <strong>{points.toLocaleString()}</strong> puntos.</div>
						<div className="coupon-tiers-grid" style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
							{COUPON_TIERS.map((tier) => {
								const canAfford = points >= tier.pointsCost;
								return (
									<div key={tier.name} className={`tier-option${canAfford ? " affordable" : " unaffordable"}`} style={{ border: `2px solid ${tier.color}`, borderRadius: 8, padding: 16, minWidth: 120, textAlign: "center", background: canAfford ? "#f8fff8" : "#f8f8f8", opacity: canAfford ? 1 : 0.6 }}>
										<div className="tier-header" style={{ fontSize: 24 }}>
											<span className="tier-icon">{tier.icon}</span>
											<span className="tier-name" style={{ marginLeft: 8 }}>{tier.name}</span>
										</div>
										<div className="tier-coupon-value" style={{ fontWeight: "bold", fontSize: 18, margin: "8px 0" }}>${tier.couponValue.toLocaleString()}</div>
										<div className="tier-points-cost" style={{ color: "#888", fontSize: 14 }}>{tier.pointsCost.toLocaleString()} puntos</div>
										<button className="tier-select-btn btn btn-primary" style={{ marginTop: 8 }} disabled={!canAfford} onClick={() => handleTierSelect(tier)}>
											{canAfford ? "Seleccionar" : "Puntos insuficientes"}
										</button>
									</div>
								);
							})}
						</div>
						{/* Confirmación de canje */}
						{selectedTier && (
							<div style={{ marginTop: 24, borderTop: "1px solid #eee", paddingTop: 16 }}>
								<h4>Confirmar canje</h4>
								<div style={{ fontSize: 18, marginBottom: 8 }}>
									{selectedTier.icon} <strong>{selectedTier.name}</strong> - Cupón de ${selectedTier.couponValue.toLocaleString()}
								</div>
								<div style={{ color: "#888", marginBottom: 8 }}>{selectedTier.description}</div>
								<div>Se descontarán <strong>{selectedTier.pointsCost.toLocaleString()}</strong> puntos.<br />Puntos restantes: <strong>{(points - selectedTier.pointsCost).toLocaleString()}</strong></div>
								<button className="btn btn-success" style={{ marginTop: 12 }} onClick={handleConfirmRedeem}>Canjear</button>
							</div>
						)}
					</div>
				</div>
			)}
		</section>
	);
}

export default ProfileCouponsTab;
