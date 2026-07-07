// ── AUTH/login.js - Đăng nhập ──

function doLogin() {
  const user = (document.getElementById('l-user') || {}).value?.trim();
  const pass = (document.getElementById('l-pass') || {}).value;
  const msg  = document.getElementById('msg');
  if (!user || !pass) {
    if (msg) { msg.textContent = '⚠️ Vui lòng điền đầy đủ thông tin'; msg.className = 'msg err'; }
    return;
  }
  const users = storageGet(STORAGE_KEYS.USERS, []);
  const found = users.find(u =>
    (u.phone === user || u.email === user || u.username === user) && u.password === pass
  );
  if (!found) {
    if (msg) { msg.textContent = '❌ Sai tài khoản hoặc mật khẩu'; msg.className = 'msg err'; }
    return;
  }
  storageSet(STORAGE_KEYS.CURRENT_USER, found);
  if (msg) { msg.textContent = '✅ Đăng nhập thành công! Đang chuyển…'; msg.className = 'msg ok'; }
  setTimeout(() => { window.history.back(); }, 800);
}

window.doLogin = doLogin;

