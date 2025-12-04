/**
 * Category Loader
 * Loads category data for React Router
 * Updated to use Inventario API (Spring Boot microservice)
 */

import {
  getAllCategories,
  getCategoryById,
  getCategoryMap,
} from "../services/inventarioService";

/**
 * Loader for all categories
 * Used in routes that need to display category lists
 * @returns {Promise<Array>} - Array of category objects from Inventario API
 */
export const categoriesLoader = async () => {
  try {
    const categories = await getAllCategories();
    return categories || [];
  } catch (error) {
    console.error("Error in categoriesLoader:", error);
    // Return empty array instead of throwing to prevent route breaking
    return [];
  }
};

/**
 * Loader for a single category by ID
 * Used in routes that need to display category details
 * @param {object} params - Route parameters
 * @param {string} params.categoryId - The category ID from URL params
 * @returns {Promise<object|null>} - The category object or null
 */
export const categoryDetailLoader = async ({ params }) => {
  try {
    const { categoryId } = params;
    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    const category = await getCategoryById(categoryId);

    if (!category) {
      throw new Error(`Category "${categoryId}" not found`);
    }

    return category;
  } catch (error) {
    console.error("Error in categoryDetailLoader:", error);
    throw error;
  }
};

/**
 * Loader for category map (ID -> Name mapping)
 * Used in routes that need to quickly lookup category names by ID
 * @returns {Promise<object>} - Object with category IDs as keys and names as values
 */
export const categoryMapLoader = async () => {
  try {
    const categories = await getAllCategories();
    const map = getCategoryMap(categories || []);
    return map;
  } catch (error) {
    console.error("Error in categoryMapLoader:", error);
    return {};
  }
};

/**
 * Combined loader for categories with metadata
 * Useful for displaying categories with product statistics
 * @returns {Promise<object>} - Object with categories and metadata from Inventario API
 */
export const categoriesWithMetaLoader = async () => {
  try {
    const categories = await getAllCategories();

    return {
      categories: categories || [],
      total: categories?.length || 0,
    };
  } catch (error) {
    console.error("Error in categoriesWithMetaLoader:", error);
    return {
      categories: [],
      total: 0,
    };
  }
};

export default {
  categoriesLoader,
  categoryDetailLoader,
  categoryMapLoader,
  categoriesWithMetaLoader,
};
