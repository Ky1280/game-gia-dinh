// =====================================================================
// ĐẾ CHẾ TIỆM BÁNH — Đối thủ máy (Dễ / Vừa / Khó)
// Chỉ đọc thông tin công khai + tiệm của chính mình. Không dùng hạt giống của ván
// (dùng ngẫu nhiên riêng) để không làm thay đổi diễn biến của người thật.
// tuyChon (chỉ dùng khi mô phỏng cân bằng): { heSoGia, heSoLam, khongThue, khongDauTu }
// =====================================================================
import {
  BANH, MUA, NGUYEN_LIEU, LUAT, banhDangCo, daMoKhoa, congBanh, congTho, sucLo, hanMucVay,
  nhuCauDuKien, suKienHomNay, kiemTraKeHoach, laDN, nhuCauKhu,
  BANH_NC, BANH_DN, KHU, hopKhu, nhayKhu, trongSoKhu, coThoCa, DAU_TU_TN, soCuaHang, NHOM_KHACH,
  diemTraiNghiem, hutTraiNghiem, hutThemDN, heSoUyTin,
} from './engine.js';

// Máy chọn khu đặt tiệm: khu ít tiệm nhất, hoà thì khu đông khách hơn (dùng khi tạo ván có máy)
export function chonKhuMay(khuDaChon = [], seed = 0) {
  const ks = Object.keys(KHU);
  const dem = Object.fromEntries(ks.map((k) => [k, khuDaChon.filter((x) => x === k).length]));
  const it = Math.min(...ks.map((k) => dem[k]));
  const ung = ks.filter((k) => dem[k] === it).sort((a, b) => KHU[b].quyMo - KHU[a].quyMo || KHU[a].thue - KHU[b].thue);
  return ung[Math.abs(seed) % Math.min(2, ung.length)];
}

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
    if ((m.nghienCuu || laDN(st)) && !p.nghienCuu) {
      const dn = laDN(st);
      const diem = (b) => ((BANH[b].gia - giaNguyenLieu(st, b)) * BANH[b].nhuCau * (dn ? hopKhu(p.khu, b) : 100)) / BANH[b].cong;
      const ung = (dn ? [...BANH_NC, ...BANH_DN] : ['sukem', 'tart', 'banhkem'])
        .filter((b) => !p.moKhoa.includes(b) && (!BANH[b].canThoCa || coThoCa(p)) && (!dn || hopKhu(p.khu, b) >= 90))
        .sort((a, b) => diem(b) - diem(a))[0];
      if (ung && dn && mucDo === 'kho' && !tuyChon.khongDN && !tuyChon.dn?.khongMuaCT && tien > Math.floor((BANH[ung].phiNC * LUAT.heSoMuaCongThuc) / 100) + 1500 && conNgay > 12) {
        kh.muaCongThuc = ung; tien -= Math.floor((BANH[ung].phiNC * LUAT.heSoMuaCongThuc) / 100);
      } else if (ung && tien > BANH[ung].phiNC + (mucDo === 'kho' ? 500 : 800) && conNgay > 6) { kh.nghienCuu = ung; tien -= BANH[ung].phiNC; }
    }
    if (mucDo === 'kho') {
      if (!tuyChon.khongMay && !p.mayDanh && tien > 1100 && conNgay > 8 && p.moKhoa.some((b) => BANH[b].mayDanh)) { kh.mayDanh = true; tien -= LUAT.giaMayDanh; }
      if (!tuyChon.khongLo && p.lo < LUAT.lo.length && tien > LUAT.giaNangLo[p.lo] + 700 && conNgay > 8 && (p.homQua && Object.values(p.homQua.ban).reduce((s, x) => s + x, 0) >= sucLo(st, p) - 2)) { kh.nangLo = true; tien -= LUAT.giaNangLo[p.lo]; }
      if (!tuyChon.khongChiNhanh && !laDN(st) && m.chiNhanh && p.chiNhanh < 1 && tien > LUAT.giaChiNhanh + 900 && conNgay > 10) { kh.chiNhanh = true; tien -= LUAT.giaChiNhanh; }
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
      const tran = (laDN(st) ? 110 + Math.max(0, Math.floor((100 - nhayKhu(p.khu)) / 2)) : mucDo === 'kho' ? 108 : 110), san = 95;
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
  const heSoLam = tuyChon.heSoLam ?? (mucDo === 'de' ? 70 + Math.floor(r() * 70) : mucDo === 'kho' && !laDN(st) ? 100 : 95);
  for (const b of thuTu) {
    const giaHs = Math.max(20, 100 + Math.floor((BANH[b].nhay * (100 - Math.floor((kh.gia[b] * 100) / BANH[b].gia))) / 100));
    let du = Math.floor((nhuCauDuKien(st, b) * giaHs * heSoLam) / (song * 10000));
    if (laDN(st)) {        // Doanh nhân: dự báo theo khu của mình (cộng các cửa hàng) + học từ hôm qua
      du = 0;
      const tnDuKien = diemTraiNghiem(st, p, { lamTuoi: true });
      for (const k of [p.khu, ...p.cuaHang.map((c) => c.khu)]) {
        const n = st.nguoi.reduce((a, x) => a + (x.pha ? 0 : (x.khu === k ? 1 : 0) + x.cuaHang.filter((c) => c.khu === k).length), 0);
        const hs = Math.floor((Math.floor((hutTraiNghiem(k, tnDuKien) * hutThemDN(st, p, k)) / 100) * heSoUyTin(p)) / 100);
        du += Math.floor((nhuCauKhu(st, k, b, n) * giaHs * heSoLam * hs) / (n * 1000000));
      }
      if (mucDo !== 'de' && p.homQua?.ban?.[b]) du = Math.max(du, Math.floor((p.homQua.ban[b] * (p.homQua.thieuKhach > 0 ? 115 : 100)) / 100));
    }
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
  if (!tuyChon.khongThue && mucDo !== 'de' && cong <= 2 && tien > 600 && conNgay > 4 && p.tho.length < (mucDo === 'kho' && !laDN(st) ? 8 : 6)) kh.thue = 1;
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

  if (laDN(st) && mucDo !== 'de' && !tuyChon.khongDN) themDoanhNhan(st, p, kh, mucDo, tuyChon, conLai, conNgay, sk);

  // --- 5. Bảo đảm kế hoạch hợp lệ (giảm dần nếu cần) ---
  for (let lan = 0; lan < 8; lan++) {
    if (kiemTraKeHoach(st, id, kh).ok) return kh;
    if (lan === 0) { delete kh.nangLo; delete kh.mayDanh; delete kh.chiNhanh; delete kh.nghienCuu; for (const k of ['muaCongThuc', 'dauTuTN', 'daoTao', 'thueQuay', 'moCuaHang', 'chienDich', 'anThu', 'vayTheChap', 'gioVang']) delete kh[k]; }
    else if (lan === 1) { delete kh.thue; delete kh.saThai; delete kh.quangCao; delete kh.tra; }
    else { for (const b of Object.keys(kh.lam)) kh.lam[b] = Math.floor(kh.lam[b] / 2); ({ mua: kh.mua } = (() => { const sv = { ...can }; Object.assign(can, kh.lam); const x = tinhMua(); Object.assign(can, sv); return x; })()); }
  }
  const tran = { gia: kh.gia };
  return kiemTraKeHoach(st, id, tran).ok ? tran : {};
}

// Doanh nhân: máy Vừa dọn dẹp + giờ vàng khi thừa; máy Khó đầu tư thêm (thợ cả, trải nghiệm, quầy, cửa hàng, chiến dịch).
// tuyChon.dn (chỉ dùng khi mô phỏng): { gioVangMoiNgay, anThuMoiNgay, chienDichLienTuc, moChuoiSom, chiTN, khongDonDep }
function themDoanhNhan(st, p, kh, mucDo, tuyChon, conLai, conNgay, sk) {
  const v = tuyChon.dn || {};
  let du = conLai;                                      // tiền còn dư sau kế hoạch chính
  const chi = (x) => { if (du - x < 150) return false; du -= x; return true; };
  // trả trước các khoản vay sắp đến hạn (tránh mất tài sản thế chấp, tránh bị thu vay nóng)
  const tra = [];
  for (const k of p.khoanVay.slice().sort((x, y) => x.han - y.han)) if (k.han - st.ngay <= 2 && chi(k.goc)) tra.push({ id: k.id, so: k.goc });
  if (tra.length) kh.traKhoan = tra;
  if (!v.khongDonDep && chi(LUAT.phiDonDep)) kh.donDep = true;
  const bo = p.homQua?.bo || 0;
  if (v.gioVangMoiNgay) kh.gioVang = 40;
  else if (bo > 3 && (p.gioVangLienTiep || 0) < 2) kh.gioVang = 40;
  const w = trongSoKhu(p.khu);
  const nhomChinh = Object.entries(KHU[p.khu].tyLe).sort((a, b) => b[1] - a[1])[0][0];
  if ((mucDo === 'kho' && !v.khongTN) || v.chiTN) {
    // đầu tư trải nghiệm: món có (trọng số điểm chạm / giá) cao nhất, 1 món mỗi ngày
    const ung = Object.entries(DAU_TU_TN).filter(([ma]) => !p.tn[ma]).sort((a, b) => (w[b[1].diem] || 0) / b[1].gia - (w[a[1].diem] || 0) / a[1].gia)[0];
    if (ung && conNgay > 6 && (w[ung[1].diem] || 0) >= 20 && chi(ung[1].gia + 300)) { kh.dauTuTN = [ung[0]]; du += 300; }
    if (w.tai >= 25 && (p.quay || 0) < 1 && conNgay > 5 && chi(LUAT.phiQuay + 200)) { kh.thueQuay = 1; du += 200; }
  }
  if (mucDo === 'kho') {
    // đào tạo thợ cả khi tiệm đã khá (uy tín ≥ 350) và còn dài mùa
    if (!v.khongDaoTao && p.uyTin >= 350 && !coThoCa(p) && !p.tho.some((t) => t.hoc) && p.tho.filter((t) => t.cap === 2).length >= 3 && conNgay > 10 && chi(LUAT.phiDaoTaoThoCa + 600)) { kh.daoTao = 1; du += 600; }
    if (!v.khongCD && sk.khach && (sk.khach._ ?? 100) >= 130 && chi(LUAT.phiChienDich + 300)) { kh.chienDich = nhomChinh; du += 300; }
  }
  if (v.chienDichLienTuc && (!p.chienDich) && chi(LUAT.phiChienDich)) kh.chienDich = nhomChinh;
  // mở rộng khi xưởng đủ sức: lò đã nâng cấp và hôm qua thiếu hàng nhiều
  const xuongDu = p.lo >= 2 && (p.homQua?.thieuKhach || 0) > 10;
  if ((v.moChuoiSom || (mucDo === 'kho' && !v.khongChuoi && xuongDu && conNgay > 8 && du > 1500)) && soCuaHang(p) < (v.moChuoiSom ? 3 : 2)) {
    const daCo = [p.khu, ...p.cuaHang.map((c) => c.khu)];
    const k = Object.keys(KHU).filter((x) => !daCo.includes(x)).sort((a, b) => KHU[b].quyMo - KHU[a].quyMo || KHU[a].thue - KHU[b].thue)[0];
    if (k && chi(LUAT.cocThue)) kh.moCuaHang = { khu: k, cach: 'thue' };
  }
  if (v.anThuMoiNgay) { const b = Object.keys(kh.lam).sort((a, c) => kh.lam[c] - kh.lam[a])[0]; if (b && kh.lam[b] >= 12) kh.anThu = { banh: b, sl: 10 }; }
}

export { giaNguyenLieu };
