import React, { createContext, useContext, useState, useEffect } from "react";
import { getOrCreateCart, addItemToCart, updateCartItem, removeCartItem, emptyCart } from "../services/cartService";
import { getProductById } from "../services/inventarioService";

const CartContext = createContext();

const CART_KEY = "cart:data";
const CART_ID_KEY = "cart:id";

/**
 * Enrich cart items with product details from Inventario API
 * Cart API returns: { id (itemId), servicioId, cantidad, precioUnitario, subtotal, personalizaciones }
 * We need to fetch: { nombre, imagen, marca, stock } from Inventario
 */
const enrichCartItems = async (apiItems) => {
   const enrichedItems = [];

   for (const item of apiItems) {
      try {
         // Fetch product details from Inventario API
         const product = await getProductById(item.servicioId);

         if (product) {
            enrichedItems.push({
               id: item.servicioId, // Product ID (for local cart operations)
               itemId: item.id, // Cart item ID (for API operations)
               name: product.nombre,
               price: item.precioUnitario, // Use price snapshot from cart
               qty: item.cantidad,
               image: product.imagen,
               stock: product.stock,
               metadata: {
                  marca: product.marca,
                  categoriaId: product.categoriaId || product.categoria?.idCategoria,
                  personalizaciones: item.personalizaciones,
               },
            });
         }
      } catch (error) {
         console.error(`Error enriching cart item ${item.servicioId}:`, error);
         // Include item with minimal data if product fetch fails
         enrichedItems.push({
            id: item.servicioId,
            itemId: item.id,
            name: `Product ${item.servicioId}`,
            price: item.precioUnitario,
            qty: item.cantidad,
            image: "/assets/images/products/fallback.png",
            stock: Infinity,
            metadata: {
               personalizaciones: item.personalizaciones,
            },
         });
      }
   }

   return enrichedItems;
};

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

         console.log("[CartContext] Initializing cart for user:", usuarioId);

         // Get or create cart from API
         const cartData = await getOrCreateCart(usuarioId);
         console.log("[CartContext] Cart data from API:", cartData);

         // Fix: API returns 'id', not 'carritoId'
         setCarritoId(cartData.id);
         localStorage.setItem(CART_ID_KEY, cartData.id);

         // Enrich cart items with product details from Inventario API
         const enrichedItems = await enrichCartItems(cartData.items || []);
         console.log("[CartContext] Enriched items:", enrichedItems);

         const transformedCart = {
            items: enrichedItems,
            appliedCoupon: cart.appliedCoupon, // Preserve coupon from local state
         };

         setCart(transformedCart);
         localStorage.setItem(CART_KEY, JSON.stringify(transformedCart));
      } catch (error) {
         console.error("[CartContext] Error initializing cart:", error);
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
         console.error("[CartContext] Item must have an id");
         return;
      }

      console.log("[CartContext] Adding to cart:", item);

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
               console.warn(`[CartContext] Cannot add more items. Stock limit: ${stock}`);
               alert(`No hay suficiente stock. Disponible: ${stock} unidades`);
               return;
            }

            console.log("[CartContext] Adding item to API cart:", {
               carritoId,
               servicioId: item.id,
               cantidad: qtyToAdd,
            });

            // Add to API cart - use item.id as servicioId
            await addItemToCart(carritoId, {
               servicioId: item.id,
               cantidad: qtyToAdd,
               personalizaciones: item.metadata || {},
            });

            // Re-fetch cart to get updated items with item IDs
            const updatedCart = await getOrCreateCart(userId);
            const enrichedItems = await enrichCartItems(updatedCart.items || []);

            setCart((prevCart) => ({
               ...prevCart,
               items: enrichedItems,
            }));

            console.log("[CartContext] Cart updated after adding item");
         } catch (error) {
            console.error("[CartContext] Error adding to cart:", error);
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
      if (itemIndex === -1) {
         console.warn("[CartContext] Item not found in cart:", id);
         return;
      }

      const item = cart.items[itemIndex];
      const stock = item.stock || Infinity;

      if (qty <= 0) {
         // Remove item
         await removeFromCart(id);
         return;
      }

      if (qty > stock) {
         console.warn(`[CartContext] Cannot update quantity to ${qty}. Stock limit: ${stock}`);
         alert(`No hay suficiente stock. Disponible: ${stock} unidades`);
         return;
      }

      if (userId && carritoId) {
         try {
            const cartItem = cart.items[itemIndex];

            // Use the tracked itemId for API operations
            if (!cartItem.itemId) {
               console.error("[CartContext] No itemId found for cart item");
               throw new Error("Cart item ID not found");
            }

            console.log("[CartContext] Updating cart item:", {
               itemId: cartItem.itemId,
               newQty: qty,
            });

            // Update via API using the cart item ID
            await updateCartItem(cartItem.itemId, qty);

            // Re-fetch cart to get updated data
            const updatedCart = await getOrCreateCart(userId);
            const enrichedItems = await enrichCartItems(updatedCart.items || []);

            setCart((prevCart) => ({
               ...prevCart,
               items: enrichedItems,
            }));

            console.log("[CartContext] Cart updated after quantity change");
         } catch (error) {
            console.error("[CartContext] Error updating cart item:", error);
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
            // Find the item in local cart to get the itemId
            const cartItem = cart.items.find((i) => i.id === id);

            if (!cartItem || !cartItem.itemId) {
               console.error("[CartContext] No itemId found for cart item to remove");
               throw new Error("Cart item ID not found");
            }

            console.log("[CartContext] Removing cart item:", {
               itemId: cartItem.itemId,
               productId: id,
            });

            // Remove via API using cart item ID
            await removeCartItem(cartItem.itemId);

            // Re-fetch cart to get updated data
            const updatedCart = await getOrCreateCart(userId);
            const enrichedItems = await enrichCartItems(updatedCart.items || []);

            setCart((prevCart) => ({
               ...prevCart,
               items: enrichedItems,
            }));

            console.log("[CartContext] Cart updated after item removal");
         } catch (error) {
            console.error("[CartContext] Error removing cart item:", error);
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
