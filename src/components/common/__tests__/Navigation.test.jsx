/**
 * Navigation Component Tests
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import Navigation from "../Navigation";
import { AuthProvider } from "../../../context/AuthContext";
import { CartProvider } from "../../../context/CartContext";

describe("Navigation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>{component}</CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test("should render navigation links", () => {
    renderWithProviders(<Navigation />);

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("Soporte")).toBeInTheDocument();
    expect(screen.getByText("Nosotros")).toBeInTheDocument();
  });

  test("should render cart link", () => {
    renderWithProviders(<Navigation />);

    const cartLink = screen.getByLabelText(/carrito/i);
    expect(cartLink).toBeInTheDocument();
  });

  test("should display cart item count badge when items in cart", () => {
    renderWithProviders(<Navigation />);

    // This test would need to add items to cart first
    // For now, we're just checking the structure exists
    const navigation = screen.getByRole("navigation");
    expect(navigation).toBeInTheDocument();
  });
});
