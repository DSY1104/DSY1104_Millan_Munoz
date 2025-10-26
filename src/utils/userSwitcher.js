/**
 * User Switcher Utility
 * Helper functions to switch between demo users
 */

import {
  getUserById,
  saveCurrentUser,
  clearCurrentUser,
  getCurrentUser,
} from "../services/userService";

/**
 * Switch to a specific user by ID
 * @param {number} userId - User ID (1, 2, or 3)
 */
export const switchToUser = async (userId) => {
  try {
    const user = await getUserById(userId);
    if (user) {
      saveCurrentUser(user);
      console.log(
        `✅ Switched to user: ${user.username} (${user.personal.firstName} ${user.personal.lastName})`
      );
      console.log(
        `   Level: ${user.stats.level} | Points: ${user.stats.points}`
      );
      // Reload page to reflect changes
      window.location.reload();
    } else {
      console.error(`❌ User with ID ${userId} not found`);
    }
  } catch (error) {
    console.error("❌ Error switching user:", error);
  }
};

/**
 * Show current user info
 */
export const whoAmI = () => {
  const user = getCurrentUser();
  if (user) {
    console.log(`👤 Current User:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(
      `   Name: ${user.personal.firstName} ${user.personal.lastName}`
    );
    console.log(`   Email: ${user.email}`);
    console.log(`   Level: ${user.stats.level}`);
    console.log(`   Points: ${user.stats.points}`);
    console.log(`   Purchases: ${user.stats.purchases}`);
  } else {
    console.log("❌ No user logged in");
  }
};

/**
 * Logout current user
 */
export const logout = () => {
  clearCurrentUser();
  console.log("👋 User logged out");

  // Check if user is on profile page and redirect to home
  if (window.location.pathname === "/profile") {
    console.log("🔀 Redirecting from /profile to home");
    window.location.href = "/";
  } else {
    window.location.reload();
  }
};

// Expose functions to window for easy console access
if (typeof window !== "undefined") {
  window.switchToUser = switchToUser;
  window.logoutUser = logout;
  window.whoAmI = whoAmI;
}

export default {
  switchToUser,
  logout,
  whoAmI,
};
