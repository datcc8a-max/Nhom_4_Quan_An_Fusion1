function openAdminPromoModal(){
  document.getElementById('admin-promo-code').value='';
  document.getElementById('admin-promo-type').value='percent';
  document.getElementById('admin-promo-value').value='';
  document.getElementById('admin-promo-label').value='';
  openModal('admin-promo-modal');
}

function saveAdminPromo(){
  const code=(document.getElementById('admin-promo-code').value||'').trim().toUpperCase();
  const type=document.getElementById('admin-promo-type').value;
  const value=Number(document.getElementById('admin-promo-value').value);
  const label=document.getElementById('admin-promo-label').value.trim();
  if(!code || !value || !label){showToast('⚠️ Vui lòng nhập đủ thông tin mã giảm giá','','err');return;}
  const promo = {
    type,
    label,
    value,
    disabled: false
  };
  PROMO_CODES[code]=promo;
  localStorage.setItem('pgd_promo_codes', JSON.stringify(PROMO_CODES));
  closeModal('admin-promo-modal');
  renderAdminPromos();
  showToast(`✅ Đã lưu mã ${code}`);
}

function toggleAdminPromo(code){
  if(!PROMO_CODES[code]) return;
  PROMO_CODES[code].disabled = !PROMO_CODES[code].disabled;
  localStorage.setItem('pgd_promo_codes', JSON.stringify(PROMO_CODES));
  renderAdminPromos();
  showToast(`✅ ${PROMO_CODES[code].disabled ? 'Đã tạm dừng' : 'Đã bật lại'} mã ${code}`);
}

function deleteAdminPromo(code){
  if(!PROMO_CODES[code]) return;
  if(!confirm(`Bạn có chắc muốn xóa mã ${code}?`)) return;
  delete PROMO_CODES[code];
  localStorage.setItem('pgd_promo_codes', JSON.stringify(PROMO_CODES));
  renderAdminPromos();
  showToast(`🗑️ Đã xóa mã ${code}`);
}

function renderAdminPromos(){
  const list=document.getElementById('admin-promo-list');
  if(!list) return;
  const entries=Object.entries(PROMO_CODES);
  list.innerHTML=`
    <table class="admin-table">
      <thead><tr><th>Mã</th><th>Loại</th><th>Giá trị</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
      <tbody>
        ${entries.map(([code,p])=>`
          <tr>
            <td><span class="admin-tag">${code}</span></td>
            <td>${p.type==='percent'?'Phần trăm':p.type==='fixed'?'Giảm tiền':'Miễn phí ship'}</td>
            <td>${p.label}</td>
            <td><span class="admin-tag">${p.disabled ? 'Tạm dừng' : 'Hoạt động'}</span></td>
            <td>
              <button class="admin-action" onclick="toggleAdminPromo('${code}')">${p.disabled ? 'Bật' : 'Tắt'}</button>
              <button class="admin-action danger" onclick="deleteAdminPromo('${code}')">Xóa</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
