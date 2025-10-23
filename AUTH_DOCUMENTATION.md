# Authentication System Documentation

## Overview

The React authentication system has been successfully implemented using React Context API, replicating all functionality from the old vanilla JavaScript implementation.

## Architecture

### Core Components

#### 1. **AuthContext** (`/src/context/AuthContext.jsx`)

The main authentication context that manages:

- User state and session persistence
- Login/logout functionality
- Registration
- Modal visibility control
- Cookie-based session management

#### 2. **LoginModal** (`/src/components/modals/auth/LoginModal.jsx`)

Modal component for user login with:

- Email validation
- Password validation (min 6 characters)
- "Remember me" functionality
- Switch to registration modal
- Keyboard shortcuts (Escape to close)
- Auto-focus on email input

#### 3. **RegisterModal** (`/src/components/modals/auth/RegisterModal.jsx`)

Comprehensive registration modal with:

- RUN validation (Chilean ID - optional)
- Name and last name fields
- Email validation with domain restrictions
- Age validation (18+ required)
- Password validation
- Referral code system with validation
- DUOC email discount detection
- Auto-login after registration

## Features Ported from Old Implementation

### ✅ Authentication Features

- ✅ Cookie-based session persistence
- ✅ "Remember me" functionality (30-day cookies vs session-only)
- ✅ Login/logout with event dispatching
- ✅ Auto-session restoration on page load
- ✅ LocalStorage backup for session data

### ✅ Validation Features

- ✅ Email format validation (regex)
- ✅ Email domain whitelist (duoc.cl, profesor.duoc.cl, gmail.com)
- ✅ Chilean RUN validation with check digit algorithm
- ✅ Age validation (18+ years)
- ✅ Password minimum length (6 characters)
- ✅ Referral code format validation (6-10 alphanumeric)
- ✅ Referral code existence validation

### ✅ UI/UX Features

- ✅ Modal system with backdrop
- ✅ Auto-focus on first input
- ✅ Keyboard navigation (Escape to close)
- ✅ Switch between login/register modals
- ✅ Real-time validation feedback
- ✅ DUOC email discount notice
- ✅ Referral code success/error messages
- ✅ Body scroll lock when modal is open
- ✅ ARIA attributes for accessibility

### ✅ Referral System

- ✅ Referral code validation
- ✅ Mock referral code verification
- ✅ Points calculation based on code prefix
- ✅ Visual feedback for valid codes

## Usage

### Basic Setup (Already Done)

The authentication system is already integrated into the app:

```jsx
// App.jsx
import { AuthProvider } from "./context/AuthContext";
import LoginModal from "./components/modals/auth/LoginModal";
import RegisterModal from "./components/modals/auth/RegisterModal";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Your routes */}
        <LoginModal />
        <RegisterModal />
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### Using Auth in Components

```jsx
import { useAuth } from "../../context/AuthContext";

function MyComponent() {
  const {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    openLoginModal,
    openRegisterModal,
  } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.email}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={openLoginModal}>Login</button>
          <button onClick={openRegisterModal}>Sign Up</button>
        </>
      )}
    </div>
  );
}
```

### AuthContext API

#### State

- `user` - Current user object (email, isAuthenticated, loginTime)
- `isAuthenticated` - Boolean indicating if user is logged in
- `loading` - Boolean indicating if auth is being initialized
- `showLoginModal` - Boolean controlling login modal visibility
- `showRegisterModal` - Boolean controlling register modal visibility

#### Methods

##### `login(email, password, remember)`

Authenticates a user and creates a session.

```jsx
const result = login("user@example.com", "password123", true);
if (result.success) {
  console.log("Logged in:", result.user);
}
```

##### `logout()`

Clears session and logs out the user.

```jsx
logout(); // Returns true on success
```

##### `register(userData)`

Registers a new user and auto-logs them in.

```jsx
const result = register({
  run: "12345678-9",
  nombre: "Juan",
  apellidos: "Pérez",
  email: "juan@duoc.cl",
  birthdate: "2000-01-01",
  password: "password123",
  referralCode: "LEVEL123",
});
```

##### Modal Controls

```jsx
openLoginModal(); // Opens login modal
closeLoginModal(); // Closes login modal
openRegisterModal(); // Opens register modal
closeRegisterModal(); // Closes register modal
switchToRegister(); // Switches from login to register
switchToLogin(); // Switches from register to login
```

## Validation Rules

### Email

- **Format**: Must match email regex pattern
- **Domains**: Only `duoc.cl`, `profesor.duoc.cl`, `gmail.com`
- **Max Length**: 100 characters
- **DUOC Discount**: Emails with `duoc.cl` or `profesor.duoc.cl` show 20% lifetime discount notice

### RUN (Chilean ID)

- **Optional field**
- **Format**: 8-9 digits + check digit (0-9 or K)
- **Validation**: Uses modulo 11 algorithm
- **Examples**: `12.345.678-9`, `12345678-K`

### Password

- **Min Length**: 6 characters
- **Required**: Yes

### Age

- **Minimum**: 18 years old
- **Calculation**: Uses birthdate to determine age

### Referral Code

- **Optional field**
- **Format**: 6-10 alphanumeric characters (A-Z, 0-9)
- **Validation**: Mock validation checks for prefixes:
  - `LEVEL*` → 500 points (new user), 300 points (referrer)
  - `GAME*` → 400 points (new user), 250 points (referrer)
  - `DUOC*`, `REF*` → 300 points (new user), 200 points (referrer)

## Cookie Management

The auth system uses cookies for session persistence:

### Session Cookie (No "Remember Me")

```javascript
{
  email: "user@example.com",
  isAuthenticated: true,
  loginTime: "2025-10-22T..."
}
// Expires when browser closes
```

### Persistent Cookie ("Remember Me" checked)

```javascript
// Same data structure
// Expires in 30 days
```

### Cookie Options

- `path`: `/` (available throughout the app)
- `secure`: `true` on HTTPS
- `sameSite`: `Lax`

## Events

The auth system dispatches custom events:

```javascript
// User logged in
window.addEventListener("userLoggedIn", (e) => {
  console.log("User logged in:", e.detail);
});

// User logged out
window.addEventListener("userLoggedOut", () => {
  console.log("User logged out");
});
```

## Example: Protected Route

```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/" />;
}

// Usage
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>;
```

## Example: Conditional Rendering

```jsx
function ProductCard({ product }) {
  const { isAuthenticated, openLoginModal } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    // Add to cart logic
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={handleAddToCart}>
        {isAuthenticated ? "Add to Cart" : "Login to Purchase"}
      </button>
    </div>
  );
}
```

## Styling

The modals use existing CSS from `/src/styles/components/_modal.css`:

### Key Classes

- `.lu-modal` - Main modal container
- `.lu-modal.active` - Active state
- `.lu-modal__backdrop` - Backdrop overlay
- `.lu-modal__dialog` - Modal dialog container
- `.lu-modal__content` - Modal content
- `.lu-modal__close` - Close button
- `.lu-modal__header` - Header section
- `.lu-modal__body` - Body section
- `.form-control` - Form field container
- `.form-hint` - Validation message
- `.form-hint.success` - Success message (green)
- `.discount-notice` - DUOC discount banner

### Body Scroll Lock

```css
body.modal-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
}
```

## Integration with Navbar

The Navigation component has been updated to use AuthContext:

```jsx
// Before (old implementation)
window.LevelUpLogin?.open();
window.LevelUpLogin?.logout();
window.LevelUpLogin?.isLoggedIn();

// After (React implementation)
const { isAuthenticated, openLoginModal, logout } = useAuth();
```

## Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with "Remember me" checked
- [ ] Login validation (email, password)
- [ ] Logout functionality
- [ ] Session restoration on page reload
- [ ] Register with all fields
- [ ] Register validation (RUN, email, age, etc.)
- [ ] DUOC email discount notice
- [ ] Referral code validation
- [ ] Switch between login/register modals
- [ ] Close modal with Escape key
- [ ] Close modal by clicking backdrop
- [ ] Auto-focus on input fields
- [ ] Body scroll lock when modal open
- [ ] Navigation shows/hides login button
- [ ] User menu appears when logged in

## Differences from Old Implementation

### Improvements

1. **React State Management**: Uses hooks instead of global variables
2. **Type Safety Ready**: Can easily add TypeScript or PropTypes
3. **Better Performance**: React's virtual DOM and optimized re-renders
4. **Cleaner Code**: Declarative JSX instead of imperative DOM manipulation
5. **Easier Testing**: Components can be unit tested in isolation
6. **Better Developer Experience**: React DevTools, hot reload

### Maintained Features

- ✅ All validation logic preserved
- ✅ Same cookie structure and behavior
- ✅ Same UI/UX and styling
- ✅ Same modal interactions
- ✅ Same event system
- ✅ Backward compatible with existing styles

## TODO / Future Enhancements

- [ ] Connect to real backend API
- [ ] Add password reset functionality
- [ ] Add email verification
- [ ] Add OAuth providers (Google, Facebook, etc.)
- [ ] Add 2FA support
- [ ] Add user profile editing
- [ ] Add password strength meter
- [ ] Add "Forgot Password" flow
- [ ] Add loading states during API calls
- [ ] Add error handling for network failures
- [ ] Add TypeScript types
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Add JWT token management
- [ ] Add token refresh logic

## File Structure

```
src/
├── context/
│   └── AuthContext.jsx           # Main auth context
├── components/
│   ├── common/
│   │   └── Navigation.jsx        # Updated with auth integration
│   └── modals/
│       └── auth/
│           ├── LoginModal.jsx    # Login modal component
│           ├── RegisterModal.jsx # Registration modal component
│           └── index.js          # Barrel export
├── styles/
│   └── components/
│       └── _modal.css            # Modal styles (already existed)
└── App.jsx                       # AuthProvider wrapper
```

## Support

For issues or questions about the authentication system:

1. Check this documentation
2. Review the old implementation in `DSY1104_Millan_Munoz-release-1.0/`
3. Check console logs (all auth actions are logged)
4. Use React DevTools to inspect AuthContext state
