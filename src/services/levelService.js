/**
 * Level Service
 * Handles all level/loyalty-related API calls
 */

/**
 * Fetch all levels data including level tiers and points rules
 * Simulates an API call by fetching the local JSON file
 * @returns {Promise<object>} - Object containing levels array and pointsPerPurchase rules
 */
export const getLevelsData = async () => {
  try {
    // In a real scenario, this would be an API endpoint like '/api/levels'
    // For now, we're simulating by fetching the local JSON file
    const response = await fetch("/src/assets/data/levels.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return data;
  } catch (error) {
    console.error("Error fetching levels data:", error);
    throw error;
  }
};

/**
 * Fetch all level tiers
 * @returns {Promise<Array>} - Array of level objects
 */
export const getAllLevels = async () => {
  try {
    const data = await getLevelsData();
    return data.levels || [];
  } catch (error) {
    console.error("Error fetching levels:", error);
    throw error;
  }
};

/**
 * Get a specific level by name
 * @param {string} name - The level name (Bronze, Silver, Gold, Platinum)
 * @returns {Promise<object|null>} - The level object or null if not found
 */
export const getLevelByName = async (name) => {
  try {
    const levels = await getAllLevels();
    return (
      levels.find((level) => level.name.toLowerCase() === name.toLowerCase()) ||
      null
    );
  } catch (error) {
    console.error(`Error fetching level ${name}:`, error);
    throw error;
  }
};

/**
 * Get level by points
 * Determines which level a user belongs to based on their points
 * @param {number} points - User's current points
 * @returns {Promise<object|null>} - The level object or null if not found
 */
export const getLevelByPoints = async (points) => {
  try {
    const levels = await getAllLevels();

    // Find the level that matches the points range
    const level = levels.find((level) => {
      const isAboveMin = points >= level.minPoints;
      const isBelowMax = level.maxPoints === null || points <= level.maxPoints;
      return isAboveMin && isBelowMax;
    });

    return level || null;
  } catch (error) {
    console.error(`Error fetching level for ${points} points:`, error);
    throw error;
  }
};

/**
 * Get points calculation rules
 * @returns {Promise<object>} - Object containing points rules
 */
export const getPointsRules = async () => {
  try {
    const data = await getLevelsData();
    return data.pointsPerPurchase || {};
  } catch (error) {
    console.error("Error fetching points rules:", error);
    throw error;
  }
};

/**
 * Calculate points earned from a purchase
 * @param {number} purchaseAmount - The purchase amount in pesos
 * @returns {Promise<number>} - Points earned
 */
export const calculatePointsForPurchase = async (purchaseAmount) => {
  try {
    const pointsRules = await getPointsRules();
    const rules = pointsRules.rules || [];

    // Find the applicable rule (highest minAmount that's still <= purchaseAmount)
    const applicableRule = rules
      .filter((rule) => purchaseAmount >= rule.minAmount)
      .sort((a, b) => b.minAmount - a.minAmount)[0];

    if (!applicableRule) {
      return 0;
    }

    const baseMultiplier = pointsRules.baseMultiplier || 1;
    const points = Math.floor(
      purchaseAmount * applicableRule.pointsPerPeso * baseMultiplier
    );

    return points;
  } catch (error) {
    console.error("Error calculating points:", error);
    return 0;
  }
};

/**
 * Calculate points needed to reach next level
 * @param {number} currentPoints - User's current points
 * @returns {Promise<object>} - Object with current level, next level, and points needed
 */
export const getPointsToNextLevel = async (currentPoints) => {
  try {
    const levels = await getAllLevels();
    const currentLevel = await getLevelByPoints(currentPoints);

    if (!currentLevel) {
      return {
        currentLevel: null,
        nextLevel: null,
        pointsNeeded: 0,
        progress: 0,
      };
    }

    // If max level (maxPoints is null), no next level
    if (currentLevel.maxPoints === null) {
      return {
        currentLevel,
        nextLevel: null,
        pointsNeeded: 0,
        progress: 100,
      };
    }

    // Find next level
    const nextLevel = levels.find(
      (level) => level.minPoints > currentLevel.maxPoints
    );

    if (!nextLevel) {
      return {
        currentLevel,
        nextLevel: null,
        pointsNeeded: 0,
        progress: 100,
      };
    }

    const pointsNeeded = nextLevel.minPoints - currentPoints;
    const levelRange = currentLevel.maxPoints - currentLevel.minPoints + 1;
    const pointsInLevel = currentPoints - currentLevel.minPoints;
    const progress = Math.floor((pointsInLevel / levelRange) * 100);

    return {
      currentLevel,
      nextLevel,
      pointsNeeded,
      progress,
    };
  } catch (error) {
    console.error("Error calculating points to next level:", error);
    throw error;
  }
};

/**
 * Get all level names
 * @returns {Promise<Array>} - Array of level name strings
 */
export const getLevelNames = async () => {
  try {
    const levels = await getAllLevels();
    return levels.map((level) => level.name);
  } catch (error) {
    console.error("Error fetching level names:", error);
    throw error;
  }
};

export default {
  getLevelsData,
  getAllLevels,
  getLevelByName,
  getLevelByPoints,
  getPointsRules,
  calculatePointsForPurchase,
  getPointsToNextLevel,
  getLevelNames,
};
