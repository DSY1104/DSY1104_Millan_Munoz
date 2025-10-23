/**
 * Cart Page Tests
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import Cart from "../Cart";
import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";

describe("Cart Page", () => {
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

  test("should render empty cart message when cart is empty", () => {
    renderWithProviders(<Cart />);

    expect(screen.getByText(/carrito vacío/i)).toBeInTheDocument();
  });

  test("should render cart items when cart has products", () => {
    // Pre-populate localStorage with cart data
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    expect(screen.getByText("Mouse Gaming")).toBeInTheDocument();
    expect(screen.getByText("$25.000")).toBeInTheDocument();
  });

  test("should display correct cart totals", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 2,
          image: "/test.png",
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    expect(screen.getByText(/50\.000/)).toBeInTheDocument();
  });
});
