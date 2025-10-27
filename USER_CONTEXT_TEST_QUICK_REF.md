# UserContext Testing - Quick Reference

## 🎯 Quick Stats

- **Coverage:** 100% statements, 90.9% branches, 100% functions, 100% lines
- **Tests:** 25 tests, all passing ✅
- **File:** `src/context/__tests__/UserContext.test.jsx`
- **Improvement:** +53% coverage (46.96% → 100%)

## 📦 Test Suite Structure

```javascript
UserContext
├── Initialization (5 tests)
├── Login and Logout (2 tests)
├── Update User (3 tests)
├── Update Personal Info (1 test)
├── Update Address (1 test)
├── Update Preferences (1 test)
├── Update Gaming (1 test)
├── Add Points (3 tests)
├── Event Listeners (3 tests)
├── Hook Error Handling (1 test)
├── Context Value (1 test)
└── Edge Cases (3 tests)
```

## 🔑 Key Functions Tested

| Function                  | Description                         | Tests |
| ------------------------- | ----------------------------------- | ----- |
| `login(userData)`         | Sets user and saves to localStorage | 3     |
| `logout()`                | Clears user and localStorage        | 2     |
| `updateUser(updates)`     | Async profile update                | 3     |
| `updatePersonal(data)`    | Updates personal info               | 1     |
| `updateAddress(data)`     | Updates address                     | 1     |
| `updatePreferences(data)` | Updates preferences                 | 1     |
| `updateGaming(data)`      | Updates gaming info                 | 1     |
| `addPoints(points)`       | Adds loyalty points                 | 3     |
| `useUser()`               | Hook to consume context             | 25    |
| `UserProvider`            | Context provider component          | 25    |

## 🧪 Testing Patterns

### Basic Hook Test

```javascript
const { result } = renderHook(() => useUser(), { wrapper });

await waitFor(() => {
  expect(result.current.loading).toBe(false);
});
```

### With Initial User

```javascript
const { result } = renderHook(() => useUser(), {
  wrapper: ({ children }) => (
    <UserProvider initialUser={mockUser}>{children}</UserProvider>
  ),
});
```

### Async Updates

```javascript
await act(async () => {
  await result.current.updateUser({ username: "test" });
});
```

### Event Testing

```javascript
act(() => {
  window.dispatchEvent(new Event("userLoggedIn"));
});

await waitFor(() => {
  expect(result.current.user).toEqual(newUser);
});
```

## 🎭 Mock Setup

```javascript
jest.mock("../../services/userService");

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  userService.getCurrentUser.mockReturnValue(null);
  userService.saveCurrentUser.mockImplementation(() => {});
  userService.clearCurrentUser.mockImplementation(() => {});
  userService.updateUserProfile.mockResolvedValue(mockUser);
});
```

## 🚀 Running Tests

```bash
# Run UserContext tests only
npm test -- UserContext.test.jsx

# With coverage
npm test -- UserContext.test.jsx --coverage

# Watch mode
npm test -- --watch UserContext.test.jsx
```

## ✅ What's Tested

### Initialization

- ✅ Loading state
- ✅ localStorage retrieval
- ✅ initialUser prop
- ✅ Priority: stored > initial
- ✅ No user scenario

### Authentication

- ✅ Login saves to localStorage
- ✅ Logout clears localStorage

### Updates

- ✅ Profile update success
- ✅ Personal/Address/Preferences/Gaming updates
- ✅ Error when no user
- ✅ Service error handling

### Points System

- ✅ Add positive points
- ✅ Add negative points
- ✅ No user scenario

### Events

- ✅ userLoggedIn listener
- ✅ userLoggedOut listener
- ✅ Cleanup on unmount

### Error Handling

- ✅ Hook outside provider
- ✅ Update without user
- ✅ Service failures

### Edge Cases

- ✅ Missing stats property
- ✅ Rapid updates
- ✅ Data persistence

## 📊 Coverage Improvement

```
Before:  46.96% → After: 100% (+53.04%)
         27.27%        90.9%  (+63.63%)
         26.66%        100%   (+73.34%)
         47.69%        100%   (+52.31%)
```

## 🎓 Best Practices

1. ✅ **Wrapper Pattern:** Consistent provider wrapping
2. ✅ **Mock Cleanup:** beforeEach clears all mocks
3. ✅ **Async Handling:** Proper act() and waitFor()
4. ✅ **Event Testing:** Window events with cleanup
5. ✅ **Error Scenarios:** User and service errors
6. ✅ **Edge Cases:** Unusual conditions tested
7. ✅ **API Validation:** Context structure verified

## 📝 Test Example

```javascript
it("should login a user", async () => {
  const { result } = renderHook(() => useUser(), { wrapper });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  act(() => {
    result.current.login(mockUser);
  });

  expect(result.current.user).toEqual(mockUser);
  expect(userService.saveCurrentUser).toHaveBeenCalledWith(mockUser);
});
```

## 🔗 Related Files

- `src/context/UserContext.jsx` - Implementation
- `src/services/userService.js` - Mocked dependency
- `src/context/__tests__/AuthContext.test.jsx` - Similar pattern
- `src/context/__tests__/CartContext.test.jsx` - Similar pattern

## 📈 Project Impact

- **Project Tests:** 367 → 392 (+25 tests)
- **UserContext:** 46.96% → 100% coverage
- **Status:** ✅ Production Ready
