/**
 * DEBUG SCRIPT FOR CART CONTEXT ISSUE
 *
 * Copy and paste this entire file content into your browser console
 * while on your app (http://localhost:5173)
 */

console.log("=== CART DEBUG SCRIPT ===\n");

// 1. Check if user is logged in
const userSession = localStorage.getItem("userSession");
const currentUser = localStorage.getItem("currentUser");

console.log("1. USER SESSION DATA:");
if (userSession) {
   try {
      const session = JSON.parse(userSession);
      console.log("   ✅ userSession exists");
      console.log("   - isAuthenticated:", session.isAuthenticated);
      console.log("   - hasToken:", !!session.token);
      console.log("   - token preview:", session.token ? session.token.substring(0, 30) + "..." : "NULL");
   } catch (e) {
      console.error("   ❌ Error parsing userSession:", e);
   }
} else {
   console.log("   ❌ No userSession in localStorage");
}

console.log("\n2. CURRENT USER DATA:");
if (currentUser) {
   try {
      const user = JSON.parse(currentUser);
      console.log("   ✅ currentUser exists");
      console.log("   - id:", user.id || "MISSING!");
      console.log("   - username:", user.username);
      console.log("   - email:", user.email);
      console.log("   - Full user object:", user);
   } catch (e) {
      console.error("   ❌ Error parsing currentUser:", e);
   }
} else {
   console.log("   ❌ No currentUser in localStorage");
}

// 3. Check cart data
const cartData = localStorage.getItem("cart:data");
const cartId = localStorage.getItem("cart:id");

console.log("\n3. CART DATA:");
if (cartData) {
   try {
      const cart = JSON.parse(cartData);
      console.log("   ✅ cart:data exists");
      console.log("   - items count:", cart.items?.length || 0);
      console.log("   - items:", cart.items);
   } catch (e) {
      console.error("   ❌ Error parsing cart:data:", e);
   }
} else {
   console.log("   ❌ No cart:data in localStorage");
}

console.log("   - cart:id:", cartId || "MISSING!");

// 4. Check React context state (if app is running)
console.log("\n4. INSTRUCTIONS:");
console.log("   If user.id is MISSING above, that's the problem!");
console.log("   The CartContext expects currentUser to have an 'id' field.");
console.log("\n   Next step:");
console.log("   1. Log out completely");
console.log("   2. Clear localStorage (paste: localStorage.clear())");
console.log("   3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)");
console.log("   4. Log in again");
console.log("   5. Run this script again to verify");

console.log("\n=== END DEBUG ===");
