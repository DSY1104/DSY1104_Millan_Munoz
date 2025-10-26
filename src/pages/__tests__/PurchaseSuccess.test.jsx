/**
 * PurchaseSuccess Page Tests
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, useLocation } from "react-router-dom";
import PurchaseSuccess from "../PurchaseSuccess";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(),
}));

describe("PurchaseSuccess Page", () => {
  const mockOrderData = {
    orderNumber: "ORD-1234567890-123",
    orderDate: "26 de octubre de 2025, 14:30",
    deliveryDate: "2 de noviembre",
    paymentMethod: "Tarjeta de Crédito",
    shipping: {
      fullName: "Oscar Munoz",
      email: "osca.munozs@duocuc.cl",
      phone: "+56 9 1234 5678",
      rut: "12345678-9",
      addressLine1: "Av. Providencia 1234",
      addressLine2: "Depto 56",
      city: "Santiago",
      region: "Región Metropolitana",
      postalCode: "8320000",
    },
    items: [
      {
        id: "JM001",
        name: "Mouse Gaming RGB",
        image: "/test-image.webp",
        price: 25000,
        qty: 2,
      },
      {
        id: "TEC002",
        name: "Teclado Mecánico",
        image: "/test-keyboard.webp",
        price: 45000,
        qty: 1,
      },
    ],
    pricing: {
      subtotal: 95000,
      discount: 5000,
      duocDiscount: 18000,
      total: 72000,
    },
    pointsEarned: 95,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useLocation.mockReturnValue({
      state: { orderData: mockOrderData },
    });
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  test("should render success message and order number", () => {
    renderWithRouter(<PurchaseSuccess />);

    expect(screen.getByText(/¡Compra Exitosa!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Tu pedido ha sido procesado correctamente/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/ORD-1234567890-123/)).toBeInTheDocument();
  });

  test("should display order information correctly", () => {
    renderWithRouter(<PurchaseSuccess />);

    expect(
      screen.getByText(/26 de octubre de 2025, 14:30/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/2 de noviembre/i)).toBeInTheDocument();
    expect(screen.getByText(/Tarjeta de Crédito/i)).toBeInTheDocument();
  });

  test("should render shipping information", () => {
    renderWithRouter(<PurchaseSuccess />);

    expect(screen.getByText(/Oscar Munoz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/osca.munozs@duocuc.cl/i)).toHaveLength(2); // Appears in recipient and confirmation
    expect(screen.getByText(/\+56 9 1234 5678/i)).toBeInTheDocument();
    expect(screen.getByText(/Av. Providencia 1234/i)).toBeInTheDocument();
    expect(screen.getByText(/Santiago/i)).toBeInTheDocument();
  });

  test("should display purchased items", () => {
    renderWithRouter(<PurchaseSuccess />);

    expect(screen.getByText(/Mouse Gaming RGB/i)).toBeInTheDocument();
    expect(screen.getByText(/Teclado Mecánico/i)).toBeInTheDocument();
    expect(screen.getByText(/Cantidad: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Cantidad: 1/i)).toBeInTheDocument();
  });

  test("should show pricing breakdown", () => {
    renderWithRouter(<PurchaseSuccess />);

    expect(screen.getByText(/Subtotal/i)).toBeInTheDocument();
    expect(screen.getByText(/\$95\.000/i)).toBeInTheDocument();
    expect(screen.getByText(/\$72\.000/i)).toBeInTheDocument();
  });

  test("should display discount if present", () => {
    renderWithRouter(<PurchaseSuccess />);

    expect(screen.getByText(/Descuento cupón/i)).toBeInTheDocument();
    expect(screen.getByText(/-\$5\.000/i)).toBeInTheDocument();
  });

  test("should display DUOC discount if present", () => {
    renderWithRouter(<PurchaseSuccess />);

    expect(screen.getByText(/Descuento DUOC/i)).toBeInTheDocument();
    expect(screen.getByText(/-\$18\.000/i)).toBeInTheDocument();
  });

  test("should display points earned", () => {
    renderWithRouter(<PurchaseSuccess />);

    expect(screen.getByText(/95 puntos/i)).toBeInTheDocument();
  });

  test("should navigate to home when home button is clicked", () => {
    renderWithRouter(<PurchaseSuccess />);

    const homeButton = screen.getByText(/Volver al Inicio/i);
    fireEvent.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("should navigate to catalog when continue shopping button is clicked", () => {
    renderWithRouter(<PurchaseSuccess />);

    const continueButton = screen.getByText(/Seguir Comprando/i);
    fireEvent.click(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith("/products");
  });

  test("should redirect to home when orderData is missing", () => {
    useLocation.mockReturnValue({ state: null });

    renderWithRouter(<PurchaseSuccess />);

    // Should redirect to home when no order data
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("should not display regular discount if not present", () => {
    const orderWithoutDiscount = {
      ...mockOrderData,
      pricing: {
        ...mockOrderData.pricing,
        discount: 0,
      },
    };

    useLocation.mockReturnValue({
      state: { orderData: orderWithoutDiscount },
    });

    renderWithRouter(<PurchaseSuccess />);

    expect(screen.queryByText(/Descuento cupón/i)).not.toBeInTheDocument();
  });

  test("should not display DUOC discount if not present", () => {
    const orderWithoutDuocDiscount = {
      ...mockOrderData,
      pricing: {
        ...mockOrderData.pricing,
        duocDiscount: 0,
      },
    };

    useLocation.mockReturnValue({
      state: { orderData: orderWithoutDuocDiscount },
    });

    renderWithRouter(<PurchaseSuccess />);

    expect(screen.queryByText(/Descuento DUOC/i)).not.toBeInTheDocument();
  });

  test("should display addressLine2 when present", () => {
    renderWithRouter(<PurchaseSuccess />);

    expect(screen.getByText(/Depto 56/i)).toBeInTheDocument();
  });

  test("should handle missing addressLine2", () => {
    const orderWithoutAddressLine2 = {
      ...mockOrderData,
      shipping: {
        ...mockOrderData.shipping,
        addressLine2: "",
      },
    };

    useLocation.mockReturnValue({
      state: { orderData: orderWithoutAddressLine2 },
    });

    renderWithRouter(<PurchaseSuccess />);

    // Should render without addressLine2
    expect(screen.getByText(/Av. Providencia 1234/i)).toBeInTheDocument();
  });
});
