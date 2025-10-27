/**
 * Tests for User Loader
 */

import { userProfileLoader, userByIdLoader } from "../userLoader";
import {
  getUserById,
  getCurrentUser,
  getUserByEmail,
} from "../../services/userService";

// Mock the user service
jest.mock("../../services/userService");

describe("userLoader", () => {
  const mockUser = {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@example.com",
    puntos: 2500,
    nivel: "Silver",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear document.cookie and localStorage
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
    localStorage.clear();
  });

  describe("userProfileLoader", () => {
    it("should return user from getCurrentUser when available", async () => {
      getCurrentUser.mockReturnValue({ id: 1, email: "juan@example.com" });
      getUserById.mockResolvedValue(mockUser);

      const result = await userProfileLoader();

      expect(getCurrentUser).toHaveBeenCalledTimes(1);
      expect(getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it("should return user from cookie session when getCurrentUser returns null", async () => {
      getCurrentUser.mockReturnValue(null);
      getUserByEmail.mockResolvedValue({ id: 2, email: "maria@example.com" });
      getUserById.mockResolvedValue({
        ...mockUser,
        id: 2,
        nombre: "Maria",
        email: "maria@example.com",
      });

      // Mock cookie
      Object.defineProperty(document, "cookie", {
        writable: true,
        value:
          "userSession=" +
          encodeURIComponent(JSON.stringify({ email: "maria@example.com" })),
      });

      const result = await userProfileLoader();

      expect(getUserByEmail).toHaveBeenCalledWith("maria@example.com");
      expect(getUserById).toHaveBeenCalledWith(2);
      expect(result.email).toBe("maria@example.com");
    });

    it("should return user from localStorage when cookie is not available", async () => {
      getCurrentUser.mockReturnValue(null);
      getUserByEmail.mockResolvedValue({ id: 3, email: "pedro@example.com" });
      getUserById.mockResolvedValue({
        ...mockUser,
        id: 3,
        email: "pedro@example.com",
      });

      // Mock localStorage
      localStorage.setItem(
        "userSession",
        JSON.stringify({ email: "pedro@example.com" })
      );

      const result = await userProfileLoader();

      expect(getUserByEmail).toHaveBeenCalledWith("pedro@example.com");
      expect(getUserById).toHaveBeenCalledWith(3);
      expect(result.email).toBe("pedro@example.com");
    });

    it("should return default user when no session is available", async () => {
      const consoleLogSpy = jest
        .spyOn(console, "log")
        .mockImplementation(() => {});
      getCurrentUser.mockReturnValue(null);
      const defaultUser = { ...mockUser, id: 1 };
      getUserById.mockResolvedValue(defaultUser);

      const result = await userProfileLoader();

      expect(getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(defaultUser);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "[userProfileLoader] No user logged in, loading default user"
      );

      consoleLogSpy.mockRestore();
    });

    it("should throw error when user is not found", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getCurrentUser.mockReturnValue({ id: 999, email: "test@example.com" });
      getUserById.mockResolvedValue(null);

      await expect(userProfileLoader()).rejects.toThrow("User not found");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should throw error when service fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getCurrentUser.mockReturnValue({ id: 1, email: "juan@example.com" });
      getUserById.mockRejectedValue(new Error("Service error"));

      await expect(userProfileLoader()).rejects.toThrow("Service error");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should handle invalid cookie format gracefully", async () => {
      const consoleLogSpy = jest
        .spyOn(console, "log")
        .mockImplementation(() => {});
      getCurrentUser.mockReturnValue(null);

      // Mock invalid cookie
      Object.defineProperty(document, "cookie", {
        writable: true,
        value: "userSession=invalid-json",
      });

      getUserById.mockResolvedValue(mockUser);

      const result = await userProfileLoader();

      // Should fall back to default user
      expect(getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);

      consoleLogSpy.mockRestore();
    });

    it("should handle invalid localStorage format gracefully", async () => {
      const consoleLogSpy = jest
        .spyOn(console, "log")
        .mockImplementation(() => {});
      getCurrentUser.mockReturnValue(null);

      // Mock invalid localStorage
      localStorage.setItem("userSession", "invalid-json");

      getUserById.mockResolvedValue(mockUser);

      const result = await userProfileLoader();

      // Should fall back to default user
      expect(getUserById).toHaveBeenCalledWith(1);

      consoleLogSpy.mockRestore();
    });
  });

  describe("userByIdLoader", () => {
    it("should return user when ID is valid", async () => {
      getUserById.mockResolvedValue(mockUser);

      const params = { userId: "1" };
      const result = await userByIdLoader({ params });

      expect(getUserById).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockUser);
    });

    it("should throw error when user ID is missing", async () => {
      const params = {};

      await expect(userByIdLoader({ params })).rejects.toThrow(
        "User ID is required"
      );
      expect(getUserById).not.toHaveBeenCalled();
    });

    it("should throw error when user is not found", async () => {
      getUserById.mockResolvedValue(null);

      const params = { userId: "999" };

      await expect(userByIdLoader({ params })).rejects.toThrow(
        "User with ID 999 not found"
      );
    });

    it("should throw error when service fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getUserById.mockRejectedValue(new Error("Service error"));

      const params = { userId: "1" };

      await expect(userByIdLoader({ params })).rejects.toThrow("Service error");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should handle numeric user IDs", async () => {
      getUserById.mockResolvedValue(mockUser);

      const params = { userId: 1 };
      const result = await userByIdLoader({ params });

      expect(getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });
});
