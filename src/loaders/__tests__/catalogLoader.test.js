/**
 * Tests for Catalog Loader
 */

import {
  catalogLoader,
  productDetailLoader,
  categoryProductsLoader,
  catalogWithFiltersLoader,
  searchResultsLoader,
} from "../catalogLoader";

import {
  getAllProducts,
  getProductByCode,
  getProductsByCategory,
  getAllBrands,
} from "../../services/catalogService";

// Mock the catalog service
jest.mock("../../services/catalogService");

describe("catalogLoader", () => {
  const mockProducts = [
    {
      code: "JM001",
      nombre: "Mouse Gaming",
      precio: 25000,
      categoria: "perifericos",
    },
    {
      code: "JT001",
      nombre: "Teclado Mecánico",
      precio: 45000,
      categoria: "perifericos",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("catalogLoader", () => {
    it("should return all products successfully", async () => {
      getAllProducts.mockResolvedValue(mockProducts);

      const result = await catalogLoader();

      expect(getAllProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProducts);
    });

    it("should return empty array on error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getAllProducts.mockRejectedValue(new Error("Network error"));

      const result = await catalogLoader();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error in catalogLoader:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("productDetailLoader", () => {
    const mockProduct = {
      code: "JM001",
      nombre: "Mouse Gaming",
      precio: 25000,
      stock: 10,
    };

    it("should return product when code is valid", async () => {
      getProductByCode.mockResolvedValue(mockProduct);

      const params = { productCode: "JM001" };
      const result = await productDetailLoader({ params });

      expect(getProductByCode).toHaveBeenCalledWith("JM001");
      expect(result).toEqual(mockProduct);
    });

    it("should throw error when product code is missing", async () => {
      const params = {};

      await expect(productDetailLoader({ params })).rejects.toThrow(
        "Product code is required"
      );
      expect(getProductByCode).not.toHaveBeenCalled();
    });

    it("should throw error when product is not found", async () => {
      getProductByCode.mockResolvedValue(null);

      const params = { productCode: "INVALID" };

      await expect(productDetailLoader({ params })).rejects.toThrow(
        'Product "INVALID" not found'
      );
    });

    it("should throw error when service fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getProductByCode.mockRejectedValue(new Error("Service error"));

      const params = { productCode: "JM001" };

      await expect(productDetailLoader({ params })).rejects.toThrow(
        "Service error"
      );
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("categoryProductsLoader", () => {
    const mockCategoryProducts = [
      {
        code: "JM001",
        nombre: "Mouse Gaming",
        precio: 25000,
        categoria: "perifericos",
      },
    ];

    it("should return products for a specific category", async () => {
      getProductsByCategory.mockResolvedValue(mockCategoryProducts);

      const params = { categoryId: "perifericos" };
      const result = await categoryProductsLoader({ params });

      expect(getProductsByCategory).toHaveBeenCalledWith("perifericos");
      expect(result).toEqual(mockCategoryProducts);
    });

    it("should throw error when category ID is missing", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const params = {};

      const result = await categoryProductsLoader({ params });

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should return empty array on service error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getProductsByCategory.mockRejectedValue(new Error("Service error"));

      const params = { categoryId: "perifericos" };
      const result = await categoryProductsLoader({ params });

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("catalogWithFiltersLoader", () => {
    const mockBrands = ["Logitech", "Razer", "Corsair"];

    it("should return products and brands successfully", async () => {
      getAllProducts.mockResolvedValue(mockProducts);
      getAllBrands.mockResolvedValue(mockBrands);

      const result = await catalogWithFiltersLoader();

      expect(getAllProducts).toHaveBeenCalledTimes(1);
      expect(getAllBrands).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        products: mockProducts,
        brands: mockBrands,
      });
    });

    it("should return empty arrays on error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getAllProducts.mockRejectedValue(new Error("Service error"));
      getAllBrands.mockRejectedValue(new Error("Service error"));

      const result = await catalogWithFiltersLoader();

      expect(result).toEqual({
        products: [],
        brands: [],
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should handle partial failures", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getAllProducts.mockResolvedValue(mockProducts);
      getAllBrands.mockRejectedValue(new Error("Brands error"));

      const result = await catalogWithFiltersLoader();

      expect(result).toEqual({
        products: [],
        brands: [],
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("searchResultsLoader", () => {
    it("should return products with search query", async () => {
      getAllProducts.mockResolvedValue(mockProducts);

      const request = {
        url: "http://localhost/catalog?q=mouse",
      };
      const result = await searchResultsLoader({ request });

      expect(getAllProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        products: mockProducts,
        query: "mouse",
      });
    });

    it("should return empty query when not provided", async () => {
      getAllProducts.mockResolvedValue(mockProducts);

      const request = {
        url: "http://localhost/catalog",
      };
      const result = await searchResultsLoader({ request });

      expect(result).toEqual({
        products: mockProducts,
        query: "",
      });
    });

    it("should return empty arrays on error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getAllProducts.mockRejectedValue(new Error("Service error"));

      const request = {
        url: "http://localhost/catalog?q=test",
      };
      const result = await searchResultsLoader({ request });

      expect(result).toEqual({
        products: [],
        query: "",
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
