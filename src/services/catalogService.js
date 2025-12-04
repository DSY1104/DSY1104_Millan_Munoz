/**
 * Catalog Service
 * Handles all product catalog-related API calls
 */

import api from "./api";

// API endpoints for Inventario Service
const ENDPOINTS = {
   ALL_PRODUCTS: "/productos",
   ACTIVE_PRODUCTS: "/productos/activos",
   PRODUCT_BY_ID: (id) => `/productos/${id}`,
   PRODUCT_BY_CODE: (code) => `/productos/code/${code}`,
   SEARCH_PRODUCTS: (nombre) => `/productos/buscar?nombre=${nombre}`,
   PRODUCTS_BY_CATEGORY: (categoriaId) => `/productos/categoria/${categoriaId}`,
   PRODUCTS_BY_BRAND: (marca) => `/productos/marca/${marca}`,
   PRODUCTS_IN_STOCK: "/productos/en-stock",
   PRODUCTS_BY_PRICE: (min, max) => `/productos/precio?min=${min}&max=${max}`,
   PRODUCTS_BY_RATING: (min) => `/productos/rating?min=${min}`,
   PRODUCTS_BY_TAG: (tag) => `/productos/tag/${tag}`,
};

/**
 * Fetch all products
 * @returns {Promise<Array>} - Array of product objects
 */
export const getAllProducts = async () => {
   try {
      const response = await api.get(ENDPOINTS.ALL_PRODUCTS);
      const products = response.data;
      // Add index for sorting stability
      return products.map((product, index) => ({ ...product, _idx: index }));
   } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
   }
};

/**
 * Fetch a single product by code
 * @param {string} code - The product code
 * @returns {Promise<object|null>} - The product object or null if not found
 */
export const getProductByCode = async (code) => {
   try {
      const response = await api.get(ENDPOINTS.PRODUCT_BY_CODE(code));
      return response.data;
   } catch (error) {
      if (error.response?.status === 404) {
         return null;
      }
      console.error(`Error fetching product ${code}:`, error);
      throw error;
   }
};

/**
 * Fetch products by category ID
 * @param {string} categoryId - The category ID to filter by
 * @returns {Promise<Array>} - Array of product objects in that category
 */
export const getProductsByCategory = async (categoryId) => {
   try {
      const response = await api.get(ENDPOINTS.PRODUCTS_BY_CATEGORY(categoryId));
      return response.data;
   } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
   }
};

/**
 * Fetch products by brand
 * @param {string} brand - The brand name to filter by
 * @returns {Promise<Array>} - Array of product objects of that brand
 */
export const getProductsByBrand = async (brand) => {
   try {
      const response = await api.get(ENDPOINTS.PRODUCTS_BY_BRAND(brand));
      return response.data;
   } catch (error) {
      console.error(`Error fetching products for brand ${brand}:`, error);
      throw error;
   }
};

/**
 * Get all unique brands from products
 * @returns {Promise<Array>} - Array of unique brand strings
 */
export const getAllBrands = async () => {
   try {
      const products = await getAllProducts();
      const brands = new Set();

      products.forEach((product) => {
         if (product.marca && typeof product.marca === "string" && product.marca.trim() !== "") {
            brands.add(product.marca.trim());
         }
      });

      return Array.from(brands).sort((a, b) => a.localeCompare(b, "es"));
   } catch (error) {
      console.error("Error fetching brands:", error);
      throw error;
   }
};

/**
 * Get all unique categories from products
 * @returns {Promise<Array>} - Array of unique category IDs
 */
export const getProductCategories = async () => {
   try {
      const products = await getAllProducts();
      const categories = new Set();

      products.forEach((product) => {
         if (product.categoriaId) {
            categories.add(product.categoriaId);
         }
      });

      return Array.from(categories).sort();
   } catch (error) {
      console.error("Error fetching product categories:", error);
      throw error;
   }
};

/**
 * Search products by query string
 * Searches in product name and code
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of matching product objects
 */
export const searchProducts = async (query) => {
   try {
      if (!query || query.trim() === "") {
         return await getAllProducts();
      }

      const response = await api.get(ENDPOINTS.SEARCH_PRODUCTS(encodeURIComponent(query)));
      return response.data;
   } catch (error) {
      console.error(`Error searching products for "${query}":`, error);
      throw error;
   }
};

/**
 * Filter products by rating
 * @param {number} minRating - Minimum rating (inclusive)
 * @param {number} maxRating - Maximum rating (exclusive, optional)
 * @returns {Promise<Array>} - Array of product objects within rating range
 */
export const getProductsByRating = async (minRating, maxRating = null) => {
   try {
      const response = await api.get(ENDPOINTS.PRODUCTS_BY_RATING(minRating));
      let products = response.data;

      // Filter by maxRating on client side if provided
      if (maxRating !== null) {
         products = products.filter((product) => product.rating < maxRating);
      }

      return products;
   } catch (error) {
      console.error(`Error fetching products by rating ${minRating}${maxRating ? "-" + maxRating : ""}:`, error);
      throw error;
   }
};

/**
 * Get products by price range
 * @param {number} minPrice - Minimum price (inclusive)
 * @param {number} maxPrice - Maximum price (inclusive)
 * @returns {Promise<Array>} - Array of product objects within price range
 */
export const getProductsByPriceRange = async (minPrice, maxPrice) => {
   try {
      const response = await api.get(ENDPOINTS.PRODUCTS_BY_PRICE(minPrice, maxPrice));
      return response.data;
   } catch (error) {
      console.error(`Error fetching products by price range ${minPrice}-${maxPrice}:`, error);
      throw error;
   }
};

/**
 * Get products sorted by price
 * @param {string} order - 'asc' or 'desc'
 * @returns {Promise<Array>} - Array of sorted product objects
 */
export const getProductsSortedByPrice = async (order = "asc") => {
   try {
      const products = await getAllProducts();
      return products.slice().sort((a, b) => {
         if (order === "asc") {
            return a.precioCLP - b.precioCLP;
         } else if (order === "desc") {
            return b.precioCLP - a.precioCLP;
         }
         return 0;
      });
   } catch (error) {
      console.error("Error sorting products by price:", error);
      throw error;
   }
};

/**
 * Get products sorted by rating
 * @param {string} order - 'asc' or 'desc'
 * @returns {Promise<Array>} - Array of sorted product objects
 */
export const getProductsSortedByRating = async (order = "desc") => {
   try {
      const products = await getAllProducts();
      return products.slice().sort((a, b) => {
         if (order === "asc") {
            return a.rating - b.rating;
         } else if (order === "desc") {
            return b.rating - a.rating;
         }
         return 0;
      });
   } catch (error) {
      console.error("Error sorting products by rating:", error);
      throw error;
   }
};

/**
 * Get products in stock
 * @returns {Promise<Array>} - Array of products with stock > 0
 */
export const getProductsInStock = async () => {
   try {
      const response = await api.get(ENDPOINTS.PRODUCTS_IN_STOCK);
      return response.data;
   } catch (error) {
      console.error("Error fetching products in stock:", error);
      throw error;
   }
};

/**
 * Get featured products (high rating and in stock)
 * @param {number} minRating - Minimum rating threshold (default 4.5)
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<Array>} - Array of featured product objects
 */
export const getFeaturedProducts = async (minRating = 4.5, limit = 10) => {
   try {
      const products = await getAllProducts();
      return products
         .filter((product) => product.rating >= minRating && product.stock > 0)
         .sort((a, b) => b.rating - a.rating)
         .slice(0, limit);
   } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
   }
};

export default {
   getAllProducts,
   getProductByCode,
   getProductsByCategory,
   getProductsByBrand,
   getAllBrands,
   getProductCategories,
   searchProducts,
   getProductsByRating,
   getProductsByPriceRange,
   getProductsSortedByPrice,
   getProductsSortedByRating,
   getProductsInStock,
   getFeaturedProducts,
};
