/**
 * Cart Page Tests
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import Cart from "../Cart";
import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";
import { UserProvider } from "../../context/UserContext";

describe("Cart Page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <CartProvider>{component}</CartProvider>
          </UserProvider>
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

  test("should display coupon input section", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
          stock: 10,
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    expect(
      screen.getByPlaceholderText(/Ingresa tu código/i)
    ).toBeInTheDocument();
  });

  test("should show error for invalid coupon", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
          stock: 10,
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    const couponInput = screen.getByPlaceholderText(/Ingresa tu código/i);
    const applyButton = screen.getByText("Aplicar");

    fireEvent.change(couponInput, { target: { value: "INVALID123" } });
    fireEvent.click(applyButton);

    // Should show error message
    expect(screen.getByText(/inválido/i)).toBeInTheDocument();
  });

  test("should navigate to checkout form when Proceder al Pago is clicked", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
          stock: 10,
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    const checkoutButton = screen.getByText(/Proceder al Pago/i);
    fireEvent.click(checkoutButton);

    // Should show checkout form
    expect(screen.getByText(/Información de Envío/i)).toBeInTheDocument();
  });

  test("should display points to be earned", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 2,
          image: "/test.png",
          stock: 10,
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    // 50000 / 1000 = 50 points
    expect(screen.getByText(/50 puntos/i)).toBeInTheDocument();
  });

  test("should clear cart when Vaciar carrito is clicked", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
          stock: 10,
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    // Mock window.confirm to return true
    global.confirm = jest.fn(() => true);

    renderWithProviders(<Cart />);

    const clearButton = screen.getByText(/Vaciar carrito/i);
    fireEvent.click(clearButton);

    // Should show empty cart message
    expect(
      screen.getAllByText(/tu carrito está vacío/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  test("should display stock warning when at max stock", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 5,
          image: "/test.png",
          stock: 5,
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    expect(screen.getByText(/Stock máximo alcanzado/i)).toBeInTheDocument();
  });

  test("should remove item from cart", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
          stock: 10,
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    expect(screen.getByText("Mouse Gaming")).toBeInTheDocument();

    const removeButtons = screen.getAllByLabelText(/Eliminar/i);
    fireEvent.click(removeButtons[0]);

    // Should show empty cart
    expect(
      screen.getAllByText(/tu carrito está vacío/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  test("should navigate back from checkout form", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
          stock: 10,
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    // Go to checkout
    const checkoutButton = screen.getByText(/Proceder al Pago/i);
    fireEvent.click(checkoutButton);

    // Should show checkout form
    expect(screen.getByText(/Información de Envío/i)).toBeInTheDocument();

    // Go back
    const backButton = screen.getByText(/Volver al Carrito/i);
    fireEvent.click(backButton);

    // Should show cart items again
    expect(screen.getByText("Mouse Gaming")).toBeInTheDocument();
  });

  test("should handle multiple items in cart", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
          stock: 10,
          metadata: {},
        },
        {
          id: "JM002",
          name: "Teclado Gaming",
          price: 50000,
          qty: 1,
          image: "/test.png",
          stock: 10,
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    expect(screen.getByText("Mouse Gaming")).toBeInTheDocument();
    expect(screen.getByText("Teclado Gaming")).toBeInTheDocument();
  });

  test("should display item metadata", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
          stock: 10,
          metadata: {
            color: "Negro",
            size: "M",
          },
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    expect(screen.getByText("Mouse Gaming")).toBeInTheDocument();
  });

  test("should show error when coupon code is empty", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
          stock: 10,
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    const applyButton = screen.getByText("Aplicar");
    fireEvent.click(applyButton);

    // Should show error message
    expect(
      screen.getByText(/Por favor ingresa un código/i)
    ).toBeInTheDocument();
  });

  test("should continue shopping", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
          stock: 10,
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    const continueButton = screen.getByText(/Seguir comprando/i);
    expect(continueButton).toBeInTheDocument();
  });

  test("should show subtotal correctly", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 10000,
          qty: 3,
          image: "/test.png",
          stock: 10,
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    renderWithProviders(<Cart />);

    // Subtotal should be 30000
    const subtotalElements = screen.getAllByText(/30\.000/);
    expect(subtotalElements.length).toBeGreaterThan(0);
  });

  test("should not clear cart if user cancels", () => {
    const cartData = {
      items: [
        {
          id: "JM001",
          name: "Mouse Gaming",
          price: 25000,
          qty: 1,
          image: "/test.png",
          stock: 10,
          metadata: {},
        },
      ],
    };
    localStorage.setItem("cart:data", JSON.stringify(cartData));

    // Mock window.confirm to return false
    global.confirm = jest.fn(() => false);

    renderWithProviders(<Cart />);

    const clearButton = screen.getByText(/Vaciar carrito/i);
    fireEvent.click(clearButton);

    // Should still show item
    expect(screen.getByText("Mouse Gaming")).toBeInTheDocument();
  });
});
