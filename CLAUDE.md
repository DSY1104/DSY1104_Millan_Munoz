# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LUNARi** - A React-based e-commerce frontend for gaming products built with Vite. This is an academic project for DUOC UC's DSY1104 (Full Stack Development II) course. The application integrates with three backend microservices for user management, inventory, and shopping cart/checkout functionality.

## Development Commands

### Local Development
```bash
npm run dev          # Start Vite dev server (default: http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Code Quality
```bash
npm run lint         # Run ESLint on all files
```

### Testing
```bash
npm test             # Run Jest test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage report
```

**Note**: Currently no test files exist in the codebase. Tests should be created in `__tests__` directories or as `.test.js`/`.spec.js` files.

## Architecture Overview

### Microservices Integration

The application connects to three backend microservices configured via environment variables:

- **Usuario Service** (`VITE_USUARIO_API_URL`): User authentication and profile management
  - Endpoints: `/users`, `/roles`

- **Inventario Service** (`VITE_INVENTARIO_API_URL`): Product catalog and categories
  - Endpoints: `/productos`, `/categorias`

- **Carrito Service** (`VITE_CARRITO_API_URL`): Shopping cart, checkout, orders, and payments (Transbank integration)
  - Endpoints: `/cart`, `/checkout`, `/orders`, `/payments`

Configure these URLs in `.env` (copy from `.env.example` for defaults).

### Routing Architecture

The application uses **React Router v7** with data loading via loaders:

- **Router Configuration**: `src/App.jsx` defines the router using `createBrowserRouter`
- **Layout Pattern**: Common `<Layout>` component wraps all routes, containing `<Navbar>`, `<Footer>`, auth modals, and `<ScrollToTop>`
- **Data Loaders**: Route-specific loaders in `src/loaders/` prefetch data before rendering
  - `userProfileLoader` - Loads user profile data
  - `blogPostLoader` - Loads blog post by slug
  - Additional loaders: `catalogLoader`, `productLoader`, `categoryLoader`, `blogLoader`, `eventLoader`, `levelLoader`

### State Management via Context

Three React Context providers wrap the entire application (in this order):

1. **AuthContext** (`src/context/AuthContext.jsx`)
   - Handles authentication state, JWT tokens (fake tokens for mockup), session cookies
   - Provides: `login()`, `logout()`, `register()` (disabled), `isAuthenticated`, `authUser`
   - Modal controls: `openLoginModal()`, `openRegisterModal()`, `switchToLogin()`, `switchToRegister()`
   - Dispatches custom events: `userLoggedIn`, `userLoggedOut`
   - **Special**: Checks for `@duoc.cl` or `@profesor.duoc.cl` emails to apply lifetime 20% discount

2. **UserContext** (`src/context/UserContext.jsx`)
   - Manages full user profile data (stored in localStorage as `currentUser`)
   - Provides: `user`, `updateUser()`, `updatePersonal()`, `updateAddress()`, `updatePreferences()`, `updateGaming()`, `addPoints()`
   - Listens to `userLoggedIn`/`userLoggedOut` events to sync with AuthContext

3. **CartContext** (`src/context/CartContext.jsx`)
   - Manages shopping cart with dual-mode operation:
     - **Guest mode**: Uses localStorage (`cart:data`)
     - **Logged-in mode**: Syncs with Carrito Service API and localStorage
   - Provides: `cart`, `items`, `carritoId`, `addToCart()`, `updateQuantity()`, `removeFromCart()`, `clearCart()`, `applyCoupon()`, `removeCoupon()`, `getTotals()`
   - Dispatches `cart:changed` events for cross-component synchronization
   - Handles stock validation and quantity limits

**Important**: The contexts listen to cross-component events (`userLoggedIn`, `userLoggedOut`, `cart:changed`) to stay synchronized. When making changes to auth or cart state, ensure these events are properly dispatched.

### API Service Layer

**Centralized API Configuration** (`src/services/api.js`):
- Routes requests to appropriate microservices based on endpoint pattern
- Provides HTTP methods: `get()`, `post()`, `put()`, `patch()`, `delete()`
- Handles response unwrapping (extracts `data` field from standardized responses)
- Error handling with console logging

**Service Modules**:
- `userService.js` - User authentication, profile updates (`authenticateUser()`, `updateUserProfile()`)
- `catalogService.js` - Product catalog with filtering
- `productService.js` - Individual product operations
- `categoryService.js` - Category management
- `blogService.js` - Blog posts
- `eventService.js` - Events
- `levelService.js` - User level/gamification
- **`cartService.js`** - Comprehensive cart/checkout/order/payment operations (see below)

### Shopping Cart & Checkout Flow

**Cart Service** (`src/services/cartService.js`) provides complete e-commerce operations:

**Cart Management**:
- `getOrCreateCart(usuarioId)` - Get or create user's active cart
- `addItemToCart(carritoId, item)` - Add item with `servicioId`, `cantidad`, `personalizaciones`
- `updateCartItem(itemId, cantidad)` - Update quantity
- `removeCartItem(itemId)` - Remove item
- `emptyCart(carritoId)` - Clear entire cart
- `processCart(carritoId)` - Mark cart as processed

**Checkout**:
- `initiateCheckout({carritoId, returnUrl})` - Start Transbank checkout, returns Transbank redirect data
- `confirmCheckout(token)` - Confirm payment after Transbank redirect (GET)
- `confirmCheckoutPost(token)` - Confirm payment via POST callback

**Orders**:
- `getOrderById(orderId)`, `getOrderByNumber(numeroOrden)` - Retrieve orders
- `getUserOrders(usuarioId)` - Get all user orders
- `getUserOrdersByStatus(usuarioId, estado)` - Filter by status
- `updateOrderStatus(orderId, nuevoEstado)` - Admin operation
- `cancelOrder(orderId)` - Cancel order
- **Order Statuses**: `CREADO`, `PAGO_PENDIENTE`, `PAGO_COMPLETADO`, `PROCESANDO`, `COMPLETADO`, `CANCELADO`, `FALLIDO`

**Payments**:
- `getPaymentById(pagoId)`, `getPaymentByOrder(pedidoId)`, `getPaymentByToken(token)` - Retrieve payment info
- `checkPaymentApproved(pagoId)` - Verify payment approval

### Custom Hooks

- `useAuth()` - Access AuthContext (must be within AuthProvider)
- `useUser()` - Access UserContext (must be within UserProvider)
- `useCart()` - Access CartContext (must be within CartProvider)
- `useFetch()` - Generic data fetching with loading/error states

### Component Organization

```
src/
├── components/
│   ├── common/         # Reusable UI (Header, Footer, Navigation, Layout, ErrorBoundary, ScrollToTop)
│   ├── modals/         # Modal dialogs (LoginModal, RegisterModal, RedeemPointsModal)
│   ├── products/       # Product display (ProductCard, ProductDetail)
│   ├── cart/           # Cart components (CartDetail, CartSummary, CartItem)
│   ├── filters/        # Catalog filters (FilterSidebar, brand/price/rating hamburgers)
│   ├── blog/           # Blog components (BlogCard, BlogPost)
│   ├── landing/        # Home page sections (Hero, Events, WhyBuy, NewsSection, CategoriesSection)
│   └── profile/        # User profile tabs (Personal, Address, Security, Gaming, Coupons, Preferences)
├── pages/              # Route pages (Home, Catalog, ProductDetail, Cart, PaymentConfirm, PurchaseSuccess, Blog, BlogPost, UserProfile, About, Support, NotFound)
├── context/            # React Context providers (AuthContext, UserContext, CartContext)
├── services/           # API service modules (api, userService, catalogService, cartService, etc.)
├── loaders/            # React Router data loaders
├── hooks/              # Custom React hooks
├── utils/              # Utilities (constants, helpers, validation, couponUtils, userSwitcher, userMockupInfo)
├── assets/            # Static assets (images, data files like blogPostsContent.js)
└── styles/            # CSS files (main.css, pages/, components/, fonts/, variables/)
```

## Important Notes

### Authentication System
- **Registration enabled** - Users can register via `/auth/register` endpoint
- **Real JWT tokens** from Usuario API backend (Spring Boot microservice)
- Session persistence via cookies (configurable with "Remember Me")
- Token validation on app mount and auto-logout on expiration
- Profile page (`/profile`) reloads on login/logout to refresh data
- Email domain restrictions: `duoc.cl`, `profesor.duoc.cl`, `gmail.com`
- **DUOC discount** (20%) handled by backend based on email domain

### Development Utilities
Two console utilities are auto-loaded in `main.jsx`:
- `userSwitcher.js` - Provides console commands to switch between test users
- `userMockupInfo.js` - Displays available test user credentials in console

Check browser console on startup for available test users and commands.

### Cart Behavior
- Guest users: Cart stored only in localStorage
- Logged-in users: Cart synced with API and mirrored to localStorage
- Cart automatically initializes on login via `cart:changed` event
- Stock validation happens both client-side and server-side

### Transbank Integration
Payment flow uses Transbank WebPay Plus (via Carrito Service):
1. User clicks checkout → `initiateCheckout()` called
2. Frontend receives Transbank redirect URL and token
3. User redirected to Transbank payment page
4. After payment, Transbank redirects back with `token_ws` query parameter
5. Frontend calls `confirmCheckout(token_ws)` to finalize order

### File Mock for Tests
Jest config includes `__mocks__/fileMock.js` for handling image imports in tests. Create this file if writing tests that import images.

### Babel Configuration
Create `.babelrc` or `babel.config.js` if not present:
```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

### Environment Variables
Always use `import.meta.env.VITE_*` prefix for environment variables in Vite projects. Default values are provided as fallbacks in `api.js`.

### Usuario API Integration (Spring Boot)

The frontend integrates with a Spring Boot backend (Usuario Service) for authentication and user management:

**Authentication Endpoints**:
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Authenticate user, returns JWT token

**Profile Endpoints** (JWT-based, no user ID required):
- `GET /api/v1/profile` - Get current user's profile
- `PUT /api/v1/profile` - Update current user's profile

**Points Endpoints** (JWT-based):
- `POST /api/v1/points` - Add points to current user

**Coupon Endpoints** (JWT-based):
- `GET /api/v1/coupons` - Get all coupons for current user
- `POST /api/v1/coupons/redeem` - Redeem points for coupon
- `DELETE /api/v1/coupons/{couponId}` - Remove coupon

**Key Features**:
- JWT authentication with Bearer token in Authorization header
- Automatic token validation and session management
- 401 Unauthorized responses trigger automatic logout
- Token expiration check on app mount
- All endpoints use JWT to identify the user (no user ID in URL)
