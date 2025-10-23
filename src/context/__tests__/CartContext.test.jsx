/**
 * CartContext Tests
 */
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../CartContext";

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

  describe("Cart Initialization", () => {
    test("should initialize with empty cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.cart.items).toEqual([]);
    });

    test("should load cart from localStorage", () => {
      const storedCart = {
        items: [
          {
            id: "1",
            name: "Product 1",
            price: 100,
            qty: 2,
            image: "",
            metadata: {},
          },
        ],
      };
      localStorage.setItem("cart:data", JSON.stringify(storedCart));

      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].id).toBe("1");
    });

    test("should handle corrupted localStorage data", () => {
      localStorage.setItem("cart:data", "invalid json");

      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.cart.items).toEqual([]);
    });
  });

  describe("addToCart", () => {
    test("should add new item to cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
          metadata: { marca: "Logitech" },
        });
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].id).toBe("JM001");
      expect(result.current.cart.items[0].qty).toBe(1);
    });

    test("should increase quantity for existing item", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
        });
      });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 2,
          image: "/test.png",
        });
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].qty).toBe(3);
    });

    test("should not add item without id", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const consoleError = jest.spyOn(console, "error").mockImplementation();

      act(() => {
        result.current.addToCart({
          name: "Invalid Product",
          price: 100,
        });
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe("updateQuantity", () => {
    test("should update item quantity", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
        });
      });

      act(() => {
        result.current.updateQuantity("JM001", 5);
      });

      expect(result.current.cart.items[0].qty).toBe(5);
    });

    test("should remove item when quantity is 0", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
        });
      });

      act(() => {
        result.current.updateQuantity("JM001", 0);
      });

      expect(result.current.cart.items).toHaveLength(0);
    });

    test("should not update non-existent item", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.updateQuantity("INVALID", 5);
      });

      expect(result.current.cart.items).toHaveLength(0);
    });
  });

  describe("removeFromCart", () => {
    test("should remove item from cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
        });
      });

      act(() => {
        result.current.removeFromCart("JM001");
      });

      expect(result.current.cart.items).toHaveLength(0);
    });
  });

  describe("clearCart", () => {
    test("should clear all items from cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
        });
        result.current.addToCart({
          id: "JM002",
          name: "Teclado",
          price: 45000,
          qty: 1,
          image: "/test.png",
        });
      });

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cart.items).toHaveLength(0);
    });
  });

  describe("getTotals", () => {
    test("should calculate correct totals", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 2,
          image: "/test.png",
        });
        result.current.addToCart({
          id: "JM002",
          name: "Teclado",
          price: 45000,
          qty: 1,
          image: "/test.png",
        });
      });

      const totals = result.current.getTotals();

      expect(totals.count).toBe(3);
      expect(totals.subtotal).toBe(95000);
      expect(totals.total).toBe(95000);
    });

    test("should handle empty cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      const totals = result.current.getTotals();

      expect(totals.count).toBe(0);
      expect(totals.subtotal).toBe(0);
      expect(totals.total).toBe(0);
    });
  });

  describe("localStorage sync", () => {
    test("should save cart to localStorage on changes", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
        });
      });

      const stored = JSON.parse(localStorage.getItem("cart:data"));
      expect(stored.items).toHaveLength(1);
      expect(stored.items[0].id).toBe("JM001");
    });
  });
});
