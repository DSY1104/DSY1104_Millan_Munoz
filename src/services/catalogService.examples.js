/**
 * Catalog Service Usage Examples
 *
 * This file demonstrates various ways to use the catalogService methods
 */
import React from "react";
import {
  getAllProducts,
  getProductByCode,
  getProductsByCategory,
  getProductsByBrand,
  getAllBrands,
  getProductCategories,
  searchProducts,
  getProductsByRating,
  getProductsByPriceRange,
  getProductsSortedByPrice,
  getProductsSortedByRating,
  getProductsInStock,
  getFeaturedProducts,
} from "../services/catalogService";

// ============================================
// Example 1: Get all products
// ============================================
export const fetchAllProducts = async () => {
  try {
    const products = await getAllProducts();
    console.log(`Loaded ${products.length} products`);
    return products;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// ============================================
// Example 2: Get a specific product by code
// ============================================
export const fetchProductDetails = async () => {
  try {
    const productCode = "JM001";
    const product = await getProductByCode(productCode);

    if (product) {
      console.log("Product found:", product.nombre);
      console.log("Price:", product.precioCLP.toLocaleString("es-CL"));
      console.log("Stock:", product.stock);
      console.log("Rating:", product.rating);
    } else {
      console.log("Product not found");
    }

    return product;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

// ============================================
// Example 3: Filter products by category
// ============================================
export const fetchProductsByCategory = async () => {
  try {
    const categoryId = "JM"; // Juegos de Mesa
    const products = await getProductsByCategory(categoryId);

    console.log(`Found ${products.length} products in category ${categoryId}`);
    products.forEach((p) =>
      console.log(`- ${p.nombre}: $${p.precioCLP.toLocaleString("es-CL")}`)
    );

    return products;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// ============================================
// Example 4: Get all unique brands
// ============================================
export const fetchAllBrands = async () => {
  try {
    const brands = await getAllBrands();
    console.log("Available brands:", brands);
    return brands;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// ============================================
// Example 5: Search products
// ============================================
export const searchForProducts = async (query) => {
  try {
    const results = await searchProducts(query);
    console.log(`Found ${results.length} products matching "${query}"`);
    return results;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// ============================================
// Example 6: Filter by price range
// ============================================
export const fetchAffordableProducts = async () => {
  try {
    const minPrice = 0;
    const maxPrice = 50000;
    const products = await getProductsByPriceRange(minPrice, maxPrice);

    console.log(
      `Found ${products.length} products under $${maxPrice.toLocaleString(
        "es-CL"
      )}`
    );
    return products;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// ============================================
// Example 7: Get high-rated products
// ============================================
export const fetchHighRatedProducts = async () => {
  try {
    const minRating = 4.5;
    const products = await getProductsByRating(minRating);

    console.log(`Found ${products.length} products with rating ${minRating}+`);
    return products;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// ============================================
// Example 8: Get featured products
// ============================================
export const fetchFeaturedProducts = async () => {
  try {
    const featured = await getFeaturedProducts(4.5, 5);
    console.log(
      "Top 5 featured products:",
      featured.map((p) => p.nombre)
    );
    return featured;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// ============================================
// Example 9: Category filter component
// ============================================
export const CategoryFilterExample = () => {
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    const loadCategories = async () => {
      const cats = await getProductCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);

    if (categoryId === "") {
      const allProducts = await getAllProducts();
      setProducts(allProducts);
    } else {
      const filtered = await getProductsByCategory(categoryId);
      setProducts(filtered);
    }
  };

  return (
    <div>
      <select
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.code}>
            <h3>{product.nombre}</h3>
            <p>${product.precioCLP.toLocaleString("es-CL")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// Example 10: Price range slider component
// ============================================
export const PriceRangeFilterExample = () => {
  const [minPrice, setMinPrice] = React.useState(0);
  const [maxPrice, setMaxPrice] = React.useState(1000000);
  const [products, setProducts] = React.useState([]);

  const handlePriceFilter = async () => {
    const filtered = await getProductsByPriceRange(minPrice, maxPrice);
    setProducts(filtered);
  };

  return (
    <div>
      <div>
        <label>Precio mínimo: ${minPrice.toLocaleString("es-CL")}</label>
        <input
          type="range"
          min="0"
          max="1000000"
          step="10000"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Precio máximo: ${maxPrice.toLocaleString("es-CL")}</label>
        <input
          type="range"
          min="0"
          max="1000000"
          step="10000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
      </div>

      <button onClick={handlePriceFilter}>Filtrar</button>

      <div>{products.length} productos encontrados</div>
    </div>
  );
};

// ============================================
// Example 11: Product sorting
// ============================================
export const ProductSortingExample = () => {
  const [products, setProducts] = React.useState([]);
  const [sortBy, setSortBy] = React.useState("price-asc");

  const handleSort = async (sortType) => {
    setSortBy(sortType);

    let sorted;
    switch (sortType) {
      case "price-asc":
        sorted = await getProductsSortedByPrice("asc");
        break;
      case "price-desc":
        sorted = await getProductsSortedByPrice("desc");
        break;
      case "rating-asc":
        sorted = await getProductsSortedByRating("asc");
        break;
      case "rating-desc":
        sorted = await getProductsSortedByRating("desc");
        break;
      default:
        sorted = await getAllProducts();
    }

    setProducts(sorted);
  };

  return (
    <div>
      <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
        <option value="price-asc">Precio: Menor a Mayor</option>
        <option value="price-desc">Precio: Mayor a Menor</option>
        <option value="rating-asc">Rating: Menor a Mayor</option>
        <option value="rating-desc">Rating: Mayor a Menor</option>
      </select>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.code}>
            <h3>{product.nombre}</h3>
            <p>${product.precioCLP.toLocaleString("es-CL")}</p>
            <p>⭐ {product.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// Example 12: Search with debounce
// ============================================
export const SearchWithDebounce = () => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (query.trim()) {
        const products = await searchProducts(query);
        setResults(products);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query]);

  return (
    <div>
      <input
        type="search"
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div>
        {results.length > 0 && <p>Encontrados {results.length} resultados</p>}
        {results.map((product) => (
          <div key={product.code}>
            <h4>{product.nombre}</h4>
            <p>{product.code}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default {
  fetchAllProducts,
  fetchProductDetails,
  fetchProductsByCategory,
  fetchAllBrands,
  searchForProducts,
  fetchAffordableProducts,
  fetchHighRatedProducts,
  fetchFeaturedProducts,
};
