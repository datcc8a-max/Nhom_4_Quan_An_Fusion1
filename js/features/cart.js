// ── CART ──
function quickAdd(id){
  const quickItem = (window.MENU||[]).find(i=>i.id===id);
  if(quickItem) addToCart(id,1,quickItem.price,'M',[]);
}
function addToCart(id,qty,price,size = 'M',toppings = []){
  const item=(window.MENU||[]).find(i=>i.id===id);
  if(!item)return;
  const cartKey = `${id}-${size}-${toppings.sort().join(',')}`;
  if(!cart[cartKey]){
    cart[cartKey]={item,qty:0,price,size,toppings};
  }
  cart[cartKey].qty+=qty;
  updateCartUI();
  animateBadge();
  showToast(`🛒 Đã thêm "${item.name} (${size})"`,true);
  renderMenu();
}
function changeCartQty(cartKey,d){
  if(!cart[cartKey])return;
  cart[cartKey].qty=Math.max(0,cart[cartKey].qty+d);
  if(cart[cartKey].qty===0)delete cart[cartKey];
  updateCartUI();
  renderMenu();
}
function clearCart(){
  if(!Object.keys(cart).length)return;
  cart={};discount=0;discountCode='';
  updateCartUI();renderMenu();
  showToast('🗑 Đã xóa giỏ hàng');
}
function animateBadge(){
  const b=document.getElementById('cart-count');
  b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');
}

function updateCartUI(){
  const ids=Object.keys(cart).filter(k=>cart[k].qty>0);
  const count=ids.reduce((s,k)=>s+cart[k].qty,0);
  document.getElementById('cart-count').textContent=count;
  const countTagEls=document.querySelectorAll('[id="cart-count-tag"]');
  countTagEls.forEach(el=>el.textContent=count+' món');

  const dropdownBody=document.getElementById('cart-dropdown-body');
  const dropdownBot=document.getElementById('cart-dropdown-bot');
  const body=document.getElementById('cart-body');
  const bot=document.getElementById('cart-bot');

  const renderCart = (targetBody, targetBot) => {
    if(!ids.length){
      targetBody.innerHTML=`<div class="cart-empty-state"><img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=160&h=160&fit=crop" alt=""><p style="font-weight:700;font-size:14px;color:var(--text);margin-bottom:4px">Giỏ hàng đang trống</p><p>Chọn món ngon và thêm vào đây nhé!</p></div>`;
      targetBot.style.display='none';
      return;
    }
    let subtotal=ids.reduce((s,k)=>s+(cart[k].price)*cart[k].qty,0);
    let ship=15000;
    if(subtotal>=150000)ship=0;
    if(discountCode==='FREESHIP')ship=0;
    let discAmt=discount;
    let total=Math.max(0,subtotal+ship-discAmt);

    targetBody.innerHTML=`<div class="cart-items">${ids.map(k=>{
      const ci=cart[k];
      const customizeText = `${ci.size}${ci.toppings.length ? ' + ' + ci.toppings.join(', ') : ''}`;
      return `<div class="ci">
        <div class="ci-img"><img src="${ci.item.img}" alt="${ci.item.name}"></div>
        <div class="ci-info">
          <div class="ci-name">${ci.item.name}</div>
          <div class="ci-sub" style="font-size:11px;color:var(--muted)">${customizeText}</div>
          <div class="ci-price">${fmt((ci.price)*ci.qty)}</div>
        </div>
        <div class="qty-ctrl">
          <button class="qb" onclick="changeCartQty('${k}',-1)">−</button>
          <span class="qn">${ci.qty}</span>
          <button class="qb" onclick="changeCartQty('${k}',1)">+</button>
        </div>
      </div>`;
    }).join('')}</div>`;

    targetBot.style.display='block';
    targetBot.querySelector('#s-sub').textContent=fmt(subtotal);
    targetBot.querySelector('#s-ship').textContent=ship===0?'Miễn phí 🎉':fmt(ship);
    targetBot.querySelector('#s-total').textContent=fmt(total);
    const discRow=targetBot.querySelector('#s-disc-row');
    const discAmtEl=targetBot.querySelector('#s-disc-amt');
    if(discAmt>0||discountCode==='FREESHIP'){
      discRow.style.display='flex';
      discAmtEl.textContent=discountCode==='FREESHIP'?'−'+fmt(15000):'−'+fmt(discAmt);
    }else{
      discRow.style.display='none';
    }
  };

  if(dropdownBody && dropdownBot) renderCart(dropdownBody, dropdownBot);
  if(body && bot) renderCart(body, bot);

  if(!ids.length) discount=0;
}

function applyPromo(){
  const code=(document.getElementById('promo-code').value||'').trim().toUpperCase();
  const p=PROMO_CODES[code];
  if(!p || p.disabled){showToast('❌ Mã không hợp lệ hoặc đang tạm dừng','','err');return}
  discountCode=code;
  const ids=Object.keys(cart).filter(k=>cart[k].qty>0);
  const sub=ids.reduce((s,k)=>s+(cart[k].price)*cart[k].qty,0);
  const v = typeof p.value === 'number' ? p.value : (typeof p.val === 'number' ? p.val : 0);
  if(p.type==='fixed') discount=v;
  else if(p.type==='pct') discount=Math.round(sub*v/100);
  else if(p.type==='ship') discount=0;
  updateCartUI();
  showToast(`✅ ${p.label} đã được áp dụng!`,true);
}


function toggleCartDropdown(){
  const dropdown=document.getElementById('cart-dropdown');
  if(!dropdown) return;
  dropdown.classList.toggle('open');
  if(dropdown.classList.contains('open')) updateCartUI();
}

function closeCartDropdown(){
  const dropdown=document.getElementById('cart-dropdown');
  if(dropdown) dropdown.classList.remove('open');
}

function openCartModal(){
  const ids=Object.keys(cart).filter(k=>cart[k].qty>0);
  const body=document.getElementById('cart-modal-body');
  if(!ids.length){
    body.innerHTML=`<button class="modal-close" onclick="closeModal('cart-modal')">✕</button><div class="cart-empty-state" style="padding:2rem"><img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=160&h=160&fit=crop" alt=""><p style="font-weight:700;font-size:15px;color:var(--text);margin-bottom:4px">Giỏ hàng trống</p><p style="font-size:13px">Thêm món ngon vào đây nhé!</p></div>`;
  }else{
    body.innerHTML=`<button class="modal-close" onclick="closeModal('cart-modal')">✕</button><h2 style="font-size:18px;font-weight:900;color:var(--brown);margin-bottom:1.25rem">Giỏ hàng của bạn</h2><p style="font-size:13px;color:var(--muted);margin-bottom:1.5rem">Xem lại trước khi đặt hàng</p>`+
    ids.map(k=>{
      const ci=cart[k];
      const customizeText = `${ci.size}${ci.toppings.length ? ' + ' + ci.toppings.join(', ') : ''}`;
      return `<div class="ci" style="margin-bottom:14px">
        <div class="ci-img"><img src="${ci.item.img}" alt=""></div>
        <div class="ci-info">
          <div class="ci-name">${ci.item.name}</div>
          <div class="ci-sub" style="font-size:11px;color:var(--muted)">${customizeText}</div>
          <div class="ci-price">${fmt(ci.price*ci.qty)}</div>
        </div>
        <div class="qty-ctrl">
          <button class="qb" onclick="changeCartQty('${k}',-1);openCartModal()">−</button>
          <span class="qn">${ci.qty}</span>
          <button class="qb" onclick="changeCartQty('${k}',1);openCartModal()">+</button>
        </div>
      </div>`;
    }).join('')+
    `<button class="btn-main" style="margin-top:1rem" onclick="closeModal('cart-modal');openCheckout()">Đặt hàng ngay →</button>`;
  }
  openModal('cart-modal');
}

function openPromoModal(){
  const box=document.getElementById('promo-modal-list');
  if(!box) return;
  const activeCodes = Object.entries(PROMO_CODES).filter(([_, p]) => !p.disabled);
  if(!activeCodes.length){
    box.innerHTML = `<div style="padding:1rem 0;color:var(--muted);text-align:center">Hiện chưa có mã ưu đãi nào.</div>`;
  } else {
    box.innerHTML = activeCodes.map(([code, p]) => `
      <div class="menu-list-item" style="padding:12px 0;cursor:default">
        <div class="mli-left">
          <div class="mli-icon">🎟️</div>
          <div>
            <div class="mli-label">${code}</div>
            <div class="mli-sub">${p.label || 'Mã khuyến mãi'}</div>
          </div>
        </div>
        <button class="btn-main" style="width:auto;padding:8px 10px;font-size:12px" onclick="copyPromoCode('${code}')">Sao chép</button>
      </div>
    `).join('');
  }
  openModal('promo-modal');
}

function copyPromoCode(code){
  navigator.clipboard?.writeText(code).then(() => {
    showToast(`✅ Đã sao chép mã ${code}`, true);
  }).catch(() => {
    showToast('⚠️ Không thể sao chép mã', '', 'err');
  });
}
