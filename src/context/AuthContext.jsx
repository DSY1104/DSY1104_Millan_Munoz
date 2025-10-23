import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Cookie utility functions
const cookies = {
  set: (name, value, options = {}) => {
    try {
      let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
        JSON.stringify(value)
      )}`;

      if (options.days) {
        const date = new Date();
        date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
        cookie += `; expires=${date.toUTCString()}`;
      }

      cookie += `; path=${options.path || "/"}`;

      if (options.secure) {
        cookie += "; secure";
      }

      if (options.sameSite) {
        cookie += `; samesite=${options.sameSite}`;
      }

      document.cookie = cookie;
      return true;
    } catch (error) {
      console.error("Error setting cookie:", error);
      return false;
    }
  },

  get: (name) => {
    try {
      const nameEQ = encodeURIComponent(name) + "=";
      const cookies = document.cookie.split(";");

      for (let cookie of cookies) {
        let c = cookie.trim();
        if (c.indexOf(nameEQ) === 0) {
          const value = decodeURIComponent(c.substring(nameEQ.length));
          try {
            return JSON.parse(value);
          } catch {
            return value;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error getting cookie:", error);
      return null;
    }
  },

  remove: (name) => {
    document.cookie = `${encodeURIComponent(
      name
    )}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const session = cookies.get("userSession");
        if (session && session.isAuthenticated) {
          setUser(session);
          setIsAuthenticated(true);
          console.log("[AuthContext] Restored session for:", session.email);
        }
      } catch (error) {
        console.error("[AuthContext] Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = (email, password, remember = false) => {
    try {
      // TODO: Replace with actual API call
      const userData = {
        email,
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
      };

      // Set cookies based on remember me choice
      if (remember) {
        cookies.set("userSession", userData, {
          days: 30,
          secure: location.protocol === "https:",
          sameSite: "Lax",
        });
        cookies.set("rememberLogin", true, {
          days: 30,
          secure: location.protocol === "https:",
          sameSite: "Lax",
        });
      } else {
        // Session-only cookie
        cookies.set("userSession", userData, {
          secure: location.protocol === "https:",
          sameSite: "Lax",
        });
      }

      // Also store in localStorage as backup
      localStorage.setItem("userSession", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      setShowLoginModal(false);

      console.log("[AuthContext] Login successful", { email, remember });

      // Dispatch custom event for other components
      window.dispatchEvent(
        new CustomEvent("userLoggedIn", { detail: userData })
      );

      return { success: true, user: userData };
    } catch (error) {
      console.error("[AuthContext] Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    try {
      // Clear cookies
      cookies.remove("userSession");
      cookies.remove("rememberLogin");

      // Clear localStorage
      localStorage.removeItem("userSession");
      localStorage.removeItem("rememberLogin");

      setUser(null);
      setIsAuthenticated(false);

      console.log("[AuthContext] User logged out successfully");

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent("userLoggedOut"));

      return true;
    } catch (error) {
      console.error("[AuthContext] Logout error:", error);
      return false;
    }
  };

  // Register function
  const register = (userData) => {
    try {
      // TODO: Replace with actual API call
      const registrationData = {
        ...userData,
        registeredAt: new Date().toISOString(),
        isAuthenticated: false,
      };

      // Store registration data in localStorage
      localStorage.setItem(
        "userRegistration",
        JSON.stringify(registrationData)
      );

      console.log("[AuthContext] Registration successful", registrationData);

      // Auto-login after registration
      const loginResult = login(userData.email, userData.password, false);

      setShowRegisterModal(false);

      return { success: true, data: registrationData };
    } catch (error) {
      console.error("[AuthContext] Registration error:", error);
      return { success: false, error: error.message };
    }
  };

  // Modal control functions
  const openLoginModal = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const openRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
  };

  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    showLoginModal,
    showRegisterModal,
    login,
    logout,
    register,
    openLoginModal,
    closeLoginModal,
    openRegisterModal,
    closeRegisterModal,
    switchToRegister,
    switchToLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
