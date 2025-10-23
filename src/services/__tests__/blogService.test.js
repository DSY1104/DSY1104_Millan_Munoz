/**
 * Blog Service Tests
 */
import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory,
} from "../blogService";

// Mock fetch
global.fetch = jest.fn();

describe("Blog Service", () => {
  const mockArticles = [
    {
      id: "1",
      slug: "article-one",
      title: "Article One",
      category: "gaming",
      date: "2025-01-15",
      featured: true,
    },
    {
      id: "2",
      slug: "article-two",
      title: "Article Two",
      category: "reviews",
      date: "2025-01-20",
      featured: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllArticles", () => {
    test("should fetch all articles successfully", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticles,
      });

      const articles = await getAllArticles();

      expect(fetch).toHaveBeenCalledWith("/src/assets/data/blogArticles.json");
      expect(articles).toHaveLength(2);
    });

    test("should handle fetch errors", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getAllArticles()).rejects.toThrow();
    });
  });

  describe("getArticleBySlug", () => {
    test("should return article when found", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticles,
      });

      const article = await getArticleBySlug("article-one");

      expect(article).toBeDefined();
      expect(article.slug).toBe("article-one");
    });

    test("should return null when article not found", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticles,
      });

      const article = await getArticleBySlug("non-existent");

      expect(article).toBeNull();
    });
  });

  describe("getArticlesByCategory", () => {
    test("should filter articles by category", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticles,
      });

      const articles = await getArticlesByCategory("gaming");

      expect(articles).toHaveLength(1);
      expect(articles[0].category).toBe("gaming");
    });
  });
});
