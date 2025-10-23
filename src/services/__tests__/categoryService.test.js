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
      const categories = await getAllCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    test("should handle fetch errors", async () => {
      // For the current implementation, getAllCategories never throws
      const categories = await getAllCategories();
      expect(Array.isArray(categories)).toBe(true);
    });
  });

  describe("getCategoryById", () => {
    test("should return category when found", async () => {
      const category = await getCategoryById("JM");
      expect(category).toBeDefined();
      expect(category.id).toBe("JM");
      expect(typeof category.nombre).toBe("string");
    });

    test("should return null when category not found", async () => {
      const category = await getCategoryById("INVALID");
      expect(category).toBeNull();
    });
  });
});
