# Loaders Test Quick Reference

## File Structure

```
src/loaders/
├── __tests__/
│   ├── blogLoader.test.js          (11 tests) ✓
│   ├── blogPostLoader.test.js      (9 tests)  ✓
│   ├── catalogLoader.test.js       (15 tests) ✓
│   ├── categoryLoader.test.js      (10 tests) ✓
│   ├── eventLoader.test.js         (8 tests)  ✓
│   ├── levelLoader.test.js         (17 tests) ✓
│   └── userLoader.test.js          (13 tests) ✓
├── blogLoader.js                   100% coverage
├── blogPostLoader.js               100% coverage
├── catalogLoader.js                100% coverage
├── categoryLoader.js               100% coverage
├── eventLoader.js                  100% coverage
├── levelLoader.js                  100% coverage
└── userLoader.js                   100% coverage
```

## Test Commands

### Run all loader tests

```bash
npm test -- src/loaders/__tests__/
```

### Run with coverage

```bash
npm test -- src/loaders/__tests__/ --coverage
```

### Run specific file

```bash
npm test -- src/loaders/__tests__/blogLoader.test.js
npm test -- src/loaders/__tests__/catalogLoader.test.js
npm test -- src/loaders/__tests__/userLoader.test.js
```

### Watch mode

```bash
npm test -- src/loaders/__tests__/ --watch
```

### Verbose output

```bash
npm test -- src/loaders/__tests__/ --verbose
```

## What's Tested

### ✅ Success Scenarios

- All loaders return expected data structure
- Parameter parsing and transformation
- Multiple data source aggregation
- URL search param handling

### ✅ Error Scenarios

- Missing required parameters
- Service failures and network errors
- Not found scenarios (404)
- Invalid data formats

### ✅ Edge Cases

- Empty responses
- URI encoding/decoding
- Special characters in params
- Zero/null values
- Concurrent requests
- Partial failures in Promise.all

### ✅ Integration Points

- Service layer mocking
- Cookie/localStorage handling
- Error logging
- Response formatting

## Coverage Metrics

| File              | Statements | Branches | Functions | Lines |
| ----------------- | ---------- | -------- | --------- | ----- |
| blogLoader.js     | 100%       | 100%     | 100%      | 100%  |
| blogPostLoader.js | 100%       | 100%     | 100%      | 100%  |
| catalogLoader.js  | 100%       | 100%     | 100%      | 100%  |
| categoryLoader.js | 100%       | 100%     | 100%      | 100%  |
| eventLoader.js    | 100%       | 100%     | 100%      | 100%  |
| levelLoader.js    | 100%       | 100%     | 100%      | 100%  |
| userLoader.js     | 100%       | 100%     | 100%      | 100%  |

**Total: 83 tests, 100% coverage**

## Common Test Patterns

### 1. Basic Loader Test

```javascript
it("should return data successfully", async () => {
  serviceMock.mockResolvedValue(mockData);
  const result = await loader();
  expect(result).toEqual(mockData);
});
```

### 2. Error Handling Test

```javascript
it("should handle service error", async () => {
  serviceMock.mockRejectedValue(new Error("Service error"));
  const result = await loader();
  expect(result).toEqual([]); // or throws
});
```

### 3. Parameter Validation Test

```javascript
it("should throw error when param is missing", async () => {
  await expect(loader({ params: {} })).rejects.toThrow("Parameter is required");
});
```

### 4. URL Param Test

```javascript
it("should parse URL search params", async () => {
  const request = { url: "http://localhost?q=test" };
  const result = await loader({ request });
  expect(result.query).toBe("test");
});
```

## Debugging Tips

### View test output

```bash
npm test -- src/loaders/__tests__/ --verbose
```

### Run single test

```javascript
it.only("specific test", async () => {
  // test code
});
```

### Debug with console

```javascript
console.log("Debug:", result);
```

### Check mock calls

```javascript
expect(mockFunction).toHaveBeenCalledWith(expectedArg);
expect(mockFunction).toHaveBeenCalledTimes(1);
```

## Mock Utilities

### Global fetch mock

```javascript
global.fetch = jest.fn();
global.fetch.mockResolvedValue({
  ok: true,
  json: async () => mockData,
});
```

### Console mock

```javascript
const spy = jest.spyOn(console, "error").mockImplementation(() => {});
// ... test code ...
spy.mockRestore();
```

### Response mock (Node environment)

```javascript
global.Response = class Response extends Error {
  constructor(message, options) {
    super(message);
    this.status = options?.status || 500;
  }
};
```

## Adding New Tests

### 1. Create test file

```bash
touch src/loaders/__tests__/newLoader.test.js
```

### 2. Basic template

```javascript
import { myLoader } from "../myLoader";
import { myService } from "../../services/myService";

jest.mock("../../services/myService");

describe("myLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load data successfully", async () => {
    myService.mockResolvedValue(mockData);
    const result = await myLoader();
    expect(result).toEqual(mockData);
  });
});
```

### 3. Run tests

```bash
npm test -- src/loaders/__tests__/newLoader.test.js
```

## Troubleshooting

### Tests fail with "Response is not defined"

Add Response mock in beforeEach:

```javascript
global.Response = class Response extends Error { ... };
```

### Tests fail with module not found

Check jest.config.js module mapping.

### Coverage not 100%

Run with coverage to see uncovered lines:

```bash
npm test -- --coverage --collectCoverageFrom='src/loaders/**/*.js'
```

### Async test timeout

Increase timeout:

```javascript
jest.setTimeout(10000); // 10 seconds
```

## Best Practices

1. ✅ Mock external dependencies
2. ✅ Test both success and failure paths
3. ✅ Clean up mocks in afterEach/afterAll
4. ✅ Use descriptive test names
5. ✅ Test edge cases (null, undefined, empty)
6. ✅ Verify mock function calls
7. ✅ Keep tests independent
8. ✅ Use consistent mock data

---

**Quick Stats**: 7 test files, 83 tests, 100% coverage  
**Run Time**: ~1.3 seconds  
**Status**: ✅ All tests passing
