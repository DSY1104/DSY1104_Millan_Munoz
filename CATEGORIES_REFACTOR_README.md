# Categories Refactoring - Implementation Guide

## Overview

This document describes the refactoring of the categories system from JSON file to centralized constant, and the implementation of React Router navigation with category filtering.

## Changes Made

### 1. Centralized Category Data

**File**: `/src/services/categoryService.js`

**Before**:

- Categories loaded from `categories.json`
- Required fetch API call
- File dependency

**After**:

- Categories defined as constant `CATEGORIES` in service
- Async function simulates API call for consistency
- No file dependency
- Single source of truth

```javascript
const CATEGORIES = [
  { id: "JM", nombre: "Juegos de Mesa" },
  { id: "AC", nombre: "Accesorios" },
  { id: "CO", nombre: "Consolas" },
  { id: "CG", nombre: "Computadores Gamers" },
  { id: "SG", nombre: "Sillas Gamers" },
  { id: "MS", nombre: "Mouse" },
  { id: "MP", nombre: "Mousepad" },
  { id: "PP", nombre: "Poleras Personalizadas" },
  { id: "PG", nombre: "Polerones Gamers Personalizados" },
  { id: "ST", nombre: "Servicio Técnico" },
  { id: "FA", nombre: "Fuentes de Alimentación" },
];
```

### 2. Updated CategoriesSection Component

**File**: `/src/components/landing/CategoriesSection.jsx`

**Changes**:

1. ✅ Removed `href` property from categories array
2. ✅ Added React Router `Link` import
3. ✅ Changed `<a>` to `<Link>` component
4. ✅ Updated navigation to `/products?cat={categoryId}`
5. ✅ Passed `id` prop to CategoryTile

**Before**:

```jsx
<a href="pages/products/catalog.html?cat=JM">
```

**After**:

```jsx
<Link to="/products?cat=JM">
```

**Benefits**:

- Client-side navigation (no page reload)
- Faster navigation
- Better user experience
- URL parameters support

### 3. Updated Catalog Page with Query Parameters

**File**: `/src/pages/Catalog.jsx`

**Changes**:

1. ✅ Added `useSearchParams` hook from React Router
2. ✅ Added effect to read `cat` query parameter
3. ✅ Auto-select category when coming from category link
4. ✅ Clear query params when clearing filters

**Implementation**:

```javascript
const [searchParams, setSearchParams] = useSearchParams();

// Handle category from query parameter
useEffect(() => {
  const catParam = searchParams.get("cat");
  if (catParam) {
    setSelectedCategory(catParam);
  }
}, [searchParams]);

// Clear query parameters
const handleClearFilters = () => {
  // ... other resets
  setSearchParams({});
};
```

## User Flow

### Category Selection Flow

```
1. User on Home page
   ↓
2. Clicks category tile (e.g., "MOUSE")
   ↓
3. Navigates to /products?cat=MS
   ↓
4. Catalog page loads
   ↓
5. useSearchParams reads "cat=MS"
   ↓
6. setSelectedCategory("MS")
   ↓
7. Products filtered to MS category
   ↓
8. User sees only Mouse products
```

### Clear Filters Flow

```
1. User has category filter active
   ↓
2. Clicks "Limpiar Filtros"
   ↓
3. handleClearFilters() called
   ↓
4. setSearchParams({}) clears URL
   ↓
5. URL becomes /products (no query)
   ↓
6. All products shown
```

## Category Filtering Logic

### How It Works

The Catalog page filters products based on `selectedCategory`:

```javascript
if (selectedCategory) {
  filtered = filtered.filter(
    (p) =>
      p.categoriaId === selectedCategory ||
      (p.categoria &&
        normalizeText(p.categoria).includes(normalizeText(selectedCategory)))
  );
}
```

### Matching Criteria

Products are matched if:

1. `product.categoriaId` exactly matches category ID (e.g., "MS")
2. OR `product.categoria` contains the category name

### Category IDs Reference

| ID  | Category Name                   |
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
| FA  | Fuentes de Alimentación         |

## Testing

### Manual Testing Checklist

**Category Navigation**:

- [ ] Click each category tile on home page
- [ ] Verify URL changes to `/products?cat={ID}`
- [ ] Verify products are filtered correctly
- [ ] Verify filter sidebar shows selected category

**Query Parameter Persistence**:

- [ ] Navigate to `/products?cat=MS` directly
- [ ] Verify Mouse category is pre-selected
- [ ] Verify only Mouse products show

**Clear Filters**:

- [ ] Select a category
- [ ] Click "Limpiar Filtros"
- [ ] Verify URL becomes `/products`
- [ ] Verify all products shown

**Browser Navigation**:

- [ ] Click category
- [ ] Click browser back button
- [ ] Verify returns to home page
- [ ] Click forward button
- [ ] Verify category filter re-applied

### Test URLs

```
# All products
http://localhost:5175/products

# Filtered by category
http://localhost:5175/products?cat=MS    # Mouse
http://localhost:5175/products?cat=JM    # Juegos de Mesa
http://localhost:5175/products?cat=CG    # Computadores Gamer
http://localhost:5175/products?cat=SG    # Sillas Gamer
http://localhost:5175/products?cat=AC    # Accesorios
```

## Benefits of This Refactoring

### 1. Performance

- ✅ No JSON file fetch required
- ✅ Immediate category data availability
- ✅ Client-side navigation (no page reload)
- ✅ Faster category switching

### 2. Maintainability

- ✅ Single source of truth for categories
- ✅ Easy to add/remove categories
- ✅ Type-safe (can add TypeScript later)
- ✅ No file path dependencies

### 3. User Experience

- ✅ Instant navigation
- ✅ Browser back/forward works correctly
- ✅ Shareable category URLs
- ✅ Deep linking support

### 4. Developer Experience

- ✅ Simpler code structure
- ✅ No async file loading bugs
- ✅ Easier to test
- ✅ Better debugging

## Migration Notes

### Old System (Deprecated)

```javascript
// DON'T USE - Old way
fetch("/src/assets/data/categories.json")
  .then((res) => res.json())
  .then((data) => setCategories(data));
```

### New System

```javascript
// USE THIS - New way
import { getAllCategories } from "../services/categoryService";

const categories = await getAllCategories();
```

## Future Enhancements

### Phase 1

- [ ] Add category images to CATEGORIES constant
- [ ] Add category descriptions
- [ ] Add subcategories support

### Phase 2

- [ ] Backend API integration
- [ ] Dynamic category loading
- [ ] Category popularity tracking

### Phase 3

- [ ] Category recommendations
- [ ] Related categories
- [ ] Category search

## File Changes Summary

### Modified Files

1. `/src/services/categoryService.js`

   - Removed JSON fetch
   - Added CATEGORIES constant
   - Simplified getAllCategories()

2. `/src/components/landing/CategoriesSection.jsx`

   - Added Link import
   - Removed href from categories
   - Changed <a> to <Link>
   - Updated to query param navigation

3. `/src/pages/Catalog.jsx`
   - Added useSearchParams hook
   - Added query param handling
   - Added category auto-selection
   - Updated clear filters

### Deprecated Files

- `/src/assets/data/categories.json` - No longer used in React app
  - ⚠️ Still used by old vanilla JS files
  - Can be removed after full migration

## Troubleshooting

### Issue: Category not filtering

**Solution**: Check product data has `categoriaId` field

### Issue: URL not updating

**Solution**: Ensure Link component is used, not <a>

### Issue: Back button not working

**Solution**: Verify using React Router Link, not href

### Issue: Category persists after clear

**Solution**: Check setSearchParams({}) is called

## Related Documentation

- [React Router useSearchParams](https://reactrouter.com/en/main/hooks/use-search-params)
- [Category Service README](./CATEGORY_SERVICE_README.md)
- [Catalog Service README](./CATALOG_SERVICE_README.md)

---

**Last Updated**: October 22, 2025  
**Version**: 2.0  
**Status**: ✅ Complete and Production Ready
