/**
 * Category Service Tests
 */
import { getAllCategories, getCategoryById } from "../categoryService";

// Mock fetch
global.fetch = jest.fn();

describe("Category Service", () => {
  const mockCategories = [
    {
      id: "C001",
      nombre: "Periféricos",
      descripcion: "Dispositivos de entrada",
    },
    {
      id: "C002",
      nombre: "Audio",
      descripcion: "Equipos de audio",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllCategories", () => {
    test("should fetch all categories successfully", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

      const categories = await getAllCategories();

      expect(fetch).toHaveBeenCalledWith("/src/assets/data/categories.json");
      expect(categories).toHaveLength(2);
    });

    test("should handle fetch errors", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(getAllCategories()).rejects.toThrow();
    });
  });

  describe("getCategoryById", () => {
    test("should return category when found", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

      const category = await getCategoryById("C001");

      expect(category).toBeDefined();
      expect(category.id).toBe("C001");
      expect(category.nombre).toBe("Periféricos");
    });

    test("should return null when category not found", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

      const category = await getCategoryById("INVALID");

      expect(category).toBeNull();
    });
  });
});
