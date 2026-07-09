// Profile, auth and user-facing page module
(function(){
  function doLogin(){
    const u = document.getElementById('l-user').value.trim();
    const p = document.getElementById('l-pass').value;
    if(!u || !p){ showToast('⚠️ Vui lòng nhập đầy đủ thông tin', '', 'err'); return; }

    const found = users.find(user =>
      (user.email === u || user.phone === u || user.username === u) && user.password === p
    );

    if(!found){ showToast('❌ Email/SĐT hoặc mật khẩu không đúng', '', 'err'); return; }

    currentUser = found;
    loggedIn = true;
    userName = `${found.firstName} ${found.lastName}`.trim();
    userPhone = found.phone || '';
    localStorage.setItem('pgd_current_user', JSON.stringify(currentUser));
    reloadUserScopedData();
    finishLogin();
  }

  function doRegister(){
    const fn = document.getElementById('r-first').value.trim();
    const ln = document.getElementById('r-last').value.trim();
    const ph = document.getElementById('r-phone').value.trim();
    const email = document.getElementById('r-email').value.trim();
    const pass = document.getElementById('r-pass').value;
    const confirm = document.getElementById('r-confirm').value;

    if(!fn || !ln || !ph || !email || !pass || !confirm){ showToast('⚠️ Vui lòng điền đầy đủ thông tin', '', 'err'); return; }
    if(pass.length < 8){ showToast('⚠️ Mật khẩu phải có ít nhất 8 ký tự', '', 'err'); return; }
    if(pass !== confirm){ showToast('⚠️ Mật khẩu nhập lại không khớp', '', 'err'); return; }
    if(users.some(u => u.email.toLowerCase() === email.toLowerCase() || u.phone === ph)){ showToast('⚠️ Email hoặc số điện thoại đã được sử dụng', '', 'err'); return; }

    const newUser = {id: Date.now(), firstName: fn, lastName: ln, phone: ph, email, password: pass, username: email.split('@')[0]};
    users.push(newUser);
    localStorage.setItem('pgd_users', JSON.stringify(users));

    currentUser = newUser;
    loggedIn = true;
    userName = `${fn} ${ln}`.trim();
    userPhone = ph;
    localStorage.setItem('pgd_current_user', JSON.stringify(currentUser));
    finishLogin();
  }

  function doSocialLogin(provider){
    const authUrls = {Google: 'https://accounts.google.com/', Facebook: 'https://www.facebook.com/login'};
    const target = authUrls[provider] || (provider === 'Google' ? 'https://accounts.google.com/' : 'https://www.facebook.com/login');
    window.open(target, '_blank', 'noopener,noreferrer');
    showToast('🔗 Đang mở trang đăng nhập ' + provider + '...', true);
  }

  function finishLogin(){
    closeModal('login-modal');
    reloadUserScopedData();
    showToast('👋 Xin chào, ' + userName + '!', true);
    updateProfileUI();
    renderOrders();
    updateNavAuthUI();
    showPage('profile');
  }

  function openLoginModal(tab = 'login'){
    const target = tab === 'register' ? 'src/partials/auth.html?tab=register' : 'src/partials/auth.html?tab=login';
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
    const guest = document.getElementById('profile-guest');
    const logged = document.getElementById('profile-logged');
    if(!guest || !logged) return;
    if(!loggedIn || !currentUser){ guest.style.display = 'block'; logged.style.display = 'none'; return; }
    guest.style.display = 'none';
    logged.style.display = 'block';

    const avEl = document.getElementById('p-av');
    if(currentUser.avatar){
      avEl.style.backgroundImage = `url(${currentUser.avatar})`;
      avEl.style.backgroundSize = 'cover';
      avEl.style.backgroundPosition = 'center';
      avEl.textContent = '';
    } else {
      avEl.style.backgroundImage = 'none';
      avEl.textContent = userName.charAt(0).toUpperCase();
    }

    document.getElementById('p-display-name').textContent = userName;
    document.getElementById('p-display-phone').textContent = userPhone || 'Chưa cập nhật SĐT';
    document.getElementById('pf-first').value = currentUser.firstName || '';
    document.getElementById('pf-last').value = currentUser.lastName || '';
    document.getElementById('pf-phone').value = currentUser.phone || '';
    document.getElementById('pf-email').value = currentUser.email || '';
    document.getElementById('pf-birth').value = currentUser.birth || '';

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const pointsUsed = orders.reduce((sum, o) => sum + (o.pointsRedeemed || 0), 0);
    const points = Math.max(0, Math.floor(totalSpent / 50000) - pointsUsed);
    const totalAccumulatedPoints = Math.floor(totalSpent / 50000);
    let tierName = 'Đồng'; let tierEmoji = '🥉'; let tierColor = '#b45309';
    if(totalAccumulatedPoints >= 30){ tierName = 'Vàng'; tierEmoji = '🥇'; tierColor = '#d97706'; }
    else if(totalAccumulatedPoints >= 10){ tierName = 'Bạc'; tierEmoji = '🥈'; tierColor = '#64748b'; }

    document.getElementById('profile-badges-container').innerHTML = `
      <span class="p-badge" style="background:${tierColor};border-color:${tierColor}dd">${tierEmoji} Thành viên ${tierName}</span>
      <span class="p-badge">📅 Tham gia: ${new Date(Number(currentUser.id) || Date.now()).toLocaleDateString('vi-VN')}</span>`;

    document.getElementById('ps-orders').textContent = totalOrders;
    document.getElementById('ps-points').textContent = points;
    document.getElementById('ps-saved').textContent = fmt(Math.floor(totalSpent * 0.08));
    document.getElementById('wallet-balance').textContent = 'Số dư: ' + fmt(Math.max(0, points * 5000));
    document.getElementById('promo-count').textContent = (Object.keys(PROMO_CODES).filter(k => !PROMO_CODES[k].disabled).length) + ' mã đang hoạt động';
    document.getElementById('point-summary').textContent = points + ' điểm → đổi được ' + fmt(points * 5000);
    document.getElementById('notify-order').textContent = (profilePrefs.notifyOrder === false ? 'TẮT' : 'BẬT');
    document.getElementById('notify-promo').textContent = (profilePrefs.notifyPromo === false ? 'TẮT' : 'BẬT');
    renderAddressList();
  }

  function saveProfile(){
    if(!loggedIn || !currentUser){ showToast('⚠️ Bạn cần đăng nhập để lưu thông tin', '', 'err'); return; }
    const fn = document.getElementById('pf-first').value.trim();
    const ln = document.getElementById('pf-last').value.trim();
    const ph = document.getElementById('pf-phone').value.trim();
    const email = document.getElementById('pf-email').value.trim();
    const birth = document.getElementById('pf-birth').value;
    if(!fn || !ln){ showToast('⚠️ Vui lòng nhập đầy đủ họ và tên', '', 'err'); return; }
    currentUser.firstName = fn;
    currentUser.lastName = ln;
    currentUser.phone = ph;
    currentUser.email = email;
    currentUser.birth = birth;
    users = users.map(u => u.id === currentUser.id ? currentUser : u);
    localStorage.setItem('pgd_users', JSON.stringify(users));
    localStorage.setItem('pgd_current_user', JSON.stringify(currentUser));
    userName = `${fn} ${ln}`.trim();
    userPhone = ph;
    updateProfileUI();
    showToast('💾 Đã lưu thông tin', true);
  }

  function toggleNotification(type){
    const key = type === 'promo' ? 'notifyPromo' : 'notifyOrder';
    profilePrefs[key] = profilePrefs[key] === false ? true : false;
    saveUserScopedData('profile_prefs', profilePrefs);
    updateProfileUI();
    showToast('🔔 Đã ' + (profilePrefs[key] ? 'bật' : 'tắt') + ' thông báo');
  }

  function openPasswordSection(){
    const sec = document.getElementById('password-section');
    if(sec) sec.style.display = sec.style.display === 'none' ? 'block' : 'none';
  }

  function changePassword(){
    if(!currentUser){ showToast('⚠️ Bạn cần đăng nhập', '', 'err'); return; }
    const oldValue = document.getElementById('pw-old').value;
    const newValue = document.getElementById('pw-new').value;
    const confirmValue = document.getElementById('pw-confirm').value;
    if(!oldValue || !newValue || !confirmValue){ showToast('⚠️ Vui lòng nhập đầy đủ thông tin', '', 'err'); return; }
    if(oldValue !== currentUser.password){ showToast('⚠️ Mật khẩu cũ không đúng', '', 'err'); return; }
    if(newValue.length < 8){ showToast('⚠️ Mật khẩu mới phải có ít nhất 8 ký tự', '', 'err'); return; }
    if(newValue !== confirmValue){ showToast('⚠️ Mật khẩu nhập lại không khớp', '', 'err'); return; }
    currentUser.password = newValue;
    users = users.map(u => u.id === currentUser.id ? currentUser : u);
    localStorage.setItem('pgd_users', JSON.stringify(users));
    localStorage.setItem('pgd_current_user', JSON.stringify(currentUser));
    document.getElementById('pw-old').value = '';
    document.getElementById('pw-new').value = '';
    document.getElementById('pw-confirm').value = '';
    showToast('🔐 Đã đổi mật khẩu thành công', true);
  }

  function renderAddressList(){
    const box = document.getElementById('profile-address-list');
    if(!box) return;
    const entries = Object.entries(addresses || {});
    box.innerHTML = entries.map(([key, label]) => {
      const encodedKey = key.replace(/'/g, "\\'");
      const encodedLabel = String(label).replace(/'/g, "\\'");
      return `
      <div class="menu-list-item" onclick="openAddressModal('${encodedKey}','${encodedLabel}','${label}')">
        <div class="mli-left"><div class="mli-icon">${key === 'home' ? '🏠' : '🏢'}</div><div><div class="mli-label">${key === 'home' ? 'Nhà' : 'Văn phòng'}</div><div class="mli-sub">${label}</div></div></div>
        <span class="mli-arrow">›</span>
      </div>`;
    }).join('') + `
      <div class="menu-list-item" onclick="openAddressModal()">
        <div class="mli-left"><div class="mli-icon" style="background:var(--surf2)">➕</div><div><div class="mli-label">Thêm địa chỉ mới</div></div></div>
        <span class="mli-arrow">›</span>
      </div>`;
  }

  function openAddressModal(key = '', label = '', current = ''){
    document.getElementById('addr-modal-key').value = key || '';
    document.getElementById('addr-modal-label').value = label || '';
    document.getElementById('addr-modal-value').value = current || '';
    document.getElementById('addr-modal-title').textContent = key ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới';
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
    if(!label || !value){ showToast('⚠️ Vui lòng nhập đủ nhãn và địa chỉ', '', 'err'); return; }
    const key = oldKey || label.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    addresses[key] = value;
    if(oldKey && oldKey !== key) delete addresses[oldKey];
    saveUserScopedData('addresses', addresses);
    renderAddressList();
    closeModal('addr-modal');
    showToast(oldKey ? '💾 Đã cập nhật địa chỉ' : '💾 Đã thêm địa chỉ mới', true);
  }

  function renderOrders(){
    const guest = document.getElementById('orders-guest');
    const logged = document.getElementById('orders-logged');
    const list = document.getElementById('orders-list');
    if(!guest || !logged || !list) return;

    if(!loggedIn){ guest.style.display = 'block'; logged.style.display = 'none'; return; }
    guest.style.display = 'none';
    logged.style.display = 'block';

    let filtered = orders;
    if(orderFilter !== 'all') filtered = orders.filter(o => o.status === orderFilter);
    if(!filtered.length){
      list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><h3>Chưa có đơn hàng</h3><p>Đặt món ngon ngay bây giờ!</p><button class="btn-main" style="max-width:180px;margin:1rem auto 0" onclick="showPage('menu')">Đặt hàng ngay</button></div>`;
      return;
    }

    const sMap = {pending:{cls:'s-pend', icon:'⏳', txt:'Đang xử lý'}, delivering:{cls:'s-deli', icon:'🛵', txt:'Đang giao'}, done:{cls:'s-done', icon:'✅', txt:'Hoàn thành'}, cancelled:{cls:'s-canc', icon:'❌', txt:'Đã hủy'}};
    list.innerHTML = filtered.map(o => {
      const s = sMap[o.status] || sMap.done;
      return `<div class="order-card">
        <div class="oc-top">
          <div><div class="oc-id">${o.id}</div><div class="oc-date">${o.date}</div></div>
          <div class="s-badge ${s.cls}">${s.icon} ${s.txt}</div>
        </div>
        <div class="oc-items">
          ${(o.thumbs || []).map(img => `<div class="oc-thumb"><img src="${img}" alt=""></div>`).join('')}
          <div style="flex-shrink:0;font-size:12px;color:var(--muted);align-self:center;padding-left:4px">${o.items}</div>
        </div>
        <div class="oc-bot">
          <div class="oc-total">${fmt(o.total)}</div>
          <div class="oc-actions">
            ${o.status === 'delivering' ? `<button class="oc-act-btn primary" onclick="markOrderReceived('${o.id}')">Đã nhận hàng</button>` : ''}
            ${o.status === 'done' && !o.isReviewed ? `<button class="oc-act-btn primary" onclick="openReviewModal('${o.id}')">Đánh giá</button>` : ''}
            ${o.status === 'done' ? `<button class="oc-act-btn" onclick="reorder('${o.id}')">Đặt lại</button>` : ''}
            ${o.status === 'pending' ? `<button class="oc-act-btn" style="color:var(--red);border-color:var(--red)" onclick="cancelOrder('${o.id}')">Hủy đơn</button>` : ''}
            <button class="oc-act-btn" onclick="showToast('📞 Gọi hỗ trợ: 1800-6868')">Hỗ trợ</button>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  function filterOrders(f, el){
    orderFilter = f;
    document.querySelectorAll('.of-btn').forEach(b => b.classList.remove('active'));
    if(el) el.classList.add('active');
    renderOrders();
  }

  function reorder(orderId){
    const order = orders.find(o => String(o.id) === String(orderId));
    if(!order || !Array.isArray(order.itemsText)){ showToast('⚠️ Không thể đặt lại đơn hàng này', '', 'err'); return; }
    cart = {};
    order.itemsText.forEach(item => {
      const baseName = item.name.split(' (')[0];
      const found = (window.MENU || []).find(m => m.name === baseName);
      if(found){
        let size = 'M';
        let toppings = [];
        const match = item.name.match(/\(([^)]+)\)/);
        if(match){
          const parts = match[1].split(' + ');
          size = parts[0] || 'M';
          if(parts[1]) toppings = parts[1].split(', ').map(t => t.trim());
        }
        const price = found.price + (sizeAdd[size] || 0);
        const cartKey = `${found.id}-${size}-${toppings.slice().sort().join(',')}`;
        cart[cartKey] = {item: found, qty: item.qty || 1, price, size, toppings};
      }
    });
    updateCartUI();
    renderMenu();
    showToast('🛒 Đã thêm lại món từ đơn hàng vào giỏ', true);
    showPage('menu');
  }

  function markOrderReceived(orderId){
    const idx = orders.findIndex(o => String(o.id) === String(orderId));
    if(idx === -1) return;
    orders[idx].status = 'done';
    saveUserScopedData('orders', orders);
    renderOrders();
    renderAdminOrders();
    renderAdminDashboard();
    showToast('✅ Đơn hàng đã được xác nhận hoàn thành', true);
  }

  function cancelOrder(orderId){
    const idx = orders.findIndex(o => String(o.id) === String(orderId));
    if(idx === -1) return;
    orders[idx].status = 'cancelled';
    saveUserScopedData('orders', orders);
    renderOrders();
    renderAdminOrders();
    renderAdminDashboard();
    showToast('Đã hủy đơn hàng', false, 'err');
  }

  function openReviewModal(orderId){
    const order = orders.find(o => String(o.id) === String(orderId));
    if(!order) return;
    reviewOrder = order;
    const container = document.getElementById('review-items-container');
    if(!container) return;
    container.innerHTML = (order.itemsText || []).map((item, idx) => {
      const baseName = item.name.split(' (')[0];
      const foundItem = (window.MENU || []).find(m => m.name === baseName) || {id: null};
      return `
        <div class="review-item-form" data-item-id="${foundItem.id}" data-item-name="${baseName}" style="padding-bottom:1rem;border-bottom:1px dashed var(--border)">
          <div style="font-weight:700;font-size:14px;color:var(--text);margin-bottom:8px">${item.name}</div>
          <div class="star-rating" style="display:flex;gap:6px;font-size:24px;color:var(--muted2);cursor:pointer;margin-bottom:8px">
            <span onclick="setReviewStars(${idx}, 1, this)" data-val="1">★</span>
            <span onclick="setReviewStars(${idx}, 2, this)" data-val="2">★</span>
            <span onclick="setReviewStars(${idx}, 3, this)" data-val="3">★</span>
            <span onclick="setReviewStars(${idx}, 4, this)" data-val="4">★</span>
            <span onclick="setReviewStars(${idx}, 5, this)" data-val="5">★</span>
          </div>
          <textarea class="f-in" rows="2" placeholder="Chia sẻ cảm nhận của bạn về món này..." style="resize:none;font-size:13px;width:100%" id="rev-text-${idx}"></textarea>
          <input type="hidden" id="rev-stars-${idx}" value="0">
        </div>`;
    }).join('');
    openModal('review-modal');
  }

  function setReviewStars(itemIdx, stars, el){
    const parent = el.parentNode;
    const starsSpans = parent.querySelectorAll('span');
    starsSpans.forEach((span, index) => {
      span.style.color = index < stars ? 'var(--yellow)' : 'var(--muted2)';
    });
    document.getElementById(`rev-stars-${itemIdx}`).value = stars;
  }

  function submitAllReviews(){
    if(!reviewOrder) return;
    const forms = document.querySelectorAll('.review-item-form');
    const localReviews = JSON.parse(localStorage.getItem('pgd_reviews') || '[]');
    let addedAny = false;
    forms.forEach((form, idx) => {
      const itemId = Number(form.dataset.itemId);
      const itemName = form.dataset.itemName;
      const stars = Number(document.getElementById(`rev-stars-${idx}`).value);
      const text = document.getElementById(`rev-text-${idx}`).value.trim();
      if(stars > 0 && itemId){
        localReviews.push({id: Date.now() + Math.random(), itemId, name: userName || 'Khách hàng', date: new Date().toLocaleDateString('vi-VN'), text: text || 'Đồ ăn rất ngon!', stars});
        addedAny = true;
      }
    });
    if(!addedAny){ showToast('⚠️ Vui lòng chọn số sao đánh giá cho ít nhất một món', '', 'err'); return; }
    localStorage.setItem('pgd_reviews', JSON.stringify(localReviews));
    const idx = orders.findIndex(o => o.id === reviewOrder.id);
    if(idx !== -1){ orders[idx].isReviewed = true; saveUserScopedData('orders', orders); }
    closeModal('review-modal');
    showToast('🎉 Cảm ơn bạn đã gửi đánh giá!', true);
    renderOrders();
    renderMenu();
  }

  function showPage(p){
    if((p === 'orders' || p === 'profile') && !loggedIn){ window.location.href = 'src/partials/auth.html?tab=login'; return; }
    const newPage = document.getElementById('page-' + p);
    if(!newPage) return;
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    newPage.classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const nb = document.getElementById('nav-' + p);
    if(nb) nb.classList.add('active');
    if(p === 'orders') renderOrders();
    if(p === 'profile') updateProfileUI();
    if(p === 'admin') updateAdminUI();
    if(p === 'menu') renderMenu();
    document.documentElement.scrollTop = 0;
    window.scrollTo({top:0, behavior:'smooth'});
    checkElementsInView();
  }

  function toggleSupportPanel(){
    const panel = document.getElementById('support-panel');
    if(panel) panel.classList.toggle('open');
  }

  function addSupportMessage(text, isUser){
    const log = document.getElementById('support-chat-log');
    if(!log) return;
    const msg = document.createElement('div');
    msg.className = `support-msg ${isUser ? 'user' : 'bot'}`;
    msg.textContent = text;
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
  }

  function getSupportReply(message){
    const text = message.toLowerCase();
    if(text.includes('đặt') || text.includes('order') || text.includes('món')) return 'Bạn chỉ cần chọn món, thêm vào giỏ, điền địa chỉ và bấm Đặt hàng ngay. Nếu cần, mình có thể hướng dẫn từng bước.';
    if(text.includes('giao') || text.includes('bao lâu') || text.includes('thời gian')) return 'Thời gian giao thường từ 30–45 phút, tùy khu vực và giờ cao điểm.';
    if(text.includes('hủy') || text.includes('cancel') || text.includes('hủy đơn')) return 'Bạn có thể hủy đơn khi đơn đang ở trạng thái Đang xử lý trong phần Đơn hàng của mình.';
    if(text.includes('thanh toán') || text.includes('momo') || text.includes('zalopay') || text.includes('vnpay') || text.includes('cod') || text.includes('visa') || text.includes('master')) return 'Chúng tôi hỗ trợ COD, MoMo, ZaloPay, VNPay và thẻ Visa/Mastercard.';
    if(text.includes('địa chỉ') || text.includes('số điện thoại') || text.includes('liên hệ')) return 'Bạn có thể cập nhật địa chỉ và số điện thoại trong phần hồ sơ hoặc khi xác nhận đơn.';
    return 'Cảm ơn bạn đã hỏi. Mình có thể hỗ trợ về đặt món, thanh toán, hủy đơn hoặc thời gian giao hàng.';
  }

  function sendSupportMessage(){
    const input = document.getElementById('support-input');
    if(!input) return;
    const text = input.value.trim();
    if(!text) return;
    addSupportMessage(text, true);
    input.value = '';
    setTimeout(() => addSupportMessage(getSupportReply(text), false), 300);
  }

  function sendQuickSupport(text){
    const input = document.getElementById('support-input');
    if(input){ input.value = text; sendSupportMessage(); }
  }

  window.doLogin = doLogin;
  window.doRegister = doRegister;
  window.doSocialLogin = doSocialLogin;
  window.finishLogin = finishLogin;
  window.openLoginModal = openLoginModal;
  window.clearAuthState = clearAuthState;
  window.doLogout = doLogout;
  window.updateNavAuthUI = updateNavAuthUI;
  window.updateProfileUI = updateProfileUI;
  window.saveProfile = saveProfile;
  window.toggleNotification = toggleNotification;
  window.openPasswordSection = openPasswordSection;
  window.changePassword = changePassword;
  window.renderAddressList = renderAddressList;
  window.openAddressModal = openAddressModal;
  window.saveAddressModal = saveAddressModal;
  window.renderOrders = renderOrders;
  window.filterOrders = filterOrders;
  window.reorder = reorder;
  window.markOrderReceived = markOrderReceived;
  window.cancelOrder = cancelOrder;
  window.openReviewModal = openReviewModal;
  window.setReviewStars = setReviewStars;
  window.submitAllReviews = submitAllReviews;
  window.showPage = showPage;
  window.toggleSupportPanel = toggleSupportPanel;
  window.sendSupportMessage = sendSupportMessage;
  window.sendQuickSupport = sendQuickSupport;
})();

