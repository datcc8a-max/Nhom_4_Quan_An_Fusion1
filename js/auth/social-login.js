// ── AUTH/social-login.js - Đăng nhập mạng xã hội ──

let googleClient = null;

function initGoogleClient() {
  if (typeof google === 'undefined' || !google.accounts) {
    console.error('Google SDK chưa được tải.');
    return;
  }
  
  // Khởi tạo Token Client của Google
  googleClient = google.accounts.oauth2.initTokenClient({
    client_id: '580681070451-qb81c30t3qccjh8oi413hj41u11io8f2.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    callback: (tokenResponse) => {
      if (tokenResponse && tokenResponse.access_token) {
        const msg = document.getElementById('msg');
        if (msg) { 
          msg.textContent = `⏳ Đang lấy thông tin từ Google…`; 
          msg.className = 'msg'; 
        }
        
        // Dùng Access Token để lấy thông tin user
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        })
        .then(res => res.json())
        .then(data => {
          // data chứa email, name, picture...
          window.completeSocialLogin('Google', data.email, data.name, data.picture);
        })
        .catch(err => {
          console.error(err);
          if (msg) { 
            msg.textContent = `❌ Lỗi lấy thông tin Google.`; 
            msg.className = 'msg err'; 
          }
        });
      }
    },
  });
}

function doSocialLogin(provider) {
  const msg = document.getElementById('msg');

  if (provider === 'Google') {
    if (!googleClient) {
      initGoogleClient();
    }
    if (googleClient) {
      if (msg) { 
        msg.textContent = `⏳ Đang kết nối Google…`; 
        msg.className = 'msg'; 
      }
      googleClient.requestAccessToken();
    } else {
      if (msg) { 
        msg.textContent = `❌ Lỗi: Chưa tải được thư viện Google.`; 
        msg.className = 'msg err'; 
      }
    }
  } else {
    // Tạm thời báo lỗi nếu chọn nền tảng khác (ví dụ Facebook)
    if (msg) { 
      msg.textContent = `❌ Đăng nhập ${provider} đang được bảo trì.`; 
      msg.className = 'msg err'; 
    }
  }
}

window.completeSocialLogin = function(provider, email, name, avatar) {
  const msg = document.getElementById('msg');
  if (msg) { 
    msg.textContent = `✅ Xác thực ${provider} thành công! Đang chuyển…`; 
    msg.className = 'msg ok'; 
  }

  const username = email ? email.split('@')[0] : 'user';

  const mockUser = {
    id: 'social-' + Date.now(),
    firstName: name || username,
    lastName: '',
    phone: '',
    email: email || `${provider.toLowerCase()}user@demo.vn`,
    password: 'social-login',
    username: username,
    provider: provider,
    avatar: avatar || '',
    points: 0,
    createdAt: new Date().toISOString(),
  };

  const users = storageGet(STORAGE_KEYS.USERS, []);
  // Tìm user dựa theo email
  const existingIndex = users.findIndex(u => u.email === mockUser.email);
  
  if (existingIndex >= 0) {
    // Cập nhật thông tin avatar/name mới nhất
    if(avatar) users[existingIndex].avatar = avatar;
    if(name && !users[existingIndex].firstName) users[existingIndex].firstName = name;
    storageSet(STORAGE_KEYS.USERS, users);
    storageSet(STORAGE_KEYS.CURRENT_USER, users[existingIndex]);
  } else {
    users.push(mockUser);
    storageSet(STORAGE_KEYS.USERS, users);
    storageSet(STORAGE_KEYS.CURRENT_USER, mockUser);
  }

  // Quay lại trang chủ sau 1 giây
  setTimeout(() => { window.location.reload(); }, 1000);
};

window.doSocialLogin = doSocialLogin;
