/**
 * Example: How to integrate catalogLoader with React Router
 *
 * This file demonstrates how to use the catalogLoader in your router configuration.
 */

import { createBrowserRouter, useLoaderData, Link } from "react-router-dom";
import {
  catalogLoader,
  productDetailLoader,
  categoryProductsLoader,
  catalogWithFiltersLoader,
  searchResultsLoader,
} from "./loaders/catalogLoader";

// ============================================
// Example 1: Basic catalog route
// ============================================
const routerExample1 = createBrowserRouter([
  {
    path: "/catalog",
    element: <CatalogPage />,
    loader: catalogLoader, // Pre-loads all products
  },
]);

function CatalogPage() {
  const products = useLoaderData();

  return (
    <div>
      <h1>Catálogo de Productos</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.code} className="product-card">
            <img src={product.imagen} alt={product.nombre} />
            <h3>{product.nombre}</h3>
            <p>${product.precioCLP.toLocaleString("es-CL")}</p>
            <p>⭐ {product.rating}</p>
            <Link to={`/products/${product.code}`}>Ver detalles</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Example 2: Product detail route
// ============================================
const routerExample2 = createBrowserRouter([
  {
    path: "/products/:productCode",
    element: <ProductDetailPage />,
    loader: productDetailLoader, // Pre-loads specific product
  },
]);

function ProductDetailPage() {
  const product = useLoaderData();

  return (
    <div className="product-detail">
      <div className="product-images">
        <img src={product.imagen} alt={product.nombre} />
      </div>

      <div className="product-info">
        <h1>{product.nombre}</h1>
        <p className="product-code">Código: {product.code}</p>

        <div className="product-price">
          <h2>${product.precioCLP.toLocaleString("es-CL")}</h2>
        </div>

        <div className="product-rating">⭐ {product.rating} / 5.0</div>

        <div className="product-stock">
          {product.stock > 0 ? (
            <span className="in-stock">
              ✓ En stock ({product.stock} disponibles)
            </span>
          ) : (
            <span className="out-of-stock">Sin stock</span>
          )}
        </div>

        <div className="product-brand">
          <strong>Marca:</strong> {product.marca}
        </div>

        <div className="product-specs">
          <h3>Especificaciones</h3>
          <ul>
            {product.specs?.map((spec, idx) => (
              <li key={idx}>{spec}</li>
            ))}
          </ul>
        </div>

        <div className="product-description">
          <h3>Descripción</h3>
          <p>{product.descripcion}</p>
        </div>

        <div className="product-tags">
          {product.tags?.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>

        <button className="add-to-cart">Agregar al carrito</button>
      </div>
    </div>
  );
}

// ============================================
// Example 3: Category products route
// ============================================
const routerExample3 = createBrowserRouter([
  {
    path: "/category/:categoryId",
    element: <CategoryPage />,
    loader: categoryProductsLoader, // Pre-loads products for category
  },
]);

function CategoryPage() {
  const products = useLoaderData();
  const { categoryId } = useParams();

  return (
    <div>
      <h1>Categoría: {categoryId}</h1>
      <p>Mostrando {products.length} productos</p>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.code} product={product} />
        ))}
      </div>
    </div>
  );
}

// ============================================
// Example 4: Catalog with filters (advanced)
// ============================================
const routerExample4 = createBrowserRouter([
  {
    path: "/shop",
    element: <ShopPage />,
    loader: catalogWithFiltersLoader, // Pre-loads products + brands
  },
]);

function ShopPage() {
  const { products, brands } = useLoaderData();
  const [filteredProducts, setFilteredProducts] = React.useState(products);
  const [selectedBrand, setSelectedBrand] = React.useState("");

  const handleBrandFilter = (brand) => {
    setSelectedBrand(brand);
    if (brand === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.marca === brand));
    }
  };

  return (
    <div className="shop-layout">
      <aside className="filters">
        <h2>Filtros</h2>

        <div className="filter-section">
          <h3>Marca</h3>
          <select
            value={selectedBrand}
            onChange={(e) => handleBrandFilter(e.target.value)}
          >
            <option value="">Todas las marcas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      </aside>

      <main className="products">
        <h1>Tienda</h1>
        <p>{filteredProducts.length} productos</p>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.code} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}

// ============================================
// Example 5: Search results route
// ============================================
const routerExample5 = createBrowserRouter([
  {
    path: "/search",
    element: <SearchPage />,
    loader: searchResultsLoader, // Reads ?q= from URL
  },
]);

function SearchPage() {
  const { products, query } = useLoaderData();
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    // Client-side filtering based on query
    if (query.trim()) {
      const filtered = products.filter(
        (p) =>
          p.nombre.toLowerCase().includes(query.toLowerCase()) ||
          p.code.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, products]);

  return (
    <div>
      <h1>Resultados de búsqueda</h1>
      {query && <p>Buscando: "{query}"</p>}

      {results.length > 0 ? (
        <>
          <p>Encontrados {results.length} resultados</p>
          <div className="product-grid">
            {results.map((product) => (
              <ProductCard key={product.code} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="no-results">
          <p>No se encontraron productos</p>
          {query && <p>Intenta con otros términos de búsqueda</p>}
        </div>
      )}
    </div>
  );
}

// ============================================
// Complete router configuration example
// ============================================
const completeRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "catalog",
        element: <CatalogPage />,
        loader: catalogLoader,
      },
      {
        path: "products/:productCode",
        element: <ProductDetailPage />,
        loader: productDetailLoader,
      },
      {
        path: "category/:categoryId",
        element: <CategoryPage />,
        loader: categoryProductsLoader,
      },
      {
        path: "shop",
        element: <ShopPage />,
        loader: catalogWithFiltersLoader,
      },
      {
        path: "search",
        element: <SearchPage />,
        loader: searchResultsLoader,
      },
    ],
  },
]);

// ============================================
// Reusable ProductCard component
// ============================================
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/products/${product.code}`}>
        <img src={product.imagen} alt={product.nombre} />
        <h3>{product.nombre}</h3>
        <p className="price">${product.precioCLP.toLocaleString("es-CL")}</p>
        <div className="rating">
          <span>⭐ {product.rating}</span>
          <span className="stock">
            {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
          </span>
        </div>
        {product.tags && (
          <div className="tags">
            {product.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </div>
  );
}

export default completeRouter;
