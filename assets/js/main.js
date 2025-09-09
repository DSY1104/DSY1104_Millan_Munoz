// Storage utility usage example
import { storage, namespaced } from "./utils/storage.js";

// Example initialization only if running in browser
if (typeof window !== "undefined") {
  // Initialize a namespaced store for 'app'
  const appStore = namespaced("app", "local");
  if (!appStore.has("initialized")) {
    appStore.set("initialized", true);
  }
  // Ensure a demo cookie exists
  if (!storage.cookies.has("demo")) {
    storage.cookies.set(
      "demo",
      { created: Date.now() },
      { days: 1, sameSite: "Lax" }
    );
  }
  // Expose for quick manual testing in console
  window.appStore = appStore;
}
