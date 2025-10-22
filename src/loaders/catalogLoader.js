/**
 * Catalog Loader
 * Loads product catalog data for React Router
 */

import {
  getAllProducts,
  getProductByCode,
  getProductsByCategory,
  getAllBrands,
} from "../services/catalogService";

/**
 * Loader for all products
 * Used in catalog/products list pages
 * @returns {Promise<Array>} - Array of product objects
 */
export const catalogLoader = async () => {
  try {
    const products = await getAllProducts();
    return products;
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
 * Loads both products and filter options (brands, categories)
 * @returns {Promise<object>} - Object with products and filter data
 */
export const catalogWithFiltersLoader = async () => {
  try {
    const [products, brands] = await Promise.all([
      getAllProducts(),
      getAllBrands(),
    ]);

    return {
      products,
      brands,
    };
  } catch (error) {
    console.error("Error in catalogWithFiltersLoader:", error);
    return {
      products: [],
      brands: [],
    };
  }
};

/**
 * Loader for search results
 * Gets search query from URL search params
 * @param {object} request - Request object
 * @param {URL} request.request.url - URL with search params
 * @returns {Promise<object>} - Object with search results and query
 */
export const searchResultsLoader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";

    const products = await getAllProducts();

    // Client-side filtering will be done in component
    // but we can pre-load all products
    return {
      products,
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
