(function(){
  const STORAGE_KEY = 'pgd_cart';

  window.showModal = function(id){ return typeof window.openModal === 'function' ? window.openModal(id) : null; };

  function ensureGlobalFunctions(){
    if(typeof window.openModal === 'function' && typeof window.showModal !== 'function'){
      window.showModal = window.openModal;
    }
    if(typeof window.showModal !== 'function' && typeof window.openModal === 'function'){
      window.showModal = window.openModal;
    }
    if(typeof window.closeModal !== 'function'){
      window.closeModal = function(id){
        const m = document.getElementById(id);
        if(!m) return;
        m.classList.remove('open');
        document.body.style.overflow = '';
      };
    }

    if(typeof window.loadCart !== 'function'){
      window.loadCart = function(){
        try{
          const raw = localStorage.getItem(STORAGE_KEY);
          if(!raw){ window.cart = {}; return; }
          const parsed = JSON.parse(raw);
          window.cart = parsed && typeof parsed === 'object' ? parsed : {};
          if(typeof cart !== 'undefined') cart = window.cart;
        }catch(e){ window.cart = {}; }
      };
    }

    if(typeof window.saveCart !== 'function'){
      window.saveCart = function(){
        try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(window.cart||{})); }catch(e){}
      };
    }

    if(typeof window.updateCartUI !== 'function'){
      window.updateCartUI = function(){
        const el = document.getElementById('cart-items');
        const countEl = document.getElementById('cart-count');
        if(!el) return;
        const arr = Object.keys(window.cart||{}).map(k => ({ key:k, ...window.cart[k] }));
        el.innerHTML = arr.map(i => `<div class="cart-row"><div>${i.title||''}</div><div>${i.qty} × ${fmt(i.price||0)}</div></div>`).join('') || '<div class="empty">Giỏ hàng trống</div>';
        if(countEl) countEl.textContent = arr.reduce((s,c)=>s+c.qty,0);
      };
    }

    if(typeof window.addToCart !== 'function'){
      window.addToCart = function(itemId, qty=1, price, size='M', toppings=[]){
        const item = (window.MENU||[]).find(m => m.id === itemId);
        if(!item){ showToast('Món không tồn tại','','err'); return; }
        const key = `${itemId}-${size}`;
        window.cart = window.cart || {};
        if(window.cart[key]) window.cart[key].qty += qty;
        else window.cart[key] = { id: itemId, qty, price: price || item.price, title: item.name, size, toppings: toppings||[] };
        window.saveCart();
        window.updateCartUI();
        showToast('Đã thêm vào giỏ', true);
      };
    }

    if(typeof window.applyPromo !== 'function'){
      window.applyPromo = function(code){
        code = (code||'').trim().toUpperCase();
        if(!code) return showToast('Nhập mã khuyến mãi','', 'err');
        const PC = window.PROMO_CODES || {};
        let promo = null;
        if(Array.isArray(PC)) promo = PC.find(p => (p.code||'').toString().toUpperCase() === code);
        else if(PC && typeof PC === 'object' && PC[code]) promo = Object.assign({ code }, PC[code]);
        if(!promo) return showToast('Mã không hợp lệ','','err');
        window.lastPromo = promo;
        showToast('Áp dụng mã thành công', true);
      };
    }

    window.openCheckout = function(){
      if(!loggedIn){ showToast('Vui lòng đăng nhập để thanh toán','','err'); return window.showModal ? window.showModal('auth-modal') : null; }
      const checkoutPage = document.getElementById('checkout-page');
      if(checkoutPage) checkoutPage.classList.add('active');
      if(typeof window.openModal === 'function') window.openModal('ck-modal');
    };

  }

  window.PROMO_CODES = window.PROMO_CODES || {};
  ensureGlobalFunctions();
  window.loadCart();
})();
