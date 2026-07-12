function renderAdminItems(){
  const table=document.getElementById('admin-items-table');
  if(!table) return;
  const search=(document.getElementById('admin-item-search')?.value||'').toLowerCase().trim();
  const catFilter=document.getElementById('admin-item-category')?.value||'all';
  let list = MENU.filter(item => catFilter==='all' || item.cat===catFilter);
  if(search){
    list = list.filter(item =>
      item.name.toLowerCase().includes(search) ||
      (item.desc||'').toLowerCase().includes(search)
    );
  }

  table.innerHTML=`
    <table class="admin-table">
      <thead>
        <tr>
          <th>Món</th>
          <th>Danh mục</th>
          <th>Giá</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        ${list.map(item=>`
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <img src="${item.img}" alt="" style="width:44px;height:44px;border-radius:8px;object-fit:cover">
                <div>
                  <div style="font-weight:700">${item.name}</div>
                  <div style="font-size:11px;color:var(--muted)">${(item.desc||'').slice(0,40)}${(item.desc||'').length>40?'...':''}</div>
                </div>
              </div>
            </td>
            <td>${item.cat}</td>
            <td>${fmt(item.price)}</td>
            <td><span class="admin-tag">${item.badge || 'Normal'}</span></td>
            <td>
              <button class="admin-action" onclick="openAdminItemModal(${item.id})">Sửa</button>
              <button class="admin-action danger" onclick="deleteAdminItem(${item.id})">Xóa</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function openAdminItemModal(id){
  adminEditingItemId = id || null;
  const title=document.getElementById('admin-item-title');
  const name=document.getElementById('admin-item-name');
  const cat=document.getElementById('admin-item-cat');
  const price=document.getElementById('admin-item-price');
  const old=document.getElementById('admin-item-old');
  const img=document.getElementById('admin-item-img');
  const badge=document.getElementById('admin-item-badge');
  const desc=document.getElementById('admin-item-desc');
  const toppings=document.getElementById('admin-item-toppings');
  const imgFile=document.getElementById('admin-item-img-file');
  const imgPreview=document.getElementById('admin-item-img-preview');
  const imgPreviewTag=document.getElementById('admin-item-img-preview-tag');

  if(imgFile) imgFile.value = ''; // Reset file input

  if(adminEditingItemId){
    const item=(window.MENU||[]).find(i=>i.id===adminEditingItemId);
    if(!item) return;
    title.textContent='Sửa món ăn';
    name.value=item.name;
    cat.value=item.cat;
    price.value=item.price;
    old.value=item.oldPrice||'';
    img.value=item.img;
    badge.value=item.badge||'';
    desc.value=item.desc||'';
    toppings.value=(item.toppings||[]).join(',');
    if(imgPreview && imgPreviewTag) {
      imgPreviewTag.src = item.img || '';
      imgPreview.style.display = item.img ? 'block' : 'none';
    }
  } else {
    title.textContent='Thêm món mới';
    name.value='';
    cat.value='pho';
    price.value='';
    old.value='';
    img.value='';
    badge.value='';
    desc.value='';
    toppings.value='';
    if(imgPreview) imgPreview.style.display = 'none';
  }
  openModal('admin-item-modal');
}

window.handleAdminItemImgUpload = function(event) {
  const file = event.target.files[0];
  if(!file) return;
  if(file.size > 500 * 1024) {
    showToast('⚠️ Vui lòng chọn ảnh nhỏ hơn 500KB để tránh đầy bộ nhớ', '', 'err');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    const imgInput = document.getElementById('admin-item-img');
    if(imgInput) {
      imgInput.value = base64;
      imgInput.dispatchEvent(new Event('input')); // Trigger preview
    }
  };
  reader.readAsDataURL(file);
};

function saveAdminItem(){
  const name=document.getElementById('admin-item-name').value.trim();
  const price=Number(document.getElementById('admin-item-price').value);
  const desc=document.getElementById('admin-item-desc').value.trim();
  const img=document.getElementById('admin-item-img').value.trim();
  if(!name || !price || !desc){showToast('⚠️ Vui lòng nhập đủ thông tin món','','err');return;}
  const toppings=document.getElementById('admin-item-toppings').value.split(',').map(t=>t.trim()).filter(Boolean);
  const payload={
    id: adminEditingItemId || Date.now(),
    name,
    cat:document.getElementById('admin-item-cat').value,
    img:img||'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop',
    price,
    oldPrice: Number(document.getElementById('admin-item-old').value) || null,
    desc,
    rating:4.8,
    ratingCount:0,
    badge:document.getElementById('admin-item-badge').value || null,
    toppings,
    prep:15,
    kcal:400,
    serves:1
  };
  if(adminEditingItemId){
    MENU=MENU.map(item=>item.id===adminEditingItemId?payload:item);
    showToast('✅ Đã cập nhật món');
  } else {
    MENU=[payload,...MENU];
    showToast('✅ Đã thêm món mới');
  }
  localStorage.setItem('pgd_admin_items', JSON.stringify(MENU));
  closeModal('admin-item-modal');
  renderMenu();
  renderAdminItems();
  renderAdminDashboard();
  renderAdminReports();
}

function deleteAdminItem(id){
  if(!confirm('Bạn có chắc muốn xóa món này?')) return;
  MENU=MENU.filter(item=>item.id!==id);
  localStorage.setItem('pgd_admin_items', JSON.stringify(MENU));
  renderMenu();
  renderAdminItems();
  renderAdminDashboard();
  renderAdminReports();
  showToast('🗑️ Đã xóa món');
}
