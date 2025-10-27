/**
 * Blog Service
 * Handles all blog article-related API calls
 */

/**
 * Fetch all blog articles
 * Simulates an API call by fetching the local JSON file
 * @returns {Promise<Array>} - Array of blog article objects
 */
export const getAllArticles = async () => {
  try {
    // Obtener la lista de slugs de los archivos en /public/data/blogPosts
    const slugs = [
      "auriculares-gaming-2025",
      "borderlands-4-preview",
      "gaming-trends-2025",
      "monitores-4k-gaming",
      "ps5-pro-review",
      "setup-gaming-completo"
    ];
    const articles = await Promise.all(
      slugs.map(async (slug) => {
        const response = await fetch(`/data/blogPosts/${slug}.json`);
        if (!response.ok) return null;
        const data = await response.json();
        // Añade el slug como propiedad
        return { ...data, slug };
      })
    );
    // Simula delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Filtra nulos por si algún fetch falló
    return articles.filter(Boolean);
  } catch (error) {
    console.error("Error fetching blog articles:", error);
    throw error;
  }
};

/**
 * Fetch a single article by slug
 * @param {string} slug - The article slug
 * @returns {Promise<object|null>} - The article object or null if not found
 */
export const getArticleBySlug = async (slug) => {
  try {
    const articles = await getAllArticles();
    return articles.find((article) => article.slug === slug) || null;
  } catch (error) {
    console.error(`Error fetching article ${slug}:`, error);
    throw error;
  }
};

/**
 * Fetch a single article by ID
 * @param {number} id - The article ID
 * @returns {Promise<object|null>} - The article object or null if not found
 */
export const getArticleById = async (id) => {
  try {
    const articles = await getAllArticles();
    return articles.find((article) => article.id === id) || null;
  } catch (error) {
    console.error(`Error fetching article with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch articles by category
 * @param {string} category - The category to filter by
 * @returns {Promise<Array>} - Array of article objects in that category
 */
export const getArticlesByCategory = async (category) => {
  try {
    const articles = await getAllArticles();
    return articles.filter((article) => article.category === category);
  } catch (error) {
    console.error(`Error fetching articles for category ${category}:`, error);
    throw error;
  }
};

/**
 * Get featured articles
 * @returns {Promise<Array>} - Array of featured article objects
 */
export const getFeaturedArticles = async () => {
  try {
    const articles = await getAllArticles();
    return articles.filter((article) => article.featured === true);
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    throw error;
  }
};

/**
 * Get all unique categories from articles
 * @returns {Promise<Array>} - Array of unique category strings
 */
export const getArticleCategories = async () => {
  try {
    const articles = await getAllArticles();
    const categories = new Set();
    articles.forEach((article) => {
      if (article.category) {
        categories.add(article.category);
      }
    });
    return Array.from(categories).sort();
  } catch (error) {
    console.error("Error fetching article categories:", error);
    throw error;
  }
};

/**
 * Get articles sorted by date
 * @param {string} order - 'asc' or 'desc'
 * @returns {Promise<Array>} - Array of sorted article objects
 */
export const getArticlesSortedByDate = async (order = "desc") => {
  try {
    const articles = await getAllArticles();
    return articles.slice().sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  } catch (error) {
    console.error("Error sorting articles by date:", error);
    throw error;
  }
};

/**
 * Search articles by title or description
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of matching article objects
 */
export const searchArticles = async (query) => {
  try {
    const articles = await getAllArticles();

    if (!query || query.trim() === "") {
      return articles;
    }

    const searchTerm = query.toLowerCase();

    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.description.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error(`Error searching articles for "${query}":`, error);
    throw error;
  }
};

/**
 * Get recent articles
 * @param {number} limit - Maximum number of articles to return
 * @returns {Promise<Array>} - Array of recent article objects
 */
export const getRecentArticles = async (limit = 5) => {
  try {
    const articles = await getArticlesSortedByDate("desc");
    return articles.slice(0, limit);
  } catch (error) {
    console.error("Error fetching recent articles:", error);
    throw error;
  }
};

export default {
  getAllArticles,
  getArticleBySlug,
  getArticleById,
  getArticlesByCategory,
  getFeaturedArticles,
  getArticleCategories,
  getArticlesSortedByDate,
  searchArticles,
  getRecentArticles,
};
