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

  describe("Stock Validation", () => {
    test("should prevent adding items beyond stock limit", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const alertSpy = jest.spyOn(window, "alert").mockImplementation();

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 10,
          stock: 8,
          image: "/test.png",
        });
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("8"));
      alertSpy.mockRestore();
    });

    test("should prevent increasing quantity beyond stock", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const alertSpy = jest.spyOn(window, "alert").mockImplementation();

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 5,
          stock: 8,
          image: "/test.png",
        });
      });

      act(() => {
        result.current.updateQuantity("JM001", 10);
      });

      expect(result.current.cart.items[0].qty).toBe(5);
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("8"));
      alertSpy.mockRestore();
    });

    test("should allow adding items up to stock limit", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 8,
          stock: 8,
          image: "/test.png",
        });
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].qty).toBe(8);
    });

    test("should handle unlimited stock (Infinity)", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1000,
          stock: Infinity,
          image: "/test.png",
        });
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].qty).toBe(1000);
    });

    test("should store stock with cart item", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          stock: 10,
          image: "/test.png",
        });
      });

      expect(result.current.cart.items[0].stock).toBe(10);
    });
  });

  describe("Coupon System", () => {
    test("should apply percentage coupon correctly", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 2,
          image: "/test.png",
        });
      });

      const coupon = {
        code: "TEST10",
        description: "10% off",
        type: "percentage",
        value: 10,
        minPurchase: 0,
      };

      act(() => {
        result.current.applyCoupon(coupon);
      });

      const totals = result.current.getTotals();
      expect(totals.discount).toBe(5000); // 10% of 50000
      expect(totals.total).toBe(45000);
      expect(totals.appliedCoupon).toEqual(coupon);
    });

    test("should apply fixed coupon correctly", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 2,
          image: "/test.png",
        });
      });

      const coupon = {
        code: "SAVE5000",
        description: "$5000 off",
        type: "fixed",
        value: 5000,
        minPurchase: 0,
      };

      act(() => {
        result.current.applyCoupon(coupon);
      });

      const totals = result.current.getTotals();
      expect(totals.discount).toBe(5000);
      expect(totals.total).toBe(45000);
      expect(totals.appliedCoupon).toEqual(coupon);
    });

    test("should remove coupon", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 2,
          image: "/test.png",
        });
      });

      const coupon = {
        code: "TEST10",
        description: "10% off",
        type: "percentage",
        value: 10,
        minPurchase: 0,
      };

      act(() => {
        result.current.applyCoupon(coupon);
      });

      act(() => {
        result.current.removeCoupon();
      });

      const totals = result.current.getTotals();
      expect(totals.discount).toBe(0);
      expect(totals.total).toBe(50000);
      expect(totals.appliedCoupon).toBeNull();
    });

    test("should persist coupon in localStorage", () => {
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

      const coupon = {
        code: "TEST10",
        description: "10% off",
        type: "percentage",
        value: 10,
        minPurchase: 0,
      };

      act(() => {
        result.current.applyCoupon(coupon);
      });

      const stored = JSON.parse(localStorage.getItem("cart:data"));
      expect(stored.appliedCoupon).toEqual(coupon);
    });

    test("should handle high percentage discounts", () => {
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

      const coupon = {
        code: "MEGA90",
        description: "90% off",
        type: "percentage",
        value: 90,
        minPurchase: 0,
      };

      act(() => {
        result.current.applyCoupon(coupon);
      });

      const totals = result.current.getTotals();
      expect(totals.discount).toBe(22500); // 90% of 25000
      expect(totals.total).toBe(2500);
    });

    test("should not apply discount exceeding cart total for fixed coupons", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 10000,
          qty: 1,
          image: "/test.png",
        });
      });

      const coupon = {
        code: "SAVE50K",
        description: "$50K off",
        type: "fixed",
        value: 50000,
        minPurchase: 0,
      };

      act(() => {
        result.current.applyCoupon(coupon);
      });

      const totals = result.current.getTotals();
      // Total should not go negative
      expect(totals.total).toBeGreaterThanOrEqual(0);
    });

    test("should load coupon from localStorage on init", () => {
      const storedCart = {
        items: [
          {
            id: "JM001",
            name: "Mouse Gaming",
            price: 25000,
            qty: 1,
            image: "/test.png",
          },
        ],
        appliedCoupon: {
          code: "TEST10",
          description: "10% off",
          type: "percentage",
          value: 10,
          minPurchase: 0,
        },
      };
      localStorage.setItem("cart:data", JSON.stringify(storedCart));

      const { result } = renderHook(() => useCart(), { wrapper });

      const totals = result.current.getTotals();
      expect(totals.appliedCoupon).toBeTruthy();
      expect(totals.appliedCoupon.code).toBe("TEST10");
      expect(totals.discount).toBe(2500);
    });
  });

  describe("Edge Cases", () => {
    test("should accept empty string as item id (no validation)", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "",
          name: "Invalid Product",
          price: 100,
          qty: 1,
        });
      });

      // CartContext doesn't validate IDs, so empty string is accepted
      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].id).toBe("");
    });

    test("should handle negative quantity", () => {
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
        result.current.updateQuantity("JM001", -5);
      });

      // Should remove item or set to 0
      expect(
        result.current.cart.items.length === 0 ||
          result.current.cart.items[0].qty === 0
      ).toBeTruthy();
    });

    test("should handle very large quantities", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 999999,
          stock: Infinity,
          image: "/test.png",
        });
      });

      expect(result.current.cart.items[0].qty).toBe(999999);
      const totals = result.current.getTotals();
      expect(totals.subtotal).toBe(24999975000);
    });
  });
});
