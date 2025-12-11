/**
 * Centralized API configuration
 * Handles requests to different microservices
 */

// Microservice base URLs
const USUARIO_BASE_URL = import.meta.env.VITE_USUARIO_API_URL || "http://localhost:8081/api/v1";
const INVENTARIO_BASE_URL = import.meta.env.VITE_INVENTARIO_API_URL || "http://localhost:8082/api/v1";
const CARRITO_BASE_URL = import.meta.env.VITE_CARRITO_API_URL || "http://localhost:8083/api/v1";

/**
 * Get JWT authentication token from storage
 * @returns {string|null} - JWT token or null if not found
 */
const getAuthToken = () => {
   try {
      const session = JSON.parse(localStorage.getItem("userSession"));
      const token = session?.token || null;
      console.log("[API] getAuthToken - token found:", token ? `${token.substring(0, 20)}...` : "null");
      return token;
   } catch (error) {
      console.error("[API] Error getting auth token:", error);
      return null;
   }
};

/**
 * Handle 401 Unauthorized responses
 * Clear session and dispatch logout event
 */
const handleUnauthorized = () => {
   try {
      // Clear all session data
      localStorage.removeItem("userSession");
      localStorage.removeItem("currentUser");

      // Clear cookies
      document.cookie = "userSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "rememberLogin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Dispatch logout event
      window.dispatchEvent(new CustomEvent("userLoggedOut"));

      console.log("[API] Session expired or invalid - user logged out");
   } catch (error) {
      console.error("[API] Error handling unauthorized:", error);
   }
};

/**
 * Determine which base URL to use based on the endpoint
 * @param {string} endpoint - The API endpoint
 * @returns {string} - The appropriate base URL
 */
const getBaseURL = (endpoint) => {
   // Usuario Service endpoints
   if (
      endpoint.startsWith("/auth/") ||
      endpoint.startsWith("/profile") ||
      endpoint.startsWith("/points") ||
      endpoint.startsWith("/coupons") ||
      endpoint.startsWith("/users") ||
      endpoint.startsWith("/roles")
   ) {
      return USUARIO_BASE_URL;
   }

   // Inventario Service endpoints
   if (endpoint.startsWith("/productos") || endpoint.startsWith("/categorias")) {
      return INVENTARIO_BASE_URL;
   }

   // Carrito Service endpoints
   if (
      endpoint.startsWith("/cart") ||
      endpoint.startsWith("/checkout") ||
      endpoint.startsWith("/orders") ||
      endpoint.startsWith("/payments")
   ) {
      return CARRITO_BASE_URL;
   }

   // Default to Usuario service
   return USUARIO_BASE_URL;
};

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - The endpoint or path to fetch
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - The response data
 */
export const fetchAPI = async (endpoint, options = {}) => {
   try {
      const baseURL = getBaseURL(endpoint);
      const url = `${baseURL}${endpoint}`;

      // Get JWT token and add to headers if available
      const token = getAuthToken();
      const headers = {
         "Content-Type": "application/json",
         ...options.headers,
      };

      // Add Authorization header for authenticated requests
      if (token) {
         headers["Authorization"] = `Bearer ${token}`;
         console.log("[API] Request to", endpoint, "with Authorization header");
      } else {
         console.log("[API] Request to", endpoint, "WITHOUT Authorization header");
      }

      console.log("[API] Headers:", headers);

      const response = await fetch(url, {
         headers,
         ...options,
      });

      // Handle 204 No Content
      if (response.status === 204) {
         return null;
      }

      // Handle 401 Unauthorized - session expired
      if (response.status === 401) {
         handleUnauthorized();
         const error = new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
         error.response = { status: 401, data: null };
         throw error;
      }

      const data = await response.json();

      if (!response.ok) {
         // Throw error with response data for better error handling
         const error = new Error(data.message || `HTTP error! status: ${response.status}`);
         error.response = { status: response.status, data };
         throw error;
      }

      // Handle both response formats:
      // Usuario API: { success: true, response: {...}, message: null, statusCode: 200 }
      // Other services: { status: "success", data: {...} }
      if (data.data !== undefined) {
         return data.data;
      }

      // Handle Usuario API response format
      if (data.response !== undefined) {
         return data.response;
      }

      // If no data/response field, return as is
      return data;
   } catch (error) {
      console.error(`[API] Error fetching ${endpoint}:`, error);
      throw error;
   }
};

/**
 * GET request
 * @param {string} endpoint - The endpoint to fetch
 * @returns {Promise<any>} - The response data
 */
export const get = (endpoint) => fetchAPI(endpoint, { method: "GET" });

/**
 * POST request
 * @param {string} endpoint - The endpoint to post to
 * @param {object} data - The data to send
 * @returns {Promise<any>} - The response data
 */
export const post = (endpoint, data) =>
   fetchAPI(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
   });

/**
 * PUT request
 * @param {string} endpoint - The endpoint to update
 * @param {object} data - The data to send
 * @returns {Promise<any>} - The response data
 */
export const put = (endpoint, data) =>
   fetchAPI(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
   });

/**
 * PATCH request
 * @param {string} endpoint - The endpoint to patch
 * @param {object} data - The data to send
 * @returns {Promise<any>} - The response data
 */
export const patch = (endpoint, data) =>
   fetchAPI(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
   });

/**
 * DELETE request
 * @param {string} endpoint - The endpoint to delete
 * @returns {Promise<any>} - The response data
 */
export const del = (endpoint) => fetchAPI(endpoint, { method: "DELETE" });

export default {
   get,
   post,
   put,
   patch,
   delete: del,
   fetchAPI,
};
