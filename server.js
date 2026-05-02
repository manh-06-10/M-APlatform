const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'ma-platform-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
}

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// ===================== DATABASE SETUP =====================
const db = new Database(path.join(__dirname, 'ma_platform.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'buyer' CHECK(role IN ('buyer','seller','advisor','admin')),
    country TEXT,
    phone TEXT,
    avatar TEXT,
    kyc_status TEXT DEFAULT 'pending' CHECK(kyc_status IN ('pending','verified','rejected')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    legal_name TEXT NOT NULL,
    tax_code TEXT,
    country TEXT,
    founded_year INTEGER,
    industry TEXT,
    products TEXT,
    target_market TEXT,
    founder_percent REAL DEFAULT 0,
    investor_percent REAL DEFAULT 0,
    esop_percent REAL DEFAULT 0,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    company_id INTEGER,
    deal_name TEXT NOT NULL,
    industry TEXT,
    location TEXT,
    revenue_year1 REAL,
    revenue_year2 REAL,
    revenue_year3 REAL,
    ebitda REAL,
    net_profit REAL,
    growth_rate REAL,
    deal_type TEXT CHECK(deal_type IN ('sell_100','sell_shares','fundraise')),
    valuation REAL,
    equity_offered REAL,
    reason_for_sale TEXT,
    future_plan TEXT,
    description TEXT,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft','submitted','under_review','approved','published','in_negotiation','closed')),
    pitch_deck TEXT,
    financial_report TEXT,
    legal_docs TEXT,
    views_count INTEGER DEFAULT 0,
    interests_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
  );

  CREATE TABLE IF NOT EXISTS deal_interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deal_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    type TEXT DEFAULT 'bookmark' CHECK(type IN ('bookmark','nda_request','contact_request','offer')),
    offer_amount REAL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deal_id) REFERENCES deals(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deal_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deal_id) REFERENCES deals(id),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Create default admin account
const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@maplatform.com');
if (!adminExists) {
  const hashedPw = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (email, password, full_name, role, kyc_status) VALUES (?, ?, ?, ?, ?)').run(
    'admin@maplatform.com', hashedPw, 'System Admin', 'admin', 'verified'
  );
}

// ===================== AUTH MIDDLEWARE =====================
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
}

function roleMiddleware(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }
    next();
  };
}

// ===================== AUTH ROUTES =====================
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, full_name, role, country, phone } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(400).json({ error: 'Email đã được sử dụng' });

    const hashedPw = bcrypt.hashSync(password, 10);
    const userRole = ['buyer', 'seller', 'advisor'].includes(role) ? role : 'buyer';
    const result = db.prepare(
      'INSERT INTO users (email, password, full_name, role, country, phone) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(email, hashedPw, full_name, userRole, country || null, phone || null);

    const token = jwt.sign({ id: result.lastInsertRowid, email, role: userRole, full_name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.lastInsertRowid, email, full_name, role: userRole } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Email không tồn tại' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Sai mật khẩu' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, full_name: user.full_name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role, kyc_status: user.kyc_status } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, email, full_name, role, country, phone, kyc_status, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

// ===================== COMPANY ROUTES =====================
app.post('/api/companies', authMiddleware, roleMiddleware('seller', 'admin'), (req, res) => {
  try {
    const { legal_name, tax_code, country, founded_year, industry, products, target_market, founder_percent, investor_percent, esop_percent, description } = req.body;
    if (!legal_name) return res.status(400).json({ error: 'Tên pháp nhân bắt buộc' });

    const result = db.prepare(`
      INSERT INTO companies (user_id, legal_name, tax_code, country, founded_year, industry, products, target_market, founder_percent, investor_percent, esop_percent, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, legal_name, tax_code, country, founded_year, industry, products, target_market, founder_percent || 0, investor_percent || 0, esop_percent || 0, description);

    res.json({ id: result.lastInsertRowid, message: 'Tạo hồ sơ doanh nghiệp thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/companies', authMiddleware, (req, res) => {
  const companies = db.prepare('SELECT * FROM companies WHERE user_id = ?').all(req.user.id);
  res.json(companies);
});

app.get('/api/companies/:id', authMiddleware, (req, res) => {
  const company = db.prepare('SELECT * FROM companies WHERE id = ?').get(req.params.id);
  if (!company) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json(company);
});

// ===================== DEAL ROUTES =====================
app.post('/api/deals', authMiddleware, roleMiddleware('seller', 'admin'), upload.fields([
  { name: 'pitch_deck', maxCount: 1 },
  { name: 'financial_report', maxCount: 1 },
  { name: 'legal_docs', maxCount: 1 }
]), (req, res) => {
  try {
    const d = req.body;
    if (!d.deal_name) return res.status(400).json({ error: 'Tên deal bắt buộc' });

    const pitchDeck = req.files?.pitch_deck?.[0]?.filename || null;
    const financialReport = req.files?.financial_report?.[0]?.filename || null;
    const legalDocs = req.files?.legal_docs?.[0]?.filename || null;

    const result = db.prepare(`
      INSERT INTO deals (user_id, company_id, deal_name, industry, location, revenue_year1, revenue_year2, revenue_year3,
        ebitda, net_profit, growth_rate, deal_type, valuation, equity_offered, reason_for_sale, future_plan, description,
        status, pitch_deck, financial_report, legal_docs)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id, d.company_id || null, d.deal_name, d.industry, d.location,
      d.revenue_year1 || null, d.revenue_year2 || null, d.revenue_year3 || null,
      d.ebitda || null, d.net_profit || null, d.growth_rate || null,
      d.deal_type || 'sell_100', d.valuation || null, d.equity_offered || null,
      d.reason_for_sale, d.future_plan, d.description,
      d.status || 'submitted', pitchDeck, financialReport, legalDocs
    );

    // Notify admin
    const admins = db.prepare("SELECT id FROM users WHERE role = 'admin'").all();
    admins.forEach(admin => {
      db.prepare('INSERT INTO notifications (user_id, title, content, type) VALUES (?, ?, ?, ?)').run(
        admin.id, 'Deal mới được đăng', `Deal "${d.deal_name}" cần được duyệt`, 'new_deal'
      );
    });

    res.json({ id: result.lastInsertRowid, message: 'Tạo deal thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all published deals (for buyers)
app.get('/api/deals', (req, res) => {
  try {
    const { industry, deal_type, min_valuation, max_valuation, location, search, size, page = 1, limit = 12 } = req.query;
    let where = "WHERE d.status = 'published'";
    const params = [];

    if (industry) { where += ' AND d.industry = ?'; params.push(industry); }
    if (deal_type) { where += ' AND d.deal_type = ?'; params.push(deal_type); }
    if (min_valuation) { where += ' AND d.valuation >= ?'; params.push(Number(min_valuation)); }
    if (max_valuation) { where += ' AND d.valuation <= ?'; params.push(Number(max_valuation)); }
    if (location) { where += ' AND d.location LIKE ?'; params.push(`%${location}%`); }
    if (search) { where += ' AND (d.deal_name LIKE ? OR d.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (size === 'small') { where += ' AND d.valuation < ?'; params.push(10000000000); }
    if (size === 'medium') { where += ' AND d.valuation >= ? AND d.valuation < ?'; params.push(10000000000, 100000000000); }
    if (size === 'large') { where += ' AND d.valuation >= ? AND d.valuation < ?'; params.push(100000000000, 500000000000); }
    if (size === 'mega') { where += ' AND d.valuation >= ?'; params.push(500000000000); }

    const offset = (Number(page) - 1) * Number(limit);
    const countRow = db.prepare(`SELECT COUNT(*) as total FROM deals d ${where}`).get(...params);
    const deals = db.prepare(`
      SELECT d.*, u.full_name as seller_name, c.legal_name as company_name, c.industry as company_industry
      FROM deals d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN companies c ON d.company_id = c.id
      ${where}
      ORDER BY d.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, Number(limit), offset);

    res.json({ deals, total: countRow.total, page: Number(page), totalPages: Math.ceil(countRow.total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get my deals (for seller)
app.get('/api/deals/my', authMiddleware, (req, res) => {
  const deals = db.prepare(`
    SELECT d.*, c.legal_name as company_name FROM deals d
    LEFT JOIN companies c ON d.company_id = c.id
    WHERE d.user_id = ?
    ORDER BY d.created_at DESC
  `).all(req.user.id);
  res.json(deals);
});

// Update deal status (seller publish/unpublish/close)
app.patch('/api/deals/:id/publish', authMiddleware, roleMiddleware('seller', 'admin'), (req, res) => {
  const { status } = req.body;
  if (!['published', 'approved', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }

  const deal = db.prepare('SELECT status, user_id FROM deals WHERE id = ?').get(req.params.id);
  if (!deal) return res.status(404).json({ error: 'Không tìm thấy deal' });
  if (deal.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Không có quyền sửa deal này' });
  }
  if (!['published', 'approved', 'closed'].includes(deal.status)) {
    return res.status(400).json({ error: 'Deal chưa được duyệt hoặc đã đóng' });
  }

  db.prepare('UPDATE deals SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, req.params.id);
  let msg = 'Đã cập nhật trạng thái';
  if(status === 'published') msg = 'Đã công khai deal lên sàn';
  if(status === 'approved') msg = 'Đã tạm ẩn deal';
  if(status === 'closed') msg = 'Đã đóng deal thành công';
  res.json({ message: msg });
});

// Get deal detail
app.get('/api/deals/:id', (req, res) => {
  const deal = db.prepare(`
    SELECT d.*, u.full_name as seller_name, u.email as seller_email,
    c.legal_name as company_name, c.industry as company_industry, c.tax_code, c.country as company_country,
    c.founded_year, c.products, c.target_market, c.description as company_description
    FROM deals d
    LEFT JOIN users u ON d.user_id = u.id
    LEFT JOIN companies c ON d.company_id = c.id
    WHERE d.id = ?
  `).get(req.params.id);
  if (!deal) return res.status(404).json({ error: 'Không tìm thấy deal' });

  // Increment view count
  db.prepare('UPDATE deals SET views_count = views_count + 1 WHERE id = ?').run(req.params.id);
  res.json(deal);
});

// Update deal status (admin)
app.patch('/api/deals/:id/status', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE deals SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, req.params.id);

  const deal = db.prepare('SELECT * FROM deals WHERE id = ?').get(req.params.id);
  if (deal) {
    db.prepare('INSERT INTO notifications (user_id, title, content, type) VALUES (?, ?, ?, ?)').run(
      deal.user_id, 'Cập nhật trạng thái deal', `Deal "${deal.deal_name}" đã được chuyển sang trạng thái: ${status}`, 'deal_status'
    );
  }

  res.json({ message: 'Cập nhật thành công' });
});

// ===================== INTEREST / BOOKMARK ROUTES =====================
app.post('/api/deals/:id/interest', authMiddleware, (req, res) => {
  try {
    const { type, offer_amount, message } = req.body;
    const result = db.prepare(
      'INSERT INTO deal_interests (deal_id, user_id, type, offer_amount, message) VALUES (?, ?, ?, ?, ?)'
    ).run(req.params.id, req.user.id, type || 'bookmark', offer_amount, message);

    db.prepare('UPDATE deals SET interests_count = interests_count + 1 WHERE id = ?').run(req.params.id);

    // Notify seller
    const deal = db.prepare('SELECT * FROM deals WHERE id = ?').get(req.params.id);
    if (deal) {
      const typeLabels = { bookmark: 'đánh dấu', nda_request: 'yêu cầu NDA', contact_request: 'yêu cầu liên hệ', offer: 'gửi offer' };
      db.prepare('INSERT INTO notifications (user_id, title, content, type) VALUES (?, ?, ?, ?)').run(
        deal.user_id, 'Có nhà đầu tư quan tâm', `Có người ${typeLabels[type] || 'quan tâm'} deal "${deal.deal_name}"`, 'interest'
      );
    }

    res.json({ id: result.lastInsertRowid, message: 'Thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/deals/:id/interests', authMiddleware, (req, res) => {
  const interests = db.prepare(`
    SELECT di.*, u.full_name, u.email FROM deal_interests di
    JOIN users u ON di.user_id = u.id
    WHERE di.deal_id = ?
    ORDER BY di.created_at DESC
  `).all(req.params.id);
  res.json(interests);
});

// ===================== MESSAGE ROUTES =====================
app.post('/api/messages', authMiddleware, (req, res) => {
  const { deal_id, receiver_id, content } = req.body;
  const result = db.prepare(
    'INSERT INTO messages (deal_id, sender_id, receiver_id, content) VALUES (?, ?, ?, ?)'
  ).run(deal_id, req.user.id, receiver_id, content);

  db.prepare('INSERT INTO notifications (user_id, title, content, type) VALUES (?, ?, ?, ?)').run(
    receiver_id, 'Tin nhắn mới', `Bạn có tin nhắn mới từ ${req.user.full_name}`, 'message'
  );

  res.json({ id: result.lastInsertRowid });
});

app.get('/api/messages/:dealId', authMiddleware, (req, res) => {
  const messages = db.prepare(`
    SELECT m.*, u.full_name as sender_name FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.deal_id = ? AND (m.sender_id = ? OR m.receiver_id = ?)
    ORDER BY m.created_at ASC
  `).all(req.params.dealId, req.user.id, req.user.id);
  res.json(messages);
});

// ===================== NOTIFICATION ROUTES =====================
app.get('/api/notifications', authMiddleware, (req, res) => {
  const notifications = db.prepare(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
  ).all(req.user.id);
  res.json(notifications);
});

app.patch('/api/notifications/read-all', authMiddleware, (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.user.id);
  res.json({ message: 'OK' });
});

// ===================== ADMIN ROUTES =====================
app.get('/api/admin/stats', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const totalDeals = db.prepare('SELECT COUNT(*) as count FROM deals').get().count;
  const pendingDeals = db.prepare("SELECT COUNT(*) as count FROM deals WHERE status = 'submitted'").get().count;
  const publishedDeals = db.prepare("SELECT COUNT(*) as count FROM deals WHERE status = 'published'").get().count;
  const totalValuation = db.prepare("SELECT COALESCE(SUM(valuation), 0) as total FROM deals WHERE status = 'published'").get().total;
  const totalInterests = db.prepare('SELECT COUNT(*) as count FROM deal_interests').get().count;

  const recentDeals = db.prepare(`
    SELECT d.*, u.full_name as seller_name FROM deals d
    JOIN users u ON d.user_id = u.id
    ORDER BY d.created_at DESC LIMIT 10
  `).all();

  const recentUsers = db.prepare('SELECT id, email, full_name, role, kyc_status, created_at FROM users ORDER BY created_at DESC LIMIT 10').all();

  res.json({ totalUsers, totalDeals, pendingDeals, publishedDeals, totalValuation, totalInterests, recentDeals, recentUsers });
});

app.get('/api/admin/deals', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const deals = db.prepare(`
    SELECT d.*, u.full_name as seller_name, u.email as seller_email
    FROM deals d
    JOIN users u ON d.user_id = u.id
    ORDER BY d.created_at DESC
  `).all();
  res.json(deals);
});

app.get('/api/admin/users', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const users = db.prepare('SELECT id, email, full_name, role, country, phone, kyc_status, created_at FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

app.patch('/api/admin/users/:id/kyc', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const { kyc_status } = req.body;
  db.prepare('UPDATE users SET kyc_status = ? WHERE id = ?').run(kyc_status, req.params.id);
  res.json({ message: 'Cập nhật KYC thành công' });
});

// Delete user (admin only)
app.delete('/api/admin/users/:id', authMiddleware, roleMiddleware('admin'), (req, res) => {
  try {
    const userId = req.params.id;
    // Prevent deleting yourself
    if (Number(userId) === req.user.id) {
      return res.status(400).json({ error: 'Không thể xoá chính mình' });
    }
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

    // Delete related data
    db.prepare('DELETE FROM notifications WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?').run(userId, userId);
    db.prepare('DELETE FROM deal_interests WHERE user_id = ?').run(userId);
    // Delete deals of this user
    const userDeals = db.prepare('SELECT id FROM deals WHERE user_id = ?').all(userId);
    for (const deal of userDeals) {
      db.prepare('DELETE FROM deal_interests WHERE deal_id = ?').run(deal.id);
      db.prepare('DELETE FROM messages WHERE deal_id = ?').run(deal.id);
    }
    db.prepare('DELETE FROM deals WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM companies WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);

    res.json({ message: `Đã xoá người dùng "${user.full_name}" thành công` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete deal (admin only)
app.delete('/api/admin/deals/:id', authMiddleware, roleMiddleware('admin'), (req, res) => {
  try {
    const dealId = req.params.id;
    const deal = db.prepare('SELECT * FROM deals WHERE id = ?').get(dealId);
    if (!deal) return res.status(404).json({ error: 'Không tìm thấy deal' });

    db.prepare('DELETE FROM deal_interests WHERE deal_id = ?').run(dealId);
    db.prepare('DELETE FROM messages WHERE deal_id = ?').run(dealId);
    db.prepare('DELETE FROM deals WHERE id = ?').run(dealId);

    res.json({ message: `Đã xoá deal "${deal.deal_name}" thành công` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== BOOKMARK ROUTES =====================
app.post('/api/deals/:id/bookmark', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM deal_interests WHERE deal_id = ? AND user_id = ? AND type = ?').get(req.params.id, req.user.id, 'bookmark');
  if (existing) {
    db.prepare('DELETE FROM deal_interests WHERE id = ?').run(existing.id);
    res.json({ bookmarked: false, message: 'Đã bỏ lưu deal' });
  } else {
    db.prepare('INSERT INTO deal_interests (deal_id, user_id, type) VALUES (?, ?, ?)').run(req.params.id, req.user.id, 'bookmark');
    res.json({ bookmarked: true, message: 'Đã lưu deal' });
  }
});

app.get('/api/bookmarks', authMiddleware, (req, res) => {
  const bookmarks = db.prepare(`
    SELECT d.*, u.full_name as seller_name FROM deal_interests di
    JOIN deals d ON di.deal_id = d.id
    LEFT JOIN users u ON d.user_id = u.id
    WHERE di.user_id = ? AND di.type = 'bookmark'
    ORDER BY di.created_at DESC
  `).all(req.user.id);
  res.json(bookmarks);
});

app.get('/api/my-offers', authMiddleware, (req, res) => {
  const offers = db.prepare(`
    SELECT di.*, d.deal_name, d.valuation, d.status as deal_status, u.full_name as seller_name
    FROM deal_interests di
    JOIN deals d ON di.deal_id = d.id
    LEFT JOIN users u ON d.user_id = u.id
    WHERE di.user_id = ? AND di.type IN ('offer','nda_request','contact_request')
    ORDER BY di.created_at DESC
  `).all(req.user.id);
  res.json(offers);
});

app.get('/api/my-chats', authMiddleware, (req, res) => {
  try {
    const chats = db.prepare(`
      SELECT m.deal_id, d.deal_name, m.content as last_message, m.created_at as last_time,
        CASE WHEN m.sender_id = ? THEN r.full_name ELSE s.full_name END as other_name
      FROM messages m
      JOIN deals d ON m.deal_id = d.id
      LEFT JOIN users s ON m.sender_id = s.id
      LEFT JOIN users r ON m.receiver_id = r.id
      WHERE (m.sender_id = ? OR m.receiver_id = ?)
      AND m.id IN (
        SELECT MAX(id) FROM messages
        WHERE sender_id = ? OR receiver_id = ?
        GROUP BY deal_id
      )
      ORDER BY m.created_at DESC
    `).all(req.user.id, req.user.id, req.user.id, req.user.id, req.user.id);
    res.json(chats);
  } catch(err) {
    res.json([]);
  }
});

// ===================== ADVISOR REQUESTS =====================
app.get('/api/advisor/requests', authMiddleware, roleMiddleware('advisor', 'admin'), (req, res) => {
  try {
    const requests = db.prepare(`
      SELECT di.*, d.deal_name, d.industry, d.valuation, d.status as deal_status,
        buyer.full_name as buyer_name, buyer.email as buyer_email,
        seller.full_name as seller_name
      FROM deal_interests di
      JOIN deals d ON di.deal_id = d.id
      JOIN users buyer ON di.user_id = buyer.id
      JOIN users seller ON d.user_id = seller.id
      WHERE di.type IN ('offer','nda_request','contact_request')
      ORDER BY di.created_at DESC
      LIMIT 50
    `).all();
    res.json(requests);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== PROFILE UPDATE =====================
app.patch('/api/auth/profile', authMiddleware, (req, res) => {
  const { full_name, country, phone } = req.body;
  db.prepare('UPDATE users SET full_name = COALESCE(?, full_name), country = COALESCE(?, country), phone = COALESCE(?, phone) WHERE id = ?')
    .run(full_name || null, country || null, phone || null, req.user.id);
  const user = db.prepare('SELECT id, email, full_name, role, country, phone, kyc_status FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

// ===================== SERVE FRONTEND =====================
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 M&A Platform đang chạy tại http://localhost:${PORT}`);
});
