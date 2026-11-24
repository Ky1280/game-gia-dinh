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
};

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
};

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
export function taoVan({ seed = 1, mua = 1, nguoiChoi }) {
  if (!Array.isArray(nguoiChoi) || nguoiChoi.length < 1 || nguoiChoi.length > 4) throw new Error('Cần 1–4 người chơi');
  const m = MUA[mua - 1]; if (!m) throw new Error('Mùa không hợp lệ');
  const st = {
    phienBan: 1, seed, rng: seed | 0, mua, ngay: 1, ketThuc: false,
    thueThem: 0, hieuUng: [], donDat: [], thiTruong: null, suKien: null, thoiTiet: 0, keHoach: {}, baoCao: [],
    nguoi: nguoiChoi.map((p, i) => ({
      id: i, ten: p.ten || `Tiệm ${i + 1}`, icon: p.icon || '🏠', may: p.may || null,
      tien: LUAT.tienDau, no: 0, uyTin: LUAT.uyTinDau, pha: false, amNgay: 0,
      tho: Array.from({ length: LUAT.thoDau }, () => ({ ngay: LUAT.ngayThao })),
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
  if (m.nghienCuu) ds.push('sukem', 'tart', 'banhkem');
  if (m.banhMua) ds.push(m.banhMua);
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
  let pool = SU_KIEN.filter((s) => (s.loai !== 'donDat' || m.donDat));
  const sk = pickW(st, pool);
  st.suKien = { id: sk.id, may: null, don: null };
  if (sk.giaNL) st.hieuUng.push({ giaNL: sk.giaNL, den: st.ngay + sk.hieuLuc - 1 });
  const song = st.nguoi.filter((p) => !p.pha);
  if ((sk.loai === 'hongLo' || sk.loai === 'omTho') && song.length) st.suKien.may = song[randInt(st, 0, song.length - 1)].id;
  if (sk.loai === 'tangThue') st.thueThem += 10;
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
export function congTho(st, p) {
  let c = p.tho.reduce((s, t) => s + (t.ngay >= LUAT.ngayThao ? LUAT.congThao : LUAT.congMoi), 0);
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
  return p.tien + tsLo + tsMay + tsCN - p.no * (cuoiMua ? 2 : 1);
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

  const saThai = soNguyen(kh.saThai, 'Số thợ cho nghỉ');
  if (saThai > p.tho.length) throw new Error('Không đủ thợ để cho nghỉ');
  if (saThai) { p.tho.sort((a, b) => a.ngay - b.ngay); p.tho.splice(0, saThai); p.tien -= saThai * LUAT.denBuSaThai; }
  const thue = soNguyen(kh.thue, 'Số thợ thuê');
  if (thue) { p.tien -= thue * LUAT.phiThue; for (let i = 0; i < thue; i++) p.tho.push({ ngay: 0 }); }
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
    if (!m.chiNhanh) throw new Error('Mùa này chưa mở được chi nhánh');
    if (p.chiNhanh >= 2) throw new Error('Tối đa 2 chi nhánh');
    p.tien -= LUAT.giaChiNhanh; p.chiNhanh += 1;
  }
  if (kh.nghienCuu) {
    const b = BANH[kh.nghienCuu];
    if (!m.nghienCuu) throw new Error('Mùa này chưa mở nghiên cứu');
    if (!b || b.mo !== 'nghienCuu') throw new Error('Bánh này không cần nghiên cứu');
    if (p.moKhoa.includes(kh.nghienCuu)) throw new Error('Đã có công thức này');
    if (p.nghienCuu) throw new Error('Đang nghiên cứu một công thức khác');
    p.tien -= b.phiNC; p.nghienCuu = { banh: kh.nghienCuu, con: LUAT.ngayNghienCuu };
  }

  for (const [nl, sl0] of Object.entries(kh.mua || {})) {
    if (!NGUYEN_LIEU[nl]) throw new Error(`Không có nguyên liệu ${nl}`);
    const sl = soNguyen(sl0, `Số ${NGUYEN_LIEU[nl].ten}`);
    if (!sl) continue;
    p.tien -= sl * st.thiTruong.gia[nl];
    themLo(p.kho, nl, sl, st.ngay + hanNL(st, nl) - 1);
  }

  let cong = 0, soBanh = 0;
  const dsBanh = banhDangCo(st);
  for (const [b, sl0] of Object.entries(kh.lam || {})) {
    const sl = soNguyen(sl0, 'Số bánh');
    if (!sl) continue;
    if (!dsBanh.includes(b)) throw new Error(`${BANH[b]?.ten || b} không có trong mùa này`);
    if (!daMoKhoa(st, p, b)) throw new Error(`Chưa nghiên cứu ${BANH[b].ten}`);
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

  if (kh.nhanDon) {
    if (st.suKien.id !== 'tiec' || !st.suKien.don) throw new Error('Hôm nay không có đơn đặt tiệc');
    st.donDat.push({ nguoi: id, ...st.suKien.don });
  }
  // Tiệm đang âm tiền vẫn nộp được kế hoạch không tiêu gì (để chờ bán hàng gỡ lại)
  const chiTieu = tienGoc + vay - tra - p.tien;
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
export function heSoGia(b, gia) {          // % sức hút theo giá
  const r = Math.floor((gia * 100) / BANH[b].gia);
  return clamp(100 + Math.floor((BANH[b].nhay * (100 - r)) / 100), 5, 250);
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

export function ketThucNgay(st0) {
  if (choNop(st0).length) throw new Error('Còn tiệm chưa nộp kế hoạch');
  const st = clone(st0);
  const m = MUA[st.mua - 1];
  const sk = suKienHomNay(st);
  const bc = Object.fromEntries(st.nguoi.map((p) => [p.id, { ban: {}, hut: {}, thieuKhach: 0, khach: 0, doanhThu: 0, chiPhi: {}, bo: 0 }]));
  const song = st.nguoi.filter((p) => !p.pha);

  // Đơn đặt đến hạn: giao trước khi bán lẻ
  for (const d of st.donDat.filter((x) => x.han === st.ngay)) {
    const p = st.nguoi[d.nguoi]; if (p.pha) continue;
    const co = (p.hang[d.banh] || []).filter((l) => l.exp >= st.ngay).reduce((s, l) => s + l.q, 0);
    if (co >= d.sl) { banLo(p, d.banh, d.sl); p.tien += d.sl * d.gia; bc[p.id].doanhThu += d.sl * d.gia; bc[p.id].don = `Giao đủ ${d.sl} ${BANH[d.banh].ten}`; }
    else { const phat = d.sl * Math.floor(BANH[d.banh].gia / 2); p.tien -= phat; p.uyTin = Math.max(0, p.uyTin - 40); bc[p.id].chiPhi.phatDon = phat; bc[p.id].don = `Thiếu đơn ${BANH[d.banh].ten}: phạt ${phat} xu`; }
  }
  st.donDat = st.donDat.filter((x) => x.han > st.ngay);

  for (const b of banhDangCo(st)) {
    const ban = song.filter((p) => (p.hang[b] || []).some((l) => l.exp >= st.ngay && l.q > 0));
    // sức hút từng tiệm
    const hut = song.map((p) => {
      const lots = (p.hang[b] || []).filter((l) => l.exp >= st.ngay);
      const q = soLuong(lots); if (!q) return 0;
      const cu = lots.filter((l) => l.exp - BANH[b].han + 1 < st.ngay).reduce((s, l) => s + l.q, 0);
      const gia = p.giaBan[b] ?? BANH[b].gia;
      let h = heSoGia(b, gia);
      h = pct(h, 50 + Math.floor(p.uyTin / 5));
      let qc = pct(p.quangCao, m.quangCao);
      if (sk.loai === 'noiTieng' && p.qcHomNay) qc += 50;
      h = pct(h, 100 + qc);
      h = pct(h, 100 - Math.floor((20 * cu) / q));
      return Math.max(1, h);
    });
    song.forEach((p, i) => { bc[p.id].hut[b] = hut[i]; });
    if (!ban.length) continue;
    // khách cả phố: giảm khi giá chung cao (sức hút giá trung bình của các tiệm có bánh)
    const tongKhach = pct(nhuCauDuKien(st, b), randInt(st, 90, 110));
    // chia khách, khách dư chuyển tiệm (tối đa 3 vòng)
    const con = song.map((p) => (p.hang[b] || []).filter((l) => l.exp >= st.ngay).reduce((s, l) => s + l.q, 0));
    const daBan = song.map(() => 0);
    let khachCon = tongKhach;
    // khách tới tiệm nhưng chê đắt thì bỏ về: tỷ lệ mua = min(100, hệ số giá)%
    const chiuGia = song.map((p) => Math.min(100, heSoGia(b, p.giaBan[b] ?? BANH[b].gia)));
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

  // Chi phí, hết hạn, uy tín, nghiên cứu
  for (const p of song) {
    const r = bc[p.id];
    const luong = p.tho.length * LUAT.luongTho;
    const thue = LUAT.thueNha + st.thueThem + p.chiNhanh * LUAT.thueChiNhanh;
    const lai = Math.ceil((p.no * LUAT.laiVayPhanNghin) / 1000);
    p.tien -= luong + thue + lai;
    Object.assign(r.chiPhi, { luong, thue, lai });
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
    // kiểm tra vệ sinh: còn bánh đã làm từ 2 ngày trước trở lên → trừ uy tín
    if (sk.loai === 'veSinh' && Object.entries(p.hang).some(([b, lots]) => lots.some((l) => l.q > 0 && l.exp - BANH[b].han + 1 <= st.ngay - 2))) { d -= 20; r.veSinh = true; }
    p.uyTin = clamp(p.uyTin + d, 0, LUAT.uyTinMax);
    // nghiên cứu
    if (p.nghienCuu) { p.nghienCuu.con -= 1; if (p.nghienCuu.con <= 0) { p.moKhoa.push(p.nghienCuu.banh); r.moKhoa = p.nghienCuu.banh; p.nghienCuu = null; } }
    p.tho.forEach((t) => { t.ngay += 1; });
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
