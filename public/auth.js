function renderLogin(){document.getElementById('mainContent').innerHTML=`
<div class="auth-page"><div class="auth-card card"><h2>Đăng nhập</h2><p class="subtitle">Chào mừng trở lại M&A Platform</p>
<form onsubmit="handleLogin(event)">
<div class="form-group"><label class="form-label">Email</label><input type="email" id="loginEmail" class="form-input" placeholder="email@example.com" required></div>
<div class="form-group"><label class="form-label">Mật khẩu</label><input type="password" id="loginPw" class="form-input" placeholder="Nhập mật khẩu" required></div>
<button type="submit" class="btn btn-primary btn-block"><i class="fas fa-sign-in-alt"></i> Đăng nhập</button>
</form>
<div class="auth-divider">hoặc</div>
<p class="auth-footer">Chưa có tài khoản? <a href="#" onclick="navigate('register')">Đăng ký ngay</a></p>
<div style="margin-top:16px;padding:16px;background:var(--glass);border-radius:8px;font-size:.8rem;color:var(--text3)">
<strong>Admin:</strong> admin@maplatform.com / admin123</div>
</div></div>`}
async function handleLogin(e){e.preventDefault();try{const d=await api('/api/auth/login',{method:'POST',body:JSON.stringify({email:document.getElementById('loginEmail').value,password:document.getElementById('loginPw').value})});token=d.token;localStorage.setItem('token',d.token);currentUser=d.user;updateNav();toast('Đăng nhập thành công!','success');navigate(d.user.role==='admin'?'admin':d.user.role==='seller'?'seller-dashboard':'deals')}catch(err){toast(err.message,'error')}}

function renderRegister(){document.getElementById('mainContent').innerHTML=`
<div class="auth-page"><div class="auth-card card"><h2>Đăng ký tài khoản</h2><p class="subtitle">Tham gia nền tảng M&A hàng đầu</p>
<form onsubmit="handleRegister(event)">
<div class="form-group"><label class="form-label">Bạn là</label>
<div class="role-selector"><div class="role-option selected" onclick="selectRole(this,'seller')"><i class="fas fa-building"></i>Doanh nghiệp bán</div>
<div class="role-option" onclick="selectRole(this,'buyer')"><i class="fas fa-search-dollar"></i>Nhà đầu tư</div>
<div class="role-option" onclick="selectRole(this,'advisor')"><i class="fas fa-user-tie"></i>Tư vấn</div></div>
<input type="hidden" id="regRole" value="seller"></div>
<div class="form-group"><label class="form-label">Họ tên</label><input type="text" id="regName" class="form-input" required></div>
<div class="form-group"><label class="form-label">Email</label><input type="email" id="regEmail" class="form-input" required></div>
<div class="form-group"><label class="form-label">Mật khẩu</label><input type="password" id="regPw" class="form-input" required minlength="6"></div>
<div class="form-row"><div class="form-group"><label class="form-label">Quốc gia</label>
<input type="text" id="regCountry" list="countryList" class="form-input" placeholder="Tìm và chọn quốc gia" required>
</div>
<div class="form-group"><label class="form-label">Số điện thoại</label><input type="text" id="regPhone" class="form-input"></div></div>
<button type="submit" class="btn btn-primary btn-block"><i class="fas fa-user-plus"></i> Đăng ký</button>
</form>
<p class="auth-footer" style="margin-top:16px">Đã có tài khoản? <a href="#" onclick="navigate('login')">Đăng nhập</a></p>
</div></div>`}
function selectRole(el,role){document.querySelectorAll('.role-option').forEach(r=>r.classList.remove('selected'));el.classList.add('selected');document.getElementById('regRole').value=role}
async function handleRegister(e){e.preventDefault();try{const d=await api('/api/auth/register',{method:'POST',body:JSON.stringify({full_name:document.getElementById('regName').value,email:document.getElementById('regEmail').value,password:document.getElementById('regPw').value,role:document.getElementById('regRole').value,country:document.getElementById('regCountry').value,phone:document.getElementById('regPhone').value})});token=d.token;localStorage.setItem('token',d.token);currentUser=d.user;updateNav();toast('Đăng ký thành công!','success');navigate(d.user.role==='seller'?'seller-dashboard':'deals')}catch(err){toast(err.message,'error')}}
