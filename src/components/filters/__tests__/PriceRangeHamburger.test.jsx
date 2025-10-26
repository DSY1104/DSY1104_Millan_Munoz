/**
 * PriceRangeHamburger Component Tests
 */
import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PriceRangeHamburger from "../PriceRangeHamburger";

// Wrapper component to manage isOpen state
const PriceRangeWrapper = ({ initialOpen = false, ...props }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <PriceRangeHamburger {...props} isOpen={isOpen} onToggle={setIsOpen} />
  );
};

describe("PriceRangeHamburger", () => {
  const mockOnApply = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render with title", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} />);

    expect(screen.getByText(/Rango de Precio/i)).toBeInTheDocument();
  });

  test("should toggle open/close when clicking title", () => {
    const { container } = render(<PriceRangeWrapper onApply={mockOnApply} />);

    const button = screen.getByLabelText(/Mostrar\/Ocultar filtro de precio/i);
    const collapsible = container.querySelector(".filter-sidebar__collapsible");

    // Should be closed initially
    expect(collapsible).not.toHaveClass("filter-sidebar__collapsible--open");

    // Click to open
    fireEvent.click(button);
    expect(collapsible).toHaveClass("filter-sidebar__collapsible--open");

    // Click to close
    fireEvent.click(button);
    expect(collapsible).not.toHaveClass("filter-sidebar__collapsible--open");
  });

  test("should render min and max price inputs", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />);

    const minInput = screen.getByLabelText(/Precio Mínimo/i);
    const maxInput = screen.getByLabelText(/Precio Máximo/i);

    expect(minInput).toBeInTheDocument();
    expect(maxInput).toBeInTheDocument();
    expect(minInput).toHaveAttribute("type", "number");
    expect(maxInput).toHaveAttribute("type", "number");
  });

  test("should update min price input value", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />);

    const minInput = screen.getByLabelText(/Precio Mínimo/i);

    fireEvent.change(minInput, { target: { value: "10000" } });

    expect(minInput.value).toBe("10000");
  });

  test("should update max price input value", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />);

    const maxInput = screen.getByLabelText(/Precio Máximo/i);

    fireEvent.change(maxInput, { target: { value: "50000" } });

    expect(maxInput.value).toBe("50000");
  });

  test("should call onApply with correct values when Apply button is clicked", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />);

    const minInput = screen.getByLabelText(/Precio Mínimo/i);
    const maxInput = screen.getByLabelText(/Precio Máximo/i);
    const applyButton = screen.getByText("Aplicar");

    fireEvent.change(minInput, { target: { value: "10000" } });
    fireEvent.change(maxInput, { target: { value: "50000" } });
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith({ min: 10000, max: 50000 });
  });

  test("should handle only min price", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />);

    const minInput = screen.getByLabelText(/Precio Mínimo/i);
    const applyButton = screen.getByText("Aplicar");

    fireEvent.change(minInput, { target: { value: "10000" } });
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith({ min: 10000, max: null });
  });

  test("should handle only max price", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />);

    const maxInput = screen.getByLabelText(/Precio Máximo/i);
    const applyButton = screen.getByText("Aplicar");

    fireEvent.change(maxInput, { target: { value: "50000" } });
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith({ min: null, max: 50000 });
  });

  test("should clear inputs when Clear button is clicked", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />);

    const minInput = screen.getByLabelText(/Precio Mínimo/i);
    const maxInput = screen.getByLabelText(/Precio Máximo/i);
    const clearButton = screen.getByText("Limpiar");

    fireEvent.change(minInput, { target: { value: "10000" } });
    fireEvent.change(maxInput, { target: { value: "50000" } });
    fireEvent.click(clearButton);

    expect(minInput.value).toBe("");
    expect(maxInput.value).toBe("");
  });

  test("should call onApply with empty values when Clear is clicked", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />);

    const minInput = screen.getByLabelText(/Precio Mínimo/i);
    const maxInput = screen.getByLabelText(/Precio Máximo/i);
    const clearButton = screen.getByText("Limpiar");

    fireEvent.change(minInput, { target: { value: "10000" } });
    fireEvent.change(maxInput, { target: { value: "50000" } });
    fireEvent.click(clearButton);

    expect(mockOnApply).toHaveBeenCalledWith({ min: null, max: null });
  });

  test("should prevent negative values in min input", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />);

    const minInput = screen.getByLabelText(/Precio Mínimo/i);

    expect(minInput).toHaveAttribute("min", "0");
  });

  test("should prevent negative values in max input", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />);

    const maxInput = screen.getByLabelText(/Precio Máximo/i);

    expect(maxInput).toHaveAttribute("min", "0");
  });

  test("should close when Escape key is pressed", () => {
    const { container } = render(
      <PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />
    );

    const button = screen.getByLabelText(/Mostrar\/Ocultar filtro de precio/i);
    const collapsible = container.querySelector(".filter-sidebar__collapsible");

    // Should be open initially
    expect(collapsible).toHaveClass("filter-sidebar__collapsible--open");

    // Press Escape on button
    fireEvent.keyDown(button, { key: "Escape", code: "Escape" });
    expect(collapsible).not.toHaveClass("filter-sidebar__collapsible--open");
  });

  test("should handle decimal values by converting to integers", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />);

    const minInput = screen.getByLabelText(/Precio Mínimo/i);
    const maxInput = screen.getByLabelText(/Precio Máximo/i);
    const applyButton = screen.getByText("Aplicar");

    fireEvent.change(minInput, { target: { value: "10000.50" } });
    fireEvent.change(maxInput, { target: { value: "50000.75" } });
    fireEvent.click(applyButton);

    // parseInt converts decimals to integers
    expect(mockOnApply).toHaveBeenCalledWith({ min: 10000, max: 50000 });
  });

  test("should handle zero values", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />);

    const minInput = screen.getByLabelText(/Precio Mínimo/i);
    const applyButton = screen.getByText("Aplicar");

    fireEvent.change(minInput, { target: { value: "0" } });
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith({ min: 0, max: null });
  });

  test("should call onApply with null for empty inputs", () => {
    render(<PriceRangeWrapper onApply={mockOnApply} initialOpen={true} />);

    const applyButton = screen.getByText("Aplicar");
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith({ min: null, max: null });
  });
});
