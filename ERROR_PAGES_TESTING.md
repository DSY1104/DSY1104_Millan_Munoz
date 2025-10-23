# Testing Guide - Error Pages

## Quick Test Instructions

### Test 404 Not Found Page

1. **Navigate to an invalid URL**

   ```
   http://localhost:5175/this-does-not-exist
   http://localhost:5175/random-page
   http://localhost:5175/productos/invalid
   ```

2. **Expected Result**

   - See animated "404" with bouncing numbers
   - Message: "¡Oops! Página no encontrada"
   - Four action buttons:
     - 🏠 Ir al Inicio
     - ← Volver Atrás
     - 🛍️ Ver Productos
   - Floating icons at the bottom
   - Suggestions box with helpful tips

3. **Test Actions**
   - Click "Ir al Inicio" → Should navigate to `/`
   - Click "Volver Atrás" → Should go to previous page
   - Click "Ver Productos" → Should navigate to `/products`

### Test Error Boundary

#### Method 1: Temporarily Add Error Code

Add this to any component (e.g., `Home.jsx`):

```javascript
// Add at the top of the component
const [shouldError, setShouldError] = React.useState(false);

if (shouldError) {
  throw new Error("Test error for ErrorBoundary");
}

// Add a button to trigger
<button onClick={() => setShouldError(true)}>Trigger Error</button>;
```

#### Method 2: Modify a Component to Error

In any component, add:

```javascript
throw new Error("Testing error boundary");
```

#### Expected Result

- See error icon with shake animation
- Error title and message
- Stack trace (development only)
- Four action buttons:
  - 🔄 Recargar Página
  - 🏠 Ir al Inicio
  - ← Volver Atrás
  - 💬 Contactar Soporte
- Timestamp at the bottom

### Visual Verification Checklist

**404 Page**:

- [ ] Background gradient visible
- [ ] Numbers are bouncing
- [ ] Numbers have blue gradient
- [ ] Suggestions box is styled
- [ ] Buttons have hover effects
- [ ] Floating icons are animated
- [ ] Responsive on mobile

**Error Boundary**:

- [ ] Background gradient visible
- [ ] Error icon is red
- [ ] Icon shakes on load
- [ ] Error details collapsible (dev mode)
- [ ] Buttons have hover effects
- [ ] Timestamp is displayed
- [ ] Responsive on mobile

### Browser Console Tests

Open browser console and run:

```javascript
// Test 404
window.history.pushState({}, "", "/test-404");
window.location.reload();

// Navigate back
window.history.back();
```

### Mobile Testing

1. Open DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Test 404 page
5. Verify:
   - Single column layout
   - Stacked buttons
   - Readable text size
   - All elements visible

### Cross-Browser Testing

Test in:

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Performance Check

1. Open DevTools → Performance tab
2. Navigate to 404 page
3. Verify:
   - Page loads quickly
   - Animations are smooth
   - No layout shifts

## Common Test Scenarios

### Scenario 1: User Types Wrong URL

```
User types: /prodcuts (typo)
Expected: 404 page with suggestions
```

### Scenario 2: Old Bookmark

```
User has old bookmark: /old-page
Expected: 404 page with navigation options
```

### Scenario 3: Component Error

```
Component throws error
Expected: Error boundary catches it
```

### Scenario 4: Back Button After Error

```
User sees error → clicks back button
Expected: Previous page loads normally
```

## Debug Mode

To see detailed error info, check browser console:

- Errors are logged with `console.error()`
- Stack traces available in dev mode
- Error objects contain full context

## Clean Up After Testing

Remember to:

1. Remove test error code
2. Clear browser cache
3. Restart dev server
4. Verify normal pages work

## URLs for Quick Testing

Copy-paste these into your browser:

```
# 404 Tests
http://localhost:5175/404
http://localhost:5175/test
http://localhost:5175/page-not-found
http://localhost:5175/products/fake-id

# Valid pages (should NOT show error)
http://localhost:5175/
http://localhost:5175/products
http://localhost:5175/cart
http://localhost:5175/about
http://localhost:5175/support
```

---

**Note**: Replace `5175` with your actual port number if different.
