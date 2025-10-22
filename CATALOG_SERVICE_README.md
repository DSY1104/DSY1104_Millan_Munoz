# Catalog Service & Loader Implementation

Complete service layer and loaders for the product catalog system, following the same architecture pattern as the event and level systems.

## Architecture Overview

```
src/
├── services/
│   ├── api.js                    # Centralized API fetch logic (shared)
│   └── catalogService.js         # Catalog-specific service methods ✨ NEW
├── loaders/
│   └── catalogLoader.js          # React Router loaders for catalog ✨ NEW
├── pages/
│   └── Catalog.jsx               # Catalog page (renamed from Products.jsx) ✨ UPDATED
└── assets/
    └── data/
        └── products.json         # Products data source
```

## Files Created/Modified

### 1. `src/services/catalogService.js` ✨ NEW

Comprehensive product catalog service with 13 methods:

#### Core Data Methods

- **`getAllProducts()`** - Fetches all products with index for sorting
- **`getProductByCode(code)`** - Gets a specific product by code
- **`getProductsByCategory(categoryId)`** - Filters products by category
- **`getProductsByBrand(brand)`** - Filters products by brand

#### Discovery Methods

- **`getAllBrands()`** - Gets unique brands from all products
- **`getProductCategories()`** - Gets unique category IDs

#### Search & Filter Methods

- **`searchProducts(query)`** - Searches by name and code
- **`getProductsByRating(minRating, maxRating)`** - Filters by rating range
- **`getProductsByPriceRange(minPrice, maxPrice)`** - Filters by price range

#### Sorting Methods

- **`getProductsSortedByPrice(order)`** - Sorts by price (asc/desc)
- **`getProductsSortedByRating(order)`** - Sorts by rating (asc/desc)

#### Utility Methods

- **`getProductsInStock()`** - Returns only products with stock > 0
- **`getFeaturedProducts(minRating, limit)`** - Gets top-rated products

### 2. `src/loaders/catalogLoader.js` ✨ NEW

Five specialized loaders for different routing scenarios:

- **`catalogLoader()`** - Loads all products for catalog page
- **`productDetailLoader({ params })`** - Loads single product by code from URL
- **`categoryProductsLoader({ params })`** - Loads products for a category
- **`catalogWithFiltersLoader()`** - Loads products + brands for filters
- **`searchResultsLoader({ request })`** - Loads products for search with query param

### 3. `src/pages/Catalog.jsx` ✨ RENAMED & UPDATED

- **Renamed from:** `Products.jsx` → `Catalog.jsx`
- ✅ Now uses `getAllProducts()` from `catalogService`
- ✅ Added loading state with "Cargando catálogo..." message
- ✅ Added error handling with user-friendly message
- ✅ Maintains all existing features (filters, sorting, pagination)
- ✅ All existing functionality preserved

### 4. Documentation Files

- **`catalogService.examples.js`** - 12 usage examples
- **`catalogLoader.example.js`** - Router integration examples
- **`CATALOG_SERVICE_README.md`** - This document

## Service Methods Documentation

### getAllProducts()

```javascript
const products = await getAllProducts();
// Returns: Array of all products with _idx property for stable sorting
```

### getProductByCode(code)

```javascript
const product = await getProductByCode("JM001");
// Returns: { code: 'JM001', nombre: 'Catan', precioCLP: 29990, ... }
```

### getProductsByCategory(categoryId)

```javascript
const products = await getProductsByCategory("JM");
// Returns: All board games (Juegos de Mesa)
```

### searchProducts(query)

```javascript
const results = await searchProducts("gaming mouse");
// Returns: Products matching in name or code
```

### getProductsByPriceRange(minPrice, maxPrice)

```javascript
const affordable = await getProductsByPriceRange(0, 50000);
// Returns: Products under $50,000
```

### getFeaturedProducts(minRating, limit)

```javascript
const featured = await getFeaturedProducts(4.5, 5);
// Returns: Top 5 products with rating >= 4.5
```

## Loader Usage Examples

### Example 1: Basic Catalog Page

```javascript
// In router.jsx
{
  path: '/catalog',
  element: <CatalogPage />,
  loader: catalogLoader,
}

// In component
import { useLoaderData } from 'react-router-dom';

function CatalogPage() {
  const products = useLoaderData();

  return (
    <div>
      <h1>Catálogo</h1>
      {products.map(product => (
        <ProductCard key={product.code} product={product} />
      ))}
    </div>
  );
}
```

### Example 2: Product Detail Page

```javascript
// Route: /products/JM001
{
  path: '/products/:productCode',
  element: <ProductDetailPage />,
  loader: productDetailLoader,
}

// Component
function ProductDetailPage() {
  const product = useLoaderData();

  return (
    <div>
      <h1>{product.nombre}</h1>
      <p>${product.precioCLP.toLocaleString('es-CL')}</p>
      <p>Rating: {product.rating}</p>
      <p>Stock: {product.stock}</p>
    </div>
  );
}
```

### Example 3: Category Page

```javascript
// Route: /category/JM
{
  path: '/category/:categoryId',
  element: <CategoryPage />,
  loader: categoryProductsLoader,
}

// Component
function CategoryPage() {
  const products = useLoaderData();

  return (
    <div>
      <h1>Productos de la categoría</h1>
      <p>{products.length} productos encontrados</p>
      {products.map(product => <ProductCard key={product.code} product={product} />)}
    </div>
  );
}
```

## Common Use Cases

### Use Case 1: Display All Products

```javascript
import { getAllProducts } from "../services/catalogService";

const products = await getAllProducts();
console.log(`Loaded ${products.length} products`);
```

### Use Case 2: Search Functionality

```javascript
import { searchProducts } from "../services/catalogService";

const results = await searchProducts("mouse gamer");
// Returns products matching "mouse gamer" in name or code
```

### Use Case 3: Filter by Category

```javascript
import { getProductsByCategory } from "../services/catalogService";

const boardGames = await getProductsByCategory("JM");
console.log(`Found ${boardGames.length} board games`);
```

### Use Case 4: Price Range Filter

```javascript
import { getProductsByPriceRange } from "../services/catalogService";

const affordable = await getProductsByPriceRange(0, 100000);
// Products under $100,000
```

### Use Case 5: Get Top Rated Products

```javascript
import { getFeaturedProducts } from "../services/catalogService";

const featured = await getFeaturedProducts(4.7, 10);
// Top 10 products with rating >= 4.7
```

### Use Case 6: Sort Products

```javascript
import { getProductsSortedByPrice } from "../services/catalogService";

const cheapestFirst = await getProductsSortedByPrice("asc");
const expensiveFirst = await getProductsSortedByPrice("desc");
```

### Use Case 7: Get Available Products

```javascript
import { getProductsInStock } from "../services/catalogService";

const available = await getProductsInStock();
// Only products with stock > 0
```

## Current Implementation: Catalog.jsx

The `Catalog.jsx` component now uses the service layer:

```javascript
import { getAllProducts } from "../services/catalogService";

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const productsData = await getAllProducts();
      setProducts(productsData);
      setError(null);
    } catch (err) {
      setError("Error message");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### Features Preserved

✅ Search by name or code  
✅ Category filtering  
✅ Brand filtering  
✅ Rating filtering  
✅ Price sorting (asc/desc)  
✅ Rating sorting (asc/desc)  
✅ Pagination (12 products per page)  
✅ Loading state  
✅ Error handling  
✅ Clear filters button

## Product Data Structure

```javascript
{
  "code": "JM001",                      // Unique product code
  "nombre": "Catan",                    // Product name
  "categoriaId": "JM",                  // Category ID
  "precioCLP": 29990,                   // Price in Chilean Pesos
  "stock": 25,                          // Available quantity
  "marca": "Kosmos",                    // Brand name
  "rating": 4.8,                        // Rating (0-5)
  "specs": ["3-4 jugadores", "60-90 min"], // Specifications
  "descripcion": "...",                 // Description
  "tags": ["familiar", "estrategia"],   // Tags
  "imagen": "/path/to/image.webp",      // Image path
  "_idx": 0                             // Index (added by service)
}
```

## Categories Available

- **JM** - Juegos de Mesa (Board Games)
- **AC** - Accesorios (Accessories)
- **CO** - Consolas (Consoles)
- **CG** - Computadoras Gaming (Gaming PCs)
- **SG** - Sillas Gamer (Gaming Chairs)
- **MS** - Mouse (Mice)
- **MP** - Mousepad
- **PP** - Poleras Personalizadas (Custom T-Shirts)
- **PG** - Polerones Gaming (Gaming Hoodies)
- **ST** - Servicio Técnico (Technical Service)

## Error Handling

All methods include try-catch blocks:

- Console errors for debugging
- Graceful fallbacks (empty arrays, null values)
- No app crashes on data fetch failure
- User-friendly error messages in Spanish

## Network Simulation

- 500ms delay to simulate real API latency
- Helps test loading states
- Matches pattern from event and level services

## Switching to Real API

When ready to use a real API, update `catalogService.js`:

```javascript
// Current (local JSON):
const response = await fetch("/src/assets/data/products.json");

// Future (real API):
const response = await fetch("https://api.yoursite.com/products");

// Or use centralized api.js:
import { get } from "./api";
const products = await get("/api/products");
```

## Testing the Service

```javascript
// Test in browser console or component
import * as catalogService from "./services/catalogService";

// Test 1: Get all products
catalogService.getAllProducts().then(console.log);

// Test 2: Search
catalogService.searchProducts("mouse").then(console.log);

// Test 3: Filter by category
catalogService.getProductsByCategory("JM").then(console.log);

// Test 4: Price range
catalogService.getProductsByPriceRange(0, 50000).then(console.log);

// Test 5: Featured products
catalogService.getFeaturedProducts(4.5, 5).then(console.log);
```

## File Renaming Summary

| Old Name            | New Name            | Status     |
| ------------------- | ------------------- | ---------- |
| `productService.js` | `catalogService.js` | ✅ Created |
| `productLoader.js`  | `catalogLoader.js`  | ✅ Created |
| `Products.jsx`      | `Catalog.jsx`       | ✅ Renamed |

## Summary

✅ **Complete service layer** with 13 specialized methods  
✅ **5 loaders** for different routing scenarios  
✅ **Catalog.jsx updated** to use service layer  
✅ **Files properly renamed** (catalogService, catalogLoader, Catalog.jsx)  
✅ **Loading & error states** implemented  
✅ **All existing features preserved**  
✅ **Comprehensive documentation** with examples  
✅ **No errors** - production ready  
✅ **Follows same pattern** as event and level systems

The catalog system is now fully implemented with the service/loader architecture! 🎉
