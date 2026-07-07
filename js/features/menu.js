// ── RENDER MENU ──
function renderMenu(){
  const grid=document.getElementById('menu-grid');
  if(!grid)return;

  if(menuRenderTimer) clearTimeout(menuRenderTimer);

  const renderNow = () => {
      let items=[...(window.MENU||[])];
      const searchTerms = normalizeText(curSearch)
        .split(' ')
        .filter(Boolean);

      if(searchTerms.length){
        const catNames={pho:'Phở & Bún',com:'Cơm',banh:'Bánh',nuoc:'Đồ uống',trangmieng:'Tráng miệng','khuyen-mai':'Combo'};
        items=items.filter(item=>{
          const haystack = [
            item.name,
            item.desc,
            catNames[item.cat] || '',
            item.badge || '',
            ...(item.toppings || [])
          ].map(value => normalizeText(value)).join(' ');
          return searchTerms.every(term => haystack.includes(term));
        });
      }
      if(curFilter!=='all') items=items.filter(i=>i.cat===curFilter);

      if(curSort==='price-asc') items.sort((a,b)=>a.price-b.price);
      else if(curSort==='price-desc') items.sort((a,b)=>b.price-a.price);
      else if(curSort==='rating') items.sort((a,b)=>getItemRatingInfo(b).rating-getItemRatingInfo(a).rating);
      else if(curSort==='popular') items.sort((a,b)=>getItemRatingInfo(b).ratingCount-getItemRatingInfo(a).ratingCount);

      const cnt=document.getElementById('result-count');
      if(cnt) cnt.textContent=`${items.length} món`;

      if(!items.length){
        grid.innerHTML=`<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🔍</div><h3>Không tìm thấy món phù hợp</h3><p>Thử từ khóa khác hoặc chọn danh mục khác</p></div>`;
        return;
      }

      const catNames={pho:'Phở & Bún',com:'Cơm',banh:'Bánh',nuoc:'Đồ uống',trangmieng:'Tráng miệng','khuyen-mai':'Combo'};
      grid.innerHTML=items.map(item=>{
        const isFav=favs.has(item.id);
        const cartQty = Object.keys(cart)
          .filter(k => k.startsWith(item.id + '-'))
          .reduce((sum, k) => sum + cart[k].qty, 0);
        let badgeHtml='';
        if(item.badge==='Bestseller') badgeHtml=`<div class="item-badge badge-best">🏆 Bestseller</div>`;
        else if(item.badge==='New') badgeHtml=`<div class="item-badge badge-new">✨ Mới</div>`;
        else if(item.badge==='Sale') badgeHtml=`<div class="item-badge badge-sale">🔥 Giảm giá</div>`;
        const rInfo = getItemRatingInfo(item);
        return `
        <div class="item-card" onclick="openItemDetail(${item.id})">
          <div class="item-thumb">
            <img src="${item.img}" alt="${item.name}" loading="lazy">
            <div class="item-thumb-overlay"></div>
            ${badgeHtml}
            <button class="item-fav ${isFav?'liked':''}" onclick="event.stopPropagation();toggleFav(${item.id},this)" aria-label="Yêu thích">${isFav?'❤️':'🤍'}</button>
          </div>
          <div class="item-body">
            <div class="item-cat-tag">${catNames[item.cat]||''}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-rating">
              <span class="stars-row">★★★★${rInfo.rating>=4.9?'★':'☆'}</span>
              <span>${rInfo.rating}</span>
              <span style="opacity:.6">(${rInfo.ratingCount})</span>
              <span style="margin-left:4px;color:var(--muted2)">· ⏱${item.prep}p</span>
            </div>
            <div class="item-desc">${item.desc}</div>
            <div class="item-footer">
              <div class="price-group">
                <span class="item-price">${fmt(item.price)}</span>
                ${item.oldPrice?`<span class="item-old">${fmt(item.oldPrice)}</span>`:''}
              </div>
              ${cartQty>0
                ?`<div class="qty-ctrl" onclick="event.stopPropagation();openCartModal()"><span style="font-size:12px;font-weight:700;color:var(--orange)">🛒 Đã thêm (${cartQty})</span></div>`
                :`<button class="add-btn" onclick="event.stopPropagation();quickAdd(${item.id})" aria-label="Thêm vào giỏ">+</button>`
              }
            </div>
          </div>
        </div>`;
      }).join('');
      checkElementsInView();
  };

  const shouldShowLoading = !grid.dataset.loaded && !curSearch && curFilter === 'all' && curSort === 'default';
  if(shouldShowLoading){
    let placeholderHTML = '';
    for (let i = 0; i < 8; i++) {
      placeholderHTML += `
        <div class="item-card shimmer">
          <div class="item-thumb"></div>
          <div class="item-body" style="background: white;">
            <div style="height: 12px; width: 60%; margin-bottom: 8px;" class="shimmer"></div>
            <div style="height: 18px; width: 90%; margin-bottom: 12px;" class="shimmer"></div>
            <div style="height: 10px; width: 100%;" class="shimmer"></div>
            <div style="height: 10px; width: 80%; margin-top: 4px;" class="shimmer"></div>
          </div>
        </div>`;
    }
    grid.innerHTML = placeholderHTML;
    grid.dataset.loaded = 'true';
    menuRenderTimer = setTimeout(() => {
      menuRenderTimer = null;
      renderNow();
    }, 300);
  } else {
    renderNow();
  }

  renderRecommended();
}

function renderRecommended(){
  const el=document.getElementById('recommended');
  if(!el)return;
  const items=(window.MENU||[]).filter(i=>i.rating>=4.8).slice(0,6);
  el.innerHTML=items.map(i=>`
    <div class="h-item" onclick="openItemDetail(${i.id})">
      <div class="h-item-img"><img src="${i.img}" alt="${i.name}" loading="lazy"></div>
      <div class="h-item-body">
        <div class="h-item-name">${i.name}</div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span class="h-item-price">${fmt(i.price)}</span>
          <span style="font-size:11px;color:var(--yellow)">★${i.rating}</span>
        </div>
      </div>
    </div>`).join('');
}

function filterMenu(){
  const searchInput = document.getElementById('search-input');
  if(searchInput){
    curSearch = searchInput.value.trim();
  }
  renderMenu();
}
function filterCat(cat,el){
  curFilter=cat;
  document.querySelectorAll('.cat-pill').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  renderMenu();
}
function filterCatById(cat){
  curFilter=cat;
  document.querySelectorAll('.cat-pill').forEach(c=>{
    c.classList.toggle('active',c.dataset.cat===cat);
  });
  renderMenu();
  document.getElementById('menu-grid').scrollIntoView({behavior:'smooth',block:'start'});
}
function sortMenu(v){curSort=v;renderMenu()}

function toggleFav(id,btn){
  if(favs.has(id)){favs.delete(id);btn.classList.remove('liked');btn.textContent='🤍';showToast('Đã bỏ yêu thích')}
  else{favs.add(id);btn.classList.add('liked');btn.textContent='❤️';showToast('❤️ Đã thêm vào yêu thích',true)}
  saveUserScopedData('favs', [...favs]);
}

// ── ITEM DETAIL ──
function openItemById(id){openItemDetail(id)}
function openItemDetail(id){
  detailItem=(window.MENU||[]).find(i=>i.id===id);
  if(!detailItem)return;
  detailQty=1;detailSize='M';detailToppings=new Set();
  renderItemDetail();
  openModal('item-modal');
}
function getItemRatingInfo(item) {
  const localReviews = JSON.parse(localStorage.getItem('pgd_reviews') || '[]');
  const itemReviews = localReviews.filter(r => r.itemId === item.id);
  
  const baseCount = item.ratingCount || 100;
  const baseSum = (item.rating || 4.7) * baseCount;
  
  const newCount = baseCount + itemReviews.length;
  const newSum = baseSum + itemReviews.reduce((sum, r) => sum + r.stars, 0);
  
  const finalRating = Math.round((newSum / newCount) * 10) / 10;
  return {
    rating: finalRating,
    ratingCount: newCount
  };
}

function renderItemDetail(){
  const it=detailItem;
  const mb={'S':-5000,'M':0,'L':7000,'XL':15000};
  const isFav=favs.has(it.id);
  let badgeHtml='';
  if(it.badge==='Bestseller')badgeHtml=`<div class="item-badge badge-best">🏆 Bestseller</div>`;
  else if(it.badge==='New')badgeHtml=`<div class="item-badge badge-new">✨ Mới</div>`;
  else if(it.badge==='Sale')badgeHtml=`<div class="item-badge badge-sale">🔥 Giảm giá</div>`;

  const rInfo = getItemRatingInfo(it);
  const localReviews = JSON.parse(localStorage.getItem('pgd_reviews') || '[]');
  const itemReviews = localReviews.filter(r => r.itemId === it.id);

  const reviews=[
    ...itemReviews,
    {name:'Minh Tú',date:'12/06/2025',text:'Phở ngon lắm, nước dùng đậm đà, giao hàng nhanh! Lần sau sẽ order thêm.',stars:5,imgs:['https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=80&h=80&fit=crop']},
    {name:'Lan Anh',date:'08/06/2025',text:'Món ăn rất ngon, đóng gói cẩn thận, còn nóng khi nhận. Sẽ ủng hộ tiếp!',stars:5,imgs:[]},
    {name:'Hùng Mạnh',date:'01/06/2025',text:'Chất lượng ổn, giao hơi chậm hơn dự kiến nhưng đồ ăn vẫn nóng và ngon.',stars:4,imgs:['https://images.unsplash.com/photo-1547592180-85f173990554?w=80&h=80&fit=crop']},
    {name:'Thu Hương',date:'25/05/2025',text:'Đặt lần đầu mà ưng quá, cơm tấm ngon hơn ngoài hàng. Sẽ thành khách quen!',stars:5,imgs:[]},
  ];

  document.getElementById('item-modal-body').innerHTML=`
    <button class="modal-close" style="top:1rem;right:1rem" onclick="closeModal('item-modal')">✕</button>
    <div class="detail-hero">
      <img src="${it.img}" alt="${it.name}">
      <div class="detail-hero-overlay"></div>
      <div class="detail-hero-badge">${badgeHtml}</div>
    </div>
    <div class="detail-body">
      <div class="detail-row">
        <div class="detail-name">${it.name}</div>
        <div class="detail-price-box">
          <div class="detail-price" id="d-price">${fmt(it.price)}</div>
          ${it.oldPrice?`<div class="detail-old">${fmt(it.oldPrice)}</div>`:''}
        </div>
      </div>
      <div class="detail-meta">
        <div class="meta-chip">⭐ ${rInfo.rating} (${rInfo.ratingCount})</div>
        <div class="meta-chip">⏱ ${it.prep} phút</div>
        <div class="meta-chip">🔥 ${it.kcal} kcal</div>
        <div class="meta-chip">👥 ${it.serves} người</div>
        <button onclick="toggleFav(${it.id},this)" class="meta-chip ${favs.has(it.id)?'liked':''}" style="background:${favs.has(it.id)?'#FEE2E2':'var(--surf2)'};border:1px solid ${favs.has(it.id)?'#FCA5A5':'var(--border)'};cursor:pointer;color:${favs.has(it.id)?'#DC2626':'var(--muted)'}">${favs.has(it.id)?'❤️ Đã yêu thích':'🤍 Yêu thích'}</button>
      </div>
      <div class="detail-desc">${it.desc}</div>

      <div class="opt-label">Chọn size</div>
      <div class="size-grid">
        ${['S','M','L','XL'].slice(0,3).map(s=>`
          <div class="size-opt ${s===detailSize?'sel':''}" onclick="selSize('${s}',this)">
            <div class="s-name">${s}</div>
            <div class="s-note">${s==='S'?'-5K':s==='M'?'Chuẩn':s==='L'?'+7K':'+15K'}</div>
          </div>`).join('')}
      </div>

      <div class="opt-label">Tuỳ chỉnh thêm</div>
      <div class="top-wrap">
        ${it.toppings.map(t=>`<div class="top-pill" onclick="toggleTop('${t.replace(/'/g,"'")}',this)">${t}</div>`).join('')}
      </div>

      <div class="opt-label">Số lượng</div>
      <div class="qty-row">
        <button class="q-big-btn" onclick="chgDQ(-1)">−</button>
        <span class="q-big-num" id="d-qty">1</span>
        <button class="q-big-btn" onclick="chgDQ(1)">+</button>
        <div class="detail-total">Tổng: <strong id="d-total">${fmt(it.price)}</strong></div>
      </div>
      <button class="add-cart-btn" onclick="addDetailToCart()">
        🛒 Thêm vào giỏ — <span id="d-btn-price">${fmt(it.price)}</span>
      </button>
    </div>
    <div class="reviews-sec">
      <div class="rev-head">
        <div class="rev-score">
          <div class="rev-big">${rInfo.rating}</div>
          <div class="rev-stars-col">
            <div><span>★★★★★</span></div>
            <div class="rev-cnt">${rInfo.ratingCount} đánh giá</div>
          </div>
        </div>
        <div class="rev-bars">
          ${[5,4,3,2,1].map(n=>{
            const pct=n===5?72:n===4?20:n===3?6:n===2?1:1;
            return `<div class="rev-bar-row"><small>${n}</small><div class="rev-bar-track"><div class="rev-bar-fill" style="width:${pct}%"></div></div><small style="width:28px">${pct}%</small></div>`;
          }).join('')}
        </div>
      </div>
      ${reviews.map(r=>`
        <div class="rev-item">
          <div class="rev-item-head">
            <div class="rev-user">
              <div class="rev-avatar">${r.name.charAt(0)}</div>
              <div><div class="rev-name">${r.name}</div><div style="color:var(--yellow);font-size:12px">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div></div>
            </div>
            <div class="rev-date">${r.date}</div>
          </div>
          <div class="rev-text">${r.text}</div>
          ${r.imgs && r.imgs.length?`<div class="rev-imgs">${r.imgs.map(img=>`<div class="rev-img-thumb"><img src="${img}" alt=""></div>`).join('')}</div>`:''}
        </div>`).join('')}
    </div>`;
}

const sizeAdd={'S':-5000,'M':0,'L':7000,'XL':15000};
function selSize(s,el){
  detailSize=s;
  document.querySelectorAll('.size-opt').forEach(e=>e.classList.remove('sel'));
  el.classList.add('sel');
  updDetailPrice();
}
function toggleTop(t,el){
  el.classList.toggle('sel');
  if(detailToppings.has(t))detailToppings.delete(t);else detailToppings.add(t);
}
function chgDQ(d){
  detailQty=Math.max(1,detailQty+d);
  const el=document.getElementById('d-qty');if(el)el.textContent=detailQty;
  updDetailPrice();
}
function updDetailPrice(){
  if(!detailItem)return;
  const p=(detailItem.price+(sizeAdd[detailSize]||0))*detailQty;
  const dp=document.getElementById('d-price');const dt=document.getElementById('d-total');const db=document.getElementById('d-btn-price');
  if(dp)dp.textContent=fmt(detailItem.price+(sizeAdd[detailSize]||0));
  if(dt)dt.textContent=fmt(p);
  if(db)db.textContent=fmt(p);
}
function addDetailToCart(){
  const p=detailItem.price+(sizeAdd[detailSize]||0);
  addToCart(detailItem.id,detailQty,p,detailSize,Array.from(detailToppings));
  closeModal('item-modal');
}

