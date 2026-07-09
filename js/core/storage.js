// ── STORAGE - Quản lý localStorage ──

const STORAGE_KEYS = {
  USERS: 'pgd_users',
  CURRENT_USER: 'pgd_current_user',
  REVIEWS: 'pgd_reviews',
  PROMO_CODES: 'pgd_promo_codes',
};

function storageGet(key, fallback = null) {
  try {
    const val = localStorage.getItem(key);
    if (val === null || val === undefined) return fallback;
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    console.error('storageSet failed:', key);
    return false;
  }
}

function storageRemove(key) {
  localStorage.removeItem(key);
}

// ── User-scoped storage ──
function getUserScopeKey(key) {
  return window.currentUser ? `${key}_${window.currentUser.id}` : `${key}_guest`;
}

function loadUserScopedData(key, fallback) {
  const stored = localStorage.getItem(getUserScopeKey(key));
  if (stored === null || stored === undefined) return fallback;
  try { return JSON.parse(stored); } catch { return fallback; }
}

function saveUserScopedData(key, value) {
  if (window.currentUser) {
    localStorage.setItem(getUserScopeKey(key), JSON.stringify(value));
  }
}

window.STORAGE_KEYS = STORAGE_KEYS;
window.storageGet = storageGet;
window.storageSet = storageSet;
window.storageRemove = storageRemove;
window.getUserScopeKey = getUserScopeKey;
window.loadUserScopedData = loadUserScopedData;
window.saveUserScopedData = saveUserScopedData;
