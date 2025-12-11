/**
 * User Service
 * Handles user authentication and profile operations with Usuario API
 */

import api from "./api";

// API endpoints for Usuario Service
const ENDPOINTS = {
   // Authentication
   REGISTER: "/auth/register",
   LOGIN: "/auth/login",

   // Profile (JWT-based, no user ID needed)
   PROFILE: "/profile",

   // Points (JWT-based)
   ADD_POINTS: "/points",

   // Coupons (JWT-based)
   COUPONS: "/coupons",
   REDEEM_COUPON: "/coupons/redeem",
   REMOVE_COUPON: (couponId) => `/coupons/${couponId}`,
};

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @param {string} userData.firstName - First name (optional)
 * @param {string} userData.lastName - Last name (optional)
 * @param {string} userData.phone - Phone number (optional)
 * @returns {Promise<object>} - Registered user object (without password)
 */
export const registerUser = async (userData) => {
   try {
      const response = await api.post(ENDPOINTS.REGISTER, {
         username: userData.username,
         email: userData.email,
         password: userData.password,
         firstName: userData.firstName,
         lastName: userData.lastName,
         phone: userData.phone,
      });
      return response;
   } catch (error) {
      if (error.response?.status === 400) {
         throw new Error(error.response.data?.message || "El correo ya está registrado");
      }
      throw error;
   }
};

/**
 * Authenticate user and get JWT token
 * @param {string} identifier - Email or username
 * @param {string} password - Password
 * @returns {Promise<object>} - { token, user } or null if auth fails
 */
export const authenticateUser = async (identifier, password) => {
   try {
      const response = await api.post(ENDPOINTS.LOGIN, {
         identifier,
         password,
      });

      console.log("[userService] Login response:", response);
      console.log("[userService] Token extracted:", response.token);
      console.log("[userService] Response structure:", {
         hasToken: !!response.token,
         hasUserId: !!response.userId,
         keys: Object.keys(response),
      });

      // api.js unwraps the 'response' field, so we get the inner object directly
      // Response contains: { userId, username, email, fullName, isActive, isVerified, token, level, points, message }
      // We need to structure it as { token, user }
      const result = {
         token: response.token,
         user: {
            id: response.userId,
            username: response.username,
            email: response.email,
            fullName: response.fullName,
            isActive: response.isActive,
            isVerified: response.isVerified,
            stats: {
               level: response.level,
               points: response.points,
            },
         },
      };

      console.log("[userService] Returning:", {
         hasToken: !!result.token,
         token: result.token ? `${result.token.substring(0, 30)}...` : null,
         userId: result.user.id,
      });

      return result;
   } catch (error) {
      console.error("[userService] Login error:", error);
      if (error.response?.status === 401 || error.response?.status === 404) {
         return null;
      }
      throw error;
   }
};

// ============================================================================
// PROFILE MANAGEMENT
// ============================================================================

/**
 * Get current user's profile (JWT-based)
 * @returns {Promise<object>} - User profile object
 */
export const getCurrentUserProfile = async () => {
   try {
      console.log("[userService] Getting current user profile");
      const response = await api.get(ENDPOINTS.PROFILE);
      console.log("[userService] Profile response:", response);
      // Usuario API returns the profile directly, not nested in response.response
      return response;
   } catch (error) {
      console.error("[userService] Profile error:", error);
      if (error.response?.status === 404) {
         return null;
      }
      throw error;
   }
};

/**
 * Update current user's profile (JWT-based)
 * @param {object} updates - Object with fields to update
 * @param {string} updates.firstName - First name
 * @param {string} updates.lastName - Last name
 * @param {string} updates.phone - Phone number
 * @param {string} updates.birthdate - Birthdate (YYYY-MM-DD)
 * @param {string} updates.bio - Biography
 * @param {string} updates.avatar - Avatar URL
 * @param {object} updates.address - Address object
 * @param {object} updates.gaming - Gaming profile object
 * @param {object} updates.preferences - Preferences object
 * @returns {Promise<object>} - Updated user profile
 */
export const updateUserProfile = async (updates) => {
   try {
      const response = await api.put(ENDPOINTS.PROFILE, updates);
      return response;
   } catch (error) {
      if (error.response?.status === 404) {
         throw new Error("Usuario no encontrado");
      }
      throw error;
   }
};

// ============================================================================
// POINTS MANAGEMENT
// ============================================================================

/**
 * Add points to current user (JWT-based)
 * @param {number} points - Points to add
 * @param {string} reason - Reason for adding points (optional)
 * @returns {Promise<object>} - Updated user stats
 */
export const addUserPoints = async (points, reason = null) => {
   try {
      const body = { points };
      if (reason) {
         body.reason = reason;
      }

      const response = await api.post(ENDPOINTS.ADD_POINTS, body);
      return response; // Returns updated ClientStats
   } catch (error) {
      if (error.response?.status === 400) {
         throw new Error(error.response.data?.message || "Puntos inválidos");
      }
      throw error;
   }
};

// ============================================================================
// COUPON MANAGEMENT
// ============================================================================

/**
 * Get all coupons for current user (JWT-based)
 * @returns {Promise<Array>} - Array of coupon objects
 */
export const getUserCoupons = async () => {
   try {
      const response = await api.get(ENDPOINTS.COUPONS);
      return response || [];
   } catch (error) {
      console.error("Error fetching coupons:", error);
      return [];
   }
};

/**
 * Redeem points for a coupon (JWT-based)
 * @param {number} pointsToRedeem - Number of points to redeem (minimum 100)
 * @returns {Promise<object>} - Created coupon object
 */
export const redeemPointsForCoupon = async (pointsToRedeem) => {
   try {
      const response = await api.post(ENDPOINTS.REDEEM_COUPON, {
         pointsToRedeem,
      });
      return response;
   } catch (error) {
      if (error.response?.status === 400) {
         const message = error.response.data?.message || "Puntos insuficientes";
         throw new Error(message);
      }
      throw error;
   }
};

/**
 * Remove a coupon from current user (JWT-based)
 * @param {string} couponId - Coupon ID to remove
 * @returns {Promise<void>}
 */
export const removeCoupon = async (couponId) => {
   try {
      await api.delete(ENDPOINTS.REMOVE_COUPON(couponId));
   } catch (error) {
      if (error.response?.status === 404) {
         throw new Error("Cupón no encontrado");
      }
      throw error;
   }
};

// ============================================================================
// LOCAL STORAGE HELPERS
// ============================================================================

/**
 * Get current user from localStorage
 * @returns {object|null} - Current user or null
 */
export const getCurrentUser = () => {
   try {
      const storedUser = localStorage.getItem("currentUser");
      return storedUser ? JSON.parse(storedUser) : null;
   } catch {
      return null;
   }
};

/**
 * Save current user to localStorage
 * @param {object} user - User object to save
 */
export const saveCurrentUser = (user) => {
   try {
      localStorage.setItem("currentUser", JSON.stringify(user));
   } catch (error) {
      console.error("Error saving user to localStorage:", error);
   }
};

/**
 * Clear current user from localStorage
 */
export const clearCurrentUser = () => {
   localStorage.removeItem("currentUser");
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
   // Authentication
   registerUser,
   authenticateUser,

   // Profile
   getCurrentUserProfile,
   updateUserProfile,

   // Points
   addUserPoints,

   // Coupons
   getUserCoupons,
   redeemPointsForCoupon,
   removeCoupon,

   // Local storage helpers
   getCurrentUser,
   saveCurrentUser,
   clearCurrentUser,
};
