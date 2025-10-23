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

  const emptyMessages = screen.getAllByText(/tu carrito está vacío/i);
  expect(emptyMessages.length).toBeGreaterThanOrEqual(2);
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
  // Buscar cualquier elemento que contenga el precio $25.000
  const priceElements = screen.getAllByText(/25\.000/);
  expect(priceElements.length).toBeGreaterThan(0);
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

  // Buscar todos los elementos que contengan el total $50.000
  const totalElements = screen.getAllByText(/50\.000/);
  expect(totalElements.length).toBeGreaterThan(0);
  });
});
