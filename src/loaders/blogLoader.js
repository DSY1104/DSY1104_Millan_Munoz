/**
 * Blog Loader
 * Loads blog article data for React Router
 */

import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getFeaturedArticles,
} from "../services/blogService";

/**
 * Loader for all blog articles
 * Used in blog list/index pages
 * @returns {Promise<Array>} - Array of article objects
 */
export const blogLoader = async () => {
  try {
    const articles = await getAllArticles();
    return articles;
  } catch (error) {
    console.error("Error in blogLoader:", error);
    // Return empty array instead of throwing to prevent route breaking
    return [];
  }
};

/**
 * Loader for a single article by slug
 * Used in article detail pages
 * @param {object} params - Route parameters
 * @param {string} params.slug - The article slug from URL params
 * @returns {Promise<object|null>} - The article object or null
 */
export const articleDetailLoader = async ({ params }) => {
  try {
    const { slug } = params;
    if (!slug) {
      throw new Error("Article slug is required");
    }

    const article = await getArticleBySlug(slug);

    if (!article) {
      throw new Error(`Article "${slug}" not found`);
    }

    return article;
  } catch (error) {
    console.error("Error in articleDetailLoader:", error);
    throw error;
  }
};

/**
 * Loader for articles by category
 * Used in category-specific blog pages
 * @param {object} params - Route parameters
 * @param {string} params.category - The category from URL params
 * @returns {Promise<Array>} - Array of article objects in that category
 */
export const categoryArticlesLoader = async ({ params }) => {
  try {
    const { category } = params;
    if (!category) {
      throw new Error("Category is required");
    }

    const articles = await getArticlesByCategory(category);
    return articles;
  } catch (error) {
    console.error("Error in categoryArticlesLoader:", error);
    return [];
  }
};

/**
 * Loader for featured articles
 * Used in homepage or featured sections
 * @returns {Promise<Array>} - Array of featured article objects
 */
export const featuredArticlesLoader = async () => {
  try {
    const articles = await getFeaturedArticles();
    return articles;
  } catch (error) {
    console.error("Error in featuredArticlesLoader:", error);
    return [];
  }
};

export default {
  blogLoader,
  articleDetailLoader,
  categoryArticlesLoader,
  featuredArticlesLoader,
};
