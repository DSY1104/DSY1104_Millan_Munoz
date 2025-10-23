/**
 * Home Page Tests
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import Home from "../Home";
import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";

describe("Home Page", () => {
  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>{component}</CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test("should render home page", () => {
    renderWithProviders(<Home />);

    // Check for main content wrapper
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });

  test("should render hero section", () => {
    renderWithProviders(<Home />);

    // Hero section should have heading
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });
});
