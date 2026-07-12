function isAdminLoggedIn() {
  return adminLoggedIn;
}

function doAdminLogin(){
  const user=document.getElementById('admin-user').value.trim();
  const pass=document.getElementById('admin-pass').value;
  if(user==='admin' && pass==='admin123'){
    adminLoggedIn=true;
    localStorage.setItem('pgd_admin_logged_in', '1');
    showToast('✅ Đăng nhập Admin thành công',true);
    updateAdminUI();
  } else {
    showToast('❌ Tên đăng nhập hoặc mật khẩu không đúng','','err');
  }
}

function logoutAdmin(){
  adminLoggedIn=false;
  localStorage.removeItem('pgd_admin_logged_in');
  updateAdminUI();
  showToast('👋 Đã đăng xuất khỏi Admin');
}

function updateAdminUI(){
  const locked=document.getElementById('admin-locked');
  const dash=document.getElementById('admin-dashboard');
  if(!locked || !dash) return;
  if(adminLoggedIn){
    locked.style.display='none';
    dash.style.display='block';
    renderAdminDashboard();
  } else {
    locked.style.display='block';
    dash.style.display='none';
  }
}

function switchAdminPanel(name,btn){
  adminCurrentPanel=name;
  document.querySelectorAll('.admin-side-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  document.querySelectorAll('.admin-panel').forEach(p=>p.classList.remove('active'));
  const panel=document.getElementById('admin-panel-'+name);
  if(panel) panel.classList.add('active');
  if(name==='orders') renderAdminOrders();
  if(name==='items') renderAdminItems();
  if(name==='promos') renderAdminPromos();
  if(name==='reports') renderAdminReports();
}

function renderAdminDashboard(){
  const todayOrders=orders.filter(o=>o.status!=='cancelled');
  const revenue=todayOrders.reduce((sum,o)=>sum+Number(o.total||0),0);
  const pending=todayOrders.filter(o=>o.status==='pending').length;
  const items=MENU.length;
  document.getElementById('admin-now').textContent=new Date().toLocaleTimeString('vi-VN');
  document.getElementById('admin-stat-orders').textContent=todayOrders.length;
  document.getElementById('admin-stat-revenue').textContent=fmt(revenue);
  document.getElementById('admin-stat-items').textContent=items;
  document.getElementById('admin-stat-pending').textContent=pending;

  const recent=document.getElementById('admin-recent-orders');
  if(recent){
    const list=todayOrders.slice(0,5);
    recent.innerHTML=list.length?
      list.map(o=>`
        <div class="menu-list-item" style="cursor:default">
          <div>
            <div class="mli-label">${o.id} · ${o.name}</div>
            <div class="mli-sub">${o.items} · ${o.phone}</div>
          </div>
          <span class="admin-tag">${fmt(o.total)}</span>
        </div>
      `).join(''):
      `<div class="admin-empty">Chưa có đơn nào</div>`;
  }

  const top=document.getElementById('admin-top-items');
  if(top){
    const counts={};
    orders.forEach(order=>{
      (order.itemsText||[]).forEach(item=>{
        counts[item.name]=(counts[item.name]||0)+item.qty;
      });
    });
    const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5);
    top.innerHTML=entries.length?
      entries.map(([name,qty])=>`
        <div class="menu-list-item" style="cursor:default">
          <div>
            <div class="mli-label">${name}</div>
            <div class="mli-sub">${qty} lần bán</div>
          </div>
          <span class="admin-tag">${qty}x</span>
        </div>
      `).join(''):
      `<div class="admin-empty">Chưa có dữ liệu bán hàng</div>`;
  }
}
