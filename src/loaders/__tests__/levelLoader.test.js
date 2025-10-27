/**
 * Tests for Level Loader
 */

import {
  levelsDataLoader,
  levelsLoader,
  levelDetailLoader,
  userLevelLoader,
  userProfileWithLevelLoader,
} from "../levelLoader";

import {
  getLevelsData,
  getAllLevels,
  getLevelByName,
  getLevelByPoints,
} from "../../services/levelService";

// Mock the level service
jest.mock("../../services/levelService");

describe("levelLoader", () => {
  const mockLevels = [
    {
      id: 1,
      nombre: "Bronze",
      puntosMínimos: 0,
      puntosMaximos: 999,
      descuento: 0,
    },
    {
      id: 2,
      nombre: "Silver",
      puntosMínimos: 1000,
      puntosMaximos: 4999,
      descuento: 5,
    },
    {
      id: 3,
      nombre: "Gold",
      puntosMínimos: 5000,
      puntosMaximos: 19999,
      descuento: 10,
    },
  ];

  const mockLevelsData = {
    levels: mockLevels,
    pointsPerPurchase: {
      baseMultiplier: 1,
      rules: [
        { minAmount: 0, maxAmount: 50000, points: 1 },
        { minAmount: 50001, maxAmount: 100000, points: 2 },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("levelsDataLoader", () => {
    it("should return complete levels data successfully", async () => {
      getLevelsData.mockResolvedValue(mockLevelsData);

      const result = await levelsDataLoader();

      expect(getLevelsData).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLevelsData);
    });

    it("should return default structure on error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getLevelsData.mockRejectedValue(new Error("Service error"));

      const result = await levelsDataLoader();

      expect(result).toEqual({
        levels: [],
        pointsPerPurchase: {
          baseMultiplier: 1,
          rules: [],
        },
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("levelsLoader", () => {
    it("should return all levels successfully", async () => {
      getAllLevels.mockResolvedValue(mockLevels);

      const result = await levelsLoader();

      expect(getAllLevels).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLevels);
    });

    it("should return empty array on error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getAllLevels.mockRejectedValue(new Error("Service error"));

      const result = await levelsLoader();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("levelDetailLoader", () => {
    const mockLevel = mockLevels[1]; // Silver level

    it("should return level when name is valid", async () => {
      getLevelByName.mockResolvedValue(mockLevel);

      const params = { levelName: "Silver" };
      const result = await levelDetailLoader({ params });

      expect(getLevelByName).toHaveBeenCalledWith("Silver");
      expect(result).toEqual(mockLevel);
    });

    it("should decode URI encoded level names", async () => {
      getLevelByName.mockResolvedValue(mockLevel);

      const params = { levelName: "Silver%20Level" };
      await levelDetailLoader({ params });

      expect(getLevelByName).toHaveBeenCalledWith("Silver Level");
    });

    it("should throw error when level name is missing", async () => {
      const params = {};

      await expect(levelDetailLoader({ params })).rejects.toThrow(
        "Level name is required"
      );
      expect(getLevelByName).not.toHaveBeenCalled();
    });

    it("should throw error when level is not found", async () => {
      getLevelByName.mockResolvedValue(null);

      const params = { levelName: "Diamond" };

      await expect(levelDetailLoader({ params })).rejects.toThrow(
        'Level "Diamond" not found'
      );
    });

    it("should throw error when service fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getLevelByName.mockRejectedValue(new Error("Service error"));

      const params = { levelName: "Silver" };

      await expect(levelDetailLoader({ params })).rejects.toThrow(
        "Service error"
      );
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("userLevelLoader", () => {
    const mockLevel = mockLevels[1]; // Silver level

    it("should return user level based on points", async () => {
      getLevelByPoints.mockResolvedValue(mockLevel);

      const request = { url: "http://localhost/profile?points=2500" };
      const result = await userLevelLoader({ request });

      expect(getLevelByPoints).toHaveBeenCalledWith(2500);
      expect(result).toEqual({
        points: 2500,
        level: mockLevel,
      });
    });

    it("should handle missing points parameter", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const request = { url: "http://localhost/profile" };
      const result = await userLevelLoader({ request });

      expect(result).toEqual({
        points: 0,
        level: null,
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should handle invalid points parameter", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const request = { url: "http://localhost/profile?points=invalid" };
      const result = await userLevelLoader({ request });

      expect(result).toEqual({
        points: 0,
        level: null,
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should handle service error gracefully", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getLevelByPoints.mockRejectedValue(new Error("Service error"));

      const request = { url: "http://localhost/profile?points=2500" };
      const result = await userLevelLoader({ request });

      expect(result).toEqual({
        points: 0,
        level: null,
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should handle zero points", async () => {
      getLevelByPoints.mockResolvedValue(mockLevels[0]); // Bronze

      const request = { url: "http://localhost/profile?points=0" };
      const result = await userLevelLoader({ request });

      expect(getLevelByPoints).toHaveBeenCalledWith(0);
      expect(result.points).toBe(0);
      expect(result.level).toEqual(mockLevels[0]);
    });
  });

  describe("userProfileWithLevelLoader", () => {
    const mockLevel = mockLevels[2]; // Gold level

    it("should return user with level data", async () => {
      getLevelByPoints.mockResolvedValue(mockLevel);

      const params = { userId: "123" };
      const result = await userProfileWithLevelLoader({ params });

      expect(getLevelByPoints).toHaveBeenCalledWith(3500);
      expect(result).toMatchObject({
        user: {
          id: "123",
          name: "Usuario Demo",
          email: "usuario@demo.cl",
          points: 3500,
        },
        level: mockLevel,
      });
    });

    it("should throw error when service fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getLevelByPoints.mockRejectedValue(new Error("Service error"));

      const params = { userId: "123" };

      await expect(userProfileWithLevelLoader({ params })).rejects.toThrow(
        "Service error"
      );
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should work with different user IDs", async () => {
      getLevelByPoints.mockResolvedValue(mockLevel);

      const params = { userId: "456" };
      const result = await userProfileWithLevelLoader({ params });

      expect(result.user.id).toBe("456");
      expect(result.user.points).toBe(3500);
    });
  });
});
