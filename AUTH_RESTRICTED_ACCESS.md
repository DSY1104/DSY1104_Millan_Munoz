# Restricted Authentication System

## Overview

The authentication system has been **restricted** to only allow users that exist in `users.json` to log in. Registration is now **disabled**.

## Changes Made

### 1. **Login - Now Validates Against users.json**

**File**: `src/context/AuthContext.jsx`

- Imports `authenticateUser` from `userService.js`
- Login function is now `async` and validates credentials against `users.json`
- Returns error message if user is not found or password is incorrect

```javascript
const login = async (email, password, remember = false) => {
  const authenticatedUser = await authenticateUser(email, password);

  if (!authenticatedUser) {
    return {
      success: false,
      error:
        "Credenciales inválidas. Solo usuarios registrados pueden acceder.",
    };
  }
  // ... rest of login logic
};
```

### 2. **Registration - Now Disabled**

**File**: `src/context/AuthContext.jsx`

- Registration function returns error immediately
- No new users can be created through the UI

```javascript
const register = async (userData) => {
  return {
    success: false,
    error:
      "El registro está deshabilitado. Solo usuarios autorizados pueden acceder al sistema.",
  };
};
```

### 3. **Modals Updated for Async**

**Files**:

- `src/components/modals/auth/LoginModal.jsx`
- `src/components/modals/auth/RegisterModal.jsx`

- Both modals now handle `async` submit functions
- Display error alerts when authentication fails

## Valid User Credentials

Only these **4 users** can log in:

### User 1: Alex Rodriguez (Gold)

```
Email: alex.rodriguez@levelup.cl
Password: demo123
Level: Gold
Discount: No
```

### User 2: María González (Platinum)

```
Email: maria.gonzalez@levelup.cl
Password: demo123
Level: Platinum
Discount: No
```

### User 3: Carlos Silva (Silver)

```
Email: carlos.silva@levelup.cl
Password: demo123
Level: Silver
Discount: No
```

### User 4: Pedro Martínez (Bronze) 🎓

```
Email: pedro.duoc@duoc.cl
Password: demo123
Level: Bronze
Discount: Yes (20% DUOC discount)
```

## Testing

### Test Valid Login

1. Go to login modal
2. Enter: `alex.rodriguez@levelup.cl` / `demo123`
3. ✅ Should log in successfully

### Test Invalid Login

1. Go to login modal
2. Enter: `invalid@email.com` / `password123`
3. ❌ Should show error: "Credenciales inválidas. Solo usuarios registrados pueden acceder."

### Test Registration Disabled

1. Go to register modal
2. Fill all fields
3. Click "Registrar"
4. ❌ Should show error: "El registro está deshabilitado. Solo usuarios autorizados pueden acceder al sistema."

### Test Console Commands (Still Work)

```javascript
// Switch to any of the 4 valid users
switchToUser(1); // Alex
switchToUser(2); // María
switchToUser(3); // Carlos
switchToUser(4); // Pedro (DUOC)

// Check current user
whoAmI();

// Logout
logoutUser();
```

## User Authentication Flow

```
┌─────────────────┐
│  User clicks    │
│  "Iniciar       │
│  Sesión"        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  LoginModal     │
│  opens          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User enters    │
│  email/password │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  handleSubmit   │
│  (async)        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  AuthContext.login()        │
│  calls authenticateUser()   │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  userService.js              │
│  searches users.json for:    │
│  - matching email/username   │
│  - matching password         │
└────────┬─────────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌─────────┐
│ FOUND │  │NOT FOUND│
└───┬───┘  └────┬────┘
    │           │
    ▼           ▼
┌─────────┐  ┌──────────────┐
│ Create  │  │ Show error:  │
│ session │  │ "Credenciales│
│ Set     │  │  inválidas"  │
│ cookies │  └──────────────┘
│ Redirect│
└─────────┘
```

## Security Considerations

### Current (Mock) Implementation

- ✅ Only `users.json` users can log in
- ✅ Password validation required
- ✅ Registration disabled
- ⚠️ Passwords stored in plain text (mock data)
- ⚠️ Client-side validation only

### Future (Production) Recommendations

- 🔒 Hash passwords (bcrypt)
- 🔒 Server-side authentication API
- 🔒 JWT tokens for session management
- 🔒 Rate limiting on login attempts
- 🔒 Email verification
- 🔒 Password reset functionality
- 🔒 Two-factor authentication (2FA)
- 🔒 HTTPS only in production

## How to Add New Users

Since registration is disabled, new users must be added manually to `users.json`:

1. Open `src/assets/data/users.json`
2. Add new user object following the existing structure:

```json
{
  "id": 5,
  "username": "newuser123",
  "email": "newuser@domain.com",
  "password": "password123",
  "hasLifetimeDiscount": false,
  "discountPercentage": 0,
  "personal": {
    /* ... */
  },
  "address": {
    /* ... */
  },
  "preferences": {
    /* ... */
  },
  "gaming": {
    /* ... */
  },
  "stats": {
    /* ... */
  },
  "coupons": []
}
```

3. Save file
4. New user can now log in with those credentials

## Console Commands Reference

### Switch User (Bypasses Login)

```javascript
switchToUser(1); // Alex Rodriguez
switchToUser(2); // María González
switchToUser(3); // Carlos Silva
switchToUser(4); // Pedro Martínez (DUOC)
```

### Check Current User

```javascript
whoAmI();
// Output: Shows current user's name, email, and level
```

### Logout

```javascript
logoutUser();
// Logs out current user and reloads page
```

## File Changes Summary

| File                                           | Change                    | Purpose                            |
| ---------------------------------------------- | ------------------------- | ---------------------------------- |
| `src/context/AuthContext.jsx`                  | Import `authenticateUser` | Validate against users.json        |
| `src/context/AuthContext.jsx`                  | Make `login()` async      | Support async userService call     |
| `src/context/AuthContext.jsx`                  | Update login validation   | Check if user exists in users.json |
| `src/context/AuthContext.jsx`                  | Disable `register()`      | Prevent new user creation          |
| `src/components/modals/auth/LoginModal.jsx`    | Make `handleSubmit` async | Support async login                |
| `src/components/modals/auth/LoginModal.jsx`    | Add error alert           | Show user-friendly error messages  |
| `src/components/modals/auth/RegisterModal.jsx` | Make `handleSubmit` async | Support async register             |
| `src/components/modals/auth/RegisterModal.jsx` | Add error alert           | Show registration disabled message |

## Error Messages

### Login Errors

- **Invalid credentials**: "Credenciales inválidas. Solo usuarios registrados pueden acceder."
- **Generic error**: "Error al iniciar sesión. Por favor, verifica tus credenciales."

### Registration Errors

- **Registration disabled**: "El registro está deshabilitado. Solo usuarios autorizados pueden acceder al sistema. Por favor, contacta al administrador."

## Benefits of Restricted Access

1. ✅ **Controlled User Base**: Only approved users can access
2. ✅ **No Spam Accounts**: Prevents fake registrations
3. ✅ **Data Consistency**: All users follow same structure
4. ✅ **Testing**: Predictable test users
5. ✅ **Security**: Reduced attack surface

---

**Last Updated**: October 26, 2025
**Version**: 1.0
**Status**: ✅ Active
