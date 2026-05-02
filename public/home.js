function renderHome() {
  document.getElementById('mainContent').innerHTML = `
    <!-- HERO SECTION -->
    <section class="hero" style="background-image: linear-gradient(rgba(10, 14, 26, 0.7), rgba(10, 14, 26, 0.95)), url('hero_banner.png'); background-size: cover; background-position: center; background-attachment: fixed;">
      <div class="hero-badge"><i class="fas fa-rocket"></i> Nền tảng M&A #1 Việt Nam</div>
      <h1>Kết nối Doanh nghiệp<br>với Nhà đầu tư Toàn cầu</h1>
      <p>Nền tảng M&A chuyên nghiệp giúp doanh nghiệp đăng bán, gọi vốn và kết nối với nhà đầu tư tiềm năng một cách nhanh chóng, an toàn và minh bạch.</p>
      
      <div class="hero-buttons">
        <button class="btn btn-primary" onclick="goCreateDeal()"><i class="fas fa-plus"></i> Đăng Deal ngay</button>
        <button class="btn btn-secondary" onclick="goExploreDeals()"><i class="fas fa-search"></i> Khám phá Deal</button>
      </div>
      
      <div class="hero-stats">
        <div class="hero-stat">
          <div class="hero-stat-value" id="hDeals">0</div>
          <div class="hero-stat-label">Deal Đang Mở</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-value" id="hUsers">0</div>
          <div class="hero-stat-label">Nhà Đầu Tư Active</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-value" id="hVal">0₫</div>
          <div class="hero-stat-label">Tổng Giá Trị Giao Dịch</div>
        </div>
      </div>
    </section>

    <!-- TRUSTED BY SECTION -->
    <section class="partners-section" style="padding: 40px 24px; background: var(--bg2); border-bottom: 1px solid var(--border); text-align: center;">
      <p style="color: var(--text3); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px; font-weight: 600;">ĐỐI TÁC CHIẾN LƯỢC & QUỸ ĐẦU TƯ</p>
      <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; opacity: 0.6; align-items: center;">
        <i class="fab fa-aws fa-3x"></i>
        <i class="fab fa-stripe fa-3x"></i>
        <i class="fab fa-google-pay fa-3x"></i>
        <i class="fab fa-apple-pay fa-3x"></i>
        <i class="fab fa-cc-visa fa-3x"></i>
        <i class="fab fa-microsoft fa-3x"></i>
      </div>
    </section>

    <!-- FEATURED DEALS SECTION -->
    <section class="featured-deals" style="padding: 80px 24px;">
      <div class="container">
        <div class="section-header">
          <h2>Deal M&A Nổi Bật</h2>
          <p>Khám phá các cơ hội đầu tư chất lượng cao đã qua kiểm duyệt kỹ lưỡng</p>
        </div>
        <div class="grid-3">
          <!-- Deal 1 -->
          <div class="card deal-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
            <div style="height: 200px; background: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80') center/cover;"></div>
            <div style="padding: 24px; flex: 1;">
              <h3 style="margin-top:0;">Chuỗi Bán lẻ Công nghệ Top 3 Miền Nam</h3>
              <div class="deal-card-industry"><i class="fas fa-tag"></i> Bán lẻ / Công nghệ</div>
              <p style="font-size: 0.85rem; color: var(--text2); margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Chuỗi bán lẻ với 50+ cửa hàng, doanh thu ổn định, cần gọi vốn mở rộng ra thị trường miền Bắc và miền Trung.</p>
              <div class="deal-card-metrics">
                <div class="deal-metric"><div class="deal-metric-label">Doanh thu</div><div class="deal-metric-value">500 Tỷ VNĐ</div></div>
                <div class="deal-metric"><div class="deal-metric-label">Định giá</div><div class="deal-metric-value">1,200 Tỷ VNĐ</div></div>
              </div>
            </div>
            <div style="padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg3);">
              <span style="font-size: 0.8rem; color: var(--text3);"><i class="fas fa-map-marker-alt"></i> TP.HCM</span>
            </div>
          </div>
          
          <!-- Deal 2 -->
          <div class="card deal-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
            <div style="height: 200px; background: url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80') center/cover;"></div>
            <div style="padding: 24px; flex: 1;">
              <h3 style="margin-top:0;">Công ty SaaS Quản trị Nhân sự AI</h3>
              <div class="deal-card-industry"><i class="fas fa-tag"></i> Software / AI</div>
              <p style="font-size: 0.85rem; color: var(--text2); margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Nền tảng SaaS B2B có 200+ khách hàng doanh nghiệp, ARR tăng trưởng 300% YoY, cần M&A exit cho Founders.</p>
              <div class="deal-card-metrics">
                <div class="deal-metric"><div class="deal-metric-label">Doanh thu</div><div class="deal-metric-value">20 Tỷ VNĐ</div></div>
                <div class="deal-metric"><div class="deal-metric-label">Định giá</div><div class="deal-metric-value">150 Tỷ VNĐ</div></div>
              </div>
            </div>
            <div style="padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg3);">
              <span style="font-size: 0.8rem; color: var(--text3);"><i class="fas fa-map-marker-alt"></i> Hà Nội</span>
            </div>
          </div>

          <!-- Deal 3 -->
          <div class="card deal-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
            <div style="height: 200px; background: url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80') center/cover;"></div>
            <div style="padding: 24px; flex: 1;">
              <h3 style="margin-top:0;">Nhà Máy Sản Xuất Bao Bì Xanh Sinh Học</h3>
              <div class="deal-card-industry"><i class="fas fa-tag"></i> Sản xuất / Môi trường</div>
              <p style="font-size: 0.85rem; color: var(--text2); margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Sở hữu công nghệ sản xuất bao bì tự hủy sinh học độc quyền, đang xuất khẩu sang EU, cần vốn mở rộng công suất.</p>
              <div class="deal-card-metrics">
                <div class="deal-metric"><div class="deal-metric-label">Doanh thu</div><div class="deal-metric-value">120 Tỷ VNĐ</div></div>
                <div class="deal-metric"><div class="deal-metric-label">Định giá</div><div class="deal-metric-value">350 Tỷ VNĐ</div></div>
              </div>
            </div>
            <div style="padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg3);">
              <span style="font-size: 0.8rem; color: var(--text3);"><i class="fas fa-map-marker-alt"></i> Bình Dương</span>
            </div>
          </div>
          
          <!-- Deal 4 -->
          <div class="card deal-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
            <div style="height: 200px; background: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80') center/cover;"></div>
            <div style="padding: 24px; flex: 1;">
              <h3 style="margin-top:0;">Chuỗi Khách Sạn Boutique Tại Hội An</h3>
              <div class="deal-card-industry"><i class="fas fa-tag"></i> Bất động sản / Du lịch</div>
              <p style="font-size: 0.85rem; color: var(--text2); margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Sở hữu 5 khách sạn boutique tại phố cổ Hội An, công suất phòng trung bình 85%, dòng tiền ổn định.</p>
              <div class="deal-card-metrics">
                <div class="deal-metric"><div class="deal-metric-label">Doanh thu</div><div class="deal-metric-value">80 Tỷ VNĐ</div></div>
                <div class="deal-metric"><div class="deal-metric-label">Định giá</div><div class="deal-metric-value">250 Tỷ VNĐ</div></div>
              </div>
            </div>
            <div style="padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg3);">
              <span style="font-size: 0.8rem; color: var(--text3);"><i class="fas fa-map-marker-alt"></i> Hội An</span>
            </div>
          </div>

          <!-- Deal 5 -->
          <div class="card deal-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
            <div style="height: 200px; background: url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80') center/cover;"></div>
            <div style="padding: 24px; flex: 1;">
              <h3 style="margin-top:0;">Nền Tảng EdTech Đào Tạo Lập Trình</h3>
              <div class="deal-card-industry"><i class="fas fa-tag"></i> Giáo dục / Công nghệ</div>
              <p style="font-size: 0.85rem; color: var(--text2); margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Hệ thống học tập trực tuyến với hơn 50,000 học viên, đang tìm kiếm đầu tư Series A để mở rộng khóa học.</p>
              <div class="deal-card-metrics">
                <div class="deal-metric"><div class="deal-metric-label">Doanh thu</div><div class="deal-metric-value">30 Tỷ VNĐ</div></div>
                <div class="deal-metric"><div class="deal-metric-label">Định giá</div><div class="deal-metric-value">100 Tỷ VNĐ</div></div>
              </div>
            </div>
            <div style="padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg3);">
              <span style="font-size: 0.8rem; color: var(--text3);"><i class="fas fa-map-marker-alt"></i> Đà Nẵng</span>
            </div>
          </div>

          <!-- Deal 6 -->
          <div class="card deal-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
            <div style="height: 200px; background: url('https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=600&q=80') center/cover;"></div>
            <div style="padding: 24px; flex: 1;">
              <h3 style="margin-top:0;">Công Ty Logistics & Kho Bãi Thông Minh</h3>
              <div class="deal-card-industry"><i class="fas fa-tag"></i> Vận tải / Logistics</div>
              <p style="font-size: 0.85rem; color: var(--text2); margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Hệ thống kho bãi tự động 10,000m2 ứng dụng robot, đối tác của nhiều sàn TMĐT lớn, cần vốn nâng cấp phần mềm.</p>
              <div class="deal-card-metrics">
                <div class="deal-metric"><div class="deal-metric-label">Doanh thu</div><div class="deal-metric-value">150 Tỷ VNĐ</div></div>
                <div class="deal-metric"><div class="deal-metric-label">Định giá</div><div class="deal-metric-value">400 Tỷ VNĐ</div></div>
              </div>
            </div>
            <div style="padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg3);">
              <span style="font-size: 0.8rem; color: var(--text3);"><i class="fas fa-map-marker-alt"></i> Hải Phòng</span>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 40px;">
          <button class="btn btn-secondary" onclick="goExploreDeals()">Xem toàn bộ Deal <i class="fas fa-arrow-right"></i></button>
        </div>
      </div>
    </section>

    <!-- FEATURES SECTION -->
    <section class="features" style="background: var(--bg2);">
      <div class="container">
        <div class="section-header">
          <h2>Hệ Sinh Thái M&A Toàn Diện</h2>
          <p>Cung cấp mọi công cụ bạn cần từ lúc tạo deal cho đến khi hoàn tất giao dịch</p>
        </div>
        
        <div class="grid-3" style="margin-bottom: 40px;">
          <div class="card feature-card">
            <div class="feature-icon" style="background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.15));"><i class="fas fa-shield-alt"></i></div>
            <h3>Data Room Bảo Mật (VDR)</h3>
            <p>Hệ thống phòng dữ liệu ảo mã hóa cấp độ ngân hàng, kiểm soát truy cập từng file, chặn chụp màn hình và tracking người dùng chi tiết.</p>
          </div>
          
          <div class="card feature-card">
            <div class="feature-icon" style="background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.15)); color: var(--success);"><i class="fas fa-robot"></i></div>
            <h3>AI Smart Matching</h3>
            <p>Thuật toán học máy tự động phân tích hồ sơ đầu tư và đề xuất các deal phù hợp nhất, tối ưu hóa ROI và rút ngắn thời gian tìm kiếm.</p>
          </div>
          
          <div class="card feature-card">
            <div class="feature-icon" style="background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.15)); color: var(--warning);"><i class="fas fa-file-signature"></i></div>
            <h3>e-Legal Workflow</h3>
            <p>Tạo và ký kết hợp đồng số nhanh chóng: NDA tự động, LOI, Term Sheet với tính năng chữ ký số chuẩn pháp lý.</p>
          </div>
        </div>
        
        <div class="grid-2">
           <div class="card" style="padding: 40px; display: flex; flex-direction: column; justify-content: center;">
             <h3 style="font-size: 1.8rem; margin-bottom: 20px; font-weight: 800;"><span class="logo-accent">Dành cho Doanh Nghiệp</span></h3>
             <ul style="list-style: none; padding: 0; color: var(--text2); margin-bottom: 30px;">
               <li style="margin-bottom: 12px; display: flex; gap: 12px;"><i class="fas fa-check-circle" style="color: var(--success); margin-top: 4px;"></i> <span>Tiếp cận hàng ngàn nhà đầu tư tổ chức và cá nhân đã qua KYC.</span></li>
               <li style="margin-bottom: 12px; display: flex; gap: 12px;"><i class="fas fa-check-circle" style="color: var(--success); margin-top: 4px;"></i> <span>Định giá doanh nghiệp tự động với AI dựa trên dữ liệu thị trường.</span></li>
               <li style="margin-bottom: 12px; display: flex; gap: 12px;"><i class="fas fa-check-circle" style="color: var(--success); margin-top: 4px;"></i> <span>Bảo mật tuyệt đối danh tính với tính năng "Anonymous Listing".</span></li>
             </ul>
             <button class="btn btn-primary" style="align-self: flex-start;" onclick="goCreateDeal()">Tạo Hồ Sơ Doanh Nghiệp</button>
           </div>
           
           <div class="card" style="padding: 40px; display: flex; flex-direction: column; justify-content: center;">
             <h3 style="font-size: 1.8rem; margin-bottom: 20px; font-weight: 800;"><span class="logo-accent">Dành cho Nhà Đầu Tư</span></h3>
             <ul style="list-style: none; padding: 0; color: var(--text2); margin-bottom: 30px;">
               <li style="margin-bottom: 12px; display: flex; gap: 12px;"><i class="fas fa-check-circle" style="color: var(--primary2); margin-top: 4px;"></i> <span>Nguồn deal M&A độc quyền, đa dạng ngành nghề và quy mô.</span></li>
               <li style="margin-bottom: 12px; display: flex; gap: 12px;"><i class="fas fa-check-circle" style="color: var(--primary2); margin-top: 4px;"></i> <span>Thông tin tài chính minh bạch, đã qua thẩm định sơ bộ.</span></li>
               <li style="margin-bottom: 12px; display: flex; gap: 12px;"><i class="fas fa-check-circle" style="color: var(--primary2); margin-top: 4px;"></i> <span>Trực tiếp liên hệ đàm phán với Chủ doanh nghiệp/Founder.</span></li>
             </ul>
             <button class="btn btn-secondary" style="align-self: flex-start;" onclick="goExploreDeals()">Khám Phá Deal</button>
           </div>
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section style="padding: 100px 24px; text-align: center; background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.1)); position: relative; overflow: hidden;">
      <div style="position: relative; z-index: 2; max-width: 800px; margin: 0 auto;">
        <h2 style="font-size: 2.5rem; font-weight: 900; margin-bottom: 20px;">Sẵn Sàng Thúc Đẩy Giao Dịch M&A Của Bạn?</h2>
        <p style="font-size: 1.1rem; color: var(--text2); margin-bottom: 40px;">Tham gia cùng +5,000 doanh nghiệp và nhà đầu tư đang giao dịch trên nền tảng của chúng tôi mỗi ngày.</p>
        <div style="display: flex; gap: 16px; justify-content: center;">
          <button class="btn btn-primary" style="padding: 16px 40px; font-size: 1.1rem; border-radius: 30px;" onclick="navigate('register')">Đăng Ký Miễn Phí</button>
        </div>
      </div>
    </section>

    <!-- EXTENDED FOOTER -->
    <footer style="background: var(--bg); border-top: 1px solid var(--border); padding: 80px 24px 40px;">
      <div class="container">
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 60px;">
          <div>
            <a href="#" class="nav-logo" style="margin-bottom: 20px; display: inline-flex;">
              <i class="fas fa-handshake"></i>
              <span>M&A<span class="logo-accent">Platform</span></span>
            </a>
            <p style="color: var(--text2); font-size: 0.9rem; line-height: 1.6; margin-bottom: 24px;">Nền tảng kết nối đầu tư M&A ứng dụng công nghệ tiên tiến, giúp đơn giản hóa quá trình thẩm định, đàm phán và giao dịch doanh nghiệp an toàn.</p>
            <div style="display: flex; gap: 16px;">
              <a href="#" style="width: 40px; height: 40px; border-radius: 50%; background: var(--bg2); display: flex; align-items: center; justify-content: center; color: var(--text); border: 1px solid var(--border); transition: all 0.3s;"><i class="fab fa-linkedin-in"></i></a>
              <a href="#" style="width: 40px; height: 40px; border-radius: 50%; background: var(--bg2); display: flex; align-items: center; justify-content: center; color: var(--text); border: 1px solid var(--border); transition: all 0.3s;"><i class="fab fa-twitter"></i></a>
              <a href="#" style="width: 40px; height: 40px; border-radius: 50%; background: var(--bg2); display: flex; align-items: center; justify-content: center; color: var(--text); border: 1px solid var(--border); transition: all 0.3s;"><i class="fab fa-facebook-f"></i></a>
            </div>
          </div>
          <div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; color: var(--text);">Nền tảng</h4>
            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; color: var(--text2); font-size: 0.9rem;">
              <li><a href="#" style="transition: color 0.3s;">Tìm kiếm Deal</a></li>
              <li><a href="#" style="transition: color 0.3s;">Tạo Deal Mới</a></li>
              <li><a href="#" style="transition: color 0.3s;">Virtual Data Room</a></li>
              <li><a href="#" style="transition: color 0.3s;">Định giá Doanh nghiệp</a></li>
            </ul>
          </div>
          <div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; color: var(--text);">Tài nguyên</h4>
            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; color: var(--text2); font-size: 0.9rem;">
              <li><a href="#" style="transition: color 0.3s;">M&A Guide</a></li>
              <li><a href="#" style="transition: color 0.3s;">Mẫu Pháp lý (NDA, LOI)</a></li>
              <li><a href="#" style="transition: color 0.3s;">Báo cáo Ngành</a></li>
              <li><a href="#" style="transition: color 0.3s;">Blog Đầu tư</a></li>
            </ul>
          </div>
          <div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; color: var(--text);">Công ty</h4>
            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; color: var(--text2); font-size: 0.9rem;">
              <li><a href="#" style="transition: color 0.3s;">Về chúng tôi</a></li>
              <li><a href="#" style="transition: color 0.3s;">Liên hệ</a></li>
              <li><a href="#" style="transition: color 0.3s;">Chính sách bảo mật</a></li>
              <li><a href="#" style="transition: color 0.3s;">Điều khoản sử dụng</a></li>
            </ul>
          </div>
        </div>
        <div style="border-top: 1px solid var(--border); padding-top: 24px; text-align: center; color: var(--text3); font-size: 0.85rem;">
          <p>&copy; 2026 M&A Platform. Nền tảng được bảo hộ bản quyền. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
  loadHomeStats();
}

async function loadHomeStats() {
  try {
    const d = await api('/api/deals?limit=1');
    document.getElementById('hDeals').textContent = d.total || '1,245';
    document.getElementById('hUsers').textContent = '12.5K+';
    document.getElementById('hVal').textContent = '8.5 Tỷ USD+';
  } catch(e) {
    document.getElementById('hDeals').textContent = '1,245';
    document.getElementById('hUsers').textContent = '12.5K+';
    document.getElementById('hVal').textContent = '8.5 Tỷ USD+';
  }
}

function goCreateDeal() {
  if (currentUser) {
    navigate('create-deal');
  } else {
    toast('Vui lòng đăng nhập để đăng deal', 'info');
    navigate('login');
  }
}

function goExploreDeals() {
  if (currentUser) {
    navigate('deals');
  } else {
    toast('Vui lòng đăng nhập để khám phá deal', 'info');
    navigate('login');
  }
}
