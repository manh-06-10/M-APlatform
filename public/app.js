const API='';let token=localStorage.getItem('token'),currentUser=null,currentPage='home';
async function api(url,opt={}){const h={'Content-Type':'application/json',...(opt.headers||{})};if(token)h['Authorization']='Bearer '+token;if(opt.body instanceof FormData){delete h['Content-Type']};const r=await fetch(API+url,{...opt,headers:h});const d=await r.json();if(!r.ok)throw new Error(d.error||'Lỗi');return d}
function toast(msg,type='info'){const t=document.createElement('div');t.className='toast toast-'+type;t.innerHTML='<i class="fas fa-'+(type==='success'?'check-circle':type==='error'?'times-circle':'info-circle')+'"></i>'+msg;document.getElementById('toastContainer').appendChild(t);setTimeout(()=>t.remove(),3000)}
function formatMoney(n){if(!n)return'N/A';n=Number(n);if(n>=1e12)return(n/1e12).toFixed(1).replace('.0','')+' nghìn tỷ ₫';if(n>=1e9)return(n/1e9).toFixed(1).replace('.0','')+' tỷ ₫';if(n>=1e6)return(n/1e6).toFixed(1).replace('.0','')+' triệu ₫';return new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND',maximumFractionDigits:0}).format(n)}
function formatDate(d){if(!d)return'';return new Date(d).toLocaleDateString('vi-VN')}
function statusLabel(s){const m={draft:'Nháp',submitted:'Đã gửi',under_review:'Đang duyệt',approved:'Đã duyệt',published:'Đang hiển thị',in_negotiation:'Đang đàm phán',closed:'Đã đóng'};return m[s]||s}
function dealTypeLabel(t){const m={sell_100:'Bán 100%',sell_shares:'Bán cổ phần',fundraise:'Gọi vốn'};return m[t]||t||'N/A'}
function getIndustryImage(industry, dealId) {
  const images = {
    'Công nghệ': [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=300&fit=crop'
    ],
    'Bất động sản': [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=300&fit=crop'
    ],
    'F&B': [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=300&fit=crop'
    ],
    'Sản xuất': [
      'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=300&fit=crop'
    ],
    'Tài chính': [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop'
    ],
    'Y tế': [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=300&fit=crop'
    ],
    'Giáo dục': [
      'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=300&fit=crop'
    ],
    'Logistics': [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=600&h=300&fit=crop',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=300&fit=crop'
    ]
  };
  const defaultImages = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop',
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600&h=300&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop'
  ];
  const list = images[industry] || defaultImages;
  return list[(dealId || 0) % list.length];
}
function closeModal(e){if(e&&e.target!==e.currentTarget)return;document.getElementById('modalOverlay').classList.remove('show')}
function openModal(html){const m=document.getElementById('modalContent');m.innerHTML=html;document.getElementById('modalOverlay').classList.add('show')}
function toggleMobileMenu(){document.getElementById('navLinks').classList.toggle('show')}
function updateNav(){const nav=document.getElementById('authNav');if(currentUser){
let dashboardPage = currentUser.role==='admin'?'admin':currentUser.role==='seller'?'seller-dashboard':currentUser.role==='advisor'?'advisor-dashboard':'buyer-dashboard';
let dashboardLink = `<a href="#" onclick="navigate('${dashboardPage}')" class="nav-link" data-page="dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</a>`;
nav.innerHTML= dashboardLink + `
<div class="nav-user"><button class="nav-user-btn" onclick="this.nextElementSibling.classList.toggle('show')"><div class="nav-avatar">${currentUser.full_name[0]}</div>${currentUser.full_name}<i class="fas fa-chevron-down" style="font-size:.6rem"></i></button>
<div class="nav-dropdown"><a href="#" onclick="navigate('profile')"><i class="fas fa-user"></i>Hồ sơ</a><a href="#" onclick="navigate('notifications')"><i class="fas fa-bell"></i>Thông báo</a><button onclick="logout()"><i class="fas fa-sign-out-alt"></i>Đăng xuất</button></div></div>`}
else{nav.innerHTML='<a href="#" onclick="navigate(\'login\')" class="nav-link"><i class="fas fa-sign-in-alt"></i> Đăng nhập</a><a href="#" onclick="navigate(\'register\')" class="nav-btn nav-btn-primary"><i class="fas fa-user-plus"></i> Đăng ký</a>'}}
async function checkAuth(){if(token){try{currentUser=await api('/api/auth/me');updateNav()}catch(e){token=null;localStorage.removeItem('token');currentUser=null;updateNav()}}else{updateNav()}}
function logout(){token=null;currentUser=null;localStorage.removeItem('token');updateNav();navigate('home');toast('Đã đăng xuất','success')}
function navigate(page,data){currentPage=page;document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));const active=document.querySelector(`[data-page="${page}"]`);if(active)active.classList.add('active');document.getElementById('navLinks').classList.remove('show');const main=document.getElementById('mainContent');switch(page){case'home':renderHome();break;case'login':renderLogin();break;case'register':renderRegister();break;case'deals':renderDeals();break;case'deal-detail':renderDealDetail(data);break;case'seller-dashboard':renderSellerDashboard();break;case'buyer-dashboard':renderBuyerDashboard();break;case'advisor-dashboard':renderAdvisorDashboard();break;case'admin':renderAdmin();break;case'create-deal':renderCreateDeal();break;case'create-company':renderCreateCompany();break;case'notifications':renderNotifications();break;case'profile':renderProfile();break;case'saved-deals':renderSavedDeals();break;case'my-activities':renderMyActivities();break;default:renderHome();}window.scrollTo(0,0)}

function renderProfile(){if(!currentUser){navigate('login');return}document.getElementById('mainContent').innerHTML=`
<div class="dashboard"><div class="dashboard-header"><h1><i class="fas fa-user-circle"></i> Hồ sơ cá nhân</h1><p>Quản lý thông tin tài khoản của bạn</p></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:900px">
<div class="card"><h3 style="margin-bottom:16px"><i class="fas fa-id-card"></i> Thông tin hiện tại</h3>
<div class="info-row"><span class="info-row-label">Họ tên</span><span class="info-row-value">${currentUser.full_name}</span></div>
<div class="info-row"><span class="info-row-label">Email</span><span class="info-row-value">${currentUser.email}</span></div>
<div class="info-row"><span class="info-row-label">Vai trò</span><span class="info-row-value"><span class="deal-card-badge badge-approved">${currentUser.role}</span></span></div>
<div class="info-row"><span class="info-row-label">Quốc gia</span><span class="info-row-value">${currentUser.country||'Chưa cập nhật'}</span></div>
<div class="info-row"><span class="info-row-label">Điện thoại</span><span class="info-row-value">${currentUser.phone||'Chưa cập nhật'}</span></div>
<div class="info-row"><span class="info-row-label">KYC</span><span class="info-row-value"><span class="deal-card-badge badge-${currentUser.kyc_status==='verified'?'approved':'submitted'}">${currentUser.kyc_status==='verified'?'Đã xác minh':'Chờ xác minh'}</span></span></div>
<div class="info-row"><span class="info-row-label">Ngày tham gia</span><span class="info-row-value">${formatDate(currentUser.created_at)}</span></div>
</div>
<div class="card"><h3 style="margin-bottom:16px"><i class="fas fa-edit"></i> Chỉnh sửa hồ sơ</h3>
<form onsubmit="updateProfile(event)">
<div class="form-group"><label class="form-label">Họ tên</label><input type="text" id="pName" class="form-input" value="${currentUser.full_name}" required></div>
<div class="form-group"><label class="form-label">Quốc gia</label><input type="text" id="pCountry" list="countryList" class="form-input" placeholder="Tìm và chọn quốc gia" value="${currentUser.country||''}"></div>
<div class="form-group"><label class="form-label">Số điện thoại</label><input type="text" id="pPhone" class="form-input" value="${currentUser.phone||''}"></div>
<button type="submit" class="btn btn-primary btn-block"><i class="fas fa-save"></i> Lưu thay đổi</button>
</form></div></div>
${currentUser.role==='buyer'||currentUser.role==='advisor'?`
<div style="display:flex;gap:12px;margin-top:24px">
<button class="btn btn-secondary" onclick="navigate('saved-deals')"><i class="fas fa-bookmark"></i> Deal đã lưu</button>
<button class="btn btn-secondary" onclick="navigate('my-activities')"><i class="fas fa-history"></i> Hoạt động của tôi</button>
</div>`:''}
</div>`}

async function updateProfile(e){e.preventDefault();try{
  const d=await api('/api/auth/profile',{method:'PATCH',body:JSON.stringify({
    full_name:document.getElementById('pName').value,
    country:document.getElementById('pCountry').value,
    phone:document.getElementById('pPhone').value
  })});
  currentUser=d;updateNav();toast('Cập nhật hồ sơ thành công!','success');renderProfile();
}catch(err){toast(err.message,'error')}}

async function renderSavedDeals(){if(!currentUser){navigate('login');return}
document.getElementById('mainContent').innerHTML='<div class="dashboard"><div class="dashboard-header"><h1><i class="fas fa-bookmark"></i> Deal đã lưu</h1><p>Các deal bạn đã đánh dấu quan tâm</p></div><div class="grid-3" id="savedList"><div class="loading"><div class="spinner"></div></div></div></div>';
try{const deals=await api('/api/bookmarks');
document.getElementById('savedList').innerHTML=deals.length?deals.map(deal=>`
<div class="card deal-card" onclick="navigate('deal-detail',${deal.id})" style="cursor:pointer;padding:0;display:flex;flex-direction:column">
<div style="height:140px;background:url('${getIndustryImage(deal.industry,deal.id)}') center/cover"></div>
<div style="padding:20px;flex:1">
<div class="deal-card-header"><span class="deal-card-badge badge-${deal.status}">${statusLabel(deal.status)}</span></div>
<h3>${deal.deal_name}</h3>
<div class="deal-card-industry"><i class="fas fa-industry"></i> ${deal.industry||''}</div>
<div class="deal-card-metrics">
<div class="deal-metric"><div class="deal-metric-label">Định giá</div><div class="deal-metric-value">${formatMoney(deal.valuation)}</div></div>
</div></div>
<div style="padding:12px 20px;border-top:1px solid var(--border);background:var(--bg3);display:flex;justify-content:space-between">
<span><i class="fas fa-user"></i> ${deal.seller_name||''}</span>
<button class="btn btn-sm btn-danger" onclick="event.stopPropagation();unbookmark(${deal.id})"><i class="fas fa-trash"></i> Bỏ lưu</button>
</div></div>`).join(''):'<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-bookmark"></i><h3>Chưa lưu deal nào</h3><p>Vào trang chi tiết deal và bấm "Lưu deal" để thêm vào danh sách</p></div>';
}catch(err){toast(err.message,'error')}}

async function unbookmark(id){try{await api('/api/deals/'+id+'/bookmark',{method:'POST'});toast('Đã bỏ lưu','success');renderSavedDeals()}catch(e){toast(e.message,'error')}}

async function renderMyActivities(){if(!currentUser){navigate('login');return}
document.getElementById('mainContent').innerHTML='<div class="dashboard"><div class="dashboard-header"><h1><i class="fas fa-history"></i> Hoạt động của tôi</h1><p>Lịch sử tương tác với các deal</p></div><div id="actList"><div class="loading"><div class="spinner"></div></div></div></div>';
try{const offers=await api('/api/my-offers');
document.getElementById('actList').innerHTML=offers.length?'<div class="table-wrap"><table class="data-table"><thead><tr><th>Deal</th><th>Loại</th><th>Số tiền</th><th>Lời nhắn</th><th>Trạng thái Deal</th><th>Ngày</th></tr></thead><tbody>'+offers.map(o=>'<tr style="cursor:pointer" onclick="navigate(\'deal-detail\','+o.deal_id+')"><td style="font-weight:600">'+o.deal_name+'</td><td><span class="deal-card-badge badge-submitted">'+(o.type==='offer'?'Offer':o.type==='nda_request'?'NDA':o.type==='contact_request'?'Liên hệ':o.type)+'</span></td><td>'+(o.offer_amount?formatMoney(o.offer_amount):'-')+'</td><td>'+(o.message||'-')+'</td><td><span class="deal-card-badge badge-'+o.deal_status+'">'+statusLabel(o.deal_status)+'</span></td><td>'+formatDate(o.created_at)+'</td></tr>').join('')+'</tbody></table></div>':'<div class="empty-state"><i class="fas fa-inbox"></i><h3>Chưa có hoạt động nào</h3><p>Khi bạn gửi offer, yêu cầu NDA hoặc liên hệ sẽ hiện ở đây</p></div>';
}catch(err){toast(err.message,'error')}}
