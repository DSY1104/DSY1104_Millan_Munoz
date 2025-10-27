/**
 * Tests for Category Loader
 */

import {
  categoriesLoader,
  categoryDetailLoader,
  categoryMapLoader,
  categoriesWithMetaLoader,
} from "../categoryLoader";

import {
  getAllCategories,
  getCategoryById,
  getCategoryMap,
} from "../../services/categoryService";

// Mock the category service
jest.mock("../../services/categoryService");

describe("categoryLoader", () => {
  const mockCategories = [
    { id: "perifericos", nombre: "Periféricos", descripcion: "Hardware" },
    { id: "componentes", nombre: "Componentes", descripcion: "PC Parts" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("categoriesLoader", () => {
    it("should return all categories successfully", async () => {
      getAllCategories.mockResolvedValue(mockCategories);

      const result = await categoriesLoader();

      expect(getAllCategories).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCategories);
    });

    it("should return empty array on error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getAllCategories.mockRejectedValue(new Error("Network error"));

      const result = await categoriesLoader();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error in categoriesLoader:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("categoryDetailLoader", () => {
    const mockCategory = {
      id: "perifericos",
      nombre: "Periféricos",
      descripcion: "Hardware periférico",
    };

    it("should return category when ID is valid", async () => {
      getCategoryById.mockResolvedValue(mockCategory);

      const params = { categoryId: "perifericos" };
      const result = await categoryDetailLoader({ params });

      expect(getCategoryById).toHaveBeenCalledWith("perifericos");
      expect(result).toEqual(mockCategory);
    });

    it("should throw error when category ID is missing", async () => {
      const params = {};

      await expect(categoryDetailLoader({ params })).rejects.toThrow(
        "Category ID is required"
      );
      expect(getCategoryById).not.toHaveBeenCalled();
    });

    it("should throw error when category is not found", async () => {
      getCategoryById.mockResolvedValue(null);

      const params = { categoryId: "invalid" };

      await expect(categoryDetailLoader({ params })).rejects.toThrow(
        'Category "invalid" not found'
      );
    });

    it("should throw error when service fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getCategoryById.mockRejectedValue(new Error("Service error"));

      const params = { categoryId: "perifericos" };

      await expect(categoryDetailLoader({ params })).rejects.toThrow(
        "Service error"
      );
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("categoryMapLoader", () => {
    const mockMap = {
      perifericos: "Periféricos",
      componentes: "Componentes",
    };

    it("should return category map successfully", async () => {
      getCategoryMap.mockResolvedValue(mockMap);

      const result = await categoryMapLoader();

      expect(getCategoryMap).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMap);
    });

    it("should return empty object on error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getCategoryMap.mockRejectedValue(new Error("Service error"));

      const result = await categoryMapLoader();

      expect(result).toEqual({});
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("categoriesWithMetaLoader", () => {
    it("should return categories with metadata successfully", async () => {
      getAllCategories.mockResolvedValue(mockCategories);

      const result = await categoriesWithMetaLoader();

      expect(getAllCategories).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        categories: mockCategories,
        total: 2,
      });
    });

    it("should return empty data on error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getAllCategories.mockRejectedValue(new Error("Service error"));

      const result = await categoriesWithMetaLoader();

      expect(result).toEqual({
        categories: [],
        total: 0,
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
