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
  return cartStore.get("data") || initCart();
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
  if (cart.items.length !== before) saveCart(cart);
  return cart;
}

function clearCart() {
  return saveCart({ items: [] });
}

function getTotals() {
  const { items } = getCart();
  const subtotal = items.reduce(
    (sum, i) => sum + (Number(i.price) || 0) * (i.qty || 0),
    0
  );
  const count = items.reduce((sum, i) => sum + (i.qty || 0), 0);
  return { subtotal, count };
}

// Process checkout and award points
async function processCheckout(paymentMethod = "default") {
  const cart = getCart();
  const { subtotal, count } = getTotals();

  if (cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  try {
    // Wait for points system to be initialized
    await pointsSystem.init();

    // Process purchase and award points
    const purchaseResult = pointsSystem.processPurchase(subtotal, cart.items);

    // Create purchase record
    const purchase = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      items: [...cart.items],
      subtotal,
      count,
      paymentMethod,
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
};
