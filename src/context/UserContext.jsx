/**
 * User Context
 * Provides user data and methods to components
 */

import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getCurrentUser,
  saveCurrentUser,
  clearCurrentUser,
  updateUserProfile,
  addUserPoints,
  getCurrentUserProfile,
} from "../services/userService";

const UserContext = createContext();

export const UserProvider = ({ children, initialUser = null }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage or use initialUser
    const loadUser = () => {
      const storedUser = getCurrentUser();
      console.log("[UserContext] Loading user:", storedUser);
      if (storedUser) {
        setUser(storedUser);
      } else if (initialUser) {
        console.log("[UserContext] Using initialUser:", initialUser);
        setUser(initialUser);
        saveCurrentUser(initialUser);
      } else {
        console.log("[UserContext] No user found in storage or initialUser");
      }
      setLoading(false);
    };

    loadUser();

    // Listen for login/logout events to refresh user data
    const handleUserLogin = () => {
      console.log(
        "[UserContext] User logged in event received, refreshing data"
      );
      loadUser();
    };

    const handleUserLogout = () => {
      console.log(
        "[UserContext] User logged out event received, clearing data"
      );
      setUser(null);
      clearCurrentUser();
    };

    window.addEventListener("userLoggedIn", handleUserLogin);
    window.addEventListener("userLoggedOut", handleUserLogout);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserLogin);
      window.removeEventListener("userLoggedOut", handleUserLogout);
    };
  }, [initialUser]);

  const login = (userData) => {
    setUser(userData);
    saveCurrentUser(userData);
  };

  const logout = () => {
    setUser(null);
    clearCurrentUser();
  };

  const updateUser = async (updates) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      // API uses JWT to identify user, no need to pass user ID
      const updatedUser = await updateUserProfile(updates);
      setUser(updatedUser);
      saveCurrentUser(updatedUser);
      console.log("[UserContext] User profile updated successfully");
      return updatedUser;
    } catch (error) {
      console.error("[UserContext] Error updating user:", error);
      throw error;
    }
  };

  const updatePersonal = async (personalData) => {
    return updateUser({ personal: personalData });
  };

  const updateAddress = async (addressData) => {
    return updateUser({ address: addressData });
  };

  const updatePreferences = async (preferencesData) => {
    return updateUser({ preferences: preferencesData });
  };

  const updateGaming = async (gamingData) => {
    return updateUser({ gaming: gamingData });
  };

  const addPoints = async (points, reason = null) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    if (!points || points < 1) {
      throw new Error("Points must be at least 1");
    }

    try {
      // Call API to add points (JWT-based)
      const updatedStats = await addUserPoints(points, reason);

      // Update user state with new stats
      const updatedUser = {
        ...user,
        stats: updatedStats,
      };

      setUser(updatedUser);
      saveCurrentUser(updatedUser);

      console.log(`[UserContext] Added ${points} points successfully. New balance: ${updatedStats.points}`);

      return updatedUser;
    } catch (error) {
      console.error("[UserContext] Error adding points:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    updatePersonal,
    updateAddress,
    updatePreferences,
    updateGaming,
    addPoints,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
