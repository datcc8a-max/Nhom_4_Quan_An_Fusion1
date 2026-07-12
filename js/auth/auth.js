// ── AUTH ──
function doLogin(){
  const u=document.getElementById('l-user').value.trim();
  const p=document.getElementById('l-pass').value;
  if(!u || !p){showToast('⚠️ Vui lòng nhập đầy đủ thông tin','','err');return}

  const found = users.find(user =>
    (user.email === u || user.phone === u || user.username === u) &&
    user.password === p
  );

  if(!found){showToast('❌ Email/SĐT hoặc mật khẩu không đúng','','err');return}

  currentUser = found;
  loggedIn = true;
  userName = `${found.firstName} ${found.lastName}`.trim();
  userPhone = found.phone || '';
  localStorage.setItem('pgd_current_user', JSON.stringify(currentUser));
  reloadUserScopedData();
  finishLogin();
}
function doRegister(){
  const fn=document.getElementById('r-first').value.trim();
  const ln=document.getElementById('r-last').value.trim();
  const ph=document.getElementById('r-phone').value.trim();
  const email=document.getElementById('r-email').value.trim();
  const pass=document.getElementById('r-pass').value;
  const confirm=document.getElementById('r-confirm').value;

  if(!fn || !ln || !ph || !email || !pass || !confirm){
    showToast('⚠️ Vui lòng điền đầy đủ thông tin','','err');return;
  }
  if(pass.length < 8){showToast('⚠️ Mật khẩu phải có ít nhất 8 ký tự','','err');return}
  if(pass !== confirm){showToast('⚠️ Mật khẩu nhập lại không khớp','','err');return}
  if(users.some(u => u.email.toLowerCase() === email.toLowerCase() || u.phone === ph)){
    showToast('⚠️ Email hoặc số điện thoại đã được sử dụng','','err');return;
  }

  const newUser = {
    id: Date.now(),
    firstName: fn,
    lastName: ln,
    phone: ph,
    email: email,
    password: pass,
    username: email.split('@')[0]
  };
  users.push(newUser);
  localStorage.setItem('pgd_users', JSON.stringify(users));

  showToast('✅ Đăng ký thành công! Vui lòng đăng nhập.', true);
  setTimeout(() => {
    if (typeof switchTab === 'function') {
      switchTab('login');
      const lUser = document.getElementById('l-user');
      if (lUser) lUser.value = email || ph;
    } else if (typeof openLoginModal === 'function') {
      openLoginModal('login');
    }
  }, 1000);
}
function doSocialLogin(provider){
  const authUrls = {
    Google: 'https://accounts.google.com/',
    Facebook: 'https://www.facebook.com/login'
  };
  const target = authUrls[provider] || (provider === 'Google'
    ? 'https://accounts.google.com/'
    : 'https://www.facebook.com/login');
  window.open(target, '_blank', 'noopener,noreferrer');
  showToast('🔗 Đang mở trang đăng nhập ' + provider + '...');
}

window.onSocialLoginSuccess = function(socialUser) {
  if(!users.some(u => u.email.toLowerCase() === socialUser.email.toLowerCase())){
    users.push(socialUser);
    localStorage.setItem('pgd_users', JSON.stringify(users));
  }
  currentUser = socialUser;
  loggedIn = true;
  userName = `${socialUser.firstName} ${socialUser.lastName}`.trim();
  userPhone = socialUser.phone || '';
  localStorage.setItem('pgd_current_user', JSON.stringify(currentUser));
  reloadUserScopedData();
  finishLogin();
};
function finishLogin(){
  closeModal('login-modal');
  reloadUserScopedData();
  showToast('👋 Xin chào, '+userName+'!',true);
  updateProfileUI();
  renderOrders();
  updateNavAuthUI();
  showPage('profile');
}
function openLoginModal(tab = 'login'){
  const target = tab === 'register'
    ? 'src/partials/auth.html?tab=register'
    : 'src/partials/auth.html?tab=login';
  window.location.href = target;
}
function clearAuthState(){
  loggedIn = false;
  currentUser = null;
  userName = '';
  userPhone = '';
  localStorage.removeItem('pgd_current_user');
}
function doLogout(){
  clearAuthState();
  reloadUserScopedData();
  updateProfileUI();
  renderOrders();
  updateNavAuthUI();
  showPage('menu');
  showToast('Đã đăng xuất');
}
function updateNavAuthUI(){
  const navOrders = document.getElementById('nav-orders');
  const navProfile = document.getElementById('nav-profile');
  const navLogin = document.getElementById('nav-login');
  const navLogout = document.getElementById('nav-logout');
  
  if(loggedIn){
    if(navOrders) navOrders.style.display = '';
    if(navProfile) navProfile.style.display = '';
    if(navLogin) navLogin.style.display = 'none';
    if(navLogout) navLogout.style.display = '';
  } else {
    if(navOrders) navOrders.style.display = 'none';
    if(navProfile) navProfile.style.display = 'none';
    if(navLogin) navLogin.style.display = '';
    if(navLogout) navLogout.style.display = 'none';
  }
}


function updateProfileUI(){
  const guest=document.getElementById('profile-guest');
  const logged=document.getElementById('profile-logged');
  if(!guest || !logged) return;
  if(!loggedIn || !currentUser){
    guest.style.display='block';
    logged.style.display='none';
    return;
  }
  guest.style.display='none';
  logged.style.display='block';
  
  const avEl = document.getElementById('p-av');
  if (currentUser.avatar) {
    avEl.style.backgroundImage = `url(${currentUser.avatar})`;
    avEl.style.backgroundSize = 'cover';
    avEl.style.backgroundPosition = 'center';
    avEl.textContent = '';
  } else {
    avEl.style.backgroundImage = 'none';
    avEl.textContent = userName.charAt(0).toUpperCase();
  }
  
  document.getElementById('p-display-name').textContent=userName;
  document.getElementById('p-display-phone').textContent=userPhone||'Chưa cập nhật SĐT';
  document.getElementById('pf-first').value=currentUser.firstName||'';
  document.getElementById('pf-last').value=currentUser.lastName||'';
  document.getElementById('pf-phone').value=currentUser.phone||'';
  document.getElementById('pf-email').value=currentUser.email||'';
  document.getElementById('pf-birth').value=currentUser.birth||'';
  
  const totalOrders=orders.length;
  const totalSpent=orders.reduce((sum,o)=>sum+Number(o.total||0),0);
  const pointsUsed = orders.reduce((sum, o) => sum + (o.pointsRedeemed || 0), 0);
  const points=Math.max(0, Math.floor(totalSpent/50000) - pointsUsed);
  
  const totalAccumulatedPoints = Math.floor(totalSpent / 50000);
  let tierName = 'Đồng';
  let tierEmoji = '🥉';
  let tierColor = '#b45309';
  if (totalAccumulatedPoints >= 30) {
    tierName = 'Vàng';
    tierEmoji = '🥇';
    tierColor = '#d97706';
  } else if (totalAccumulatedPoints >= 10) {
    tierName = 'Bạc';
    tierEmoji = '🥈';
    tierColor = '#64748b';
  }
  
  let dateBadgeText = '';
  if (currentUser.birth) {
    const bParts = currentUser.birth.split('-');
    if (bParts.length === 3) {
      dateBadgeText = `🎂 Sinh nhật: ${bParts[2]}/${bParts[1]}`;
    } else {
      dateBadgeText = `🎂 Sinh nhật: ${currentUser.birth}`;
    }
  } else {
    const joinDate = new Date(Number(currentUser.id) || Date.now());
    dateBadgeText = `📅 Tham gia: Th${joinDate.getMonth() + 1}/${joinDate.getFullYear()}`;
  }
  
  document.getElementById('profile-badges-container').innerHTML = `
    <span class="p-badge" style="background:${tierColor}; border-color:${tierColor}dd">${tierEmoji} Thành viên ${tierName}</span>
    <span class="p-badge">${dateBadgeText}</span>
  `;
  
  const pwBtn = document.getElementById('profile-change-pw-btn');
  const isSocial = currentUser.password === 'social-login' || String(currentUser.id).startsWith('social-');
  if (pwBtn) {
    pwBtn.style.display = isSocial ? 'none' : '';
  }
  const pwSec = document.getElementById('password-section');
  if (pwSec && isSocial) {
    pwSec.style.display = 'none';
  }
  
  document.getElementById('ps-orders').textContent=totalOrders;
  document.getElementById('ps-points').textContent=points;
  document.getElementById('ps-saved').textContent=fmt(Math.floor(totalSpent*0.08));
  document.getElementById('wallet-balance').textContent='Số dư: '+fmt(Math.max(0, points*5000));
  document.getElementById('promo-count').textContent=(Object.keys(PROMO_CODES).filter(k=>!PROMO_CODES[k].disabled).length)+' mã đang hoạt động';
  document.getElementById('point-summary').textContent=points+' điểm → đổi được '+fmt(points*5000);
  document.getElementById('notify-order').textContent=(profilePrefs.notifyOrder === false ? 'TẮT' : 'BẬT');
  document.getElementById('notify-promo').textContent=(profilePrefs.notifyPromo === false ? 'TẮT' : 'BẬT');
  renderAddressList();
}

function triggerAvatarUpload() {
  document.getElementById('p-avatar-file-input').click();
}

function handleAvatarFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 1024 * 1024) { // 1MB limit for localStorage
    showToast('⚠️ Vui lòng chọn ảnh nhỏ hơn 1MB', '', 'err');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(event) {
    const base64 = event.target.result;
    currentUser.avatar = base64;
    
    users = users.map(u => u.id === currentUser.id ? currentUser : u);
    localStorage.setItem('pgd_users', JSON.stringify(users));
    localStorage.setItem('pgd_current_user', JSON.stringify(currentUser));
    
    updateProfileUI();
    showToast('📸 Đã cập nhật ảnh đại diện!', true);
  };
  reader.readAsDataURL(file);
}
function saveProfile(){
  if(!loggedIn || !currentUser){showToast('⚠️ Bạn cần đăng nhập để lưu thông tin','','err');return}
  const fn=document.getElementById('pf-first').value.trim();
  const ln=document.getElementById('pf-last').value.trim();
  const ph=document.getElementById('pf-phone').value.trim();
  const email=document.getElementById('pf-email').value.trim();
  const birth=document.getElementById('pf-birth').value;
  if(!fn || !ln){showToast('⚠️ Vui lòng nhập đầy đủ họ và tên','','err');return}
  if(ph && users.some(u => u.id !== currentUser.id && u.phone === ph)){
    showToast('⚠️ Số điện thoại này đã được sử dụng','','err');return;
  }
  if(email && users.some(u => u.id !== currentUser.id && u.email.toLowerCase() === email.toLowerCase())){
    showToast('⚠️ Email này đã được sử dụng','','err');return;
  }
  currentUser.firstName=fn;
  currentUser.lastName=ln;
  currentUser.phone=ph;
  currentUser.email=email;
  currentUser.birth=birth;
  users = users.map(u => u.id === currentUser.id ? currentUser : u);
  localStorage.setItem('pgd_users', JSON.stringify(users));
  localStorage.setItem('pgd_current_user', JSON.stringify(currentUser));
  userName = `${fn} ${ln}`.trim();
  userPhone = ph;
  updateProfileUI();
  showToast('💾 Đã lưu thông tin',true);
}
function toggleNotification(type){
  const key = type === 'promo' ? 'notifyPromo' : 'notifyOrder';
  profilePrefs[key] = profilePrefs[key] === false ? true : false;
  saveUserScopedData('profile_prefs', profilePrefs);
  updateProfileUI();
  showToast('🔔 Đã ' + (profilePrefs[key] ? 'bật' : 'tắt') + ' thông báo');
}
function openPasswordSection(){
  const sec=document.getElementById('password-section');
  if(sec) sec.style.display = sec.style.display === 'none' ? 'block' : 'none';
}
function changePassword(){
  if(!currentUser){showToast('⚠️ Bạn cần đăng nhập','','err');return}
  const old=document.getElementById('pw-old').value;
  const nw=document.getElementById('pw-new').value;
  const cf=document.getElementById('pw-confirm').value;
  if(!old || !nw || !cf){showToast('⚠️ Vui lòng nhập đầy đủ thông tin','','err');return}
  if(old !== currentUser.password){showToast('⚠️ Mật khẩu cũ không đúng','','err');return}
  if(nw.length < 8){showToast('⚠️ Mật khẩu mới phải có ít nhất 8 ký tự','','err');return}
  if(nw !== cf){showToast('⚠️ Mật khẩu nhập lại không khớp','','err');return}
  currentUser.password = nw;
  users = users.map(u => u.id === currentUser.id ? currentUser : u);
  localStorage.setItem('pgd_users', JSON.stringify(users));
  localStorage.setItem('pgd_current_user', JSON.stringify(currentUser));
  document.getElementById('pw-old').value='';
  document.getElementById('pw-new').value='';
  document.getElementById('pw-confirm').value='';
  showToast('🔐 Đã đổi mật khẩu thành công',true);
}
function renderAddressList(){
  const box=document.getElementById('profile-address-list');
  if(!box) return;
  const entries = Object.entries(addresses || {});
  box.innerHTML = entries.map(([key,label]) => {
    const encodedKey = key.replace(/'/g, "\\'");
    const encodedLabel = String(label).replace(/'/g, "\\'");
    return `
    <div class="menu-list-item" onclick="openAddressModal('${encodedKey}','${encodedLabel}','${label}')">
      <div class="mli-left"><div class="mli-icon">${key==='home'?'🏠':'🏢'}</div><div><div class="mli-label">${key==='home'?'Nhà':'Văn phòng'}</div><div class="mli-sub">${label}</div></div></div>
      <span class="mli-arrow">›</span>
    </div>`;
  }).join('') + `
    <div class="menu-list-item" onclick="openAddressModal()">
      <div class="mli-left"><div class="mli-icon" style="background:var(--surf2)">➕</div><div><div class="mli-label">Thêm địa chỉ mới</div></div></div>
      <span class="mli-arrow">›</span>
    </div>
  `;
}
function openAddressModal(key = '', label = '', current = ''){
  document.getElementById('addr-modal-key').value = key || '';
  document.getElementById('addr-modal-label').value = label || '';
  document.getElementById('addr-modal-value').value = current || '';
  const title = key ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới';
  document.getElementById('addr-modal-title').textContent = title;
  openModal('addr-modal');
}
function saveAddressModal(){
  const keyInput = document.getElementById('addr-modal-key');
  const labelInput = document.getElementById('addr-modal-label');
  const valueInput = document.getElementById('addr-modal-value');
  if(!keyInput || !labelInput || !valueInput) return;
  const oldKey = keyInput.value.trim();
  const label = labelInput.value.trim();
  const value = valueInput.value.trim();
  if(!label || !value){showToast('⚠️ Vui lòng nhập đủ nhãn và địa chỉ','','err');return;}
  const key = oldKey || label.toLowerCase().replace(/[^a-z0-9]+/g,'_');
  addresses[key] = value;
  if(oldKey && oldKey !== key){ delete addresses[oldKey]; }
  saveUserScopedData('addresses', addresses);
  renderAddressList();
  closeModal('addr-modal');
  showToast(oldKey ? '💾 Đã cập nhật địa chỉ' : '💾 Đã thêm địa chỉ mới',true);
}






document.addEventListener('click', function(e){
  const wrap=document.querySelector('.cart-drop-wrap');
  const dropdown=document.getElementById('cart-dropdown');
  if(!wrap || !dropdown) return;
  if(!wrap.contains(e.target) && dropdown.classList.contains('open')){
    closeCartDropdown();
  }
});

