/**
 * Shopping Cart UI Manager
 * Handles cart display, coupon application, and checkout process
 */

import { cart } from "./cart.js";
import { pointsSystem } from "../utils/points-system.js";

class CartUI {
  constructor() {
    this.cart = cart;
    this.pointsSystem = pointsSystem;
    this.selectedCoupon = null;

    this.init();
  }

  async init() {
    await this.pointsSystem.init();
    this.setupEventListeners();
    this.renderCart();
    this.updateSummary();
  }

  setupEventListeners() {
    // Coupon selection
    document
      .getElementById("select-coupon-btn")
      .addEventListener("click", () => {
        this.showCouponModal();
      });

    // Remove coupon
    document
      .getElementById("remove-coupon-btn")
      .addEventListener("click", () => {
        this.removeCoupon();
      });

    // Coupon modal
    document
      .getElementById("close-coupon-modal")
      .addEventListener("click", () => {
        this.hideCouponModal();
      });

    document
      .getElementById("cancel-coupon-selection")
      .addEventListener("click", () => {
        this.hideCouponModal();
      });

    // Checkout
    document.getElementById("checkout-btn").addEventListener("click", () => {
      this.processCheckout();
    });

    // Listen for cart changes
    document.addEventListener("cart:changed", () => {
      this.renderCart();
      this.updateSummary();
    });

    // Add some test products for demonstration
    // this.addTestProducts();
  }

  addTestProducts() {
    // Add some sample products if cart is empty
    const currentCart = this.cart.get();
    if (currentCart.items.length === 0) {
      this.cart.add({
        id: 1,
        name: "Gaming Headset Pro",
        price: 89990,
        image: "../../assets/image/icon/login.svg",
        category: "Periféricos",
      });

      this.cart.add({
        id: 2,
        name: "Mechanical Keyboard RGB",
        price: 129990,
        image: "../../assets/image/icon/login.svg",
        category: "Periféricos",
      });
    }
  }

  renderCart() {
    const cartData = this.cart.get();
    const cartItems = document.getElementById("cart-items");

    if (cartData.items.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <h3>Tu carrito está vacío</h3>
          <p>Explora nuestros productos y añade algunos al carrito</p>
          <a href="../products/catalog.html" class="btn btn-primary">Ver Productos</a>
        </div>
      `;
      return;
    }

    cartItems.innerHTML = cartData.items
      .map((item) => this.createCartItemHTML(item))
      .join("");

    // Add event listeners to quantity controls
    this.setupQuantityControls();
  }

  createCartItemHTML(item) {
    return `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toLocaleString()}</div>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button class="quantity-btn decrease-qty" data-id="${
              item.id
            }">-</button>
            <span class="quantity-display">${item.qty}</span>
            <button class="quantity-btn increase-qty" data-id="${
              item.id
            }">+</button>
          </div>
          <button class="remove-item-btn" data-id="${item.id}">🗑️</button>
        </div>
      </div>
    `;
  }

  setupQuantityControls() {
    // Decrease quantity
    document.querySelectorAll(".decrease-qty").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const item = this.cart.get().items.find((i) => i.id === id);
        if (item && item.qty > 1) {
          this.cart.updateQty(id, item.qty - 1);
        }
      });
    });

    // Increase quantity
    document.querySelectorAll(".increase-qty").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const item = this.cart.get().items.find((i) => i.id === id);
        if (item) {
          this.cart.updateQty(id, item.qty + 1);
        }
      });
    });

    // Remove item
    document.querySelectorAll(".remove-item-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        this.cart.remove(id);
      });
    });
  }

  updateSummary() {
  const totals = this.cart.totals();
  // DEBUG: Mostrar el contenido real del carrito y los totales
  console.log('[DEBUG] Carrito actual:', this.cart.get());
  console.log('[DEBUG] Totales calculados:', totals);

    // Update basic totals
  document.getElementById("cart-count").textContent = totals.count;
  // DEBUG: Mostrar el valor real en el DOM tras actualizar
  console.log('[DEBUG] Valor DOM cart-count:', document.getElementById("cart-count").textContent);
    document.getElementById(
      "cart-subtotal"
    ).textContent = `$${totals.subtotal.toLocaleString()}`;
    document.getElementById(
      "cart-total"
    ).textContent = `$${totals.total.toLocaleString()}`;

    // Update discount display
    if (totals.appliedCoupon) {
      document.getElementById("applied-coupon").style.display = "block";
      document.getElementById("applied-coupon-icon").textContent =
        totals.appliedCoupon.icon;
      document.getElementById(
        "applied-coupon-name"
      ).textContent = `Cupón ${totals.appliedCoupon.tier}`;
      document.getElementById(
        "applied-coupon-discount"
      ).textContent = `-$${totals.appliedCoupon.value.toLocaleString()}`;

      document.getElementById("discount-line").style.display = "flex";
      document.getElementById(
        "discount-amount"
      ).textContent = `-$${totals.discount.toLocaleString()}`;

      document.getElementById("select-coupon-btn").style.display = "none";
    } else {
      document.getElementById("applied-coupon").style.display = "none";
      document.getElementById("discount-line").style.display = "none";
      document.getElementById("select-coupon-btn").style.display =
        "inline-block";
    }

    // Calculate and display points to earn
    const pointsCalculation = this.pointsSystem.calculatePointsFromPurchase(
      totals.total
    );
    document.getElementById("points-to-earn").textContent =
      pointsCalculation.points.toLocaleString();

    // Enable/disable checkout button
    const checkoutBtn = document.getElementById("checkout-btn");
    checkoutBtn.disabled = totals.count === 0;
  }

  showCouponModal() {
    const modal = document.getElementById("coupon-modal");
    const availableCoupons = this.pointsSystem.getUserCoupons(false);
    const couponsContainer = document.getElementById("available-coupons");

    if (availableCoupons.length === 0) {
      couponsContainer.innerHTML = `
        <div class="no-coupons">
          <p>No tienes cupones disponibles.</p>
          <p>Ve a tu perfil para canjear puntos por cupones.</p>
          <a href="../user/profile.html" class="btn btn-primary">Ir al Perfil</a>
        </div>
      `;
    } else {
      couponsContainer.innerHTML = availableCoupons
        .map((coupon) => this.createCouponOptionHTML(coupon))
        .join("");
      this.setupCouponSelection();
    }

    modal.classList.add("active");
  }

  hideCouponModal() {
    document.getElementById("coupon-modal").classList.remove("active");
  }

  createCouponOptionHTML(coupon) {
    const totals = this.cart.totals();
    const canUse = totals.subtotal >= coupon.value; // Coupon can't be worth more than subtotal
    const daysUntilExpiry = Math.ceil(
      (new Date(coupon.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    return `
      <div class="coupon-option ${
        !canUse ? "unavailable" : ""
      }" data-coupon-id="${coupon.id}">
        <div class="coupon-option-header">
          <div class="coupon-tier">
            <span class="tier-icon">${coupon.icon}</span>
            <span class="tier-name">${coupon.tier}</span>
          </div>
          <div class="coupon-value">$${coupon.value.toLocaleString()}</div>
        </div>
        <div class="coupon-expiry">
          ${
            daysUntilExpiry > 7
              ? `Expira el ${new Date(coupon.expiryDate).toLocaleDateString()}`
              : `⚠️ Expira en ${daysUntilExpiry} día${
                  daysUntilExpiry !== 1 ? "s" : ""
                }`
          }
        </div>
        ${
          !canUse
            ? '<div style="color: #dc3545; font-size: 0.8rem; margin-top: 5px;">Monto mínimo no alcanzado</div>'
            : ""
        }
      </div>
    `;
  }

  setupCouponSelection() {
    document
      .querySelectorAll(".coupon-option:not(.unavailable)")
      .forEach((option) => {
        option.addEventListener("click", (e) => {
          const couponId = e.currentTarget.dataset.couponId;
          this.applyCoupon(couponId);
        });
      });
  }

  applyCoupon(couponId) {
    const result = this.cart.applyCoupon(couponId);

    if (result.success) {
      this.hideCouponModal();
      this.updateSummary();
      this.showMessage(
        `Cupón de $${result.discountAmount.toLocaleString()} aplicado exitosamente!`,
        "success"
      );
    } else {
      this.showMessage(result.error, "error");
    }
  }

  removeCoupon() {
    const result = this.cart.removeCoupon();

    if (result.success) {
      this.updateSummary();
      this.showMessage("Cupón removido", "info");
    }
  }

  processCheckout() {
    const totals = this.cart.totals();

    if (totals.count === 0) {
      this.showMessage("Tu carrito está vacío", "error");
      return;
    }

    const result = this.cart.checkout("credit");

    if (result.success) {
      this.showMessage(
        `¡Compra realizada exitosamente! 
         Total: $${result.purchase.total.toLocaleString()}
         ${
           result.purchase.discount > 0
             ? `Descuento aplicado: $${result.purchase.discount.toLocaleString()}`
             : ""
         }
         Puntos ganados: ${result.pointsResult.pointsEarned.toLocaleString()}`,
        "success"
      );

      // Clear the cart display
      this.renderCart();
      this.updateSummary();

      // Redirect to profile or success page after a delay
      setTimeout(() => {
        window.location.href = "../user/profile.html";
      }, 3000);
    } else {
      this.showMessage(result.error, "error");
    }
  }

  showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll(".cart-message");
    existingMessages.forEach((msg) => msg.remove());

    // Create message element
    const messageEl = document.createElement("div");
    messageEl.className = `cart-message ${type}`;
    messageEl.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 1000;
      max-width: 400px;
      color: #fff;
      font-weight: 500;
    `;

    switch (type) {
      case "success":
        messageEl.style.background = "rgba(40, 167, 69, 0.9)";
        break;
      case "error":
        messageEl.style.background = "rgba(220, 53, 69, 0.9)";
        break;
      case "info":
        messageEl.style.background = "rgba(23, 162, 184, 0.9)";
        break;
    }

    messageEl.innerHTML = message.replace(/\n/g, "<br>");
    document.body.appendChild(messageEl);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    new CartUI();
  }, 500);
});
