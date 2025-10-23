/**
 * Test Utilities
 * Common helper functions for testing
 */
import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";

/**
 * Render component with all providers
 */
export function renderWithAllProviders(ui, options = {}) {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Render component with router only
 */
export function renderWithRouter(ui, options = {}) {
  return render(<BrowserRouter>{ui}</BrowserRouter>, options);
}

/**
 * Mock product data generator
 */
export function createMockProduct(overrides = {}) {
  return {
    code: "TEST001",
    nombre: "Test Product",
    marca: "Test Brand",
    categoriaId: "C001",
    precioCLP: 10000,
    stock: 10,
    rating: 4.5,
    imagen: "/test-image.webp",
    descripcion: "Test product description",
    specs: ["Feature 1", "Feature 2"],
    ...overrides,
  };
}

/**
 * Mock blog article data generator
 */
export function createMockArticle(overrides = {}) {
  return {
    id: "1",
    slug: "test-article",
    title: "Test Article",
    description: "Test article description",
    category: "gaming",
    date: "2025-01-15",
    readingTime: "5 min",
    image: "/test-image.jpg",
    featured: false,
    author: "Test Author",
    content: "Test article content",
    ...overrides,
  };
}

/**
 * Mock cart item data generator
 */
export function createMockCartItem(overrides = {}) {
  return {
    id: "CART001",
    name: "Cart Item",
    price: 10000,
    qty: 1,
    image: "/test.png",
    metadata: {
      marca: "Test Brand",
      categoriaId: "C001",
    },
    ...overrides,
  };
}

/**
 * Mock event data generator
 */
export function createMockEvent(overrides = {}) {
  return {
    id: 1,
    titulo: "Test Event",
    descripcion: "Test event description",
    fecha: "2025-03-15",
    lugar: "Test Venue",
    horaInicio: "10:00",
    horaFin: "18:00",
    precio: 5000,
    cuposDisponibles: 100,
    imagen: "/test-event.jpg",
    ...overrides,
  };
}

/**
 * Wait for async updates
 */
export const waitForAsync = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Mock localStorage
 */
export function mockLocalStorage() {
  const store = {};

  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };
}

/**
 * Suppress console errors/warnings in tests
 */
export function suppressConsole() {
  const originalError = console.error;
  const originalWarn = console.warn;

  beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });
}
