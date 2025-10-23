# Double-Add Bug Fix

## Problem

Items were being added twice (qty=2) when clicking "Agregar al carrito" button once.

## Root Causes Identified

### 1. **State Mutation (CRITICAL)**

The original code was mutating the state object directly:

```javascript
// ❌ WRONG - Mutating state
const newCart = { ...prevCart };  // Shallow copy only!
const existing = newCart.items.find(...);
existing.qty = existing.qty + 1;  // Mutating the array item!
newCart.items.push(...);          // Mutating the array!
```

**Why this is bad:**

- `{ ...prevCart }` only creates a shallow copy
- The `items` array is still the same reference
- Modifying items directly mutates previous state
- React may trigger multiple renders or updates

### 2. **React StrictMode Double Invocation**

In development mode, React StrictMode intentionally double-invokes:

- State updater functions
- useEffect hooks
- Component renders

This helps detect side effects, but exposes mutation bugs.

### 3. **Potential Double-Click**

Users might accidentally double-click the button quickly.

## Solutions Implemented

### 1. Immutable State Updates ✅

**CartContext.jsx - addToCart:**

```javascript
// ✅ CORRECT - Fully immutable
setCart((prevCart) => {
  const existingIndex = prevCart.items.findIndex((i) => i.id === item.id);

  if (existingIndex !== -1) {
    // Create new array
    const newItems = [...prevCart.items];
    // Create new item object
    newItems[existingIndex] = {
      ...newItems[existingIndex],
      qty: newItems[existingIndex].qty + (item.qty || 1),
    };
    // Return new cart object
    return { ...prevCart, items: newItems };
  } else {
    // Add new item with spread
    return { ...prevCart, items: [...prevCart.items, newItem] };
  }
});
```

**CartContext.jsx - updateQuantity:**

```javascript
// ✅ CORRECT - Fully immutable
setCart((prevCart) => {
  const itemIndex = prevCart.items.findIndex((i) => i.id === id);

  if (itemIndex === -1) return prevCart;

  if (qty <= 0) {
    return {
      ...prevCart,
      items: prevCart.items.filter((i) => i.id !== id),
    };
  } else {
    const newItems = [...prevCart.items];
    newItems[itemIndex] = {
      ...newItems[itemIndex],
      qty: qty,
    };
    return { ...prevCart, items: newItems };
  }
});
```

### 2. Double-Click Prevention ✅

**ProductCard.jsx:**

```javascript
const handleAddToCart = (e) => {
  e.stopPropagation();
  e.preventDefault();

  const button = e.currentTarget;

  // ✅ Prevent double-clicks
  if (button.disabled) {
    return;
  }

  // Disable immediately
  button.disabled = true;

  // Add to cart
  addToCart({ ... });

  // Visual feedback
  button.textContent = "¡Añadido!";

  // Re-enable after delay
  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 1200);
};
```

### 3. Debug Logging (Temporary) 🔍

Added console.logs to track calls:

```javascript
console.log("ProductCard: Adding to cart", { code, nombre, qty: 1 });
console.log("Adding to cart:", item);
console.log("Updated existing item, new qty:", newItems[existingIndex].qty);
```

**These should be removed after testing.**

## Key Concepts

### Immutability in React

React uses object reference equality to detect changes:

```javascript
// ❌ React might not detect change
const obj = prevState;
obj.value = 5;
return obj; // Same reference!

// ✅ React detects change
return { ...prevState, value: 5 }; // New reference!
```

### Shallow vs Deep Copy

```javascript
const obj = { items: [1, 2, 3] };

// Shallow copy - items array is still same reference
const shallow = { ...obj };
shallow.items.push(4); // Mutates original!

// Deep copy for arrays
const deep = { ...obj, items: [...obj.items] };
deep.items.push(4); // Doesn't mutate original ✅
```

### StrictMode Behavior

In development, React StrictMode runs twice:

1. First run (discarded)
2. Second run (used)

This helps catch:

- Impure functions
- Side effects in render
- State mutations

**Solution:** Write pure, idempotent state updates that work correctly even when called multiple times.

## Testing Checklist

After fixes, verify:

- [ ] Click "Agregar al carrito" once → qty = 1 ✓
- [ ] Click twice quickly → qty = 2 (not 4) ✓
- [ ] Add same item from different places → qty accumulates correctly ✓
- [ ] Check console for "Adding to cart" - should appear expected number of times
- [ ] Test in production build (StrictMode disabled) → should still work ✓
- [ ] Cross-tab sync still works ✓
- [ ] Page refresh persists cart ✓

## Files Modified

1. ✅ `/src/context/CartContext.jsx`

   - Fixed `addToCart()` to be fully immutable
   - Fixed `updateQuantity()` to be fully immutable
   - Added debug logging (temporary)

2. ✅ `/src/components/products/ProductCard.jsx`
   - Added double-click prevention
   - Check button disabled state before adding
   - Added debug logging (temporary)

## Next Steps

### 1. Test Thoroughly

Run through all cart operations:

- Add from ProductCard
- Add from ProductDetail
- Update quantities
- Remove items
- Clear cart

### 2. Remove Debug Logs

Once confirmed working, remove:

```javascript
console.log("ProductCard: Adding to cart", ...);
console.log("Adding to cart:", ...);
console.log("Updated existing item, new qty:", ...);
console.log("Adding new item:", ...);
```

### 3. Production Build Test

Test with production build where StrictMode is typically disabled:

```bash
npm run build
npm run preview
```

## Additional Notes

### Why Not Disable StrictMode?

StrictMode is helpful because it:

- Catches bugs early in development
- Ensures code works correctly in future React versions
- Prevents subtle production bugs

**Better solution:** Write code that works with StrictMode!

### Idempotent State Updates

State updater should produce same result if called multiple times:

```javascript
// ❌ Not idempotent
setState((prev) => prev + 1); // Calling twice adds 2

// ✅ Idempotent (for setting absolute values)
setState(() => 5); // Calling twice still results in 5

// ✅ Our case - addToCart with new item is idempotent
// because it checks existence first
```

## Related Issues

If you still see double-adds:

1. Check browser dev tools → Console for duplicate logs
2. Check for duplicate CartProvider wrappers
3. Check for multiple click event listeners
4. Verify button disabled state is working
5. Test without StrictMode temporarily

## Status

✅ **Critical immutability bugs fixed**
✅ **Double-click prevention added**
🔍 **Debug logging added (remove after testing)**
⏳ **Awaiting user testing**

---

**Expected behavior:** Click once → Add 1 item. Every click should add exactly 1 item (or the specified quantity).
