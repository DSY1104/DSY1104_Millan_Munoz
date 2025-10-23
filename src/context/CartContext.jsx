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

      if (existingIndex !== -1) {
        // Item exists, update quantity immutably
        const newItems = [...prevCart.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          qty: newItems[existingIndex].qty + (item.qty || 1),
        };
        console.log(
          "Updated existing item, new qty:",
          newItems[existingIndex].qty
        );
        return { ...prevCart, items: newItems };
      } else {
        // Add new item
        const newItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty || 1,
          image: item.image,
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

      if (qty <= 0) {
        // Remove item immutably
        return {
          ...prevCart,
          items: prevCart.items.filter((i) => i.id !== id),
        };
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

  const getTotals = () => {
    const count = cart.items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const discount = cart.appliedCoupon?.value || 0;
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
