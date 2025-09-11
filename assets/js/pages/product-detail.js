import { renderStars } from "../components/product-card.js";
import { cart } from "./cart.js";

// Simple reviews system implementation for product detail
class ProductReviewsSystem {
  constructor() {
    this.reviewsKey = "productReviews";
  }

  getProductReviews(productCode) {
    try {
      const allReviews = JSON.parse(localStorage.getItem(this.reviewsKey) || '{}');
      return allReviews[productCode] || [];
    } catch {
      return [];
    }
  }

  addReview(productCode, review) {
    try {
      const allReviews = JSON.parse(localStorage.getItem(this.reviewsKey) || '{}');
      if (!allReviews[productCode]) {
        allReviews[productCode] = [];
      }

      const newReview = {
        id: Date.now().toString(),
        rating: parseInt(review.rating),
        comment: review.comment.trim(),
        userName: review.userName,
        userEmail: review.userEmail,
        date: new Date().toISOString(),
        verified: Math.random() > 0.5 // Random verification for demo
      };

      allReviews[productCode].unshift(newReview);
      localStorage.setItem(this.reviewsKey, JSON.stringify(allReviews));
      return true;
    } catch (error) {
      console.error("Error adding review:", error);
      return false;
    }
  }

  getProductRatingStats(productCode) {
    const reviews = this.getProductReviews(productCode);
    
    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / total;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });

    return {
      average: Math.round(average * 10) / 10,
      total,
      distribution
    };
  }

  hasUserReviewed(productCode, userEmail) {
    const reviews = this.getProductReviews(productCode);
    return reviews.some(review => review.userEmail === userEmail);
  }

  generateMockReviews(productCode, count = 5) {
    const mockUsers = [
      { name: "Carlos M.", email: "carlos@example.com" },
      { name: "María G.", email: "maria@example.com" },
      { name: "Pedro L.", email: "pedro@example.com" },
      { name: "Ana R.", email: "ana@example.com" },
      { name: "Luis K.", email: "luis@example.com" },
      { name: "Sofia P.", email: "sofia@example.com" },
      { name: "Diego T.", email: "diego@example.com" }
    ];

    const mockComments = [
      "Excelente producto, muy buena calidad y llegó rápido.",
      "Cumple con las expectativas, recomendado.",
      "Buen producto, aunque podría mejorar algunos detalles.",
      "Muy satisfecho con la compra, volveré a comprar.",
      "Calidad precio muy buena, entrega rápida.",
      "Producto tal como se describe, muy contento.",
      "Buena experiencia de compra, producto como esperaba.",
      "Recomendable, buen servicio y producto de calidad.",
      "Muy bueno, superó mis expectativas.",
      "Producto correcto, sin problemas."
    ];

    const allReviews = JSON.parse(localStorage.getItem(this.reviewsKey) || '{}');
    
    // Don't generate if reviews already exist
    if (allReviews[productCode] && allReviews[productCode].length > 0) {
      return;
    }

    allReviews[productCode] = [];

    for (let i = 0; i < count; i++) {
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const comment = mockComments[Math.floor(Math.random() * mockComments.length)];
      const rating = Math.floor(Math.random() * 3) + 3; // Ratings between 3-5 for realism
      
      const mockReview = {
        id: (Date.now() - i * 1000).toString(),
        rating,
        comment,
        userName: user.name,
        userEmail: user.email,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        verified: Math.random() > 0.3 // 70% verified purchases
      };

      allReviews[productCode].push(mockReview);
    }

    localStorage.setItem(this.reviewsKey, JSON.stringify(allReviews));
  }
}

// Create instance
const reviewsSystem = new ProductReviewsSystem();

// Obtener el código del producto desde la URL
function getProductCodeFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

// Helper function to render stars for reviews
function renderReviewStars(rating) {
  const full = "★".repeat(Math.floor(rating));
  const empty = "☆".repeat(5 - Math.floor(rating));
  return `${full}${empty}`;
}

// Renderizar el detalle del producto
function renderProductDetail(product) {
  const container = document.getElementById("product-detail-container");
  if (!product) {
    container.innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }
  const agotado = product.stock === 0;
  container.innerHTML = `
    <div class="product-detail-card">
      <div class="product-detail-image" style="position:relative;">
        <img src="../../${product.imagen}" alt="${product.nombre}" />
        ${agotado ? '<span class="badge-agotado">Agotado</span>' : ""}
      </div>
      <div class="product-detail-info">
        <h2>${product.nombre}</h2>
        <div class="product-detail-brand">${product.marca || ""}</div>
        <div class="product-detail-meta">
          <span class="product-detail-price">$${product.precioCLP.toLocaleString(
            "es-CL"
          )}</span>
          <span class="product-detail-rating">${renderStars(
            product.rating
          )}</span>
        </div>
        <p class="product-detail-description">${product.descripcion}</p>
        <ul class="product-detail-specs">
          ${product.specs.map((spec) => `<li>${spec}</li>`).join("")}
        </ul>
        <div class="quantity-selector" style="margin: 1em 0; display: flex; align-items: center; gap: 0.5em;">
          <button type="button" class="qty-btn" id="qty-minus" aria-label="Disminuir cantidad" ${
            agotado ? "disabled" : ""
          }>-</button>
          <input type="number" id="qty-input" min="1" max="${
            product.stock
          }" value="1" style="width: 3em; text-align: center;" ${
    agotado ? "disabled" : ""
  } />
          <button type="button" class="qty-btn" id="qty-plus" aria-label="Aumentar cantidad" ${
            agotado ? "disabled" : ""
          }>+</button>
          <span style="font-size:0.9em; color:#888;">(Stock: ${
            product.stock
          })</span>
        </div>
        <div id="qty-error" style="color: #b22222; font-size: 0.95em; min-height: 1.2em;"></div>
        <button class="add-to-cart${
          agotado ? " disabled" : ""
        }" aria-label="Agregar ${product.nombre} al carrito" ${
    agotado ? "disabled" : ""
  }>${agotado ? "Sin stock" : "Añadir al carrito"}</button>
        <div class="share-buttons" style="margin-top:1.5em;">
          <span style="font-weight:500;">Cuéntale a tus amigos :)</span>
          <button type="button" class="web-share-btn" aria-label="Compartir producto" style="margin-left:0.5em; font-size:1.5em; background:none; border:none; cursor:pointer; vertical-align:middle;">🔗</button>
          <a href="#" class="share-fb" aria-label="Compartir en Facebook" target="_blank" rel="noopener">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg" alt="Facebook" style="width:1.5em;vertical-align:middle;" />
          </a>
          <a href="#" class="share-x" aria-label="Compartir en X (Twitter)" target="_blank" rel="noopener">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg" alt="X" style="width:1.5em;vertical-align:middle;" />
          </a>
          <a href="#" class="share-wa" aria-label="Compartir en WhatsApp" target="_blank" rel="noopener">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg" alt="WhatsApp" style="width:1.5em;vertical-align:middle;" />
          </a>
        </div>
      </div>
    </div>
  `;

  // Compartir producto (Web Share API o fallback)
  setTimeout(() => {
    const shareBtn = document.querySelector(".web-share-btn");
    const fbBtn = document.querySelector(".share-fb");
    const xBtn = document.querySelector(".share-x");
    const waBtn = document.querySelector(".share-wa");
    const url = window.location.href;
    const title = product?.nombre || document.title;
    const text = `Mira este producto: ${title}`;
    // Web Share API
    if (navigator.share) {
      shareBtn.style.display = "inline-block";
      shareBtn.addEventListener("click", () => {
        navigator.share({ title, text, url });
      });
    } else {
      shareBtn.style.display = "none";
    }
    // Fallback links
    fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    xBtn.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`;
    waBtn.href = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
  }, 0);

  if (!agotado) {
    const qtyInput = document.getElementById("qty-input");
    const minusBtn = document.getElementById("qty-minus");
    const plusBtn = document.getElementById("qty-plus");
    const addToCartBtn = container.querySelector(".add-to-cart");
    const errorDiv = document.getElementById("qty-error");

    function validateQty() {
      let val = parseInt(qtyInput.value, 10);
      if (isNaN(val) || val < 1) {
        qtyInput.value = 1;
        val = 1;
      } else if (val > product.stock) {
        qtyInput.value = product.stock;
        val = product.stock;
      }
      if (val > product.stock) {
        errorDiv.textContent = `No puedes añadir más de ${product.stock} unidades.`;
        addToCartBtn.disabled = true;
      } else if (val < 1) {
        errorDiv.textContent = "La cantidad debe ser al menos 1.";
        addToCartBtn.disabled = true;
      } else {
        errorDiv.textContent = "";
        addToCartBtn.disabled = false;
      }
      return val;
    }

    minusBtn.addEventListener("click", () => {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) - 1);
      validateQty();
    });
    plusBtn.addEventListener("click", () => {
      qtyInput.value = Math.min(
        product.stock,
        parseInt(qtyInput.value, 10) + 1
      );
      validateQty();
    });
    qtyInput.addEventListener("input", validateQty);

    addToCartBtn.addEventListener("click", () => {
      const qty = validateQty();
      if (qty < 1 || qty > product.stock) return;
      cart.add({
        id: product.code,
        name: product.nombre,
        price: product.precioCLP,
        qty: qty,
        image: product.imagen,
        metadata: {
          marca: product.marca,
          categoriaId: product.categoriaId,
        },
      });
      // Notificar a la UI del carrito para actualizar el contador
      document.dispatchEvent(
        new CustomEvent("cart:changed", { detail: cart.get() })
      );
      addToCartBtn.textContent = "¡Añadido!";
      addToCartBtn.disabled = true;
      setTimeout(() => {
        addToCartBtn.textContent = "Añadir al carrito";
        addToCartBtn.disabled = false;
      }, 1200);
    });
  }
}

// Check if user is logged in
function isUserLoggedIn() {
  try {
    const sessionData = document.cookie
      .split('; ')
      .find(row => row.startsWith('userSession='));
    
    if (sessionData) {
      const session = JSON.parse(decodeURIComponent(sessionData.split('=')[1]));
      return session && session.isAuthenticated;
    }
    return false;
  } catch {
    return false;
  }
}

// Get current user data
function getCurrentUser() {
  try {
    const sessionData = document.cookie
      .split('; ')
      .find(row => row.startsWith('userSession='));
    
    if (sessionData) {
      const session = JSON.parse(decodeURIComponent(sessionData.split('=')[1]));
      if (session && session.isAuthenticated) {
        // Try to get more user data from registration
        const userRegistration = JSON.parse(localStorage.getItem("userRegistration") || 'null');
        if (userRegistration && userRegistration.email === session.email) {
          return {
            email: session.email,
            name: `${userRegistration.firstName} ${userRegistration.lastName.charAt(0)}.`
          };
        }
        
        // Fallback to email only
        return {
          email: session.email,
          name: session.email.split('@')[0]
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "Hace 1 día";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Render reviews section
function renderReviews(productCode) {
  const container = document.getElementById("reviews-container");
  if (!container) return;

  // Generate mock reviews if none exist
  reviewsSystem.generateMockReviews(productCode, 5);
  
  const reviews = reviewsSystem.getProductReviews(productCode);
  const stats = reviewsSystem.getProductRatingStats(productCode);
  const isLoggedIn = isUserLoggedIn();
  const currentUser = getCurrentUser();
  const hasReviewed = currentUser ? reviewsSystem.hasUserReviewed(productCode, currentUser.email) : false;

  container.innerHTML = `
    <div class="reviews-header">
      <h2 class="reviews-title">Reseñas y Calificaciones</h2>
      <div class="reviews-summary">
        <div class="reviews-average">
          <span class="reviews-average-number">${stats.average}</span>
          <span class="reviews-stars">${renderReviewStars(stats.average)}</span>
        </div>
        <span class="reviews-count">(${stats.total} reseñas)</span>
      </div>
    </div>
    
    <div class="reviews-content">
      <div class="reviews-list">
        ${reviews.length === 0 ? 
          '<div class="no-reviews">Aún no hay reseñas para este producto. ¡Sé el primero en reseñarlo!</div>' :
          reviews.map(review => `
            <div class="review-item">
              <div class="review-header">
                <div class="review-user">
                  <div class="review-user-name">${review.userName}</div>
                  <div class="review-date">${formatDate(review.date)}</div>
                </div>
                <div class="review-rating">
                  <span class="review-stars">${renderReviewStars(review.rating)}</span>
                  ${review.verified ? '<span class="review-verified">✓ Compra verificada</span>' : ''}
                </div>
              </div>
              <p class="review-comment">${review.comment}</p>
            </div>
          `).join('')
        }
      </div>
      
      <div class="review-form-section">
        <h3 class="review-form-title">Escribir Reseña</h3>
        ${!isLoggedIn ? `
          <div class="login-required">
            <div class="login-required-text">Inicia sesión para escribir una reseña</div>
            <button class="login-button" onclick="openLoginModal()">Iniciar Sesión</button>
          </div>
        ` : hasReviewed ? `
          <div class="already-reviewed">
            <div class="already-reviewed-icon">✓</div>
            <div>Ya has reseñado este producto</div>
          </div>
        ` : `
          <form class="review-form" id="review-form">
            <div class="form-group">
              <label class="form-label">Calificación</label>
              <div class="rating-input" id="rating-input">
                ${[1,2,3,4,5].map(star => `
                  <button type="button" class="star-input" data-rating="${star}">★</button>
                `).join('')}
              </div>
              <div class="form-error" id="rating-error"></div>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="comment-input">Comentario</label>
              <textarea 
                class="comment-input" 
                id="comment-input" 
                placeholder="Escribe tu reseña aquí... (máximo 300 caracteres)"
                maxlength="300"
                required
              ></textarea>
              <div class="character-count" id="character-count">0/300</div>
              <div class="form-error" id="comment-error"></div>
            </div>
            
            <button type="submit" class="submit-review-btn" id="submit-review-btn" disabled>
              Publicar Reseña
            </button>
          </form>
        `}
      </div>
    </div>
  `;

  // Setup form functionality if user is logged in and hasn't reviewed
  if (isLoggedIn && !hasReviewed) {
    setupReviewForm(productCode, currentUser);
  }
}

// Setup review form functionality
function setupReviewForm(productCode, currentUser) {
  const form = document.getElementById("review-form");
  const ratingInput = document.getElementById("rating-input");
  const commentInput = document.getElementById("comment-input");
  const characterCount = document.getElementById("character-count");
  const submitBtn = document.getElementById("submit-review-btn");
  
  let selectedRating = 0;
  
  // Rating selection
  ratingInput.addEventListener("click", (e) => {
    if (e.target.classList.contains("star-input")) {
      selectedRating = parseInt(e.target.dataset.rating);
      updateStarDisplay();
      validateForm();
    }
  });
  
  // Star hover effects
  ratingInput.addEventListener("mouseover", (e) => {
    if (e.target.classList.contains("star-input")) {
      const hoverRating = parseInt(e.target.dataset.rating);
      updateStarDisplay(hoverRating);
    }
  });
  
  ratingInput.addEventListener("mouseleave", () => {
    updateStarDisplay();
  });
  
  function updateStarDisplay(hoverRating = null) {
    const stars = ratingInput.querySelectorAll(".star-input");
    const displayRating = hoverRating || selectedRating;
    
    stars.forEach((star, index) => {
      if (index < displayRating) {
        star.classList.add("active");
      } else {
        star.classList.remove("active");
      }
    });
  }
  
  // Comment input and character count
  commentInput.addEventListener("input", () => {
    const length = commentInput.value.length;
    characterCount.textContent = `${length}/300`;
    
    characterCount.classList.remove("warning", "error");
    if (length > 250) {
      characterCount.classList.add("warning");
    }
    if (length >= 300) {
      characterCount.classList.add("error");
    }
    
    validateForm();
  });
  
  function validateForm() {
    const ratingError = document.getElementById("rating-error");
    const commentError = document.getElementById("comment-error");
    let isValid = true;
    
    // Reset errors
    ratingError.textContent = "";
    commentError.textContent = "";
    
    // Validate rating
    if (selectedRating === 0) {
      ratingError.textContent = "Por favor selecciona una calificación";
      isValid = false;
    }
    
    // Validate comment
    const comment = commentInput.value.trim();
    if (comment.length < 10) {
      commentError.textContent = "El comentario debe tener al menos 10 caracteres";
      isValid = false;
    }
    
    submitBtn.disabled = !isValid;
  }
  
  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const comment = commentInput.value.trim();
    
    if (selectedRating === 0 || comment.length < 10) {
      validateForm();
      return;
    }
    
    const review = {
      rating: selectedRating,
      comment: comment,
      userName: currentUser.name,
      userEmail: currentUser.email
    };
    
    const success = reviewsSystem.addReview(productCode, review);
    
    if (success) {
      // Show success message
      submitBtn.textContent = "¡Reseña publicada!";
      submitBtn.disabled = true;
      
      // Reload reviews after a short delay
      setTimeout(() => {
        renderReviews(productCode);
      }, 1000);
    } else {
      alert("Error al publicar la reseña. Por favor intenta de nuevo.");
    }
  });
}

// Make openLoginModal globally available
window.openLoginModal = function() {
  if (window.LevelUpLogin) {
    window.LevelUpLogin.open();
  } else {
    alert("Sistema de login no disponible");
  }
}

// Cargar datos y renderizar
fetch("../../assets/data/products.json")
  .then((res) => res.json())
  .then((products) => {
    const code = getProductCodeFromURL();
    const product = products.find((p) => p.code === code);
    renderProductDetail(product);
    
    // Render reviews section
    if (product) {
      renderReviews(product.code);
    }
  });
