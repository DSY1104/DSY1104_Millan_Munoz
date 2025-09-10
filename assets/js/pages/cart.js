// Cart CRUD module using storage utility
import { namespaced } from "../../js/utils/storage.js";
import { pointsSystem } from "../utils/points-system.js";

// Namespaced local storage for cart
const cartStore = namespaced("cart", "local");

// Shape: { items: [ { id, name, price, qty, image, metadata } ] }
function initCart() {
  if (!cartStore.has("data")) {
    cartStore.set("data", { items: [] });
  }
  return cartStore.get("data");
}

function getCart() {
  let cart = cartStore.get("data");
  if (!cart || typeof cart !== "object" || !Array.isArray(cart.items)) {
    cart = { items: [] };
    cartStore.set("data", cart);
  }
  return cart;
}

function saveCart(cart) {
  cartStore.set("data", cart);
  return cart;
}

function addItem(item) {
  if (!item || item.id == null) throw new Error("Item must have an id");
  const cart = getCart();
  const existing = cart.items.find((i) => i.id === item.id);
  if (existing) {
    existing.qty += item.qty || 1;
  } else {
    cart.items.push({ qty: 1, ...item, qty: item.qty || 1 });
  }
  return saveCart(cart);
}

function updateItemQuantity(id, qty) {
  const cart = getCart();
  const item = cart.items.find((i) => i.id === id);
  if (!item) return cart;
  if (qty <= 0) {
    cart.items = cart.items.filter((i) => i.id !== id);
  } else {
    item.qty = qty;
  }
  return saveCart(cart);
}

function updateItem(id, updater) {
  const cart = getCart();
  const idx = cart.items.findIndex((i) => i.id === id);
  if (idx === -1) return cart;
  const current = cart.items[idx];
  const next =
    typeof updater === "function"
      ? updater(current)
      : { ...current, ...updater };
  cart.items[idx] = { ...current, ...next, id: current.id };
  return saveCart(cart);
}

function removeItem(id) {
  const cart = getCart();
  const before = cart.items.length;
  cart.items = cart.items.filter((i) => i.id !== id);
  if (cart.items.length !== before) {
    saveCart(cart);
    // Disparar evento para actualizar la UI
    document.dispatchEvent(new CustomEvent("cart:changed", { detail: cart }));
  }
  return cart;
}

function clearCart() {
  return saveCart({ items: [] });
}

function getTotals() {
  const cart = getCart();
  const count = cart.items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // Get applied coupon if any
  const appliedCoupon = cart.appliedCoupon || null;
  let discount = 0;

  if (appliedCoupon) {
    discount = appliedCoupon.value;
  }

  const total = Math.max(0, subtotal - discount);

  return {
    count,
    subtotal,
    discount,
    total,
    appliedCoupon,
  };
}

function applyCoupon(couponId) {
  const result = pointsSystem.useCoupon(couponId);

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  const cart = getCart();
  cart.appliedCoupon = result.coupon;
  saveCart(cart);

  return {
    success: true,
    coupon: result.coupon,
    discountAmount: result.discountAmount,
  };
}

function removeCoupon() {
  const cart = getCart();
  const removedCoupon = cart.appliedCoupon;

  if (removedCoupon) {
    // Restore the coupon as unused (since we're removing it before checkout)
    const coupons = pointsSystem.getUserCoupons();
    const couponIndex = coupons.findIndex((c) => c.id === removedCoupon.id);
    if (couponIndex !== -1) {
      coupons[couponIndex].isUsed = false;
      coupons[couponIndex].usedDate = null;
      localStorage.setItem("userCoupons", JSON.stringify(coupons));
    }
  }

  delete cart.appliedCoupon;
  saveCart(cart);

  return {
    success: true,
    removedCoupon,
  };
}

// Process checkout and award points
async function processCheckout(paymentMethod = "credit") {
  try {
    const cart = getCart();
    if (cart.items.length === 0) {
      throw new Error("El carrito está vacío");
    }

    const { count, subtotal, total, appliedCoupon } = getTotals();

    // Process points for the final amount (after coupon discount)
    const purchaseResult = pointsSystem.processPurchase(total, cart.items);

    // Create purchase record
    const purchase = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      items: [...cart.items],
      subtotal,
      discount: appliedCoupon ? appliedCoupon.value : 0,
      total,
      count,
      paymentMethod,
      appliedCoupon: appliedCoupon ? { ...appliedCoupon } : null,
      pointsEarned: purchaseResult.pointsEarned,
      status: "completed",
    };

    // Save purchase history
    const purchases = JSON.parse(
      localStorage.getItem("purchaseHistory") || "[]"
    );
    purchases.unshift(purchase);
    localStorage.setItem("purchaseHistory", JSON.stringify(purchases));

    // Update total purchases count
    const totalPurchases =
      parseInt(localStorage.getItem("totalPurchases") || "0") + 1;
    localStorage.setItem("totalPurchases", totalPurchases.toString());

    // Clear cart after successful purchase
    clearCart();

    return {
      success: true,
      purchase,
      pointsResult: purchaseResult,
    };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Sync across tabs (optional)
window.addEventListener("storage", (e) => {
  if (e.key === "cart:data") {
    // Could emit a custom event for UI updates
    document.dispatchEvent(
      new CustomEvent("cart:changed", { detail: getCart() })
    );
  }
});

// Public API
export const cart = {
  init: initCart,
  get: getCart,
  add: addItem,
  update: updateItem,
  updateQty: updateItemQuantity,
  remove: removeItem,
  clear: clearCart,
  totals: getTotals,
  checkout: processCheckout,
  applyCoupon: applyCoupon,
  removeCoupon: removeCoupon,
};
