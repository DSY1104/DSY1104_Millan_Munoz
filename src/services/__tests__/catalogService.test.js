/**
 * Catalog Service Tests
 */
import {
  getAllProducts,
  getProductByCode,
  getProductsByCategory,
  getProductsByBrand,
  getAllBrands,
  filterProducts,
  sortProducts,
} from "../catalogService";

// Mock fetch
global.fetch = jest.fn();

describe("Catalog Service", () => {
  const mockProducts = [
    {
      code: "JM001",
      nombre: "Mouse Gaming RGB",
      marca: "Logitech",
      categoriaId: "C001",
      precioCLP: 25000,
      stock: 10,
      rating: 4.5,
      imagen: "/src/assets/images/products/jm001.webp",
    },
    {
      code: "JM002",
      nombre: "Teclado Mecánico",
      marca: "Razer",
      categoriaId: "C001",
      precioCLP: 45000,
      stock: 5,
      rating: 4.8,
      imagen: "/src/assets/images/products/jm002.webp",
    },
    {
      code: "AC001",
      nombre: "Audífonos Gaming",
      marca: "HyperX",
      categoriaId: "C002",
      precioCLP: 35000,
      stock: 0,
      rating: 4.2,
      imagen: "/src/assets/images/products/ac001.webp",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllProducts", () => {
    test("should fetch all products successfully", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const products = await getAllProducts();

      expect(fetch).toHaveBeenCalledWith("/src/assets/data/products.json");
      expect(products).toHaveLength(3);
      expect(products[0]).toHaveProperty("_idx");
    });

    test("should throw error on failed fetch", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getAllProducts()).rejects.toThrow();
    });

    test("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getAllProducts()).rejects.toThrow("Network error");
    });
  });

  describe("getProductByCode", () => {
    test("should return product when found", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const product = await getProductByCode("JM001");

      expect(product).toBeDefined();
      expect(product.code).toBe("JM001");
      expect(product.nombre).toBe("Mouse Gaming RGB");
    });

    test("should return null when product not found", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const product = await getProductByCode("INVALID");

      expect(product).toBeNull();
    });
  });

  describe("getProductsByCategory", () => {
    test("should filter products by category", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const products = await getProductsByCategory("C001");

      expect(products).toHaveLength(2);
      expect(products.every((p) => p.categoriaId === "C001")).toBe(true);
    });

    test("should return empty array for non-existent category", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const products = await getProductsByCategory("INVALID");

      expect(products).toHaveLength(0);
    });
  });

  describe("getProductsByBrand", () => {
    test("should filter products by brand", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const products = await getProductsByBrand("Logitech");

      expect(products).toHaveLength(1);
      expect(products[0].marca).toBe("Logitech");
    });
  });

  describe("getAllBrands", () => {
    test("should return unique sorted brands", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const brands = await getAllBrands();

      expect(brands).toHaveLength(3);
      expect(brands).toContain("Logitech");
      expect(brands).toContain("Razer");
      expect(brands).toContain("HyperX");
      expect(brands[0] < brands[1]).toBe(true); // Check sorting
    });
  });
});
