# Quick Reference - Filter Components

## Component Props

### FilterSidebar

```jsx
<FilterSidebar
  categories={Array}        // [{id: string, nombre: string}]
  brands={Array}            // [string, string, ...]
  selectedCategory={string | null}
  selectedBrand={string | null}
  selectedRating={number | null}
  onCategorySelect={function}  // (categoryId: string) => void
  onBrandSelect={function}     // (brand: string) => void
  onRatingSelect={function}    // (rating: number) => void
  onClearFilters={function}    // () => void
/>
```

### BrandHamburger

```jsx
<BrandHamburger
  brands={Array}            // [string, string, ...]
  selected={string | null}
  onSelect={function}       // (brand: string) => void
/>
```

### RatingHamburger

```jsx
<RatingHamburger
  selected={number | null}
  onSelect={function}       // (rating: number) => void
/>
```

### CategoryHamburger

```jsx
<CategoryHamburger
  categories={Array}        // [{id: string, nombre: string}]
  selected={string | null}
  onSelect={function}       // (categoryId: string) => void
/>
```

## Import Statements

### Option 1: Individual imports

```jsx
import FilterSidebar from "/src/components/filters/FilterSidebar.jsx";
import BrandHamburger from "/src/components/filters/BrandHamburger.jsx";
import RatingHamburger from "/src/components/filters/RatingHamburger.jsx";
import CategoryHamburger from "/src/components/filters/CategoriesHamburger.jsx";
```

### Option 2: Barrel import

```jsx
import {
  FilterSidebar,
  BrandHamburger,
  RatingHamburger,
  CategoryHamburger,
} from "/src/components/filters";
```

## State Management Example

```jsx
import { useState, useMemo } from "react";

function MyPage() {
  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  // Compute unique brands
  const uniqueBrands = useMemo(() => {
    const brandSet = new Set();
    products.forEach((p) => {
      if (p.marca && p.marca.trim()) {
        brandSet.add(p.marca.trim());
      }
    });
    return Array.from(brandSet).sort((a, b) => a.localeCompare(b, "es"));
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categoriaId === selectedCategory);
    }

    if (selectedBrand) {
      filtered = filtered.filter((p) => p.marca === selectedBrand);
    }

    if (selectedRating !== null) {
      filtered = filtered.filter(
        (p) => p.rating >= selectedRating && p.rating < selectedRating + 1
      );
    }

    return filtered;
  }, [products, selectedCategory, selectedBrand, selectedRating]);

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedRating(null);
  };

  return (
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
  );
}
```

## CSS Classes Used

```css
/* Container */
.hamburger-filter {
}

/* Hamburger button */
.tiles-hamburger {
}
.hamburger-title {
}

/* Collapsible content */
.tiles-collapsible {
}
.tiles-collapsible.open {
}

/* Filter lists */
.categories-list {
}
.brands-list {
}
.ratings-list {
}

/* Filter buttons */
.tile-btn {
}
.category-btn {
}
.brand-btn {
}
.rating-btn {
}
.tile-btn.selected {
} /* Optional: for visual feedback */
```

## Common Patterns

### Reset filters on data change

```jsx
useEffect(() => {
  setSelectedCategory(null);
  setSelectedBrand(null);
  setSelectedRating(null);
}, [products]); // Reset when products reload
```

### Reset pagination on filter change

```jsx
useEffect(() => {
  setCurrentPage(1);
}, [selectedCategory, selectedBrand, selectedRating]);
```

### URL persistence (optional)

```jsx
// Save to URL
useEffect(() => {
  const params = new URLSearchParams();
  if (selectedCategory) params.set("cat", selectedCategory);
  if (selectedBrand) params.set("brand", selectedBrand);
  if (selectedRating !== null) params.set("rating", selectedRating);
  window.history.replaceState({}, "", `?${params.toString()}`);
}, [selectedCategory, selectedBrand, selectedRating]);

// Restore from URL on mount
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("cat")) setSelectedCategory(params.get("cat"));
  if (params.has("brand")) setSelectedBrand(params.get("brand"));
  if (params.has("rating")) setSelectedRating(Number(params.get("rating")));
}, []);
```

## Keyboard Navigation

All filter components support:

- **Tab**: Navigate between filters
- **Enter/Space**: Select filter option
- **Escape**: Close hamburger menu (brand/rating)

## Accessibility Features

- `aria-expanded`: Indicates hamburger menu state
- `aria-pressed`: Indicates selected filter button
- `aria-label`: Descriptive labels for screen readers
- `aria-controls`: Links button to collapsible content
- `role="list"`: Semantic meaning for filter lists
- `tabindex="0"`: Makes buttons keyboard accessible

## Troubleshooting

### Filters not working

✅ Check that props are passed correctly  
✅ Verify state is updating (React DevTools)  
✅ Check filter logic in `filteredProducts` useMemo

### Brands list empty

✅ Ensure products have `marca` property  
✅ Check `uniqueBrands` computation  
✅ Verify products are loaded before rendering

### Categories not showing

✅ Check categories data structure: `[{id, nombre}]`  
✅ Verify getAllCategories() is working  
✅ Check that categories state is set

### Styling issues

✅ Import the correct CSS file  
✅ Check that CSS classes match  
✅ Verify `.open` class is toggling

## Next Steps

1. ✅ Test each filter individually
2. ✅ Test filter combinations
3. ✅ Test keyboard navigation
4. ✅ Test with screen reader
5. ✅ Add PropTypes or TypeScript
6. ✅ Write unit tests
7. ✅ Add loading states
8. ✅ Optimize performance if needed
