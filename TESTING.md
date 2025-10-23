# Testing Documentation

This project uses **Jest** and **React Testing Library** for comprehensive unit and integration testing.

## Table of Contents

- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Coverage](#coverage)
- [Best Practices](#best-practices)

## Setup

All testing dependencies are already installed. The project includes:

- **Jest** - Testing framework
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM
- **@testing-library/user-event** - User interaction simulation

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

### Run specific test file

```bash
npm test -- ProductCard.test.jsx
```

### Run tests matching a pattern

```bash
npm test -- --testNamePattern="should add product to cart"
```

## Test Structure

Tests are organized alongside the code they test:

```
src/
├── components/
│   ├── blog/
│   │   ├── BlogCard.jsx
│   │   └── __tests__/
│   │       └── BlogCard.test.jsx
│   ├── products/
│   │   ├── ProductCard.jsx
│   │   └── __tests__/
│   │       └── ProductCard.test.jsx
├── context/
│   ├── CartContext.jsx
│   └── __tests__/
│       └── CartContext.test.jsx
├── services/
│   ├── catalogService.js
│   └── __tests__/
│       └── catalogService.test.js
├── pages/
│   ├── Cart.jsx
│   └── __tests__/
│       └── Cart.test.jsx
└── __tests__/
    ├── integration/
    │   └── cart-workflow.test.jsx
    └── utils/
        └── test-utils.js
```

## Writing Tests

### Unit Tests

Test individual components or functions in isolation:

```javascript
import { render, screen } from "@testing-library/react";
import ProductCard from "../ProductCard";

test("should render product name", () => {
  render(<ProductCard nombre="Test Product" />);
  expect(screen.getByText("Test Product")).toBeInTheDocument();
});
```

### Integration Tests

Test how components work together:

```javascript
import { renderWithAllProviders } from "../utils/test-utils";
import ProductCard from "../../components/products/ProductCard";

test("should add product to cart", () => {
  renderWithAllProviders(<ProductCard {...mockProduct} />);
  // ... test cart interaction
});
```

### Using Test Utilities

The `test-utils.js` file provides helpful functions:

```javascript
import {
  renderWithAllProviders,
  createMockProduct,
  createMockCartItem,
} from "../__tests__/utils/test-utils";

test("example test", () => {
  const product = createMockProduct({ nombre: "Custom Product" });
  renderWithAllProviders(<ProductCard {...product} />);
  // ... assertions
});
```

## Test Coverage

Current test coverage includes:

### Services (src/services/)

- ✅ `catalogService.js` - Product fetching and filtering
- ✅ `blogService.js` - Blog article management
- ✅ `categoryService.js` - Category data
- ✅ `eventService.js` - Event management

### Context (src/context/)

- ✅ `CartContext.jsx` - Shopping cart state management
- ✅ `AuthContext.jsx` - Authentication state

### Components

- ✅ `ProductCard.jsx` - Product display and cart interaction
- ✅ `BlogCard.jsx` - Blog article cards
- ✅ `Navigation.jsx` - Navigation menu
- ✅ `Footer.jsx` - Footer component

### Pages

- ✅ `Cart.jsx` - Shopping cart page
- ✅ `Home.jsx` - Home page

### Integration Tests

- ✅ Cart workflow - End-to-end cart functionality

## Best Practices

### 1. Test User Behavior, Not Implementation

❌ **Bad:**

```javascript
expect(component.state.count).toBe(5);
```

✅ **Good:**

```javascript
expect(screen.getByText("Items: 5")).toBeInTheDocument();
```

### 2. Use Semantic Queries

Prefer queries in this order:

1. `getByRole` (most accessible)
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` (last resort)

```javascript
// Prefer this
const button = screen.getByRole("button", { name: /add to cart/i });

// Over this
const button = screen.getByTestId("add-button");
```

### 3. Test Accessibility

```javascript
test("should have accessible button", () => {
  render(<ProductCard {...mockProduct} />);

  const button = screen.getByRole("button", { name: /agregar al carrito/i });
  expect(button).toBeEnabled();
});
```

### 4. Clean Up After Tests

```javascript
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});
```

### 5. Mock External Dependencies

```javascript
// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockResolvedValue({
    ok: true,
    json: async () => mockData,
  });
});
```

### 6. Test Edge Cases

```javascript
test("should handle out of stock products", () => {
  const product = createMockProduct({ stock: 0 });
  render(<ProductCard {...product} />);

  expect(screen.getByText("Sin stock")).toBeInTheDocument();
  expect(screen.getByRole("button")).toBeDisabled();
});
```

### 7. Use Descriptive Test Names

```javascript
// ❌ Bad
test("cart test", () => {
  /* ... */
});

// ✅ Good
test("should increase quantity when adding existing item to cart", () => {
  /* ... */
});
```

## Common Testing Patterns

### Testing Async Operations

```javascript
test("should load products", async () => {
  render(<ProductList />);

  await waitFor(() => {
    expect(screen.getByText("Mouse Gaming")).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```javascript
test("should increment quantity on click", () => {
  render(<QuantitySelector />);

  const incrementButton = screen.getByLabelText("Aumentar cantidad");
  fireEvent.click(incrementButton);

  expect(screen.getByDisplayValue("2")).toBeInTheDocument();
});
```

### Testing Forms

```javascript
test("should submit form with correct data", async () => {
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
  await userEvent.type(screen.getByLabelText(/password/i), "password123");
  await userEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    email: "test@example.com",
    password: "password123",
  });
});
```

### Testing Context

```javascript
test("should provide cart context", () => {
  const { result } = renderHook(() => useCart(), {
    wrapper: CartProvider,
  });

  expect(result.current.cart.items).toEqual([]);
});
```

## Debugging Tests

### View rendered output

```javascript
import { render, screen } from "@testing-library/react";
import { debug } from "@testing-library/react";

test("debug example", () => {
  render(<MyComponent />);
  screen.debug(); // Prints DOM to console
});
```

### Run single test

```bash
npm test -- --testNamePattern="specific test name"
```

### Update snapshots

```bash
npm test -- -u
```

## Continuous Integration

Tests should run automatically in CI/CD pipeline:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test -- --coverage --watchAll=false
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Common Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
