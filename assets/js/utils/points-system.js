/**
 * Points System Manager
 * Handles user level calculations, points management, and progress tracking
 */

import { storage } from "./storage.js";

class PointsSystem {
  constructor() {
    this.levels = [];
    this.pointsConfig = null;
    this.userPoints = this.getUserPoints();
    this.init();
  }

  async init() {
    await this.loadLevelsConfig();
  }

  async loadLevelsConfig() {
    try {
      const response = await fetch("../../assets/data/levels.json");
      const config = await response.json();
      this.levels = config.levels;
      this.pointsConfig = config.pointsPerPurchase;
    } catch (error) {
      console.error("Error loading levels configuration:", error);
      // Fallback configuration
      this.levels = [
        {
          name: "Bronze",
          minPoints: 0,
          maxPoints: 999,
          color: "#CD7F32",
          icon: "🥉",
        },
        {
          name: "Silver",
          minPoints: 1000,
          maxPoints: 2499,
          color: "#C0C0C0",
          icon: "🥈",
        },
        {
          name: "Gold",
          minPoints: 2500,
          maxPoints: 4999,
          color: "#FFD700",
          icon: "🥇",
        },
        {
          name: "Platinum",
          minPoints: 5000,
          maxPoints: null,
          color: "#E5E4E2",
          icon: "💎",
        },
      ];
    }
  }

  /**
   * Get current user points from storage
   * @returns {number} Current points
   */
  getUserPoints() {
    return storage.local.get("userPoints") || 0;
  }

  /**
   * Set user points and save to storage
   * @param {number} points - New points total
   */
  setUserPoints(points) {
    this.userPoints = Math.max(0, points);
    storage.local.set("userPoints", this.userPoints);
    this.dispatchPointsUpdateEvent();
    return this.userPoints;
  }

  /**
   * Add points to user's current total
   * @param {number} points - Points to add
   * @returns {number} New total points
   */
  addPoints(points) {
    return this.setUserPoints(this.userPoints + points);
  }

  /**
   * Calculate points earned from a purchase
   * @param {number} amount - Purchase amount in CLP
   * @returns {Object} Points calculation details
   */
  calculatePointsFromPurchase(amount) {
    if (!this.pointsConfig) {
      return { points: Math.floor(amount * 0.1), rule: "fallback" };
    }

    // Find the applicable rule (highest minAmount that's <= purchase amount)
    const applicableRule = this.pointsConfig.rules
      .filter((rule) => amount >= rule.minAmount)
      .sort((a, b) => b.minAmount - a.minAmount)[0];

    if (!applicableRule) {
      return { points: 0, rule: "none" };
    }

    const points = Math.floor(
      amount * applicableRule.pointsPerPeso * this.pointsConfig.baseMultiplier
    );

    return {
      points,
      rule: applicableRule,
      calculation: {
        amount,
        rate: applicableRule.pointsPerPeso,
        multiplier: this.pointsConfig.baseMultiplier,
      },
    };
  }

  /**
   * Get current user level based on points
   * @returns {Object} Level information
   */
  getCurrentLevel() {
    const level = this.levels.find((level) => {
      return (
        this.userPoints >= level.minPoints &&
        (level.maxPoints === null || this.userPoints <= level.maxPoints)
      );
    });

    return level || this.levels[0]; // Default to first level if none found
  }

  /**
   * Get next level information
   * @returns {Object|null} Next level or null if at max level
   */
  getNextLevel() {
    const currentLevel = this.getCurrentLevel();
    const currentLevelIndex = this.levels.findIndex(
      (level) => level.name === currentLevel.name
    );

    if (currentLevelIndex < this.levels.length - 1) {
      return this.levels[currentLevelIndex + 1];
    }

    return null; // At max level
  }

  /**
   * Calculate progress to next level
   * @returns {Object} Progress information
   */
  getProgress() {
    const currentLevel = this.getCurrentLevel();
    const nextLevel = this.getNextLevel();

    if (!nextLevel) {
      return {
        percentage: 100,
        pointsToNext: 0,
        currentLevelPoints: this.userPoints - currentLevel.minPoints,
        totalPointsNeeded: 0,
        isMaxLevel: true,
      };
    }

    const currentLevelPoints = this.userPoints - currentLevel.minPoints;
    const totalPointsNeeded = nextLevel.minPoints - currentLevel.minPoints;
    const pointsToNext = nextLevel.minPoints - this.userPoints;
    const percentage = Math.min(
      100,
      (currentLevelPoints / totalPointsNeeded) * 100
    );

    return {
      percentage,
      pointsToNext,
      currentLevelPoints,
      totalPointsNeeded,
      isMaxLevel: false,
    };
  }

  /**
   * Get complete user status including level, progress, and points
   * @returns {Object} Complete user status
   */
  getUserStatus() {
    const currentLevel = this.getCurrentLevel();
    const nextLevel = this.getNextLevel();
    const progress = this.getProgress();

    return {
      points: this.userPoints,
      currentLevel,
      nextLevel,
      progress,
      levels: this.levels,
    };
  }

  /**
   * Process a purchase and award points
   * @param {number} amount - Purchase amount
   * @param {Array} items - Purchase items (for future use)
   * @returns {Object} Transaction result
   */
  processPurchase(amount, items = []) {
    const pointsCalculation = this.calculatePointsFromPurchase(amount);
    const previousLevel = this.getCurrentLevel();
    const previousPoints = this.userPoints;

    this.addPoints(pointsCalculation.points);

    const newLevel = this.getCurrentLevel();
    const leveledUp = previousLevel.name !== newLevel.name;

    // Save purchase history
    this.savePurchaseHistory({
      amount,
      items: items.length,
      pointsEarned: pointsCalculation.points,
      timestamp: new Date().toISOString(),
      previousLevel: previousLevel.name,
      newLevel: newLevel.name,
      leveledUp,
    });

    return {
      pointsEarned: pointsCalculation.points,
      previousPoints,
      newPoints: this.userPoints,
      previousLevel,
      newLevel,
      leveledUp,
      calculation: pointsCalculation,
    };
  }

  /**
   * Save purchase to history
   * @param {Object} purchase - Purchase details
   */
  savePurchaseHistory(purchase) {
    const history = storage.local.get("purchaseHistory") || [];
    history.unshift(purchase); // Add to beginning

    // Keep only last 50 purchases
    if (history.length > 50) {
      history.splice(50);
    }

    storage.local.set("purchaseHistory", history);
  }

  /**
   * Get purchase history
   * @returns {Array} Purchase history
   */
  getPurchaseHistory() {
    return storage.local.get("purchaseHistory") || [];
  }

  /**
   * Dispatch custom event when points are updated
   */
  dispatchPointsUpdateEvent() {
    const event = new CustomEvent("pointsUpdated", {
      detail: this.getUserStatus(),
    });
    document.dispatchEvent(event);
  }

  /**
   * Reset user points (for testing/admin purposes)
   */
  resetPoints() {
    this.setUserPoints(0);
    storage.local.remove("purchaseHistory");
  }

  /**
   * Set points for testing purposes
   * @param {number} points - Points to set
   */
  setPointsForTesting(points) {
    this.setUserPoints(points);
  }
}

// Create singleton instance
const pointsSystem = new PointsSystem();

// Export both the class and instance
export { PointsSystem, pointsSystem };
