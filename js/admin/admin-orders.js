function getFilteredOrders(searchText, statusFilter, dateFilter){
  let list = statusFilter==='all' ? orders : orders.filter(o=>o.status===statusFilter);
  const search=(searchText||'').toLowerCase().trim();
  if(search){
    list = list.filter(o =>
      (o.id||'').toLowerCase().includes(search) ||
      (o.name||'').toLowerCase().includes(search) ||
      (o.phone||'').toLowerCase().includes(search) ||
      (o.items||'').toLowerCase().includes(search)
    );
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayMs = 24*60*60*1000;
  if(dateFilter === 'today') {
    list = list.filter(o => new Date(o.createdAt || o.date || now) >= today);
  } else if(dateFilter === '7days') {
    const cutoff = new Date(today.getTime() - 6*dayMs);
    list = list.filter(o => new Date(o.createdAt || o.date || now) >= cutoff);
  } else if(dateFilter === '30days') {
    const cutoff = new Date(today.getTime() - 29*dayMs);
    list = list.filter(o => new Date(o.createdAt || o.date || now) >= cutoff);
  }
  return list;
}

function renderAdminOrders(){
  const table=document.getElementById('admin-orders-table');
  if(!table) return;
  const filter=document.getElementById('admin-order-filter')?.value||'all';
  const search=(document.getElementById('admin-order-search')?.value||'');
  const dateFilter=document.getElementById('admin-date-filter')?.value||'all';
  const list = getFilteredOrders(search, filter, dateFilter);

  if(!list.length){
    table.innerHTML=`<div class="admin-empty">Không có đơn hàng nào</div>`;
    return;
  }
  table.innerHTML=`
    <table class="admin-table">
      <thead>
        <tr>
          <th>Mã đơn</th>
          <th>Khách</th>
          <th>Đơn hàng</th>
          <th>Thanh toán</th>
          <th>Tổng</th>
          <th>Shipper</th>
          <th>SĐT shipper</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        ${list.map((o)=>`
          <tr>
            <td>${o.id}</td>
            <td>
              <div style="font-weight:700">${o.name}</div>
              <div style="font-size:11px;color:var(--muted)">${o.phone}</div>
            </td>
            <td>${(o.items||'').slice(0,60)}${(o.items||'').length>60?'...':''}</td>
            <td>${o.pay||'COD'}</td>
            <td>${fmt(o.total||0)}</td>
            <td>
              <input class="admin-input" value="${(o.shipper||'').replaceAll('"','&quot;')}" placeholder="Tên shipper" onchange="updateOrderShipper('${o.id}', this.value, '${(o.shipperPhone||'').replaceAll('"','&quot;')}')">
            </td>
            <td>
              <input class="admin-input" value="${(o.shipperPhone||'').replaceAll('"','&quot;')}" placeholder="SĐT shipper" onchange="updateOrderShipperPhone('${o.id}', this.value)">
            </td>
            <td>
              <select class="admin-select" onchange="updateOrderStatus('${o.id}',this.value)">
                <option value="pending" ${o.status==='pending'?'selected':''}>Đang xử lý</option>
                <option value="delivering" ${o.status==='delivering'?'selected':''}>Đang giao</option>
                <option value="done" ${o.status==='done'?'selected':''}>Hoàn thành</option>
                <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Đã hủy</option>
              </select>
            </td>
            <td>
              <button class="admin-action" onclick="confirmDelivery('${o.id}')">${o.status==='pending'?'Xác nhận giao':'Gọi'}</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function exportAdminOrders(){
  const filter=document.getElementById('admin-order-filter')?.value||'all';
  const search=(document.getElementById('admin-order-search')?.value||'');
  const dateFilter=document.getElementById('admin-date-filter')?.value||'all';
  const list = getFilteredOrders(search, filter, dateFilter);

  const header = ['Mã đơn', 'Khách hàng', 'SĐT', 'Địa chỉ', 'Đơn hàng', 'Thanh toán', 'Tổng tiền', 'Trạng thái', 'Ngày đặt'];
  const rows = list.map(o => [
    o.id || '',
    o.name || '',
    o.phone || '',
    o.addr || '',
    o.items || '',
    o.pay || 'COD',
    String(o.total || 0),
    o.status || 'done',
    o.date || ''
  ]);
  const csv = [header, ...rows].map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');

  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'orders.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('📤 Đã xuất file CSV');
}

function updateOrderShipper(orderId, shipper, shipperPhone){
  const index = orders.findIndex(order => order.id === orderId);
  if(index === -1) return;
  orders[index].shipper = shipper.trim();
  orders[index].shipperPhone = shipperPhone || orders[index].shipperPhone || '';
  saveUserScopedData('orders', orders);
  renderAdminOrders();
  renderOrders();
}

function updateOrderShipperPhone(orderId, shipperPhone){
  const index = orders.findIndex(order => order.id === orderId);
  if(index === -1) return;
  orders[index].shipperPhone = shipperPhone.trim();
  saveUserScopedData('orders', orders);
  renderAdminOrders();
  renderOrders();
}

function confirmDelivery(orderId){
  const index = orders.findIndex(order => order.id === orderId);
  if(index === -1) return;
  if(!orders[index].shipper || !orders[index].shipperPhone){
    showToast('⚠️ Vui lòng nhập đầy đủ tên shipper và số điện thoại trước khi xác nhận','','err');
    return;
  }
  orders[index].status = 'delivering';
  saveUserScopedData('orders', orders);
  renderAdminOrders();
  renderOrders();
  renderAdminDashboard();
  showToast('✅ Đơn hàng đã chuyển sang trạng thái đang giao');
}

function updateOrderStatus(orderId, newStatus){
  const index = orders.findIndex(order => order.id === orderId);
  if(index === -1) return;
  orders[index].status = newStatus;
  saveUserScopedData('orders', orders);
  renderAdminOrders();
  renderOrders();
  renderAdminDashboard();
  showToast('✅ Cập nhật trạng thái đơn hàng');
}
