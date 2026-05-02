async function renderDeals(){document.getElementById('mainContent').innerHTML=`
<div class="page-section"><div class="container"><div class="section-header"><h2>Danh sách Deal M&A</h2><p>Khám phá cơ hội đầu tư hấp dẫn</p></div>
<div class="filters-bar"><input type="text" class="filter-input" id="fSearch" placeholder="🔍 Tìm kiếm deal..." onkeyup="if(event.key==='Enter')loadDeals()">
<select class="filter-input" id="fIndustry" onchange="loadDeals()"><option value="">Tất cả ngành</option><option>Công nghệ</option><option>Bất động sản</option><option>F&B</option><option>Sản xuất</option><option>Tài chính</option><option>Y tế</option><option>Giáo dục</option><option>Logistics</option></select>
<select class="filter-input" id="fType" onchange="loadDeals()"><option value="">Loại deal</option><option value="sell_100">Bán 100%</option><option value="sell_shares">Bán cổ phần</option><option value="fundraise">Gọi vốn</option></select>
<select class="filter-input" id="fSize" onchange="loadDeals()"><option value="">Quy mô</option><option value="small">< 10 tỷ</option><option value="medium">10 - 100 tỷ</option><option value="large">100 - 500 tỷ</option><option value="mega">> 500 tỷ</option></select>
<button class="btn btn-primary btn-sm" onclick="loadDeals()"><i class="fas fa-search"></i> Lọc</button></div>
<div class="grid-3" id="dealsList"><div class="loading"><div class="spinner"></div></div></div>
</div></div>`;loadDeals()}
async function loadDeals(){try{const p={};const s=document.getElementById('fSearch')?.value;const i=document.getElementById('fIndustry')?.value;const t=document.getElementById('fType')?.value;const sz=document.getElementById('fSize')?.value;
let q='/api/deals?limit=20';if(s)q+='&search='+encodeURIComponent(s);if(i)q+='&industry='+encodeURIComponent(i);if(t)q+='&deal_type='+t;if(sz)q+='&size='+sz;
const d=await api(q);const el=document.getElementById('dealsList');
if(!d.deals||d.deals.length===0){el.innerHTML='<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-inbox"></i><h3>Chưa có deal nào</h3><p>Hãy là người đầu tiên đăng deal!</p></div>';return}
el.innerHTML=d.deals.map(deal=>{
  const bgImg = getIndustryImage(deal.industry, deal.id);
  return `
  <div class="card deal-card" onclick="navigate('deal-detail',${deal.id})" style="cursor:pointer; padding: 0; display: flex; flex-direction: column;">
  <div style="height: 180px; background: url('${bgImg}') center/cover; border-radius: 16px 16px 0 0;"></div>
  <div style="padding: 20px; flex: 1;">
  <div class="deal-card-header"><span class="deal-card-badge badge-${deal.status}">${statusLabel(deal.status)}</span>
  <span style="font-size:.75rem;color:var(--text3)"><i class="fas fa-eye"></i> ${deal.views_count||0}</span></div>
  <h3 style="margin-bottom: 12px;">${deal.deal_name}</h3>
  <div class="deal-card-industry"><i class="fas fa-industry"></i> ${deal.industry||'Chưa phân loại'} · ${deal.location||''}</div>
  <div class="deal-card-metrics">
  <div class="deal-metric"><div class="deal-metric-label">Định giá</div><div class="deal-metric-value">${formatMoney(deal.valuation)}</div></div>
  <div class="deal-metric"><div class="deal-metric-label">Doanh thu</div><div class="deal-metric-value">${formatMoney(deal.revenue_year1)}</div></div>
  <div class="deal-metric"><div class="deal-metric-label">Loại deal</div><div class="deal-metric-value">${dealTypeLabel(deal.deal_type)}</div></div>
  <div class="deal-metric"><div class="deal-metric-label">EBITDA</div><div class="deal-metric-value">${formatMoney(deal.ebitda)}</div></div>
  </div>
  </div>
  <div class="deal-card-footer" style="padding: 16px 20px; border-top: 1px solid var(--border); background: var(--bg3); display: flex; justify-content: space-between;"><span><i class="fas fa-user"></i> ${deal.seller_name||''}</span><span>${formatDate(deal.created_at)}</span></div>
  </div>`
}).join('')}catch(err){toast(err.message,'error')}
}

async function renderDealDetail(id){document.getElementById('mainContent').innerHTML='<div class="loading" style="padding-top:120px"><div class="spinner"></div></div>';
try{const d=await api('/api/deals/'+id);
const isOwner = currentUser && (currentUser.id === d.user_id || currentUser.role === 'admin');
let interestsHtml = '';
if(isOwner){
  try{
    const interests = await api('/api/deals/'+id+'/interests');
    interestsHtml = '<div class="info-block" style="margin-top:20px"><h3><i class="fas fa-list"></i> Danh sách Quan tâm & Offer</h3>' + 
      (interests.length ? '<div class="table-wrap"><table class="data-table"><thead><tr><th>Người dùng</th><th>Loại</th><th>Số tiền</th><th>Lời nhắn</th><th>Ngày</th></tr></thead><tbody>' + 
      interests.map(i=>`<tr><td>${i.full_name}<br><span style="font-size:0.75rem;color:var(--text3)">${i.email}</span></td><td><span class="deal-card-badge badge-submitted">${i.type}</span></td><td>${i.offer_amount ? formatMoney(i.offer_amount) : '-'}</td><td>${i.message||'-'}</td><td>${formatDate(i.created_at)}</td></tr>`).join('') + 
      '</tbody></table></div>' : '<p style="color:var(--text3)">Chưa có yêu cầu nào.</p>') + '</div>';
  }catch(e){}
}

const dataRoomHtml = '<div class="info-block"><h3><i class="fas fa-folder-open"></i> Virtual Data Room</h3>' +
  '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px">' +
  (d.pitch_deck ? `<a href="/uploads/${d.pitch_deck}" target="_blank" class="btn btn-sm btn-secondary"><i class="fas fa-file-powerpoint"></i> Pitch Deck</a>` : '') +
  (d.financial_report ? `<a href="/uploads/${d.financial_report}" target="_blank" class="btn btn-sm btn-secondary"><i class="fas fa-file-excel"></i> Báo cáo Tài chính</a>` : '') +
  (d.legal_docs ? `<a href="/uploads/${d.legal_docs}" target="_blank" class="btn btn-sm btn-secondary"><i class="fas fa-file-contract"></i> Hồ sơ Pháp lý</a>` : '') +
  (!d.pitch_deck && !d.financial_report && !d.legal_docs ? '<p style="color:var(--text3)">Chưa có tài liệu đính kèm.</p>' : '') +
  '</div></div>';

document.getElementById('mainContent').innerHTML=`
<div class="deal-detail"><button class="btn btn-secondary btn-sm" onclick="navigate('deals')" style="margin-bottom:16px"><i class="fas fa-arrow-left"></i> Quay lại</button>
<div class="deal-detail-header"><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><h1>${d.deal_name}</h1><span class="deal-card-badge badge-${d.status}">${statusLabel(d.status)}</span></div>
<p style="color:var(--text2);margin-top:8px"><i class="fas fa-industry"></i> ${d.industry||''} · <i class="fas fa-map-marker-alt"></i> ${d.location||''} · <i class="fas fa-calendar"></i> ${formatDate(d.created_at)}</p></div>
<div class="deal-info-grid"><div>
<div class="info-block"><h3><i class="fas fa-chart-bar"></i> Thông tin tài chính</h3>
<div class="info-row"><span class="info-row-label">Định giá</span><span class="info-row-value" style="color:var(--success)">${formatMoney(d.valuation)}</span></div>
<div class="info-row"><span class="info-row-label">Doanh thu năm 1</span><span class="info-row-value">${formatMoney(d.revenue_year1)}</span></div>
<div class="info-row"><span class="info-row-label">Doanh thu năm 2</span><span class="info-row-value">${formatMoney(d.revenue_year2)}</span></div>
<div class="info-row"><span class="info-row-label">Doanh thu năm 3</span><span class="info-row-value">${formatMoney(d.revenue_year3)}</span></div>
<div class="info-row"><span class="info-row-label">EBITDA</span><span class="info-row-value">${formatMoney(d.ebitda)}</span></div>
<div class="info-row"><span class="info-row-label">Lợi nhuận ròng</span><span class="info-row-value">${formatMoney(d.net_profit)}</span></div>
<div class="info-row"><span class="info-row-label">Tốc độ tăng trưởng</span><span class="info-row-value">${d.growth_rate||0}%</span></div></div>
<div class="info-block"><h3><i class="fas fa-info-circle"></i> Thông tin M&A</h3>
<div class="info-row"><span class="info-row-label">Loại deal</span><span class="info-row-value">${dealTypeLabel(d.deal_type)}</span></div>
<div class="info-row"><span class="info-row-label">Cổ phần chào bán</span><span class="info-row-value">${d.equity_offered||0}%</span></div>
<div class="info-row"><span class="info-row-label">Lý do bán</span><span class="info-row-value">${d.reason_for_sale||'N/A'}</span></div>
<div class="info-row"><span class="info-row-label">Kế hoạch tương lai</span><span class="info-row-value">${d.future_plan||'N/A'}</span></div></div>
${d.description?'<div class="info-block"><h3><i class="fas fa-align-left"></i> Mô tả</h3><p style="color:var(--text2);line-height:1.8">'+d.description+'</p></div>':''}
${d.company_name?'<div class="info-block"><h3><i class="fas fa-building"></i> Thông tin doanh nghiệp</h3><div class="info-row"><span class="info-row-label">Tên pháp nhân</span><span class="info-row-value">'+d.company_name+'</span></div><div class="info-row"><span class="info-row-label">MST</span><span class="info-row-value">'+(d.tax_code||'N/A')+'</span></div><div class="info-row"><span class="info-row-label">Quốc gia</span><span class="info-row-value">'+(d.company_country||'N/A')+'</span></div><div class="info-row"><span class="info-row-label">Năm thành lập</span><span class="info-row-value">'+(d.founded_year||'N/A')+'</span></div><div class="info-row"><span class="info-row-label">Sản phẩm</span><span class="info-row-value">'+(d.products||'N/A')+'</span></div></div>':''}
${dataRoomHtml}
${interestsHtml}
</div>
<div style="position:sticky;top:90px;align-self:start"><div class="sidebar-card"><h3 style="font-size:1rem;font-weight:700;margin-bottom:4px">Người đăng</h3><p style="color:var(--text2);font-size:.9rem;margin-bottom:16px">${d.seller_name||''}</p>
<div style="display:flex;flex-direction:column;gap:8px">
${currentUser&&!isOwner?'<button class="btn btn-warning btn-block" onclick="toggleBookmark('+d.id+')"><i class="fas fa-bookmark"></i> Lưu Deal</button><button class="btn btn-primary btn-block" onclick="sendInterest('+d.id+','+"'contact_request'"+')"><i class="fas fa-envelope"></i> Yêu cầu liên hệ</button><button class="btn btn-accent btn-block" onclick="sendInterest('+d.id+','+"'nda_request'"+')"><i class="fas fa-file-signature"></i> Yêu cầu NDA</button><button class="btn btn-success btn-block" onclick="showOfferModal('+d.id+')"><i class="fas fa-hand-holding-usd"></i> Gửi Offer</button><button class="btn btn-secondary btn-block" onclick="openChat('+d.id+', '+d.user_id+', '+"'"+d.deal_name+"'"+')"><i class="fas fa-comments"></i> Chat đàm phán</button>': (!currentUser ? '<p style="font-size:.85rem;color:var(--text3)">Đăng nhập để tương tác</p>' : '<p style="font-size:.85rem;color:var(--success)"><i class="fas fa-check-circle"></i> Deal của bạn</p><button class="btn btn-secondary btn-block" onclick="openChat('+d.id+', null, '+"'"+d.deal_name+"'"+')"><i class="fas fa-comments"></i> Chat đàm phán</button>')}
</div></div>
<div class="sidebar-card"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--text3);font-size:.85rem"><i class="fas fa-eye"></i> Lượt xem</span><span style="font-weight:700">${d.views_count||0}</span></div>
<div style="display:flex;justify-content:space-between"><span style="color:var(--text3);font-size:.85rem"><i class="fas fa-heart"></i> Quan tâm</span><span style="font-weight:700">${d.interests_count||0}</span></div></div>
</div></div></div>`}catch(err){toast(err.message,'error');navigate('deals')}
}

async function openChat(dealId, receiverId, dealName) {
  openModal('<div style="height:400px; display:flex; align-items:center; justify-content:center"><div class="spinner"></div></div>');
  try {
    const msgs = await api('/api/messages/' + dealId);
    let chatHtml = `<div style="display:flex; flex-direction:column; height: 60vh;">
      <h2 style="margin-bottom:16px"><i class="fas fa-comments"></i> Chat - ${dealName}</h2>
      <div id="chatMessages" style="flex:1; overflow-y:auto; padding:16px; background:var(--bg3); border-radius:var(--radius); margin-bottom:16px; display:flex; flex-direction:column; gap:12px;">`;
      
    if (msgs.length === 0) {
      chatHtml += '<div class="empty-state" style="padding:20px"><p>Chưa có tin nhắn nào. Bắt đầu đàm phán ngay!</p></div>';
    } else {
      msgs.forEach(m => {
        const isMe = m.sender_id === currentUser.id;
        chatHtml += `<div style="align-self: ${isMe ? 'flex-end' : 'flex-start'}; max-width: 80%; background: ${isMe ? 'var(--primary)' : 'var(--bg2)'}; padding: 12px 16px; border-radius: ${isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px'}; border: 1px solid var(--border);">
          <div style="font-size:0.75rem; color:${isMe ? 'rgba(255,255,255,0.7)' : 'var(--text3)'}; margin-bottom:4px">${m.sender_name} - ${new Date(m.created_at).toLocaleTimeString('vi-VN')}</div>
          <div>${m.content}</div>
        </div>`;
      });
    }
    
    // For seller, they need to select who they are replying to if they have multiple buyers. 
    // To simplify, if receiverId is null (seller opening it), we assume they reply to the last message's sender if not themselves.
    if (!receiverId && msgs.length > 0) {
      const lastMsgFromOther = msgs.slice().reverse().find(m => m.sender_id !== currentUser.id);
      if (lastMsgFromOther) receiverId = lastMsgFromOther.sender_id;
    }

    chatHtml += `</div>
      <form style="display:flex; gap:8px;" onsubmit="sendChat(event, ${dealId}, ${receiverId || 0}, '${dealName}')">
        <input type="text" id="chatInput" class="form-input" placeholder="Nhập tin nhắn..." required ${!receiverId ? 'disabled title="Chưa có người mua nhắn tin"' : ''}>
        <button type="submit" class="btn btn-primary" ${!receiverId ? 'disabled' : ''}><i class="fas fa-paper-plane"></i></button>
      </form>
    </div>`;
    
    openModal(chatHtml);
    setTimeout(() => {
      const box = document.getElementById('chatMessages');
      if(box) box.scrollTop = box.scrollHeight;
    }, 100);
  } catch (err) {
    toast('Không thể tải tin nhắn: ' + err.message, 'error');
  }
}

async function sendChat(e, dealId, receiverId, dealName) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const content = input.value.trim();
  if (!content || !receiverId) return;
  try {
    await api('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ deal_id: dealId, receiver_id: receiverId, content })
    });
    input.value = '';
    // Reload chat
    openChat(dealId, receiverId, dealName);
  } catch(err) {
    toast(err.message, 'error');
  }
}
async function sendInterest(dealId,type){if(!currentUser){toast('Vui lòng đăng nhập','error');navigate('login');return}try{await api('/api/deals/'+dealId+'/interest',{method:'POST',body:JSON.stringify({type})});toast('Gửi yêu cầu thành công!','success')}catch(err){toast(err.message,'error')}}
function showOfferModal(dealId){openModal(`<h2>Gửi Offer</h2><form onsubmit="submitOffer(event,${dealId})"><div class="form-group"><label class="form-label">Số tiền offer (VNĐ)</label><input type="number" id="offerAmount" class="form-input" required></div><div class="form-group"><label class="form-label">Tin nhắn</label><textarea id="offerMsg" class="form-textarea" placeholder="Mô tả offer của bạn..."></textarea></div><button type="submit" class="btn btn-primary btn-block">Gửi Offer</button></form>`)}
async function submitOffer(e,dealId){e.preventDefault();try{await api('/api/deals/'+dealId+'/interest',{method:'POST',body:JSON.stringify({type:'offer',offer_amount:document.getElementById('offerAmount').value,message:document.getElementById('offerMsg').value})});closeModal({target:document.getElementById('modalOverlay'),currentTarget:document.getElementById('modalOverlay')});toast('Gửi offer thành công!','success')}catch(err){toast(err.message,'error')}}
async function toggleBookmark(id){try{const d=await api('/api/deals/'+id+'/bookmark',{method:'POST'});toast(d.message,d.bookmarked?'success':'info')}catch(e){toast(e.message,'error')}}
