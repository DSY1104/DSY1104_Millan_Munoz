/**
 * Tests for Level Service
 */

import {
  getLevelsData,
  getAllLevels,
  getLevelByName,
  getLevelByPoints,
  getPointsRules,
  calculatePointsForPurchase,
  getPointsToNextLevel,
  getLevelNames,
} from "../levelService";

describe("levelService", () => {
  const mockLevelsData = {
    levels: [
      {
        id: 1,
        name: "Bronze",
        minPoints: 0,
        maxPoints: 999,
        discount: 0,
        color: "#CD7F32",
      },
      {
        id: 2,
        name: "Silver",
        minPoints: 1000,
        maxPoints: 4999,
        discount: 5,
        color: "#C0C0C0",
      },
      {
        id: 3,
        name: "Gold",
        minPoints: 5000,
        maxPoints: 19999,
        discount: 10,
        color: "#FFD700",
      },
      {
        id: 4,
        name: "Platinum",
        minPoints: 20000,
        maxPoints: null,
        discount: 15,
        color: "#E5E4E2",
      },
    ],
    pointsPerPurchase: {
      baseMultiplier: 1,
      rules: [
        { minAmount: 0, maxAmount: 50000, pointsPerPeso: 0.001 },
        { minAmount: 50001, maxAmount: 100000, pointsPerPeso: 0.002 },
        { minAmount: 100001, maxAmount: null, pointsPerPeso: 0.003 },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getLevelsData", () => {
    it("should fetch and return levels data successfully", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockLevelsData,
      });

      const result = await getLevelsData();

      expect(global.fetch).toHaveBeenCalledWith("/src/assets/data/levels.json");
      expect(result).toEqual(mockLevelsData);
    });

    it("should throw error when fetch fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(getLevelsData()).rejects.toThrow("HTTP error! status: 404");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should throw error on network failure", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      global.fetch.mockRejectedValue(new Error("Network error"));

      await expect(getLevelsData()).rejects.toThrow("Network error");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getAllLevels", () => {
    it("should return all levels", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockLevelsData,
      });

      const result = await getAllLevels();

      expect(result).toEqual(mockLevelsData.levels);
      expect(result).toHaveLength(4);
    });

    it("should return empty array when levels data has no levels", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ levels: undefined }),
      });

      const result = await getAllLevels();

      expect(result).toEqual([]);
    });

    it("should throw error when getLevelsData fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      global.fetch.mockRejectedValue(new Error("Fetch error"));

      await expect(getAllLevels()).rejects.toThrow("Fetch error");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getLevelByName", () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockLevelsData,
      });
    });

    it("should find level by exact name", async () => {
      const result = await getLevelByName("Gold");

      expect(result).toEqual(mockLevelsData.levels[2]);
      expect(result.name).toBe("Gold");
    });

    it("should find level case-insensitively", async () => {
      const result = await getLevelByName("SILVER");

      expect(result).toEqual(mockLevelsData.levels[1]);
      expect(result.name).toBe("Silver");
    });

    it("should return null when level not found", async () => {
      const result = await getLevelByName("Diamond");

      expect(result).toBeNull();
    });

    it("should throw error when getAllLevels fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      global.fetch.mockRejectedValue(new Error("Network error"));

      await expect(getLevelByName("Gold")).rejects.toThrow("Network error");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getLevelByPoints", () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockLevelsData,
      });
    });

    it("should return Bronze for 0 points", async () => {
      const result = await getLevelByPoints(0);
      expect(result.name).toBe("Bronze");
    });

    it("should return Bronze for 500 points", async () => {
      const result = await getLevelByPoints(500);
      expect(result.name).toBe("Bronze");
    });

    it("should return Silver for 1000 points", async () => {
      const result = await getLevelByPoints(1000);
      expect(result.name).toBe("Silver");
    });

    it("should return Silver for 3000 points", async () => {
      const result = await getLevelByPoints(3000);
      expect(result.name).toBe("Silver");
    });

    it("should return Gold for 5000 points", async () => {
      const result = await getLevelByPoints(5000);
      expect(result.name).toBe("Gold");
    });

    it("should return Platinum for 20000 points", async () => {
      const result = await getLevelByPoints(20000);
      expect(result.name).toBe("Platinum");
    });

    it("should return Platinum for very high points (no max)", async () => {
      const result = await getLevelByPoints(999999);
      expect(result.name).toBe("Platinum");
      expect(result.maxPoints).toBeNull();
    });

    it("should throw error when getAllLevels fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      global.fetch.mockRejectedValue(new Error("Service error"));

      await expect(getLevelByPoints(1000)).rejects.toThrow("Service error");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getPointsRules", () => {
    it("should return points rules", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockLevelsData,
      });

      const result = await getPointsRules();

      expect(result).toEqual(mockLevelsData.pointsPerPurchase);
      expect(result.baseMultiplier).toBe(1);
      expect(result.rules).toHaveLength(3);
    });

    it("should return empty object when no rules", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ levels: [] }),
      });

      const result = await getPointsRules();

      expect(result).toEqual({});
    });

    it("should throw error when getLevelsData fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      global.fetch.mockRejectedValue(new Error("Network error"));

      await expect(getPointsRules()).rejects.toThrow("Network error");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("calculatePointsForPurchase", () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockLevelsData,
      });
    });

    it("should calculate points for small purchase (0-50000)", async () => {
      const result = await calculatePointsForPurchase(10000);
      // 10000 * 0.001 * 1 = 10 points
      expect(result).toBe(10);
    });

    it("should calculate points for medium purchase (50001-100000)", async () => {
      const result = await calculatePointsForPurchase(75000);
      // 75000 * 0.002 * 1 = 150 points
      expect(result).toBe(150);
    });

    it("should calculate points for large purchase (100001+)", async () => {
      const result = await calculatePointsForPurchase(150000);
      // 150000 * 0.003 * 1 = 450 points
      expect(result).toBe(450);
    });

    it("should return 0 for 0 purchase", async () => {
      const result = await calculatePointsForPurchase(0);
      expect(result).toBe(0);
    });

    it("should floor fractional points", async () => {
      const result = await calculatePointsForPurchase(1500);
      // 1500 * 0.001 * 1 = 1.5 -> 1 point
      expect(result).toBe(1);
    });

    it("should return 0 when error occurs", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      global.fetch.mockRejectedValue(new Error("Service error"));

      const result = await calculatePointsForPurchase(10000);

      expect(result).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getPointsToNextLevel", () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockLevelsData,
      });
    });

    it("should calculate points needed from Bronze to Silver", async () => {
      const result = await getPointsToNextLevel(500);

      expect(result.currentLevel.name).toBe("Bronze");
      expect(result.nextLevel.name).toBe("Silver");
      expect(result.pointsNeeded).toBe(500); // 1000 - 500
      expect(result.progress).toBeGreaterThan(0);
    });

    it("should calculate points needed from Silver to Gold", async () => {
      const result = await getPointsToNextLevel(3000);

      expect(result.currentLevel.name).toBe("Silver");
      expect(result.nextLevel.name).toBe("Gold");
      expect(result.pointsNeeded).toBe(2000); // 5000 - 3000
    });

    it("should return no next level for Platinum", async () => {
      const result = await getPointsToNextLevel(50000);

      expect(result.currentLevel.name).toBe("Platinum");
      expect(result.nextLevel).toBeNull();
      expect(result.pointsNeeded).toBe(0);
      expect(result.progress).toBe(100);
    });

    it("should calculate progress within a level", async () => {
      const result = await getPointsToNextLevel(2500);

      expect(result.currentLevel.name).toBe("Silver");
      // Silver: 1000-4999 (range: 4000)
      // At 2500 points: 1500 points into level
      // Progress: (1500 / 4000) * 100 = 37%
      expect(result.progress).toBeGreaterThan(30);
      expect(result.progress).toBeLessThan(40);
    });

    it("should throw error when service fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      global.fetch.mockRejectedValue(new Error("Service error"));

      await expect(getPointsToNextLevel(1000)).rejects.toThrow("Service error");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getLevelNames", () => {
    it("should return array of level names", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockLevelsData,
      });

      const result = await getLevelNames();

      expect(result).toEqual(["Bronze", "Silver", "Gold", "Platinum"]);
      expect(result).toHaveLength(4);
    });

    it("should return empty array when no levels", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ levels: [] }),
      });

      const result = await getLevelNames();

      expect(result).toEqual([]);
    });

    it("should throw error when getAllLevels fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      global.fetch.mockRejectedValue(new Error("Network error"));

      await expect(getLevelNames()).rejects.toThrow("Network error");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
