/**
 * Footer Component Tests
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import Footer from "../Footer";

describe("Footer", () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  test("should render footer content", () => {
    renderWithRouter(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  test("should render copyright information", () => {
    renderWithRouter(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(currentYear.toString()))
    ).toBeInTheDocument();
  });

  test("should render social media links", () => {
    renderWithRouter(<Footer />);

    // Check for common social media links
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });
});
