/**
 * Inventario Service
 * Handles all product catalog and category operations
 * Integrates with Inventario API (Spring Boot microservice on port 8082)
 */

import { get, post, put, patch, del } from "./api";

/**
 * ============================================
 * PRODUCT OPERATIONS - PUBLIC ENDPOINTS
 * ============================================
 */

/**
 * Get all products from the catalog
 * @returns {Promise<Array>} - Array of all products
 */
export const getAllProducts = async () => {
   try {
      const response = await get("/productos");
      return response;
   } catch (error) {
      console.error("[InventarioService] Error fetching all products:", error);
      throw error;
   }
};

/**
 * Get only active products (isActivo = true)
 * @returns {Promise<Array>} - Array of active products
 */
export const getActiveProducts = async () => {
   try {
      const response = await get("/productos/activos");
      return response;
   } catch (error) {
      console.error("[InventarioService] Error fetching active products:", error);
      throw error;
   }
};

/**
 * Get product by ID
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} - Product object
 */
export const getProductById = async (productId) => {
   try {
      const response = await get(`/productos/${productId}`);
      return response;
   } catch (error) {
      console.error(`[InventarioService] Error fetching product ${productId}:`, error);
      throw error;
   }
};

/**
 * Get product by code
 * @param {string} code - Product code (e.g., "JM001")
 * @returns {Promise<Object>} - Product object
 */
export const getProductByCode = async (code) => {
   try {
      const response = await get(`/productos/code/${code}`);
      return response;
   } catch (error) {
      console.error(`[InventarioService] Error fetching product by code ${code}:`, error);
      throw error;
   }
};

/**
 * Search products by name (case-insensitive partial match)
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} - Array of matching products
 */
export const searchProducts = async (searchTerm) => {
   try {
      const response = await get(`/productos/buscar?nombre=${encodeURIComponent(searchTerm)}`);
      return response;
   } catch (error) {
      console.error(`[InventarioService] Error searching products with term "${searchTerm}":`, error);
      throw error;
   }
};

/**
 * Get products by category
 * @param {string} categoryId - Category ID (e.g., "JM", "AC", "CO")
 * @returns {Promise<Array>} - Array of products in category
 */
export const getProductsByCategory = async (categoryId) => {
   try {
      const response = await get(`/productos/categoria/${categoryId}`);
      return response;
   } catch (error) {
      console.error(`[InventarioService] Error fetching products for category ${categoryId}:`, error);
      throw error;
   }
};

/**
 * Get products by brand
 * @param {string} brand - Brand name
 * @returns {Promise<Array>} - Array of products from brand
 */
export const getProductsByBrand = async (brand) => {
   try {
      const response = await get(`/productos/marca/${encodeURIComponent(brand)}`);
      return response;
   } catch (error) {
      console.error(`[InventarioService] Error fetching products by brand ${brand}:`, error);
      throw error;
   }
};

/**
 * Get products in stock (stock > 0)
 * @returns {Promise<Array>} - Array of in-stock products
 */
export const getProductsInStock = async () => {
   try {
      const response = await get("/productos/en-stock");
      return response;
   } catch (error) {
      console.error("[InventarioService] Error fetching in-stock products:", error);
      throw error;
   }
};

/**
 * Get products by price range
 * @param {number} minPrice - Minimum price (CLP)
 * @param {number} maxPrice - Maximum price (CLP)
 * @returns {Promise<Array>} - Array of products in price range
 */
export const getProductsByPriceRange = async (minPrice, maxPrice) => {
   try {
      const response = await get(`/productos/precio?min=${minPrice}&max=${maxPrice}`);
      return response;
   } catch (error) {
      console.error(`[InventarioService] Error fetching products by price range ${minPrice}-${maxPrice}:`, error);
      throw error;
   }
};

/**
 * Get products by minimum rating
 * @param {number} minRating - Minimum rating (0.0 - 5.0)
 * @returns {Promise<Array>} - Array of products with rating >= minRating
 */
export const getProductsByRating = async (minRating) => {
   try {
      const response = await get(`/productos/rating?min=${minRating}`);
      return response;
   } catch (error) {
      console.error(`[InventarioService] Error fetching products by rating ${minRating}:`, error);
      throw error;
   }
};

/**
 * Get products by tag (JSONB query)
 * @param {string} tag - Tag name
 * @returns {Promise<Array>} - Array of products with tag
 */
export const getProductsByTag = async (tag) => {
   try {
      const response = await get(`/productos/tag/${encodeURIComponent(tag)}`);
      return response;
   } catch (error) {
      console.error(`[InventarioService] Error fetching products by tag ${tag}:`, error);
      throw error;
   }
};

/**
 * ============================================
 * CATEGORY OPERATIONS - PUBLIC ENDPOINTS
 * ============================================
 */

/**
 * Get all categories
 * @returns {Promise<Array>} - Array of all categories
 */
export const getAllCategories = async () => {
   try {
      const response = await get("/categorias");
      return response;
   } catch (error) {
      console.error("[InventarioService] Error fetching all categories:", error);
      throw error;
   }
};

/**
 * Get category by ID
 * @param {string} categoryId - Category ID (e.g., "JM")
 * @returns {Promise<Object>} - Category object
 */
export const getCategoryById = async (categoryId) => {
   try {
      const response = await get(`/categorias/${categoryId}`);
      return response;
   } catch (error) {
      console.error(`[InventarioService] Error fetching category ${categoryId}:`, error);
      throw error;
   }
};

/**
 * Search categories by name (case-insensitive partial match)
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} - Array of matching categories
 */
export const searchCategories = async (searchTerm) => {
   try {
      const response = await get(`/categorias/buscar?nombre=${encodeURIComponent(searchTerm)}`);
      return response;
   } catch (error) {
      console.error(`[InventarioService] Error searching categories with term "${searchTerm}":`, error);
      throw error;
   }
};

/**
 * ============================================
 * ADVANCED FILTERING
 * ============================================
 */

/**
 * Get products with multiple filters applied
 * This is a client-side filtering helper that fetches active products
 * and applies multiple filters
 *
 * @param {Object} filters - Filter options
 * @param {string} [filters.category] - Category ID
 * @param {string} [filters.brand] - Brand name
 * @param {number} [filters.minPrice] - Minimum price (CLP)
 * @param {number} [filters.maxPrice] - Maximum price (CLP)
 * @param {number} [filters.minRating] - Minimum rating
 * @param {string} [filters.searchTerm] - Search term for name
 * @param {string} [filters.tag] - Tag to filter by
 * @param {boolean} [filters.inStock] - Only in-stock products
 * @returns {Promise<Array>} - Filtered products
 */
export const getFilteredProducts = async (filters = {}) => {
   try {
      let products = [];

      // Determine which endpoint to use based on filters
      if (filters.category) {
         products = await getProductsByCategory(filters.category);
      } else if (filters.brand) {
         products = await getProductsByBrand(filters.brand);
      } else if (filters.tag) {
         products = await getProductsByTag(filters.tag);
      } else if (filters.searchTerm) {
         products = await searchProducts(filters.searchTerm);
      } else if (filters.minPrice && filters.maxPrice) {
         products = await getProductsByPriceRange(filters.minPrice, filters.maxPrice);
      } else if (filters.minRating) {
         products = await getProductsByRating(filters.minRating);
      } else if (filters.inStock) {
         products = await getProductsInStock();
      } else {
         products = await getActiveProducts();
      }

      // Apply additional client-side filters if needed
      let filteredProducts = [...products];

      // Filter by price range if not already filtered by API
      if (filters.minPrice && filters.maxPrice && !filters.minPrice && !filters.maxPrice) {
         filteredProducts = filteredProducts.filter(
            (p) => p.precioCLP >= filters.minPrice && p.precioCLP <= filters.maxPrice
         );
      }

      // Filter by rating if not already filtered by API
      if (filters.minRating && !filters.minRating) {
         filteredProducts = filteredProducts.filter((p) => p.rating >= filters.minRating);
      }

      // Filter by stock if not already filtered by API
      if (filters.inStock && !filters.inStock) {
         filteredProducts = filteredProducts.filter((p) => p.stock > 0);
      }

      // Filter by brand if not primary filter
      if (filters.brand && !filters.brand) {
         filteredProducts = filteredProducts.filter((p) => p.marca?.toLowerCase() === filters.brand.toLowerCase());
      }

      return filteredProducts;
   } catch (error) {
      console.error("[InventarioService] Error fetching filtered products:", error);
      throw error;
   }
};

/**
 * ============================================
 * UTILITY FUNCTIONS
 * ============================================
 */

/**
 * Get unique brands from products
 * @param {Array} products - Array of products
 * @returns {Array<string>} - Sorted array of unique brand names
 */
export const getUniqueBrands = (products) => {
   const brands = [...new Set(products.map((p) => p.marca).filter(Boolean))];
   return brands.sort();
};

/**
 * Get price range from products
 * @param {Array} products - Array of products
 * @returns {Object} - {min: number, max: number}
 */
export const getPriceRange = (products) => {
   if (!products.length) return { min: 0, max: 0 };
   const prices = products.map((p) => p.precioCLP);
   return {
      min: Math.min(...prices),
      max: Math.max(...prices),
   };
};

/**
 * Get all unique tags from products
 * @param {Array} products - Array of products
 * @returns {Array<string>} - Sorted array of unique tags
 */
export const getUniqueTags = (products) => {
   const tags = new Set();
   products.forEach((product) => {
      if (product.tags && Array.isArray(product.tags)) {
         product.tags.forEach((tag) => tags.add(tag));
      }
   });
   return Array.from(tags).sort();
};

/**
 * Get category mapping (ID -> Name) from categories
 * @param {Array} categories - Array of category objects
 * @returns {Object} - Object with category IDs as keys and names as values
 */
export const getCategoryMap = (categories) => {
   const map = {};
   categories.forEach((category) => {
      map[category.idCategoria] = category.nombreCategoria;
   });
   return map;
};

export default {
   // Products
   getAllProducts,
   getActiveProducts,
   getProductById,
   getProductByCode,
   searchProducts,
   getProductsByCategory,
   getProductsByBrand,
   getProductsInStock,
   getProductsByPriceRange,
   getProductsByRating,
   getProductsByTag,
   getFilteredProducts,
   // Categories
   getAllCategories,
   getCategoryById,
   searchCategories,
   // Utilities
   getUniqueBrands,
   getPriceRange,
   getUniqueTags,
   getCategoryMap,
};
