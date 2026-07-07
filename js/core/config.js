// ── CONFIG - Cấu hình ứng dụng ──
window.APP_CONFIG = {
  name: 'Quán ăn Fusion',
  version: '1.0.0',
  currency: 'đ',
  locale: 'vi-VN',
  shipping: {
    fee: 15000,
    freeThreshold: 150000,
  },
  delivery: {
    minMinutes: 30,
    maxMinutes: 45,
  },
  admin: {
    username: 'admin',
    password: 'admin123',
  },
  loyalty: {
    pointsPerOrder: 10,
    pointValue: 1000, // 1 điểm = 1,000đ
  },
};
