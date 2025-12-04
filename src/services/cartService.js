/**
 * Cart Service
 * Handles shopping cart, checkout, orders, and payment operations
 * Integrates with Carrito Service API
 */

import api from "./api";

// API endpoints for Carrito Service
const ENDPOINTS = {
   // Cart Management
   GET_OR_CREATE_CART: (usuarioId) => `/cart/usuario/${usuarioId}`,
   GET_CART_BY_ID: (carritoId) => `/cart/${carritoId}`,
   GET_ALL_USER_CARTS: (usuarioId) => `/cart/usuario/${usuarioId}/todos`,
   ADD_ITEM: (carritoId) => `/cart/${carritoId}/items`,
   UPDATE_ITEM: (itemId) => `/cart/items/${itemId}`,
   REMOVE_ITEM: (itemId) => `/cart/items/${itemId}`,
   PROCESS_CART: (carritoId) => `/cart/${carritoId}/procesar`,
   EMPTY_CART: (carritoId) => `/cart/${carritoId}/vaciar`,
   CART_STATISTICS: "/cart/estadisticas",

   // Checkout
   INITIATE_CHECKOUT: "/checkout/initiate",
   CONFIRM_CHECKOUT_GET: (token) => `/checkout/confirm?token_ws=${token}`,
   CONFIRM_CHECKOUT_POST: (token) => `/checkout/confirm?token_ws=${token}`,

   // Orders
   GET_ORDER_BY_ID: (orderId) => `/orders/${orderId}`,
   GET_ORDER_BY_NUMBER: (numeroOrden) => `/orders/numero/${numeroOrden}`,
   GET_USER_ORDERS: (usuarioId) => `/orders/usuario/${usuarioId}`,
   GET_USER_ORDERS_BY_STATUS: (usuarioId, estado) => `/orders/usuario/${usuarioId}/estado/${estado}`,
   UPDATE_ORDER_STATUS: (orderId, nuevoEstado) => `/orders/${orderId}/estado?nuevoEstado=${nuevoEstado}`,
   CANCEL_ORDER: (orderId) => `/orders/${orderId}/cancel`,

   // Payments
   GET_PAYMENT_BY_ID: (pagoId) => `/payments/${pagoId}`,
   GET_PAYMENT_BY_ORDER: (pedidoId) => `/payments/pedido/${pedidoId}`,
   GET_PAYMENT_BY_TOKEN: (token) => `/payments/token/${token}`,
   CHECK_PAYMENT_APPROVED: (pagoId) => `/payments/${pagoId}/approved`,
   PAYMENT_HEALTH: "/payments/health",
};

/**
 * Order status constants
 */
export const ORDER_STATUS = {
   CREADO: "CREADO",
   PAGO_PENDIENTE: "PAGO_PENDIENTE",
   PAGO_COMPLETADO: "PAGO_COMPLETADO",
   PROCESANDO: "PROCESANDO",
   COMPLETADO: "COMPLETADO",
   CANCELADO: "CANCELADO",
   FALLIDO: "FALLIDO",
};

// ============================================================================
// CART MANAGEMENT
// ============================================================================

/**
 * Get or create cart for a user
 * @param {string} usuarioId - User ID (UUID)
 * @returns {Promise<object>} - Cart object
 */
export const getOrCreateCart = async (usuarioId) => {
   try {
      const response = await api.get(ENDPOINTS.GET_OR_CREATE_CART(usuarioId));
      return response.data;
   } catch (error) {
      console.error("Error getting/creating cart:", error);
      throw error;
   }
};

/**
 * Get cart by ID
 * @param {string} carritoId - Cart ID (UUID)
 * @returns {Promise<object>} - Cart object
 */
export const getCartById = async (carritoId) => {
   try {
      const response = await api.get(ENDPOINTS.GET_CART_BY_ID(carritoId));
      return response.data;
   } catch (error) {
      console.error("Error getting cart:", error);
      throw error;
   }
};

/**
 * Get all carts for a user
 * @param {string} usuarioId - User ID (UUID)
 * @returns {Promise<Array>} - Array of cart objects
 */
export const getAllUserCarts = async (usuarioId) => {
   try {
      const response = await api.get(ENDPOINTS.GET_ALL_USER_CARTS(usuarioId));
      return response.data;
   } catch (error) {
      console.error("Error getting user carts:", error);
      throw error;
   }
};

/**
 * Add item to cart
 * @param {string} carritoId - Cart ID
 * @param {object} item - Item to add
 * @param {string} item.servicioId - Product ID (UUID)
 * @param {number} item.cantidad - Quantity
 * @param {object} item.personalizaciones - Optional customizations
 * @returns {Promise<object>} - Cart item object
 */
export const addItemToCart = async (carritoId, item) => {
   try {
      const response = await api.post(ENDPOINTS.ADD_ITEM(carritoId), {
         servicioId: item.servicioId,
         cantidad: item.cantidad,
         personalizaciones: item.personalizaciones || {},
      });
      return response.data;
   } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
   }
};

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} cantidad - New quantity
 * @returns {Promise<object>} - Updated cart item
 */
export const updateCartItem = async (itemId, cantidad) => {
   try {
      const response = await api.put(ENDPOINTS.UPDATE_ITEM(itemId), {
         cantidad,
      });
      return response.data;
   } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
   }
};

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise<void>}
 */
export const removeCartItem = async (itemId) => {
   try {
      await api.delete(ENDPOINTS.REMOVE_ITEM(itemId));
   } catch (error) {
      console.error("Error removing cart item:", error);
      throw error;
   }
};

/**
 * Process cart (mark as processed)
 * @param {string} carritoId - Cart ID
 * @returns {Promise<object>} - Updated cart
 */
export const processCart = async (carritoId) => {
   try {
      const response = await api.put(ENDPOINTS.PROCESS_CART(carritoId));
      return response.data;
   } catch (error) {
      console.error("Error processing cart:", error);
      throw error;
   }
};

/**
 * Empty cart (remove all items)
 * @param {string} carritoId - Cart ID
 * @returns {Promise<void>}
 */
export const emptyCart = async (carritoId) => {
   try {
      await api.delete(ENDPOINTS.EMPTY_CART(carritoId));
   } catch (error) {
      console.error("Error emptying cart:", error);
      throw error;
   }
};

/**
 * Get cart statistics
 * @returns {Promise<object>} - Cart statistics
 */
export const getCartStatistics = async () => {
   try {
      const response = await api.get(ENDPOINTS.CART_STATISTICS);
      return response.data;
   } catch (error) {
      console.error("Error getting cart statistics:", error);
      throw error;
   }
};

// ============================================================================
// CHECKOUT
// ============================================================================

/**
 * Initiate checkout process
 * @param {object} checkoutData - Checkout data
 * @param {string} checkoutData.carritoId - Cart ID (UUID)
 * @param {string} checkoutData.returnUrl - URL to return after payment
 * @returns {Promise<object>} - Checkout response with Transbank data
 */
export const initiateCheckout = async (checkoutData) => {
   try {
      const response = await api.post(ENDPOINTS.INITIATE_CHECKOUT, {
         carritoId: checkoutData.carritoId,
         returnUrl: checkoutData.returnUrl,
      });
      return response.data;
   } catch (error) {
      console.error("Error initiating checkout:", error);
      throw error;
   }
};

/**
 * Confirm checkout (after Transbank redirect)
 * @param {string} token - Transbank token (token_ws)
 * @returns {Promise<object>} - Order confirmation data
 */
export const confirmCheckout = async (token) => {
   try {
      const response = await api.get(ENDPOINTS.CONFIRM_CHECKOUT_GET(token));
      return response.data;
   } catch (error) {
      console.error("Error confirming checkout:", error);
      throw error;
   }
};

/**
 * Confirm checkout (POST method for Transbank callback)
 * @param {string} token - Transbank token (token_ws)
 * @returns {Promise<object>} - Order confirmation data
 */
export const confirmCheckoutPost = async (token) => {
   try {
      const response = await api.post(ENDPOINTS.CONFIRM_CHECKOUT_POST(token));
      return response.data;
   } catch (error) {
      console.error("Error confirming checkout (POST):", error);
      throw error;
   }
};

// ============================================================================
// ORDERS
// ============================================================================

/**
 * Get order by ID
 * @param {string} orderId - Order ID (UUID)
 * @returns {Promise<object>} - Order object
 */
export const getOrderById = async (orderId) => {
   try {
      const response = await api.get(ENDPOINTS.GET_ORDER_BY_ID(orderId));
      return response.data;
   } catch (error) {
      if (error.response?.status === 404) {
         return null;
      }
      console.error("Error getting order:", error);
      throw error;
   }
};

/**
 * Get order by order number
 * @param {string} numeroOrden - Order number (e.g., "ORD-20251201-00001")
 * @returns {Promise<object>} - Order object
 */
export const getOrderByNumber = async (numeroOrden) => {
   try {
      const response = await api.get(ENDPOINTS.GET_ORDER_BY_NUMBER(numeroOrden));
      return response.data;
   } catch (error) {
      if (error.response?.status === 404) {
         return null;
      }
      console.error("Error getting order by number:", error);
      throw error;
   }
};

/**
 * Get all orders for a user
 * @param {string} usuarioId - User ID (UUID)
 * @returns {Promise<Array>} - Array of order objects
 */
export const getUserOrders = async (usuarioId) => {
   try {
      const response = await api.get(ENDPOINTS.GET_USER_ORDERS(usuarioId));
      return response.data;
   } catch (error) {
      console.error("Error getting user orders:", error);
      throw error;
   }
};

/**
 * Get user orders by status
 * @param {string} usuarioId - User ID (UUID)
 * @param {string} estado - Order status
 * @returns {Promise<Array>} - Array of order objects
 */
export const getUserOrdersByStatus = async (usuarioId, estado) => {
   try {
      const response = await api.get(ENDPOINTS.GET_USER_ORDERS_BY_STATUS(usuarioId, estado));
      return response.data;
   } catch (error) {
      console.error("Error getting user orders by status:", error);
      throw error;
   }
};

/**
 * Update order status (admin only)
 * @param {string} orderId - Order ID
 * @param {string} nuevoEstado - New order status
 * @returns {Promise<object>} - Updated order
 */
export const updateOrderStatus = async (orderId, nuevoEstado) => {
   try {
      const response = await api.put(ENDPOINTS.UPDATE_ORDER_STATUS(orderId, nuevoEstado));
      return response.data;
   } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
   }
};

/**
 * Cancel order
 * @param {string} orderId - Order ID
 * @returns {Promise<object>} - Cancelled order
 */
export const cancelOrder = async (orderId) => {
   try {
      const response = await api.put(ENDPOINTS.CANCEL_ORDER(orderId));
      return response.data;
   } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
   }
};

// ============================================================================
// PAYMENTS
// ============================================================================

/**
 * Get payment by ID
 * @param {string} pagoId - Payment ID (UUID)
 * @returns {Promise<object>} - Payment object
 */
export const getPaymentById = async (pagoId) => {
   try {
      const response = await api.get(ENDPOINTS.GET_PAYMENT_BY_ID(pagoId));
      return response.data;
   } catch (error) {
      if (error.response?.status === 404) {
         return null;
      }
      console.error("Error getting payment:", error);
      throw error;
   }
};

/**
 * Get payment by order ID
 * @param {string} pedidoId - Order ID (UUID)
 * @returns {Promise<object>} - Payment object
 */
export const getPaymentByOrder = async (pedidoId) => {
   try {
      const response = await api.get(ENDPOINTS.GET_PAYMENT_BY_ORDER(pedidoId));
      return response.data;
   } catch (error) {
      if (error.response?.status === 404) {
         return null;
      }
      console.error("Error getting payment by order:", error);
      throw error;
   }
};

/**
 * Get payment by Transbank token
 * @param {string} token - Transbank token
 * @returns {Promise<object>} - Payment object
 */
export const getPaymentByToken = async (token) => {
   try {
      const response = await api.get(ENDPOINTS.GET_PAYMENT_BY_TOKEN(token));
      return response.data;
   } catch (error) {
      if (error.response?.status === 404) {
         return null;
      }
      console.error("Error getting payment by token:", error);
      throw error;
   }
};

/**
 * Check if payment is approved
 * @param {string} pagoId - Payment ID
 * @returns {Promise<boolean>} - True if approved
 */
export const checkPaymentApproved = async (pagoId) => {
   try {
      const response = await api.get(ENDPOINTS.CHECK_PAYMENT_APPROVED(pagoId));
      return response.data;
   } catch (error) {
      console.error("Error checking payment approval:", error);
      throw error;
   }
};

/**
 * Payment service health check
 * @returns {Promise<string>} - Health status message
 */
export const checkPaymentHealth = async () => {
   try {
      const response = await api.get(ENDPOINTS.PAYMENT_HEALTH);
      return response.data;
   } catch (error) {
      console.error("Error checking payment health:", error);
      throw error;
   }
};

export default {
   // Cart Management
   getOrCreateCart,
   getCartById,
   getAllUserCarts,
   addItemToCart,
   updateCartItem,
   removeCartItem,
   processCart,
   emptyCart,
   getCartStatistics,

   // Checkout
   initiateCheckout,
   confirmCheckout,
   confirmCheckoutPost,

   // Orders
   getOrderById,
   getOrderByNumber,
   getUserOrders,
   getUserOrdersByStatus,
   updateOrderStatus,
   cancelOrder,

   // Payments
   getPaymentById,
   getPaymentByOrder,
   getPaymentByToken,
   checkPaymentApproved,
   checkPaymentHealth,

   // Constants
   ORDER_STATUS,
};
