/**
 * Tests for Blog Post Loader
 */

import {
  blogPostLoader,
  blogPostExists,
  getAllBlogPostSlugs,
} from "../blogPostLoader";

describe("blogPostLoader", () => {
  const mockPostContent = {
    title: "Test Blog Post",
    date: "2025-01-01",
    author: "Test Author",
    content: "Test content",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    // Mock Response for Node environment
    global.Response = class Response extends Error {
      constructor(message, options) {
        super(message);
        this.status = options?.status || 500;
        this.statusText = message;
      }
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete global.Response;
  });

  describe("blogPostLoader", () => {
    it("should load blog post successfully", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockPostContent,
      });

      const params = { slug: "test-post" };
      const result = await blogPostLoader({ params });

      expect(global.fetch).toHaveBeenCalledWith(
        "/data/blogPosts/test-post.json"
      );
      expect(result).toEqual({
        ...mockPostContent,
        slug: "test-post",
      });
    });

    it("should throw Response error when post is not found", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      const params = { slug: "non-existent" };

      await expect(blogPostLoader({ params })).rejects.toThrow(Response);
      await expect(blogPostLoader({ params })).rejects.toMatchObject({
        status: 404,
      });
    });

    it("should handle fetch errors", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      global.fetch.mockRejectedValue(new Error("Network error"));

      const params = { slug: "test-post" };

      await expect(blogPostLoader({ params })).rejects.toThrow(Response);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error loading blog post test-post:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it("should handle JSON parse errors", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      const params = { slug: "test-post" };

      await expect(blogPostLoader({ params })).rejects.toThrow(Response);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("blogPostExists", () => {
    it("should return true when post exists", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
      });

      const result = await blogPostExists("test-post");

      expect(global.fetch).toHaveBeenCalledWith(
        "/data/blogPosts/test-post.json",
        { method: "HEAD" }
      );
      expect(result).toBe(true);
    });

    it("should return false when post does not exist", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
      });

      const result = await blogPostExists("non-existent");

      expect(result).toBe(false);
    });

    it("should return false on fetch error", async () => {
      global.fetch.mockRejectedValue(new Error("Network error"));

      const result = await blogPostExists("test-post");

      expect(result).toBe(false);
    });
  });

  describe("getAllBlogPostSlugs", () => {
    it("should return array of blog post slugs", () => {
      const slugs = getAllBlogPostSlugs();

      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBeGreaterThan(0);
      expect(slugs).toContain("auriculares-gaming-2025");
      expect(slugs).toContain("setup-gaming-completo");
      expect(slugs).toContain("monitores-4k-gaming");
    });

    it("should return consistent results", () => {
      const slugs1 = getAllBlogPostSlugs();
      const slugs2 = getAllBlogPostSlugs();

      expect(slugs1).toEqual(slugs2);
    });
  });
});
