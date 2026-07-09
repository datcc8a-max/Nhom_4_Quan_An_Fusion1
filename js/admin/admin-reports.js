function renderAdminReports(){
  const totalOrders = orders.length;
  const revenue = orders.reduce((sum,o)=>sum+Number(o.total||0),0);
  const completed = orders.filter(o=>o.status==='done').length;
  const cancelled = orders.filter(o=>o.status==='cancelled').length;
  const completionRate = totalOrders ? Math.round(completed / totalOrders * 100) : 0;

  document.getElementById('admin-report-total-orders').textContent = totalOrders;
  document.getElementById('admin-report-revenue').textContent = fmt(revenue);
  document.getElementById('admin-report-complete').textContent = completionRate + '%';
  document.getElementById('admin-report-cancel').textContent = cancelled;

  const top = document.getElementById('admin-report-top-items');
  const counts = {};
  orders.forEach(order => {
    (order.itemsText || []).forEach(item => {
      counts[item.name] = (counts[item.name] || 0) + item.qty;
    });
  });
  const topEntries = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  top.innerHTML = topEntries.length?
    topEntries.map(([name,qty]) => `
      <div class="menu-list-item" style="cursor:default">
        <div>
          <div class="mli-label">${name}</div>
          <div class="mli-sub">${qty} lượt bán</div>
        </div>
        <span class="admin-tag">${qty}x</span>
      </div>
    `).join('') : `<div class="admin-empty">Chưa có dữ liệu</div>`;

  const status = document.getElementById('admin-report-status');
  const statusCounts = {
    pending: orders.filter(o=>o.status==='pending').length,
    delivering: orders.filter(o=>o.status==='delivering').length,
    done: orders.filter(o=>o.status==='done').length,
    cancelled: orders.filter(o=>o.status==='cancelled').length
  };
  status.innerHTML = Object.entries(statusCounts).map(([key,val]) => {
    const label = {pending:'Đang xử lý', delivering:'Đang giao', done:'Hoàn thành', cancelled:'Đã hủy'}[key];
    return `<div class="menu-list-item" style="cursor:default"><div><div class="mli-label">${label}</div></div><span class="admin-tag">${val}</span></div>`;
  }).join('');
}
