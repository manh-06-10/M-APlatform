async function renderSellerDashboard(){if(!currentUser){navigate('login');return}
document.getElementById('mainContent').innerHTML='<div class="dashboard"><div class="dashboard-header"><h1>Dashboard Seller</h1><p>Quản lý doanh nghiệp và deal của bạn</p></div><div class="loading"><div class="spinner"></div></div></div>';
try{const deals=await api('/api/deals/my');const companies=await api('/api/companies');
document.getElementById('mainContent').innerHTML=`
<div class="dashboard"><div class="dashboard-header"><h1>👋 Xin chào, ${currentUser.full_name}</h1><p>Quản lý doanh nghiệp và deal M&A của bạn</p></div>
<div class="stats-grid"><div class="stat-card"><div class="stat-icon blue"><i class="fas fa-briefcase"></i></div><div class="stat-info"><h3>${deals.length}</h3><p>Tổng deal</p></div></div>
<div class="stat-card"><div class="stat-icon green"><i class="fas fa-building"></i></div><div class="stat-info"><h3>${companies.length}</h3><p>Doanh nghiệp</p></div></div>
<div class="stat-card"><div class="stat-icon orange"><i class="fas fa-eye"></i></div><div class="stat-info"><h3>${deals.reduce((s,d)=>s+(d.views_count||0),0)}</h3><p>Lượt xem</p></div></div>
<div class="stat-card"><div class="stat-icon cyan"><i class="fas fa-heart"></i></div><div class="stat-info"><h3>${deals.reduce((s,d)=>s+(d.interests_count||0),0)}</h3><p>Quan tâm</p></div></div></div>
<div style="display:flex;gap:12px;margin-bottom:24px"><button class="btn btn-primary" onclick="navigate('create-company')"><i class="fas fa-building"></i> Tạo doanh nghiệp</button>
<button class="btn btn-accent" onclick="navigate('create-deal')"><i class="fas fa-plus"></i> Tạo Deal mới</button></div>
${deals.length?'<h2 style="margin-bottom:16px">Deal của bạn</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>Tên Deal</th><th>Doanh nghiệp</th><th>Loại</th><th>Định giá</th><th>Trạng thái</th><th>Lượt xem</th><th>Hành động</th></tr></thead><tbody>'+deals.map(d=>'<tr style="cursor:pointer" onclick="navigate(\'deal-detail\','+d.id+')"><td style="font-weight:600">'+d.deal_name+'</td><td>'+(d.company_name||'-')+'</td><td>'+dealTypeLabel(d.deal_type)+'</td><td>'+formatMoney(d.valuation)+'</td><td><span class="deal-card-badge badge-'+d.status+'">'+statusLabel(d.status)+'</span></td><td>'+d.views_count+'</td><td onclick="event.stopPropagation()">'+(d.status==='approved'?'<button class="btn btn-primary btn-sm" onclick="togglePublish('+d.id+','+"'published'"+')" style="margin-right:4px">Công khai</button>':d.status==='published'?'<button class="btn btn-secondary btn-sm" onclick="togglePublish('+d.id+','+"'approved'"+')" style="margin-right:4px">Tạm ẩn</button>':d.status==='closed'?'<span style="font-size:.75rem;color:var(--text3)">Đã đóng</span>':'<span style="font-size:.75rem;color:var(--text3)">Chờ duyệt</span>')+'</td></tr>').join('')+'</tbody></table></div>':'<div class="empty-state"><i class="fas fa-inbox"></i><h3>Chưa có deal nào</h3><p>Bấm "Tạo Deal mới" để bắt đầu</p></div>'}
</div>`}catch(err){toast(err.message,'error')}}
async function togglePublish(id,status){try{const res=await api('/api/deals/'+id+'/publish',{method:'PATCH',body:JSON.stringify({status})});toast(res.message,'success');renderSellerDashboard()}catch(e){toast(e.message,'error')}}
async function closeDeal(id){if(!confirm('Bạn có chắc muốn ĐÓNG deal này?\n(Deal đã đóng sẽ không thể mở lại và bị gỡ khỏi sàn)'))return;try{await api('/api/deals/'+id+'/publish',{method:'PATCH',body:JSON.stringify({status:'closed'})});toast('Đã đóng deal thành công','success');renderSellerDashboard()}catch(e){toast(e.message,'error')}}

async function renderBuyerDashboard(){if(!currentUser){navigate('login');return}
document.getElementById('mainContent').innerHTML='<div class="dashboard"><div class="loading"><div class="spinner"></div></div></div>';
try{
const [dealsRes, bookmarks, offers, chats] = await Promise.all([
  api('/api/deals?limit=6'),
  api('/api/bookmarks'),
  api('/api/my-offers'),
  api('/api/my-chats').catch(()=>[])
]);
const offerList = offers.filter(o=>o.type==='offer');
const ndaList = offers.filter(o=>o.type==='nda_request');
const contactList = offers.filter(o=>o.type==='contact_request');
document.getElementById('mainContent').innerHTML=`
<div class="dashboard"><div class="dashboard-header"><h1>👋 Xin chào, ${currentUser.full_name}</h1><p>Dashboard Nhà đầu tư - Quản lý danh mục đầu tư M&A</p></div>
<div class="stats-grid">
<div class="stat-card" style="cursor:pointer" onclick="showBuyerTab('saved')"><div class="stat-icon blue"><i class="fas fa-bookmark"></i></div><div class="stat-info"><h3>${bookmarks.length}</h3><p>Deal đã lưu</p></div></div>
<div class="stat-card" style="cursor:pointer" onclick="showBuyerTab('offers')"><div class="stat-icon green"><i class="fas fa-hand-holding-usd"></i></div><div class="stat-info"><h3>${offerList.length}</h3><p>Offer đã gửi</p></div></div>
<div class="stat-card" style="cursor:pointer" onclick="showBuyerTab('nda')"><div class="stat-icon orange"><i class="fas fa-file-signature"></i></div><div class="stat-info"><h3>${ndaList.length}</h3><p>Yêu cầu NDA</p></div></div>
<div class="stat-card" style="cursor:pointer" onclick="showBuyerTab('contact')"><div class="stat-icon cyan"><i class="fas fa-address-book"></i></div><div class="stat-info"><h3>${contactList.length}</h3><p>Yêu cầu liên hệ</p></div></div>
</div>
<div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
<button class="btn btn-primary" onclick="navigate('deals')"><i class="fas fa-search"></i> Khám phá Deal</button>
<button class="btn btn-secondary" onclick="navigate('saved-deals')"><i class="fas fa-bookmark"></i> Tất cả Deal đã lưu</button>
<button class="btn btn-secondary" onclick="navigate('my-activities')"><i class="fas fa-history"></i> Lịch sử hoạt động</button>
</div>
<div class="tab-bar">
<button class="tab-btn active" onclick="showBuyerTab('saved',this)"><i class="fas fa-bookmark"></i> Deal đã lưu</button>
<button class="tab-btn" onclick="showBuyerTab('offers',this)"><i class="fas fa-hand-holding-usd"></i> Offer (${offerList.length})</button>
<button class="tab-btn" onclick="showBuyerTab('nda',this)"><i class="fas fa-file-signature"></i> NDA (${ndaList.length})</button>
<button class="tab-btn" onclick="showBuyerTab('contact',this)"><i class="fas fa-address-book"></i> Liên hệ (${contactList.length})</button>
<button class="tab-btn" onclick="showBuyerTab('chat',this)"><i class="fas fa-comments"></i> Chat</button>
</div>
<div id="buyerTabContent">
${bookmarks.length?'<div class="grid-3">'+bookmarks.slice(0,6).map(deal=>'<div class="card deal-card" onclick="navigate(\'deal-detail\','+deal.id+')" style="cursor:pointer;padding:0;overflow:hidden;display:flex;flex-direction:column"><div style="height:140px;background:url(\''+getIndustryImage(deal.industry,deal.id)+'\') center/cover"></div><div style="padding:16px;flex:1"><div class="deal-card-header"><span class="deal-card-badge badge-'+deal.status+'">'+statusLabel(deal.status)+'</span></div><h3 style="font-size:1rem">'+deal.deal_name+'</h3><div class="deal-card-industry"><i class="fas fa-industry"></i> '+(deal.industry||'')+'</div><div class="deal-card-metrics"><div class="deal-metric"><div class="deal-metric-label">Định giá</div><div class="deal-metric-value">'+formatMoney(deal.valuation)+'</div></div></div></div></div>').join('')+'</div>':'<div class="empty-state"><i class="fas fa-bookmark"></i><h3>Chưa lưu deal nào</h3><p>Vào trang chi tiết deal và bấm "Lưu Deal" để theo dõi</p></div>'}
</div>
<div class="section-header" style="text-align:left;margin-top:40px"><h2>🔥 Deal mới nhất trên sàn</h2></div>
<div class="grid-3" id="buyerDeals"><div class="loading"><div class="spinner"></div></div></div>
</div>`;
document.getElementById('buyerDeals').innerHTML=dealsRes.deals.length?dealsRes.deals.map(deal=>'<div class="card deal-card" onclick="navigate(\'deal-detail\','+deal.id+')" style="cursor:pointer;padding:0;overflow:hidden;display:flex;flex-direction:column"><div style="height:160px;background:url(\''+getIndustryImage(deal.industry,deal.id)+'\') center/cover"></div><div style="padding:20px;flex:1"><div class="deal-card-header"><span class="deal-card-badge badge-'+deal.status+'">'+statusLabel(deal.status)+'</span></div><h3>'+deal.deal_name+'</h3><div class="deal-card-industry"><i class="fas fa-industry"></i> '+(deal.industry||'')+'</div><div class="deal-card-metrics"><div class="deal-metric"><div class="deal-metric-label">Định giá</div><div class="deal-metric-value">'+formatMoney(deal.valuation)+'</div></div><div class="deal-metric"><div class="deal-metric-label">Loại</div><div class="deal-metric-value">'+dealTypeLabel(deal.deal_type)+'</div></div></div></div></div>').join(''):'<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-inbox"></i><h3>Chưa có deal nào</h3></div>';
// Store data for tabs
window._buyerData = {bookmarks, offerList, ndaList, contactList, chats};
}catch(e){toast(e.message||'Lỗi tải dashboard','error')}}

window.showBuyerTab = function(tab, btn){
  if(btn){document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}
  const el = document.getElementById('buyerTabContent');
  const d = window._buyerData||{};
  if(tab==='saved'){
    el.innerHTML = (d.bookmarks||[]).length?'<div class="grid-3">'+(d.bookmarks||[]).slice(0,6).map(deal=>'<div class="card deal-card" onclick="navigate(\'deal-detail\','+deal.id+')" style="cursor:pointer;padding:0;overflow:hidden;display:flex;flex-direction:column"><div style="height:140px;background:url(\''+getIndustryImage(deal.industry,deal.id)+'\') center/cover"></div><div style="padding:16px;flex:1"><div class="deal-card-header"><span class="deal-card-badge badge-'+deal.status+'">'+statusLabel(deal.status)+'</span></div><h3 style="font-size:1rem">'+deal.deal_name+'</h3><div class="deal-card-industry"><i class="fas fa-industry"></i> '+(deal.industry||'')+'</div><div class="deal-card-metrics"><div class="deal-metric"><div class="deal-metric-label">Định giá</div><div class="deal-metric-value">'+formatMoney(deal.valuation)+'</div></div></div></div></div>').join('')+'</div>':'<div class="empty-state"><i class="fas fa-bookmark"></i><h3>Chưa lưu deal nào</h3></div>';
  } else if(tab==='offers'){
    el.innerHTML = (d.offerList||[]).length?'<div class="table-wrap"><table class="data-table"><thead><tr><th>Deal</th><th>Số tiền Offer</th><th>Lời nhắn</th><th>Trạng thái Deal</th><th>Ngày gửi</th><th>Hành động</th></tr></thead><tbody>'+(d.offerList||[]).map(o=>'<tr><td style="font-weight:600">'+o.deal_name+'</td><td style="color:var(--success);font-weight:700">'+formatMoney(o.offer_amount)+'</td><td>'+(o.message||'-')+'</td><td><span class="deal-card-badge badge-'+o.deal_status+'">'+statusLabel(o.deal_status)+'</span></td><td>'+formatDate(o.created_at)+'</td><td><a href="javascript:void(0)" onclick="navigate(\'deal-detail\','+o.deal_id+')" style="color:var(--primary2);font-size:.85rem"><i class="fas fa-eye"></i> Xem</a></td></tr>').join('')+'</tbody></table></div>':'<div class="empty-state"><i class="fas fa-hand-holding-usd"></i><h3>Chưa gửi offer nào</h3><p>Vào chi tiết deal để gửi offer cho seller</p></div>';
  } else if(tab==='nda'){
    el.innerHTML = (d.ndaList||[]).length?'<div class="table-wrap"><table class="data-table"><thead><tr><th>Deal</th><th>Trạng thái Deal</th><th>Ngày yêu cầu</th><th>Hành động</th></tr></thead><tbody>'+(d.ndaList||[]).map(o=>'<tr><td style="font-weight:600">'+o.deal_name+'</td><td><span class="deal-card-badge badge-'+o.deal_status+'">'+statusLabel(o.deal_status)+'</span></td><td>'+formatDate(o.created_at)+'</td><td><a href="javascript:void(0)" onclick="navigate(\'deal-detail\','+o.deal_id+')" style="color:var(--primary2);font-size:.85rem"><i class="fas fa-eye"></i> Xem Deal</a></td></tr>').join('')+'</tbody></table></div>':'<div class="empty-state"><i class="fas fa-file-signature"></i><h3>Chưa yêu cầu NDA nào</h3><p>Yêu cầu NDA để truy cập thông tin chi tiết deal</p></div>';
  } else if(tab==='contact'){
    el.innerHTML = (d.contactList||[]).length?'<div class="table-wrap"><table class="data-table"><thead><tr><th>Deal</th><th>Trạng thái Deal</th><th>Ngày yêu cầu</th><th>Hành động</th></tr></thead><tbody>'+(d.contactList||[]).map(o=>'<tr><td style="font-weight:600">'+o.deal_name+'</td><td><span class="deal-card-badge badge-'+o.deal_status+'">'+statusLabel(o.deal_status)+'</span></td><td>'+formatDate(o.created_at)+'</td><td><a href="javascript:void(0)" onclick="navigate(\'deal-detail\','+o.deal_id+')" style="color:var(--primary2);font-size:.85rem"><i class="fas fa-eye"></i> Xem Deal</a></td></tr>').join('')+'</tbody></table></div>':'<div class="empty-state"><i class="fas fa-address-book"></i><h3>Chưa gửi yêu cầu liên hệ nào</h3></div>';
  } else if(tab==='chat'){
    el.innerHTML = (d.chats||[]).length?'<div class="table-wrap"><table class="data-table"><thead><tr><th>Deal</th><th>Người nhắn</th><th>Tin nhắn mới nhất</th><th>Thời gian</th><th>Hành động</th></tr></thead><tbody>'+(d.chats||[]).map(c=>'<tr><td style="font-weight:600">'+c.deal_name+'</td><td>'+c.other_name+'</td><td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+c.last_message+'</td><td>'+formatDate(c.last_time)+'</td><td><a href="javascript:void(0)" onclick="navigate(\'deal-detail\','+c.deal_id+')" style="color:var(--primary2);font-size:.85rem"><i class="fas fa-comments"></i> Mở chat</a></td></tr>').join('')+'</tbody></table></div>':'<div class="empty-state"><i class="fas fa-comments"></i><h3>Chưa có cuộc trò chuyện nào</h3><p>Vào chi tiết deal để bắt đầu chat đàm phán</p></div>';
  }
};

async function renderAdvisorDashboard(){if(!currentUser){navigate('login');return}
document.getElementById('mainContent').innerHTML='<div class="dashboard"><div class="loading"><div class="spinner"></div></div></div>';
try{
const [dealsRes, bookmarks, offers, requests] = await Promise.all([
  api('/api/deals?limit=20'),
  api('/api/bookmarks'),
  api('/api/my-offers'),
  api('/api/advisor/requests').catch(()=>[])
]);
const allDeals = dealsRes.deals || [];
const industries = {};
allDeals.forEach(d=>{const ind = d.industry||'Khác'; industries[ind]=(industries[ind]||0)+1;});
const reqOffers = requests.filter(r=>r.type==='offer');
const reqNda = requests.filter(r=>r.type==='nda_request');
const reqContact = requests.filter(r=>r.type==='contact_request');
document.getElementById('mainContent').innerHTML=`
<div class="dashboard"><div class="dashboard-header"><h1>🎯 Dashboard Tư vấn viên</h1><p>Xin chào ${currentUser.full_name} - Hỗ trợ kết nối doanh nghiệp & nhà đầu tư</p></div>
<div class="stats-grid">
<div class="stat-card"><div class="stat-icon blue"><i class="fas fa-briefcase"></i></div><div class="stat-info"><h3>${allDeals.length}</h3><p>Deal trên sàn</p></div></div>
<div class="stat-card" style="cursor:pointer" onclick="showAdvisorTab('offers')"><div class="stat-icon green"><i class="fas fa-hand-holding-usd"></i></div><div class="stat-info"><h3>${reqOffers.length}</h3><p>Offer từ NĐT</p></div></div>
<div class="stat-card" style="cursor:pointer" onclick="showAdvisorTab('nda')"><div class="stat-icon orange"><i class="fas fa-file-signature"></i></div><div class="stat-info"><h3>${reqNda.length}</h3><p>Yêu cầu NDA</p></div></div>
<div class="stat-card" style="cursor:pointer" onclick="showAdvisorTab('contact')"><div class="stat-icon cyan"><i class="fas fa-phone"></i></div><div class="stat-info"><h3>${reqContact.length}</h3><p>Yêu cầu liên hệ</p></div></div>
</div>
<div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
<button class="btn btn-primary" onclick="navigate('deals')"><i class="fas fa-search"></i> Xem tất cả Deal</button>
<button class="btn btn-secondary" onclick="navigate('saved-deals')"><i class="fas fa-star"></i> Deal đang theo dõi (${bookmarks.length})</button>
<button class="btn btn-secondary" onclick="navigate('my-activities')"><i class="fas fa-clipboard-list"></i> Lịch sử tư vấn</button>
</div>
<div class="tab-bar">
<button class="tab-btn active" onclick="showAdvisorTab('all',this)"><i class="fas fa-bell"></i> Tất cả yêu cầu (${requests.length})</button>
<button class="tab-btn" onclick="showAdvisorTab('offers',this)"><i class="fas fa-hand-holding-usd"></i> Offer (${reqOffers.length})</button>
<button class="tab-btn" onclick="showAdvisorTab('nda',this)"><i class="fas fa-file-signature"></i> NDA (${reqNda.length})</button>
<button class="tab-btn" onclick="showAdvisorTab('contact',this)"><i class="fas fa-phone"></i> Liên hệ (${reqContact.length})</button>
<button class="tab-btn" onclick="showAdvisorTab('industry',this)"><i class="fas fa-chart-pie"></i> Ngành nghề</button>
<button class="tab-btn" onclick="showAdvisorTab('deals',this)"><i class="fas fa-list"></i> Deal</button>
</div>
<div id="advisorTabContent"></div>
</div>`;
window._advisorData = {requests, reqOffers, reqNda, reqContact, industries, allDeals, bookmarks};
showAdvisorTab('all');
}catch(e){toast(e.message||'Lỗi tải dashboard','error')}}

window.showAdvisorTab = function(tab, btn){
  if(btn){document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}
  const el = document.getElementById('advisorTabContent');
  const d = window._advisorData||{};
  function reqTable(list){
    return list.length?'<div class="table-wrap"><table class="data-table"><thead><tr><th>Loại</th><th>Nhà đầu tư</th><th>Email</th><th>Deal</th><th>Ngành</th><th>Định giá</th><th>Số tiền</th><th>Lời nhắn</th><th>Ngày</th><th></th></tr></thead><tbody>'+list.map(r=>'<tr><td><span class="deal-card-badge badge-'+(r.type==='offer'?'approved':r.type==='nda_request'?'submitted':'under_review')+'">'+(r.type==='offer'?'💰 Offer':r.type==='nda_request'?'📄 NDA':'📞 Liên hệ')+'</span></td><td style="font-weight:600">'+r.buyer_name+'</td><td style="font-size:.8rem;color:var(--text3)">'+r.buyer_email+'</td><td>'+r.deal_name+'</td><td>'+(r.industry||'-')+'</td><td>'+formatMoney(r.valuation)+'</td><td style="color:var(--success);font-weight:700">'+(r.offer_amount?formatMoney(r.offer_amount):'-')+'</td><td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(r.message||'-')+'</td><td>'+formatDate(r.created_at)+'</td><td><a href="javascript:void(0)" onclick="navigate(\'deal-detail\','+r.deal_id+')" style="color:var(--primary2);font-size:.85rem"><i class="fas fa-eye"></i></a></td></tr>').join('')+'</tbody></table></div>':'<div class="empty-state"><i class="fas fa-inbox"></i><h3>Chưa có yêu cầu nào</h3></div>';
  }
  if(tab==='all') el.innerHTML = reqTable(d.requests||[]);
  else if(tab==='offers') el.innerHTML = reqTable(d.reqOffers||[]);
  else if(tab==='nda') el.innerHTML = reqTable(d.reqNda||[]);
  else if(tab==='contact') el.innerHTML = reqTable(d.reqContact||[]);
  else if(tab==='industry'){
    el.innerHTML = '<div class="card" style="max-width:700px"><h3 style="margin-bottom:16px"><i class="fas fa-chart-pie" style="color:var(--primary2)"></i> Phân bổ Deal theo ngành</h3>'+Object.entries(d.industries||{}).sort((a,b)=>b[1]-a[1]).map(([ind,count])=>'<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)"><span style="font-size:.9rem">'+ind+'</span><div style="display:flex;align-items:center;gap:10px"><div style="width:'+Math.min(count/((d.allDeals||[]).length||1)*250,250)+'px;height:10px;background:linear-gradient(90deg,var(--primary),var(--accent));border-radius:5px"></div><span style="font-size:.9rem;font-weight:700;color:var(--primary2)">'+count+' deal</span></div></div>').join('')+'</div>';
  } else if(tab==='deals'){
    el.innerHTML = '<div class="table-wrap"><table class="data-table"><thead><tr><th>ID</th><th>Tên Deal</th><th>Ngành</th><th>Định giá</th><th>Loại</th><th>Seller</th><th>Trạng thái</th></tr></thead><tbody>'+(d.allDeals||[]).slice(0,15).map(dd=>'<tr style="cursor:pointer" onclick="navigate(\'deal-detail\','+dd.id+')"><td>#'+dd.id+'</td><td style="font-weight:600">'+dd.deal_name+'</td><td>'+(dd.industry||'-')+'</td><td>'+formatMoney(dd.valuation)+'</td><td>'+dealTypeLabel(dd.deal_type)+'</td><td>'+(dd.seller_name||'-')+'</td><td><span class="deal-card-badge badge-'+dd.status+'">'+statusLabel(dd.status)+'</span></td></tr>').join('')+'</tbody></table></div>';
  }
};

async function renderAdmin(){if(!currentUser||currentUser.role!=='admin'){navigate('login');return}
try{const s=await api('/api/admin/stats');document.getElementById('mainContent').innerHTML=`
<div class="dashboard"><div class="dashboard-header"><h1>🛡️ Admin Dashboard</h1><p>Quản trị hệ thống M&A Platform</p></div>
<div class="stats-grid"><div class="stat-card"><div class="stat-icon blue"><i class="fas fa-users"></i></div><div class="stat-info"><h3>${s.totalUsers}</h3><p>Người dùng</p></div></div>
<div class="stat-card"><div class="stat-icon green"><i class="fas fa-briefcase"></i></div><div class="stat-info"><h3>${s.totalDeals}</h3><p>Tổng deal</p></div></div>
<div class="stat-card"><div class="stat-icon orange"><i class="fas fa-clock"></i></div><div class="stat-info"><h3>${s.pendingDeals}</h3><p>Chờ duyệt</p></div></div>
<div class="stat-card"><div class="stat-icon cyan"><i class="fas fa-check-circle"></i></div><div class="stat-info"><h3>${s.publishedDeals}</h3><p>Đang hiển thị</p></div></div></div>
<div class="tab-bar"><button class="tab-btn active" onclick="showAdminTab('deals',this)">Deal</button><button class="tab-btn" onclick="showAdminTab('users',this)">Users</button></div>
<div id="adminTabContent">
<div class="table-wrap"><table class="data-table"><thead><tr><th>ID</th><th>Tên Deal</th><th>Seller</th><th>Định giá</th><th>Trạng thái</th><th>Ngày tạo</th><th>Hành động</th></tr></thead><tbody>
${s.recentDeals.map(d=>'<tr><td>#'+d.id+'</td><td style="font-weight:600">'+d.deal_name+'</td><td>'+d.seller_name+'</td><td>'+formatMoney(d.valuation)+'</td><td><span class="deal-card-badge badge-'+d.status+'">'+statusLabel(d.status)+'</span></td><td>'+formatDate(d.created_at)+'</td><td style="display:flex;gap:6px;align-items:center"><select class="filter-input" style="min-width:120px;padding:6px 8px;font-size:.75rem" onchange="updateDealStatus('+d.id+',this.value)"><option value="submitted" '+(d.status==='submitted'?'selected':'')+'>Submitted</option><option value="approved" '+(d.status==='approved'?'selected':'')+'>Approved</option><option value="published" '+(d.status==='published'?'selected':'')+'>Published</option><option value="closed" '+(d.status==='closed'?'selected':'')+'>Closed</option></select><a href="javascript:void(0)" style="background:var(--danger);color:#fff;padding:8px 14px;border-radius:8px;font-size:.8rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;cursor:pointer" onclick="deleteDeal('+d.id+')"><i class="fas fa-trash"></i> Xoá</a></td></tr>').join('')}
</tbody></table></div></div></div>`}catch(err){toast(err.message,'error')}}
async function updateDealStatus(id,status){try{await api('/api/deals/'+id+'/status',{method:'PATCH',body:JSON.stringify({status})});toast('Cập nhật trạng thái thành công!','success')}catch(err){toast(err.message,'error')}}
async function showAdminTab(tab,btn){document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
if(tab==='users'){const users=await api('/api/admin/users');document.getElementById('adminTabContent').innerHTML='<div class="table-wrap"><table class="data-table"><thead><tr><th>ID</th><th>Tên</th><th>Email</th><th>Role</th><th>KYC</th><th>Ngày tạo</th><th>Hành động</th></tr></thead><tbody>'+users.map(u=>'<tr><td>#'+u.id+'</td><td>'+u.full_name+'</td><td>'+u.email+'</td><td><span class="deal-card-badge badge-approved">'+u.role+'</span></td><td>'+u.kyc_status+'</td><td>'+formatDate(u.created_at)+'</td><td>'+(u.role!=='admin'?'<a href="javascript:void(0)" style="background:var(--danger);color:#fff;padding:8px 14px;border-radius:8px;font-size:.8rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;cursor:pointer" onclick="deleteUser('+u.id+')"><i class="fas fa-trash"></i> Xoá</a>':'<span style="color:var(--text3);font-size:.75rem">Admin</span>')+'</td></tr>').join('')+'</tbody></table></div>'}
else{renderAdmin()}}
window.deleteUser = async function(id){
  alert('Đang xoá user #'+id);
  if(!confirm('Bạn có chắc muốn xoá người dùng #'+id+'?\nToàn bộ dữ liệu sẽ bị xoá!'))return;
  try{
    var res=await api('/api/admin/users/'+id,{method:'DELETE'});
    toast(res.message||'Đã xoá!','success');
    renderAdmin();
  }catch(err){toast(err.message,'error')}
};
window.deleteDeal = async function(id){
  alert('Đang xoá deal #'+id);
  if(!confirm('Bạn có chắc muốn xoá deal #'+id+'?'))return;
  try{
    var res=await api('/api/admin/deals/'+id,{method:'DELETE'});
    toast(res.message||'Đã xoá!','success');
    renderAdmin();
  }catch(err){toast(err.message,'error')}
};

async function renderNotifications(){if(!currentUser){navigate('login');return}
try{const n=await api('/api/notifications');document.getElementById('mainContent').innerHTML=`
<div class="dashboard"><div class="dashboard-header"><h1><i class="fas fa-bell"></i> Thông báo</h1><button class="btn btn-sm btn-secondary" onclick="markAllRead()">Đánh dấu đã đọc</button></div>
${n.length?n.map(noti=>'<div class="card" style="margin-bottom:8px;'+(noti.is_read?'opacity:.6':'')+'"><div style="display:flex;justify-content:space-between"><strong>'+noti.title+'</strong><span style="font-size:.75rem;color:var(--text3)">'+formatDate(noti.created_at)+'</span></div><p style="color:var(--text2);font-size:.85rem;margin-top:4px">'+noti.content+'</p></div>').join(''):'<div class="empty-state"><i class="fas fa-bell-slash"></i><h3>Không có thông báo</h3></div>'}
</div>`}catch(err){toast(err.message,'error')}}
async function markAllRead(){try{await api('/api/notifications/read-all',{method:'PATCH'});toast('Đã đánh dấu tất cả','success');renderNotifications()}catch(e){}}

