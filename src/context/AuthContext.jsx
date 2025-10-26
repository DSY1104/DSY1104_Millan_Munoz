import React, { createContext, useContext, useState, useEffect } from "react";
import { authenticateUser } from "../services/userService";

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
  // Auth state: only JWT, isAuthenticated, and loginTime
  const [authUser, setAuthUser] = useState(null);
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
          setAuthUser(session);
          setIsAuthenticated(true);
          console.log("[AuthContext] Restored session, token:", session.token);
        }
      } catch (error) {
        console.error("[AuthContext] Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Helper function to generate fake JWT token
  const generateFakeJWT = (userId, email) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        sub: userId,
        email: email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
      })
    );
    const signature = btoa("fake-signature-" + userId + "-" + Date.now());
    return `${header}.${payload}.${signature}`;
  };

  // Helper function to check if email has DUOC discount
  const checkDuocDiscount = (email) => {
    if (!email) return false;
    const domain = email.split("@")[1]?.toLowerCase();
    return domain === "duoc.cl" || domain === "profesor.duoc.cl";
  };

  // Login function
  const login = async (email, password, remember = false) => {
    try {
      // Authenticate user against users.json
      const authenticatedUser = await authenticateUser(email, password);

      if (!authenticatedUser) {
        console.log("[AuthContext] Login failed - Invalid credentials");
        return {
          success: false,
          error:
            "Credenciales inválidas. Solo usuarios registrados pueden acceder.",
        };
      }

      // Generate fake JWT token
      const token = generateFakeJWT(
        authenticatedUser.id,
        authenticatedUser.email
      );

      // Create auth session (only auth data, no user profile)
      const authData = {
        token: token,
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
        hasLifetimeDiscount:
          authenticatedUser.hasLifetimeDiscount ||
          checkDuocDiscount(authenticatedUser.email),
        discountPercentage:
          authenticatedUser.discountPercentage ||
          (checkDuocDiscount(authenticatedUser.email) ? 20 : 0),
      };

      // Set cookies based on remember me choice
      if (remember) {
        cookies.set("userSession", authData, {
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
        cookies.set("userSession", authData, {
          secure: location.protocol === "https:",
          sameSite: "Lax",
        });
      }

      // Store auth data in localStorage as backup
      localStorage.setItem("userSession", JSON.stringify(authData));

      // Save full user data for UserContext
      localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));

      setAuthUser(authData);
      setIsAuthenticated(true);
      setShowLoginModal(false);

      console.log("[AuthContext] Login successful", {
        token: token.substring(0, 20) + "...",
        loginTime: authData.loginTime,
        hasDiscount: authData.hasLifetimeDiscount,
      });

      // Dispatch custom event for other components (pass full user data)
      window.dispatchEvent(
        new CustomEvent("userLoggedIn", { detail: authenticatedUser })
      );

      // If user is on profile page, reload to refresh data
      if (window.location.pathname === "/profile") {
        console.log(
          "[AuthContext] Reloading /profile page to refresh user data"
        );
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }

      return { success: true, authData, user: authenticatedUser };
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
      localStorage.removeItem("currentUser"); // Clear UserContext data too

      setAuthUser(null);
      setIsAuthenticated(false);

      console.log("[AuthContext] User logged out successfully");

      // Check if user is on profile page and redirect to home
      if (window.location.pathname === "/profile") {
        console.log("[AuthContext] Redirecting from /profile to home");
        window.location.href = "/";
      }

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent("userLoggedOut"));

      return true;
    } catch (error) {
      console.error("[AuthContext] Logout error:", error);
      return false;
    }
  };

  // Register function (DISABLED - only users.json users allowed)
  const register = async (userData) => {
    try {
      console.log(
        "[AuthContext] Registration is disabled. Only pre-registered users can access the system."
      );

      return {
        success: false,
        error:
          "El registro está deshabilitado. Solo usuarios autorizados pueden acceder al sistema. Por favor, contacta al administrador.",
      };
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
    authUser, // JWT token, isAuthenticated, loginTime, discount info
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
