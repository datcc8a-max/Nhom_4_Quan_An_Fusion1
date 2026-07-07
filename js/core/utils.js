// ── UTILS ──
function fmt(n){ return (n===undefined||n===null)?'0đ':Number(n).toLocaleString('vi-VN') + 'đ'; }

function normalizeText(str) {
  if (!str) return '';
  return str.toString()
    .toLowerCase()
    // Thay thế các ký tự cơ sở tiếng Việt trước khi normalize
    .replace(/[àáạảã]/g, 'a').replace(/[âầấậẩẫ]/g, 'a').replace(/[ăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽ]/g, 'e').replace(/[êềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõ]/g, 'o').replace(/[ôồốộổỗ]/g, 'o').replace(/[ơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũ]/g, 'u').replace(/[ưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/[đ]/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function toggleSupportPanel(){
  const panel=document.getElementById('support-panel');
  if(panel) panel.classList.toggle('open');
}

function addSupportMessage(text, isUser){
  const log=document.getElementById('support-chat-log');
  if(!log) return;
  const msg=document.createElement('div');
  msg.className=`support-msg ${isUser ? 'user' : 'bot'}`;
  msg.textContent=text;
  log.appendChild(msg);
  log.scrollTop=log.scrollHeight;
}

function getSupportReply(message){
  const text=message.toLowerCase();
  if(text.includes('đặt') || text.includes('order') || text.includes('món')) return 'Bạn chỉ cần chọn món, thêm vào giỏ, điền địa chỉ và bấm Đặt hàng ngay. Nếu cần, mình có thể hướng dẫn từng bước.';
  if(text.includes('giao') || text.includes('bao lâu') || text.includes('thời gian')) return 'Thời gian giao thường từ 30–45 phút, tùy khu vực và giờ cao điểm.';
  if(text.includes('hủy') || text.includes('cancel') || text.includes('hủy đơn')) return 'Bạn có thể hủy đơn khi đơn đang ở trạng thái Đang xử lý trong phần Đơn hàng của mình.';
  if(text.includes('thanh toán') || text.includes('momo') || text.includes('zalopay') || text.includes('vnpay') || text.includes('cod') || text.includes('visa') || text.includes('master')) return 'Chúng tôi hỗ trợ COD, MoMo, ZaloPay, VNPay và thẻ Visa/Mastercard.';
  if(text.includes('địa chỉ') || text.includes('số điện thoại') || text.includes('liên hệ')) return 'Bạn có thể cập nhật địa chỉ và số điện thoại trong phần hồ sơ hoặc khi xác nhận đơn.';
  return 'Cảm ơn bạn đã hỏi. Mình có thể hỗ trợ về đặt món, thanh toán, hủy đơn hoặc thời gian giao hàng.';
}

function sendSupportMessage(){
  const input=document.getElementById('support-input');
  if(!input) return;
  const text=input.value.trim();
  if(!text) return;
  addSupportMessage(text, true);
  input.value='';
  setTimeout(() => {
    addSupportMessage(getSupportReply(text), false);
  }, 300);
}

function sendQuickSupport(text){
  const input=document.getElementById('support-input');
  if(input){
    input.value=text;
    sendSupportMessage();
  }
}

function showPage(p){
  if((p === 'orders' || p === 'profile') && !loggedIn){
    window.location.href = 'src/partials/auth.html?tab=login';
    return;
  }

  const newPage = document.getElementById('page-'+p);
  if(!newPage) return;
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  newPage.classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const nb=document.getElementById('nav-'+p);if(nb)nb.classList.add('active');

  if(p==='orders') renderOrders();
  if(p==='profile') updateProfileUI();
  if(p==='admin') updateAdminUI();
  if(p==='menu') renderMenu();
  document.documentElement.scrollTop = 0;
  window.scrollTo({top:0,behavior:'smooth'});
  checkElementsInView();
}
function openModal(id){
  const modal = document.getElementById(id);
  if(!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id){
    const modal = document.getElementById(id);
    if(!modal) return;
    modal.style.animation = 'slide-up .4s reverse ease-out';
    setTimeout(() => {
        modal.classList.remove('open');
        modal.style.animation = '';
        if(!document.querySelectorAll('.ov.open').length) document.body.style.overflow = '';
    }, 400);
}
function closeOvOutside(e,id){if(e.target===e.currentTarget)closeModal(id)}
let toastTimer;
function showToast(msg,ok,type){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.className='toast show'+(ok?' ok':type==='err'?' err':'');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2800);
}
let reviewOrder = null;






// close modals on ESC
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.ov.open').forEach(el=>closeModal(el.id))});
window.addEventListener('storage', (e) => {
  if(e.key === 'pgd_current_user'){
    const storedUser = JSON.parse(localStorage.getItem('pgd_current_user') || 'null');
    if(storedUser){
      currentUser = storedUser;
      loggedIn = true;
      userName = `${storedUser.firstName} ${storedUser.lastName}`.trim();
      userPhone = storedUser.phone || '';
    } else {
      clearAuthState();
    }
    reloadUserScopedData();
    updateProfileUI();
    renderOrders();
    updateNavAuthUI();
    const isProfilePage = document.getElementById('page-profile').classList.contains('active');
    const isOrdersPage = document.getElementById('page-orders').classList.contains('active');
    if(!loggedIn && (isProfilePage || isOrdersPage)){
      showPage('menu');
    }
  }
});

