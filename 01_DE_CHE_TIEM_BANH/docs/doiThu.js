// =====================================================================
// ĐẾ CHẾ TIỆM BÁNH — Đối thủ máy (Dễ / Vừa / Khó)
// Chỉ đọc thông tin công khai + tiệm của chính mình. Không dùng hạt giống của ván
// (dùng ngẫu nhiên riêng) để không làm thay đổi diễn biến của người thật.
// tuyChon (chỉ dùng khi mô phỏng cân bằng): { heSoGia, heSoLam, khongThue, khongDauTu }
// =====================================================================
import {
  BANH, MUA, NGUYEN_LIEU, LUAT, banhDangCo, daMoKhoa, congBanh, congTho, sucLo, hanMucVay,
  nhuCauDuKien, suKienHomNay, kiemTraKeHoach,
} from './engine.js';

function rngRieng(st, id) {
  let s = (st.seed * 7919 + st.ngay * 104729 + id * 1299709 + st.mua * 31) | 0;
  return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const giaNguyenLieu = (st, b) => Object.entries(BANH[b].ct).reduce((s, [nl, q]) => s + q * st.thiTruong.gia[nl], 0);
const hangConDung = (st, p, b) => (p.hang[b] || []).filter((l) => l.exp >= st.ngay).reduce((s, l) => s + l.q, 0);
const khoConDung = (st, p, nl) => (p.kho[nl] || []).filter((l) => l.exp >= st.ngay).reduce((s, l) => s + l.q, 0);

export function keHoachMay(st, id, mucDo = 'vua', tuyChon = {}) {
  const p = st.nguoi[id];
  const m = MUA[st.mua - 1];
  const r = rngRieng(st, id);
  const song = st.nguoi.filter((x) => !x.pha).length;
  const conNgay = m.ngay - st.ngay;
  const sk = suKienHomNay(st);
  const kh = { mua: {}, lam: {}, gia: {} };
  let tien = p.tien;

  // --- 1. Đầu tư (Vừa / Khó) ---
  if (!tuyChon.khongDauTu && mucDo !== 'de') {
    if (m.nghienCuu && !p.nghienCuu) {
      const ung = ['sukem', 'tart', 'banhkem'].filter((b) => !p.moKhoa.includes(b))
        .sort((a, b) => (BANH[b].gia - giaNguyenLieu(st, b)) * BANH[b].nhuCau / BANH[b].cong - (BANH[a].gia - giaNguyenLieu(st, a)) * BANH[a].nhuCau / BANH[a].cong)[0];
      if (ung && tien > BANH[ung].phiNC + (mucDo === 'kho' ? 500 : 800) && conNgay > 6) { kh.nghienCuu = ung; tien -= BANH[ung].phiNC; }
    }
    if (mucDo === 'kho') {
      if (!tuyChon.khongMay && !p.mayDanh && tien > 1100 && conNgay > 8 && p.moKhoa.some((b) => BANH[b].mayDanh)) { kh.mayDanh = true; tien -= LUAT.giaMayDanh; }
      if (!tuyChon.khongLo && p.lo < LUAT.lo.length && tien > LUAT.giaNangLo[p.lo] + 700 && conNgay > 8 && (p.homQua && Object.values(p.homQua.ban).reduce((s, x) => s + x, 0) >= sucLo(st, p) - 2)) { kh.nangLo = true; tien -= LUAT.giaNangLo[p.lo]; }
      if (!tuyChon.khongChiNhanh && m.chiNhanh && p.chiNhanh < 1 && tien > LUAT.giaChiNhanh + 900 && conNgay > 10) { kh.chiNhanh = true; tien -= LUAT.giaChiNhanh; }
    }
  }

  // --- 2. Giá bán ---
  const danhSach = banhDangCo(st).filter((b) => daMoKhoa(st, p, b));
  for (const b of danhSach) {
    let g = BANH[b].gia;
    if (mucDo === 'de') g = Math.round((g * (90 + Math.floor(r() * 45))) / 100);
    if (mucDo !== 'de' && p.homQua) {
      // Vừa: bước 5%, giá 90–125%; Khó: bước 7%, giá 85–135% (bánh ít nhạy giá được tăng mạnh hơn)
      // Vừa: bước 3%, giá 95–110%; Khó: bước 3%, giá 95–108%
      const buoc = 3;
      const tran = mucDo === 'kho' ? 108 : 110, san = 95;
      const cu = p.giaBan[b] ?? g;
      const ban = p.homQua.ban[b] || 0;
      const khach = p.homQua.khach || 0;
      const banHet = ban > 0 && p.homQua.thieuKhach > 0;
      const e = p.homQua.bo > 2 && ban > 0;
      g = banHet ? Math.round((cu * (100 + buoc)) / 100) : e ? Math.round((cu * (100 - buoc)) / 100) : cu;
      if (!ban && khach === 0) g = cu;
      g = Math.max(Math.round((BANH[b].gia * san) / 100), Math.min(Math.round((BANH[b].gia * tran) / 100), g));
    }
    if (tuyChon.heSoGia) g = Math.max(1, Math.round((BANH[b].gia * tuyChon.heSoGia) / 100));
    kh.gia[b] = g;
  }

  // --- 3. Dự báo và số bánh cần làm ---
  const donHomNay = (st.donDat || []).filter((d) => d.nguoi === id && d.han === st.ngay);
  const thuTu = danhSach.slice().sort((a, b) => ((BANH[b].gia - giaNguyenLieu(st, b)) / congBanh(p, b)) - ((BANH[a].gia - giaNguyenLieu(st, a)) / congBanh(p, a)));
  let cong = congTho(st, p), lo = sucLo(st, p);
  const can = {};
  const heSoLam = tuyChon.heSoLam ?? (mucDo === 'de' ? 70 + Math.floor(r() * 70) : mucDo === 'kho' ? 100 : 95);
  for (const b of thuTu) {
    const giaHs = Math.max(20, 100 + Math.floor((BANH[b].nhay * (100 - Math.floor((kh.gia[b] * 100) / BANH[b].gia))) / 100));
    let du = Math.floor((nhuCauDuKien(st, b) * giaHs * heSoLam) / (song * 10000));
    if (p.chiNhanh) du += Math.floor((BANH[b].nhuCau * p.chiNhanh * LUAT.khachChiNhanh) / 100);
    du += donHomNay.filter((d) => d.banh === b).reduce((s, d) => s + d.sl, 0);
    const conHang = BANH[b].han > 1 ? hangConDung(st, p, b) : 0;
    let sl = Math.max(0, du - conHang);
    sl = Math.min(sl, Math.floor(cong / congBanh(p, b)), lo);
    if (sl > 0) { can[b] = sl; cong -= sl * congBanh(p, b); lo -= sl; }
  }

  // --- 4. Nguyên liệu và tiền ---
  const tinhMua = () => {
    const nhu = {};
    for (const [b, sl] of Object.entries(can)) for (const [nl, q] of Object.entries(BANH[b].ct)) nhu[nl] = (nhu[nl] || 0) + q * sl;
    const mua = {};
    let chi = 0;
    for (const [nl, q] of Object.entries(nhu)) { const x = Math.max(0, q - khoConDung(st, p, nl)); if (x) { mua[nl] = x; chi += x * st.thiTruong.gia[nl]; } }
    return { mua, chi };
  };
  let { mua, chi } = tinhMua();
  // thuê thêm thợ nếu công là nút thắt (Vừa / Khó)
  if (!tuyChon.khongThue && mucDo !== 'de' && cong <= 2 && tien > 600 && conNgay > 4 && p.tho.length < (mucDo === 'kho' ? 8 : 6)) kh.thue = 1;
  // Mô phỏng 24/11: cho thợ nghỉ làm máy Khó thua (đền bù + thiếu người hôm sau) → chỉ cho nghỉ khi thừa rất nhiều và sắp hết mùa
  if (!tuyChon.khongSaThai && mucDo === 'kho' && cong >= 20 && p.tho.length > 3 && conNgay > 3 && conNgay < 6) kh.saThai = 1;
  const chiKhac = (kh.thue || 0) * LUAT.phiThue + (kh.saThai || 0) * LUAT.denBuSaThai;
  // Quảng cáo chỉ khi lễ hội lớn và dư tiền (mô phỏng: quảng cáo thường xuyên bị lỗ)
  const quangCao = !tuyChon.khongQC && mucDo === 'kho' && sk.khach && (sk.khach._ ?? 100) >= 150 && tien > 1500 ? 20 : 0;
  if (quangCao) kh.quangCao = quangCao;
  // thiếu tiền: vay (Vừa / Khó), nếu không đủ thì làm ít lại
  let thieu = chi + chiKhac + quangCao + 40 - tien;
  if (thieu > 0 && mucDo !== 'de') { const v = Math.min(thieu, hanMucVay(st, p)); if (v > 0) { kh.vay = v; tien += v; thieu -= v; } }
  while (chi + chiKhac + quangCao > tien && Object.keys(can).length) {
    const b = Object.keys(can).pop(); can[b] = Math.floor(can[b] / 2); if (!can[b]) delete can[b];
    ({ mua, chi } = tinhMua());
  }
  // trả nợ khi dư dả
  const conLai = tien - chi - chiKhac - quangCao;
  if (p.no > 0 && !kh.vay && conLai > 900) kh.tra = Math.min(p.no, conLai - 700);

  kh.mua = mua; kh.lam = can;
  // nhận đơn tiệc nếu làm được
  if (sk.loai === 'donDat' && st.suKien.don && mucDo !== 'de') {
    const d = st.suKien.don;
    if (daMoKhoa(st, p, d.banh) && BANH[d.banh].cong * d.sl <= congTho(st, p) * 0.6) kh.nhanDon = true;
  }

  // --- 5. Bảo đảm kế hoạch hợp lệ (giảm dần nếu cần) ---
  for (let lan = 0; lan < 8; lan++) {
    if (kiemTraKeHoach(st, id, kh).ok) return kh;
    if (lan === 0) { delete kh.nangLo; delete kh.mayDanh; delete kh.chiNhanh; delete kh.nghienCuu; }
    else if (lan === 1) { delete kh.thue; delete kh.saThai; delete kh.quangCao; delete kh.tra; }
    else { for (const b of Object.keys(kh.lam)) kh.lam[b] = Math.floor(kh.lam[b] / 2); ({ mua: kh.mua } = (() => { const sv = { ...can }; Object.assign(can, kh.lam); const x = tinhMua(); Object.assign(can, sv); return x; })()); }
  }
  const tran = { gia: kh.gia };
  return kiemTraKeHoach(st, id, tran).ok ? tran : {};
}

export { giaNguyenLieu };
