/**
 * Tests for CartItem Component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CartItem from "../CartItem";

describe("CartItem", () => {
  const mockItem = {
    id: 1,
    name: "Test Product",
    price: 10000,
    qty: 2,
    image: "https://example.com/image.jpg",
    stock: 10,
  };

  const mockOnUpdateQuantity = jest.fn();
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render cart item with all details", () => {
      render(
        <CartItem
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByTestId("cart-item-1")).toBeInTheDocument();
      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByText("$10.000")).toBeInTheDocument();
      expect(screen.getByTestId("item-quantity")).toHaveTextContent("2");
      expect(screen.getByTestId("item-subtotal")).toHaveTextContent("$20.000");
    });

    it("should render image when provided", () => {
      render(<CartItem item={mockItem} />);

      const image = screen.getByAltText("Test Product");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", mockItem.image);
    });

    it("should render placeholder when image is not provided", () => {
      const itemWithoutImage = { ...mockItem, image: null };
      render(<CartItem item={itemWithoutImage} />);

      expect(screen.getByText("No image")).toBeInTheDocument();
    });

    it("should show stock warning when stock is low", () => {
      const lowStockItem = { ...mockItem, stock: 5 };
      render(<CartItem item={lowStockItem} />);

      expect(screen.getByText("Solo quedan 5 unidades")).toBeInTheDocument();
    });

    it("should not show stock warning when stock is sufficient", () => {
      const highStockItem = { ...mockItem, stock: 50 };
      render(<CartItem item={highStockItem} />);

      expect(
        screen.queryByText(/Solo quedan.*unidades/)
      ).not.toBeInTheDocument();
    });

    it("should return null when item is not provided", () => {
      const { container } = render(<CartItem item={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Quantity Controls", () => {
    it("should call onUpdateQuantity when increment button is clicked", () => {
      render(
        <CartItem
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      const incrementBtn = screen.getByTestId("increase-qty");
      fireEvent.click(incrementBtn);

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 3);
    });

    it("should call onUpdateQuantity when decrement button is clicked", () => {
      render(
        <CartItem
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      const decrementBtn = screen.getByTestId("decrease-qty");
      fireEvent.click(decrementBtn);

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 1);
    });

    it("should not decrease quantity below 1", () => {
      const singleItemCart = { ...mockItem, qty: 1 };
      render(
        <CartItem
          item={singleItemCart}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      const decrementBtn = screen.getByTestId("decrease-qty");
      expect(decrementBtn).toBeDisabled();
      fireEvent.click(decrementBtn);

      expect(mockOnUpdateQuantity).not.toHaveBeenCalled();
    });

    it("should not increase quantity above stock limit", () => {
      const maxStockItem = { ...mockItem, qty: 10, stock: 10 };
      render(
        <CartItem
          item={maxStockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      const incrementBtn = screen.getByTestId("increase-qty");
      expect(incrementBtn).toBeDisabled();
      fireEvent.click(incrementBtn);

      expect(mockOnUpdateQuantity).not.toHaveBeenCalled();
    });

    it("should handle items with no stock limit", () => {
      const noStockLimitItem = { ...mockItem, stock: null };
      render(
        <CartItem
          item={noStockLimitItem}
          onUpdateQuantity={mockOnUpdateQuantity}
        />
      );

      const incrementBtn = screen.getByTestId("increase-qty");
      expect(incrementBtn).not.toBeDisabled();
      fireEvent.click(incrementBtn);

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 3);
    });

    it("should not call onUpdateQuantity if handler is not provided", () => {
      render(<CartItem item={mockItem} />);

      const incrementBtn = screen.getByTestId("increase-qty");
      fireEvent.click(incrementBtn);

      // Should not throw error
      expect(mockOnUpdateQuantity).not.toHaveBeenCalled();
    });
  });

  describe("Remove Functionality", () => {
    it("should call onRemove when remove button is clicked", () => {
      render(
        <CartItem
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      const removeBtn = screen.getByTestId("remove-item");
      fireEvent.click(removeBtn);

      expect(mockOnRemove).toHaveBeenCalledWith(1);
    });

    it("should not call onRemove if handler is not provided", () => {
      render(<CartItem item={mockItem} />);

      const removeBtn = screen.getByTestId("remove-item");
      fireEvent.click(removeBtn);

      // Should not throw error
      expect(mockOnRemove).not.toHaveBeenCalled();
    });

    it("should have accessible label for remove button", () => {
      render(<CartItem item={mockItem} onRemove={mockOnRemove} />);

      const removeBtn = screen.getByLabelText("Eliminar Test Product");
      expect(removeBtn).toBeInTheDocument();
    });
  });

  describe("Price Calculations", () => {
    it("should calculate subtotal correctly", () => {
      render(<CartItem item={mockItem} />);

      const subtotal = screen.getByTestId("item-subtotal");
      expect(subtotal).toHaveTextContent("$20.000"); // 10000 * 2
    });

    it("should update subtotal when quantity changes", () => {
      const { rerender } = render(<CartItem item={mockItem} />);

      let subtotal = screen.getByTestId("item-subtotal");
      expect(subtotal).toHaveTextContent("$20.000");

      const updatedItem = { ...mockItem, qty: 5 };
      rerender(<CartItem item={updatedItem} />);

      subtotal = screen.getByTestId("item-subtotal");
      expect(subtotal).toHaveTextContent("$50.000");
    });

    it("should format prices correctly for Chilean locale", () => {
      const expensiveItem = { ...mockItem, price: 1500000, qty: 1 };
      render(<CartItem item={expensiveItem} />);

      expect(
        screen.getByText("$1.500.000", { selector: ".cart-item__price" })
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible labels for quantity buttons", () => {
      render(<CartItem item={mockItem} />);

      expect(screen.getByLabelText("Disminuir cantidad")).toBeInTheDocument();
      expect(screen.getByLabelText("Aumentar cantidad")).toBeInTheDocument();
    });

    it("should have proper aria attributes on disabled buttons", () => {
      const singleItemCart = { ...mockItem, qty: 1 };
      render(<CartItem item={singleItemCart} />);

      const decrementBtn = screen.getByLabelText("Disminuir cantidad");
      expect(decrementBtn).toHaveAttribute("disabled");
    });
  });

  describe("Edge Cases", () => {
    it("should handle string IDs", () => {
      const stringIdItem = { ...mockItem, id: "abc-123" };
      render(<CartItem item={stringIdItem} />);

      expect(screen.getByTestId("cart-item-abc-123")).toBeInTheDocument();
    });

    it("should handle zero price", () => {
      const freeItem = { ...mockItem, price: 0 };
      render(<CartItem item={freeItem} />);

      expect(
        screen.getByText("$0", { selector: ".cart-item__price" })
      ).toBeInTheDocument();
      expect(screen.getByTestId("item-subtotal")).toHaveTextContent("$0");
    });

    it("should handle very large quantities", () => {
      const largeQtyItem = { ...mockItem, qty: 999, stock: 1000 };
      render(
        <CartItem item={largeQtyItem} onUpdateQuantity={mockOnUpdateQuantity} />
      );

      expect(screen.getByTestId("item-quantity")).toHaveTextContent("999");
      expect(screen.getByTestId("item-subtotal")).toHaveTextContent(
        "$9.990.000"
      );
    });

    it("should handle undefined stock gracefully", () => {
      const noStockItem = { ...mockItem, stock: undefined };
      render(
        <CartItem item={noStockItem} onUpdateQuantity={mockOnUpdateQuantity} />
      );

      const incrementBtn = screen.getByTestId("increase-qty");
      fireEvent.click(incrementBtn);

      expect(mockOnUpdateQuantity).toHaveBeenCalled();
    });
  });
});
