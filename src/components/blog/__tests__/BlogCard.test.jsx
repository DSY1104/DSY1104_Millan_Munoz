/**
 * BlogCard Component Tests
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import BlogCard from "../BlogCard";

const mockArticle = {
  id: "1",
  slug: "test-article",
  title: "Test Article Title",
  description: "This is a test article description",
  category: "gaming",
  date: "2025-01-15",
  readingTime: "5 min",
  image: "/test-image.jpg",
  featured: false,
};

describe("BlogCard", () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  test("should render article card with correct information", () => {
    renderWithRouter(<BlogCard article={mockArticle} />);

    expect(screen.getByText("Test Article Title")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test article description")
    ).toBeInTheDocument();
    expect(screen.getByText("Gaming")).toBeInTheDocument();
    expect(screen.getByText(/14.*enero.*2025/i)).toBeInTheDocument();
    expect(screen.getByText("📖 5 min")).toBeInTheDocument();
  });

  test("should render image with correct alt text", () => {
    renderWithRouter(<BlogCard article={mockArticle} />);

    const img = screen.getByAltText("Imagen del artículo: Test Article Title");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test-image.jpg");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  test("should have correct link to article", () => {
    renderWithRouter(<BlogCard article={mockArticle} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/blog/test-article");
  });

  test("should apply featured class when article is featured", () => {
    const featuredArticle = { ...mockArticle, featured: true };
    const { container } = renderWithRouter(
      <BlogCard article={featuredArticle} />
    );

    const articleCard = container.querySelector(
      ".blog__article-card--featured"
    );
    expect(articleCard).toBeInTheDocument();
  });

  test("should not apply featured class when article is not featured", () => {
    const { container } = renderWithRouter(<BlogCard article={mockArticle} />);

    const articleCard = container.querySelector(
      ".blog__article-card--featured"
    );
    expect(articleCard).not.toBeInTheDocument();
  });

  test('should render "Leer más" button with aria-hidden', () => {
    renderWithRouter(<BlogCard article={mockArticle} />);

    const readMoreBtn = screen.getByText("Leer más");
    expect(readMoreBtn).toBeInTheDocument();
    expect(readMoreBtn).toHaveAttribute("aria-hidden", "true");
  });

  test("should render category with correct aria-label", () => {
    renderWithRouter(<BlogCard article={mockArticle} />);

    const category = screen.getByLabelText("Categoría: Gaming");
    expect(category).toBeInTheDocument();
  });

  test("should render date with correct datetime attribute", () => {
    renderWithRouter(<BlogCard article={mockArticle} />);

    const time = screen.getByRole("time");
    expect(time).toHaveAttribute("datetime", "2025-01-15");
  });

  test("should handle different categories correctly", () => {
    const categories = [
      { id: "reviews", name: "Reviews" },
      { id: "noticias", name: "Noticias" },
      { id: "guias", name: "Guías" },
      { id: "eventos", name: "Eventos" },
    ];

    categories.forEach(({ id, name }) => {
      const article = { ...mockArticle, category: id };
      const { unmount } = renderWithRouter(<BlogCard article={article} />);

      expect(screen.getByText(name)).toBeInTheDocument();
      unmount();
    });
  });
});
