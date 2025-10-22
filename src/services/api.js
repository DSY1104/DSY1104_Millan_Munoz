/**
 * Centralized API fetch logic
 * Simulates API calls by fetching local JSON files
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const SIMULATE_DELAY = 500; // Simulate network delay in milliseconds

/**
 * Generic fetch wrapper with error handling and delay simulation
 * @param {string} endpoint - The endpoint or path to fetch
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - The response data
 */
export const fetchAPI = async (endpoint, options = {}) => {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, SIMULATE_DELAY));

    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error fetching ${endpoint}:`, error);
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
 * DELETE request
 * @param {string} endpoint - The endpoint to delete
 * @returns {Promise<any>} - The response data
 */
export const del = (endpoint) => fetchAPI(endpoint, { method: "DELETE" });

export default {
  get,
  post,
  put,
  del,
  fetchAPI,
};
