/**
 * Tests for CartDetail Component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CartDetail from "../CartDetail";

// Mock CartItem component
jest.mock("../CartItem", () => {
  return function MockCartItem({ item, onUpdateQuantity, onRemove }) {
    return (
      <div data-testid={`mock-cart-item-${item.id}`}>
        <span>{item.name}</span>
        <button onClick={() => onUpdateQuantity(item.id, item.qty + 1)}>
          Increase
        </button>
        <button onClick={() => onRemove(item.id)}>Remove</button>
      </div>
    );
  };
});

describe("CartDetail", () => {
  const mockItems = [
    {
      id: 1,
      name: "Product 1",
      price: 10000,
      qty: 2,
      image: "image1.jpg",
      stock: 10,
    },
    {
      id: 2,
      name: "Product 2",
      price: 15000,
      qty: 1,
      image: "image2.jpg",
      stock: 5,
    },
    {
      id: 3,
      name: "Product 3",
      price: 20000,
      qty: 3,
      image: "image3.jpg",
      stock: 20,
    },
  ];

  const mockOnUpdateQuantity = jest.fn();
  const mockOnRemoveItem = jest.fn();
  const mockOnClearCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.confirm to return true by default
    global.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    global.confirm.mockRestore();
  });

  describe("Rendering with items", () => {
    it("should render cart detail with items", () => {
      render(
        <CartDetail
          items={mockItems}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemoveItem={mockOnRemoveItem}
          onClearCart={mockOnClearCart}
        />
      );

      expect(screen.getByTestId("cart-detail")).toBeInTheDocument();
      expect(screen.getByText(/Carrito de Compras/)).toBeInTheDocument();
    });

    it("should display correct number of products in header", () => {
      render(<CartDetail items={mockItems} />);

      expect(
        screen.getByText("Carrito de Compras (3 productos)")
      ).toBeInTheDocument();
    });

    it("should use singular 'producto' when only one item", () => {
      const singleItem = [mockItems[0]];
      render(<CartDetail items={singleItem} />);

      expect(
        screen.getByText("Carrito de Compras (1 producto)")
      ).toBeInTheDocument();
    });

    it("should render all cart items", () => {
      render(<CartDetail items={mockItems} />);

      expect(screen.getByTestId("mock-cart-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("mock-cart-item-2")).toBeInTheDocument();
      expect(screen.getByTestId("mock-cart-item-3")).toBeInTheDocument();
    });

    it("should display total item count in footer", () => {
      render(<CartDetail items={mockItems} />);

      // Total qty: 2 + 1 + 3 = 6
      expect(screen.getByTestId("total-items")).toHaveTextContent(
        "Total de productos: 6"
      );
    });

    it("should calculate total items correctly", () => {
      const customItems = [
        { ...mockItems[0], qty: 5 },
        { ...mockItems[1], qty: 3 },
      ];
      render(<CartDetail items={customItems} />);

      expect(screen.getByTestId("total-items")).toHaveTextContent(
        "Total de productos: 8"
      );
    });
  });

  describe("Empty cart state", () => {
    it("should render empty state when no items", () => {
      render(<CartDetail items={[]} />);

      expect(screen.getByTestId("cart-detail-empty")).toBeInTheDocument();
      expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument();
      expect(
        screen.getByText("Agrega productos para comenzar a comprar")
      ).toBeInTheDocument();
    });

    it("should show cart icon in empty state", () => {
      render(<CartDetail items={[]} />);

      expect(screen.getByText("🛒")).toBeInTheDocument();
    });

    it("should not render clear button in empty state", () => {
      render(<CartDetail items={[]} />);

      expect(screen.queryByTestId("clear-cart-btn")).not.toBeInTheDocument();
    });

    it("should use default empty array when items prop is not provided", () => {
      render(<CartDetail />);

      expect(screen.getByTestId("cart-detail-empty")).toBeInTheDocument();
    });
  });

  describe("Clear Cart Functionality", () => {
    it("should render clear cart button by default", () => {
      render(<CartDetail items={mockItems} onClearCart={mockOnClearCart} />);

      expect(screen.getByTestId("clear-cart-btn")).toBeInTheDocument();
      expect(screen.getByText("Vaciar Carrito")).toBeInTheDocument();
    });

    it("should not render clear button when showClearButton is false", () => {
      render(
        <CartDetail
          items={mockItems}
          onClearCart={mockOnClearCart}
          showClearButton={false}
        />
      );

      expect(screen.queryByTestId("clear-cart-btn")).not.toBeInTheDocument();
    });

    it("should show confirmation dialog when clear button is clicked", () => {
      render(<CartDetail items={mockItems} onClearCart={mockOnClearCart} />);

      const clearBtn = screen.getByTestId("clear-cart-btn");
      fireEvent.click(clearBtn);

      expect(global.confirm).toHaveBeenCalledWith(
        "¿Estás seguro de que deseas vaciar el carrito?"
      );
    });

    it("should call onClearCart when user confirms", () => {
      global.confirm.mockReturnValue(true);

      render(<CartDetail items={mockItems} onClearCart={mockOnClearCart} />);

      const clearBtn = screen.getByTestId("clear-cart-btn");
      fireEvent.click(clearBtn);

      expect(mockOnClearCart).toHaveBeenCalledTimes(1);
    });

    it("should not call onClearCart when user cancels", () => {
      global.confirm.mockReturnValue(false);

      render(<CartDetail items={mockItems} onClearCart={mockOnClearCart} />);

      const clearBtn = screen.getByTestId("clear-cart-btn");
      fireEvent.click(clearBtn);

      expect(mockOnClearCart).not.toHaveBeenCalled();
    });

    it("should not show confirm dialog when cart is empty", () => {
      render(<CartDetail items={[]} onClearCart={mockOnClearCart} />);

      // Empty cart doesn't render clear button
      expect(screen.queryByTestId("clear-cart-btn")).not.toBeInTheDocument();
    });

    it("should not call onClearCart if handler is not provided", () => {
      render(<CartDetail items={mockItems} />);

      const clearBtn = screen.getByTestId("clear-cart-btn");
      fireEvent.click(clearBtn);

      // Should not throw error even without handler
      expect(mockOnClearCart).not.toHaveBeenCalled();
    });
  });

  describe("Item Interactions", () => {
    it("should pass onUpdateQuantity to CartItem components", () => {
      render(
        <CartDetail
          items={mockItems}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemoveItem={mockOnRemoveItem}
        />
      );

      const increaseBtn = screen.getAllByText("Increase")[0];
      fireEvent.click(increaseBtn);

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 3);
    });

    it("should pass onRemove to CartItem components", () => {
      render(
        <CartDetail
          items={mockItems}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemoveItem={mockOnRemoveItem}
        />
      );

      const removeBtn = screen.getAllByText("Remove")[0];
      fireEvent.click(removeBtn);

      expect(mockOnRemoveItem).toHaveBeenCalledWith(1);
    });

    it("should handle interactions with multiple items", () => {
      render(
        <CartDetail
          items={mockItems}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemoveItem={mockOnRemoveItem}
        />
      );

      const increaseBtns = screen.getAllByText("Increase");
      fireEvent.click(increaseBtns[1]); // Click second item

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith(2, 2);
    });
  });

  describe("Edge Cases", () => {
    it("should handle items with zero quantity", () => {
      const zeroQtyItems = [{ ...mockItems[0], qty: 0 }];
      render(<CartDetail items={zeroQtyItems} />);

      expect(screen.getByTestId("total-items")).toHaveTextContent(
        "Total de productos: 0"
      );
    });

    it("should handle items with undefined qty", () => {
      const undefinedQtyItems = [
        { ...mockItems[0], qty: undefined },
        { ...mockItems[1], qty: 2 },
      ];
      render(<CartDetail items={undefinedQtyItems} />);

      // Should default to 0 for undefined qty
      expect(screen.getByTestId("total-items")).toHaveTextContent(
        "Total de productos: 2"
      );
    });

    it("should handle very large number of items", () => {
      const manyItems = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        price: 10000,
        qty: 1,
        stock: 10,
      }));

      render(<CartDetail items={manyItems} />);

      expect(
        screen.getByText("Carrito de Compras (100 productos)")
      ).toBeInTheDocument();
      expect(screen.getByTestId("total-items")).toHaveTextContent(
        "Total de productos: 100"
      );
    });

    it("should handle items with string IDs", () => {
      const stringIdItems = [
        { ...mockItems[0], id: "abc-123" },
        { ...mockItems[1], id: "def-456" },
      ];

      render(<CartDetail items={stringIdItems} />);

      expect(screen.getByTestId("mock-cart-item-abc-123")).toBeInTheDocument();
      expect(screen.getByTestId("mock-cart-item-def-456")).toBeInTheDocument();
    });

    it("should render without any handlers provided", () => {
      render(<CartDetail items={mockItems} />);

      expect(screen.getByTestId("cart-detail")).toBeInTheDocument();
      expect(screen.getAllByTestId(/mock-cart-item/)).toHaveLength(3);
    });

    it("should handle items with missing properties gracefully", () => {
      const minimalItems = [
        { id: 1, name: "Product 1", price: 10000, qty: 1 },
        { id: 2, name: "Product 2", price: 15000, qty: 2 },
      ];

      render(<CartDetail items={minimalItems} />);

      expect(screen.getByTestId("cart-detail")).toBeInTheDocument();
      expect(screen.getByTestId("total-items")).toHaveTextContent(
        "Total de productos: 3"
      );
    });
  });

  describe("Accessibility", () => {
    it("should have semantic HTML structure", () => {
      render(<CartDetail items={mockItems} />);

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        /Carrito de Compras/
      );
    });

    it("should have accessible clear button", () => {
      render(<CartDetail items={mockItems} onClearCart={mockOnClearCart} />);

      const clearBtn = screen.getByText("Vaciar Carrito");
      expect(clearBtn).toBeInTheDocument();
    });
  });

  describe("Default Props", () => {
    it("should use default values when props are not provided", () => {
      render(<CartDetail />);

      expect(screen.getByTestId("cart-detail-empty")).toBeInTheDocument();
    });

    it("should show clear button by default when items exist", () => {
      render(<CartDetail items={mockItems} />);

      expect(screen.getByTestId("clear-cart-btn")).toBeInTheDocument();
    });
  });
});
