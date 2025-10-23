# Checkout Step 2 - Implementation Documentation

## Overview

This document describes the implementation of Step 2 in the cart/checkout process, where users can enter their shipping information and select a payment method.

## Features Implemented

### 1. Two-Step Cart Process

- **Step 1**: Cart items view (existing functionality)
- **Step 2**: Checkout form with shipping information and payment method selection

### 2. Checkout Form Components

#### Personal Information Section

- **Full Name**: Required, minimum 3 characters
- **RUT**: Required, Chilean format validation (12345678-9)
- **Email**: Required, valid email format
- **Phone**: Required, Chilean phone format validation

#### Shipping Address Section

- **Address Line 1**: Required, minimum 5 characters
- **Address Line 2**: Optional (apartment, office, etc.)
- **City/Comuna**: Required
- **Region**: Required, dropdown with all Chilean regions
- **Postal Code**: Optional, 7-digit validation

#### Payment Method Section

- **Credit Card**: 💳
- **Debit Card**: 💳
- **Bank Transfer**: 🏦
- **PayPal**: 🅿️

## Technologies Used

### React Hook Form

- Form state management
- Built-in validation
- Error handling
- Form submission

### CartContext Integration

- Maintains cart items in Step 2
- Preserves totals and summary
- Cart clearing after successful payment

## User Flow

```
1. User adds items to cart
   ↓
2. User navigates to /cart
   ↓
3. Step 1: Reviews cart items
   ↓
4. Clicks "Proceder al Pago"
   ↓
5. Step 2: Fills checkout form
   ↓
6. Selects payment method
   ↓
7. Clicks "Realizar Pago"
   ↓
8. Payment processed (mock)
   ↓
9. Cart cleared
   ↓
10. Redirect to home
```

## Form Validation

### Client-Side Validation Rules

**Full Name**

```javascript
{
  required: "El nombre completo es obligatorio",
  minLength: {
    value: 3,
    message: "El nombre debe tener al menos 3 caracteres"
  }
}
```

**RUT**

```javascript
{
  required: "El RUT es obligatorio",
  pattern: {
    value: /^[0-9]+-[0-9kK]{1}$/,
    message: "Formato de RUT inválido (ej: 12345678-9)"
  }
}
```

**Email**

```javascript
{
  required: "El email es obligatorio",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Email inválido"
  }
}
```

**Phone**

```javascript
{
  required: "El teléfono es obligatorio",
  pattern: {
    value: /^(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}$/,
    message: "Teléfono inválido (formato chileno)"
  }
}
```

**Address Line 1**

```javascript
{
  required: "La dirección es obligatoria",
  minLength: {
    value: 5,
    message: "La dirección debe tener al menos 5 caracteres"
  }
}
```

**Postal Code**

```javascript
{
  pattern: {
    value: /^[0-9]{7}$/,
    message: "Código postal inválido (7 dígitos)"
  }
}
```

## Component Structure

### Cart.jsx

```
Cart (Main Component)
├── State Management
│   ├── step (1 or 2)
│   ├── selectedPaymentMethod
│   └── React Hook Form state
├── Step 1: Cart Items View
│   ├── CartItem components
│   └── Cart actions
├── Step 2: Checkout Form
│   └── CheckoutForm component
└── Summary Card (persists in both steps)
    └── Button text changes based on step
```

### CheckoutForm Component

```
CheckoutForm
├── Back to Cart button
├── Personal Information Section
│   ├── Full Name input
│   ├── RUT input
│   ├── Email input
│   └── Phone input
├── Shipping Address Section
│   ├── Address Line 1 input
│   ├── Address Line 2 input
│   ├── City input
│   ├── Region select
│   └── Postal Code input
└── Payment Method Section
    └── Payment method cards (radio buttons)
```

## Data Flow

### Auto-Fill from User Profile

When entering Step 2, the form automatically pre-fills with data from localStorage `userProfile`:

- Full Name
- Email
- Phone
- RUT
- Address Line 1
- Address Line 2
- City
- Region
- Postal Code

### Form Submission

```javascript
const handlePayment = (data) => {
  // Validate payment method selected
  if (!selectedPaymentMethod) {
    alert("Por favor selecciona un método de pago");
    return;
  }

  // Collect all data
  const paymentData = {
    ...data, // Form fields
    paymentMethod: selectedPaymentMethod,
    items: items, // From CartContext
    totals: getTotals(), // From CartContext
  };

  // Process payment (TODO: Backend integration)
  console.log("Payment data:", paymentData);

  // Clear cart
  clearCart();

  // Reset to step 1
  setStep(1);

  // Navigate to home
  navigate("/");
};
```

## Styling

### CSS Classes Added

- `.checkout-form-container`: Main container
- `.checkout-title`: Form title
- `.checkout-form`: Form wrapper
- `.form-section`: Section grouping
- `.form-section-title`: Section headers
- `.form-row`: Responsive grid for inputs
- `.form-group`: Individual input container
- `.payment-methods`: Payment method grid
- `.payment-method`: Individual payment card
- `.payment-method.selected`: Selected payment state
- `.error-message`: Validation error messages

### Responsive Design

- Desktop: Grid layout with multiple columns
- Mobile: Single column layout
- Payment methods adapt to screen size

## Future Enhancements

### Phase 1 (Immediate)

- [ ] Add RUT validation algorithm (modulo 11)
- [ ] Implement actual payment gateway integration
- [ ] Add loading states during form submission
- [ ] Save order to localStorage/backend

### Phase 2 (Short-term)

- [ ] Add credit card form fields (when credit/debit selected)
- [ ] Bank account fields (when transfer selected)
- [ ] PayPal integration
- [ ] Order confirmation page
- [ ] Email confirmation

### Phase 3 (Long-term)

- [ ] Multiple shipping addresses
- [ ] Save payment methods
- [ ] Guest checkout option
- [ ] Invoice generation
- [ ] Order tracking

## Testing Checklist

### Manual Testing

- [ ] Navigate to /cart with items
- [ ] Click "Proceder al Pago"
- [ ] Verify form pre-fills with user profile data
- [ ] Submit form with empty fields (validation errors)
- [ ] Fill all required fields correctly
- [ ] Try invalid RUT format
- [ ] Try invalid email format
- [ ] Try invalid phone format
- [ ] Select each payment method
- [ ] Submit without payment method (error)
- [ ] Submit with all data (success)
- [ ] Verify cart clears after payment
- [ ] Verify redirect to home
- [ ] Click "Volver al Carrito" button
- [ ] Test responsive layout on mobile

### Edge Cases

- [ ] Empty cart navigation to /cart
- [ ] Browser back button behavior
- [ ] Form data persistence on step change
- [ ] Multiple payment method selections

## Dependencies

```json
{
  "react-hook-form": "^latest"
}
```

## Files Modified

1. **src/pages/Cart.jsx**

   - Added step state management
   - Integrated React Hook Form
   - Added CheckoutForm component
   - Modified button behavior based on step

2. **src/styles/pages/cart.css**

   - Added checkout form styles
   - Added payment method styles
   - Added responsive styles

3. **package.json**
   - Added react-hook-form dependency

## API Reference

### CartContext Methods Used

```javascript
const {
  items, // Array of cart items
  updateQuantity, // Update item quantity
  removeFromCart, // Remove item from cart
  clearCart, // Clear all items
  getTotals, // Get cart totals
} = useCart();
```

### React Hook Form Methods Used

```javascript
const {
  register, // Register input fields
  handleSubmit, // Handle form submission
  formState: { errors }, // Form validation errors
  setValue, // Set form field values
} = useForm();
```

## Known Issues

None at this time.

## Support

For questions or issues, contact the development team.

---

**Last Updated**: October 22, 2025  
**Version**: 1.0  
**Author**: Development Team
