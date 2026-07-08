// ── ORDERS ──
function renderOrders(){
  const guest=document.getElementById('orders-guest');
  const logged=document.getElementById('orders-logged');
  const list=document.getElementById('orders-list');
  if(!guest || !logged || !list) return;

  if(!loggedIn){
    guest.style.display='block';
    logged.style.display='none';
    return;
  }

  guest.style.display='none';
  logged.style.display='block';

  let filtered=orders;
  if(orderFilter!=='all') filtered=orders.filter(o=>o.status===orderFilter);
  if(!filtered.length){
    list.innerHTML=`<div class="empty-state"><div class="empty-state-icon">📋</div><h3>Chưa có đơn hàng</h3><p>Đặt món ngon ngay bây giờ!</p><button class="btn-main" style="max-width:180px;margin:1rem auto 0" onclick="showPage('menu')">Đặt hàng ngay</button></div>`;
    return;
  }
  const sMap={pending:{cls:'s-pend',icon:'⏳',txt:'Đang xử lý'},delivering:{cls:'s-deli',icon:'🛵',txt:'Đang giao'},done:{cls:'s-done',icon:'✅',txt:'Hoàn thành'},cancelled:{cls:'s-canc',icon:'❌',txt:'Đã hủy'}};
  list.innerHTML=filtered.map((o)=>{
    const s=sMap[o.status]||sMap.done;
    const orderKey = String(o.id || '');
    return `<div class="order-card">
      <div class="oc-top">
        <div><div class="oc-id">${o.id}</div><div class="oc-date">${o.date}</div></div>
        <div class="s-badge ${s.cls}">${s.icon} ${s.txt}</div>
      </div>
      <div class="oc-items">
        ${(o.thumbs||[]).map(img=>`<div class="oc-thumb"><img src="${img}" alt=""></div>`).join('')}
        <div style="flex-shrink:0;font-size:12px;color:var(--muted);align-self:center;padding-left:4px">${o.items}</div>
      </div>
      <div class="oc-bot">
        <div class="oc-total">${fmt(o.total)}</div>
        <div class="oc-actions">
          ${o.status==='delivering'?`<button class="oc-act-btn primary" onclick="markOrderReceived('${orderKey}')">Đã nhận hàng</button>`:''}
          ${o.status==='done' && !o.isReviewed ? `<button class="oc-act-btn primary" onclick="openReviewModal('${orderKey}')">Đánh giá</button>`:''}
          ${o.status==='done'?`<button class="oc-act-btn" onclick="reorder('${orderKey}')">Đặt lại</button>`:''}
          ${o.status==='pending'?`<button class="oc-act-btn" style="color:var(--red);border-color:var(--red)" onclick="cancelOrder('${orderKey}')">Hủy đơn</button>`:''}
          <button class="oc-act-btn" onclick="showToast('📞 Gọi hỗ trợ: 1800-6868')">Hỗ trợ</button>
        </div>
      </div>
    </div>`;
  }).join('');
}
function filterOrders(f,el){
  orderFilter=f;
  document.querySelectorAll('.of-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderOrders();
}
function reorder(orderId){
  const order = orders.find(o => String(o.id) === String(orderId));
  if(!order || !Array.isArray(order.itemsText)){
    showToast('⚠️ Không thể đặt lại đơn hàng này','','err');
    return;
  }
  cart = {};
  order.itemsText.forEach(item => {
    const baseName = item.name.split(' (')[0];
    const found = (window.MENU||[]).find(m => m.name === baseName);
    if(found){
      let size = 'M';
      let toppings = [];
      const match = item.name.match(/\(([^)]+)\)/);
      if(match){
        const parts = match[1].split(' + ');
        size = parts[0] || 'M';
        if(parts[1]){
          toppings = parts[1].split(', ').map(t => t.trim());
        }
      }
      const price = found.price + (sizeAdd[size] || 0);
      const cartKey = `${found.id}-${size}-${toppings.sort().join(',')}`;
      cart[cartKey] = { item: found, qty: item.qty || 1, price, size, toppings };
    }
  });
  updateCartUI();
  renderMenu();
  showToast('🛒 Đã thêm lại món từ đơn hàng vào giỏ',true);
  showPage('menu');
}
function markOrderReceived(orderId){
  const idx = orders.findIndex(o => String(o.id) === String(orderId));
  if(idx === -1) return;
  orders[idx].status='done';
  saveUserScopedData('orders', orders);
  renderOrders();
  renderAdminOrders();
  renderAdminDashboard();
  showToast('✅ Đơn hàng đã được xác nhận hoàn thành',true);
}

function cancelOrder(orderId){
  const idx = orders.findIndex(o => String(o.id) === String(orderId));
  if(idx === -1) return;
  orders[idx].status='cancelled';
  saveUserScopedData('orders', orders);
  renderOrders();
  renderAdminOrders();
  renderAdminDashboard();
  showToast('Đã hủy đơn hàng',false,'err');
}


function openReviewModal(orderId){
  const order = orders.find(o => String(o.id) === String(orderId));
  if(!order) return;
  reviewOrder = order;
  
  const container = document.getElementById('review-items-container');
  if(!container) return;
  
  container.innerHTML = (order.itemsText || []).map((item, idx) => {
    const baseName = item.name.split(' (')[0];
    const foundItem = (window.MENU||[]).find(m => m.name === baseName) || { id: null };
    const itemId = foundItem.id;
    
    return `
      <div class="review-item-form" data-item-id="${itemId}" data-item-name="${baseName}" style="padding-bottom:1rem;border-bottom:1px dashed var(--border)">
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
      </div>
    `;
  }).join('');
  
  openModal('review-modal');
}

function setReviewStars(itemIdx, stars, el){
  const parent = el.parentNode;
  const starsSpans = parent.querySelectorAll('span');
  starsSpans.forEach((span, index) => {
    if(index < stars){
      span.style.color = 'var(--yellow)';
    } else {
      span.style.color = 'var(--muted2)';
    }
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
      const newReview = {
        id: Date.now() + Math.random(),
        itemId,
        name: userName || 'Khách hàng',
        date: new Date().toLocaleDateString('vi-VN'),
        text: text || 'Đồ ăn rất ngon!',
        stars
      };
      localReviews.push(newReview);
      addedAny = true;
    }
  });
  
  if(!addedAny){
    showToast('⚠️ Vui lòng chọn số sao đánh giá cho ít nhất một món','','err');
    return;
  }
  
  localStorage.setItem('pgd_reviews', JSON.stringify(localReviews));
  
  const idx = orders.findIndex(o => o.id === reviewOrder.id);
  if(idx !== -1){
    orders[idx].isReviewed = true;
    saveUserScopedData('orders', orders);
  }
  
  closeModal('review-modal');
  showToast('🎉 Cảm ơn bạn đã gửi đánh giá!', true);
  renderOrders();
  renderMenu();
}
