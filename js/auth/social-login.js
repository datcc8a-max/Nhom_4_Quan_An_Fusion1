// ── AUTH/social-login.js - Đăng nhập mạng xã hội ──

let socialPopup = null;
let socialInterval = null;

function doSocialLogin(provider) {
  const msg = document.getElementById('msg');
  if (msg) { 
    msg.textContent = `⏳ Đang mở cửa sổ bảo mật của ${provider}…`; 
    msg.className = 'msg'; 
  }

  // URL của trang mock - tính từ auth.html ở src/partials/
  const popupUrl = provider === 'Google' ? 'mock-google.html' : 'mock-facebook.html';
  
  const w = 450, h = 600;
  const left = (screen.width/2)-(w/2);
  const top = (screen.height/2)-(h/2);

  localStorage.removeItem('social_login_pending');

  socialPopup = window.open(popupUrl, 'oauth', `toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no,width=${w},height=${h},top=${top},left=${left}`);
  
  if (socialPopup && window.focus) socialPopup.focus();

  if (!socialPopup || socialPopup.closed || typeof socialPopup.closed === 'undefined') { 
    alert('Trình duyệt của bạn đã chặn cửa sổ Pop-up. Vui lòng cho phép Pop-up để đăng nhập bằng ' + provider + '.');
    return;
  }

  if (socialInterval) clearInterval(socialInterval);
  socialInterval = setInterval(() => {
    if (socialPopup && socialPopup.closed && !localStorage.getItem('social_login_pending')) {
      clearInterval(socialInterval);
      if (msg) { msg.textContent = 'Đã đóng cửa sổ.'; msg.className = 'msg'; }
    }
    
    const pending = localStorage.getItem('social_login_pending');
    if (pending) {
      clearInterval(socialInterval);
      localStorage.removeItem('social_login_pending');
      try {
        const data = JSON.parse(pending);
        window.completeSocialLogin(data.provider, data.email);
      } catch(e) {}
    }
  }, 500);
}

window.completeSocialLogin = function(provider, email) {
  const msg = document.getElementById('msg');
  if (msg) { 
    msg.textContent = `✅ Xác thực ${provider} thành công! Đang chuyển…`; 
    msg.className = 'msg ok'; 
  }

  const username = email ? email.split('@')[0] : 'user';

  const mockUser = {
    id: Date.now(),
    firstName: username,
    lastName: '',
    phone: '',
    email: email || `${provider.toLowerCase()}user@demo.vn`,
    password: '',
    username: username,
    provider: provider,
    points: 0,
    createdAt: new Date().toISOString(),
  };

  const users = storageGet(STORAGE_KEYS.USERS, []);
  const existing = users.find(u => u.email === mockUser.email);
  const finalUser = existing || mockUser;
  
  if (!existing) { 
    users.push(finalUser); 
    storageSet(STORAGE_KEYS.USERS, users); 
  }
  
  storageSet(STORAGE_KEYS.CURRENT_USER, finalUser);

  // Quay lại trang index.html
  setTimeout(() => { window.history.back(); }, 800);
};

window.doSocialLogin = doSocialLogin;
