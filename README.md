# 🍜 Quán Ăn Fusion – Đặt Món Online

<div align="center">


**Website đặt món ăn trực tuyến hiện đại | Modern Food Ordering Web App**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/datcc8a-max/Nhom-4-Quan-an-Fusion)

</div>

---

## 📖 Giới Thiệu

**Quán Ăn Fusion** là website đặt món ăn trực tuyến được xây dựng hoàn toàn bằng **HTML/CSS/JavaScript thuần** (Vanilla) — không cần backend, không cần cài đặt, chạy trực tiếp trên trình duyệt.

Dự án mô phỏng đầy đủ quy trình đặt món của một nhà hàng thực tế: từ xem thực đơn, thêm vào giỏ hàng, thanh toán, theo dõi đơn hàng cho đến trang quản trị admin.

> 📌 **Đây là đồ án môn học** — Nhóm 4, được phát triển bởi 3 thành viên làm việc song song trên cùng một codebase mà không bị conflict.

---

## ✨ Tính Năng Chính

### 👤 Dành cho Khách hàng
| Tính năng | Mô tả |
|-----------|-------|
| 🍽️ **Thực đơn đa dạng** | Hiển thị 20+ món ăn chia theo danh mục (Phở & Bún, Cơm, Bánh, Đồ uống, Tráng miệng, Combo) |
| 🔍 **Tìm kiếm thông minh** | Tìm kiếm tiếng Việt có dấu hoặc không dấu, lọc theo danh mục, sắp xếp theo giá/đánh giá |
| ❤️ **Yêu thích** | Lưu danh sách món yêu thích, hiển thị nhanh |
| 🛒 **Giỏ hàng** | Thêm/xóa/thay đổi số lượng, chọn size, thêm topping, dropdown nhanh |
| 🏷️ **Mã khuyến mãi** | Nhập mã giảm giá, freeship, xem danh sách mã khả dụng |
| 💳 **Thanh toán đa dạng** | COD, MoMo, ZaloPay, VNPay, Visa/Mastercard, Chuyển khoản MB Bank |
| 📱 **QR Thanh toán** | Tự động tạo mã QR, đồng hồ đếm ngược 15 phút chờ thanh toán |
| 📦 **Quản lý đơn hàng** | Xem lịch sử đơn, lọc theo trạng thái, hủy đơn, đặt lại, đánh giá |
| ⭐ **Đánh giá món** | Chấm sao và nhận xét từng món trong đơn hàng đã hoàn thành |
| 👨‍💼 **Hồ sơ cá nhân** | Cập nhật thông tin, đổi mật khẩu, quản lý địa chỉ, xem điểm tích lũy |
| 💬 **Chat hỗ trợ** | Widget chat bot trả lời tự động các câu hỏi thường gặp |

### 🔐 Xác Thực
| Tính năng | Mô tả |
|-----------|-------|
| 📧 **Đăng nhập / Đăng ký** | Form đầy đủ validation, lưu trữ localStorage |
| 🔑 **Quên mật khẩu** | Đặt lại mật khẩu qua email |
| 🌐 **Đăng nhập Google** | Mô phỏng OAuth Google với popup đẹp |
| 📘 **Đăng nhập Facebook** | Mô phỏng OAuth Facebook với popup đẹp |

### 🛡️ Dành cho Admin (Tài khoản: `admin` / `admin123`)
| Tính năng | Mô tả |
|-----------|-------|
| 📊 **Dashboard** | Thống kê tổng quan: doanh thu, đơn hàng, top món bán chạy |
| 📋 **Quản lý đơn hàng** | Xem, lọc, cập nhật trạng thái, phân shipper, xuất CSV |
| 🍽️ **Quản lý thực đơn** | Thêm/sửa/xóa món ăn, upload ảnh |
| 🏷️ **Quản lý khuyến mãi** | Tạo, bật/tắt, xóa mã giảm giá |
| 📈 **Báo cáo doanh thu** | Thống kê theo trạng thái, top sản phẩm bán chạy |

---

## 🖥️ Giao Diện

| Trang | Mô tả |
|-------|-------|
| **Trang chủ** | Hero banner, gợi ý món, thực đơn đầy đủ, tìm kiếm & lọc |
| **Chi tiết món** | Ảnh, mô tả, chọn size, topping, số lượng, thêm vào giỏ |
| **Thanh toán** | Form địa chỉ, chọn phương thức, tóm tắt đơn hàng |
| **Đơn hàng** | Timeline trạng thái, danh sách đơn hàng, lịch sử |
| **Hồ sơ** | Thông tin cá nhân, điểm thưởng, địa chỉ, thông báo |
| **Admin Panel** | Dashboard, quản lý orders/items/promos/reports |
| **Trang đăng nhập** | Trang riêng đẹp với social login |

---

## 🗂️ Cấu Trúc Thư Mục

```
Quán Ăn Fusion/
│
├── 📄 index.html                    ← Trang chính duy nhất
│
├── 📁 src/partials/                 ← Các trang HTML riêng
│   ├── auth.html                    ← Trang đăng nhập / đăng ký
│   ├── mock-google.html             ← Popup giả lập Google OAuth
│   └── mock-facebook.html           ← Popup giả lập Facebook OAuth
│
├── 📁 css/
│   ├── base/                        ← reset, variables, typography, animations
│   ├── layout/                      ← header, navbar, footer, grid
│   ├── components/                  ← buttons, modal, cart, hero, product-card...
│   ├── pages/                       ← auth, home, profile, checkout...
│   └── responsive/                  ← mobile, tablet, desktop
│
├── 📁 js/
│   ├── core/                        ← 🔧 Nền tảng (load trước)
│   │   ├── config.js                ← Cấu hình & mã khuyến mãi
│   │   ├── data.js                  ← Dữ liệu mock thực đơn
│   │   ├── storage.js               ← Wrapper localStorage
│   │   ├── state.js                 ← Biến toàn cục (cart, orders, user)
│   │   ├── utils.js                 ← Hàm dùng chung (fmt, normalizeText...)
│   │   ├── app-fixes.js             ← Patch lỗi & fallback
│   │   └── init.js                  ← Khởi tạo app
│   │
│   ├── features/                    ← 🍽️ Tính năng người dùng
│   │   ├── menu.js                  ← Hiển thị, tìm kiếm, lọc thực đơn
│   │   ├── cart.js                  ← Giỏ hàng & mã giảm giá
│   │   ├── checkout.js              ← Thanh toán & đặt hàng
│   │   ├── orders.js                ← Quản lý đơn hàng & đánh giá
│   │   └── profile.js               ← Trang hồ sơ cá nhân
│   │
│   ├── admin/                       ← 🛡️ Quản trị
│   │   ├── admin-core.js            ← Đăng nhập & dashboard
│   │   ├── admin-orders.js          ← Quản lý đơn hàng
│   │   ├── admin-items.js           ← Quản lý sản phẩm
│   │   ├── admin-promos.js          ← Quản lý khuyến mãi
│   │   └── admin-reports.js         ← Báo cáo & thống kê
│   │
│   └── auth/                        ← 🔐 Xác thực
│       ├── auth.js                  ← Logic auth chính
│       ├── login.js                 ← Đăng nhập
│       ├── register.js              ← Đăng ký
│       ├── forgot-password.js       ← Quên mật khẩu
│       ├── social-login.js          ← Google / Facebook OAuth
│       └── auth-bridge.js           ← Cầu nối auth
│
└── 📁 images/                       ← Logo, ảnh món ăn, icons thanh toán
```

---

## 🚀 Hướng Dẫn Chạy

### Cách 1: Chạy trực tiếp (đơn giản nhất)
```
1. Clone hoặc tải repo về máy
2. Mở thư mục dự án
3. Double-click vào file index.html
4. Trang web chạy ngay trên trình duyệt!
```

### Cách 2: Chạy qua Local Server (khuyến nghị)
```bash
# Dùng Python
cd "Quán Ăn Fusion"
python -m http.server 8787

# Mở trình duyệt → http://localhost:8787
```

> ⚠️ Một số tính năng (popup OAuth) cần chạy qua server. Khuyến nghị dùng **Cách 2**.

---

## 👥 Thành Viên Nhóm 4

| Thành viên | Vai trò | Nhánh GitHub | Phụ trách |
|------------|---------|--------------|-----------|
| **Trần Văn Đạt** | Trưởng nhóm | `dev-dat` | Kiến trúc hệ thống, core JS, dữ liệu, index.html |
| **Nguyễn Tiến Huy** | Thành viên | `dev-huy` | Auth, profile người dùng, admin panel |
| **Phan Đức Thượng** | Thành viên | `dev-thuong` | Menu, giỏ hàng, thanh toán, đơn hàng, CSS responsive |

---

## 🧪 Tài Khoản Test

| Loại | Tài khoản | Mật khẩu |
|------|-----------|----------|
| **Demo User** | `demo@phogiadinh.vn` | `12345678` |
| **Admin** | `admin` | `admin123` |
| **Google/Facebook** | Dùng nút đăng nhập xã hội, nhập email bất kỳ | — |

### Mã Khuyến Mãi Test
| Mã | Giảm giá |
|----|---------|
| `WELCOME10` | Giảm 10% |
| `SUMMER20` | Giảm 20% |
| `FREESHIP` | Miễn phí giao hàng |

---

## 🛠️ Công Nghệ Sử Dụng

- **HTML5** — Cấu trúc trang, semantic elements
- **CSS3** — Flexbox, Grid, CSS Variables, Animations, Responsive
- **JavaScript ES6+** — Modules, Arrow functions, Destructuring, Template literals
- **LocalStorage** — Lưu trữ dữ liệu người dùng, giỏ hàng, đơn hàng
- **QR Server API** — Tạo mã QR thanh toán động

