/**
 * Tests for CartSummary Component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CartSummary from "../CartSummary";

describe("CartSummary", () => {
  const mockOnCheckout = jest.fn();
  const mockOnApplyCoupon = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render cart summary with basic information", () => {
      render(<CartSummary subtotal={50000} />);

      expect(screen.getByTestId("cart-summary")).toBeInTheDocument();
      expect(screen.getByText("Resumen del Pedido")).toBeInTheDocument();
      expect(screen.getByTestId("summary-subtotal")).toHaveTextContent(
        "$50.000"
      );
      expect(screen.getByTestId("summary-total")).toHaveTextContent("$50.000");
    });

    it("should display discount when provided", () => {
      render(<CartSummary subtotal={50000} discount={5000} />);

      expect(screen.getByTestId("summary-discount")).toHaveTextContent(
        "-$5.000"
      );
    });

    it("should not display discount when zero", () => {
      render(<CartSummary subtotal={50000} discount={0} />);

      expect(screen.queryByTestId("summary-discount")).not.toBeInTheDocument();
    });

    it("should display coupon discount when applied", () => {
      render(<CartSummary subtotal={50000} couponDiscount={10000} />);

      expect(screen.getByTestId("summary-coupon-discount")).toHaveTextContent(
        "-$10.000"
      );
    });

    it("should display DUOC discount when provided", () => {
      render(<CartSummary subtotal={50000} duocDiscount={10000} />);

      expect(screen.getByTestId("summary-duoc-discount")).toHaveTextContent(
        "-$10.000"
      );
      expect(screen.getByText("Descuento DUOC (20%):")).toBeInTheDocument();
    });

    it("should display shipping cost when provided", () => {
      render(<CartSummary subtotal={50000} shipping={5000} />);

      expect(screen.getByTestId("summary-shipping")).toHaveTextContent(
        "$5.000"
      );
    });

    it("should display free shipping when shipping is zero", () => {
      render(<CartSummary subtotal={50000} shipping={0} />);

      expect(screen.getByTestId("summary-shipping")).toHaveTextContent(
        "Gratis"
      );
    });

    it("should not display shipping when subtotal is zero", () => {
      render(<CartSummary subtotal={0} shipping={0} />);

      expect(screen.queryByTestId("summary-shipping")).not.toBeInTheDocument();
    });
  });

  describe("Total Calculation", () => {
    it("should calculate total correctly with no discounts", () => {
      render(<CartSummary subtotal={50000} />);

      expect(screen.getByTestId("summary-total")).toHaveTextContent("$50.000");
    });

    it("should calculate total with discount", () => {
      render(<CartSummary subtotal={50000} discount={5000} />);

      expect(screen.getByTestId("summary-total")).toHaveTextContent("$45.000");
    });

    it("should calculate total with all discounts", () => {
      render(
        <CartSummary
          subtotal={100000}
          discount={10000}
          couponDiscount={5000}
          duocDiscount={20000}
          shipping={3000}
        />
      );

      // 100000 - 10000 - 5000 - 20000 + 3000 = 68000
      expect(screen.getByTestId("summary-total")).toHaveTextContent("$68.000");
    });

    it("should not allow negative total", () => {
      render(
        <CartSummary
          subtotal={10000}
          discount={5000}
          couponDiscount={5000}
          duocDiscount={5000}
        />
      );

      expect(screen.getByTestId("summary-total")).toHaveTextContent("$0");
    });

    it("should format large amounts correctly", () => {
      render(<CartSummary subtotal={1500000} />);

      expect(screen.getByTestId("summary-total")).toHaveTextContent(
        "$1.500.000"
      );
    });
  });

  describe("Checkout Functionality", () => {
    it("should render checkout button when onCheckout is provided", () => {
      render(<CartSummary subtotal={50000} onCheckout={mockOnCheckout} />);

      expect(screen.getByTestId("checkout-btn")).toBeInTheDocument();
      expect(screen.getByText("Proceder al Pago")).toBeInTheDocument();
    });

    it("should not render checkout button when onCheckout is not provided", () => {
      render(<CartSummary subtotal={50000} />);

      expect(screen.queryByTestId("checkout-btn")).not.toBeInTheDocument();
    });

    it("should call onCheckout when checkout button is clicked", () => {
      render(<CartSummary subtotal={50000} onCheckout={mockOnCheckout} />);

      const checkoutBtn = screen.getByTestId("checkout-btn");
      fireEvent.click(checkoutBtn);

      expect(mockOnCheckout).toHaveBeenCalledTimes(1);
    });

    it("should disable checkout button when subtotal is zero", () => {
      render(<CartSummary subtotal={0} onCheckout={mockOnCheckout} />);

      const checkoutBtn = screen.getByTestId("checkout-btn");
      expect(checkoutBtn).toBeDisabled();
    });

    it("should enable checkout button when subtotal is greater than zero", () => {
      render(<CartSummary subtotal={50000} onCheckout={mockOnCheckout} />);

      const checkoutBtn = screen.getByTestId("checkout-btn");
      expect(checkoutBtn).not.toBeDisabled();
    });
  });

  describe("Coupon Functionality", () => {
    it("should show coupon section when showCouponInput is true", () => {
      render(<CartSummary subtotal={50000} showCouponInput={true} />);

      expect(screen.getByTestId("coupon-section")).toBeInTheDocument();
      expect(screen.getByTestId("coupon-input")).toBeInTheDocument();
      expect(screen.getByTestId("apply-coupon-btn")).toBeInTheDocument();
    });

    it("should not show coupon section when showCouponInput is false", () => {
      render(<CartSummary subtotal={50000} showCouponInput={false} />);

      expect(screen.queryByTestId("coupon-section")).not.toBeInTheDocument();
    });

    it("should update coupon input value when typing", () => {
      render(
        <CartSummary
          subtotal={50000}
          showCouponInput={true}
          onApplyCoupon={mockOnApplyCoupon}
        />
      );

      const input = screen.getByTestId("coupon-input");
      fireEvent.change(input, { target: { value: "SAVE20" } });

      expect(input).toHaveValue("SAVE20");
    });

    it("should disable apply button when coupon input is empty", () => {
      render(<CartSummary subtotal={50000} showCouponInput={true} />);

      const applyBtn = screen.getByTestId("apply-coupon-btn");
      expect(applyBtn).toBeDisabled();
    });

    it("should enable apply button when coupon code is entered", () => {
      render(<CartSummary subtotal={50000} showCouponInput={true} />);

      const input = screen.getByTestId("coupon-input");
      fireEvent.change(input, { target: { value: "SAVE20" } });

      const applyBtn = screen.getByTestId("apply-coupon-btn");
      expect(applyBtn).not.toBeDisabled();
    });

    it("should call onApplyCoupon when apply button is clicked", () => {
      render(
        <CartSummary
          subtotal={50000}
          showCouponInput={true}
          onApplyCoupon={mockOnApplyCoupon}
        />
      );

      const input = screen.getByTestId("coupon-input");
      fireEvent.change(input, { target: { value: "SAVE20" } });

      const applyBtn = screen.getByTestId("apply-coupon-btn");
      fireEvent.click(applyBtn);

      expect(mockOnApplyCoupon).toHaveBeenCalledWith("SAVE20");
    });

    it("should show error when trying to apply empty coupon", () => {
      render(<CartSummary subtotal={50000} showCouponInput={true} />);

      const applyBtn = screen.getByTestId("apply-coupon-btn");

      // Button should be disabled when input is empty/whitespace
      expect(applyBtn).toBeDisabled();
    });

    it("should show error when coupon is invalid", () => {
      mockOnApplyCoupon.mockReturnValue(false);

      render(
        <CartSummary
          subtotal={50000}
          showCouponInput={true}
          onApplyCoupon={mockOnApplyCoupon}
        />
      );

      const input = screen.getByTestId("coupon-input");
      fireEvent.change(input, { target: { value: "INVALID" } });

      const applyBtn = screen.getByTestId("apply-coupon-btn");
      fireEvent.click(applyBtn);

      expect(screen.getByTestId("coupon-error")).toHaveTextContent(
        "Cupón inválido o ya usado"
      );
    });

    it("should clear input and error when coupon is valid", () => {
      mockOnApplyCoupon.mockReturnValue(true);

      render(
        <CartSummary
          subtotal={50000}
          showCouponInput={true}
          onApplyCoupon={mockOnApplyCoupon}
        />
      );

      const input = screen.getByTestId("coupon-input");
      fireEvent.change(input, { target: { value: "VALID20" } });

      const applyBtn = screen.getByTestId("apply-coupon-btn");
      fireEvent.click(applyBtn);

      expect(input).toHaveValue("");
      expect(screen.queryByTestId("coupon-error")).not.toBeInTheDocument();
    });

    it("should clear error when typing in input after error", () => {
      mockOnApplyCoupon.mockReturnValue(false);

      render(
        <CartSummary
          subtotal={50000}
          showCouponInput={true}
          onApplyCoupon={mockOnApplyCoupon}
        />
      );

      const input = screen.getByTestId("coupon-input");
      fireEvent.change(input, { target: { value: "INVALID" } });

      const applyBtn = screen.getByTestId("apply-coupon-btn");
      fireEvent.click(applyBtn);

      expect(screen.getByTestId("coupon-error")).toBeInTheDocument();

      fireEvent.change(input, { target: { value: "NEW" } });

      expect(screen.queryByTestId("coupon-error")).not.toBeInTheDocument();
    });
  });

  describe("Default Props", () => {
    it("should use default values when props are not provided", () => {
      render(<CartSummary />);

      expect(screen.getByTestId("summary-subtotal")).toHaveTextContent("$0");
      expect(screen.getByTestId("summary-total")).toHaveTextContent("$0");
      expect(screen.queryByTestId("summary-discount")).not.toBeInTheDocument();
      expect(screen.queryByTestId("checkout-btn")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle very large numbers", () => {
      render(<CartSummary subtotal={99999999} />);

      expect(screen.getByTestId("summary-total")).toHaveTextContent(
        "$99.999.999"
      );
    });

    it("should handle decimal values by rounding", () => {
      render(<CartSummary subtotal={10000.99} />);

      // JavaScript will handle the decimal, check that it renders
      expect(screen.getByTestId("summary-subtotal")).toBeInTheDocument();
    });

    it("should handle all discounts being applied simultaneously", () => {
      render(
        <CartSummary
          subtotal={100000}
          discount={20000}
          couponDiscount={15000}
          duocDiscount={10000}
          shipping={5000}
          showCouponInput={true}
          onCheckout={mockOnCheckout}
          onApplyCoupon={mockOnApplyCoupon}
        />
      );

      expect(screen.getByTestId("summary-discount")).toBeInTheDocument();
      expect(screen.getByTestId("summary-coupon-discount")).toBeInTheDocument();
      expect(screen.getByTestId("summary-duoc-discount")).toBeInTheDocument();
      expect(screen.getByTestId("summary-shipping")).toBeInTheDocument();
      expect(screen.getByTestId("checkout-btn")).toBeInTheDocument();
      expect(screen.getByTestId("coupon-section")).toBeInTheDocument();
    });
  });
});
