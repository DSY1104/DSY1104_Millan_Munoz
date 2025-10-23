# Authentication Quick Reference

## Import and Use Auth

```jsx
import { useAuth } from "../../context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, openLoginModal, logout } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <button onClick={logout}>Logout ({user.email})</button>
      ) : (
        <button onClick={openLoginModal}>Login</button>
      )}
    </>
  );
}
```

## Open Modals

```jsx
const { openLoginModal, openRegisterModal } = useAuth();

// Open login modal
<button onClick={openLoginModal}>Login</button>

// Open register modal
<button onClick={openRegisterModal}>Sign Up</button>
```

## Check Authentication

```jsx
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log("User email:", user.email);
  console.log("Login time:", user.loginTime);
}
```

## Programmatic Login

```jsx
const { login } = useAuth();

const handleLogin = () => {
  const result = login("user@duoc.cl", "password123", true);
  if (result.success) {
    console.log("Logged in!", result.user);
  }
};
```

## Protected Content

```jsx
const { isAuthenticated, openLoginModal } = useAuth();

<button
  onClick={() => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    // Do protected action
  }}
>
  Add to Cart
</button>;
```

## Protected Routes

```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/" />;
}

// In routes
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  }
/>;
```

## Listen to Auth Events

```jsx
useEffect(() => {
  const handleLogin = (e) => {
    console.log("User logged in:", e.detail);
  };

  const handleLogout = () => {
    console.log("User logged out");
  };

  window.addEventListener("userLoggedIn", handleLogin);
  window.addEventListener("userLoggedOut", handleLogout);

  return () => {
    window.removeEventListener("userLoggedIn", handleLogin);
    window.removeEventListener("userLoggedOut", handleLogout);
  };
}, []);
```

## Available Auth Values

```jsx
const {
  user, // { email, isAuthenticated, loginTime }
  isAuthenticated, // boolean
  loading, // boolean
  showLoginModal, // boolean
  showRegisterModal, // boolean
  login, // (email, password, remember) => result
  logout, // () => boolean
  register, // (userData) => result
  openLoginModal, // () => void
  closeLoginModal, // () => void
  openRegisterModal, // () => void
  closeRegisterModal, // () => void
  switchToRegister, // () => void
  switchToLogin, // () => void
} = useAuth();
```

## Validation Rules

### Email

- Must be valid email format
- Only domains: duoc.cl, profesor.duoc.cl, gmail.com
- Max 100 characters

### Password

- Minimum 6 characters

### RUN (Optional)

- 8-9 digits + check digit
- Example: 12.345.678-9

### Age

- Must be 18+ years old

### Referral Code (Optional)

- 6-10 alphanumeric characters
- Valid prefixes: LEVEL, GAME, DUOC, REF

## Common Patterns

### Show Login Button or User Menu

```jsx
{
  !isAuthenticated ? (
    <button onClick={openLoginModal}>Login</button>
  ) : (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Require Auth Before Action

```jsx
const handleAction = () => {
  if (!isAuthenticated) {
    openLoginModal();
    return;
  }
  // Proceed with action
};
```

### Loading State

```jsx
if (loading) {
  return <div>Checking authentication...</div>;
}
```

### Auto-redirect After Login

```jsx
const navigate = useNavigate();

useEffect(() => {
  const handleLogin = () => {
    navigate("/profile");
  };

  window.addEventListener("userLoggedIn", handleLogin);
  return () => window.removeEventListener("userLoggedIn", handleLogin);
}, [navigate]);
```

## Testing Credentials

Any email/password will work for testing:

- Email: user@duoc.cl (shows DUOC discount)
- Email: user@gmail.com (allowed domain)
- Password: any 6+ characters

Valid referral codes (for testing):

- LEVEL123 → 500 points
- GAME456 → 400 points
- DUOC789 → 300 points
- REF000 → 300 points
