import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByCode } from "../services/catalogService";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../hooks/useUser";
import { useCart } from "../context/CartContext";
import "/src/styles/pages/product-detail.css";

// Reviews system hook
function useReviews(productCode) {
  const REVIEWS_KEY = "productReviews";

  const getProductReviews = (code) => {
    try {
      const allReviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || "{}");
      return allReviews[code] || [];
    } catch {
      return [];
    }
  };

  const addReview = (code, review) => {
    try {
      const allReviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || "{}");
      if (!allReviews[code]) {
        allReviews[code] = [];
      }

      const newReview = {
        id: Date.now().toString(),
        rating: parseInt(review.rating),
        comment: review.comment.trim(),
        userName: review.userName,
        userEmail: review.userEmail,
        date: new Date().toISOString(),
        verified: Math.random() > 0.5,
      };

      allReviews[code].unshift(newReview);
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));
      return true;
    } catch (error) {
      console.error("Error adding review:", error);
      return false;
    }
  };

  const getProductRatingStats = (code) => {
    const reviews = getProductReviews(code);

    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / total;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });

    return {
      average: Math.round(average * 10) / 10,
      total,
      distribution,
    };
  };

  const hasUserReviewed = (code, userEmail) => {
    const reviews = getProductReviews(code);
    return reviews.some((review) => review.userEmail === userEmail);
  };

  const generateMockReviews = (code, count = 5) => {
    const mockUsers = [
      { name: "Carlos M.", email: "carlos@example.com" },
      { name: "María G.", email: "maria@example.com" },
      { name: "Pedro L.", email: "pedro@example.com" },
      { name: "Ana R.", email: "ana@example.com" },
      { name: "Luis K.", email: "luis@example.com" },
    ];

    const mockComments = [
      "Excelente producto, muy buena calidad y llegó rápido.",
      "Cumple con las expectativas, recomendado.",
      "Buen producto, aunque podría mejorar algunos detalles.",
      "Muy satisfecho con la compra, volveré a comprar.",
      "Calidad precio muy buena, entrega rápida.",
    ];

    const allReviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || "{}");

    if (allReviews[code] && allReviews[code].length > 0) {
      return;
    }

    allReviews[code] = [];

    for (let i = 0; i < count; i++) {
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const comment =
        mockComments[Math.floor(Math.random() * mockComments.length)];
      const rating = Math.floor(Math.random() * 3) + 3;

      const mockReview = {
        id: (Date.now() - i * 1000).toString(),
        rating,
        comment,
        userName: user.name,
        userEmail: user.email,
        date: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        verified: Math.random() > 0.3,
      };

      allReviews[code].push(mockReview);
    }

    localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));
  };

  useEffect(() => {
    if (productCode) {
      generateMockReviews(productCode, 5);
    }
  }, [productCode]);

  return {
    getProductReviews,
    addReview,
    getProductRatingStats,
    hasUserReviewed,
  };
}

// Helper to render stars
function renderStars(rating) {
  const full = "★".repeat(Math.floor(rating));
  const empty = "☆".repeat(5 - Math.floor(rating));
  return `${full}${empty}`;
}

// Helper to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Hace 1 día";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;

  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productCode = id;

  console.log("ProductDetail loaded with ID:", id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [qtyError, setQtyError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const { isAuthenticated, openLoginModal } = useAuth();
  const { user } = useUser(); // Get full user data from UserContext
  const { addToCart } = useCart();
  const reviews = useReviews(productCode);

  // Load product
  useEffect(() => {
    const loadProduct = async () => {
      if (!productCode) {
        navigate("/products");
        return;
      }

      try {
        setLoading(true);
        const productData = await getProductByCode(productCode);
        if (!productData) {
          navigate("/products");
          return;
        }
        setProduct(productData);
      } catch (error) {
        console.error("Error loading product:", error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productCode, navigate]);

  // Quantity handlers
  const handleQuantityChange = (newQty) => {
    if (!product) return;

    let qty = parseInt(newQty);
    if (isNaN(qty) || qty < 1) {
      qty = 1;
    } else if (qty > product.stock) {
      qty = product.stock;
    }

    setQuantity(qty);

    if (qty > product.stock) {
      setQtyError(`No puedes añadir más de ${product.stock} unidades.`);
    } else if (qty < 1) {
      setQtyError("La cantidad debe ser al menos 1.");
    } else {
      setQtyError("");
    }
  };

  const handleAddToCart = () => {
    if (!product || quantity < 1 || quantity > product.stock) return;

    addToCart({
      id: product.code,
      name: product.nombre,
      price: product.precioCLP,
      qty: quantity,
      image: product.imagen,
      metadata: {
        marca: product.marca,
        categoriaId: product.categoriaId,
      },
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1200);
  };

  // Share handlers
  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.nombre,
          text: `Mira este producto: ${product.nombre}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    }
  };

  const getShareUrl = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Mira este producto: ${product?.nombre || ""}`
    );

    switch (platform) {
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      case "whatsapp":
        return `https://wa.me/?text=${text}%20${url}`;
      default:
        return "#";
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <main>
          <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
            Cargando producto...
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const agotado = product.stock === 0;

  return (
    <div>
      <div className="content-wrapper">
        <main>
          <section id="detalle-producto" className="section">
            <div id="product-detail-container">
              <ProductDetail
                product={product}
                agotado={agotado}
                quantity={quantity}
                qtyError={qtyError}
                addedToCart={addedToCart}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
                onShare={handleShare}
                getShareUrl={getShareUrl}
              />
            </div>
          </section>

          <ReviewsSection
            productCode={product.code}
            reviews={reviews}
            isAuthenticated={isAuthenticated}
            user={user}
            openLoginModal={openLoginModal}
          />
        </main>
      </div>
    </div>
  );
}

// Product Detail Component
function ProductDetail({
  product,
  agotado,
  quantity,
  qtyError,
  addedToCart,
  onQuantityChange,
  onAddToCart,
  onShare,
  getShareUrl,
}) {
  return (
    <div className="product-detail-card">
      <div className="product-detail-image" style={{ position: "relative" }}>
        <img
          src={product.imagen}
          alt={product.nombre}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/image/products/fallback.png";
          }}
        />
        {agotado && <span className="badge-agotado">Agotado</span>}
      </div>

      <div className="product-detail-info">
        <h2>{product.nombre}</h2>
        {product.marca && (
          <div className="product-detail-brand">{product.marca}</div>
        )}

        <div className="product-detail-meta">
          <span className="product-detail-price">
            ${product.precioCLP.toLocaleString("es-CL")}
          </span>
          <span
            className="product-detail-rating"
            dangerouslySetInnerHTML={{ __html: renderStars(product.rating) }}
          />
        </div>

        <p className="product-detail-description">{product.descripcion}</p>

        {product.specs && product.specs.length > 0 && (
          <ul className="product-detail-specs">
            {product.specs.map((spec, index) => (
              <li key={index}>{spec}</li>
            ))}
          </ul>
        )}

        <div
          className="quantity-selector"
          style={{
            margin: "1em 0",
            display: "flex",
            alignItems: "center",
            gap: "0.5em",
          }}
        >
          <button
            type="button"
            className="qty-btn"
            aria-label="Disminuir cantidad"
            disabled={agotado}
            onClick={() => onQuantityChange(quantity - 1)}
          >
            -
          </button>
          <input
            id="qty-input"
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            style={{ width: "3em", textAlign: "center" }}
            disabled={agotado}
          />
          <button
            type="button"
            className="qty-btn"
            aria-label="Aumentar cantidad"
            disabled={agotado}
            onClick={() => onQuantityChange(quantity + 1)}
          >
            +
          </button>
          <span style={{ fontSize: "0.9em", color: "#888" }}>
            (Stock: {product.stock})
          </span>
        </div>

        {qtyError && (
          <div
            style={{
              color: "#b22222",
              fontSize: "0.95em",
              minHeight: "1.2em",
            }}
          >
            {qtyError}
          </div>
        )}

        <button
          className={`add-to-cart${agotado ? " disabled" : ""}`}
          aria-label={`Agregar ${product.nombre} al carrito`}
          disabled={agotado || !!qtyError}
          onClick={onAddToCart}
        >
          {agotado
            ? "Sin stock"
            : addedToCart
            ? "¡Añadido!"
            : "Agregar al carrito"}
        </button>

        <div className="share-buttons" style={{ marginTop: "1.5em" }}>
          <span style={{ fontWeight: 500 }}>Cuéntale a tus amigos :)</span>
          {navigator.share && (
            <button
              type="button"
              className="web-share-btn"
              aria-label="Compartir producto"
              onClick={onShare}
              style={{
                marginLeft: "0.5em",
                fontSize: "1.5em",
                background: "none",
                border: "none",
                cursor: "pointer",
                verticalAlign: "middle",
              }}
            >
              🔗
            </button>
          )}
          <a
            href={getShareUrl("facebook")}
            className="share-fb"
            aria-label="Compartir en Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg"
              alt="Facebook"
              style={{ width: "1.5em", verticalAlign: "middle" }}
            />
          </a>
          <a
            href={getShareUrl("twitter")}
            className="share-x"
            aria-label="Compartir en X (Twitter)"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg"
              alt="X"
              style={{ width: "1.5em", verticalAlign: "middle" }}
            />
          </a>
          <a
            href={getShareUrl("whatsapp")}
            className="share-wa"
            aria-label="Compartir en WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg"
              alt="WhatsApp"
              style={{ width: "1.5em", verticalAlign: "middle" }}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

// Reviews Section Component
function ReviewsSection({
  productCode,
  reviews: reviewsHook,
  isAuthenticated,
  user,
  openLoginModal,
}) {
  const [reviewsList, setReviewsList] = useState([]);
  const [stats, setStats] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    if (productCode) {
      const reviews = reviewsHook.getProductReviews(productCode);
      const reviewStats = reviewsHook.getProductRatingStats(productCode);
      setReviewsList(reviews);
      setStats(reviewStats);

      if (user && user.email) {
        setHasReviewed(reviewsHook.hasUserReviewed(productCode, user.email));
      }
    }
  }, [productCode, reviewsHook, user]);

  return (
    <section id="reviews-section" className="section">
      <div id="reviews-container">
        <div className="reviews-header">
          <h2 className="reviews-title">Reseñas y Calificaciones</h2>
          {stats && (
            <div className="reviews-summary">
              <div className="reviews-average">
                <span className="reviews-average-number">{stats.average}</span>
                <span
                  className="reviews-stars"
                  dangerouslySetInnerHTML={{
                    __html: renderStars(stats.average),
                  }}
                />
              </div>
              <span className="reviews-count">({stats.total} reseñas)</span>
            </div>
          )}
        </div>

        <div className="reviews-content">
          <div className="reviews-list">
            {reviewsList.length === 0 ? (
              <div className="no-reviews">
                Aún no hay reseñas para este producto. ¡Sé el primero en
                reseñarlo!
              </div>
            ) : (
              reviewsList.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))
            )}
          </div>

          <ReviewForm
            productCode={productCode}
            isAuthenticated={isAuthenticated}
            user={user}
            hasReviewed={hasReviewed}
            openLoginModal={openLoginModal}
            reviewsHook={reviewsHook}
            onReviewAdded={() => {
              const reviews = reviewsHook.getProductReviews(productCode);
              const reviewStats =
                reviewsHook.getProductRatingStats(productCode);
              setReviewsList(reviews);
              setStats(reviewStats);
              setHasReviewed(true);
            }}
          />
        </div>
      </div>
    </section>
  );
}

// Review Item Component
function ReviewItem({ review }) {
  return (
    <div className="review-item">
      <div className="review-header">
        <div className="review-user">
          <div className="review-user-name">{review.userName}</div>
          <div className="review-date">{formatDate(review.date)}</div>
        </div>
        <div className="review-rating">
          <span
            className="review-stars"
            dangerouslySetInnerHTML={{ __html: renderStars(review.rating) }}
          />
          {review.verified && (
            <span className="review-verified">✓ Compra verificada</span>
          )}
        </div>
      </div>
      <p className="review-comment">{review.comment}</p>
    </div>
  );
}

// Review Form Component
function ReviewForm({
  productCode,
  isAuthenticated,
  user,
  hasReviewed,
  openLoginModal,
  reviewsHook,
  onReviewAdded,
}) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState({ rating: "", comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = { rating: "", comment: "" };
    let isValid = true;

    if (selectedRating === 0) {
      newErrors.rating = "Por favor selecciona una calificación";
      isValid = false;
    }

    if (comment.trim().length < 10) {
      newErrors.comment = "El comentario debe tener al menos 10 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const userName = user.email ? user.email.split("@")[0] : "Usuario";

    const review = {
      rating: selectedRating,
      comment: comment.trim(),
      userName: userName,
      userEmail: user.email,
    };

    const success = reviewsHook.addReview(productCode, review);

    if (success) {
      setTimeout(() => {
        onReviewAdded();
        setIsSubmitting(false);
      }, 1000);
    } else {
      alert("Error al publicar la reseña. Por favor intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="review-form-section">
        <h3 className="review-form-title">Escribir Reseña</h3>
        <div className="login-required">
          <div className="login-required-text">
            Inicia sesión para escribir una reseña
          </div>
          <button className="login-button" onClick={openLoginModal}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (hasReviewed) {
    return (
      <div className="review-form-section">
        <h3 className="review-form-title">Escribir Reseña</h3>
        <div className="already-reviewed">
          <div className="already-reviewed-icon">✓</div>
          <div>Ya has reseñado este producto</div>
        </div>
      </div>
    );
  }

  return (
    <div className="review-form-section">
      <h3 className="review-form-title">Escribir Reseña</h3>
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Calificación</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-input${
                  star <= (hoverRating || selectedRating) ? " active" : ""
                }`}
                onClick={() => setSelectedRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </button>
            ))}
          </div>
          {errors.rating && <div className="form-error">{errors.rating}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="comment-input">
            Comentario
          </label>
          <textarea
            className="comment-input"
            id="comment-input"
            placeholder="Escribe tu reseña aquí... (máximo 300 caracteres)"
            maxLength="300"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div
            className={`character-count${
              comment.length > 250 ? " warning" : ""
            }${comment.length >= 300 ? " error" : ""}`}
          >
            {comment.length}/300
          </div>
          {errors.comment && <div className="form-error">{errors.comment}</div>}
        </div>

        <button
          type="submit"
          className="submit-review-btn"
          disabled={
            isSubmitting || !selectedRating || comment.trim().length < 10
          }
        >
          {isSubmitting ? "¡Reseña publicada!" : "Publicar Reseña"}
        </button>
      </form>
    </div>
  );
}
