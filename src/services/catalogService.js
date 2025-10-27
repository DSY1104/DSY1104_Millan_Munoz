/**
 * Catalog Service
 * Handles all product catalog-related API calls
 */

/**
 * Fetch all products
 * Simulates an API call by fetching the local JSON file
 * @returns {Promise<Array>} - Array of product objects
 */
export const getAllProducts = async () => {
  try {
    // In a real scenario, this would be an API endpoint like '/api/products'
    // For now, we're simulating by fetching the local JSON file
  const response = await fetch("/data/products.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Add index for sorting stability
    return data.map((product, index) => ({ ...product, _idx: index }));
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
    const products = await getAllProducts();
    return products.find((product) => product.code === code) || null;
  } catch (error) {
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
    const products = await getAllProducts();
    return products.filter((product) => product.categoriaId === categoryId);
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
    const products = await getAllProducts();
    return products.filter((product) => product.marca === brand);
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
      if (
        product.marca &&
        typeof product.marca === "string" &&
        product.marca.trim() !== ""
      ) {
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
    const products = await getAllProducts();

    if (!query || query.trim() === "") {
      return products;
    }

    const normalizedQuery = normalizeText(query);

    return products.filter(
      (product) =>
        normalizeText(product.nombre).includes(normalizedQuery) ||
        normalizeText(product.code).includes(normalizedQuery)
    );
  } catch (error) {
    console.error(`Error searching products for "${query}":`, error);
    throw error;
  }
};

/**
 * Filter products by rating
 * @param {number} minRating - Minimum rating (inclusive)
 * @param {number} maxRating - Maximum rating (exclusive)
 * @returns {Promise<Array>} - Array of product objects within rating range
 */
export const getProductsByRating = async (
  minRating,
  maxRating = minRating + 1
) => {
  try {
    const products = await getAllProducts();
    return products.filter(
      (product) =>
        typeof product.rating === "number" &&
        product.rating >= minRating &&
        product.rating < maxRating
    );
  } catch (error) {
    console.error(
      `Error fetching products by rating ${minRating}-${maxRating}:`,
      error
    );
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
    const products = await getAllProducts();
    return products.filter(
      (product) =>
        product.precioCLP >= minPrice && product.precioCLP <= maxPrice
    );
  } catch (error) {
    console.error(
      `Error fetching products by price range ${minPrice}-${maxPrice}:`,
      error
    );
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
    const products = await getAllProducts();
    return products.filter((product) => product.stock > 0);
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

/**
 * Normalize text for search (remove accents and convert to lowercase)
 * @param {string} str - Text to normalize
 * @returns {string} - Normalized text
 */
function normalizeText(str) {
  return str
    ? str
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
    : "";
}

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
