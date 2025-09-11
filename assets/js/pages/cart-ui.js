/**
 * Shopping Cart UI Manager
 * Handles cart display, coupon application, and checkout process
 */

import { cart } from "./cart.js";
import { pointsSystem } from "../utils/points-system.js";

class CartUI {
  // Cierra el modal de selección de cupones
  hideCouponModal() {
    const modal = document.getElementById("coupon-modal");
    if (modal) {
      modal.classList.remove("active");
    }
  }
  // Renderiza el HTML de una opción de cupón para el modal
  createCouponOptionHTML(coupon) {
    // Puedes personalizar el diseño según los datos de tu cupón
    return `
      <div class="coupon-option" data-coupon-id="${coupon.id}" tabindex="0">
        <div class="coupon-main">
          <span class="coupon-icon">${coupon.icon || "🎫"}</span>
          <span class="coupon-tier">${coupon.tier || ""}</span>
          <span class="coupon-value">$${
            coupon.value ? coupon.value.toLocaleString() : ""
          }</span>
        </div>
        <div class="coupon-description">${coupon.description || ""}</div>
        <div class="coupon-expiry">${
          coupon.expiryDate
            ? `Válido hasta ${new Date(coupon.expiryDate).toLocaleDateString()}`
            : ""
        }</div>
      </div>
    `;
  }
  setupEmptyCartButton() {
    const btn = document.getElementById("empty-cart-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      this.showEmptyCartModal();
    });
  }

  showEmptyCartModal() {
    // Crear modal accesible si no existe
    let modal = document.getElementById("empty-cart-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "empty-cart-modal";
      modal.className = "modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.innerHTML = `
        <div class="modal-content" tabindex="-1">
          <div class="modal-header">
            <h3 id="empty-cart-modal-title">¿Vaciar carrito?</h3>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas vaciar tu carrito? Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-actions">
            <button class="btn btn-danger" id="confirm-empty-cart">Vaciar</button>
            <button class="btn btn-secondary" id="cancel-empty-cart">Cancelar</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.style.display = "flex";
    modal.querySelector(".modal-content").focus();

    // Cerrar con ESC
    const escListener = (e) => {
      if (e.key === "Escape") this.hideEmptyCartModal();
    };
    document.addEventListener("keydown", escListener);

    // Botones
    modal.querySelector("#cancel-empty-cart").onclick = () => {
      this.hideEmptyCartModal();
      document.removeEventListener("keydown", escListener);
    };
    modal.querySelector("#confirm-empty-cart").onclick = () => {
      this.cart.clear();
      this.renderCart();
      this.updateSummary();
      this.hideEmptyCartModal();
      this.showMessage("Carrito vaciado", "info");
      document.removeEventListener("keydown", escListener);
    };
  }

  hideEmptyCartModal() {
    const modal = document.getElementById("empty-cart-modal");
    if (modal) modal.style.display = "none";
  }
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
    this.setupEmptyCartButton();
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
    const emptyBtn = document.getElementById("empty-cart-btn");

    if (cartData.items.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <h3>Tu carrito está vacío</h3>
          <p>Explora nuestros productos y añade algunos al carrito</p>
          <a href="../products/catalog.html" class="btn btn-primary">Ver Productos</a>
        </div>
      `;
      if (emptyBtn) emptyBtn.style.display = "none";
      return;
    }

    cartItems.innerHTML = cartData.items
      .map((item) => this.createCartItemHTML(item))
      .join("");

    if (emptyBtn) emptyBtn.style.display = "block";

    // Add event listeners to quantity controls
    this.setupQuantityControls();
  }

  createCartItemHTML(item) {
    return `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${
      item.name
    }" class="cart-item-image" onerror="this.onerror=null;this.src='/assets/image/products/fallback.png';">
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
          this.renderCart();
          this.updateSummary();
        }
      });
    });

    // Increase quantity
    document.querySelectorAll(".increase-qty").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = parseInt(e.target.dataset.id);
        const item = this.cart.get().items.find((i) => i.id === id);
        if (!item) return;

        // Obtener stock actual del producto desde el catálogo
        let stock = null;
        try {
          const res = await fetch("../../assets/data/products.json");
          const products = await res.json();
          const prod = products.find(
            (p) => p.code == item.id || p.code == item.code
          );
          stock = prod ? prod.stock : null;
        } catch (err) {
          stock = null;
        }

        if (stock !== null && item.qty + 1 > stock) {
          this.showMessage(
            `No puedes añadir más de ${stock} unidades.`,
            "error"
          );
          return;
        }
        this.cart.updateQty(id, item.qty + 1);
        this.renderCart();
        this.updateSummary();
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
    console.log("[DEBUG] Carrito actual:", this.cart.get());
    console.log("[DEBUG] Totales calculados:", totals);

    // Update basic totals
    document.getElementById("cart-count").textContent = totals.count;
    // DEBUG: Mostrar el valor real en el DOM tras actualizar
    console.log(
      "[DEBUG] Valor DOM cart-count:",
      document.getElementById("cart-count").textContent
    );
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

  showEmptyCartModal() {
    // Crear modal accesible si no existe
    let modal = document.getElementById("empty-cart-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "empty-cart-modal";
      modal.className = "modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-labelledby", "empty-cart-modal-title");
      modal.setAttribute("aria-describedby", "empty-cart-modal-desc");
      modal.innerHTML = `
        <div class="modal-content" tabindex="-1">
          <div class="modal-header">
            <h3 id="empty-cart-modal-title">¿Vaciar carrito?</h3>
          </div>
          <div class="modal-body">
            <p id="empty-cart-modal-desc">¿Estás seguro de que deseas vaciar tu carrito? Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-actions">
            <button class="btn btn-danger" id="confirm-empty-cart">Vaciar</button>
            <button class="btn btn-secondary" id="cancel-empty-cart">Cancelar</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.style.display = "flex";

    // Foco inicial en el botón "Vaciar"
    setTimeout(() => {
      const vaciarBtn = modal.querySelector("#confirm-empty-cart");
      if (vaciarBtn) vaciarBtn.focus();
    }, 10);

    // Foco atrapado dentro del modal
    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableEls = modal.querySelectorAll(focusableSelectors);
    const firstFocusable = focusableEls[0];
    const lastFocusable = focusableEls[focusableEls.length - 1];
    const trapFocus = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };
    modal.addEventListener("keydown", trapFocus);

    // Cerrar con ESC
    const escListener = (e) => {
      if (e.key === "Escape") this.hideEmptyCartModal();
    };
    document.addEventListener("keydown", escListener);

    // Botones
    modal.querySelector("#cancel-empty-cart").onclick = () => {
      this.hideEmptyCartModal();
      document.removeEventListener("keydown", escListener);
      modal.removeEventListener("keydown", trapFocus);
    };
    modal.querySelector("#confirm-empty-cart").onclick = () => {
      this.cart.clear();
      this.renderCart();
      this.updateSummary();
      this.hideEmptyCartModal();
      this.showMessage("Carrito vaciado", "info");
      document.removeEventListener("keydown", escListener);
      modal.removeEventListener("keydown", trapFocus);
    };
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

  async processCheckout() {
    const totals = this.cart.totals();

    if (totals.count === 0) {
      this.showMessage("Tu carrito está vacío", "error");
      return;
    }

    const result = await this.cart.checkout("credit");

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
      this.showMessage(
        result.error || "Ocurrió un error al procesar el pago.",
        "error"
      );
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
  // Esperar hasta que #cart-items exista en el DOM antes de instanciar CartUI
  function initWhenReady() {
    if (document.getElementById("cart-items")) {
      new CartUI();
    } else {
      setTimeout(initWhenReady, 50);
    }
  }
  initWhenReady();
});
