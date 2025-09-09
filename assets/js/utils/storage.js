/*
 * Unified storage utility for localStorage, sessionStorage, and cookies.
 * Provides CRUD operations with JSON serialization safety.
 *
 * Usage examples:
 *   import { storage } from '../utils/storage.js';
 *   storage.local.set('cart', { items: [] });
 *   const cart = storage.local.get('cart');
 *   storage.cookies.set('token', 'abc', { days: 7, secure: true });
 */

function safeJSONParse(value) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function safeJSONStringify(value) {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/** Cookie helpers **/
function serializeCookie(name, value, options = {}) {
  const {
    days, // number of days until expiry (mutually exclusive with expires)
    expires, // Date or date-string
    path = "/",
    domain,
    secure = false,
    sameSite = "Lax", // Lax | Strict | None
    httpOnly, // cannot be set from JS but kept for API symmetry (ignored)
  } = options;

  let cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  let expiryDate = null;
  if (typeof days === "number") {
    expiryDate = new Date(Date.now() + days * 864e5);
  } else if (expires) {
    expiryDate = expires instanceof Date ? expires : new Date(expires);
  }
  if (expiryDate) cookie += "; Expires=" + expiryDate.toUTCString();

  if (path) cookie += "; Path=" + path;
  if (domain) cookie += "; Domain=" + domain;
  if (secure) cookie += "; Secure";
  if (sameSite) cookie += "; SameSite=" + sameSite;
  // httpOnly ignored
  return cookie;
}

function parseCookies() {
  return document.cookie
    .split(";")
    .filter(Boolean)
    .reduce((acc, pair) => {
      const idx = pair.indexOf("=");
      if (idx === -1) return acc;
      const key = decodeURIComponent(pair.slice(0, idx).trim());
      const val = decodeURIComponent(pair.slice(idx + 1).trim());
      acc[key] = val;
      return acc;
    }, {});
}

const cookieStore = {
  get(key) {
    const all = parseCookies();
    return key
      ? safeJSONParse(all[key])
      : Object.fromEntries(
          Object.entries(all).map(([k, v]) => [k, safeJSONParse(v)])
        );
  },
  set(key, value, options) {
    document.cookie = serializeCookie(key, safeJSONStringify(value), options);
  },
  update(key, updater, options) {
    const current = this.get(key);
    const next = typeof updater === "function" ? updater(current) : updater;
    this.set(key, next, options);
    return next;
  },
  remove(key, options = {}) {
    // Force expiry in the past
    document.cookie = serializeCookie(key, "", { ...options, days: -1 });
  },
  has(key) {
    return Object.prototype.hasOwnProperty.call(parseCookies(), key);
  },
  keys() {
    return Object.keys(parseCookies());
  },
};

function buildWebStorageAPI(storage) {
  return {
    get(key) {
      if (key == null) {
        const result = {};
        for (let i = 0; i < storage.length; i++) {
          const k = storage.key(i);
          try {
            result[k] = safeJSONParse(storage.getItem(k));
          } catch {
            /* ignore */
          }
        }
        return result;
      }
      const raw = storage.getItem(key);
      return raw == null ? null : safeJSONParse(raw);
    },
    set(key, value) {
      storage.setItem(key, safeJSONStringify(value));
    },
    update(key, updater) {
      const current = this.get(key);
      const next = typeof updater === "function" ? updater(current) : updater;
      this.set(key, next);
      return next;
    },
    remove(key) {
      storage.removeItem(key);
    },
    clear() {
      storage.clear();
    },
    has(key) {
      return storage.getItem(key) !== null;
    },
    keys() {
      const ks = [];
      for (let i = 0; i < storage.length; i++) ks.push(storage.key(i));
      return ks;
    },
    length() {
      return storage.length;
    },
  };
}

export const storage = {
  local:
    typeof localStorage !== "undefined"
      ? buildWebStorageAPI(localStorage)
      : null,
  session:
    typeof sessionStorage !== "undefined"
      ? buildWebStorageAPI(sessionStorage)
      : null,
  cookies: typeof document !== "undefined" ? cookieStore : null,
  // Generic dispatcher (type: 'local' | 'session' | 'cookies')
  get(type, key) {
    return this[type].get(key);
  },
  set(type, key, value, options) {
    return this[type].set(key, value, options);
  },
  update(type, key, updater, options) {
    return this[type].update(key, updater, options);
  },
  remove(type, key, options) {
    return this[type].remove(key, options);
  },
  has(type, key) {
    return this[type].has(key);
  },
  keys(type) {
    return this[type].keys();
  },
};

// Optional: simple namespace wrapper
export function namespaced(namespace, type = "local") {
  return {
    get: (key) => storage[type].get(namespace + ":" + key),
    set: (key, value, opts) =>
      storage[type].set(namespace + ":" + key, value, opts),
    update: (key, updater, opts) =>
      storage[type].update(namespace + ":" + key, updater, opts),
    remove: (key, opts) => storage[type].remove(namespace + ":" + key, opts),
    has: (key) => storage[type].has(namespace + ":" + key),
  };
}
