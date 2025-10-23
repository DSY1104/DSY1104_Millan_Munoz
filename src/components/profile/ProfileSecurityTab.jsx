import React, { useState, useRef } from "react";

function ProfileSecurityTab() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState(null);
	const formRef = useRef(null);

	function clearFields() {
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
	}

	function handleSubmit(e) {
		e.preventDefault();
		setMessage(null);

		if (!currentPassword || !newPassword || !confirmPassword) {
			setMessage({ type: "error", text: "Todos los campos son obligatorios." });
			return;
		}
		if (newPassword !== confirmPassword) {
			setMessage({ type: "error", text: "Las contraseñas no coinciden." });
			return;
		}
		if (newPassword.length < 8) {
			setMessage({ type: "error", text: "La contraseña debe tener al menos 8 caracteres." });
			return;
		}
		// Simulación de cambio de contraseña exitoso
		clearFields();
		setMessage({ type: "success", text: "Contraseña cambiada correctamente." });
		setTimeout(() => setMessage(null), 4000);
	}

	return (
		<section className="tab-content active" id="security-tab">
			<h2>Configuración de Seguridad</h2>
			<form className="profile-form" id="security-form" onSubmit={handleSubmit} ref={formRef} autoComplete="off">
				<div className="security-section">
					<h3>Cambiar Contraseña</h3>
					<label htmlFor="current-password">Contraseña Actual</label>
					<input
						type="password"
						id="current-password"
						name="currentPassword"
						value={currentPassword}
						onChange={e => setCurrentPassword(e.target.value)}
						autoComplete="current-password"
					/>
					<label htmlFor="new-password">Nueva Contraseña</label>
					<input
						type="password"
						id="new-password"
						name="newPassword"
						value={newPassword}
						onChange={e => setNewPassword(e.target.value)}
						autoComplete="new-password"
					/>
					<label htmlFor="confirm-password">Confirmar Nueva Contraseña</label>
					<input
						type="password"
						id="confirm-password"
						name="confirmPassword"
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						autoComplete="new-password"
					/>
					<button className="btn btn-primary" id="change-password-btn" type="submit" style={{ marginTop: 16 }}>
						Cambiar Contraseña
					</button>
				</div>
				{message && (
					<div className={message.type === "success" ? "success-message" : "error-message"} style={{ marginTop: 16 }}>
						{message.text}
					</div>
				)}
			</form>
		</section>
	);
}

export default ProfileSecurityTab;

