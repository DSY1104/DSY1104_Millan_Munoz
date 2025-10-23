/**
 * Integration Tests - Cart Workflow
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import ProductCard from "../../components/products/ProductCard";
import Cart from "../../pages/Cart";
import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";

describe("Cart Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

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

  const renderWithProviders = (...components) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>{components}</CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test("should add product to cart and see it in cart page", async () => {
    jest.useFakeTimers();

    const { rerender } = renderWithProviders(<ProductCard {...mockProduct} />);

    // Add product to cart
    const addButton = screen.getByText("Agregar al carrito");
    fireEvent.click(addButton);

    // Wait for feedback
    expect(screen.getByText("¡Añadido!")).toBeInTheDocument();

    // Fast-forward time
    jest.advanceTimersByTime(1200);

    // Re-render with Cart component
    rerender(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Cart />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Check if product appears in cart
    await waitFor(() => {
      expect(screen.getByText("Mouse Gaming RGB")).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  test("should persist cart across page refreshes", () => {
    renderWithProviders(<ProductCard {...mockProduct} />);

    // Add product to cart
    const addButton = screen.getByText("Agregar al carrito");
    fireEvent.click(addButton);

    // Check localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart:data"));
    expect(storedCart.items).toHaveLength(1);
    expect(storedCart.items[0].id).toBe("JM001");
  });

  test("should update cart totals when adding multiple products", async () => {
    jest.useFakeTimers();

    renderWithProviders(<ProductCard {...mockProduct} />);

    const addButton = screen.getByText("Agregar al carrito");

    // Add product twice
    fireEvent.click(addButton);
    jest.advanceTimersByTime(1200);

    fireEvent.click(addButton);
    jest.advanceTimersByTime(1200);

    // Check localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart:data"));
    expect(storedCart.items[0].qty).toBe(2);

    jest.useRealTimers();
  });
});
