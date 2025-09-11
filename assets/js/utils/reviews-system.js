/**
 * Reviews System Manager
 * Handles product reviews and ratings with localStorage persistence
 */

import { storage } from "./storage.js";

class ReviewsSystem {
  constructor() {
    this.reviewsKey = "productReviews";
  }

  /**
   * Get all reviews for a specific product
   * @param {string} productCode - Product code
   * @returns {Array} Array of reviews
   */
  getProductReviews(productCode) {
    const allReviews = storage.local.get(this.reviewsKey) || {};
    return allReviews[productCode] || [];
  }

  /**
   * Add a new review for a product
   * @param {string} productCode - Product code
   * @param {Object} review - Review object
   * @returns {boolean} Success status
   */
  addReview(productCode, review) {
    try {
      const allReviews = storage.local.get(this.reviewsKey) || {};
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
        verified: false // Could be true if user purchased the product
      };

      allReviews[productCode].unshift(newReview); // Add to beginning
      storage.local.set(this.reviewsKey, allReviews);
      return true;
    } catch (error) {
      console.error("Error adding review:", error);
      return false;
    }
  }

  /**
   * Calculate average rating for a product
   * @param {string} productCode - Product code
   * @returns {Object} Rating statistics
   */
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

    // Calculate rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });

    return {
      average: Math.round(average * 10) / 10, // Round to 1 decimal
      total,
      distribution
    };
  }

  /**
   * Check if user has already reviewed this product
   * @param {string} productCode - Product code
   * @param {string} userEmail - User email
   * @returns {boolean} Has reviewed
   */
  hasUserReviewed(productCode, userEmail) {
    const reviews = this.getProductReviews(productCode);
    return reviews.some(review => review.userEmail === userEmail);
  }

  /**
   * Generate mock reviews for testing
   * @param {string} productCode - Product code
   * @param {number} count - Number of mock reviews to generate
   */
  generateMockReviews(productCode, count = 5) {
    const mockUsers = [
      { name: "Carlos M.", email: "carlos@example.com" },
      { name: "María G.", email: "maria@example.com" },
      { name: "Pedro L.", email: "pedro@example.com" },
      { name: "Ana R.", email: "ana@example.com" },
      { name: "Luis K.", email: "luis@example.com" },
      { name: "Sofia P.", email: "sofia@example.com" },
      { name: "Diego T.", email: "diego@example.com" },
      { name: "Carmen V.", email: "carmen@example.com" }
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

    const allReviews = storage.local.get(this.reviewsKey) || {};
    
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
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within 30 days
        verified: Math.random() > 0.3 // 70% verified purchases
      };

      allReviews[productCode].push(mockReview);
    }

    storage.local.set(this.reviewsKey, allReviews);
  }
}

// Create singleton instance
const reviewsSystem = new ReviewsSystem();

// Export both class and instance
export { ReviewsSystem, reviewsSystem };
