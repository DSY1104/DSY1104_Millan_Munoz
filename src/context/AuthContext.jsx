import React, { createContext, useContext, useState, useEffect } from "react";
import { authenticateUser, registerUser, getCurrentUserProfile } from "../services/userService";

const AuthContext = createContext(null);

// Cookie utility functions
const cookies = {
   set: (name, value, options = {}) => {
      try {
         let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(JSON.stringify(value))}`;

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
      document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
   },
};

export function AuthProvider({ children }) {
   // Auth state: only JWT, isAuthenticated, and loginTime
   const [authUser, setAuthUser] = useState(null);
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [loading, setLoading] = useState(true);
   const [showLoginModal, setShowLoginModal] = useState(false);
   const [showRegisterModal, setShowRegisterModal] = useState(false);

   // Helper function to check if JWT token is expired
   const isTokenExpired = (token) => {
      if (!token) return true;

      try {
         // Decode JWT payload (second part of the token)
         const payload = JSON.parse(atob(token.split(".")[1]));
         const currentTime = Math.floor(Date.now() / 1000);

         // Check if token has expired
         return payload.exp && payload.exp < currentTime;
      } catch (error) {
         console.error("[AuthContext] Error checking token expiration:", error);
         return true;
      }
   };

   // Check for existing session on mount and validate token
   useEffect(() => {
      const checkSession = async () => {
         try {
            const session = cookies.get("userSession");

            if (session && session.isAuthenticated && session.token) {
               // Check if token is expired
               if (isTokenExpired(session.token)) {
                  console.log("[AuthContext] Token expired, logging out");
                  logout();
                  return;
               }

               // Token is valid, try to get fresh profile data
               try {
                  const profile = await getCurrentUserProfile();
                  if (profile) {
                     // Update stored user data with fresh profile
                     localStorage.setItem("currentUser", JSON.stringify(profile));

                     setAuthUser(session);
                     setIsAuthenticated(true);
                     console.log("[AuthContext] Session restored successfully");
                  } else {
                     // Profile fetch failed, clear session
                     console.log("[AuthContext] Failed to fetch profile, clearing session");
                     logout();
                  }
               } catch (error) {
                  // If profile fetch fails, still restore session but log warning
                  console.warn("[AuthContext] Could not fetch profile, using cached session:", error);
                  setAuthUser(session);
                  setIsAuthenticated(true);
               }
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
   const login = async (email, password, remember = false) => {
      try {
         // Authenticate user via Usuario API - returns { token, user }
         const authResult = await authenticateUser(email, password);

         if (!authResult) {
            console.log("[AuthContext] Login failed - Invalid credentials");
            return {
               success: false,
               error: "Credenciales inválidas. Por favor, verifica tu email y contraseña.",
            };
         }

         console.log("[AuthContext] Login successful, fetching profile data authResult:", authResult);
         const { token, user } = authResult;

         console.log("[AuthContext] Token from authResult:", token ? `${token.substring(0, 30)}...` : "NULL");
         console.log("[AuthContext] User from authResult:", user);

         // Create auth session (token, authentication state, login time)
         const authData = {
            token: token,
            isAuthenticated: true,
            loginTime: new Date().toISOString(),
         };

         console.log("[AuthContext] Created authData:", {
            hasToken: !!authData.token,
            token: authData.token ? `${authData.token.substring(0, 30)}...` : "NULL",
            isAuthenticated: authData.isAuthenticated,
         });

         // IMPORTANT: Store token BEFORE making any authenticated API calls
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
         console.log("[AuthContext] Stored to localStorage:", {
            userSession: JSON.parse(localStorage.getItem("userSession")),
         });

         // NOW fetch complete profile data (after token is stored)
         let fullProfile = user;
         try {
            const profile = await getCurrentUserProfile();
            if (profile) {
               fullProfile = profile;
            }
         } catch (error) {
            console.warn("[AuthContext] Could not fetch full profile, using basic user data:", error);
         }

         // Save full user profile data for UserContext
         localStorage.setItem("currentUser", JSON.stringify(fullProfile));

         setAuthUser(authData);
         setIsAuthenticated(true);
         setShowLoginModal(false);

         console.log("[AuthContext] Login successful", {
            userId: user.id,
            username: user.username,
            email: user.email,
            level: user.stats?.level,
            loginTime: authData.loginTime,
         });

         // Dispatch custom event for other components (pass full profile data)
         window.dispatchEvent(new CustomEvent("userLoggedIn", { detail: fullProfile }));

         // If user is on profile page, reload to refresh data
         if (window.location.pathname === "/profile") {
            console.log("[AuthContext] Reloading /profile page to refresh user data");
            setTimeout(() => {
               window.location.reload();
            }, 100);
         }

         return { success: true, authData, user: fullProfile };
      } catch (error) {
         console.error("[AuthContext] Login error:", error);
         return {
            success: false,
            error: error.message || "Error al iniciar sesión. Por favor, intenta de nuevo.",
         };
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

   // Register function
   const register = async (userData) => {
      try {
         console.log("[AuthContext] Registering new user:", {
            email: userData.email,
            username: userData.username,
         });

         // Call Usuario API to register user
         const registeredUser = await registerUser({
            username: userData.username || userData.email.split("@")[0],
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
         });

         if (!registeredUser) {
            return {
               success: false,
               error: "Error al crear la cuenta. Por favor, intenta de nuevo.",
            };
         }

         console.log("[AuthContext] Registration successful, auto-logging in user");

         // Auto-login after successful registration
         const loginResult = await login(userData.email, userData.password, false);

         if (loginResult.success) {
            setShowRegisterModal(false);
            return {
               success: true,
               message: "¡Cuenta creada exitosamente! Has sido autenticado.",
               user: loginResult.user,
            };
         } else {
            // Registration succeeded but login failed
            return {
               success: true,
               message: "Cuenta creada exitosamente. Por favor, inicia sesión.",
               requiresLogin: true,
            };
         }
      } catch (error) {
         console.error("[AuthContext] Registration error:", error);
         return {
            success: false,
            error: error.message || "Error al crear la cuenta. El correo puede estar ya registrado.",
         };
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
