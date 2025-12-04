/**
 * Product Loader
 * Loads individual product data for React Router
 * Uses Inventario API (Spring Boot microservice)
 */

import { getProductById, getProductByCode } from "../services/inventarioService";

/**
 * Loader for a single product by ID
 * Used in product detail pages with numeric IDs
 * @param {object} params - Route parameters
 * @param {string|number} params.productId - The product ID from URL params
 * @returns {Promise<object>} - The product object
 */
export const productByIdLoader = async ({ params }) => {
  try {
    const { productId } = params;

    if (!productId) {
      throw new Error("Product ID is required");
    }

    const product = await getProductById(parseInt(productId, 10));

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    return product;
  } catch (error) {
    console.error("Error in productByIdLoader:", error);
    throw error;
  }
};

/**
 * Loader for a single product by code
 * Used in product detail pages with product codes (e.g., "JM001")
 * @param {object} params - Route parameters
 * @param {string} params.productCode - The product code from URL params
 * @returns {Promise<object>} - The product object
 */
export const productByCodeLoader = async ({ params }) => {
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
    console.error("Error in productByCodeLoader:", error);
    throw error;
  }
};

/**
 * Default loader - tries to determine if param is ID or code
 * @param {object} params - Route parameters
 * @param {string} params.productParam - The product identifier from URL
 * @returns {Promise<object>} - The product object
 */
export const productLoader = async ({ params }) => {
  try {
    const { productParam } = params;

    if (!productParam) {
      throw new Error("Product identifier is required");
    }

    // Check if param is numeric (ID) or alphanumeric (code)
    const isNumeric = /^\d+$/.test(productParam);

    if (isNumeric) {
      return await productByIdLoader({ params: { productId: productParam } });
    } else {
      return await productByCodeLoader({ params: { productCode: productParam } });
    }
  } catch (error) {
    console.error("Error in productLoader:", error);
    throw error;
  }
};

export default {
  productLoader,
  productByIdLoader,
  productByCodeLoader,
};
