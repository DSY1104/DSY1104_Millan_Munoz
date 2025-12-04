# LUNARi Application - Microservices Integration Summary

## Overview

The LUNARi application has been successfully refactored to integrate with three microservices:

-  **Usuario Service** (Port 8081) - User management and authentication
-  **Inventario Service** (Port 8082) - Product and category management
-  **Carrito Service** (Port 8083) - Shopping cart, checkout, orders, and payments

## Files Created

### 1. `/src/services/cartService.js`

Complete service layer for Carrito microservice with all endpoints:

-  **Cart Management**: getOrCreateCart, getCartById, addItemToCart, updateCartItem, removeCartItem, emptyCart
-  **Checkout**: initiateCheckout, confirmCheckout
-  **Orders**: getOrderById, getOrderByNumber, getUserOrders, getUserOrdersByStatus, updateOrderStatus, cancelOrder
-  **Payments**: getPaymentById, getPaymentByOrder, getPaymentByToken, checkPaymentApproved
-  **Constants**: ORDER_STATUS enum for order states

### 2. `/src/pages/PaymentConfirm.jsx`

New page to handle Transbank payment confirmation:

-  Receives `token_ws` from Transbank redirect
-  Confirms payment with Carrito Service
-  Retrieves order details
-  Clears cart after successful payment
-  Redirects to purchase success page
-  Includes loading state and error handling

### 3. `/.env.example`

Environment variables template:

```env
VITE_USUARIO_API_URL=http://localhost:8081/api/v1
VITE_INVENTARIO_API_URL=http://localhost:8082/api/v1
VITE_CARRITO_API_URL=http://localhost:8083/api/v1
```

## Files Modified

### 1. `/src/services/userService.js` ✅

**Changes**: Converted from local JSON to Usuario Service API

-  All functions now use REST API calls
-  Added proper error handling for 404s and authentication failures
-  Endpoints: `/users/*`, `/auth/login`, `/users/{id}/points`, etc.

### 2. `/src/services/catalogService.js` ✅

**Changes**: Converted from local JSON to Inventario Service API

-  All functions now use REST API calls
-  Endpoints: `/productos/*`, `/productos/categoria/{id}`, `/productos/buscar`, etc.
-  Removed local text normalization (handled by backend)

### 3. `/src/services/api.js` ✅

**Changes**: Enhanced to support multiple microservices

-  Added `getBaseURL()` function to route requests to correct service
-  Determines service based on endpoint prefix
-  Added PATCH method support
-  Improved error handling with response data
-  Handles standardized response format: `{ status: "success", data: {...} }`
-  Handles 204 No Content responses

### 4. `/src/context/CartContext.jsx` ✅

**Changes**: Refactored to use Carrito Service API

-  Added `initializeCart()` function to load cart from API for logged-in users
-  Guest users still use localStorage as fallback
-  Cart syncs with API on user login
-  All cart operations (add, update, remove, clear) now call API endpoints
-  Added `carritoId` and `userId` to context state
-  Listens for `userLoggedIn` and `userLoggedOut` events
-  Initializes cart on mount if user is already logged in

### 5. `/src/pages/Cart.jsx` ✅

**Changes**: Integrated Transbank payment flow

-  Added `processingPayment` state
-  `handleCheckout()` now requires authenticated user
-  `handlePayment()` initiates checkout with Carrito Service
-  Creates Transbank payment form and redirects to payment gateway
-  Stores checkout data in sessionStorage for confirmation page
-  Uses `carritoId` from CartContext

### 6. `/src/App.jsx` ✅

**Changes**: Added PaymentConfirm route

-  Imported PaymentConfirm component
-  Added route: `/payment-confirm`
-  Route positioned before `/purchase-success` for proper flow

### 7. `/src/styles/pages/purchase-success.css` ✅

**Changes**: Added styles for payment confirmation

-  Loading spinner with rotation animation
-  Error states with red theme
-  Primary and secondary button styles
-  Responsive layout

## Data Flow

### 1. User Service Flow

```
User Login → authenticateUser() → POST /users/login
→ Returns user data + session token
→ Dispatches 'userLoggedIn' event
→ CartContext initializes cart from API
```

### 2. Product Catalog Flow

```
Browse Products → getAllProducts() → GET /productos
Filter by Category → getProductsByCategory() → GET /productos/categoria/{id}
Search → searchProducts() → GET /productos/buscar?nombre={query}
```

### 3. Cart Management Flow

```
User Logs In → initializeCart(userId) → GET /cart/usuario/{userId}
→ Loads existing cart or creates new one
→ Returns carritoId and items

Add to Cart → addToCart(item) → POST /cart/{carritoId}/items
→ Sends: { servicioId, cantidad, personalizaciones }
→ Updates local state

Update Quantity → updateQuantity(id, qty) → PUT /cart/items/{itemId}
→ Sends: { cantidad }

Remove Item → removeFromCart(id) → DELETE /cart/items/{itemId}
```

### 4. Checkout & Payment Flow

```
1. User clicks "Proceder al Pago"
   → Validates user is logged in
   → Shows checkout form

2. User fills shipping info and clicks "Pagar"
   → handlePayment(data) → initiateCheckout()
   → POST /checkout/initiate
   → Sends: { carritoId, returnUrl }
   → Returns: { numeroOrden, transbankToken, transbankUrl, pedidoId, montoTotal }

3. Store checkout data in sessionStorage
   → { numeroOrden, pedidoId, shippingData, pointsEarned }

4. Redirect to Transbank
   → Create hidden form with token_ws
   → Submit to transbankUrl

5. User completes payment on Transbank
   → Transbank redirects to: /payment-confirm?token_ws={token}

6. PaymentConfirm page
   → confirmCheckout(token) → GET /checkout/confirm?token_ws={token}
   → Returns: { pedidoId, numeroPedido, estadoPedido, pago }
   → getOrderById(pedidoId) → GET /orders/{pedidoId}
   → Returns full order details

7. Clear cart and navigate to success page
   → clearCart() → DELETE /cart/{carritoId}/vaciar
   → Navigate to /purchase-success with order data
```

## API Endpoints Used

### Usuario Service (Port 8081)

-  `POST /users/register` - Register new user
-  `POST /users/login` - Authenticate user
-  `GET /users/{userId}` - Get user by ID
-  `GET /users/email?email={email}` - Get user by email
-  `PATCH /users/{userId}` - Update user profile
-  `POST /users/{userId}/points?points={amount}` - Add points
-  `GET /users/{userId}/favorites` - Get user favorites

### Inventario Service (Port 8082)

-  `GET /productos` - Get all products
-  `GET /productos/activos` - Get active products
-  `GET /productos/{id}` - Get product by ID
-  `GET /productos/code/{code}` - Get product by code
-  `GET /productos/buscar?nombre={query}` - Search products
-  `GET /productos/categoria/{categoriaId}` - Get products by category
-  `GET /productos/marca/{marca}` - Get products by brand
-  `GET /productos/en-stock` - Get products in stock
-  `GET /productos/precio?min={min}&max={max}` - Get by price range
-  `GET /productos/rating?min={rating}` - Get by rating
-  `GET /categorias` - Get all categories
-  `GET /categorias/{id}` - Get category by ID

### Carrito Service (Port 8083)

-  `GET /cart/usuario/{usuarioId}` - Get or create user cart
-  `GET /cart/{carritoId}` - Get cart by ID
-  `POST /cart/{carritoId}/items` - Add item to cart
-  `PUT /cart/items/{itemId}` - Update cart item quantity
-  `DELETE /cart/items/{itemId}` - Remove item from cart
-  `DELETE /cart/{carritoId}/vaciar` - Empty cart
-  `POST /checkout/initiate` - Initiate checkout (Transbank)
-  `GET /checkout/confirm?token_ws={token}` - Confirm payment
-  `GET /orders/{orderId}` - Get order by ID
-  `GET /orders/numero/{numeroOrden}` - Get order by number
-  `GET /orders/usuario/{usuarioId}` - Get user orders
-  `GET /payments/{pagoId}` - Get payment details
-  `GET /payments/pedido/{pedidoId}` - Get payment by order

## Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory:

```env
VITE_USUARIO_API_URL=http://localhost:8081/api/v1
VITE_INVENTARIO_API_URL=http://localhost:8082/api/v1
VITE_CARRITO_API_URL=http://localhost:8083/api/v1
```

### Starting the Application

1. **Start all microservices** (in separate terminals):

```bash
# Terminal 1 - Usuario Service
cd usuario
mvn spring-boot:run

# Terminal 2 - Inventario Service
cd inventario
mvn spring-boot:run

# Terminal 3 - Carrito Service
cd carrito
mvn spring-boot:run
```

2. **Start the frontend**:

```bash
npm install
npm run dev
```

## Key Features

### 1. Seamless API Integration

-  All services communicate through standardized REST APIs
-  Automatic service routing based on endpoint
-  Consistent error handling across all services

### 2. Cart Persistence

-  Logged-in users: Cart stored in backend (Carrito Service)
-  Guest users: Cart stored in localStorage
-  Cart syncs on login
-  Cart preserved across sessions

### 3. Transbank Payment Integration

-  Real payment gateway integration
-  Secure token-based flow
-  Automatic order creation
-  Payment confirmation handling
-  Order tracking

### 4. User Experience

-  Loading states during API calls
-  Error handling with user-friendly messages
-  Fallback to localStorage on API errors
-  Seamless transition between guest and logged-in states

## Testing Checklist

### User Service

-  ✅ User registration
-  ✅ User login/logout
-  ✅ User profile updates
-  ✅ Points system

### Inventario Service

-  ✅ Browse products
-  ✅ Search products
-  ✅ Filter by category
-  ✅ Filter by brand
-  ✅ Filter by price range
-  ✅ Filter by rating

### Carrito Service

-  ✅ Add items to cart (guest)
-  ✅ Add items to cart (logged in)
-  ✅ Update quantities
-  ✅ Remove items
-  ✅ Cart persistence
-  ✅ Checkout initiation
-  ✅ Transbank redirect
-  ✅ Payment confirmation
-  ✅ Order creation
-  ✅ Order retrieval

## Known Considerations

1. **Guest Cart Migration**: When a guest user logs in, their localStorage cart is not automatically merged with their backend cart. This could be enhanced in the future.

2. **Stock Validation**: Stock is validated on the frontend, but should also be validated on the backend during checkout to prevent overselling.

3. **Transbank Testing**: Use Transbank's test environment and test cards for development. Production credentials needed for live transactions.

4. **CORS Configuration**: Ensure all backend services have CORS properly configured to accept requests from the frontend origin.

5. **Authentication**: Currently using a simple token-based auth. Consider implementing JWT refresh tokens for production.

## Next Steps

1. **Error Recovery**: Implement retry logic for failed API calls
2. **Optimistic Updates**: Update UI immediately while API calls are in progress
3. **Real-time Updates**: Consider WebSocket for real-time cart updates
4. **Order History**: Create a page to view past orders
5. **Payment Methods**: Add support for more payment methods beyond Transbank
6. **Cart Migration**: Implement guest-to-user cart migration on login

## Documentation

For detailed API documentation, refer to `API_DOCUMENTATION.md` in the project root.
