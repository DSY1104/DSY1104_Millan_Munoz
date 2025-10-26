import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CART_KEY = "cart:data";

// Initialize cart from localStorage
function initCart() {
  const stored = localStorage.getItem(CART_KEY);
  if (!stored) {
    const cart = { items: [] };
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  }
  try {
    const cart = JSON.parse(stored);
    if (!cart || !Array.isArray(cart.items)) {
      const newCart = { items: [] };
      localStorage.setItem(CART_KEY, JSON.stringify(newCart));
      return newCart;
    }
    return cart;
  } catch {
    const cart = { items: [] };
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => initCart());

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Dispatch event for cross-component sync
    document.dispatchEvent(new CustomEvent("cart:changed", { detail: cart }));
  }, [cart]);

  // Listen for cart changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CART_KEY) {
        try {
          const newCart = JSON.parse(e.newValue || "{}");
          if (newCart && Array.isArray(newCart.items)) {
            setCart(newCart);
          }
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const addToCart = (item) => {
    if (!item || item.id == null) {
      console.error("Item must have an id");
      return;
    }

    console.log("Adding to cart:", item);

    setCart((prevCart) => {
      const existingIndex = prevCart.items.findIndex((i) => i.id === item.id);
      const stock = item.stock || Infinity; // Use Infinity if no stock limit

      if (existingIndex !== -1) {
        // Item exists, check if we can add more
        const currentQty = prevCart.items[existingIndex].qty;
        const qtyToAdd = item.qty || 1;
        const newQty = currentQty + qtyToAdd;

        if (newQty > stock) {
          console.warn(`Cannot add more items. Stock limit: ${stock}`);
          alert(`No hay suficiente stock. Disponible: ${stock} unidades`);
          return prevCart; // Don't update if exceeds stock
        }

        // Item exists, update quantity immutably
        const newItems = [...prevCart.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          qty: newQty,
          stock: stock, // Update stock information
        };
        console.log(
          "Updated existing item, new qty:",
          newItems[existingIndex].qty
        );
        return { ...prevCart, items: newItems };
      } else {
        // Add new item - check if initial quantity is valid
        const qtyToAdd = item.qty || 1;

        if (qtyToAdd > stock) {
          console.warn(`Cannot add ${qtyToAdd} items. Stock limit: ${stock}`);
          alert(`No hay suficiente stock. Disponible: ${stock} unidades`);
          return prevCart;
        }

        const newItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          qty: qtyToAdd,
          image: item.image,
          stock: stock,
          metadata: item.metadata || {},
        };
        console.log("Adding new item:", newItem);
        return { ...prevCart, items: [...prevCart.items, newItem] };
      }
    });
  };

  const updateQuantity = (id, qty) => {
    setCart((prevCart) => {
      const itemIndex = prevCart.items.findIndex((i) => i.id === id);

      if (itemIndex === -1) return prevCart;

      const item = prevCart.items[itemIndex];
      const stock = item.stock || Infinity;

      if (qty <= 0) {
        // Remove item immutably
        return {
          ...prevCart,
          items: prevCart.items.filter((i) => i.id !== id),
        };
      } else if (qty > stock) {
        // Don't allow exceeding stock
        console.warn(`Cannot update quantity to ${qty}. Stock limit: ${stock}`);
        alert(`No hay suficiente stock. Disponible: ${stock} unidades`);
        return prevCart;
      } else {
        // Update quantity immutably
        const newItems = [...prevCart.items];
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          qty: qty,
        };
        return { ...prevCart, items: newItems };
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter((i) => i.id !== id),
    }));
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  const applyCoupon = (coupon) => {
    setCart((prevCart) => ({
      ...prevCart,
      appliedCoupon: coupon,
    }));
  };

  const removeCoupon = () => {
    setCart((prevCart) => ({
      ...prevCart,
      appliedCoupon: null,
    }));
  };

  const getTotals = () => {
    const count = cart.items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    let discount = 0;
    if (cart.appliedCoupon) {
      if (cart.appliedCoupon.type === "percentage") {
        discount = Math.round(subtotal * (cart.appliedCoupon.value / 100));
      } else if (cart.appliedCoupon.type === "fixed") {
        discount = cart.appliedCoupon.value;
      }
    }

    const total = Math.max(0, subtotal - discount);

    return {
      count,
      subtotal,
      discount,
      total,
      appliedCoupon: cart.appliedCoupon || null,
    };
  };

  const value = {
    cart,
    items: cart.items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    getTotals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
