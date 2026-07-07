// Externalized application logic for food-order-web
// Extracted from index.html inline script

// ── DATA ──
// MENU is provided by js/core/data.js (window.MENU)

// ── STATE ──
let cart = {};
let orders = [];
let favs = new Set();
let curFilter = 'all';
let curSort = 'default';
let curSearch = '';
let discount = 0;
let discountCode = '';
let selectedPayment = 'cod';
let users = JSON.parse(localStorage.getItem('pgd_users') || '[]');
if(!Array.isArray(users) || !users.length){
  users = [{
    id: 1,
    firstName: 'Người',
    lastName: 'Dùng',
    phone: '0900000000',
    email: 'demo@phogiadinh.vn',
    password: '12345678',
    username: 'demo'
  }];
  localStorage.setItem('pgd_users', JSON.stringify(users));
}
let currentUser = JSON.parse(localStorage.getItem('pgd_current_user') || 'null');
let loggedIn = !!currentUser;
let userName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : '';
let userPhone = currentUser ? (currentUser.phone || '') : '';
let profilePrefs = {notifyOrder:true,notifyPromo:true};
let addresses = {};
let detailItem = null;
let detailQty = 1;
let detailSize = 'M';
let detailToppings = new Set();
let userLocation = null;
let userLocationLabel = '';
let orderFilter = 'all';
let menuRenderTimer = null;
let adminLoggedIn = false;
let adminEditingItemId = null;
let adminCurrentPanel = 'overview';

function getUserScopeKey(key){
  return currentUser ? `${key}_${currentUser.id}` : `${key}_guest`;
}
function loadUserScopedData(key, fallback){
  const stored = localStorage.getItem(getUserScopeKey(key));
  if(stored === null || stored === undefined) return fallback;
  try { return JSON.parse(stored); } catch { return fallback; }
}
function saveUserScopedData(key, value){
  if(currentUser){
    localStorage.setItem(getUserScopeKey(key), JSON.stringify(value));
  }
}
function reloadUserScopedData(){
  if(currentUser){
    orders = Array.isArray(loadUserScopedData('orders', [])) ? loadUserScopedData('orders', []) : [];
    favs = new Set(loadUserScopedData('favs', []));
    profilePrefs = loadUserScopedData('profile_prefs', {notifyOrder:true,notifyPromo:true});
    const savedAddresses = loadUserScopedData('addresses', {});
    addresses = savedAddresses && typeof savedAddresses === 'object' ? savedAddresses : {};
  } else {
    orders = [];
    favs = new Set();
    profilePrefs = {notifyOrder:true,notifyPromo:true};
    addresses = {};
  }
}

// Initialize user-scoped data and cart on load
reloadUserScopedData();
if(typeof loadCart === 'function') loadCart();

