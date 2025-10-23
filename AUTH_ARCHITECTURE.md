# Authentication System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                          App.jsx                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AuthProvider (Context)                   │   │
│  │  • Manages user state                                 │   │
│  │  • Cookie-based persistence                           │   │
│  │  • Login/logout/register methods                      │   │
│  │  • Modal visibility control                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐               │
│         ▼                 ▼                 ▼               │
│    ┌─────────┐      ┌──────────┐     ┌──────────┐         │
│    │ Navbar  │      │  Routes  │     │  Modals  │         │
│    └─────────┘      └──────────┘     └──────────┘         │
│         │                                   │               │
│         │                                   ├──► LoginModal │
│         │                                   └──► RegisterModal│
│         │                                                    │
│    useAuth() ──────────────────────────────────────────┐   │
│         │                                               │   │
│         ▼                                               ▼   │
│  isAuthenticated ?                                  Methods │
│    ├──► Show User Menu                          • openLoginModal()
│    └──► Show Login Button                       • openRegisterModal()
│                                                  • login()
│                                                  • logout()
│                                                  • register()
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Login Flow

```
User clicks "Login" button
    │
    ▼
openLoginModal() called
    │
    ▼
LoginModal renders
    │
    ▼
User enters credentials
    │
    ▼
Form validation (client-side)
    │
    ▼
login(email, password, remember)
    │
    ├──► Set cookies (session or 30-day)
    ├──► Set user state
    ├──► Dispatch 'userLoggedIn' event
    └──► Close modal
        │
        ▼
    Navbar updates (shows user menu)
```

### Registration Flow

```
User clicks "Crear cuenta"
    │
    ▼
switchToRegister() called
    │
    ▼
RegisterModal renders
    │
    ▼
User fills form
    │
    ├──► Real-time validation
    ├──► DUOC email? Show discount
    └──► Referral code? Validate & show feedback
        │
        ▼
    Submit form
        │
        ▼
    register(userData)
        │
        ├──► Save to localStorage
        ├──► Auto-login user
        └──► Close modal
            │
            ▼
        User is now logged in
```

### Logout Flow

```
User clicks "Cerrar Sesión"
    │
    ▼
logout() called
    │
    ├──► Clear cookies
    ├──► Clear localStorage
    ├──► Clear user state
    └──► Dispatch 'userLoggedOut' event
        │
        ▼
    Navbar updates (shows login button)
```

## Component Hierarchy

```
App
├── AuthProvider
│   ├── BrowserRouter
│   │   ├── ScrollToTop
│   │   ├── Navbar ← uses useAuth()
│   │   │   └── Login/User Menu
│   │   ├── Routes
│   │   │   ├── Home
│   │   │   ├── Catalog ← can use useAuth()
│   │   │   ├── ProductDetail ← can use useAuth()
│   │   │   └── ...
│   │   ├── Footer
│   │   ├── LoginModal ← controlled by AuthContext
│   │   └── RegisterModal ← controlled by AuthContext
```

## State Management

```
AuthContext State:
┌───────────────────────────────────┐
│ user: {                           │
│   email: string                   │
│   isAuthenticated: boolean        │
│   loginTime: string               │
│ }                                 │
├───────────────────────────────────┤
│ isAuthenticated: boolean          │
│ loading: boolean                  │
│ showLoginModal: boolean           │
│ showRegisterModal: boolean        │
└───────────────────────────────────┘

Persisted in:
├── Cookies (primary)
│   ├── userSession (session or 30-day)
│   └── rememberLogin (30-day flag)
└── localStorage (backup)
    └── userSession
```

## Validation Pipeline

```
Registration Form
    │
    ├──► RUN Validation
    │    └── Optional, Modulo 11 algorithm
    │
    ├──► Name & Lastname
    │    └── Required, non-empty
    │
    ├──► Email Validation
    │    ├── Format check (regex)
    │    ├── Domain whitelist
    │    └── Max length 100
    │
    ├──► Age Validation
    │    └── Calculate from birthdate, must be 18+
    │
    ├──► Password Validation
    │    └── Min 6 characters
    │
    └──► Referral Code
         ├── Format: 6-10 alphanumeric
         └── Existence check (mock)
```

## Cookie Structure

```
Session Cookie (no "remember me"):
{
  name: "userSession",
  value: {
    email: "user@duoc.cl",
    isAuthenticated: true,
    loginTime: "2025-10-22T12:00:00Z"
  },
  expires: (browser close)
}

Persistent Cookie ("remember me" checked):
{
  name: "userSession",
  value: { ... same ... },
  expires: (30 days)
}

{
  name: "rememberLogin",
  value: true,
  expires: (30 days)
}
```

## Events System

```
Custom Events:
┌────────────────────────────────┐
│ userLoggedIn                   │
│ ├── detail: { user object }   │
│ └── Fired on successful login │
└────────────────────────────────┘

┌────────────────────────────────┐
│ userLoggedOut                  │
│ ├── detail: none               │
│ └── Fired on logout            │
└────────────────────────────────┘

Usage:
window.addEventListener('userLoggedIn', (e) => {
  console.log('User:', e.detail);
});
```

## Integration Points

```
Any Component Can Use Auth:
┌─────────────────────────────────┐
│ import { useAuth } from '...'   │
│                                 │
│ const {                         │
│   isAuthenticated,              │
│   user,                         │
│   openLoginModal,               │
│   logout                        │
│ } = useAuth();                  │
└─────────────────────────────────┘

Common Patterns:
├── Conditional rendering
│   └── Show different UI for logged in/out
├── Protected actions
│   └── Require login before action
├── Protected routes
│   └── Redirect to home if not authenticated
└── User info display
    └── Show user email, profile, etc.
```

## File Relationships

```
AuthContext.jsx
    ↓ provides context
App.jsx
    ↓ wraps with provider
┌───────────────┬──────────────┐
│               │              │
Navbar.jsx   LoginModal.jsx  RegisterModal.jsx
    ↓            ↓              ↓
useAuth()    useAuth()      useAuth()
    ↓            ↓              ↓
Methods      Methods        Methods
```

## Styling Dependencies

```
Modals use:
├── /src/styles/components/_modal.css
│   ├── .lu-modal
│   ├── .lu-modal__backdrop
│   ├── .lu-modal__dialog
│   ├── .lu-modal__content
│   ├── .lu-modal__close
│   ├── .lu-modal__header
│   └── .lu-modal__body
│
└── Form classes (inherited from main.css)
    ├── .form-control
    ├── .form-hint
    ├── .form-row
    ├── .btn-primary
    └── .discount-notice
```

## Error Handling

```
Validation Errors:
User Input → Validate → Set Error State → Show Message

Network Errors (future):
API Call → Catch Error → Show Toast/Alert → Log

Session Errors:
Cookie Parse → Fail → Clear Session → Log
```

## Security Considerations (Current)

```
Current (Mock):
├── Client-side validation only
├── No real authentication
├── Cookie-based session
└── No encryption

Future (Production):
├── Backend API validation
├── JWT tokens
├── Secure cookies (HttpOnly)
├── CSRF protection
└── Rate limiting
```
