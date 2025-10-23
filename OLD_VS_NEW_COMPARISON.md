# Old vs New Implementation Comparison

## Filter Components Architecture

### OLD Implementation (Vanilla JS)

```
catalog.html
├── Loads HTML via fetch()
│   ├── /components/brand-filter.html
│   ├── /components/rating-filter.html
│   └── /components/category-filter.html
│
└── catalog.js
    ├── includeBrandFilter() → fetch HTML
    ├── setupBrandFilter() → add event listeners
    ├── includeRatingFilter() → fetch HTML
    ├── setupRatingFilter() → add event listeners
    ├── includeCategoryFilter() → fetch HTML
    └── setupCategoryFilter() → add event listeners
```

### NEW Implementation (React)

```
Catalog.jsx
└── <FilterSidebar />
    ├── <CategoryHamburger />
    ├── <BrandHamburger />
    └── <RatingHamburger />
```

---

## Code Comparison

### Brand Filter

#### OLD (brand-filter.js)

```javascript
export function setupBrandFilter(brands, onSelect, onClear) {
  const aside = document.querySelector("#brand-filter-placeholder");
  if (!aside) return;
  const brandsList = aside.querySelector(".brands-list");
  const clearBtn = aside.querySelector("#clear-brand-filter");
  const hamburger = aside.querySelector("#brand-filter-hamburger");
  const collapsible = aside.querySelector("#brand-filter-collapsible");

  // Rellenar marcas dinámicamente
  brandsList.innerHTML = "";
  brands.forEach((brand) => {
    const btn = document.createElement("button");
    btn.className = "tile-btn brand-btn";
    btn.textContent = brand;
    btn.setAttribute("data-brand", brand);
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("aria-pressed", "false");
    brandsList.appendChild(btn);
  });

  const brandBtns = brandsList.querySelectorAll(".brand-btn");

  // Hamburguesa: mostrar/ocultar menú
  if (hamburger && collapsible) {
    hamburger.addEventListener("click", () => {
      const isOpen = collapsible.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  brandBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      brandBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      onSelect(btn.dataset.brand);
    });
  });
}
```

#### NEW (BrandHamburger.jsx)

```jsx
import React, { useState } from "react";

export default function BrandHamburger({ brands, selected, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="hamburger-filter">
      <button
        className="tiles-hamburger"
        aria-label="Mostrar/Ocultar marcas"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="hamburger-title">Marca</span>
      </button>
      <div className={`tiles-collapsible${open ? " open" : ""}`}>
        <nav className="brands-list" role="list">
          {brands.map((brand) => (
            <button
              key={brand}
              className={`tile-btn brand-btn${
                selected === brand ? " selected" : ""
              }`}
              data-brand={brand}
              aria-pressed={selected === brand}
              onClick={() => onSelect(brand)}
            >
              {brand}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
```

---

### Rating Filter

#### OLD (rating-filter.js)

```javascript
export function setupRatingFilter(onSelect, onClear) {
  const aside = document.querySelector("#rating-filter-placeholder");
  if (!aside) return;
  const ratingsList = aside.querySelector(".ratings-list");

  // Rellenar ratings dinámicamente (0 a 5 estrellas)
  ratingsList.innerHTML = "";
  for (let i = 0; i <= 5; i++) {
    const btn = document.createElement("button");
    btn.className = "tile-btn rating-btn";
    btn.innerHTML = `${"★".repeat(i)}${"☆".repeat(5 - i)}`;
    btn.setAttribute("data-rating", i);
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("aria-pressed", "false");
    ratingsList.appendChild(btn);
  }

  const ratingBtns = ratingsList.querySelectorAll(".rating-btn");
  ratingBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      ratingBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      onSelect(Number(btn.dataset.rating));
    });
  });
}
```

#### NEW (RatingHamburger.jsx)

```jsx
import React, { useState } from "react";

export default function RatingHamburger({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ratings = [0, 1, 2, 3, 4, 5];

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="hamburger-filter">
      <button
        className="tiles-hamburger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="hamburger-title">Rating</span>
      </button>
      <div className={`tiles-collapsible${open ? " open" : ""}`}>
        <nav className="ratings-list" role="list">
          {ratings.map((rating) => (
            <button
              key={rating}
              className={`tile-btn rating-btn${
                selected === rating ? " selected" : ""
              }`}
              aria-pressed={selected === rating}
              onClick={() => onSelect(rating)}
            >
              {renderStars(rating)}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
```

---

### Main Page Integration

#### OLD (catalog.html + catalog.js)

```html
<!-- catalog.html -->
<aside id="catalog-sidebar">
  <div id="category-filter-placeholder"></div>
  <div id="brand-filter-placeholder"></div>
  <div id="rating-filter-placeholder"></div>
</aside>
```

```javascript
// catalog.js initialization
async function initializePage() {
  // Load HTML components
  await Promise.all([
    includeCategoryFilter(),
    includeBrandFilter(),
    includeRatingFilter(),
  ]);

  // Fetch data
  const products = await loadProducts();
  const categories = await loadCategories();
  const brands = extractUniqueBrands(products);

  // Setup filters
  setupCategoryFilter(categories, handleCategorySelect, handleCategoryClear);
  setupBrandFilter(brands, handleBrandSelect, handleBrandClear);
  setupRatingFilter(handleRatingSelect, handleRatingClear);
}
```

#### NEW (Catalog.jsx)

```jsx
export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  const uniqueBrands = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.marca) set.add(p.marca.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [products]);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedRating(null);
  };

  return (
    <div>
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
    </div>
  );
}
```

---

## Key Differences

| Aspect                | OLD (Vanilla JS)             | NEW (React)                    |
| --------------------- | ---------------------------- | ------------------------------ |
| **Component Loading** | `fetch()` HTML files         | Import JSX components          |
| **State Management**  | Global variables             | React `useState`               |
| **UI Updates**        | `innerHTML`, `createElement` | JSX & Virtual DOM              |
| **Event Handlers**    | `addEventListener`           | React event props              |
| **Prop Passing**      | Function parameters          | Component props                |
| **Re-rendering**      | Manual DOM manipulation      | Automatic React re-renders     |
| **Component Reuse**   | Copy/paste functions         | Import/export components       |
| **Type Checking**     | None                         | Ready for PropTypes/TypeScript |
| **Testing**           | DOM testing                  | Component unit tests           |

---

## Benefits of React Approach

### 1. **Declarative vs Imperative**

- **OLD**: "Create button, add class, set attribute, append to parent"
- **NEW**: "Here's what the button should look like"

### 2. **Automatic Re-rendering**

- **OLD**: Manually update DOM when state changes
- **NEW**: React handles updates automatically

### 3. **Component Isolation**

- **OLD**: Functions rely on DOM structure
- **NEW**: Self-contained components with clear interfaces

### 4. **Better Performance**

- **OLD**: Direct DOM manipulation (slow)
- **NEW**: Virtual DOM diffing (fast)

### 5. **Easier Testing**

- **OLD**: Need to mock entire DOM structure
- **NEW**: Test components in isolation with simple props

### 6. **Developer Experience**

- **OLD**: Debug DOM state, event listeners
- **NEW**: Debug React state with DevTools

---

## Migration Effort

- **Files Created**: 4 new React components
- **Files Modified**: 2 (Catalog.jsx, CategoriesHamburger.jsx)
- **Lines of Code**: ~300 lines (React) vs ~200 lines (old JS)
- **But**: More readable, maintainable, and reusable

---

## Backward Compatibility

✅ All CSS classes preserved  
✅ All ARIA attributes maintained  
✅ All filter logic identical  
✅ All accessibility features kept  
✅ No breaking changes to user experience
