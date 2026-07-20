// ============================================
// FALLBACK SERVICE - LocalStorage + JSON Backup
// ============================================

const CACHE_PREFIX = "smarthome_";
const CACHE_VERSION = "v1";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// ============================================
// CACHE MANAGEMENT
// ============================================

/**
 * Save data to localStorage with expiry
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} expiryMs - Expiry time in milliseconds (default: 24h)
 */
export const saveCache = (key, data, expiryMs = CACHE_EXPIRY) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expiry: expiryMs,
      version: CACHE_VERSION,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
  } catch (error) {
    console.warn(`[Fallback] Failed to save cache for ${key}:`, error);
  }
};

/**
 * Get data from localStorage
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null
 */
export const getCache = (key) => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;

    const cacheData = JSON.parse(cached);

    // Check version
    if (cacheData.version !== CACHE_VERSION) {
      removeCache(key);
      return null;
    }

    // Check expiry
    if (Date.now() - cacheData.timestamp > cacheData.expiry) {
      removeCache(key);
      return null;
    }

    return cacheData.data;
  } catch (error) {
    console.warn(`[Fallback] Failed to get cache for ${key}:`, error);
    return null;
  }
};

/**
 * Remove specific cache
 * @param {string} key - Cache key
 */
export const removeCache = (key) => {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch (error) {
    console.warn(`[Fallback] Failed to remove cache for ${key}:`, error);
  }
};

/**
 * Clear all app caches
 */
export const clearAllCache = () => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.warn("[Fallback] Failed to clear all caches:", error);
  }
};

// ============================================
// JSON BACKUP FETCHING
// ============================================

/**
 * Fetch data from public JSON backup
 * @param {string} filename - JSON filename (without path)
 * @returns {Promise<any>} Parsed JSON data
 */
export const fetchJsonBackup = async (filename) => {
  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`[Fallback] Failed to fetch JSON backup ${filename}:`, error);
    return null;
  }
};

// ============================================
// FALLBACK FETCH WRAPPER
// ============================================

/**
 * Universal fallback fetch - tries Firestore first, then cache, then JSON
 * @param {Object} options
 * @param {string} options.cacheKey - Key for localStorage cache
 * @param {Function} options.firestoreFetch - Async function to fetch from Firestore
 * @param {string} options.jsonFile - JSON backup filename
 * @param {boolean} options.skipCache - Skip cache layer
 * @returns {Promise<{data: any, source: string}>}
 */
export const fetchWithFallback = async ({
  cacheKey,
  firestoreFetch,
  jsonFile,
  skipCache = false,
}) => {
  let data = null;
  let source = "none";

  // Step 1: Try Firestore
  try {
    data = await firestoreFetch();
    if (data && (Array.isArray(data) ? data.length > 0 : true)) {
      // Cache successful data
      if (cacheKey && !skipCache) {
        saveCache(cacheKey, data);
      }
      source = "firestore";
      return { data, source };
    }
  } catch (error) {
    console.warn(`[Fallback] Firestore fetch failed for ${cacheKey}:`, error.message);
  }

  // Step 2: Try localStorage cache
  if (cacheKey && !skipCache) {
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      data = cachedData;
      source = "cache";
      return { data, source };
    }
  }

  // Step 3: Try JSON backup
  if (jsonFile) {
    const jsonData = await fetchJsonBackup(jsonFile);
    if (jsonData) {
      data = jsonData;
      source = "json";
      return { data, source };
    }
  }

  // Step 4: Return whatever we have (even null) or empty array
  return {
    data: data || (Array.isArray(data) ? [] : null),
    source,
  };
};

// ============================================
// UTILITIES
// ============================================

/**
 * Check if device is online
 * @returns {boolean}
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Check if Firestore is likely available
 * @returns {Promise<boolean>}
 */
export const checkFirestoreHealth = async () => {
  try {
    // Simple ping to Firebase
    const response = await fetch(
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=fake"
    );
    // If we get a 400 (invalid API key) instead of network error, Firebase is reachable
    return response.status === 400;
  } catch {
    return false;
  }
};

/**
 * Get cache status info
 * @param {string} key - Cache key
 * @returns {Object} Cache info
 */
export const getCacheInfo = (key) => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) {
      return { exists: false };
    }

    const cacheData = JSON.parse(cached);
    const age = Date.now() - cacheData.timestamp;
    const remaining = cacheData.expiry - age;

    return {
      exists: true,
      age: Math.round(age / 1000 / 60), // minutes
      remaining: Math.round(remaining / 1000 / 60), // minutes
      isExpired: age > cacheData.expiry,
    };
  } catch {
    return { exists: false };
  }
};
