# Services Test Quick Reference

## 📊 Quick Stats

- **Overall Coverage**: 55.75% (+137% from 23.45%)
- **Test Suites**: 6 passing
- **Total Tests**: 88 passing
- **New Tests Added**: 66 tests (levelService: 35, userService: 31)

---

## 🎯 High-Performing Services

### userService.js - 100% ✅

```javascript
// Test file: src/services/__tests__/userService.test.js
// Tests: 31 | All functions covered
```

**Functions Tested**:

- getUserById, getUserByUsername, getUserByEmail
- getAllUsers, authenticateUser
- updateUserProfile, addUserPoints, redeemCoupon
- getCurrentUser, saveCurrentUser, clearCurrentUser

### levelService.js - 96.25% ⭐

```javascript
// Test file: src/services/__tests__/levelService.test.js
// Tests: 35 | All functions covered
```

**Functions Tested**:

- getLevelsData, getAllLevels
- getLevelByName, getLevelByPoints
- getPointsRules, calculatePointsForPurchase
- getPointsToNextLevel, getLevelNames

---

## 🔧 Common Test Patterns

### Basic Service Test

```javascript
import { functionName } from "../serviceName";

describe("serviceName", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("functionName", () => {
    it("should return expected result", async () => {
      const result = await functionName(param);
      expect(result).toBeDefined();
      expect(result.property).toBe(expectedValue);
    });

    it("should handle errors", async () => {
      await expect(functionName(invalidParam)).rejects.toThrow("Error message");
    });
  });
});
```

### Mocking JSON Data

```javascript
jest.mock("../../assets/data/dataFile.json", () => [
  { id: 1, name: "Test Item" },
  { id: 2, name: "Another Item" },
]);
```

### Mocking API Calls

```javascript
jest.mock("../api", () => ({
  fetchAPI: jest.fn(),
}));

// In test
const { fetchAPI } = require("../api");
fetchAPI.mockResolvedValue({ data: "test" });
```

### Testing LocalStorage

```javascript
// Save operation
it("should save to localStorage", () => {
  saveFunction({ id: 1, data: "test" });
  expect(localStorage.setItem).toHaveBeenCalledWith(
    "key",
    JSON.stringify({ id: 1, data: "test" })
  );
});

// Retrieve operation
it("should get from localStorage", () => {
  localStorage.getItem.mockReturnValue(JSON.stringify({ id: 1 }));
  const result = getFunction();
  expect(result.id).toBe(1);
});

// Error handling
it("should handle storage errors", () => {
  const spy = jest
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new Error("Storage full");
    });

  expect(() => saveFunction({ data: "test" })).not.toThrow();
  spy.mockRestore();
});
```

### Testing Async Functions

```javascript
// ✅ Correct way
it("should handle async operation", async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});

// ❌ Don't use fake timers with real async
it("should NOT do this", async () => {
  jest.useFakeTimers(); // Causes timeouts!
  const promise = asyncFunction();
  jest.advanceTimersByTime(300); // Doesn't work
  const result = await promise;
});
```

---

## 🧪 Running Tests

### All Services

```bash
npm test -- src/services/__tests__/
```

### With Coverage

```bash
npm test -- src/services/__tests__/ --coverage
```

### Specific Service

```bash
npm test -- src/services/__tests__/userService.test.js
npm test -- src/services/__tests__/levelService.test.js
```

### Watch Mode

```bash
npm test -- src/services/__tests__/ --watch
```

### Coverage Report Location

```bash
coverage/services/lcov-report/index.html
```

---

## ⚠️ Common Issues & Solutions

### Issue: "Exceeded timeout of 5000 ms"

```javascript
// ❌ Problem
jest.useFakeTimers();
const promise = asyncFunction();
jest.advanceTimersByTime(500);
await promise; // TIMEOUT!

// ✅ Solution
// Remove fake timers, use direct await
const result = await asyncFunction();
```

### Issue: "Cannot use 'import.meta' outside a module"

```javascript
// ❌ Problem
const API_BASE_URL = import.meta.env.VITE_API_URL;

// ✅ Solution
// Mock the entire module or test indirectly
jest.mock("../api");
```

### Issue: "mockImplementation is not a function"

```javascript
// ❌ Problem
localStorage.setItem.mockImplementation(() => {});

// ✅ Solution
const spy = jest
  .spyOn(Storage.prototype, "setItem")
  .mockImplementation(() => {});
```

---

## 📊 Coverage Targets

| Service            | Current | Target | Priority    |
| ------------------ | ------- | ------ | ----------- |
| userService.js     | 100%    | 100%   | ✅ Done     |
| levelService.js    | 96.25%  | 96%+   | ✅ Done     |
| eventService.js    | 54.54%  | 80%    | 🟡 Medium   |
| blogService.js     | 36.48%  | 80%    | 🔴 High     |
| catalogService.js  | 37.93%  | 80%    | 🔴 High     |
| categoryService.js | 29.31%  | 80%    | 🔴 High     |
| productService.js  | 0%      | 100%   | 🔴 Critical |
| api.js             | 0%      | N/A    | ⚠️ Skip     |

---

## 🎯 Next Test File to Create

### productService.test.js (Priority: Critical)

**Estimated**: ~25 tests, 100% coverage target

```javascript
// Template
import {
  getProductById,
  getAllProducts,
  // ... other functions
} from "../productService";

jest.mock("../../assets/data/products.json", () => [
  { id: 1, name: "Product 1", price: 100 },
  // ... mock data
]);

describe("productService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProductById", () => {
    it("should return product by ID", async () => {
      const result = await getProductById(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it("should return null for non-existent product", async () => {
      const result = await getProductById(999);
      expect(result).toBeNull();
    });
  });

  // ... more tests
});
```

---

## 📁 Test File Structure

```
src/services/__tests__/
├── blogService.test.js         # ✅ Existing
├── catalogService.test.js      # ✅ Existing
├── categoryService.test.js     # ✅ Existing
├── eventService.test.js        # ✅ Existing
├── levelService.test.js        # ✅ New - 35 tests
├── userService.test.js         # ✅ New - 31 tests
└── productService.test.js      # ❌ TODO - Priority
```

---

## 💡 Tips

1. **Always mock external dependencies** (API calls, JSON imports)
2. **Test error paths**, not just happy paths
3. **Use descriptive test names** that explain the scenario
4. **Group related tests** in describe blocks
5. **Clean up after tests** with `beforeEach` and `afterEach`
6. **Avoid fake timers** with real async operations
7. **Test edge cases** (null, undefined, empty arrays, etc.)
8. **Mock at the right level** (Storage.prototype for localStorage)

---

## 🔗 Related Documentation

- [SERVICES_TEST_COVERAGE.md](./SERVICES_TEST_COVERAGE.md) - Detailed coverage report
- [LOADERS_TEST_COVERAGE.md](./LOADERS_TEST_COVERAGE.md) - Loaders test report
- [TESTING.md](./TESTING.md) - General testing guide

---

**Last Updated**: Services phase completion
**Status**: 88/88 tests passing ✅
