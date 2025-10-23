# Filter Components Migration - Documentation

## Overview

This document describes the migration of filter functionality from vanilla JavaScript to React components for the catalog page.

## Components Created

### 1. **BrandHamburger.jsx** (`/src/components/filters/BrandHamburger.jsx`)

- **Purpose**: Displays a collapsible list of brands for filtering products
- **Props**:
  - `brands` (Array): List of unique brand names
  - `selected` (String): Currently selected brand
  - `onSelect` (Function): Callback when a brand is selected
- **Features**:
  - Collapsible hamburger menu
  - Keyboard navigation support (Enter, Space, Escape)
  - ARIA attributes for accessibility
  - Visual feedback for selected brand

### 2. **RatingHamburger.jsx** (`/src/components/filters/RatingHamburger.jsx`)

- **Purpose**: Displays a collapsible list of rating filters (0-5 stars)
- **Props**:
  - `selected` (Number): Currently selected rating
  - `onSelect` (Function): Callback when a rating is selected
- **Features**:
  - Star visualization (★ and ☆)
  - Ratings from 0 to 5
  - Keyboard navigation support
  - ARIA attributes for accessibility

### 3. **FilterSidebar.jsx** (`/src/components/filters/FilterSidebar.jsx`)

- **Purpose**: Main sidebar component that combines all filters
- **Props**:
  - `categories` (Array): List of product categories
  - `brands` (Array): List of unique brands
  - `selectedCategory` (String): Currently selected category ID
  - `selectedBrand` (String): Currently selected brand
  - `selectedRating` (Number): Currently selected rating
  - `onCategorySelect` (Function): Callback for category selection
  - `onBrandSelect` (Function): Callback for brand selection
  - `onRatingSelect` (Function): Callback for rating selection
  - `onClearFilters` (Function): Callback to clear all filters
- **Features**:
  - Combines Category, Brand, and Rating filters
  - "Limpiar Filtro" button to reset all filters
  - Maintains consistent styling

### 4. **index.js** (`/src/components/filters/index.js`)

- **Purpose**: Barrel export file for cleaner imports
- **Exports**: FilterSidebar, BrandHamburger, RatingHamburger, CategoryHamburger

## Updated Files

### **Catalog.jsx** (`/src/pages/Catalog.jsx`)

**Changes**:

1. Updated imports:

   - Removed: `CategoryHamburger`
   - Added: `FilterSidebar`

2. Replaced sidebar markup with `<FilterSidebar />` component

   - Passes all necessary props and callbacks
   - Maintains existing state management

3. **Existing functionality preserved**:
   - `uniqueBrands` computed from products
   - Filtering logic for category, brand, and rating
   - Search functionality
   - Sorting by price and rating
   - Pagination

## How It Works

### Data Flow

1. **Products & Categories**: Fetched via `getAllProducts()` and `getAllCategories()`
2. **Unique Brands**: Computed from products using `useMemo`
3. **Filter Selection**: User clicks on filter → calls `onSelect` callback → updates state
4. **Product Filtering**: `filteredProducts` useMemo recalculates when filters change
5. **Pagination**: Automatically resets to page 1 when filters change

### Filter Logic (preserved from original)

#### Category Filter

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

#### Brand Filter

```javascript
if (selectedBrand) {
  filtered = filtered.filter((p) => p.marca === selectedBrand);
}
```

#### Rating Filter

```javascript
if (selectedRating !== null) {
  filtered = filtered.filter(
    (p) =>
      typeof p.rating === "number" &&
      p.rating >= selectedRating &&
      p.rating < selectedRating + 1
  );
}
```

## Accessibility Features

- **ARIA attributes**: `aria-expanded`, `aria-pressed`, `aria-label`, `aria-controls`
- **Keyboard navigation**: Enter, Space, and Escape key support
- **Focus management**: Proper tabindex and focus states
- **Semantic HTML**: Uses `<nav>`, `<button>`, and proper roles

## Styling

The components use existing CSS classes from the old implementation:

- `.tiles-hamburger` - Hamburger button
- `.hamburger-title` - Button text
- `.tiles-collapsible` - Collapsible container
- `.open` - Open state class
- `.tile-btn` - Filter button base
- `.category-btn`, `.brand-btn`, `.rating-btn` - Specific filter buttons
- `.selected` - Selected state (if styled)

## Usage Example

```jsx
<FilterSidebar
  categories={categories}
  brands={uniqueBrands}
  selectedCategory={selectedCategory}
  selectedBrand={selectedBrand}
  selectedRating={selectedRating}
  onCategorySelect={setSelectedCategory}
  onBrandSelect={setSelectedBrand}
  onRatingSelect={setSelectedRating}
  onClearFilters={handleClearFilters}
/>
```

## Benefits of Migration

1. **Modularity**: Each filter is a separate, reusable component
2. **Maintainability**: Easier to update individual filters
3. **Type Safety**: Can add PropTypes or TypeScript later
4. **React Integration**: Uses React state management and hooks
5. **Cleaner Code**: No DOM manipulation, declarative UI
6. **Testability**: Components can be unit tested

## Next Steps (Optional)

- Add PropTypes for type checking
- Add TypeScript definitions
- Create unit tests for each component
- Add loading states for filters
- Implement filter persistence in URL query params
- Add animation transitions for better UX
