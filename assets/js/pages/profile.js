/**
 * Profile Page Manager
 * Handles user profile management including personal info, preferences, address, gaming profile, and security
 */

// Remove import statement for now to avoid module issues
// import { storage } from "../utils/storage.js";

// Simple storage utility for profile page
const profileStorage = {
  get: (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return localStorage.getItem(key);
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      localStorage.setItem(key, value);
    }
  },
  remove: (key) => localStorage.removeItem(key)
};

class ProfileManager {
  constructor() {
    this.currentTab = "personal";
    this.categories = [];
    this.userProfile = this.loadUserProfile();

    this.init();
  }

  async init() {
    await this.loadCategories();
    this.setupEventListeners();
    this.setupTabs();
    this.populateFavoriteCategories();
    this.loadProfileData();
    this.updateProfileHeader();
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Form submissions
    document.getElementById("personal-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.savePersonalInfo();
    });

    document
      .getElementById("preferences-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.savePreferences();
      });

    document.getElementById("address-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveAddress();
    });

    document.getElementById("gaming-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveGamingProfile();
    });

    // Security actions
    document
      .getElementById("change-password-btn")
      .addEventListener("click", () => {
        this.changePassword();
      });

    document
      .getElementById("delete-account-btn")
      .addEventListener("click", () => {
        this.showDeleteAccountModal();
      });

    document.getElementById("cancel-delete").addEventListener("click", () => {
      this.hideDeleteAccountModal();
    });

    document.getElementById("confirm-delete").addEventListener("click", () => {
      this.deleteAccount();
    });

    // Avatar change
    document
      .getElementById("change-avatar-btn")
      .addEventListener("click", () => {
        this.changeAvatar();
      });
  }

  setupTabs() {
    // Hide all tabs except first
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.classList.remove("active");
    });
    document.getElementById(`${this.currentTab}-tab`).classList.add("active");
  }

  switchTab(tabName) {
    if (!tabName) {
      console.error("No tab name provided");
      return;
    }

    // Update tab buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
      activeBtn.classList.add("active");
    } else {
      console.error("Tab button not found for:", tabName);
      return;
    }

    // Update tab content
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.classList.remove("active");
    });
    
    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
      activeTab.classList.add("active");
    } else {
      console.error("Tab content not found for:", `${tabName}-tab`);
      return;
    }

    this.currentTab = tabName;
  }

  async loadCategories() {
    try {
      const response = await fetch("../../assets/data/categories.json");
      this.categories = await response.json();
    } catch (error) {
      console.error("Error loading categories:", error);
      this.categories = [];
    }
  }

  populateFavoriteCategories() {
    const container = document.getElementById("favorite-categories");
    container.innerHTML = "";

    this.categories.forEach((category) => {
      const isChecked = this.userProfile.favoriteCategories?.includes(
        category.id
      )
        ? "checked"
        : "";

      const categoryElement = document.createElement("label");
      categoryElement.className = "checkbox-label";
      categoryElement.innerHTML = `
        <input type="checkbox" name="favoriteCategories" value="${category.id}" ${isChecked} />
        <span class="checkmark"></span>
        ${category.nombre}
      `;

      container.appendChild(categoryElement);
    });
  }

  loadUserProfile() {
    // Check for registration data first
    const registrationData = profileStorage.get("userRegistration");
    
    const defaultProfile = {
      firstName: "Alex",
      lastName: "Rodriguez", 
      email: "alex.rodriguez@levelup.cl",
      phone: "+56 9 1234 5678",
      birthdate: "1995-03-15",
      bio: "Apasionado gamer desde la infancia. Me encantan los RPGs y los juegos de estrategia. Siempre buscando nuevas aventuras virtuales y compartiendo experiencias con la comunidad gaming.",
      favoriteCategories: ["JM", "CO", "CG"],
      preferredPlatform: "pc",
      gamingHours: "16-30",
      notifyOffers: true,
      notifyNewProducts: true,
      notifyRestocks: false,
      notifyNewsletter: true,
      addressLine1: "Av. Providencia 1234",
      addressLine2: "Departamento 56",
      city: "Santiago",
      region: "metropolitan",
      postalCode: "7500000",
      country: "chile",
      deliveryNotes:
        "Portero disponible de 9:00 a 18:00. Favor tocar timbre del departamento.",
      gamerTag: "AlexGamer95",
      favoriteGenre: "rpg",
      skillLevel: "advanced",
      streamingPlatforms: ["twitch", "youtube"],
      favoriteGames: "The Witcher 3, Civilization VI, Stardew Valley, League of Legends, Minecraft",
      profilePublic: true,
      showActivity: true,
      allowFriendRequests: true,
      joinDate: "2022-08-15",
      totalPurchases: 24,
      wishlistItems: 8,
      reviewsCount: 15,
      level: "Pro Gamer",
      avatarFilter: "hue-rotate(120deg)",
      hasLifetimeDiscount: false,
      isDuocStudent: false
    };

    // If we have registration data, merge it with the default profile
    if (registrationData) {
      return {
        ...defaultProfile,
        firstName: registrationData.nombre || defaultProfile.firstName,
        lastName: registrationData.apellidos || defaultProfile.lastName,
        email: registrationData.email || defaultProfile.email,
        birthdate: registrationData.birthdate || defaultProfile.birthdate,
        hasLifetimeDiscount: registrationData.hasLifetimeDiscount || false,
        isDuocStudent: registrationData.isDuocStudent || false,
        registrationDate: registrationData.registrationDate,
        ...profileStorage.get("userProfile") // Any additional profile data
      };
    }

    // Otherwise return saved profile or default
    return profileStorage.get("userProfile") || defaultProfile;
  }

  saveUserProfile() {
    profileStorage.set("userProfile", this.userProfile);
    this.updateProfileHeader();
  }

  updateProfileHeader() {
    const displayName =
      this.userProfile.firstName && this.userProfile.lastName
        ? `${this.userProfile.firstName} ${this.userProfile.lastName}`
        : this.userProfile.gamerTag || "Usuario Gamer";

    document.getElementById("profile-display-name").textContent = displayName;
    document.getElementById(
      "profile-status"
    ).textContent = `Miembro desde ${new Date(
      this.userProfile.joinDate
    ).getFullYear()}`;
    document.getElementById("user-level").textContent = this.userProfile.level;
    document.getElementById("total-purchases").textContent =
      this.userProfile.totalPurchases;
    document.getElementById("wishlist-items").textContent =
      this.userProfile.wishlistItems;
    document.getElementById("reviews-count").textContent =
      this.userProfile.reviewsCount;

    // Apply saved avatar filter
    if (this.userProfile.avatarFilter) {
      document.getElementById("profile-avatar-img").style.filter =
        this.userProfile.avatarFilter;
    }
  }

  loadProfileData() {
    // Personal info
    document.getElementById("first-name").value =
      this.userProfile.firstName || "";
    document.getElementById("last-name").value =
      this.userProfile.lastName || "";
    document.getElementById("email").value = this.userProfile.email || "";
    document.getElementById("phone").value = this.userProfile.phone || "";
    document.getElementById("birthdate").value =
      this.userProfile.birthdate || "";
    document.getElementById("bio").value = this.userProfile.bio || "";

    // Show/hide DUOC discount badge
    const discountBadge = document.getElementById("duoc-discount-badge");
    if (discountBadge) {
      if (this.userProfile.hasLifetimeDiscount) {
        discountBadge.style.display = "block";
      } else {
        discountBadge.style.display = "none";
      }
    }

    // Preferences
    document.getElementById("preferred-platform").value =
      this.userProfile.preferredPlatform || "";
    document.getElementById("gaming-hours").value =
      this.userProfile.gamingHours || "";
    document.getElementById("notify-offers").checked =
      this.userProfile.notifyOffers;
    document.getElementById("notify-new-products").checked =
      this.userProfile.notifyNewProducts;
    document.getElementById("notify-restocks").checked =
      this.userProfile.notifyRestocks;
    document.getElementById("notify-newsletter").checked =
      this.userProfile.notifyNewsletter;

    // Address
    document.getElementById("address-line1").value =
      this.userProfile.addressLine1 || "";
    document.getElementById("address-line2").value =
      this.userProfile.addressLine2 || "";
    document.getElementById("city").value = this.userProfile.city || "";
    document.getElementById("region").value = this.userProfile.region || "";
    document.getElementById("postal-code").value =
      this.userProfile.postalCode || "";
    document.getElementById("country").value =
      this.userProfile.country || "chile";
    document.getElementById("delivery-notes").value =
      this.userProfile.deliveryNotes || "";

    // Gaming profile
    document.getElementById("gamer-tag").value =
      this.userProfile.gamerTag || "";
    document.getElementById("favorite-genre").value =
      this.userProfile.favoriteGenre || "";
    document.getElementById("skill-level").value =
      this.userProfile.skillLevel || "beginner";
    document.getElementById("favorite-games").value =
      this.userProfile.favoriteGames || "";

    // Security/Privacy
    document.getElementById("profile-public").checked =
      this.userProfile.profilePublic;
    document.getElementById("show-activity").checked =
      this.userProfile.showActivity;
    document.getElementById("allow-friend-requests").checked =
      this.userProfile.allowFriendRequests;

    // Streaming platforms
    if (this.userProfile.streamingPlatforms) {
      this.userProfile.streamingPlatforms.forEach((platform) => {
        const checkbox = document.querySelector(
          `input[name="streamingPlatforms"][value="${platform}"]`
        );
        if (checkbox) checkbox.checked = true;
      });
    }
  }

  savePersonalInfo() {
    const form = document.getElementById("personal-form");
    const formData = new FormData(form);

    this.userProfile.firstName = formData.get("firstName");
    this.userProfile.lastName = formData.get("lastName");
    this.userProfile.phone = formData.get("phone");
    this.userProfile.birthdate = formData.get("birthdate");
    this.userProfile.bio = formData.get("bio");

    this.saveUserProfile();
    this.showSuccessMessage(
      form,
      "Información personal guardada correctamente"
    );
  }

  savePreferences() {
    const form = document.getElementById("preferences-form");
    const formData = new FormData(form);

    // Get favorite categories
    const favoriteCategories = [];
    document
      .querySelectorAll('input[name="favoriteCategories"]:checked')
      .forEach((checkbox) => {
        favoriteCategories.push(checkbox.value);
      });

    this.userProfile.favoriteCategories = favoriteCategories;
    this.userProfile.preferredPlatform = formData.get("preferredPlatform");
    this.userProfile.gamingHours = formData.get("gamingHours");
    this.userProfile.notifyOffers = formData.has("notifyOffers");
    this.userProfile.notifyNewProducts = formData.has("notifyNewProducts");
    this.userProfile.notifyRestocks = formData.has("notifyRestocks");
    this.userProfile.notifyNewsletter = formData.has("notifyNewsletter");

    this.saveUserProfile();
    this.showSuccessMessage(form, "Preferencias guardadas correctamente");
  }

  saveAddress() {
    const form = document.getElementById("address-form");
    const formData = new FormData(form);

    this.userProfile.addressLine1 = formData.get("addressLine1");
    this.userProfile.addressLine2 = formData.get("addressLine2");
    this.userProfile.city = formData.get("city");
    this.userProfile.region = formData.get("region");
    this.userProfile.postalCode = formData.get("postalCode");
    this.userProfile.country = formData.get("country");
    this.userProfile.deliveryNotes = formData.get("deliveryNotes");

    this.saveUserProfile();
    this.showSuccessMessage(form, "Dirección guardada correctamente");
  }

  saveGamingProfile() {
    const form = document.getElementById("gaming-form");
    const formData = new FormData(form);

    // Get streaming platforms
    const streamingPlatforms = [];
    document
      .querySelectorAll('input[name="streamingPlatforms"]:checked')
      .forEach((checkbox) => {
        streamingPlatforms.push(checkbox.value);
      });

    this.userProfile.gamerTag = formData.get("gamerTag");
    this.userProfile.favoriteGenre = formData.get("favoriteGenre");
    this.userProfile.skillLevel = formData.get("skillLevel");
    this.userProfile.streamingPlatforms = streamingPlatforms;
    this.userProfile.favoriteGames = formData.get("favoriteGames");

    this.saveUserProfile();
    this.showSuccessMessage(form, "Perfil gamer guardado correctamente");
  }

  changePassword() {
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      this.showErrorMessage(
        document.getElementById("security-form"),
        "Todos los campos son obligatorios"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showErrorMessage(
        document.getElementById("security-form"),
        "Las contraseñas no coinciden"
      );
      return;
    }

    if (newPassword.length < 8) {
      this.showErrorMessage(
        document.getElementById("security-form"),
        "La contraseña debe tener al menos 8 caracteres"
      );
      return;
    }

    // Simulate password change
    document.getElementById("current-password").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("confirm-password").value = "";

    this.showSuccessMessage(
      document.getElementById("security-form"),
      "Contraseña cambiada correctamente"
    );
  }

  changeAvatar() {
    // Simulate avatar change with a color filter
    const avatarImg = document.getElementById("profile-avatar-img");
    const filters = [
      "none",
      "hue-rotate(60deg)",
      "hue-rotate(120deg)",
      "hue-rotate(180deg)",
      "hue-rotate(240deg)",
      "hue-rotate(300deg)",
    ];

    const currentFilter = avatarImg.style.filter || "none";
    const currentIndex = filters.indexOf(currentFilter);
    const nextIndex = (currentIndex + 1) % filters.length;

    avatarImg.style.filter = filters[nextIndex];

    // Save avatar preference
    this.userProfile.avatarFilter = filters[nextIndex];
    this.saveUserProfile();
  }

  showDeleteAccountModal() {
    document.getElementById("delete-account-modal").classList.add("active");
  }

  hideDeleteAccountModal() {
    document.getElementById("delete-account-modal").classList.remove("active");
  }

  deleteAccount() {
    // In a real app, this would make an API call
    profileStorage.remove("userProfile");
    profileStorage.remove("cart");
    profileStorage.remove("wishlist");

    alert("Cuenta eliminada. Serás redirigido a la página principal.");
    window.location.href = "../../index.html";
  }

  showSuccessMessage(form, message) {
    this.clearMessages(form);

    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.textContent = message;

    form.appendChild(successDiv);

    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }

  showErrorMessage(form, message) {
    this.clearMessages(form);

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    form.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  clearMessages(form) {
    const existingMessages = form.querySelectorAll(
      ".success-message, .error-message"
    );
    existingMessages.forEach((msg) => msg.remove());
  }
}

// Initialize when DOM is loaded and navbar is ready
document.addEventListener("DOMContentLoaded", () => {
  // Wait for navbar to load
  setTimeout(() => {
    new ProfileManager();
  }, 500);
});
