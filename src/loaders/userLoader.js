/**
 * User Loader
 * Loads user data for React Router
 */

import {
  getUserById,
  getCurrentUser,
  getUserByEmail,
} from "../services/userService";

/**
 * Helper to get session from cookies or localStorage
 */
const getUserSession = () => {
  try {
    // Check cookies first
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      let c = cookie.trim();
      if (c.startsWith("userSession=")) {
        const value = decodeURIComponent(c.substring("userSession=".length));
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      }
    }

    // Fallback to localStorage
    const storedSession = localStorage.getItem("userSession");
    return storedSession ? JSON.parse(storedSession) : null;
  } catch {
    return null;
  }
};

/**
 * Loader for user profile page
 * Loads the current user's data
 * @returns {Promise<object>} - User object
 */
export const userProfileLoader = async () => {
  try {
    // Try to get current user from userService (used by console commands)
    let currentUser = getCurrentUser();

    // If no currentUser, check for auth session
    if (!currentUser) {
      const session = getUserSession();
      if (session && session.email) {
        // Load full user data by email from session
        currentUser = await getUserByEmail(session.email);
      }
    }

    if (!currentUser) {
      // If no user is logged in, return a default user (for demo purposes, use user ID 1)
      console.log(
        "[userProfileLoader] No user logged in, loading default user"
      );
      const defaultUser = await getUserById(1);
      return defaultUser;
    }

    // Fetch fresh user data by ID
    const user = await getUserById(currentUser.id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error in userProfileLoader:", error);
    throw error;
  }
};

/**
 * Loader for specific user by ID
 * @param {object} params - Route parameters
 * @param {string} params.userId - The user ID from URL params
 * @returns {Promise<object>} - User object
 */
export const userByIdLoader = async ({ params }) => {
  try {
    const { userId } = params;

    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await getUserById(userId);

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return user;
  } catch (error) {
    console.error("Error in userByIdLoader:", error);
    throw error;
  }
};

export default {
  userProfileLoader,
  userByIdLoader,
};
