Tài liệu Mô tả Chức năng - M&A Platform
Nền tảng M&A (Mua bán & Sáp nhập Doanh nghiệp) là một hệ thống kết nối giữa Bên bán (Seller), Nhà đầu tư/Bên mua (Buyer), Cố vấn (Advisor) và Quản trị viên (Admin).

Dưới đây là mô tả chi tiết các chức năng của hệ thống dựa trên thiết kế API và cơ sở dữ liệu:

1. Quản lý Tài khoản & Phân quyền (Authentication)
- Hệ thống sử dụng JWT (JSON Web Token) để xác thực. Các vai trò (Role) trong hệ thống bao gồm: buyer, seller, advisor, admin.

- Đăng ký tài khoản: Người dùng cung cấp thông tin: Email, Mật khẩu, Họ tên, Vai trò, Quốc gia và Số điện thoại.

- Đăng nhập: Xác thực an toàn bằng Email và Mật khẩu.

- Xem thông tin cá nhân: Hiển thị hồ sơ của tài khoản đang đăng nhập, bao gồm cả trạng thái xác minh danh tính (KYC).

- Cập nhật hồ sơ: Cho phép thay đổi Họ tên, Quốc gia và Số điện thoại.

2. Dành cho Bên Bán Doanh nghiệp (Seller)
Bên bán có thể tạo hồ sơ doanh nghiệp và đăng tải các thương vụ (Deal) để tìm kiếm nhà đầu tư.

2.1. Quản lý Hồ sơ Doanh nghiệp (Company Profile)
- Tạo hồ sơ pháp nhân: Cung cấp thông tin chi tiết về doanh nghiệp:

- Thông tin cơ bản: Tên pháp nhân, Mã số thuế, Quốc gia, Năm thành lập.

- Hoạt động kinh doanh: Ngành nghề, Sản phẩm, Thị trường mục tiêu.

- Cơ cấu sở hữu: Tỷ lệ cổ phần của Founder, Nhà đầu tư, ESOP.

- Tổng quan: Mô tả chi tiết về doanh nghiệp.

- Quản lý danh sách: Xem và quản lý các hồ sơ pháp nhân đã tạo.

- Xem chi tiết: Truy xuất thông tin cụ thể của từng doanh nghiệp.

2.2. Quản lý Thương vụ (Deal Management)
- Đăng tải Deal mới: Tạo thương vụ gắn liền với một doanh nghiệp đã có.

- Loại thương vụ: Bán 100% công ty, Bán cổ phần, Gọi vốn.

- Chỉ số tài chính: Doanh thu 3 năm gần nhất, EBITDA, Lợi nhuận ròng, Tốc độ tăng trưởng.

- Thông tin định giá: Mức định giá, Tỷ lệ cổ phần chào bán.

- Hồ sơ đính kèm: Upload Pitch deck, Báo cáo tài chính, Tài liệu pháp lý.

- Lưu ý: Deal sau khi tạo sẽ ở trạng thái submitted (Chờ duyệt) và hệ thống sẽ tự động gửi thông báo cho Admin.

- Quản lý Deal của tôi: Theo dõi toàn bộ các thương vụ đã đăng (ở mọi trạng thái).

- Cập nhật trạng thái: Chủ động thay đổi trạng thái Deal của mình: Công khai lên sàn (published), Tạm ẩn (approved), hoặc Đóng deal (closed).

3. Dành cho Nhà đầu tư / Bên mua (Buyer)
Nhà đầu tư có thể tìm kiếm, theo dõi và tương tác với các thương vụ tiềm năng.

3.1. Khám phá & Tìm kiếm Thương vụ
- Sàn giao dịch (Marketplace): Hiển thị danh sách các Deal đang ở trạng thái công khai (published).

- Bộ lọc nâng cao: Hỗ trợ tìm kiếm theo:

- Ngành nghề | Loại hình giao dịch | Khu vực/Quốc gia.

- Khoảng định giá (Min/Max).

- Quy mô (Nhỏ, Vừa, Lớn, Mega).

- Tìm kiếm từ khóa (Tên deal, mô tả).

- Phân trang: Hiển thị danh sách với số lượng giới hạn mỗi trang để tối ưu trải nghiệm.

- Xem chi tiết Deal: Xem toàn bộ thông tin tài chính, mô tả công ty (Hành động này sẽ tự động tăng lượt xem views_count của deal).

3.2. Tương tác với Thương vụ
- Lưu thương vụ (Bookmark): Đánh dấu các Deal quan tâm để theo dõi và xem lại sau (/api/bookmarks).

- Bày tỏ sự quan tâm (Interest/Offer):

- Gửi yêu cầu Ký NDA (Bảo mật thông tin).

- Gửi yêu cầu Liên hệ trực tiếp.

- Gửi Offer (Báo giá/Đề nghị đầu tư kèm số tiền đề xuất).

- Hệ thống sẽ ghi nhận và gửi thông báo trực tiếp cho Seller.

- Quản lý Offer của tôi: Theo dõi các yêu cầu NDA, Contact, Offer đã gửi đi (/api/my-offers).

4. Hệ thống Nhắn tin & Giao tiếp (Messaging)
- Hỗ trợ Bên Mua và Bên Bán trao đổi trực tiếp trong khuôn khổ một thương vụ.

- Gửi tin nhắn trực tiếp: Nhắn tin trao đổi về một Deal cụ thể (người nhận sẽ có thông báo).

- Xem lịch sử trò chuyện: Tải toàn bộ nội dung tin nhắn giữa hai bên trong một Deal.

- Hộp thư (My Chats): Hiển thị danh sách các cuộc trò chuyện gần nhất của người dùng.

5. Dành cho Cố vấn (Advisor)
Bảng điều khiển Cố vấn: Cố vấn (và Admin) có thể theo dõi tất cả các yêu cầu gửi đến các thương vụ (/api/advisor/requests), bao gồm các Offer, yêu cầu NDA, yêu cầu liên hệ từ Buyer gửi cho Seller, từ đó hỗ trợ và điều phối các bên.

6. Dành cho Quản trị viên (Admin)
Admin có toàn quyền kiểm soát hệ thống, phê duyệt nội dung và quản lý người dùng.

Bảng thống kê (Dashboard Stats): Tổng quan dữ liệu hệ thống (Tổng User, Deal, Deal chờ duyệt, Tổng giá trị định giá, Tổng lượt quan tâm) và hiển thị danh sách Deal/User mới nhất.

Quản lý Người dùng:

- Xem danh sách toàn bộ người dùng.

- Phê duyệt KYC: Cập nhật trạng thái xác minh danh tính (pending, verified, rejected).

- Xóa người dùng: Xóa tài khoản và tự động dọn dẹp mọi dữ liệu liên quan (Deal, Tin nhắn, Công ty, Thông báo...).

Quản lý Thương vụ:

- Xem tất cả các Deal (bao gồm bản nháp hoặc đang chờ duyệt).

- Duyệt/Thay đổi trạng thái Deal: Chuyển trạng thái deal (ví dụ: từ submitted sang approved hoặc published). Hành động này sẽ gửi thông báo cho Seller.

- Xóa Deal: Xóa bỏ hoàn toàn thương vụ cùng các dữ liệu liên quan (lượt quan tâm, tin nhắn).

7. Hệ thống Thông báo (Notifications)
- Giúp người dùng luôn cập nhật được các hoạt động quan trọng kịp thời.

- Thông báo Real-time (qua DB): Hệ thống tự động sinh thông báo khi:

- Có Deal mới chờ Admin duyệt.

- Admin duyệt/đổi trạng thái Deal của Seller.

- Có Buyer gửi yêu cầu NDA/Contact/Offer cho Seller.

- Có tin nhắn mới.

Quản lý thông báo: Xem danh sách thông báo và thao tác đánh dấu "Đã đọc tất cả".

- Tài liệu được trích xuất dựa trên logic của file server.js (Cơ sở dữ liệu SQLite: ma_platform.db).
