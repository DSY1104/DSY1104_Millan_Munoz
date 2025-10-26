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
      const updatedUser = await updateUserProfile(user.id, updates);
      setUser(updatedUser);
      saveCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
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

  const addPoints = (points) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      stats: {
        ...user.stats,
        points: user.stats.points + points,
      },
    };

    setUser(updatedUser);
    saveCurrentUser(updatedUser);
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
