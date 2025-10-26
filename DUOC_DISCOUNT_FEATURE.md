# DUOC Lifetime Discount Feature

## Overview

Users who register or login with a DUOC email address (`@duoc.cl` or `@profesor.duoc.cl`) automatically receive a **20% lifetime discount** on all purchases.

## Implementation

### 1. **Email Domain Detection**

**Location**: `src/context/AuthContext.jsx`

```javascript
const checkDuocDiscount = (email) => {
  if (!email) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  return domain === "duoc.cl" || domain === "profesor.duoc.cl";
};
```

### 2. **User Session with Discount Flag**

When a user logs in or registers, the system checks their email domain and stores the discount information in their session:

```javascript
const userData = {
  email,
  isAuthenticated: true,
  loginTime: new Date().toISOString(),
  hasLifetimeDiscount: checkDuocDiscount(email), // Boolean flag
  discountPercentage: checkDuocDiscount(email) ? 20 : 0, // Percentage value
};
```

This data is stored in:

- **Cookies** (session or 30-day persistent)
- **LocalStorage** (backup)

### 3. **Registration Flow with Discount Notification**

**Location**: `src/components/modals/auth/RegisterModal.jsx`

During registration, users with DUOC emails see a notification:

```jsx
{
  showDuocDiscount && (
    <div className="discount-notice">
      🎓 ¡Descuento del 20% de por vida por ser de la comunidad DUOC!
    </div>
  );
}
```

The `isDuocEmail` flag is also stored in registration data for future reference.

### 4. **Cart Discount Application**

**Location**: `src/pages/Cart.jsx`

The cart automatically applies the discount for DUOC users:

```javascript
// Calculate DUOC discount if user is authenticated and has lifetime discount
const duocDiscount =
  isAuthenticated && user?.hasLifetimeDiscount
    ? Math.round(totals.subtotal * 0.2)
    : 0;

const finalTotal = totals.total - duocDiscount;
```

### 5. **Cart Summary Display**

The cart shows the discount breakdown:

```
Subtotal (2 productos)          $100,000
Descuento cupón                 -$5,000
🎓 Descuento DUOC (20%)         -$20,000
──────────────────────────────────────
Total                            $75,000
```

## User Experience

### For DUOC Users

1. **Registration**

   - User enters `@duoc.cl` or `@profesor.duoc.cl` email
   - Green notification appears: "🎓 ¡Descuento del 20% de por vida por ser de la comunidad DUOC!"
   - Discount flag is set: `hasLifetimeDiscount: true`

2. **Login**

   - User logs in with DUOC email
   - Discount flag is automatically detected and set
   - User session includes discount information

3. **Shopping Cart**
   - 20% discount is automatically applied to subtotal
   - Discount line shows: "🎓 Descuento DUOC (20%)"
   - Success message: "🎓 Ahorraste $X,XXX con tu descuento DUOC"

### For Non-DUOC Users

1. **Shopping Cart**
   - No DUOC discount applied
   - Helpful message: "💡 ¿Eres de DUOC? Registra tu correo @duoc.cl o @profesor.duoc.cl para obtener 20% de descuento de por vida"

## Validation Rules

### Email Validation

**Location**: `src/components/modals/auth/RegisterModal.jsx`

```javascript
// Allowed domains
const ALLOWED_DOMAINS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];
const DUOC_DOMAINS = ["duoc.cl", "profesor.duoc.cl"];

// Validation
- Email format: valid email regex
- Email length: maximum 100 characters
- Domain: must be in ALLOWED_DOMAINS
- Age: 18+ (calculated from birthdate)
```

## Test Users

### User 4: Pedro Martínez (DUOC Student) 🎓

```javascript
Email: pedro.duoc@duoc.cl
Password: demo123
hasLifetimeDiscount: true
discountPercentage: 20
```

**Console command**:

```javascript
switchToUser(4); // Switch to DUOC user with discount
```

### Users 1-3: Regular Users

No discount applied. Use them to compare the cart experience.

## Testing the Feature

### Test Scenario 1: DUOC User Registration

1. Open Register Modal
2. Enter email: `test@duoc.cl`
3. Fill other fields
4. See green discount notification
5. Complete registration
6. Add items to cart
7. Verify 20% discount is applied

### Test Scenario 2: DUOC User Login

1. Login with `pedro.duoc@duoc.cl` / `demo123`
2. Add products to cart
3. Go to `/cart`
4. Verify discount line shows 20% off
5. Check final total includes discount

### Test Scenario 3: Non-DUOC User

1. Login with regular user (users 1, 2, or 3)
2. Add products to cart
3. Go to `/cart`
4. Verify NO DUOC discount line
5. See helpful message about DUOC registration

### Test Scenario 4: Discount Calculation

**Example Cart**:

- Product 1: $50,000 x 1 = $50,000
- Product 2: $30,000 x 2 = $60,000
- **Subtotal**: $110,000
- **DUOC Discount (20%)**: -$22,000
- **Total**: $88,000

## Code Locations

| Feature                      | File                                           | Lines   |
| ---------------------------- | ---------------------------------------------- | ------- |
| Discount detection           | `src/context/AuthContext.jsx`                  | 95-99   |
| User session with discount   | `src/context/AuthContext.jsx`                  | 108-111 |
| Registration UI notification | `src/components/modals/auth/RegisterModal.jsx` | 423-428 |
| Cart discount calculation    | `src/pages/Cart.jsx`                           | 27-31   |
| Cart discount display        | `src/pages/Cart.jsx`                           | 237-246 |
| Discount success message     | `src/pages/Cart.jsx`                           | 262-265 |
| Helper message               | `src/pages/Cart.jsx`                           | 267-271 |

## Discount Persistence

The discount flag persists:

✅ **Across page reloads** (stored in localStorage)
✅ **Across browser sessions** (if "Remember Me" is checked)
✅ **For the lifetime of the account** (flag is tied to email domain)

## Discount Stacking

The system supports multiple discount types:

1. **Coupon Discount**: Applied first from cart coupons
2. **DUOC Discount**: Applied after coupon discount (20% of subtotal)
3. **Final Total**: Subtotal - Coupon - DUOC Discount

## Security Considerations

### Current (Mock Implementation)

- Client-side validation only
- Email domain check
- Stored in browser (cookies + localStorage)

### Future (Production)

- Backend API validation
- Server-side email verification
- Database flag per user account
- Discount applied server-side in checkout
- Audit trail for discount usage

## Benefits

1. **Incentive for DUOC Community**: Encourages students and staff to register
2. **Brand Loyalty**: Lifetime benefit creates long-term customers
3. **Easy to Implement**: Simple domain check
4. **Transparent**: Clearly shown in cart summary
5. **Stackable**: Works with other discounts/coupons

## Metrics to Track (Future)

- Number of DUOC users registered
- Conversion rate: DUOC vs non-DUOC users
- Average order value: DUOC vs non-DUOC users
- Discount usage frequency
- Total discount amount given

---

**Last Updated**: October 26, 2025
**Version**: 1.0
