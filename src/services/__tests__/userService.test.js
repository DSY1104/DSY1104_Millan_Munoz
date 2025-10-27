/**
 * Tests for User Service
 */

import {
  getUserById,
  getUserByUsername,
  getUserByEmail,
  getAllUsers,
  authenticateUser,
  updateUserProfile,
  addUserPoints,
  redeemCoupon,
  getCurrentUser,
  saveCurrentUser,
  clearCurrentUser,
} from "../userService";

// Mock the users data
jest.mock("../../assets/data/users.json", () => [
  {
    id: 1,
    username: "johndoe",
    email: "john@example.com",
    password: "password123",
    personal: {
      firstName: "John",
      lastName: "Doe",
    },
    address: {
      street: "123 Main St",
      city: "Santiago",
    },
    preferences: {
      theme: "dark",
    },
    gaming: {
      favoriteGenre: "RPG",
    },
    stats: {
      points: 1500,
    },
    coupons: [
      {
        id: "coupon1",
        code: "SAVE10",
        discount: 10,
        isUsed: false,
      },
      {
        id: "coupon2",
        code: "SAVE20",
        discount: 20,
        isUsed: true,
      },
    ],
  },
  {
    id: 2,
    username: "janedoe",
    email: "jane@example.com",
    password: "pass456",
    personal: {
      firstName: "Jane",
      lastName: "Doe",
    },
    address: {
      street: "456 Oak Ave",
      city: "Valparaíso",
    },
    preferences: {
      theme: "light",
    },
    gaming: {
      favoriteGenre: "FPS",
    },
    stats: {
      points: 5000,
    },
    coupons: [],
  },
]);

describe("userService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("getUserById", () => {
    it("should return user by ID", async () => {
      const result = await getUserById(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.username).toBe("johndoe");
    });

    it("should return user by string ID", async () => {
      const result = await getUserById("2");

      expect(result).toBeDefined();
      expect(result.id).toBe(2);
      expect(result.username).toBe("janedoe");
    });

    it("should return null for non-existent user", async () => {
      const result = await getUserById(999);

      expect(result).toBeNull();
    });
  });

  describe("getUserByUsername", () => {
    it("should return user by username", async () => {
      const result = await getUserByUsername("johndoe");

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.username).toBe("johndoe");
    });

    it("should return null for non-existent username", async () => {
      const result = await getUserByUsername("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("getUserByEmail", () => {
    it("should return user by email", async () => {
      const result = await getUserByEmail("john@example.com");

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.email).toBe("john@example.com");
    });

    it("should return null for non-existent email", async () => {
      const result = await getUserByEmail("nonexistent@example.com");

      expect(result).toBeNull();
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const result = await getAllUsers();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });

  describe("authenticateUser", () => {
    it("should authenticate user with email and password", async () => {
      const result = await authenticateUser("john@example.com", "password123");

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.email).toBe("john@example.com");
      expect(result.password).toBeUndefined(); // Password should be removed
    });

    it("should authenticate user with username and password", async () => {
      const result = await authenticateUser("johndoe", "password123");

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.username).toBe("johndoe");
      expect(result.password).toBeUndefined();
    });

    it("should return null for wrong password", async () => {
      const result = await authenticateUser(
        "john@example.com",
        "wrongpassword"
      );

      expect(result).toBeNull();
    });

    it("should return null for non-existent user", async () => {
      const result = await authenticateUser(
        "nonexistent@example.com",
        "password"
      );

      expect(result).toBeNull();
    });
  });

  describe("updateUserProfile", () => {
    it("should update user personal info", async () => {
      const updates = {
        personal: { firstName: "Johnny", lastName: "Doe" },
      };

      const result = await updateUserProfile(1, updates);

      expect(result.personal.firstName).toBe("Johnny");
      expect(result.personal.lastName).toBe("Doe");
      expect(result.password).toBeUndefined();
    });

    it("should update user address", async () => {
      const updates = {
        address: { street: "789 New St", city: "Concepción" },
      };

      const result = await updateUserProfile(1, updates);

      expect(result.address.street).toBe("789 New St");
      expect(result.address.city).toBe("Concepción");
    });

    it("should update user preferences", async () => {
      const updates = {
        preferences: { theme: "light", notifications: true },
      };

      const result = await updateUserProfile(1, updates);

      expect(result.preferences.theme).toBe("light");
      expect(result.preferences.notifications).toBe(true);
    });

    it("should update multiple fields at once", async () => {
      const updates = {
        personal: { firstName: "Jonathan" },
        preferences: { theme: "auto" },
        stats: { points: 2000 },
      };

      const result = await updateUserProfile(1, updates);

      expect(result.personal.firstName).toBe("Jonathan");
      expect(result.preferences.theme).toBe("auto");
      expect(result.stats.points).toBe(2000);
    });

    it("should throw error for non-existent user", async () => {
      const updates = { personal: { firstName: "Test" } };

      await expect(updateUserProfile(999, updates)).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("addUserPoints", () => {
    it("should add points to user", async () => {
      const result = await addUserPoints(1, 500);

      expect(result.stats.points).toBe(2000); // 1500 + 500
    });

    it("should add zero points", async () => {
      const result = await addUserPoints(1, 0);

      expect(result.stats.points).toBe(1500); // No change
    });

    it("should throw error for non-existent user", async () => {
      await expect(addUserPoints(999, 500)).rejects.toThrow("User not found");
    });
  });

  describe("redeemCoupon", () => {
    it("should redeem unused coupon", async () => {
      const result = await redeemCoupon(1, "coupon1");

      expect(result.id).toBe("coupon1");
      expect(result.isUsed).toBe(true);
    });

    it("should throw error for already used coupon", async () => {
      await expect(redeemCoupon(1, "coupon2")).rejects.toThrow(
        "Coupon already used"
      );
    });

    it("should throw error for non-existent coupon", async () => {
      await expect(redeemCoupon(1, "nonexistent")).rejects.toThrow(
        "Coupon not found"
      );
    });

    it("should throw error for non-existent user", async () => {
      await expect(redeemCoupon(999, "coupon1")).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("getCurrentUser", () => {
    it("should return user from localStorage", () => {
      const mockUser = { id: 1, username: "johndoe" };
      localStorage.setItem("currentUser", JSON.stringify(mockUser));

      const result = getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    it("should return null when no user in localStorage", () => {
      const result = getCurrentUser();

      expect(result).toBeNull();
    });

    it("should return null on JSON parse error", () => {
      localStorage.setItem("currentUser", "invalid-json");

      const result = getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe("saveCurrentUser", () => {
    it("should save user to localStorage", () => {
      const mockUser = { id: 1, username: "johndoe" };

      saveCurrentUser(mockUser);

      const stored = localStorage.getItem("currentUser");
      expect(JSON.parse(stored)).toEqual(mockUser);
    });

    it("should handle save errors gracefully", () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Create a spy that throws an error
      const setItemSpy = jest
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("Storage full");
        });

      // Should not throw
      expect(() => saveCurrentUser({ id: 1 })).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error saving user to localStorage:",
        expect.any(Error)
      );

      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("clearCurrentUser", () => {
    it("should remove user from localStorage", () => {
      localStorage.setItem("currentUser", JSON.stringify({ id: 1 }));

      clearCurrentUser();

      expect(localStorage.getItem("currentUser")).toBeNull();
    });

    it("should work even if no user was stored", () => {
      clearCurrentUser();

      expect(localStorage.getItem("currentUser")).toBeNull();
    });
  });
});
