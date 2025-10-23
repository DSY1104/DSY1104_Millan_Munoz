/**
 * AuthContext Tests
 */
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";

// Mock document.cookie
Object.defineProperty(document, "cookie", {
  writable: true,
  value: "",
});

describe("AuthContext", () => {
  beforeEach(() => {
    document.cookie = "";
    localStorage.clear();
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  describe("Authentication State", () => {
    test("should initialize with no authenticated user", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    test("should handle login successfully", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login("test@example.com", "password123", false);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeDefined();
      expect(result.current.user.email).toBe("test@example.com");
    });

    test("should handle logout", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login("test@example.com", "password123", false);
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe("Modal Controls", () => {
    test("should open login modal", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.openLoginModal();
      });

      expect(result.current.showLoginModal).toBe(true);
    });

    test("should close login modal", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.openLoginModal();
      });

      act(() => {
        result.current.closeLoginModal();
      });

      expect(result.current.showLoginModal).toBe(false);
    });

    test("should open register modal", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.openRegisterModal();
      });

      expect(result.current.showRegisterModal).toBe(true);
    });

    test("should close register modal", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.openRegisterModal();
      });

      act(() => {
        result.current.closeRegisterModal();
      });

      expect(result.current.showRegisterModal).toBe(false);
    });
  });
});
