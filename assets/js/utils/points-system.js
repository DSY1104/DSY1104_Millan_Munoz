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

  /**
   * Get coupon tiers configuration
   * @returns {Array} Coupon tiers with point costs and values
   */
  getCouponTiers() {
    return [
      {
        name: "Bronze",
        pointsCost: 1000,
        couponValue: 1000, // CLP
        color: "#CD7F32",
        icon: "🥉",
        description: "Cupón de $1.000 CLP"
      },
      {
        name: "Silver", 
        pointsCost: 2500,
        couponValue: 2000, // CLP
        color: "#C0C0C0",
        icon: "🥈",
        description: "Cupón de $2.000 CLP"
      },
      {
        name: "Gold",
        pointsCost: 5000,
        couponValue: 5000, // CLP
        color: "#FFD700",
        icon: "🥇",
        description: "Cupón de $5.000 CLP"
      },
      {
        name: "Platinum",
        pointsCost: 10000,
        couponValue: 10000, // CLP
        color: "#E5E4E2",
        icon: "💎",
        description: "Cupón de $10.000 CLP"
      }
    ];
  }

  /**
   * Exchange points for a coupon
   * @param {string} tierName - The coupon tier to exchange for
   * @returns {Object} Exchange result
   */
  exchangePointsForCoupon(tierName) {
    const tiers = this.getCouponTiers();
    const tier = tiers.find(t => t.name === tierName);
    
    if (!tier) {
      return {
        success: false,
        error: "Tier de cupón no válido"
      };
    }

    if (this.userPoints < tier.pointsCost) {
      return {
        success: false,
        error: `Necesitas ${tier.pointsCost} puntos para este cupón. Tienes ${this.userPoints} puntos.`
      };
    }

    // Deduct points
    const previousPoints = this.userPoints;
    this.setUserPoints(this.userPoints - tier.pointsCost);

    // Generate coupon
    const coupon = {
      id: this.generateCouponId(),
      tier: tier.name,
      value: tier.couponValue,
      pointsCost: tier.pointsCost,
      issuedDate: new Date().toISOString(),
      expiryDate: this.calculateExpiryDate(),
      isUsed: false,
      usedDate: null,
      color: tier.color,
      icon: tier.icon,
      description: tier.description
    };

    // Save coupon
    this.saveCoupon(coupon);

    // Save exchange history
    this.saveCouponExchangeHistory({
      couponId: coupon.id,
      tier: tier.name,
      pointsCost: tier.pointsCost,
      couponValue: tier.couponValue,
      timestamp: new Date().toISOString(),
      previousPoints,
      newPoints: this.userPoints
    });

    return {
      success: true,
      coupon,
      previousPoints,
      newPoints: this.userPoints,
      pointsDeducted: tier.pointsCost
    };
  }

  /**
   * Generate a unique coupon ID
   * @returns {string} Unique coupon ID
   */
  generateCouponId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `COUP-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Calculate coupon expiry date (90 days from issue)
   * @returns {string} ISO date string
   */
  calculateExpiryDate() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 90); // 90 days validity
    return expiryDate.toISOString();
  }

  /**
   * Save coupon to user's collection
   * @param {Object} coupon - Coupon object
   */
  saveCoupon(coupon) {
    const coupons = this.getUserCoupons();
    coupons.unshift(coupon); // Add to beginning
    storage.local.set("userCoupons", coupons);
  }

  /**
   * Get user's coupons
   * @param {boolean} includeUsed - Whether to include used coupons
   * @returns {Array} User's coupons
   */
  getUserCoupons(includeUsed = true) {
    const coupons = storage.local.get("userCoupons") || [];
    if (includeUsed) {
      return coupons;
    }
    return coupons.filter(coupon => !coupon.isUsed && new Date(coupon.expiryDate) > new Date());
  }

  /**
   * Use a coupon
   * @param {string} couponId - ID of coupon to use
   * @returns {Object} Usage result
   */
  useCoupon(couponId) {
    const coupons = this.getUserCoupons();
    const couponIndex = coupons.findIndex(c => c.id === couponId);
    
    if (couponIndex === -1) {
      return {
        success: false,
        error: "Cupón no encontrado"
      };
    }

    const coupon = coupons[couponIndex];
    
    if (coupon.isUsed) {
      return {
        success: false,
        error: "Este cupón ya ha sido utilizado"
      };
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return {
        success: false,
        error: "Este cupón ha expirado"
      };
    }

    // Mark as used
    coupon.isUsed = true;
    coupon.usedDate = new Date().toISOString();
    
    // Update storage
    coupons[couponIndex] = coupon;
    storage.local.set("userCoupons", coupons);

    return {
      success: true,
      coupon,
      discountAmount: coupon.value
    };
  }

  /**
   * Save coupon exchange history
   * @param {Object} exchange - Exchange details
   */
  saveCouponExchangeHistory(exchange) {
    const history = storage.local.get("couponExchangeHistory") || [];
    history.unshift(exchange); // Add to beginning
    
    // Keep only last 50 exchanges
    if (history.length > 50) {
      history.splice(50);
    }
    
    storage.local.set("couponExchangeHistory", history);
  }

  /**
   * Get coupon exchange history
   * @returns {Array} Exchange history
   */
  getCouponExchangeHistory() {
    return storage.local.get("couponExchangeHistory") || [];
  }

  /**
   * Get coupon statistics
   * @returns {Object} Coupon stats
   */
  getCouponStats() {
    const coupons = this.getUserCoupons();
    const availableCoupons = coupons.filter(c => !c.isUsed && new Date(c.expiryDate) > new Date());
    const usedCoupons = coupons.filter(c => c.isUsed);
    const expiredCoupons = coupons.filter(c => !c.isUsed && new Date(c.expiryDate) < new Date());
    
    const totalValue = availableCoupons.reduce((sum, coupon) => sum + coupon.value, 0);
    const totalUsedValue = usedCoupons.reduce((sum, coupon) => sum + coupon.value, 0);
    
    return {
      total: coupons.length,
      available: availableCoupons.length,
      used: usedCoupons.length,
      expired: expiredCoupons.length,
      totalValue,
      totalUsedValue,
      availableCoupons,
      usedCoupons,
      expiredCoupons
    };
  }

  /**
   * Check if user can afford a coupon tier
   * @param {string} tierName - Tier to check
   * @returns {boolean} Whether user can afford it
   */
  canAffordCoupon(tierName) {
    const tiers = this.getCouponTiers();
    const tier = tiers.find(t => t.name === tierName);
    return tier && this.userPoints >= tier.pointsCost;
  }
}

// Create singleton instance
const pointsSystem = new PointsSystem();

// Export both the class and instance
export { PointsSystem, pointsSystem };
