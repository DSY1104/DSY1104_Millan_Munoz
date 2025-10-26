/**
 * User Service
 * Handles user data operations
 */

import usersData from "../assets/data/users.json";

// Simulate API delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get user by ID
 * @param {number} userId - The user ID
 * @returns {Promise<object|null>} - User object or null if not found
 */
export const getUserById = async (userId) => {
  await delay();
  const user = usersData.find((u) => u.id === parseInt(userId));
  return user || null;
};

/**
 * Get user by username
 * @param {string} username - The username
 * @returns {Promise<object|null>} - User object or null if not found
 */
export const getUserByUsername = async (username) => {
  await delay();
  const user = usersData.find((u) => u.username === username);
  return user || null;
};

/**
 * Get user by email
 * @param {string} email - The email address
 * @returns {Promise<object|null>} - User object or null if not found
 */
export const getUserByEmail = async (email) => {
  await delay();
  const user = usersData.find((u) => u.email === email);
  return user || null;
};

/**
 * Get all users (admin function)
 * @returns {Promise<Array>} - Array of all users
 */
export const getAllUsers = async () => {
  await delay();
  return usersData;
};

/**
 * Authenticate user
 * @param {string} emailOrUsername - Email or username
 * @param {string} password - Password
 * @returns {Promise<object|null>} - User object without password or null if auth fails
 */
export const authenticateUser = async (emailOrUsername, password) => {
  await delay();
  const user = usersData.find(
    (u) =>
      (u.email === emailOrUsername || u.username === emailOrUsername) &&
      u.password === password
  );

  if (user) {
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  return null;
};

/**
 * Update user profile
 * @param {number} userId - The user ID
 * @param {object} updates - Object with fields to update
 * @returns {Promise<object>} - Updated user object
 */
export const updateUserProfile = async (userId, updates) => {
  await delay();
  const userIndex = usersData.findIndex((u) => u.id === parseInt(userId));

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  // Deep merge updates
  const updatedUser = {
    ...usersData[userIndex],
    personal: {
      ...usersData[userIndex].personal,
      ...(updates.personal || {}),
    },
    address: {
      ...usersData[userIndex].address,
      ...(updates.address || {}),
    },
    preferences: {
      ...usersData[userIndex].preferences,
      ...(updates.preferences || {}),
    },
    gaming: {
      ...usersData[userIndex].gaming,
      ...(updates.gaming || {}),
    },
    stats: {
      ...usersData[userIndex].stats,
      ...(updates.stats || {}),
    },
  };

  // In a real app, this would persist to a backend
  // For demo purposes, we return the updated user
  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

/**
 * Add points to user
 * @param {number} userId - The user ID
 * @param {number} points - Points to add
 * @returns {Promise<object>} - Updated user object
 */
export const addUserPoints = async (userId, points) => {
  await delay();
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const newPoints = user.stats.points + points;
  return updateUserProfile(userId, {
    stats: { points: newPoints },
  });
};

/**
 * Redeem user coupon
 * @param {number} userId - The user ID
 * @param {string} couponId - The coupon ID to redeem
 * @returns {Promise<object>} - Updated coupon
 */
export const redeemCoupon = async (userId, couponId) => {
  await delay();
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const coupon = user.coupons.find((c) => c.id === couponId);

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  if (coupon.isUsed) {
    throw new Error("Coupon already used");
  }

  // Mark coupon as used
  coupon.isUsed = true;

  return coupon;
};

/**
 * Get current user from localStorage
 * @returns {object|null} - Current user or null
 */
export const getCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

/**
 * Save current user to localStorage
 * @param {object} user - User object to save
 */
export const saveCurrentUser = (user) => {
  try {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
  }
};

/**
 * Clear current user from localStorage
 */
export const clearCurrentUser = () => {
  localStorage.removeItem("currentUser");
};

export default {
  getUserById,
  getUserByUsername,
  getUserByEmail,
  getAllUsers,
  authenticateUser,
  updateUserProfile,
  addUserPoints,
  redeemCoupon,
  getCurrentUser,
  saveCurrentUser,
  clearCurrentUser,
};
