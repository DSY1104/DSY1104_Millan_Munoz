/**
 * User Loader
 * Loads user data for React Router
 */

import {
  getCurrentUser,
  getCurrentUserProfile,
} from "../services/userService";

/**
 * Loader for user profile page
 * Loads the current user's profile data (JWT-based)
 * @returns {Promise<object>} - User profile object
 */
export const userProfileLoader = async () => {
  try {
    // First check if there's a user in localStorage (fast check)
    const cachedUser = getCurrentUser();

    if (!cachedUser) {
      console.log("[userProfileLoader] No cached user found, redirecting to login");
      // No user logged in - redirect to home
      window.location.href = "/";
      return null;
    }

    // Fetch fresh profile data from API using JWT token
    const profile = await getCurrentUserProfile();

    if (!profile) {
      console.error("[userProfileLoader] Could not load user profile");
      throw new Error("No se pudo cargar el perfil del usuario");
    }

    console.log("[userProfileLoader] Profile loaded successfully");
    return profile;
  } catch (error) {
    console.error("[userProfileLoader] Error loading profile:", error);

    // If API call fails, try to use cached data
    const cachedUser = getCurrentUser();
    if (cachedUser) {
      console.warn("[userProfileLoader] Using cached profile data due to API error");
      return cachedUser;
    }

    // No cached data available, throw error
    throw error;
  }
};

export default {
  userProfileLoader,
};
