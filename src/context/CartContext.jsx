import React, { createContext, useContext, useState, useEffect } from "react";
import { getOrCreateCart, addItemToCart, updateCartItem, removeCartItem, emptyCart } from "../services/cartService";

const CartContext = createContext();

const CART_KEY = "cart:data";
const CART_ID_KEY = "cart:id";

export function CartProvider({ children }) {
   const [cart, setCart] = useState({ items: [] });
   const [carritoId, setCarritoId] = useState(null);
   const [loading, setLoading] = useState(false);
   const [userId, setUserId] = useState(null);

   // Initialize cart when user logs in
   const initializeCart = async (usuarioId) => {
      if (!usuarioId) {
         // Guest user - use localStorage
         const stored = localStorage.getItem(CART_KEY);
         if (stored) {
            try {
               const localCart = JSON.parse(stored);
               setCart(localCart);
            } catch {
               setCart({ items: [] });
            }
         }
         return;
      }

      try {
         setLoading(true);
         setUserId(usuarioId);

         // Get or create cart from API
         const cartData = await getOrCreateCart(usuarioId);
         setCarritoId(cartData.carritoId);
         localStorage.setItem(CART_ID_KEY, cartData.carritoId);

         // Transform API cart to match local format
         const transformedCart = {
            items:
               cartData.items?.map((item) => ({
                  id: item.servicioId,
                  name: item.nombre || "Product",
                  price: item.precio || 0,
                  qty: item.cantidad,
                  image: item.imagenUrl,
                  stock: item.stock || Infinity,
                  metadata: item.personalizaciones || {},
               })) || [],
            appliedCoupon: cart.appliedCoupon, // Preserve coupon from local state
         };

         setCart(transformedCart);
         localStorage.setItem(CART_KEY, JSON.stringify(transformedCart));
      } catch (error) {
         console.error("Error initializing cart:", error);
         // Fallback to localStorage on error
         const stored = localStorage.getItem(CART_KEY);
         if (stored) {
            try {
               setCart(JSON.parse(stored));
            } catch {
               setCart({ items: [] });
            }
         }
      } finally {
         setLoading(false);
      }
   };

   // Initialize cart on mount if user is already logged in
   useEffect(() => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
         try {
            const user = JSON.parse(storedUser);
            if (user?.id) {
               initializeCart(user.id);
            }
         } catch (error) {
            console.error("Error loading user on mount:", error);
         }
      } else {
         // Load from localStorage for guest
         const stored = localStorage.getItem(CART_KEY);
         if (stored) {
            try {
               setCart(JSON.parse(stored));
            } catch {
               setCart({ items: [] });
            }
         }
      }
   }, []);

   // Listen for user login/logout events
   useEffect(() => {
      const handleUserLogin = (e) => {
         const user = e.detail;
         if (user?.id) {
            initializeCart(user.id);
         }
      };

      const handleUserLogout = () => {
         setUserId(null);
         setCarritoId(null);
         setCart({ items: [] });
         localStorage.removeItem(CART_KEY);
         localStorage.removeItem(CART_ID_KEY);
      };

      document.addEventListener("userLoggedIn", handleUserLogin);
      document.addEventListener("userLoggedOut", handleUserLogout);

      return () => {
         document.removeEventListener("userLoggedIn", handleUserLogin);
         document.removeEventListener("userLoggedOut", handleUserLogout);
      };
   }, []);

   // Save to localStorage for guest users
   useEffect(() => {
      if (!userId) {
         localStorage.setItem(CART_KEY, JSON.stringify(cart));
      }
      // Dispatch event for cross-component sync
      document.dispatchEvent(new CustomEvent("cart:changed", { detail: cart }));
   }, [cart, userId]);

   const addToCart = async (item) => {
      if (!item || item.id == null) {
         console.error("Item must have an id");
         return;
      }

      console.log("Adding to cart:", item);

      const stock = item.stock || Infinity;
      const qtyToAdd = item.qty || 1;

      // Check if adding to API cart or local cart
      if (userId && carritoId) {
         try {
            // Check existing quantity
            const existingItem = cart.items.find((i) => i.id === item.id);
            const currentQty = existingItem?.qty || 0;
            const newQty = currentQty + qtyToAdd;

            if (newQty > stock) {
               console.warn(`Cannot add more items. Stock limit: ${stock}`);
               alert(`No hay suficiente stock. Disponible: ${stock} unidades`);
               return;
            }

            // Add to API cart
            await addItemToCart(carritoId, {
               servicioId: item.id,
               cantidad: qtyToAdd,
               personalizaciones: item.metadata || {},
            });

            // Update local state
            setCart((prevCart) => {
               const existingIndex = prevCart.items.findIndex((i) => i.id === item.id);

               if (existingIndex !== -1) {
                  const newItems = [...prevCart.items];
                  newItems[existingIndex] = {
                     ...newItems[existingIndex],
                     qty: newQty,
                  };
                  return { ...prevCart, items: newItems };
               } else {
                  const newItem = {
                     id: item.id,
                     name: item.name,
                     price: item.price,
                     qty: qtyToAdd,
                     image: item.image,
                     stock: stock,
                     metadata: item.metadata || {},
                  };
                  return { ...prevCart, items: [...prevCart.items, newItem] };
               }
            });
         } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Error al agregar el producto al carrito");
         }
      } else {
         // Guest user - use local storage
         setCart((prevCart) => {
            const existingIndex = prevCart.items.findIndex((i) => i.id === item.id);

            if (existingIndex !== -1) {
               const currentQty = prevCart.items[existingIndex].qty;
               const newQty = currentQty + qtyToAdd;

               if (newQty > stock) {
                  console.warn(`Cannot add more items. Stock limit: ${stock}`);
                  alert(`No hay suficiente stock. Disponible: ${stock} unidades`);
                  return prevCart;
               }

               const newItems = [...prevCart.items];
               newItems[existingIndex] = {
                  ...newItems[existingIndex],
                  qty: newQty,
                  stock: stock,
               };
               return { ...prevCart, items: newItems };
            } else {
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
               return { ...prevCart, items: [...prevCart.items, newItem] };
            }
         });
      }
   };

   const updateQuantity = async (id, qty) => {
      const itemIndex = cart.items.findIndex((i) => i.id === id);
      if (itemIndex === -1) return;

      const item = cart.items[itemIndex];
      const stock = item.stock || Infinity;

      if (qty <= 0) {
         // Remove item
         await removeFromCart(id);
         return;
      }

      if (qty > stock) {
         console.warn(`Cannot update quantity to ${qty}. Stock limit: ${stock}`);
         alert(`No hay suficiente stock. Disponible: ${stock} unidades`);
         return;
      }

      if (userId && carritoId) {
         try {
            // Find the item ID in the API cart (we need to track this)
            // For now, we'll update via API by servicioId
            const cartItem = cart.items[itemIndex];

            // Update via API (Note: API expects itemId, not servicioId)
            // We need to get the actual cart to find the item's API ID
            const apiCart = await getOrCreateCart(userId);
            const apiItem = apiCart.items?.find((i) => i.servicioId === id);

            if (apiItem) {
               await updateCartItem(apiItem.itemId, qty);
            }

            // Update local state
            setCart((prevCart) => {
               const newItems = [...prevCart.items];
               newItems[itemIndex] = {
                  ...newItems[itemIndex],
                  qty: qty,
               };
               return { ...prevCart, items: newItems };
            });
         } catch (error) {
            console.error("Error updating cart item:", error);
            alert("Error al actualizar la cantidad");
         }
      } else {
         // Guest user - local storage
         setCart((prevCart) => {
            const newItems = [...prevCart.items];
            newItems[itemIndex] = {
               ...newItems[itemIndex],
               qty: qty,
            };
            return { ...prevCart, items: newItems };
         });
      }
   };

   const removeFromCart = async (id) => {
      if (userId && carritoId) {
         try {
            // Get the API item ID
            const apiCart = await getOrCreateCart(userId);
            const apiItem = apiCart.items?.find((i) => i.servicioId === id);

            if (apiItem) {
               await removeCartItem(apiItem.itemId);
            }

            // Update local state
            setCart((prevCart) => ({
               ...prevCart,
               items: prevCart.items.filter((i) => i.id !== id),
            }));
         } catch (error) {
            console.error("Error removing cart item:", error);
            alert("Error al eliminar el producto");
         }
      } else {
         // Guest user - local storage
         setCart((prevCart) => ({
            ...prevCart,
            items: prevCart.items.filter((i) => i.id !== id),
         }));
      }
   };

   const clearCart = async () => {
      if (userId && carritoId) {
         try {
            await emptyCart(carritoId);
            setCart({ items: [] });
         } catch (error) {
            console.error("Error clearing cart:", error);
            // Clear locally even if API fails
            setCart({ items: [] });
         }
      } else {
         setCart({ items: [] });
      }
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
      const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

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
      carritoId,
      userId,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,
      getTotals,
      initializeCart, // Expose for manual initialization
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
