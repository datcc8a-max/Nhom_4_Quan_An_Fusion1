// ── CHECKOUT ──
const pad = n => String(n).padStart(2, '0');

function openCheckout(){
  const ids=Object.keys(cart).filter(k=>cart[k].qty>0);
  if(!ids.length)return;
  
  let points = 0;
  if(loggedIn){
    const totalSpent=orders.reduce((sum,o)=>sum+Number(o.total||0),0);
    const pointsUsed = orders.reduce((sum, o) => sum + (o.pointsRedeemed || 0), 0);
    points = Math.max(0, Math.floor(totalSpent/50000) - pointsUsed);
  }
  
  const pointsBox = document.getElementById('points-redemption-box');
  const pointsInput = document.getElementById('ck-use-points');
  const availPointsSpan = document.getElementById('ck-avail-points');
  const pointsValSpan = document.getElementById('ck-points-val');
  
  if(loggedIn && points > 0){
    if(pointsBox) pointsBox.style.display = 'block';
    if(availPointsSpan) availPointsSpan.textContent = points;
    if(pointsValSpan) pointsValSpan.textContent = fmt(points * 5000);
    if(pointsInput) pointsInput.checked = false;
  } else {
    if(pointsBox) pointsBox.style.display = 'none';
    if(pointsInput) pointsInput.checked = false;
  }

  updCheckoutTotal();

  selectedPayment='cod';
  document.querySelectorAll('.pay-opt').forEach((opt)=>opt.classList.remove('sel'));
  const firstOpt=document.querySelector('#pay-opts .pay-opt');
  if(firstOpt) firstOpt.classList.add('sel');
  openModal('ck-modal');
}

function updCheckoutTotal(){
  const ids=Object.keys(cart).filter(k=>cart[k].qty>0);
  if(!ids.length)return;
  let sub=ids.reduce((s,k)=>s+(cart[k].price)*cart[k].qty,0);
  let ship=sub>=150000||discountCode==='FREESHIP'?0:15000;
  
  let pointsDiscount = 0;
  const pointsInput = document.getElementById('ck-use-points');
  if(pointsInput && pointsInput.checked && loggedIn){
    const totalSpent=orders.reduce((sum,o)=>sum+Number(o.total||0),0);
    const pointsUsed = orders.reduce((sum, o) => sum + (o.pointsRedeemed || 0), 0);
    const points = Math.max(0, Math.floor(totalSpent/50000) - pointsUsed);
    pointsDiscount = points * 5000;
  }

  let total=Math.max(0,sub+ship-discount-pointsDiscount);
  const box=document.getElementById('ck-summary-box');
  box.innerHTML=`<div style="font-weight:700;font-size:13px;margin-bottom:10px;color:var(--text)">Chi tiết đơn hàng</div>`+
    ids.slice(0,4).map(k=>{
      const ci=cart[k];
      const customizeText = `${ci.size}${ci.toppings.length ? ' + ' + ci.toppings.join(', ') : ''}`;
      return `<div class="ck-sum-item"><span>${ci.item.name} (${customizeText}) ×${ci.qty}</span><span>${fmt(ci.price*ci.qty)}</span></div>`;
    }).join('')+
    (ids.length>4?`<div class="ck-sum-item"><span style="color:var(--muted)">... và ${ids.length-4} món khác</span></div>`:'')+
    `<div class="ck-sum-item"><span>Tạm tính</span><span>${fmt(sub)}</span></div>`+
    `<div class="ck-sum-item"><span>Phí giao</span><span>${ship===0?'Miễn phí':fmt(ship)}</span></div>`+
    (discount>0?`<div class="ck-sum-item" style="color:var(--green)"><span>Giảm giá</span><span>−${fmt(discount)}</span></div>`:'')+
    (pointsDiscount>0?`<div class="ck-sum-item" style="color:var(--green)"><span>Dùng điểm</span><span>−${fmt(pointsDiscount)}</span></div>`:'')+
    `<div class="ck-sum-item tot"><span>Tổng cộng</span><span style="color:var(--orange)">${fmt(total)}</span></div>`;

  const nameInput=document.getElementById('ck-name');
  const phoneInput=document.getElementById('ck-phone');
  const addrInput=document.getElementById('ck-addr');
  if(nameInput) nameInput.value = loggedIn ? userName : (nameInput.value || '');
  if(phoneInput) phoneInput.value = loggedIn ? userPhone||'' : (phoneInput.value || '');
  if(addrInput){
    const savedAddress = loggedIn
      ? (addresses && Object.values(addresses).find(v => typeof v === 'string' && v.trim()) || '')
      : '';
    const fallbackAddr = savedAddress || (userLocation ? userLocationLabel : '');
    addrInput.value = addrInput.value || fallbackAddr || '';
  }
}

function selPay(el,v){
  selectedPayment=v;
  document.querySelectorAll('.pay-opt').forEach(e=>e.classList.remove('sel'));
  el.classList.add('sel');
}

function confirmOrder(){
  const name=document.getElementById('ck-name').value.trim();
  const phone=document.getElementById('ck-phone').value.trim();
  const addr=document.getElementById('ck-addr').value.trim();
  if(!name||!phone||!addr){showToast('⚠️ Vui lòng điền đầy đủ thông tin giao hàng','','err');return}

  const ids=Object.keys(cart).filter(k=>cart[k].qty>0);
  if(!ids.length){showToast('🛒 Giỏ hàng đang trống','','err');return}
  const sub=ids.reduce((s,k)=>s+(cart[k].price)*cart[k].qty,0);
  const ship=sub>=150000||discountCode==='FREESHIP'?0:15000;
  
  let pointsRedeemed = 0;
  let pointsDiscount = 0;
  const pointsInput = document.getElementById('ck-use-points');
  if(pointsInput && pointsInput.checked && loggedIn){
    const totalSpent=orders.reduce((sum,o)=>sum+Number(o.total||0),0);
    const pointsUsed = orders.reduce((sum, o) => sum + (o.pointsRedeemed || 0), 0);
    pointsRedeemed = Math.max(0, Math.floor(totalSpent/50000) - pointsUsed);
    pointsDiscount = pointsRedeemed * 5000;
  }

  const total=Math.max(0,sub+ship-discount-pointsDiscount);
  const oid='#PGD'+String(Date.now()).slice(-5);
  const now=new Date();
  const eta=new Date(now.getTime()+35*60000);
  const etaStr=pad(eta.getHours())+':'+pad(eta.getMinutes());
  const payMap={'cod':'Tiền mặt (COD)','momo':'MoMo','zalopay':'ZaloPay','vnpay':'VNPay','card':'Visa / Mastercard','bank':'Chuyển khoản MB Bank'};
  const pay=payMap[selectedPayment]||payMap.cod;

  const orderItems = ids.map(k=>({
    name: `${cart[k].item.name} (${cart[k].size}${cart[k].toppings.length ? ' + ' + cart[k].toppings.join(', ') : ''})`,
    qty: cart[k].qty
  }));
  const order={id:oid,date:now.toLocaleString('vi-VN'),createdAt:now.toISOString(),items:orderItems.map(i=>`${i.name} ×${i.qty}`).join(', '),
    itemsText:orderItems,thumbs:ids.slice(0,4).map(k=>cart[k].item.img),total,name,phone,addr,pay,status:'pending',
    shipper:'',pointsRedeemed};

  if (['momo', 'zalopay', 'vnpay', 'bank'].includes(selectedPayment)) {
    window.pendingOrder = order;
    openGatewayModal(selectedPayment, total);
    return;
  }

  finalizeOrder(order);
}

function finalizeOrder(order) {
  orders.unshift(order);
  saveUserScopedData('orders', orders);

  const eta=new Date(new Date(order.createdAt).getTime()+35*60000);
  const etaStr=pad(eta.getHours())+':'+pad(eta.getMinutes());

  document.getElementById('success-oid').textContent=order.id;
  document.getElementById('success-eta').textContent=etaStr;
  document.getElementById('success-total').textContent=fmt(order.total);

  cart={};discount=0;discountCode='';
  updateCartUI();renderMenu();
  closeModal('ck-modal');
  openModal('success-modal');
  renderOrders();
  if(loggedIn){const el=document.getElementById('ps-orders');if(el)el.textContent=orders.length;}
}

let gatewayTimerInt = null;
function openGatewayModal(method, amount) {
  closeModal('ck-modal');
  const title = document.getElementById('gateway-title');
  const logo = document.getElementById('gateway-logo');
  const qr = document.getElementById('gateway-qr');
  const amountEl = document.getElementById('gateway-amount');
  const accountEl = document.getElementById('gateway-account');
  const contentEl = document.getElementById('gateway-content');
  
  const qrData = method.toUpperCase() + '-TranVanDat-' + amount;
  qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrData}`;
  amountEl.textContent = fmt(amount);
  
  if (method === 'momo') {
    title.innerText = 'Thanh toán qua MoMo';
    logo.src = 'images/payment/momo.svg';
  } else if (method === 'zalopay') {
    title.innerText = 'Thanh toán qua ZaloPay';
    logo.src = 'images/payment/zalopay.png';
  } else if (method === 'vnpay') {
    title.innerText = 'Thanh toán qua VNPay';
    logo.src = 'images/payment/vnpay.svg';
  } else if (method === 'bank') {
    title.innerText = 'Thanh toán qua MB Bank';
    logo.src = 'images/payment/mbbank.png';
  }
  
  openModal('gateway-modal');
  
  let time = 15 * 60;
  const timerEl = document.getElementById('gateway-timer');
  timerEl.textContent = '15:00';
  clearInterval(gatewayTimerInt);
  gatewayTimerInt = setInterval(() => {
    time--;
    if(time < 0) { clearInterval(gatewayTimerInt); return; }
    const m = Math.floor(time / 60);
    const s = time % 60;
    timerEl.textContent = pad(m) + ':' + pad(s);
  }, 1000);
}

function confirmGatewayPayment() {
  clearInterval(gatewayTimerInt);
  closeModal('gateway-modal');
  if (window.pendingOrder) {
    finalizeOrder(window.pendingOrder);
    window.pendingOrder = null;
    
    // Auto redirect after 2.5 seconds
    setTimeout(() => {
      closeModal('success-modal');
      showPage('orders');
    }, 2500);
  }
}

