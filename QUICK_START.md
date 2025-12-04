# LUNARi - Quick Start Guide

## Prerequisites

-  Node.js 18+ and npm
-  Java 17+
-  Maven 3.8+
-  PostgreSQL 14+ (for Inventario and Carrito services)
-  AWS DynamoDB Local or AWS Account (for Usuario service)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DSY1104_Millan_Munoz
```

### 2. Configure Environment Variables

Create a `.env` file in the frontend root:

```bash
cp .env.example .env
```

Edit `.env` with your microservices URLs:

```env
VITE_USUARIO_API_URL=http://localhost:8081/api/v1
VITE_INVENTARIO_API_URL=http://localhost:8082/api/v1
VITE_CARRITO_API_URL=http://localhost:8083/api/v1
```

### 3. Start Backend Services

#### Terminal 1 - Usuario Service (Port 8081)

```bash
cd ../usuario
mvn spring-boot:run
```

#### Terminal 2 - Inventario Service (Port 8082)

```bash
cd ../inventario
mvn spring-boot:run
```

#### Terminal 3 - Carrito Service (Port 8083)

```bash
cd ../carrito
mvn spring-boot:run
```

### 4. Start Frontend

#### Terminal 4 - React Frontend (Port 5173)

```bash
cd DSY1104_Millan_Munoz
npm install
npm run dev
```

### 5. Access the Application

-  **Frontend**: http://localhost:5173
-  **Usuario API**: http://localhost:8081/swagger-ui/index.html
-  **Inventario API**: http://localhost:8082/swagger-ui/index.html
-  **Carrito API**: http://localhost:8083/swagger-ui/index.html

## Testing the Integration

### 1. User Registration & Login

1. Go to http://localhost:5173
2. Click "Registrarse"
3. Create a new account
4. Login with your credentials

### 2. Browse Products

1. Navigate to "Productos"
2. Browse the catalog
3. Use filters (category, brand, price, rating)
4. Search for products

### 3. Add to Cart

1. Click on a product
2. View product details
3. Click "Agregar al Carrito"
4. View cart icon update with item count

### 4. Complete Purchase

1. Click cart icon
2. Review items
3. Click "Proceder al Pago"
4. Fill shipping information
5. Select payment method
6. Click "Realizar Pago"
7. Complete Transbank payment (test environment)
8. View order confirmation

## Test Users

### Regular User

-  **Email**: john@example.com
-  **Password**: password123

### DUOC Student (20% discount)

-  **Email**: student@duoc.cl
-  **Password**: password123

### Admin User

-  **Email**: admin@lunari.cl
-  **Password**: admin123

## Test Cards (Transbank)

For testing Transbank payments in development:

**Approved Transaction:**

-  Card: 4051 8856 0053 6483
-  CVV: 123
-  Expiry: Any future date

**Rejected Transaction:**

-  Card: 4051 8842 3993 7763
-  CVV: 123
-  Expiry: Any future date

## Common Issues

### CORS Errors

**Solution**: Ensure all backend services have CORS configured to allow `http://localhost:5173`

### Connection Refused

**Solution**: Check that all backend services are running on their respective ports (8081, 8082, 8083)

### Cart Not Syncing

**Solution**:

1. Check browser console for errors
2. Verify Usuario service is running
3. Clear localStorage and try again

### Payment Failed

**Solution**:

1. Verify Carrito service is running
2. Check Transbank credentials in `.env`
3. Use test cards provided above

## API Documentation

Each service provides Swagger UI documentation:

-  **Usuario**: http://localhost:8081/swagger-ui/index.html
-  **Inventario**: http://localhost:8082/swagger-ui/index.html
-  **Carrito**: http://localhost:8083/swagger-ui/index.html

## Development Commands

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test            # Run tests
```

### Backend (each service)

```bash
mvn spring-boot:run              # Run application
mvn clean install               # Build and install
mvn test                        # Run tests
mvn spring-boot:run -Dspring.profiles.active=dev  # Run with dev profile
```

## Project Structure

```
DSY1104_Millan_Munoz/
├── src/
│   ├── services/
│   │   ├── api.js              # API configuration
│   │   ├── userService.js      # Usuario service integration
│   │   ├── catalogService.js   # Inventario service integration
│   │   └── cartService.js      # Carrito service integration
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state
│   │   ├── UserContext.jsx     # User profile state
│   │   └── CartContext.jsx     # Cart state with API sync
│   ├── pages/
│   │   ├── Cart.jsx           # Cart and checkout page
│   │   ├── PaymentConfirm.jsx # Payment confirmation handler
│   │   └── PurchaseSuccess.jsx # Order success page
│   └── ...
├── .env.example               # Environment variables template
├── API_DOCUMENTATION.md       # Complete API reference
├── INTEGRATION_SUMMARY.md     # Integration details
└── package.json
```

## Support

For issues or questions:

-  Check `API_DOCUMENTATION.md` for endpoint details
-  Check `INTEGRATION_SUMMARY.md` for integration flow
-  Review Swagger UI for each service
-  Check browser console for errors
-  Review backend logs for API errors

## License

This project is part of the DUOC UC Full Stack II course.
