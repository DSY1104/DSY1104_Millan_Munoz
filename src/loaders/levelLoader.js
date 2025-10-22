/**
 * Level Loader
 * Loads level/loyalty data for React Router
 */

import {
  getLevelsData,
  getAllLevels,
  getLevelByName,
  getLevelByPoints,
} from "../services/levelService";

/**
 * Loader for all levels data (levels + points rules)
 * Used in routes that need complete loyalty system data
 * @returns {Promise<object>} - Object with levels array and pointsPerPurchase
 */
export const levelsDataLoader = async () => {
  try {
    const data = await getLevelsData();
    return data;
  } catch (error) {
    console.error("Error in levelsDataLoader:", error);
    // Return default structure instead of throwing to prevent route breaking
    return {
      levels: [],
      pointsPerPurchase: {
        baseMultiplier: 1,
        rules: [],
      },
    };
  }
};

/**
 * Loader for just the levels array
 * Used in routes that only need level tiers
 * @returns {Promise<Array>} - Array of level objects
 */
export const levelsLoader = async () => {
  try {
    const levels = await getAllLevels();
    return levels;
  } catch (error) {
    console.error("Error in levelsLoader:", error);
    return [];
  }
};

/**
 * Loader for a single level by name
 * Used in routes that need to display level details
 * @param {object} params - Route parameters
 * @param {string} params.levelName - The level name from URL params (Bronze, Silver, Gold, Platinum)
 * @returns {Promise<object|null>} - The level object or null
 */
export const levelDetailLoader = async ({ params }) => {
  try {
    const { levelName } = params;
    if (!levelName) {
      throw new Error("Level name is required");
    }

    const level = await getLevelByName(decodeURIComponent(levelName));

    if (!level) {
      throw new Error(`Level "${levelName}" not found`);
    }

    return level;
  } catch (error) {
    console.error("Error in levelDetailLoader:", error);
    throw error;
  }
};

/**
 * Loader for user level based on points
 * Used in profile/dashboard routes to show user's current level
 * @param {object} request - Request object
 * @param {URLSearchParams} request.request.url - URL with searchParams
 * @returns {Promise<object>} - Object with level info and progress
 */
export const userLevelLoader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const pointsParam = url.searchParams.get("points");

    if (!pointsParam) {
      throw new Error("Points parameter is required");
    }

    const points = parseInt(pointsParam, 10);

    if (isNaN(points)) {
      throw new Error("Invalid points value");
    }

    const level = await getLevelByPoints(points);

    return {
      points,
      level,
    };
  } catch (error) {
    console.error("Error in userLevelLoader:", error);
    return {
      points: 0,
      level: null,
    };
  }
};

/**
 * Combined loader for user profile with level information
 * Loads both user data and their level information
 * @param {object} params - Route parameters
 * @param {string} params.userId - User ID from URL
 * @returns {Promise<object>} - Object with user and level data
 */
export const userProfileWithLevelLoader = async ({ params }) => {
  try {
    const { userId } = params;

    // In a real app, you'd fetch user data from an API
    // For now, simulating with mock data
    const mockUser = {
      id: userId,
      name: "Usuario Demo",
      email: "usuario@demo.cl",
      points: 3500, // Example points
    };

    const level = await getLevelByPoints(mockUser.points);

    return {
      user: mockUser,
      level,
    };
  } catch (error) {
    console.error("Error in userProfileWithLevelLoader:", error);
    throw error;
  }
};

export default {
  levelsDataLoader,
  levelsLoader,
  levelDetailLoader,
  userLevelLoader,
  userProfileWithLevelLoader,
};
