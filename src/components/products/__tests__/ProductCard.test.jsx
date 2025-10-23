/**
 * ProductCard Component Tests
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import ProductCard from "../ProductCard";
import { CartProvider } from "../../../context/CartContext";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockProduct = {
  code: "JM001",
  imagen: "/test-image.webp",
  nombre: "Mouse Gaming RGB",
  marca: "Logitech",
  precioCLP: 25000,
  categoriaId: "C001",
  rating: 4.5,
  stock: 10,
};

describe("ProductCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <CartProvider>{component}</CartProvider>
      </BrowserRouter>
    );
  };

  test("should render product information correctly", () => {
    renderWithProviders(<ProductCard {...mockProduct} />);

    expect(screen.getByText("Mouse Gaming RGB")).toBeInTheDocument();
    expect(screen.getByText("Logitech")).toBeInTheDocument();
    expect(screen.getByText("$25.000")).toBeInTheDocument();
    expect(screen.getByText("⭐ 4.5")).toBeInTheDocument();
    expect(screen.getByText("C001")).toBeInTheDocument();
  });

  test("should render product image with correct attributes", () => {
    renderWithProviders(<ProductCard {...mockProduct} />);

    const img = screen.getByAltText("Mouse Gaming RGB");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test-image.webp");
    expect(img).toHaveClass("product-image");
  });

  test("should navigate to product detail when card is clicked", () => {
    renderWithProviders(<ProductCard {...mockProduct} />);

    const card = screen.getByText("Mouse Gaming RGB").closest(".product-card");
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("/products/JM001");
  });

  test("should add product to cart when button is clicked", () => {
    renderWithProviders(<ProductCard {...mockProduct} />);

    const addButton = screen.getByText("Agregar al carrito");
    fireEvent.click(addButton);

    // Check if button shows feedback
    expect(screen.getByText("¡Añadido!")).toBeInTheDocument();
  });

  test("should not navigate when clicking add to cart button", () => {
    renderWithProviders(<ProductCard {...mockProduct} />);

    const addButton = screen.getByText("Agregar al carrito");
    fireEvent.click(addButton);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('should show "Sin stock" when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    renderWithProviders(<ProductCard {...outOfStockProduct} />);

    expect(screen.getByText("Sin stock")).toBeInTheDocument();
    const button = screen.getByText("Sin stock");
    expect(button).toBeDisabled();
  });

  test("should disable button after adding to cart", async () => {
    jest.useFakeTimers();
    renderWithProviders(<ProductCard {...mockProduct} />);

    const addButton = screen.getByText("Agregar al carrito");
    fireEvent.click(addButton);

    expect(addButton).toBeDisabled();
    expect(addButton.textContent).toBe("¡Añadido!");

    // Fast-forward time
    jest.advanceTimersByTime(1200);

    await waitFor(() => {
      expect(addButton.textContent).toBe("Agregar al carrito");
      expect(addButton).not.toBeDisabled();
    });

    jest.useRealTimers();
  });

  test("should not render rating if rating is null", () => {
    const noRatingProduct = { ...mockProduct, rating: null };
    renderWithProviders(<ProductCard {...noRatingProduct} />);

    expect(screen.queryByText(/⭐/)).not.toBeInTheDocument();
  });

  test("should format price correctly", () => {
    const expensiveProduct = { ...mockProduct, precioCLP: 1234567 };
    renderWithProviders(<ProductCard {...expensiveProduct} />);

    expect(screen.getByText("$1.234.567")).toBeInTheDocument();
  });

  test("should handle missing optional props gracefully", () => {
    const minimalProduct = {
      code: "MIN001",
      nombre: "Minimal Product",
      precioCLP: 1000,
    };

    const { container } = renderWithProviders(
      <ProductCard {...minimalProduct} />
    );
    expect(container.querySelector(".product-card")).toBeInTheDocument();
  });

  test("should prevent double-click on add to cart button", () => {
    renderWithProviders(<ProductCard {...mockProduct} />);

    const addButton = screen.getByText("Agregar al carrito");

    // First click
    fireEvent.click(addButton);
    expect(addButton).toBeDisabled();

    // Second click (should be prevented)
    fireEvent.click(addButton);

    // Should still be disabled with same feedback text
    expect(addButton.textContent).toBe("¡Añadido!");
  });
});
