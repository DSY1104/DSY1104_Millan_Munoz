/**
 * Catalog Loader
 * Loads product catalog data for React Router
 * Updated to use Inventario API (Spring Boot microservice)
 */

import {
  getActiveProducts,
  getProductByCode,
  getProductsByCategory,
  searchProducts,
  getUniqueBrands,
} from "../services/inventarioService";
import { getAllCategories } from "../services/inventarioService";

/**
 * Loader for all active products
 * Used in catalog/products list pages
 * @returns {Promise<Array>} - Array of active product objects
 */
export const catalogLoader = async () => {
  try {
    const products = await getActiveProducts();
    return products || [];
  } catch (error) {
    console.error("Error in catalogLoader:", error);
    // Return empty array instead of throwing to prevent route breaking
    return [];
  }
};

/**
 * Loader for a single product by code
 * Used in product detail pages
 * @param {object} params - Route parameters
 * @param {string} params.productCode - The product code from URL params
 * @returns {Promise<object|null>} - The product object or null
 */
export const productDetailLoader = async ({ params }) => {
  try {
    const { productCode } = params;
    if (!productCode) {
      throw new Error("Product code is required");
    }

    const product = await getProductByCode(productCode);

    if (!product) {
      throw new Error(`Product "${productCode}" not found`);
    }

    return product;
  } catch (error) {
    console.error("Error in productDetailLoader:", error);
    throw error;
  }
};

/**
 * Loader for products by category
 * Used in category pages
 * @param {object} params - Route parameters
 * @param {string} params.categoryId - The category ID from URL params
 * @returns {Promise<Array>} - Array of product objects in that category
 */
export const categoryProductsLoader = async ({ params }) => {
  try {
    const { categoryId } = params;
    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    const products = await getProductsByCategory(categoryId);
    return products;
  } catch (error) {
    console.error("Error in categoryProductsLoader:", error);
    return [];
  }
};

/**
 * Combined loader for catalog page with filters data
 * Loads products, categories, and derives brands from products
 * @returns {Promise<object>} - Object with products, categories, and brands
 */
export const catalogWithFiltersLoader = async () => {
  try {
    const [products, categories] = await Promise.all([
      getActiveProducts(),
      getAllCategories(),
    ]);

    // Derive unique brands from products
    const brands = getUniqueBrands(products || []);

    return {
      products: products || [],
      categories: categories || [],
      brands,
    };
  } catch (error) {
    console.error("Error in catalogWithFiltersLoader:", error);
    return {
      products: [],
      categories: [],
      brands: [],
    };
  }
};

/**
 * Loader for search results
 * Gets search query from URL search params and uses Inventario API search
 * @param {object} request - Request object
 * @param {URL} request.request.url - URL with search params
 * @returns {Promise<object>} - Object with search results and query
 */
export const searchResultsLoader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";

    let products = [];

    // Use API search if query exists, otherwise get all active products
    if (query.trim()) {
      products = await searchProducts(query);
    } else {
      products = await getActiveProducts();
    }

    return {
      products: products || [],
      query,
    };
  } catch (error) {
    console.error("Error in searchResultsLoader:", error);
    return {
      products: [],
      query: "",
    };
  }
};

export default {
  catalogLoader,
  productDetailLoader,
  categoryProductsLoader,
  catalogWithFiltersLoader,
  searchResultsLoader,
};
