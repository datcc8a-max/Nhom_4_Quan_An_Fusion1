// ── AUTH/forgot-password.js - Quên mật khẩu ──

function showForgotPasswordForm() {
  const loginPanel  = document.getElementById('login-panel');
  const forgotPanel = document.getElementById('forgot-panel');
  if (loginPanel)  loginPanel.style.display  = 'none';
  if (forgotPanel) forgotPanel.style.display = '';
}

function hideForgotPasswordForm() {
  const loginPanel  = document.getElementById('login-panel');
  const forgotPanel = document.getElementById('forgot-panel');
  if (loginPanel)  loginPanel.style.display  = '';
  if (forgotPanel) forgotPanel.style.display = 'none';
}

function doForgotPassword() {
  const email   = (document.getElementById('f-email')   || {}).value?.trim();
  const pass    = (document.getElementById('f-pass')    || {}).value;
  const confirm = (document.getElementById('f-confirm') || {}).value;
  const msg     = document.getElementById('msg');

  if (!email || !pass) {
    if (msg) { msg.textContent = '⚠️ Vui lòng điền đầy đủ thông tin'; msg.className = 'msg err'; }
    return;
  }
  if (pass.length < 8) {
    if (msg) { msg.textContent = '⚠️ Mật khẩu phải ít nhất 8 ký tự'; msg.className = 'msg err'; }
    return;
  }
  if (pass !== confirm) {
    if (msg) { msg.textContent = '⚠️ Mật khẩu nhập lại không khớp'; msg.className = 'msg err'; }
    return;
  }

  const users = storageGet(STORAGE_KEYS.USERS, []);
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) {
    if (msg) { msg.textContent = '❌ Email chưa được đăng ký'; msg.className = 'msg err'; }
    return;
  }

  users[idx].password = pass;
  storageSet(STORAGE_KEYS.USERS, users);
  if (msg) { msg.textContent = '✅ Đặt lại mật khẩu thành công! Đang chuyển…'; msg.className = 'msg ok'; }
  setTimeout(() => { hideForgotPasswordForm(); }, 1500);
}

window.showForgotPasswordForm = showForgotPasswordForm;
window.hideForgotPasswordForm = hideForgotPasswordForm;
window.doForgotPassword = doForgotPassword;
