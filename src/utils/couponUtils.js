/**
 * Coupon Utilities
 * Helper functions for managing and using coupons
 */

/**
 * Get all available coupons for a user (from localStorage and users.json)
 * @param {number} userId - The user ID
 * @param {Array} baseCoupons - Base coupons from users.json
 * @returns {Array} Array of available coupons
 */
export const getAvailableCoupons = (userId, baseCoupons = []) => {
  const userCouponsKey = `userCoupons_${userId}`;
  const storedCoupons = JSON.parse(
    localStorage.getItem(userCouponsKey) || "[]"
  );

  // Combine both sources
  const allCoupons = [...storedCoupons, ...baseCoupons];

  // Remove duplicates by ID
  const uniqueCoupons = Array.from(
    new Map(allCoupons.map((c) => [c.id, c])).values()
  );

  // Filter for available coupons (not used and not expired)
  const now = new Date();
  const available = uniqueCoupons.filter(
    (c) => !c.isUsed && new Date(c.expiresAt || c.expiryDate) > now
  );

  return available;
};

/**
 * Use a coupon (mark as used)
 * @param {number} userId - The user ID
 * @param {string} couponId - The coupon ID to use
 * @returns {boolean} True if successful, false otherwise
 */
export const useCoupon = (userId, couponId) => {
  try {
    const userCouponsKey = `userCoupons_${userId}`;
    const storedCoupons = JSON.parse(
      localStorage.getItem(userCouponsKey) || "[]"
    );

    // Find and mark coupon as used
    const updatedCoupons = storedCoupons.map((coupon) => {
      if (coupon.id === couponId) {
        return {
          ...coupon,
          isUsed: true,
          usedDate: new Date().toISOString().split("T")[0],
        };
      }
      return coupon;
    });

    localStorage.setItem(userCouponsKey, JSON.stringify(updatedCoupons));
    console.log(`[CouponUtils] Coupon ${couponId} marked as used`);
    return true;
  } catch (error) {
    console.error("[CouponUtils] Error using coupon:", error);
    return false;
  }
};

/**
 * Get user's current points
 * @param {number} userId - The user ID
 * @param {number} defaultPoints - Default points from user data
 * @returns {number} Current points balance
 */
export const getUserPoints = (userId, defaultPoints = 0) => {
  const userPointsKey = `userPoints_${userId}`;
  const storedPoints = localStorage.getItem(userPointsKey);
  return storedPoints !== null ? parseInt(storedPoints) : defaultPoints;
};

/**
 * Update user points
 * @param {number} userId - The user ID
 * @param {number} newPoints - New points balance
 */
export const setUserPoints = (userId, newPoints) => {
  const userPointsKey = `userPoints_${userId}`;
  localStorage.setItem(userPointsKey, newPoints.toString());
  console.log(`[CouponUtils] User ${userId} points updated to ${newPoints}`);
};
