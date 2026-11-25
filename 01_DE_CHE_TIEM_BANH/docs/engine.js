// =====================================================================
// ĐẾ CHẾ TIỆM BÁNH — Bộ máy game (không phụ thuộc giao diện)
// - Mọi số là SỐ NGUYÊN (xu, cái, phần). Tỷ lệ dùng phần trăm nguyên.
// - Ngẫu nhiên theo HẠT GIỐNG lưu trong state → cùng hạt giống = cùng diễn biến.
// - Hàm công khai không sửa state đầu vào (trả về state mới).
// =====================================================================

// ---------------- Dữ liệu ----------------
export const NGUYEN_LIEU = {
  bot:     { ten: 'Bột mì',     icon: '🌾', gia: 2, han: 10 },
  duong:   { ten: 'Đường',      icon: '🍬', gia: 1, han: 15 },
  trung:   { ten: 'Trứng',      icon: '🥚', gia: 2, han: 5, tuoi: true },
  bo:      { ten: 'Bơ',         icon: '🧈', gia: 4, han: 7 },
  sua:     { ten: 'Sữa/kem',    icon: '🥛', gia: 3, han: 3, tuoi: true },
  traicay: { ten: 'Trái cây',   icon: '🍓', gia: 4, han: 2, tuoi: true },
  hat:     { ten: 'Hạt/socola', icon: '🌰', gia: 5, han: 15 },
};

// ct = công thức; cong = công làm; gia = giá gợi ý; han = số ngày bán được (kể cả ngày làm);
// nhay = độ nhạy giá (%); nhuCau = khách/ngày cho MỖI tiệm khi giá gợi ý; mo = cách mở khoá
export const BANH = {
  banhmi:   { ten: 'Bánh mì',        icon: '🍞', ct: { bot: 2, trung: 1 },                          cong: 1, gia: 12, han: 1,  nhay: 320, nhuCau: 12, mo: 'san' },
  cookies:  { ten: 'Cookies',        icon: '🍪', ct: { bot: 1, duong: 1, bo: 1, hat: 1 },           cong: 1, gia: 24, han: 5,  nhay: 240, nhuCau: 5,  mo: 'san' },
  bonglan:  { ten: 'Bông lan',       icon: '🍰', ct: { bot: 1, trung: 2, duong: 1, sua: 1 },        cong: 2, gia: 22, han: 2,  nhay: 240, nhuCau: 4,  mo: 'san', mayDanh: true },
  sukem:    { ten: 'Su kem',         icon: '🧁', ct: { bot: 1, trung: 2, sua: 2 },                   cong: 2, gia: 26, han: 1,  nhay: 240, nhuCau: 4,  mo: 'nghienCuu', phiNC: 150, mayDanh: true },
  tart:     { ten: 'Tart trái cây',  icon: '🥧', ct: { bot: 1, bo: 1, traicay: 2 },                 cong: 3, gia: 32, han: 1,  nhay: 220, nhuCau: 3,  mo: 'nghienCuu', phiNC: 200 },
  banhkem:  { ten: 'Bánh kem',       icon: '🎂', ct: { bot: 2, trung: 3, sua: 2, traicay: 1, duong: 1 }, cong: 5, gia: 55, han: 2, nhay: 180, nhuCau: 2, mo: 'nghienCuu', phiNC: 300, mayDanh: true },
  trungthu: { ten: 'Bánh Trung thu', icon: '🥮', ct: { bot: 2, duong: 1, hat: 2, trung: 1 },        cong: 3, gia: 40, han: 7,  nhay: 190,  nhuCau: 5,  mo: 'mua', mua: 3 },
  khucCay:  { ten: 'Bánh khúc cây',  icon: '🎄', ct: { bot: 1, trung: 2, sua: 1, hat: 1, duong: 1 }, cong: 3, gia: 38, han: 3, nhay: 200, nhuCau: 5, mo: 'mua', mua: 4 },
  quyTet:   { ten: 'Bánh quy Tết',   icon: '🧧', ct: { bot: 1, duong: 1, bo: 1, hat: 1 },           cong: 2, gia: 30, han: 10, nhay: 190,  nhuCau: 6,  mo: 'mua', mua: 5 },
  // --- Món mới, chỉ có ở chế độ Doanh nhân (dn) ---
  croissant:{ ten: 'Croissant bơ',   icon: '🥐', ct: { bot: 1, bo: 2 },                             cong: 2, gia: 28, han: 1,  nhay: 220, nhuCau: 3, mo: 'nghienCuu', phiNC: 180, dn: true },
  banhbao:  { ten: 'Bánh bao',       icon: '🥟', ct: { bot: 2, trung: 1, sua: 1 },                  cong: 2, gia: 20, han: 1,  nhay: 280, nhuCau: 4, mo: 'nghienCuu', phiNC: 120, dn: true },
  pizza:    { ten: 'Pizza mini',     icon: '🍕', ct: { bot: 2, sua: 1, traicay: 1 },                cong: 2, gia: 22, han: 1,  nhay: 260, nhuCau: 3, mo: 'nghienCuu', phiNC: 150, dn: true },
  flan:     { ten: 'Bánh flan',      icon: '🍮', ct: { trung: 2, sua: 2, duong: 1 },                cong: 1, gia: 18, han: 2,  nhay: 280, nhuCau: 4, mo: 'nghienCuu', phiNC: 100, dn: true },
  macaron:  { ten: 'Macaron',        icon: '🌈', ct: { hat: 1, duong: 2, trung: 1 },                cong: 4, gia: 45, han: 3,  nhay: 160, nhuCau: 2, mo: 'nghienCuu', phiNC: 350, dn: true, canThoCa: true },
};
export const BANH_NC = ['sukem', 'tart', 'banhkem'];                       // nghiên cứu được ở cả 2 chế độ
export const BANH_DN = ['croissant', 'banhbao', 'pizza', 'flan', 'macaron']; // chỉ Doanh nhân

export const MUA = [
  { so: 1, ten: 'Khai trương', ngay: 15, nghienCuu: false, chiNhanh: false, vayToiDa: 300,  daoDong: 15, thoiTiet: [60, 25, 15, 0],  hanTuoiGiam: 0, quangCao: 100, donDat: false, banhSan: ['banhmi', 'cookies', 'bonglan'] },
  { so: 2, ten: 'Mùa mưa',     ngay: 20, nghienCuu: true,  chiNhanh: false, vayToiDa: 800,  daoDong: 20, thoiTiet: [25, 30, 30, 15], hanTuoiGiam: 1, quangCao: 100, donDat: true },
  { so: 3, ten: 'Trung thu',   ngay: 20, nghienCuu: true,  chiNhanh: true,  vayToiDa: 1200, daoDong: 20, thoiTiet: [45, 30, 20, 5],  hanTuoiGiam: 0, quangCao: 100, donDat: true, banhMua: 'trungthu' },
  { so: 4, ten: 'Giáng sinh',  ngay: 20, nghienCuu: true,  chiNhanh: true,  vayToiDa: 1500, daoDong: 20, thoiTiet: [35, 45, 15, 5],  hanTuoiGiam: 0, quangCao: 150, donDat: true, banhMua: 'khucCay' },
  { so: 5, ten: 'Tết',         ngay: 25, nghienCuu: true,  chiNhanh: true,  vayToiDa: 2000, daoDong: 30, thoiTiet: [40, 35, 20, 5],  hanTuoiGiam: 0, quangCao: 120, donDat: true, banhMua: 'quyTet' },
];

export const THOI_TIET = [
  { ten: 'Nắng đẹp', icon: '☀️', khach: 105 },
  { ten: 'Âm u',     icon: '☁️', khach: 100 },
  { ten: 'Mưa',      icon: '🌧️', khach: 80 },
  { ten: 'Bão',      icon: '⛈️', khach: 60 },
];

export const LUAT = {
  tienDau: 1000, thoDau: 3, uyTinDau: 300, uyTinMax: 500,
  luongTho: 25, phiThue: 40, denBuSaThai: 75, congMoi: 6, congThao: 8, ngayThao: 5,
  thueNha: 30, thueChiNhanh: 50, giaChiNhanh: 1500, khachChiNhanh: 50,
  lo: [40, 70, 100], giaNangLo: [0, 400, 800], giaMayDanh: 300,
  laiVayPhanNghin: 10, vayCoBan: 500, ngayNghienCuu: 2,
  quangCaoMax: 60, quangCaoGiu: 60,
  // --- Doanh nhân ---
  // Thợ 3 cấp: 1 Học việc, 2 Lành nghề, 3 Thợ cả. tay = điểm tay nghề (chất lượng bánh)
  capTho: { 1: { ten: 'Học việc', phi: 20, luong: 15, cong: 5, tay: 1 }, 2: { ten: 'Lành nghề', phi: 40, luong: 25, cong: 8, tay: 2 }, 3: { ten: 'Thợ cả', phi: 100, luong: 45, cong: 9, tay: 3 } },
  ngayLenLanhNghe: 6, phiDaoTaoThoCa: 150, ngayDaoTao: 2, ngayDenBu: 3,
  quayMax: 3, phiQuay: 10, luongQuay: 15, phiDaoTaoQuay: 60,
  heSoMuaCongThuc: 150,                     // % so với giá nghiên cứu
};
export const laDN = (st) => st.cheDo === 'dn';

// ---------------- Doanh nhân: nhóm khách, khu, trải nghiệm ----------------
// thich: % ưa thích theo món (mặc định 100) · nhay: % độ nhạy giá · tn: trọng số điểm chạm (tổng 100)
export const NHOM_KHACH = {
  hs: { ten: 'Học sinh', icon: '🎒', nhay: 140, tn: { mat: 50, tai: 15, mui: 15, kg: 20 },
    thich: { pizza: 180, flan: 150, cookies: 140, banhmi: 120, banhbao: 110, sukem: 100, bonglan: 90, croissant: 70, tart: 70, banhkem: 60, macaron: 40 } },
  vp: { ten: 'Dân văn phòng', icon: '💼', nhay: 100, tn: { mat: 15, tai: 45, mui: 20, kg: 20 },
    thich: { banhbao: 170, croissant: 160, banhmi: 150, cookies: 90, pizza: 80, sukem: 90, flan: 70, bonglan: 80, tart: 80, banhkem: 50, macaron: 70 } },
  gd: { ten: 'Gia đình', icon: '👨‍👩‍👧', nhay: 100, tn: { mat: 20, tai: 20, mui: 15, kg: 45 },
    thich: { banhkem: 170, bonglan: 150, flan: 140, sukem: 120, banhmi: 90, cookies: 100, pizza: 100, tart: 100, croissant: 90, banhbao: 90, macaron: 70 } },
  dl: { ten: 'Khách du lịch', icon: '📸', nhay: 60, tn: { mat: 45, tai: 10, mui: 35, kg: 10 },
    thich: { macaron: 200, tart: 170, croissant: 150, sukem: 130, cookies: 120, banhkem: 100, bonglan: 90, flan: 80, pizza: 80, banhmi: 60, banhbao: 60 } },
};
// quyMo: % lượng khách so với khu chuẩn · tyLe: % từng nhóm khách
export const KHU = {
  truong:   { ten: 'Cổng trường', icon: '🏫', quyMo: 100, thue: 25, giaMatBang: 900,  tyLe: { hs: 60, vp: 10, gd: 25, dl: 5 } },
  vanPhong: { ten: 'Văn phòng',   icon: '🏢', quyMo: 100, thue: 35, giaMatBang: 1200, tyLe: { hs: 10, vp: 60, gd: 15, dl: 15 } },
  danCu:    { ten: 'Dân cư',      icon: '🏘️', quyMo: 100, thue: 30, giaMatBang: 1000, tyLe: { hs: 20, vp: 15, gd: 60, dl: 5 } },
  duLich:   { ten: 'Phố du lịch', icon: '🏖️', quyMo: 90,  thue: 50, giaMatBang: 1800, tyLe: { hs: 10, vp: 15, gd: 20, dl: 55 } },
};
export const DIEM_CHAM = { mat: '👀 Mắt', tai: '👂 Tai', mui: '👃 Mũi', kg: '🌿 Không gian', mieng: '👅 Miệng' };
// Đầu tư trải nghiệm (mua 1 lần, giữ cả mùa)
export const DAU_TU_TN = {
  tuKinh: { ten: 'Tủ kính sáng', icon: '🪟', gia: 150, diem: 'mat' },
  ke:     { ten: 'Kệ trưng bày đẹp', icon: '🗄️', gia: 250, diem: 'mat' },
  loa:    { ten: 'Loa nhạc nhẹ', icon: '🎵', gia: 40, diem: 'tai' },
  loQuay: { ten: 'Lò nướng ngay quầy', icon: '🔥', gia: 200, diem: 'mui' },
  quat:   { ten: 'Quạt / máy lạnh', icon: '❄️', gia: 150, diem: 'kg' },
  banGhe: { ten: 'Bàn ghế ngồi ăn', icon: '🪑', gia: 200, diem: 'kg' },
};
Object.assign(LUAT, { phiKhaoSat: 30, phiDonDep: 10, sachMax: 20, sachGiam: 5, khuMacDinh: 'danCu' });
// GĐ1d: vốn, chiến thuật ngày, chuỗi, đầu tư (phần nghìn/ngày cho lãi)
Object.assign(LUAT, {
  vayNongMax: 300, laiNong: 30, hanNong: 5,
  laiTheChap: 5, hanTheChap: 8, tyLeTheChap: 70, giaHanNgay: 4, phiGiaHan: 2,
  laiVayChong: 10, soKhoanChong: 3,
  goiVonMin: 500, goiVonMax: 1500, goiVonTuMua: 4, chiaLoiNhuan: 30,
  gioVang: [20, 40, 50], gioVangThoiQuen: 3, gioVangMatKhach: 15,
  phiChienDich: 150, ngayChienDich: 3, chienDichMax: 30, tnChuan: 12,
  anThu: [5, 10, 20], ngayAnThu: 3,
  cuaHangMax: 4, cocThue: 300, phiCuaHang: 40,      // phiCuaHang: điện nước, người trông mỗi cửa hàng phụ/ngày
  laiTietKiem: 3, giaXe: 400, xangXe: 10, giaTraiGa: 600, giamTrung: 25, coTuc: 10,
});
export const TAI_SAN_GIA = { xe: 200, traiGa: 480 };   // giá trị còn lại tính vào tài sản
// % ưa thích món b ở khu k (trung bình theo tỷ lệ nhóm khách)
export const hopKhu = (k, b) => Math.floor(Object.entries(KHU[k].tyLe).reduce((s, [g, t]) => s + t * (NHOM_KHACH[g].thich[b] ?? 100), 0) / 100);
export const nhayKhu = (k) => Math.floor(Object.entries(KHU[k].tyLe).reduce((s, [g, t]) => s + t * NHOM_KHACH[g].nhay, 0) / 100);
export const trongSoKhu = (k) => Object.fromEntries(['mat', 'tai', 'mui', 'kg'].map((d) => [d, Math.floor(Object.entries(KHU[k].tyLe).reduce((s, [g, t]) => s + t * NHOM_KHACH[g].tn[d], 0) / 100)]));
const kep = (v, a, b) => Math.max(a, Math.min(b, v));
// Điểm 5 điểm chạm, thang 0–50 (= 0–5 sao × 10). homNay = việc làm trong kế hoạch hôm nay.
export function diemTraiNghiem(st, p, homNay = p.viecHomNay || {}) {
  const tn = p.tn || {};
  const biCu = Object.entries(p.hang).some(([b, lots]) => lots.some((l) => l.q > 0 && l.exp >= st.ngay && l.exp - BANH[b].han + 1 < st.ngay));
  const depMon = ['macaron', 'banhkem', 'tart'].some((b) => (p.hang[b] || []).some((l) => l.q > 0 && l.exp >= st.ngay));
  const nong = st.suKien?.id === 'nangNong' && !tn.quat;
  const cl = chatLuong(p);
  return {
    mat: kep(10 + (tn.tuKinh ? 10 : 0) + (tn.ke ? 10 : 0) + (homNay.baoBi ? 10 : 0) + (depMon ? 10 : 0) - (biCu ? 10 : 0), 0, 50),
    tai: kep(10 + 8 * Math.min(p.quay || 0, 2) + 6 * Math.min(p.lePhep || 0, 2) + (tn.loa ? 10 : 0), 0, 50),
    mui: kep(10 + (tn.loQuay ? 20 : 0) + (homNay.lamTuoi ? 20 : 0) - (biCu ? 10 : 0), 0, 50),
    kg: kep(10 + (p.sach ?? 0) + (tn.quat ? 10 : 0) + (tn.banGhe ? 10 : 0) - (nong ? 10 : 0), 0, 50),
    mieng: kep(10 + (cl - 10) * 2 - (biCu ? 10 : 0), 0, 50),
  };
}
// % sức hút do trải nghiệm (Mắt, Tai, Mũi, Không gian) theo khách của khu: 40% … 190% (cân bằng GĐ2: ×3 mỗi điểm lệch chuẩn)
export function hutTraiNghiem(k, d) {
  const w = trongSoKhu(k);
  const tb = Math.floor(Object.entries(w).reduce((s, [t, x]) => s + x * (d[t] - LUAT.tnChuan), 0) / 100);
  return Math.max(40, 100 + 3 * tb);
}
// Khách của 1 loại bánh trong 1 khu: (0,5 + 0,75 × số tiệm) × khách chuẩn × quy mô khu × độ hợp món × mùa/sự kiện
// → mỗi tiệm được 125% khách khi một mình, 100% khi 2 tiệm, ~92% khi 3 tiệm, ~88% khi 4 tiệm (khu đông thì phải chia)
export function nhuCauKhu(st, k, b, soTiem) {
  return Math.floor((BANH[b].nhuCau * (2 + 3 * soTiem) * KHU[k].quyMo * hopKhu(k, b) * heSoKhachMua(st, b)) / (4 * 100 * 100 * 100));
}
// Phân tích thị trường (miễn phí)
export function phanTichThiTruong(st) {
  const song = st.nguoi.filter((p) => !p.pha);
  return Object.entries(KHU).map(([k, z]) => ({
    khu: k, ten: z.ten, icon: z.icon, quyMo: z.quyMo, thue: z.thue, tyLe: z.tyLe, nhay: nhayKhu(k),
    soTiem: song.filter((p) => p.khu === k).length,
    monHop: banhDangCo(st).map((b) => [b, hopKhu(k, b)]).sort((a, c) => c[1] - a[1]).slice(0, 4),
    coiTrong: Object.entries(trongSoKhu(k)).sort((a, c) => c[1] - a[1])[0][0],
  }));
}
// Khảo sát khách (trả 30 xu): số liệu hôm qua của khu
export function khaoSatKhu(st, k) {
  const bc = st.baoCao[st.baoCao.length - 1];
  const ds = st.nguoi.filter((p) => !p.pha && p.khu === k);
  const ban = {}; let thieu = 0;
  if (bc) for (const p of ds) { const r = bc.nguoi[p.id]; if (!r) continue; thieu += r.thieuKhach; for (const [b, q] of Object.entries(r.ban)) ban[b] = (ban[b] || 0) + q; }
  const giaTB = {};
  for (const b of banhDangCo(st)) { const g = ds.filter((p) => daMoKhoa(st, p, b)).map((p) => p.giaBan[b] ?? BANH[b].gia); if (g.length) giaTB[b] = Math.round(g.reduce((a, x) => a + x, 0) / g.length); }
  const banChay = Object.entries(ban).sort((a, c) => c[1] - a[1]).slice(0, 3);
  return { khu: k, banChay, giaTB, khachThieu: thieu, soTiem: ds.length };
}

// Thẻ sự kiện: w = trọng số rút. hieuLuc = số ngày (giá nguyên liệu).
export const SU_KIEN = [
  { id: 'thuong',   ten: 'Ngày bình thường',        icon: '🙂', w: 30, moTa: 'Phố xá bình thường.' },
  { id: 'chotuan',  ten: 'Chợ cuối tuần',           icon: '🛍️', w: 6, khach: { _: 130 }, moTa: 'Khách đông hơn 30%.' },
  { id: 'leHoi',    ten: 'Lễ hội phố',              icon: '🏮', w: 4, khach: { _: 150 }, moTa: 'Cả phố đông gấp rưỡi.' },
  { id: 'hocSinh',  ten: 'Học sinh tan trường sớm', icon: '🎒', w: 5, khach: { banhmi: 150, cookies: 140 }, moTa: 'Bánh mì, cookies bán chạy.' },
  { id: 'sinhNhat', ten: 'Mùa sinh nhật',           icon: '🎉', w: 4, khach: { banhkem: 200, bonglan: 130 }, moTa: 'Bánh kem gấp đôi khách.' },
  { id: 'anKieng',  ten: 'Trào lưu ăn kiêng',       icon: '🥗', w: 3, khach: { _: 85, banhkem: 70 }, moTa: 'Khách ngại đồ ngọt.' },
  { id: 'sangSom',  ten: 'Công nhân tăng ca',       icon: '👷', w: 4, khach: { banhmi: 170 }, moTa: 'Bánh mì bán rất chạy.' },
  { id: 'duLich',   ten: 'Đoàn du lịch ghé phố',    icon: '🚌', w: 3, khach: { tart: 180, sukem: 150, cookies: 130 }, moTa: 'Khách thích bánh đẹp.' },
  { id: 'boKhan',   ten: 'Bơ khan hiếm',            icon: '🧈', w: 3, giaNL: { bo: 200 }, hieuLuc: 3, moTa: 'Giá bơ gấp đôi 3 ngày.' },
  { id: 'trungTang',ten: 'Trứng tăng giá',          icon: '🥚', w: 3, giaNL: { trung: 140 }, hieuLuc: 2, moTa: 'Trứng +40% trong 2 ngày.' },
  { id: 'botRe',    ten: 'Bột mì giảm giá',         icon: '🌾', w: 3, giaNL: { bot: 60 }, hieuLuc: 2, moTa: 'Bột mì rẻ 40% trong 2 ngày.' },
  { id: 'muaTraiCay',ten: 'Được mùa trái cây',      icon: '🍓', w: 3, giaNL: { traicay: 50 }, hieuLuc: 3, moTa: 'Trái cây rẻ một nửa 3 ngày.' },
  { id: 'suaHiem',  ten: 'Sữa về chậm',             icon: '🥛', w: 2, giaNL: { sua: 170 }, hieuLuc: 2, moTa: 'Sữa +70% trong 2 ngày.' },
  { id: 'hatRe',    ten: 'Hạt nhập về nhiều',       icon: '🌰', w: 2, giaNL: { hat: 70 }, hieuLuc: 3, moTa: 'Hạt/socola rẻ 30% 3 ngày.' },
  { id: 'phongBa',  ten: 'Nhà phê bình ẩm thực',    icon: '📝', w: 3, loai: 'phebinh', moTa: 'Tiệm uy tín cao nhất được thêm nửa sao.' },
  { id: 'hongMay',  ten: 'Lò của một tiệm trục trặc', icon: '🔧', w: 3, loai: 'hongLo', moTa: 'Một tiệm chỉ nướng được 70% hôm nay.' },
  { id: 'thoOm',    ten: 'Thợ bị cảm',              icon: '🤒', w: 3, loai: 'omTho', moTa: 'Một tiệm mất 8 công hôm nay.' },
  { id: 'tangThue', ten: 'Chủ nhà tăng tiền thuê',  icon: '🏠', w: 1, loai: 'tangThue', moTa: 'Tiền thuê mỗi tiệm +10 xu/ngày tới hết mùa.' },
  { id: 'tiec',     ten: 'Khách đặt tiệc',          icon: '📦', w: 4, loai: 'donDat', moTa: 'Ai nhận đơn phải giao đủ sau 2 ngày; thiếu bị phạt.' },
  { id: 'mangXaHoi',ten: 'Bài đăng nổi tiếng',      icon: '📱', w: 2, loai: 'noiTieng', moTa: 'Tiệm có quảng cáo hôm nay được thêm 50% sức hút.' },
  { id: 'kiemTra',  ten: 'Đoàn kiểm tra vệ sinh',   icon: '🧾', w: 2, loai: 'veSinh', moTa: 'Tiệm còn bánh quá cũ bị trừ uy tín.' },
  { id: 'cupDien',  ten: 'Cúp điện buổi chiều',     icon: '🔌', w: 2, khach: { _: 75 }, moTa: 'Bán được ít hơn 25%.' },
  { id: 'ngayLe',   ten: 'Ngày nghỉ lễ',            icon: '🎌', w: 3, khach: { _: 120, banhkem: 150 }, moTa: 'Khách đông, thích bánh kem.' },
  { id: 'tranhBanh',ten: 'Cuộc thi làm bánh của phố',icon: '🏆', w: 2, loai: 'cuocThi', moTa: 'Tiệm bán nhiều loại bánh nhất được +30 uy tín.' },
  { id: 'giaXang',  ten: 'Phí chở hàng tăng',       icon: '🚚', w: 2, giaNL: { _: 115 }, hieuLuc: 2, moTa: 'Mọi nguyên liệu +15% 2 ngày.' },
  { id: 'khuyenMai',ten: 'Siêu thị khuyến mãi bánh', icon: '🏬', w: 2, khach: { banhmi: 70, cookies: 75 }, moTa: 'Khách bánh mì, cookies giảm.' },
  { id: 'cafe',     ten: 'Quán cà phê mới mở',      icon: '☕', w: 2, khach: { cookies: 150, sukem: 140 }, moTa: 'Cookies, su kem bán chạy.' },
  { id: 'nangNong', ten: 'Nắng nóng',               icon: '🥵', w: 2, khach: { banhkem: 80, tart: 130 }, moTa: 'Khách thích tart trái cây mát.' },
  // --- chỉ có ở Doanh nhân ---
  { id: 'dichGa',   ten: 'Dịch cúm gà',             icon: '🐔', w: 2, dn: true, giaNL: { trung: 150 }, hieuLuc: 3, loai: 'dichGa', moTa: 'Trứng đắt thêm 50% trong 3 ngày; trại gà tạm ngừng chia cổ tức.' },
];

// ---------------- Ngẫu nhiên theo hạt giống ----------------
function rnd(st) {                 // mulberry32, trạng thái số nguyên trong st.rng
  let t = (st.rng = (st.rng + 0x6D2B79F5) | 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const randInt = (st, a, b) => a + Math.floor(rnd(st) * (b - a + 1));
function pickW(st, arr) {
  const tot = arr.reduce((s, x) => s + x.w, 0);
  let r = rnd(st) * tot;
  for (const x of arr) { r -= x.w; if (r < 0) return x; }
  return arr[arr.length - 1];
}
const clone = (o) => JSON.parse(JSON.stringify(o));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pct = (v, p) => Math.floor((v * p) / 100);

// ---------------- Tạo ván ----------------
export function taoVan({ seed = 1, mua = 1, nguoiChoi, cheDo = 'nm' }) {
  if (!Array.isArray(nguoiChoi) || nguoiChoi.length < 1 || nguoiChoi.length > 4) throw new Error('Cần 1–4 người chơi');
  const m = MUA[mua - 1]; if (!m) throw new Error('Mùa không hợp lệ');
  if (!['nm', 'dn'].includes(cheDo)) throw new Error('Chế độ không hợp lệ');
  for (const p of nguoiChoi) if (p.khu && !KHU[p.khu]) throw new Error('Khu không hợp lệ');
  const st = {
    phienBan: 1, cheDo, seed, rng: seed | 0, mua, ngay: 1, ketThuc: false,
    thueThem: 0, hieuUng: [], donDat: [], thiTruong: null, suKien: null, thoiTiet: 0, keHoach: {}, baoCao: [],
    nguoi: nguoiChoi.map((p, i) => ({
      id: i, ten: p.ten || `Tiệm ${i + 1}`, icon: p.icon || '🏠', may: p.may || null,
      tien: LUAT.tienDau, no: 0, uyTin: LUAT.uyTinDau, pha: false, amNgay: 0,
      tho: Array.from({ length: LUAT.thoDau }, () => (cheDo === 'dn' ? { cap: 2, ngay: LUAT.ngayThao } : { ngay: LUAT.ngayThao })),
      ...(cheDo === 'dn' ? { quay: 0, lePhep: 0, khu: p.khu || LUAT.khuMacDinh, tn: {}, sach: LUAT.sachMax,
        khoanVay: [], soKhoan: 1, gopVon: 0, tietKiem: 0, dauTu: {}, cuaHang: [], matBangChinh: false, laiDauTu: 0, gioVangLienTiep: 0 } : {}),
      lo: 1, mayDanh: false, chiNhanh: 0, moKhoa: [], nghienCuu: null,
      kho: {}, hang: {}, giaBan: {}, quangCao: 0,
      dem: { khongBo: 0, namSao: 0 }, huyHieu: [], homQua: null,
    })),
  };
  batDauNgay(st);
  return st;
}

export const banhDangCo = (st) => {
  const m = MUA[st.mua - 1];
  const ds = ['banhmi', 'cookies', 'bonglan'];
  if (m.nghienCuu || laDN(st)) ds.push(...BANH_NC);
  if (m.banhMua) ds.push(m.banhMua);
  if (laDN(st)) ds.push(...BANH_DN);
  return ds;
};
export const daMoKhoa = (st, p, b) => BANH[b].mo === 'san' || BANH[b].mo === 'mua' || p.moKhoa.includes(b);
export const hanNL = (st, nl) => NGUYEN_LIEU[nl].han - (NGUYEN_LIEU[nl].tuoi ? MUA[st.mua - 1].hanTuoiGiam : 0);
export const congBanh = (p, b) => (p.mayDanh && BANH[b].mayDanh ? Math.max(1, BANH[b].cong - 1) : BANH[b].cong);

// Buổi sáng: giá chợ, thời tiết, sự kiện (dùng chung cho mọi người)
function batDauNgay(st) {
  const m = MUA[st.mua - 1];
  st.hieuUng = st.hieuUng.filter((h) => h.den >= st.ngay);
  const tw = m.thoiTiet.map((w, i) => ({ w, i })).filter((x) => x.w > 0);
  st.thoiTiet = pickW(st, tw).i;
  let pool = SU_KIEN.filter((s) => (s.loai !== 'donDat' || m.donDat) && (!s.dn || laDN(st)));
  const sk = pickW(st, pool);
  st.suKien = { id: sk.id, may: null, don: null };
  if (sk.giaNL) st.hieuUng.push({ giaNL: sk.giaNL, den: st.ngay + sk.hieuLuc - 1 });
  const song = st.nguoi.filter((p) => !p.pha);
  if ((sk.loai === 'hongLo' || sk.loai === 'omTho') && song.length) st.suKien.may = song[randInt(st, 0, song.length - 1)].id;
  if (sk.loai === 'tangThue') st.thueThem += 10;
  if (sk.loai === 'dichGa') st.dichGaDen = st.ngay + sk.hieuLuc - 1;
  if (sk.loai === 'donDat') {
    const ds = banhDangCo(st).filter((b) => BANH[b].mo !== 'nghienCuu' || st.nguoi.some((p) => p.moKhoa.includes(b)));
    const b = ds[randInt(st, 0, ds.length - 1)];
    st.suKien.don = { banh: b, sl: randInt(st, 8, 16) + (BANH[b].cong >= 3 ? -4 : 0), han: st.ngay + 2, gia: pct(BANH[b].gia, 160) };
  }
  const gia = {};
  for (const nl of Object.keys(NGUYEN_LIEU)) {
    let g = NGUYEN_LIEU[nl].gia * 100;
    g = Math.round((g * (100 + randInt(st, -m.daoDong, m.daoDong))) / 100);
    for (const h of st.hieuUng) { const x = h.giaNL[nl] ?? h.giaNL._; if (x) g = Math.round((g * x) / 100); }
    gia[nl] = Math.max(1, Math.round(g / 100));
  }
  st.thiTruong = { gia };
  st.keHoach = {};
}

export function suKienHomNay(st) { return SU_KIEN.find((s) => s.id === st.suKien.id); }

// ---------------- Năng lực ----------------
export const thoDangLam = (p) => p.tho.filter((t) => !t.hoc);
export const coThoCa = (p) => p.tho.some((t) => t.cap === 3 && !t.hoc);
export const luongNgay = (st, p) => (laDN(st)
  ? p.tho.reduce((s, t) => s + LUAT.capTho[t.cap].luong, 0) + (p.quay || 0) * LUAT.luongQuay
  : p.tho.length * LUAT.luongTho);
// Chất lượng bánh (Doanh nhân): điểm tay nghề trung bình theo công × 10 → 10 (học việc) … 30 (thợ cả)
export function chatLuong(p) {
  const ds = thoDangLam(p); let tu = 0, mau = 0;
  for (const t of ds) { const c = LUAT.capTho[t.cap || 2]; tu += c.tay * c.cong; mau += c.cong; }
  return mau ? Math.round((tu * 10) / mau) : 0;
}
export function congTho(st, p) {
  let c = laDN(st)
    ? thoDangLam(p).reduce((s, t) => s + LUAT.capTho[t.cap].cong, 0)
    : p.tho.reduce((s, t) => s + (t.ngay >= LUAT.ngayThao ? LUAT.congThao : LUAT.congMoi), 0);
  if (st.suKien.id === 'thoOm' && st.suKien.may === p.id) c = Math.max(0, c - 8);
  return c;
}
export function sucLo(st, p) {
  let c = LUAT.lo[p.lo - 1];
  if (st.suKien.id === 'hongMay' && st.suKien.may === p.id) c = pct(c, 70);
  return c;
}
const soLuong = (lots) => (lots || []).reduce((s, l) => s + l.q, 0);
export const tonKho = (p, nl) => soLuong(p.kho[nl]);
export const tonHang = (p, b) => soLuong(p.hang[b]);

export function giaTriTieM(st, p, cuoiMua = false) {
  const tsLo = pct(LUAT.giaNangLo.slice(0, p.lo).reduce((s, x) => s + x, 0), 50);
  const tsMay = p.mayDanh ? pct(LUAT.giaMayDanh, 50) : 0;
  const tsCN = p.chiNhanh * pct(LUAT.giaChiNhanh, 60);
  const goc = p.tien + tsLo + tsMay + tsCN - p.no * (cuoiMua ? 2 : 1);
  if (!laDN(st)) return goc;
  // Doanh nhân: tài sản ròng = tiền + tiết kiệm + tài sản − mọi khoản nợ − phần của người góp vốn
  let tong = goc + p.tietKiem + (p.dauTu.xe ? TAI_SAN_GIA.xe : 0) + (p.dauTu.traiGa ? TAI_SAN_GIA.traiGa : 0)
    + (p.matBangChinh ? KHU[p.khu].giaMatBang : 0)
    + p.cuaHang.reduce((a, c) => a + (c.so === 'mua' ? KHU[c.khu].giaMatBang : LUAT.cocThue), 0)
    - p.khoanVay.reduce((a, k) => a + k.goc, 0) * (cuoiMua ? 2 : 1);
  if (p.gopVon) tong -= p.gopVon + Math.floor((Math.max(0, tong - LUAT.tienDau - p.gopVon) * LUAT.chiaLoiNhuan) / 100);
  return tong;
}
// Doanh nhân: tài sản đem thế chấp được
export function taiSanTheChap(st, p) {
  if (!laDN(st)) return [];
  const ds = [];
  if (p.lo > 1) ds.push({ ma: 'lo', ten: `Lò cấp ${p.lo}`, giaTri: pct(LUAT.giaNangLo.slice(0, p.lo).reduce((a, x) => a + x, 0), 50) });
  if (p.mayDanh) ds.push({ ma: 'mayDanh', ten: 'Máy đánh trứng', giaTri: pct(LUAT.giaMayDanh, 50) });
  if (p.dauTu.xe) ds.push({ ma: 'xe', ten: 'Xe giao hàng', giaTri: TAI_SAN_GIA.xe });
  if (p.matBangChinh) ds.push({ ma: 'mb:' + p.khu, ten: `Mặt bằng ${KHU[p.khu].ten}`, giaTri: KHU[p.khu].giaMatBang });
  for (const c of p.cuaHang) if (c.so === 'mua') ds.push({ ma: 'mb:' + c.khu, ten: `Mặt bằng ${KHU[c.khu].ten}`, giaTri: KHU[c.khu].giaMatBang });
  return ds.map((x) => ({ ...x, dangTheChap: p.khoanVay.some((k) => k.taiSan === x.ma) }));
}
export const giaMuaNL = (st, p, nl) => (laDN(st) && nl === 'trung' && p.dauTu?.traiGa ? Math.max(1, Math.floor((st.thiTruong.gia[nl] * (100 - LUAT.giamTrung)) / 100)) : st.thiTruong.gia[nl]);
export const soKhoanVay = (p) => (p.khoanVay?.length || 0) + (p.no > 0 ? 1 : 0);
export const soCuaHang = (p) => 1 + (p.cuaHang?.length || 0);
function matTaiSan(p, ma) {
  if (ma === 'lo') p.lo = 1;
  else if (ma === 'mayDanh') p.mayDanh = false;
  else if (ma === 'xe') p.dauTu.xe = false;
  else if (ma.startsWith('mb:')) {
    const k = ma.slice(3);
    if (k === p.khu && p.matBangChinh) p.matBangChinh = false;
    else { const c = p.cuaHang.find((x) => x.khu === k); if (c) c.so = 'thue'; }
  }
}
export const giaTriTiem = giaTriTieM;
export function hanMucVay(st, p) {
  const m = MUA[st.mua - 1];
  const tran = Math.min(m.vayToiDa, LUAT.vayCoBan + pct(Math.max(0, giaTriTieM(st, p)), 50));
  return Math.max(0, tran - p.no);
}

// ---------------- Lấy theo lô (FIFO theo hạn) ----------------
function layLo(lots, q) {
  lots.sort((a, b) => a.exp - b.exp);
  let con = q;
  for (const l of lots) { const x = Math.min(l.q, con); l.q -= x; con -= x; if (!con) break; }
  return lots.filter((l) => l.q > 0);
}
function themLo(obj, k, q, exp) { (obj[k] ||= []).push({ q, exp }); }

// ---------------- Kế hoạch ngày ----------------
// kh = { vay, tra, thue, saThai, mua:{nl:sl}, lam:{banh:sl}, gia:{banh:xu}, quangCao, nghienCuu, nangLo, mayDanh, chiNhanh, nhanDon }
export function kiemTraKeHoach(st, id, kh) {
  try { apKeHoach(clone(st), id, kh); return { ok: true, loi: [] }; }
  catch (e) { return { ok: false, loi: [e.message] }; }
}

function soNguyen(v, ten) {
  const x = v ?? 0;
  if (!Number.isSafeInteger(x) || x < 0) throw new Error(`${ten} phải là số nguyên không âm`);
  return x;
}

function apKeHoach(st, id, kh = {}) {
  const p = st.nguoi[id]; const m = MUA[st.mua - 1];
  if (!p || p.pha) throw new Error('Tiệm này không chơi được');
  const vay = soNguyen(kh.vay, 'Tiền vay'), tra = soNguyen(kh.tra, 'Tiền trả nợ');
  const tienGoc = p.tien;
  if (vay > hanMucVay(st, p)) throw new Error(`Chỉ vay thêm được tối đa ${hanMucVay(st, p)} xu`);
  p.tien += vay; p.no += vay;
  if (tra > p.no) throw new Error('Trả nhiều hơn số nợ');
  if (tra > 0 && tra > p.tien) throw new Error('Không đủ tiền để trả nợ');
  p.tien -= tra; p.no -= tra;

  const dn = laDN(st);
  p.viecHomNay = {};
  const saThai = soNguyen(kh.saThai, 'Số thợ cho nghỉ');
  if (saThai > p.tho.length) throw new Error('Không đủ thợ để cho nghỉ');
  if (saThai && !dn) { p.tho.sort((a, b) => a.ngay - b.ngay); p.tho.splice(0, saThai); p.tien -= saThai * LUAT.denBuSaThai; }
  if (saThai && dn) {          // cho nghỉ người tay nghề thấp nhất trước; đền 3 ngày lương theo cấp
    p.tho.sort((a, b) => (a.cap - b.cap) || (a.ngay - b.ngay));
    for (const t of p.tho.splice(0, saThai)) p.tien -= LUAT.capTho[t.cap].luong * LUAT.ngayDenBu;
  }
  const thue = soNguyen(kh.thue, 'Số thợ thuê');
  if (thue && !dn) { p.tien -= thue * LUAT.phiThue; for (let i = 0; i < thue; i++) p.tho.push({ ngay: 0 }); }
  if (dn) {
    // kh.thue = số thợ Lành nghề; kh.thueCap = { 1: học việc, 2: lành nghề, 3: thợ cả }
    const tc = { ...(kh.thueCap || {}) };
    if (thue) tc[2] = (tc[2] || 0) + thue;
    for (const [cap, n0] of Object.entries(tc)) {
      if (!LUAT.capTho[cap]) throw new Error('Cấp thợ không hợp lệ');
      const n = soNguyen(n0, 'Số thợ thuê');
      p.tien -= n * LUAT.capTho[cap].phi;
      for (let i = 0; i < n; i++) p.tho.push({ cap: Number(cap), ngay: 0 });
      if (n && Number(cap) === 3) p.viecHomNay.thueThoCa = true;
    }
    const dt = soNguyen(kh.daoTao, 'Số thợ đi học');
    if (dt) {
      const ung = p.tho.filter((t) => t.cap === 2 && !t.hoc);
      if (dt > ung.length) throw new Error(`Chỉ có ${ung.length} thợ Lành nghề rảnh để đi học`);
      ung.slice(0, dt).forEach((t) => { t.hoc = { con: LUAT.ngayDaoTao }; });
      p.tien -= dt * LUAT.phiDaoTaoThoCa;
    }
    const tq = soNguyen(kh.thueQuay, 'Số nhân viên quầy thuê'), nq = soNguyen(kh.nghiQuay, 'Số nhân viên quầy cho nghỉ');
    if (nq > p.quay) throw new Error('Không đủ nhân viên quầy để cho nghỉ');
    p.quay -= nq; p.lePhep = Math.min(p.lePhep, p.quay);
    p.quay += tq; p.tien -= tq * LUAT.phiQuay;
    if (p.quay > LUAT.quayMax) throw new Error(`Tối đa ${LUAT.quayMax} nhân viên quầy`);
    const dq = soNguyen(kh.daoTaoQuay, 'Số nhân viên học lễ phép');
    if (dq > p.quay - p.lePhep) throw new Error('Không đủ nhân viên quầy chưa học lễ phép');
    p.lePhep += dq; p.tien -= dq * LUAT.phiDaoTaoQuay;
    for (const ma of kh.dauTuTN || []) {
      const d = DAU_TU_TN[ma];
      if (!d) throw new Error('Khoản đầu tư không hợp lệ');
      if (p.tn[ma]) throw new Error(`Đã có ${d.ten}`);
      p.tn[ma] = true; p.tien -= d.gia;
    }
    if (kh.donDep) { p.tien -= LUAT.phiDonDep; p.viecHomNay.donDep = true; }
    if (kh.khaoSat) { p.tien -= LUAT.phiKhaoSat; p.khaoSat = st.ngay; p.viecHomNay.khaoSat = true; }
  } else if (kh.thueCap || kh.daoTao || kh.thueQuay || kh.nghiQuay || kh.daoTaoQuay || kh.dauTuTN || kh.donDep || kh.khaoSat || kh.baoBi) throw new Error('Tính năng này chỉ có ở chế độ Doanh nhân');
  if (p.tho.length > 12) throw new Error('Tối đa 12 thợ');

  if (kh.nangLo) {
    if (p.lo >= LUAT.lo.length) throw new Error('Lò đã ở cấp cao nhất');
    p.tien -= LUAT.giaNangLo[p.lo]; p.lo += 1;
  }
  if (kh.mayDanh) {
    if (p.mayDanh) throw new Error('Đã có máy đánh trứng');
    p.tien -= LUAT.giaMayDanh; p.mayDanh = true;
  }
  if (kh.chiNhanh) {
    if (laDN(st)) throw new Error('Ở chế độ Doanh nhân hãy mở cửa hàng mới (mục Chuỗi cửa hàng)');
    if (!m.chiNhanh) throw new Error('Mùa này chưa mở được chi nhánh');
    if (p.chiNhanh >= 2) throw new Error('Tối đa 2 chi nhánh');
    p.tien -= LUAT.giaChiNhanh; p.chiNhanh += 1;
  }
  if (kh.nghienCuu) {
    const b = BANH[kh.nghienCuu];
    if (!m.nghienCuu && !dn) throw new Error('Mùa này chưa mở nghiên cứu');
    if (b?.dn && !dn) throw new Error('Món này chỉ có ở chế độ Doanh nhân');
    if (!b || b.mo !== 'nghienCuu') throw new Error('Bánh này không cần nghiên cứu');
    if (p.moKhoa.includes(kh.nghienCuu)) throw new Error('Đã có công thức này');
    if (p.nghienCuu) throw new Error('Đang nghiên cứu một công thức khác');
    p.tien -= b.phiNC; p.nghienCuu = { banh: kh.nghienCuu, con: LUAT.ngayNghienCuu };
  }

  let tienVao = 0;   // tiền vay/rút/góp mới hôm nay (không tính là chi tiêu)
  const DN_KEYS = ['vayNong', 'vayTheChap', 'traKhoan', 'giaHan', 'goiVon', 'guiTK', 'rutTK', 'muaXe', 'gopTraiGa', 'muaMatBang', 'moCuaHang', 'chienDich', 'anThu', 'gioVang'];
  if (!dn && DN_KEYS.some((k) => kh[k])) throw new Error('Tính năng này chỉ có ở chế độ Doanh nhân');
  if (dn) {
    const chong = soKhoanVay(p) >= LUAT.soKhoanChong ? LUAT.laiVayChong : 0;   // vay chồng: khoản mới lãi cao hơn
    const vn = soNguyen(kh.vayNong, 'Tiền vay nóng');
    if (vn) {
      const dang = p.khoanVay.filter((k) => k.loai === 'nong').reduce((a, k) => a + k.goc, 0);
      if (dang + vn > LUAT.vayNongMax) throw new Error(`Vay nóng tối đa ${LUAT.vayNongMax} xu (đang nợ ${dang})`);
      p.khoanVay.push({ id: p.soKhoan++, loai: 'nong', goc: vn, lai: LUAT.laiNong + chong, han: st.ngay + LUAT.hanNong - 1 });
      p.tien += vn; tienVao += vn; p.viecHomNay.vayNong = true;
    }
    if (kh.vayTheChap) {
      const { taiSan, so: so0 } = kh.vayTheChap; const so = soNguyen(so0, 'Tiền vay thế chấp');
      const ts = taiSanTheChap(st, p).find((x) => x.ma === taiSan);
      if (!ts) throw new Error('Không có tài sản này để thế chấp');
      if (ts.dangTheChap) throw new Error(`${ts.ten} đang được thế chấp rồi`);
      const tran = Math.floor((ts.giaTri * LUAT.tyLeTheChap) / 100);
      if (!so || so > tran) throw new Error(`Thế chấp ${ts.ten} vay được 1–${tran} xu`);
      p.khoanVay.push({ id: p.soKhoan++, loai: 'theChap', goc: so, lai: LUAT.laiTheChap + chong, han: st.ngay + LUAT.hanTheChap - 1, taiSan, giaHan: false });
      p.tien += so; tienVao += so; p.viecHomNay.theChap = true;
    }
    for (const t of kh.traKhoan || []) {
      const k = p.khoanVay.find((x) => x.id === t.id); const so = soNguyen(t.so, 'Tiền trả');
      if (!k) throw new Error('Không thấy khoản vay');
      if (so > k.goc) throw new Error('Trả nhiều hơn số nợ của khoản này');
      k.goc -= so; p.tien -= so;
    }
    p.khoanVay = p.khoanVay.filter((k) => k.goc > 0);
    for (const kid of kh.giaHan || []) {
      const k = p.khoanVay.find((x) => x.id === kid);
      if (!k || k.loai !== 'theChap') throw new Error('Chỉ gia hạn được khoản vay thế chấp');
      if (k.giaHan) throw new Error('Mỗi khoản chỉ gia hạn 1 lần');
      k.giaHan = true; k.han += LUAT.giaHanNgay; p.tien -= Math.ceil((k.goc * LUAT.phiGiaHan) / 100);
    }
    const gv = soNguyen(kh.goiVon, 'Tiền gọi vốn');
    if (gv) {
      if (st.mua < LUAT.goiVonTuMua) throw new Error(`Gọi vốn góp mở từ mùa ${LUAT.goiVonTuMua}`);
      if (p.gopVon) throw new Error('Mỗi mùa chỉ gọi vốn 1 lần');
      if (gv < LUAT.goiVonMin || gv > LUAT.goiVonMax) throw new Error(`Gọi vốn từ ${LUAT.goiVonMin} đến ${LUAT.goiVonMax} xu`);
      p.gopVon = gv; p.tien += gv; tienVao += gv; p.viecHomNay.goiVon = true;
    }
    const gui = soNguyen(kh.guiTK, 'Tiền gửi tiết kiệm'), rut = soNguyen(kh.rutTK, 'Tiền rút tiết kiệm');
    if (rut > p.tietKiem) throw new Error('Rút nhiều hơn số tiết kiệm');
    p.tietKiem += gui - rut; p.tien += rut - gui; tienVao += rut;
    if (gui) p.viecHomNay.guiTK = true;
    if (kh.muaXe) { if (p.dauTu.xe) throw new Error('Đã có xe giao hàng'); p.dauTu.xe = true; p.tien -= LUAT.giaXe; }
    if (kh.gopTraiGa) { if (p.dauTu.traiGa) throw new Error('Đã góp vốn trại gà'); p.dauTu.traiGa = true; p.tien -= LUAT.giaTraiGa; p.viecHomNay.traiGa = true; }
    if (kh.muaMatBang) { if (p.matBangChinh) throw new Error('Đã sở hữu mặt bằng tiệm chính'); p.matBangChinh = true; p.tien -= KHU[p.khu].giaMatBang; }
    if (kh.moCuaHang) {
      const { khu, cach } = kh.moCuaHang;
      if (!KHU[khu]) throw new Error('Khu không hợp lệ');
      if (khu === p.khu || p.cuaHang.some((c) => c.khu === khu)) throw new Error('Mỗi khu chỉ mở 1 cửa hàng');
      if (soCuaHang(p) >= LUAT.cuaHangMax) throw new Error(`Tối đa ${LUAT.cuaHangMax} cửa hàng`);
      if (!['thue', 'mua'].includes(cach)) throw new Error('Chọn thuê hoặc mua mặt bằng');
      p.tien -= cach === 'mua' ? KHU[khu].giaMatBang : LUAT.cocThue;
      p.cuaHang.push({ khu, so: cach, tuNgay: st.ngay }); p.viecHomNay.moCuaHang = khu;
    }
    if (kh.chienDich) {
      if (!NHOM_KHACH[kh.chienDich]) throw new Error('Nhóm khách không hợp lệ');
      p.tien -= LUAT.phiChienDich; p.chienDich = { nhom: kh.chienDich, den: st.ngay + LUAT.ngayChienDich - 1 };
      p.viecHomNay.chienDich = kh.chienDich;
    }
    if (kh.gioVang) { if (!LUAT.gioVang.includes(kh.gioVang)) throw new Error('Giờ vàng giảm 20%, 40% hoặc 50%'); p.viecHomNay.gioVang = kh.gioVang; }
  }

  for (const [nl, sl0] of Object.entries(kh.mua || {})) {
    if (!NGUYEN_LIEU[nl]) throw new Error(`Không có nguyên liệu ${nl}`);
    const sl = soNguyen(sl0, `Số ${NGUYEN_LIEU[nl].ten}`);
    if (!sl) continue;
    p.tien -= sl * giaMuaNL(st, p, nl);
    themLo(p.kho, nl, sl, st.ngay + hanNL(st, nl) - 1);
  }

  let cong = 0, soBanh = 0;
  const dsBanh = banhDangCo(st);
  for (const [b, sl0] of Object.entries(kh.lam || {})) {
    const sl = soNguyen(sl0, 'Số bánh');
    if (!sl) continue;
    if (!dsBanh.includes(b)) throw new Error(`${BANH[b]?.ten || b} không có trong mùa này`);
    if (!daMoKhoa(st, p, b)) throw new Error(`Chưa có công thức ${BANH[b].ten}`);
    if (BANH[b].canThoCa && !coThoCa(p)) throw new Error(`${BANH[b].ten} cần ít nhất 1 Thợ cả đang làm việc`);
    for (const [nl, q] of Object.entries(BANH[b].ct)) {
      const can = q * sl;
      const co = (p.kho[nl] || []).filter((l) => l.exp >= st.ngay).reduce((s, l) => s + l.q, 0);
      if (co < can) throw new Error(`Thiếu ${NGUYEN_LIEU[nl].ten} để làm ${sl} ${BANH[b].ten} (cần ${can}, có ${co})`);
      p.kho[nl] = layLo((p.kho[nl] || []).filter((l) => l.exp >= st.ngay), can);
    }
    cong += congBanh(p, b) * sl; soBanh += sl;
    themLo(p.hang, b, sl, st.ngay + BANH[b].han - 1);
  }
  if (cong > congTho(st, p)) throw new Error(`Vượt công thợ: cần ${cong}, có ${congTho(st, p)}`);
  if (dn) {
    const lam = Object.entries(kh.lam || {}).filter(([, q]) => q > 0).map(([b]) => b);
    p.viecHomNay.lam = lam;
    if (lam.some((b) => ['banhmi', 'croissant'].includes(b))) p.viecHomNay.lamTuoi = true;
    if (kh.baoBi) { p.tien -= soBanh; p.viecHomNay.baoBi = true; }      // bao bì đẹp: 1 xu mỗi bánh làm hôm nay
  }
  if (soBanh > sucLo(st, p)) throw new Error(`Vượt sức lò: ${soBanh} bánh, lò nướng được ${sucLo(st, p)}`);

  for (const [b, g0] of Object.entries(kh.gia || {})) {
    if (!BANH[b]) throw new Error('Bánh không hợp lệ');
    const g = soNguyen(g0, 'Giá');
    if (g < 1 || g > BANH[b].gia * 3) throw new Error(`Giá ${BANH[b].ten} phải từ 1 đến ${BANH[b].gia * 3} xu`);
    p.giaBan[b] = g;
  }
  const qc = soNguyen(kh.quangCao, 'Tiền quảng cáo');
  if (qc) { p.tien -= qc; p.quangCao = Math.min(LUAT.quangCaoMax, p.quangCao + Math.floor(qc / 5)); p.qcHomNay = true; }
  else p.qcHomNay = false;

  if (dn && kh.anThu) {
    const { banh, sl } = kh.anThu;
    if (!LUAT.anThu.includes(sl)) throw new Error('Mời ăn thử 5, 10 hoặc 20 bánh');
    const co = (p.hang[banh] || []).filter((l) => l.exp >= st.ngay).reduce((a, l) => a + l.q, 0);
    if (co < sl) throw new Error(`Không đủ ${BANH[banh]?.ten || 'bánh'} để mời ăn thử (có ${co})`);
    p.hang[banh] = layLo(p.hang[banh].filter((l) => l.exp >= st.ngay), sl);
    p.viecHomNay.anThu = { banh, sl };
  }
  // Mua công thức (Doanh nhân): đắt hơn nghiên cứu 50%, làm được từ NGÀY MAI (xử lý sau phần làm bánh)
  if (kh.muaCongThuc) {
    const b = BANH[kh.muaCongThuc];
    if (!dn) throw new Error('Mua công thức chỉ có ở chế độ Doanh nhân');
    if (!b || b.mo !== 'nghienCuu') throw new Error('Món này không cần công thức');
    if (p.moKhoa.includes(kh.muaCongThuc)) throw new Error('Đã có công thức này');
    if (p.nghienCuu?.banh === kh.muaCongThuc || kh.nghienCuu === kh.muaCongThuc) throw new Error('Đang nghiên cứu chính món này');
    p.tien -= Math.floor((b.phiNC * LUAT.heSoMuaCongThuc) / 100);
    p.moKhoa.push(kh.muaCongThuc); p.viecHomNay.muaCongThuc = kh.muaCongThuc;
  }
  if (kh.nhanDon) {
    if (st.suKien.id !== 'tiec' || !st.suKien.don) throw new Error('Hôm nay không có đơn đặt tiệc');
    st.donDat.push({ nguoi: id, ...st.suKien.don });
  }
  // Tiệm đang âm tiền vẫn nộp được kế hoạch không tiêu gì (để chờ bán hàng gỡ lại)
  const chiTieu = tienGoc + vay + tienVao - tra - p.tien;
  if (p.tien < 0 && chiTieu > 0) throw new Error(`Không đủ tiền: thiếu ${-p.tien} xu (có thể vay thêm)`);
  return st;
}

export function nopKeHoach(st0, id, kh) {
  if (st0.ketThuc) throw new Error('Mùa đã kết thúc');
  if (st0.keHoach[id]) throw new Error('Tiệm này đã nộp kế hoạch hôm nay');
  const st = apKeHoach(clone(st0), id, kh);
  st.keHoach[id] = true;
  return st;
}
export const choNop = (st) => st.nguoi.filter((p) => !p.pha && !st.keHoach[p.id]).map((p) => p.id);

// ---------------- Bán hàng ----------------
function chiaTheoTyLe(tong, w) {           // chia số nguyên theo trọng số, phần dư lớn nhất
  const sw = w.reduce((s, x) => s + x, 0);
  if (!sw || !tong) return w.map(() => 0);
  const a = w.map((x) => Math.floor((tong * x) / sw));
  let du = tong - a.reduce((s, x) => s + x, 0);
  const rem = w.map((x, i) => ({ i, r: (tong * x) % sw })).sort((x, y) => y.r - x.r || x.i - y.i);
  for (let k = 0; du > 0; k = (k + 1) % rem.length) { a[rem[k].i]++; du--; }
  return a;
}
export function heSoGia(b, gia, nhayPct = 100) {          // % sức hút theo giá (nhayPct: độ nhạy giá của khu, Doanh nhân)
  const r = Math.floor((gia * 100) / BANH[b].gia);
  const nhay = nhayPct === 100 ? BANH[b].nhay : Math.floor((BANH[b].nhay * nhayPct) / 100);
  return clamp(100 + Math.floor((nhay * (100 - r)) / 100), 5, 250);
}
function heSoKhachMua(st, b) {
  const m = MUA[st.mua - 1];
  let k = THOI_TIET[st.thoiTiet].khach;
  const sk = suKienHomNay(st);
  if (sk.khach) { const x = sk.khach[b] ?? sk.khach._; if (x) k = pct(k, x); }
  if (m.banhMua === b) {
    const dinh = Math.floor((m.ngay * 8) / 10);
    const f = st.ngay <= dinh ? 50 + Math.floor((150 * st.ngay) / dinh) : 60;
    k = pct(k, f);
  }
  return k;
}
export function nhuCauDuKien(st, b) {      // khách cả phố của 1 loại bánh khi giá gợi ý (chưa ngẫu nhiên)
  const n = st.nguoi.filter((p) => !p.pha).length;
  return pct(BANH[b].nhuCau * n, heSoKhachMua(st, b));
}

function banLo(p, b, q) { p.hang[b] = layLo(p.hang[b] || [], q); }

export const heSoUyTin = (p) => 70 + Math.floor(p.uyTin / 10);
// % sức hút thêm của Doanh nhân (ngoài trải nghiệm): chiến dịch, ăn thử, xe giao hàng, thói quen chờ giờ vàng
export function hutThemDN(st, p, k) {
  let x = 100;
  if (p.chienDich && p.chienDich.den >= st.ngay) x += Math.min(LUAT.chienDichMax, Math.floor((LUAT.chienDichMax * (KHU[k].tyLe[p.chienDich.nhom] || 0)) / 60));
  if (p.anThuHL && p.anThuHL.den >= st.ngay) x += p.anThuHL.pct;
  if (p.dauTu?.xe) x += st.thoiTiet >= 2 ? 25 : 8;
  if ((p.gioVangLienTiep || 0) >= LUAT.gioVangThoiQuen) x -= LUAT.gioVangMatKhach;
  return Math.max(10, x);
}
function banHangDN(st, bc, song, sk, m) {
  // mời ăn thử: tác dụng tuỳ độ ngon (Miệng)
  for (const p of song) {
    const at = p.viecHomNay?.anThu; if (!at) continue;
    const mieng = p.tnDiem.mieng;
    const pc = mieng >= 30 ? Math.min(40, at.sl * 2) : mieng <= 20 ? -10 : at.sl;
    p.anThuHL = { den: st.ngay + LUAT.ngayAnThu - 1, pct: pc };
    bc[p.id].anThu = mieng >= 30 ? 'ngon' : mieng <= 20 ? 'do' : 'vua';
  }
  const dv = [];                                   // đơn vị bán = mỗi cửa hàng của mỗi tiệm
  for (const p of song) for (const k of [p.khu, ...p.cuaHang.map((c) => c.khu)]) dv.push({ p, k, hang: {} });
  const soTiem = {}; for (const u of dv) soTiem[u.k] = (soTiem[u.k] || 0) + 1;
  for (const p of song) bc[p.id].soTiemKhu = soTiem[p.khu];
  const ds0 = banhDangCo(st);
  // chia hàng của xưởng cho các cửa hàng theo số khách dự kiến
  for (const p of song) {
    const us = dv.filter((u) => u.p === p);
    for (const b of ds0) {
      const q = soLuong((p.hang[b] || []).filter((l) => l.exp >= st.ngay)); if (!q) continue;
      const w = us.map((u) => Math.max(1, Math.floor((nhuCauKhu(st, u.k, b, soTiem[u.k]) * 100) / soTiem[u.k])));
      chiaTheoTyLe(q, w).forEach((a, i) => { us[i].hang[b] = a; });
    }
  }
  for (const k of Object.keys(KHU)) {
    const ds = dv.filter((u) => u.k === k); if (!ds.length) continue;
    const nh = nhayKhu(k);
    for (const b of ds0) {
      const hut = ds.map((u) => {
        const p = u.p, q = u.hang[b] || 0; if (!q) return 0;
        const lots = (p.hang[b] || []).filter((l) => l.exp >= st.ngay); const tong = soLuong(lots);
        const cu = lots.filter((l) => l.exp - BANH[b].han + 1 < st.ngay).reduce((s, l) => s + l.q, 0);
        let h = heSoGia(b, p.giaBan[b] ?? BANH[b].gia, nh);
        h = pct(h, 50 + Math.floor(p.uyTin / 5));
        let qc = pct(p.quangCao, m.quangCao);
        if (sk.loai === 'noiTieng' && p.qcHomNay) qc += 50;
        h = pct(h, 100 + qc);
        h = pct(h, hutTraiNghiem(k, p.tnDiem));
        h = pct(h, hutThemDN(st, p, k));
        h = pct(h, 100 - Math.floor((20 * cu) / tong));
        return Math.max(1, h);
      });
      ds.forEach((u, i) => { if (u.k === u.p.khu) bc[u.p.id].hut[b] = hut[i]; });
      if (!ds.some((u) => u.hang[b])) continue;
      // tiệm đẹp, thơm, phục vụ tốt (và chiến dịch, xe, ăn thử) kéo thêm người tới mua: tổng khách × hệ số TB của các cửa hàng trong khu
      // (uy tín cũng kéo khách: 300 điểm = 100%, 500 điểm = 120%)
      const heSoKhu = Math.floor(ds.reduce((a, u) => a + pct(pct(hutTraiNghiem(k, u.p.tnDiem), hutThemDN(st, u.p, k)), heSoUyTin(u.p)), 0) / ds.length);
      const tongKhach = pct(pct(nhuCauKhu(st, k, b, ds.length), heSoKhu), randInt(st, 90, 110));
      const con = ds.map((u) => u.hang[b] || 0);
      const daBan = ds.map(() => 0);
      let khachCon = tongKhach;
      const chiuGia = ds.map((u) => Math.min(100, heSoGia(b, u.p.giaBan[b] ?? BANH[b].gia, nh)));
      const phan = chiaTheoTyLe(khachCon, hut.map((h, i) => (con[i] > 0 ? h : 0)));
      ds.forEach((u, i) => {
        const mua = pct(phan[i], chiuGia[i]);
        bc[u.p.id].khach += mua; const x = Math.min(mua, con[i]); daBan[i] += x; con[i] -= x; bc[u.p.id].thieuKhach += mua - x;
        khachCon -= phan[i] - (mua - x);
      });
      for (let vong = 0; vong < 3 && khachCon > 0; vong++) {
        const w = hut.map((h, i) => (con[i] > 0 ? h : 0));
        if (!w.some(Boolean)) break;
        const ph = chiaTheoTyLe(khachCon, w);
        ds.forEach((u, i) => { const mua = pct(ph[i], chiuGia[i]); const x = Math.min(mua, con[i]); daBan[i] += x; con[i] -= x; khachCon -= ph[i] - (mua - x); });
      }
      ds.forEach((u, i) => {
        if (!daBan[i]) return;
        const p = u.p; banLo(p, b, daBan[i]);
        const gia = p.giaBan[b] ?? BANH[b].gia;
        p.tien += daBan[i] * gia; bc[p.id].doanhThu += daBan[i] * gia; bc[p.id].ban[b] = (bc[p.id].ban[b] || 0) + daBan[i];
        if (u.k !== p.khu) (bc[p.id].banCuaHang ||= {})[k] = (bc[p.id].banCuaHang[k] || 0) + daBan[i];
      });
    }
  }
  // Giờ vàng: bánh hết hạn hôm nay được giảm giá cho khách săn giảm giá
  for (const p of song) {
    const g = p.viecHomNay?.gioVang; if (!g) continue;
    const tyLe = Math.min(90, Math.floor((g * 3) / 2));
    let soBan = 0, tien = 0;
    for (const b of Object.keys(p.hang)) {
      const L = soLuong(p.hang[b].filter((l) => l.exp === st.ngay)); if (!L) continue;
      const x = Math.floor((L * tyLe) / 100); if (!x) continue;
      p.hang[b] = layLo(p.hang[b], x);
      const gia = Math.max(1, Math.floor(((p.giaBan[b] ?? BANH[b].gia) * (100 - g)) / 100));
      soBan += x; tien += x * gia; bc[p.id].ban[b] = (bc[p.id].ban[b] || 0) + x;
    }
    p.tien += tien; bc[p.id].doanhThu += tien; bc[p.id].gioVang = { giam: g, ban: soBan, tien };
  }
}

export function ketThucNgay(st0) {
  if (st0.ketThuc) throw new Error('Mùa đã kết thúc');
  if (choNop(st0).length) throw new Error('Còn tiệm chưa nộp kế hoạch');
  const st = clone(st0);
  const m = MUA[st.mua - 1];
  const sk = suKienHomNay(st);
  const bc = Object.fromEntries(st.nguoi.map((p) => [p.id, { ban: {}, hut: {}, thieuKhach: 0, khach: 0, doanhThu: 0, chiPhi: {}, bo: 0 }]));
  let song = st.nguoi.filter((p) => !p.pha);

  // Đơn đặt đến hạn: giao trước khi bán lẻ
  for (const d of st.donDat.filter((x) => x.han === st.ngay)) {
    const p = st.nguoi[d.nguoi]; if (p.pha) continue;
    const co = (p.hang[d.banh] || []).filter((l) => l.exp >= st.ngay).reduce((s, l) => s + l.q, 0);
    if (co >= d.sl) { banLo(p, d.banh, d.sl); p.tien += d.sl * d.gia; bc[p.id].doanhThu += d.sl * d.gia; bc[p.id].don = `Giao đủ ${d.sl} ${BANH[d.banh].ten}`; }
    else { const phat = d.sl * Math.floor(BANH[d.banh].gia / 2); p.tien -= phat; p.uyTin = Math.max(0, p.uyTin - 40); bc[p.id].chiPhi.phatDon = phat; bc[p.id].don = `Thiếu đơn ${BANH[d.banh].ten}: phạt ${phat} xu`; }
  }
  st.donDat = st.donDat.filter((x) => x.han > st.ngay);

  // Doanh nhân: chấm 5 điểm chạm trước giờ bán; mỗi khu là một thị trường riêng
  if (laDN(st)) for (const p of song) { p.tnDiem = diemTraiNghiem(st, p); bc[p.id].traiNghiem = p.tnDiem; bc[p.id].khu = p.khu; }
  if (laDN(st)) banHangDN(st, bc, song, sk, m);
  const thiTruong = laDN(st) ? [] : [{ k: null, ds: song }];
  for (const { k, ds: song } of thiTruong) {
  const nh = k ? nhayKhu(k) : 100;
  if (k) song.forEach((p) => { bc[p.id].soTiemKhu = song.length; });
  for (const b of banhDangCo(st)) {
    const ban = song.filter((p) => (p.hang[b] || []).some((l) => l.exp >= st.ngay && l.q > 0));
    // sức hút từng tiệm
    const hut = song.map((p) => {
      const lots = (p.hang[b] || []).filter((l) => l.exp >= st.ngay);
      const q = soLuong(lots); if (!q) return 0;
      const cu = lots.filter((l) => l.exp - BANH[b].han + 1 < st.ngay).reduce((s, l) => s + l.q, 0);
      const gia = p.giaBan[b] ?? BANH[b].gia;
      let h = heSoGia(b, gia, nh);
      h = pct(h, 50 + Math.floor(p.uyTin / 5));
      let qc = pct(p.quangCao, m.quangCao);
      if (sk.loai === 'noiTieng' && p.qcHomNay) qc += 50;
      h = pct(h, 100 + qc);
      if (k) h = pct(h, hutTraiNghiem(k, p.tnDiem));   // Mắt, Tai, Mũi, Không gian kéo khách vào tiệm
      h = pct(h, 100 - Math.floor((20 * cu) / q));
      return Math.max(1, h);
    });
    song.forEach((p, i) => { bc[p.id].hut[b] = hut[i]; });
    if (!ban.length) continue;
    // khách cả phố: giảm khi giá chung cao (sức hút giá trung bình của các tiệm có bánh)
    const tongKhach = pct(k ? nhuCauKhu(st, k, b, song.length) : nhuCauDuKien(st, b), randInt(st, 90, 110));
    // chia khách, khách dư chuyển tiệm (tối đa 3 vòng)
    const con = song.map((p) => (p.hang[b] || []).filter((l) => l.exp >= st.ngay).reduce((s, l) => s + l.q, 0));
    const daBan = song.map(() => 0);
    let khachCon = tongKhach;
    // khách tới tiệm nhưng chê đắt thì bỏ về: tỷ lệ mua = min(100, hệ số giá)%
    const chiuGia = song.map((p) => Math.min(100, heSoGia(b, p.giaBan[b] ?? BANH[b].gia, nh)));
    const phan = chiaTheoTyLe(khachCon, hut.map((h, i) => (con[i] > 0 ? h : 0)));
    song.forEach((p, i) => {
      const mua = pct(phan[i], chiuGia[i]);
      bc[p.id].khach += mua; const x = Math.min(mua, con[i]); daBan[i] += x; con[i] -= x; bc[p.id].thieuKhach += mua - x;
      khachCon -= phan[i] - (mua - x);          // khách bỏ về vì đắt + khách đã mua rời đi; còn lại là khách tiệm hết hàng
    });
    for (let vong = 0; vong < 3 && khachCon > 0; vong++) {
      const w = hut.map((h, i) => (con[i] > 0 ? h : 0));
      if (!w.some(Boolean)) break;
      const ph = chiaTheoTyLe(khachCon, w);
      song.forEach((p, i) => { const mua = pct(ph[i], chiuGia[i]); const x = Math.min(mua, con[i]); daBan[i] += x; con[i] -= x; khachCon -= ph[i] - (mua - x); });
    }
    song.forEach((p, i) => {
      if (!daBan[i]) return;
      banLo(p, b, daBan[i]);
      const gia = p.giaBan[b] ?? BANH[b].gia;
      p.tien += daBan[i] * gia; bc[p.id].doanhThu += daBan[i] * gia; bc[p.id].ban[b] = daBan[i];
    });
    // chi nhánh: khách riêng của chủ chi nhánh
    song.forEach((p, i) => {
      if (!p.chiNhanh || !con[i]) return;
      const rieng = pct(pct(BANH[b].nhuCau * p.chiNhanh, LUAT.khachChiNhanh), heSoKhachMua(st, b));
      const kh = pct(rieng, Math.min(100, heSoGia(b, p.giaBan[b] ?? BANH[b].gia)));
      const x = Math.min(kh, con[i]); if (!x) return;
      banLo(p, b, x); con[i] -= x;
      const gia = p.giaBan[b] ?? BANH[b].gia;
      p.tien += x * gia; bc[p.id].doanhThu += x * gia; bc[p.id].ban[b] = (bc[p.id].ban[b] || 0) + x;
    });
  }
  }
  song = st.nguoi.filter((p) => !p.pha);   // (khối trên dùng biến song theo từng khu)

  // Chi phí, hết hạn, uy tín, nghiên cứu
  for (const p of song) {
    const r = bc[p.id];
    const luong = luongNgay(st, p);
    const thue = (laDN(st) ? (p.matBangChinh ? 0 : KHU[p.khu].thue) + p.cuaHang.reduce((a, c) => a + (c.so === 'thue' ? KHU[c.khu].thue : 0) + LUAT.phiCuaHang, 0) : LUAT.thueNha)
      + st.thueThem + p.chiNhanh * LUAT.thueChiNhanh;
    let lai = Math.ceil((p.no * LUAT.laiVayPhanNghin) / 1000);
    if (laDN(st)) lai += p.khoanVay.reduce((a, k) => a + Math.ceil((k.goc * k.lai) / 1000), 0);
    p.tien -= luong + thue + lai;
    Object.assign(r.chiPhi, { luong, thue, lai });
    if (laDN(st)) {
      // khoản vay đến hạn: vay nóng bị thu ngay; thế chấp không trả thì mất tài sản
      for (const k of p.khoanVay.filter((x) => x.han <= st.ngay)) {
        if (k.loai === 'nong') { p.tien -= k.goc; r.traNo = (r.traNo || 0) + k.goc; }
        else { matTaiSan(p, k.taiSan); (r.matTheChap ||= []).push(k.taiSan); }
        k.goc = 0;
      }
      p.khoanVay = p.khoanVay.filter((k) => k.goc > 0);
      const laiTK = Math.floor((p.tietKiem * LUAT.laiTietKiem) / 1000);
      p.tietKiem += laiTK; p.laiDauTu += laiTK;
      let thu = 0;
      if (p.dauTu.traiGa && !(st.dichGaDen >= st.ngay)) { thu += LUAT.coTuc; p.laiDauTu += LUAT.coTuc; }
      if (p.dauTu.xe) { p.tien -= LUAT.xangXe; r.chiPhi.khac = LUAT.xangXe; }
      p.tien += thu; if (thu) r.thuKhac = thu;
      if (laiTK) r.laiTietKiem = laiTK;
      p.gioVangLienTiep = p.viecHomNay?.gioVang ? (p.gioVangLienTiep || 0) + 1 : 0;
      if (p.gioVangLienTiep >= LUAT.gioVangThoiQuen) r.gioVangThoiQuen = true;
      if (p.chienDich && p.chienDich.den <= st.ngay) delete p.chienDich;
      if (p.anThuHL && p.anThuHL.den <= st.ngay) delete p.anThuHL;
    }
    // hết hạn
    let bo = 0, boNL = 0;
    for (const b of Object.keys(p.hang)) { bo += p.hang[b].filter((l) => l.exp <= st.ngay).reduce((s, l) => s + l.q, 0); p.hang[b] = p.hang[b].filter((l) => l.exp > st.ngay); }
    for (const nl of Object.keys(p.kho)) { boNL += p.kho[nl].filter((l) => l.exp <= st.ngay).reduce((s, l) => s + l.q, 0); p.kho[nl] = p.kho[nl].filter((l) => l.exp > st.ngay); }
    r.bo = bo; r.boNL = boNL;
    // uy tín
    // Uy tín: chỉ được thưởng khi vừa ĐỦ HÀNG vừa GIÁ HỢP LÝ (tránh vòng lặp "giá cao → ít khách → luôn đủ hàng → uy tín tăng")
    let d = 0;
    const soBan = Object.values(r.ban).reduce((s, x) => s + x, 0);
    const giaTB = soBan ? Math.floor(Object.entries(r.ban).reduce((s, [b, q]) => s + q * Math.floor(((p.giaBan[b] ?? BANH[b].gia) * 100) / BANH[b].gia), 0) / soBan) : 100;
    r.giaTB = giaTB;
    if (r.khach > 0) {
      const tl = Math.floor(((r.khach - r.thieuKhach) * 100) / r.khach);
      if (tl >= 90 && giaTB <= 110) d += 6; else if (tl < 50) d -= 10;
    }
    if (giaTB > 140) d -= 10; else if (giaTB > 120) d -= 5;
    if (laDN(st)) {          // Miệng (chất lượng bánh) quyết định khách có quay lại
      r.chatLuong = chatLuong(p);
      const mieng = p.tnDiem?.mieng ?? 30;
      if (soBan > 0 && mieng >= 40) d += 2; else if (soBan > 0 && mieng <= 20) d -= 2;
      const at = p.viecHomNay?.anThu;
      if (at) d += mieng >= 30 ? Math.floor(at.sl / 2) : mieng <= 20 ? -Math.floor(at.sl / 2) : 0;
      p.sach = p.viecHomNay?.donDep ? LUAT.sachMax : Math.max(0, (p.sach ?? 0) - LUAT.sachGiam);
      const sai = (p.viecHomNay?.lam || []).find((b) => hopKhu(p.khu, b) < 75);
      if (sai) r.saiMon = sai;
      delete p.tnDiem;
    }
    // kiểm tra vệ sinh: còn bánh đã làm từ 2 ngày trước trở lên → trừ uy tín
    if (sk.loai === 'veSinh' && Object.entries(p.hang).some(([b, lots]) => lots.some((l) => l.q > 0 && l.exp - BANH[b].han + 1 <= st.ngay - 2))) { d -= 20; r.veSinh = true; }
    p.uyTin = clamp(p.uyTin + d, 0, LUAT.uyTinMax);
    // nghiên cứu
    if (p.nghienCuu) { p.nghienCuu.con -= 1; if (p.nghienCuu.con <= 0) { p.moKhoa.push(p.nghienCuu.banh); r.moKhoa = p.nghienCuu.banh; p.nghienCuu = null; } }
    if (laDN(st)) {
      const lenCap = [];
      for (const t of p.tho) {
        if (t.hoc) { t.hoc.con -= 1; if (t.hoc.con <= 0) { delete t.hoc; t.cap = 3; lenCap.push(3); } continue; }
        t.ngay += 1;
        if (t.cap === 1 && t.ngay >= LUAT.ngayLenLanhNghe) { t.cap = 2; lenCap.push(2); }
      }
      if (lenCap.length) r.lenCap = lenCap;
      if (p.viecHomNay && Object.keys(p.viecHomNay).length) r.viec = p.viecHomNay;
    } else p.tho.forEach((t) => { t.ngay += 1; });
    delete p.viecHomNay;
    p.quangCao = pct(p.quangCao, LUAT.quangCaoGiu);
    // huy hiệu
    p.dem.khongBo = bo === 0 && Object.keys(r.ban).length ? p.dem.khongBo + 1 : 0;
    p.dem.namSao = p.uyTin >= 450 ? p.dem.namSao + 1 : 0;
    if (p.dem.khongBo === 3 && !p.huyHieu.includes('khongBo')) p.huyHieu.push('khongBo');
    if (p.dem.namSao === 10 && !p.huyHieu.includes('namSao')) p.huyHieu.push('namSao');
    // phá sản
    if (p.tien < 0) { p.amNgay += 1; if (p.amNgay >= 2 && hanMucVay(st, p) < -p.tien) { p.pha = true; r.phaSan = true; } }
    else p.amNgay = 0;
    r.tienCuoi = p.tien;
  }
  // sự kiện chấm điểm sau bán
  if (sk.loai === 'phebinh' && song.length) {
    const mx = Math.max(...song.map((p) => p.uyTin));
    song.filter((p) => p.uyTin === mx).forEach((p) => { p.uyTin = Math.min(LUAT.uyTinMax, p.uyTin + 50); bc[p.id].phebinh = true; });
  }
  if (sk.loai === 'cuocThi' && song.length) {
    const mx = Math.max(...song.map((p) => Object.keys(bc[p.id].ban).length));
    if (mx > 0) song.filter((p) => Object.keys(bc[p.id].ban).length === mx).forEach((p) => { p.uyTin = Math.min(LUAT.uyTinMax, p.uyTin + 30); bc[p.id].cuocThi = true; });
  }
  for (const p of song) p.homQua = bc[p.id];
  st.baoCao.push({ ngay: st.ngay, suKien: sk.id, thoiTiet: st.thoiTiet, nguoi: bc });

  st.ngay += 1;
  if (st.ngay > m.ngay) { ketThucMua(st); }
  else batDauNgay(st);
  return st;
}

function ketThucMua(st) {
  st.ketThuc = true;
  for (const p of st.nguoi) if (!p.pha && p.no === 0 && !p.huyHieu.includes('hetNo')) p.huyHieu.push('hetNo');
  st.xepHang = xepHang(st, true);
}

export function xepHang(st, cuoiMua = st.ketThuc) {
  return st.nguoi
    .map((p) => ({ id: p.id, ten: p.ten, giaTri: giaTriTieM(st, p, cuoiMua), pha: p.pha, uyTin: p.uyTin }))
    .sort((a, b) => (a.pha - b.pha) || (b.giaTri - a.giaTri) || (b.uyTin - a.uyTin) || (a.id - b.id));
}
export const sao = (uyTin) => Math.round(uyTin / 100);   // 0–5 sao
