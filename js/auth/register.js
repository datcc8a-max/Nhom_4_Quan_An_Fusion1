// ── AUTH/register.js - Đăng ký ──

function doRegister() {
  const first   = (document.getElementById('r-first')   || {}).value?.trim();
  const last    = (document.getElementById('r-last')    || {}).value?.trim();
  const phone   = (document.getElementById('r-phone')   || {}).value?.trim();
  const email   = (document.getElementById('r-email')   || {}).value?.trim();
  const pass    = (document.getElementById('r-pass')    || {}).value;
  const confirm = (document.getElementById('r-confirm') || {}).value;
  const msg     = document.getElementById('msg');

  if (!first || !last || !phone || !pass) {
    if (msg) { msg.textContent = '⚠️ Vui lòng điền đầy đủ thông tin bắt buộc'; msg.className = 'msg err'; }
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
  if (users.find(u => u.phone === phone)) {
    if (msg) { msg.textContent = '⚠️ Số điện thoại đã được đăng ký'; msg.className = 'msg err'; }
    return;
  }
  if (email && users.find(u => u.email === email)) {
    if (msg) { msg.textContent = '⚠️ Email đã được đăng ký'; msg.className = 'msg err'; }
    return;
  }

  const newUser = {
    id: Date.now(),
    firstName: first,
    lastName: last,
    phone,
    email: email || '',
    password: pass,
    username: phone,
    points: 0,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  storageSet(STORAGE_KEYS.USERS, users);
  
  if (msg) { 
    msg.textContent = '✅ Tạo tài khoản thành công! Vui lòng đăng nhập.'; 
    msg.className = 'msg ok'; 
  }
  
  setTimeout(() => { 
    // Reset form
    if(document.getElementById('r-first')) document.getElementById('r-first').value = '';
    if(document.getElementById('r-last')) document.getElementById('r-last').value = '';
    if(document.getElementById('r-phone')) document.getElementById('r-phone').value = '';
    if(document.getElementById('r-email')) document.getElementById('r-email').value = '';
    if(document.getElementById('r-pass')) document.getElementById('r-pass').value = '';
    if(document.getElementById('r-confirm')) document.getElementById('r-confirm').value = '';
    if (msg) msg.textContent = '';
    
    // Switch to login tab if available
    if (typeof switchTab === 'function') {
      switchTab('login');
      // Prefill login username
      const lUser = document.getElementById('l-user');
      if (lUser) lUser.value = email || phone;
    } else {
      window.history.back(); 
    }
  }, 1000);
}

window.doRegister = doRegister;

