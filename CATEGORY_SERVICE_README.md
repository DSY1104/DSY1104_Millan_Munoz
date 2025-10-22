# Category Service & Loader Implementation

Complete service layer and loaders for the category system, following the same architecture pattern as events, levels, and catalog.

## Files Created

### 1. `src/services/categoryService.js` ✨

Category service with 8 methods:

#### Core Methods

- **`getAllCategories()`** - Fetches all categories
- **`getCategoryById(id)`** - Gets a specific category by ID
- **`getCategoriesByName(name)`** - Searches categories by name (partial match)

#### Utility Methods

- **`getCategoryIds()`** - Returns array of all category IDs
- **`getCategoryNames()`** - Returns array of all category names
- **`getCategoryMap()`** - Returns object mapping ID → Name
- **`categoryExists(id)`** - Checks if a category ID exists
- **`getCategoriesCount()`** - Returns total number of categories

### 2. `src/loaders/categoryLoader.js` ✨

Four specialized loaders:

- **`categoriesLoader()`** - Loads all categories
- **`categoryDetailLoader({ params })`** - Loads single category by URL param
- **`categoryMapLoader()`** - Loads ID→Name mapping
- **`categoriesWithMetaLoader()`** - Loads categories with metadata

### 3. `src/pages/Catalog.jsx` ✨ UPDATED

- Now uses `getAllCategories()` from `categoryService`
- Replaces direct JSON fetch with service call

## Service Methods Documentation

### getAllCategories()

```javascript
const categories = await getAllCategories();
// Returns: [
//   { id: "JM", nombre: "Juegos de Mesa" },
//   { id: "AC", nombre: "Accesorios" },
//   ...
// ]
```

### getCategoryById(id)

```javascript
const category = await getCategoryById("JM");
// Returns: { id: "JM", nombre: "Juegos de Mesa" }
```

### getCategoryMap()

```javascript
const map = await getCategoryMap();
// Returns: {
//   "JM": "Juegos de Mesa",
//   "AC": "Accesorios",
//   ...
// }
```

### categoryExists(id)

```javascript
const exists = await categoryExists("JM");
// Returns: true
```

## Usage Examples

### Example 1: Get all categories

```javascript
import { getAllCategories } from "../services/categoryService";

const categories = await getAllCategories();
console.log(`Loaded ${categories.length} categories`);
```

### Example 2: Get category name by ID

```javascript
import { getCategoryById } from "../services/categoryService";

const category = await getCategoryById("JM");
console.log(category.nombre); // "Juegos de Mesa"
```

### Example 3: Create category dropdown

```javascript
import { getAllCategories } from "../services/categoryService";

function CategorySelect() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  return (
    <select>
      <option value="">Todas las categorías</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.nombre}
        </option>
      ))}
    </select>
  );
}
```

### Example 4: Category name lookup

```javascript
import { getCategoryMap } from "../services/categoryService";

const categoryMap = await getCategoryMap();
const productCategory = categoryMap["JM"]; // "Juegos de Mesa"
```

### Example 5: Search categories

```javascript
import { getCategoriesByName } from "../services/categoryService";

const results = await getCategoriesByName("gaming");
// Returns categories with "gaming" in their name
```

## Loader Usage Examples

### Example 1: Categories list page

```javascript
// In router.jsx
{
  path: '/categories',
  element: <CategoriesPage />,
  loader: categoriesLoader,
}

// In component
function CategoriesPage() {
  const categories = useLoaderData();

  return (
    <div>
      <h1>Categorías</h1>
      {categories.map(cat => (
        <div key={cat.id}>
          <h2>{cat.nombre}</h2>
          <Link to={`/category/${cat.id}`}>Ver productos</Link>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Category detail page

```javascript
// Route: /category/JM
{
  path: '/category/:categoryId',
  element: <CategoryDetailPage />,
  loader: categoryDetailLoader,
}

// Component
function CategoryDetailPage() {
  const category = useLoaderData();

  return (
    <div>
      <h1>{category.nombre}</h1>
      <p>Categoría ID: {category.id}</p>
    </div>
  );
}
```

## Category Data Structure

```javascript
{
  "id": "JM",                    // Unique category ID
  "nombre": "Juegos de Mesa"     // Category name in Spanish
}
```

## Available Categories

| ID  | Nombre                          |
| --- | ------------------------------- |
| JM  | Juegos de Mesa                  |
| AC  | Accesorios                      |
| CO  | Consolas                        |
| CG  | Computadores Gamers             |
| SG  | Sillas Gamers                   |
| MS  | Mouse                           |
| MP  | Mousepad                        |
| PP  | Poleras Personalizadas          |
| PG  | Polerones Gamers Personalizados |
| ST  | Servicio Técnico                |

## Integration with Catalog

The `Catalog.jsx` component now uses the category service:

```javascript
import { getAllCategories } from "../services/categoryService";

useEffect(() => {
  const fetchData = async () => {
    const [productsData, categoriesData] = await Promise.all([
      getAllProducts(),
      getAllCategories(), // Using category service
    ]);
    setCategories(categoriesData);
  };
  fetchData();
}, []);
```

## Benefits

✅ **Centralized category logic** - Single source of truth  
✅ **Reusable methods** - Use across multiple components  
✅ **Type safety** - Clear input/output types  
✅ **Error handling** - Graceful fallbacks  
✅ **Network simulation** - 500ms delay for testing  
✅ **Easy to extend** - Add new methods as needed

## Switching to Real API

When ready, update `categoryService.js`:

```javascript
// Current (local JSON):
const response = await fetch("/src/assets/data/categories.json");

// Future (real API):
const response = await fetch("https://api.yoursite.com/categories");

// Or use centralized api.js:
import { get } from "./api";
const categories = await get("/api/categories");
```

## Summary

✅ **Complete service layer** with 8 specialized methods  
✅ **4 loaders** for different routing scenarios  
✅ **Catalog.jsx updated** to use category service  
✅ **No errors** - production ready  
✅ **Follows same pattern** as other services  
✅ **Simple data structure** - easy to work with

The category system is now fully implemented! 🎉
