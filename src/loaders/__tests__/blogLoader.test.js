/**
 * Tests for Blog Loader
 */

import {
  blogLoader,
  articleDetailLoader,
  categoryArticlesLoader,
  featuredArticlesLoader,
} from "../blogLoader";

import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getFeaturedArticles,
} from "../../services/blogService";

// Mock the blog service
jest.mock("../../services/blogService");

describe("blogLoader", () => {
  const mockArticles = [
    {
      id: 1,
      slug: "article-1",
      title: "Article 1",
      category: "tech",
      featured: false,
    },
    {
      id: 2,
      slug: "article-2",
      title: "Article 2",
      category: "gaming",
      featured: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("blogLoader", () => {
    it("should return all articles successfully", async () => {
      getAllArticles.mockResolvedValue(mockArticles);

      const result = await blogLoader();

      expect(getAllArticles).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockArticles);
    });

    it("should return empty array on error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getAllArticles.mockRejectedValue(new Error("Network error"));

      const result = await blogLoader();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error in blogLoader:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("articleDetailLoader", () => {
    const mockArticle = {
      id: 1,
      slug: "test-article",
      title: "Test Article",
      content: "Article content",
    };

    it("should return article when slug is valid", async () => {
      getArticleBySlug.mockResolvedValue(mockArticle);

      const params = { slug: "test-article" };
      const result = await articleDetailLoader({ params });

      expect(getArticleBySlug).toHaveBeenCalledWith("test-article");
      expect(result).toEqual(mockArticle);
    });

    it("should throw error when slug is missing", async () => {
      const params = {};

      await expect(articleDetailLoader({ params })).rejects.toThrow(
        "Article slug is required"
      );
      expect(getArticleBySlug).not.toHaveBeenCalled();
    });

    it("should throw error when article is not found", async () => {
      getArticleBySlug.mockResolvedValue(null);

      const params = { slug: "non-existent" };

      await expect(articleDetailLoader({ params })).rejects.toThrow(
        'Article "non-existent" not found'
      );
    });

    it("should throw error when service fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getArticleBySlug.mockRejectedValue(new Error("Service error"));

      const params = { slug: "test-article" };

      await expect(articleDetailLoader({ params })).rejects.toThrow(
        "Service error"
      );
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("categoryArticlesLoader", () => {
    const mockCategoryArticles = [
      { id: 1, slug: "article-1", title: "Article 1", category: "tech" },
      { id: 3, slug: "article-3", title: "Article 3", category: "tech" },
    ];

    it("should return articles for a specific category", async () => {
      getArticlesByCategory.mockResolvedValue(mockCategoryArticles);

      const params = { category: "tech" };
      const result = await categoryArticlesLoader({ params });

      expect(getArticlesByCategory).toHaveBeenCalledWith("tech");
      expect(result).toEqual(mockCategoryArticles);
    });

    it("should throw error when category is missing", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const params = {};

      const result = await categoryArticlesLoader({ params });

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should return empty array on service error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getArticlesByCategory.mockRejectedValue(new Error("Service error"));

      const params = { category: "tech" };
      const result = await categoryArticlesLoader({ params });

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("featuredArticlesLoader", () => {
    const mockFeaturedArticles = [
      {
        id: 2,
        slug: "article-2",
        title: "Featured Article",
        featured: true,
      },
    ];

    it("should return featured articles successfully", async () => {
      getFeaturedArticles.mockResolvedValue(mockFeaturedArticles);

      const result = await featuredArticlesLoader();

      expect(getFeaturedArticles).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockFeaturedArticles);
    });

    it("should return empty array on error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getFeaturedArticles.mockRejectedValue(new Error("Service error"));

      const result = await featuredArticlesLoader();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
