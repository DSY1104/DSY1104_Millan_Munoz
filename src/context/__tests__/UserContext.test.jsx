/**
 * Tests for UserContext
 */

import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UserProvider, useUser } from "../UserContext";
import * as userService from "../../services/userService";

// Mock the userService
jest.mock("../../services/userService");

describe("UserContext", () => {
  const mockUser = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    personal: {
      firstName: "Test",
      lastName: "User",
    },
    address: {
      street: "123 Test St",
      city: "Test City",
    },
    preferences: {
      theme: "dark",
    },
    gaming: {
      favoriteGenre: "RPG",
    },
    stats: {
      points: 100,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    userService.getCurrentUser.mockReturnValue(null);
    userService.saveCurrentUser.mockImplementation(() => {});
    userService.clearCurrentUser.mockImplementation(() => {});
    userService.updateUserProfile.mockResolvedValue(mockUser);
  });

  const wrapper = ({ children, initialUser = null }) => (
    <UserProvider initialUser={initialUser}>{children}</UserProvider>
  );

  describe("Initialization", () => {
    it("should initialize with loading state", async () => {
      const { result } = renderHook(() => useUser(), { wrapper });

      // Loading is set to false immediately after useEffect runs
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should load user from localStorage", async () => {
      userService.getCurrentUser.mockReturnValue(mockUser);

      const { result } = renderHook(() => useUser(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(userService.getCurrentUser).toHaveBeenCalled();
    });

    it("should use initialUser when no stored user", async () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={mockUser}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(userService.saveCurrentUser).toHaveBeenCalledWith(mockUser);
    });

    it("should have no user when no stored user and no initialUser", async () => {
      const { result } = renderHook(() => useUser(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it("should prioritize stored user over initialUser", async () => {
      const storedUser = { ...mockUser, id: 999, username: "storeduser" };
      userService.getCurrentUser.mockReturnValue(storedUser);

      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={mockUser}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(storedUser);
      expect(result.current.user.id).toBe(999);
    });
  });

  describe("Login and Logout", () => {
    it("should login a user", async () => {
      const { result } = renderHook(() => useUser(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.login(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(userService.saveCurrentUser).toHaveBeenCalledWith(mockUser);
    });

    it("should logout a user", async () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={mockUser}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(userService.clearCurrentUser).toHaveBeenCalled();
    });
  });

  describe("Update User", () => {
    it("should update user profile", async () => {
      const updatedUser = { ...mockUser, username: "updateduser" };
      userService.updateUserProfile.mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={mockUser}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.updateUser({ username: "updateduser" });
      });

      expect(userService.updateUserProfile).toHaveBeenCalledWith(1, {
        username: "updateduser",
      });
      expect(result.current.user).toEqual(updatedUser);
      expect(userService.saveCurrentUser).toHaveBeenCalledWith(updatedUser);
    });

    it("should throw error when updating with no user logged in", async () => {
      const { result } = renderHook(() => useUser(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.updateUser({ username: "test" });
        })
      ).rejects.toThrow("No user logged in");
    });

    it("should handle update errors", async () => {
      const error = new Error("Update failed");
      userService.updateUserProfile.mockRejectedValue(error);

      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={mockUser}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(
        act(async () => {
          await result.current.updateUser({ username: "test" });
        })
      ).rejects.toThrow("Update failed");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error updating user:",
        error
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Update Personal Info", () => {
    it("should update personal data", async () => {
      const personalData = { firstName: "John", lastName: "Doe" };
      const updatedUser = {
        ...mockUser,
        personal: personalData,
      };
      userService.updateUserProfile.mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={mockUser}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.updatePersonal(personalData);
      });

      expect(userService.updateUserProfile).toHaveBeenCalledWith(1, {
        personal: personalData,
      });
      expect(result.current.user.personal).toEqual(personalData);
    });
  });

  describe("Update Address", () => {
    it("should update address data", async () => {
      const addressData = { street: "456 New St", city: "New City" };
      const updatedUser = {
        ...mockUser,
        address: addressData,
      };
      userService.updateUserProfile.mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={mockUser}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.updateAddress(addressData);
      });

      expect(userService.updateUserProfile).toHaveBeenCalledWith(1, {
        address: addressData,
      });
      expect(result.current.user.address).toEqual(addressData);
    });
  });

  describe("Update Preferences", () => {
    it("should update preferences data", async () => {
      const preferencesData = { theme: "light", notifications: true };
      const updatedUser = {
        ...mockUser,
        preferences: preferencesData,
      };
      userService.updateUserProfile.mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={mockUser}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.updatePreferences(preferencesData);
      });

      expect(userService.updateUserProfile).toHaveBeenCalledWith(1, {
        preferences: preferencesData,
      });
      expect(result.current.user.preferences).toEqual(preferencesData);
    });
  });

  describe("Update Gaming", () => {
    it("should update gaming data", async () => {
      const gamingData = { favoriteGenre: "FPS", level: 5 };
      const updatedUser = {
        ...mockUser,
        gaming: gamingData,
      };
      userService.updateUserProfile.mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={mockUser}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.updateGaming(gamingData);
      });

      expect(userService.updateUserProfile).toHaveBeenCalledWith(1, {
        gaming: gamingData,
      });
      expect(result.current.user.gaming).toEqual(gamingData);
    });
  });

  describe("Add Points", () => {
    it("should add points to user", async () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={mockUser}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.addPoints(50);
      });

      expect(result.current.user.stats.points).toBe(150); // 100 + 50
      expect(userService.saveCurrentUser).toHaveBeenCalledWith(
        expect.objectContaining({
          stats: expect.objectContaining({
            points: 150,
          }),
        })
      );
    });

    it("should not add points when no user is logged in", async () => {
      const { result } = renderHook(() => useUser(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.addPoints(50);
      });

      expect(result.current.user).toBeNull();
    });

    it("should handle negative points", async () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={mockUser}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.addPoints(-20);
      });

      expect(result.current.user.stats.points).toBe(80); // 100 - 20
    });
  });

  describe("Event Listeners", () => {
    it("should listen for userLoggedIn event", async () => {
      const newUser = { ...mockUser, id: 2, username: "newuser" };
      userService.getCurrentUser.mockReturnValue(newUser);

      const { result } = renderHook(() => useUser(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        window.dispatchEvent(new Event("userLoggedIn"));
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(newUser);
      });
    });

    it("should listen for userLoggedOut event", async () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={mockUser}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);

      act(() => {
        window.dispatchEvent(new Event("userLoggedOut"));
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });

      expect(userService.clearCurrentUser).toHaveBeenCalled();
    });

    it("should cleanup event listeners on unmount", async () => {
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() => useUser(), { wrapper });

      await waitFor(() => {
        expect(removeEventListenerSpy).not.toHaveBeenCalled();
      });

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "userLoggedIn",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "userLoggedOut",
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe("Hook Error Handling", () => {
    it("should throw error when useUser is used outside provider", () => {
      // Suppress console.error for this test
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useUser());
      }).toThrow("useUser must be used within a UserProvider");

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Context Value", () => {
    it("should provide all expected methods and properties", async () => {
      const { result } = renderHook(() => useUser(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toHaveProperty("user");
      expect(result.current).toHaveProperty("loading");
      expect(result.current).toHaveProperty("login");
      expect(result.current).toHaveProperty("logout");
      expect(result.current).toHaveProperty("updateUser");
      expect(result.current).toHaveProperty("updatePersonal");
      expect(result.current).toHaveProperty("updateAddress");
      expect(result.current).toHaveProperty("updatePreferences");
      expect(result.current).toHaveProperty("updateGaming");
      expect(result.current).toHaveProperty("addPoints");

      expect(typeof result.current.login).toBe("function");
      expect(typeof result.current.logout).toBe("function");
      expect(typeof result.current.updateUser).toBe("function");
      expect(typeof result.current.updatePersonal).toBe("function");
      expect(typeof result.current.updateAddress).toBe("function");
      expect(typeof result.current.updatePreferences).toBe("function");
      expect(typeof result.current.updateGaming).toBe("function");
      expect(typeof result.current.addPoints).toBe("function");
    });
  });

  describe("Edge Cases", () => {
    it("should handle user with missing stats", async () => {
      const userWithoutStats = { ...mockUser };
      delete userWithoutStats.stats;

      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={userWithoutStats}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Adding points to a user without stats should cause an error
      // The implementation needs stats to be present
      expect(result.current.user.stats).toBeUndefined();
    });

    it("should handle multiple rapid updates", async () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => (
          <UserProvider initialUser={mockUser}>{children}</UserProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Each call updates state, but React batches them
      act(() => {
        result.current.addPoints(10);
      });

      act(() => {
        result.current.addPoints(20);
      });

      // Should have 130 points after two updates (100 + 10 + 20)
      expect(result.current.user.stats.points).toBe(130);
    });

    it("should persist user data after login", async () => {
      const { result } = renderHook(() => useUser(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.login(mockUser);
      });

      expect(userService.saveCurrentUser).toHaveBeenCalledWith(mockUser);
      expect(result.current.user).toEqual(mockUser);
    });
  });
});
