function renderCreateCompany(){if(!currentUser){navigate('login');return}
document.getElementById('mainContent').innerHTML=`
<div class="dashboard"><div class="dashboard-header"><h1><i class="fas fa-building"></i> Tạo hồ sơ doanh nghiệp</h1><p>Nhập thông tin chi tiết về doanh nghiệp của bạn</p></div>
<div class="card" style="max-width:800px"><form onsubmit="handleCreateCompany(event)">
<div class="form-section"><div class="form-section-title"><i class="fas fa-gavel"></i> Thông tin pháp lý</div>
<div class="form-group"><label class="form-label">Tên pháp nhân *</label><input type="text" id="cLegalName" class="form-input" required></div>
<div class="form-row"><div class="form-group"><label class="form-label">Mã số thuế</label><input type="text" id="cTaxCode" class="form-input"></div>
<div class="form-group"><label class="form-label">Quốc gia</label><input type="text" id="cCountry" list="countryList" class="form-input" placeholder="Tìm và chọn quốc gia"></div></div>
<div class="form-group"><label class="form-label">Năm thành lập</label><input type="number" id="cYear" class="form-input" min="1900" max="2026"></div></div>
<div class="form-section"><div class="form-section-title"><i class="fas fa-cogs"></i> Thông tin vận hành</div>
<div class="form-group"><label class="form-label">Ngành nghề</label><select id="cIndustry" class="form-select"><option value="">-- Chọn ngành nghề --</option><option>Công nghệ</option><option>Bất động sản</option><option>F&B</option><option>Sản xuất</option><option>Tài chính</option><option>Y tế</option><option>Giáo dục</option><option>Logistics</option><option>Khác</option></select></div>
<div class="form-group"><label class="form-label">Sản phẩm/Dịch vụ</label><input type="text" id="cProducts" class="form-input"></div>
<div class="form-group"><label class="form-label">Thị trường mục tiêu</label><input type="text" id="cMarket" class="form-input"></div></div>
<div class="form-section"><div class="form-section-title"><i class="fas fa-users"></i> Cơ cấu sở hữu</div>
<div class="form-row"><div class="form-group"><label class="form-label">Founder %</label><input type="number" id="cFounder" class="form-input" value="100" min="0" max="100"></div>
<div class="form-group"><label class="form-label">Investor %</label><input type="number" id="cInvestor" class="form-input" value="0" min="0" max="100"></div></div>
<div class="form-group"><label class="form-label">ESOP %</label><input type="number" id="cEsop" class="form-input" value="0" min="0" max="100"></div></div>
<div class="form-group"><label class="form-label">Mô tả doanh nghiệp</label><textarea id="cDesc" class="form-textarea"></textarea></div>
<button type="submit" class="btn btn-primary btn-block"><i class="fas fa-save"></i> Lưu hồ sơ doanh nghiệp</button>
</form></div></div>`}
async function handleCreateCompany(e){e.preventDefault();try{await api('/api/companies',{method:'POST',body:JSON.stringify({legal_name:document.getElementById('cLegalName').value,tax_code:document.getElementById('cTaxCode').value,country:document.getElementById('cCountry').value,founded_year:parseInt(document.getElementById('cYear').value)||null,industry:document.getElementById('cIndustry').value,products:document.getElementById('cProducts').value,target_market:document.getElementById('cMarket').value,founder_percent:parseFloat(document.getElementById('cFounder').value),investor_percent:parseFloat(document.getElementById('cInvestor').value),esop_percent:parseFloat(document.getElementById('cEsop').value),description:document.getElementById('cDesc').value})});toast('Tạo hồ sơ doanh nghiệp thành công!','success');navigate('create-deal')}catch(err){toast(err.message,'error')}}

async function renderCreateDeal(){if(!currentUser){navigate('login');return}
let companyOpts='<option value="">-- Không liên kết --</option>';
try{const c=await api('/api/companies');companyOpts+=c.map(co=>'<option value="'+co.id+'">'+co.legal_name+'</option>').join('')}catch(e){}
document.getElementById('mainContent').innerHTML=`
<div class="dashboard"><div class="dashboard-header"><h1><i class="fas fa-plus-circle"></i> Tạo Deal M&A</h1><p>Đăng deal để tiếp cận nhà đầu tư</p></div>
<div class="card" style="max-width:900px"><form onsubmit="handleCreateDeal(event)" enctype="multipart/form-data">
<div class="form-section"><div class="form-section-title"><i class="fas fa-info-circle"></i> A. Thông tin cơ bản</div>
<div class="form-group"><label class="form-label">Tên Deal *</label><input type="text" id="dName" class="form-input" required placeholder="VD: Bán công ty công nghệ ABC"></div>
<div class="form-row"><div class="form-group"><label class="form-label">Ngành nghề</label><select id="dIndustry" class="form-select"><option value="">-- Chọn ngành nghề --</option><option>Công nghệ</option><option>Bất động sản</option><option>F&B</option><option>Sản xuất</option><option>Tài chính</option><option>Y tế</option><option>Giáo dục</option><option>Logistics</option></select></div>
<div class="form-group"><label class="form-label">Địa điểm</label><input type="text" id="dLocation" class="form-input" placeholder="VD: TP.HCM, Hà Nội..."></div></div>
<div class="form-group"><label class="form-label">Liên kết doanh nghiệp</label><select id="dCompany" class="form-select">${companyOpts}</select>
<p style="font-size:.75rem;color:var(--text3);margin-top:4px">Chưa có? <a href="#" onclick="navigate('create-company')" style="color:var(--primary2)">Tạo hồ sơ doanh nghiệp</a></p></div></div>
<div class="form-section"><div class="form-section-title"><i class="fas fa-chart-line"></i> B. Thông tin tài chính</div>
<div class="form-row"><div class="form-group"><label class="form-label">Doanh thu năm 1 (VNĐ)</label><input type="number" id="dRev1" class="form-input"></div>
<div class="form-group"><label class="form-label">Doanh thu năm 2</label><input type="number" id="dRev2" class="form-input"></div></div>
<div class="form-row"><div class="form-group"><label class="form-label">Doanh thu năm 3</label><input type="number" id="dRev3" class="form-input"></div>
<div class="form-group"><label class="form-label">EBITDA</label><input type="number" id="dEbitda" class="form-input"></div></div>
<div class="form-row"><div class="form-group"><label class="form-label">Lợi nhuận ròng</label><input type="number" id="dProfit" class="form-input"></div>
<div class="form-group"><label class="form-label">Tốc độ tăng trưởng (%)</label><input type="number" id="dGrowth" class="form-input" step="0.1"></div></div></div>
<div class="form-section"><div class="form-section-title"><i class="fas fa-handshake"></i> C. Thông tin M&A</div>
<div class="form-row"><div class="form-group"><label class="form-label">Loại deal</label><select id="dType" class="form-select"><option value="sell_100">Bán 100%</option><option value="sell_shares">Bán cổ phần</option><option value="fundraise">Gọi vốn</option></select></div>
<div class="form-group"><label class="form-label">Định giá (VNĐ)</label><input type="number" id="dValuation" class="form-input"></div></div>
<div class="form-group"><label class="form-label">Cổ phần chào bán (%)</label><input type="number" id="dEquity" class="form-input" min="0" max="100"></div></div>
<div class="form-section"><div class="form-section-title"><i class="fas fa-bullseye"></i> D. Mục tiêu chiến lược</div>
<div class="form-group"><label class="form-label">Lý do bán</label><textarea id="dReason" class="form-textarea"></textarea></div>
<div class="form-group"><label class="form-label">Kế hoạch tương lai</label><textarea id="dPlan" class="form-textarea"></textarea></div>
<div class="form-group"><label class="form-label">Mô tả chi tiết</label><textarea id="dDesc" class="form-textarea" style="min-height:120px"></textarea></div></div>
<div class="form-section"><div class="form-section-title"><i class="fas fa-upload"></i> E. Tài liệu đính kèm</div>
<div class="form-row"><div class="form-group"><label class="form-label">Pitch Deck</label><div class="form-file"><input type="file" id="dPitch" accept=".pdf,.pptx,.doc,.docx" onchange="showFileName(this,'dPitchName')"><div class="form-file-label"><i class="fas fa-cloud-upload-alt"></i> Chọn file</div></div><div id="dPitchName" class="file-name-display"></div></div>
<div class="form-group"><label class="form-label">Báo cáo tài chính</label><div class="form-file"><input type="file" id="dFinancial" accept=".pdf,.xlsx,.doc,.docx" onchange="showFileName(this,'dFinancialName')"><div class="form-file-label"><i class="fas fa-cloud-upload-alt"></i> Chọn file</div></div><div id="dFinancialName" class="file-name-display"></div></div></div>
<div class="form-group"><label class="form-label">Tài liệu pháp lý</label><div class="form-file"><input type="file" id="dLegal" accept=".pdf,.doc,.docx" onchange="showFileName(this,'dLegalName')"><div class="form-file-label"><i class="fas fa-cloud-upload-alt"></i> Chọn file</div></div><div id="dLegalName" class="file-name-display"></div></div></div>
<div style="display:flex;gap:12px"><button type="submit" class="btn btn-primary" style="flex:1"><i class="fas fa-paper-plane"></i> Đăng Deal</button></div>
</form></div></div>`}
function showFileName(input, displayId) {
  const el = document.getElementById(displayId);
  if (input.files && input.files[0]) {
    const f = input.files[0];
    const sizeMB = (f.size / 1024 / 1024).toFixed(2);
    el.innerHTML = '<i class="fas fa-check-circle" style="color:var(--success)"></i> ' + f.name + ' <span style="color:var(--text3)">(' + sizeMB + ' MB)</span>';
    el.style.display = 'block';
  } else {
    el.innerHTML = '';
    el.style.display = 'none';
  }
}
async function handleCreateDeal(e){e.preventDefault();try{const fd=new FormData();
fd.append('deal_name',document.getElementById('dName').value);fd.append('industry',document.getElementById('dIndustry').value);fd.append('location',document.getElementById('dLocation').value);
fd.append('company_id',document.getElementById('dCompany').value||'');fd.append('revenue_year1',document.getElementById('dRev1').value||'');fd.append('revenue_year2',document.getElementById('dRev2').value||'');fd.append('revenue_year3',document.getElementById('dRev3').value||'');
fd.append('ebitda',document.getElementById('dEbitda').value||'');fd.append('net_profit',document.getElementById('dProfit').value||'');fd.append('growth_rate',document.getElementById('dGrowth').value||'');
fd.append('deal_type',document.getElementById('dType').value);fd.append('valuation',document.getElementById('dValuation').value||'');fd.append('equity_offered',document.getElementById('dEquity').value||'');
fd.append('reason_for_sale',document.getElementById('dReason').value);fd.append('future_plan',document.getElementById('dPlan').value);fd.append('description',document.getElementById('dDesc').value);fd.append('status','submitted');
const pitch=document.getElementById('dPitch').files[0];if(pitch)fd.append('pitch_deck',pitch);
const fin=document.getElementById('dFinancial').files[0];if(fin)fd.append('financial_report',fin);
const legal=document.getElementById('dLegal').files[0];if(legal)fd.append('legal_docs',legal);
const r=await fetch('/api/deals',{method:'POST',headers:{Authorization:'Bearer '+token},body:fd});const d=await r.json();if(!r.ok)throw new Error(d.error);
toast('Tạo deal thành công! Deal sẽ được admin duyệt.','success');navigate('seller-dashboard')}catch(err){toast(err.message,'error')}}
