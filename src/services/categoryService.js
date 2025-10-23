/**
 * Category Service
 * Handles all category-related API calls
 */

// Category data - centralized source
const CATEGORIES = [
  { id: "JM", nombre: "Juegos de Mesa" },
  { id: "AC", nombre: "Accesorios" },
  { id: "CO", nombre: "Consolas" },
  { id: "CG", nombre: "Computadores Gamers" },
  { id: "SG", nombre: "Sillas Gamers" },
  { id: "MS", nombre: "Mouse" },
  { id: "MP", nombre: "Mousepad" },
  { id: "PP", nombre: "Poleras Personalizadas" },
  { id: "PG", nombre: "Polerones Gamers Personalizados" },
  { id: "ST", nombre: "Servicio Técnico" },
  { id: "FA", nombre: "Fuentes de Alimentación" },
];

/**
 * Fetch all categories
 * Returns the categories array (simulates async API call)
 * @returns {Promise<Array>} - Array of category objects
 */
export const getAllCategories = async () => {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return [...CATEGORIES];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Fetch a single category by ID
 * @param {string} id - The category ID (e.g., 'JM', 'AC')
 * @returns {Promise<object|null>} - The category object or null if not found
 */
export const getCategoryById = async (id) => {
  try {
    const categories = await getAllCategories();
    return categories.find((category) => category.id === id) || null;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch category by name (partial match)
 * @param {string} name - The category name or partial name
 * @returns {Promise<Array>} - Array of matching category objects
 */
export const getCategoriesByName = async (name) => {
  try {
    const categories = await getAllCategories();
    const searchTerm = name.toLowerCase();
    return categories.filter((category) =>
      category.nombre.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error(`Error searching categories for "${name}":`, error);
    throw error;
  }
};

/**
 * Get all category IDs
 * @returns {Promise<Array>} - Array of category ID strings
 */
export const getCategoryIds = async () => {
  try {
    const categories = await getAllCategories();
    return categories.map((category) => category.id);
  } catch (error) {
    console.error("Error fetching category IDs:", error);
    throw error;
  }
};

/**
 * Get all category names
 * @returns {Promise<Array>} - Array of category name strings
 */
export const getCategoryNames = async () => {
  try {
    const categories = await getAllCategories();
    return categories.map((category) => category.nombre);
  } catch (error) {
    console.error("Error fetching category names:", error);
    throw error;
  }
};

/**
 * Get category mapping (ID -> Name)
 * @returns {Promise<object>} - Object with category IDs as keys and names as values
 */
export const getCategoryMap = async () => {
  try {
    const categories = await getAllCategories();
    const map = {};
    categories.forEach((category) => {
      map[category.id] = category.nombre;
    });
    return map;
  } catch (error) {
    console.error("Error creating category map:", error);
    throw error;
  }
};

/**
 * Check if a category ID exists
 * @param {string} id - The category ID to check
 * @returns {Promise<boolean>} - True if category exists, false otherwise
 */
export const categoryExists = async (id) => {
  try {
    const category = await getCategoryById(id);
    return category !== null;
  } catch (error) {
    console.error(`Error checking if category ${id} exists:`, error);
    return false;
  }
};

/**
 * Get categories count
 * @returns {Promise<number>} - Total number of categories
 */
export const getCategoriesCount = async () => {
  try {
    const categories = await getAllCategories();
    return categories.length;
  } catch (error) {
    console.error("Error getting categories count:", error);
    return 0;
  }
};

export default {
  getAllCategories,
  getCategoryById,
  getCategoriesByName,
  getCategoryIds,
  getCategoryNames,
  getCategoryMap,
  categoryExists,
  getCategoriesCount,
};
