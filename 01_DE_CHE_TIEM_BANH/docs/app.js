// =====================================================================
// ĐẾ CHẾ TIỆM BÁNH — Giao diện (chuyền máy, nhiều người 1 máy)
// v0.4: 2 chế độ (Nhập môn / Doanh nhân), hồ sơ người chơi + tủ cúp, bài học, câu đố, cảnh báo
// =====================================================================
import * as E from './engine.js';
import { keHoachMay, chonKhuMay } from './doiThu.js';
import * as H from './hocChoi.js';
import { nenGiaoDien, daiMua } from './nen.js';
import { phat, datTat } from './amThanh.js';

const { BANH, NGUYEN_LIEU, MUA, LUAT, THOI_TIET, SU_KIEN, KHU, NHOM_KHACH, DAU_TU_TN, DIEM_CHAM } = E;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const so = (n) => n.toLocaleString('vi-VN');
const xu = (n) => `${so(n)} xu`;
const dau = (n) => (n > 0 ? '+' : n < 0 ? '−' : '') + so(Math.abs(n));
const saoTxt = (u) => { const s = Math.max(0, Math.min(5, E.sao(u))); return '★'.repeat(s) + '☆'.repeat(5 - s); };
const sao5 = (d) => { const s = Math.max(0, Math.min(5, Math.round(d / 10))); return '★'.repeat(s) + '☆'.repeat(5 - s); };
const PCOL = { A: ['#c4452f', '#3b7ea1', '#4c9a52', '#8a5cc4'], B: ['#ff5b93', '#4aa8ff', '#2fbf8f', '#b07cff'], C: ['#e8763a', '#5aa4c8', '#7fbf6a', '#c18cff'] };
const ICONS = ['👨', '👩', '🧒', '👧', '👴', '👵', '🐻', '🐱', '🐰', '🦊'];
const LOAI = { nguoi: '🙋 Người', de: '🤖 Máy Dễ', vua: '🤖 Máy Vừa', kho: '🤖 Máy Khó' };
const MUA_ICON = ['🎀', '🌧️', '🥮', '🎄', '🧧'];
const HUY_HIEU = { khongBo: '♻️ Không bỏ phí 3 ngày liền', namSao: '🌟 Giữ 5 sao 10 ngày', hetNo: '💰 Hết nợ cuối mùa' };
const CHE_DO = { nm: '🌱 Nhập môn', dn: '💼 Doanh nhân' };
const TEN_CAP_THO = { 1: '🧑‍🍳 Học việc', 2: '👩‍🍳 Lành nghề', 3: '🎖️ Thợ cả' };
const LS = { cd: 'dctb-caidat', van: 'dctb-van', mo: 'dctb-mo', hs: 'dctb-hoso' };

function doc(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }
function ghi(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch { /* bộ nhớ đầy hoặc bị chặn */ } }

let CD = Object.assign({ theme: 'A', tat: false, chuLon: false }, doc(LS.cd, {}));
let MO = doc(LS.mo, 1);
if (typeof MO === 'number') MO = { nm: Math.min(5, Math.max(1, MO)), dn: 1 };      // bản cũ chỉ lưu 1 số
MO = { nm: MO?.nm || 1, dn: MO?.dn || 1 };
let KHO = doc(LS.hs, null) || H.khoRong();
let G = doc(LS.van, null);
if (G && (!G.st || G.st.phienBan !== 1)) G = null;
const UI = { man: 'menu', dlg: null, luot: null, daCam: false, view: 'bang', tab: 'lam', kh: null, cfg: null, xn: null, hsMo: null, hsSua: null, cdTraLoi: null };
datTat(CD.tat);

const luu = () => ghi(LS.van, G);
const luuCD = () => { ghi(LS.cd, CD); datTat(CD.tat); };
const luuHS = () => ghi(LS.hs, KHO);
const luuMO = () => ghi(LS.mo, MO);
const soNguoi = () => G.st.nguoi.filter((p) => !p.may && !p.pha).length;
const mau = (id) => PCOL[CD.theme][id % 4];
const laDN = () => G?.st?.cheDo === 'dn';
const hoSoCua = (id) => KHO.hoSo.find((h) => h.id === G?.cfg?.ds?.[id]?.hoSo) || null;

function toast(t) {
  const d = document.createElement('div'); d.className = 'toast'; d.textContent = t;
  document.body.appendChild(d); setTimeout(() => d.remove(), 2600);
}

// ---------------- Tính toán hỗ trợ ----------------
const khoDung = (st, p, nl) => (p.kho[nl] || []).filter((l) => l.exp >= st.ngay).reduce((s, l) => s + l.q, 0);
const hangDung = (st, p, b) => (p.hang[b] || []).filter((l) => l.exp >= st.ngay).reduce((s, l) => s + l.q, 0);
const hanGanNhat = (st, lots) => { const x = (lots || []).filter((l) => l.exp >= st.ngay && l.q > 0).map((l) => l.exp); return x.length ? Math.min(...x) - st.ngay + 1 : null; };
function canNL(kh) {
  const c = {};
  for (const [b, sl] of Object.entries(kh.lam)) if (sl > 0) for (const [nl, q] of Object.entries(BANH[b].ct)) c[nl] = (c[nl] || 0) + q * sl;
  return c;
}
const giaNL = (st, p, nl) => (E.giaMuaNL ? E.giaMuaNL(st, p, nl) : st.thiTruong.gia[nl]);
function chiMua(st, p, kh) { return Object.entries(kh.mua).reduce((s, [nl, q]) => s + q * giaNL(st, p, nl), 0); }
function khRong(st, p) {
  const gia = {};
  for (const b of E.banhDangCo(st)) if (E.daMoKhoa(st, p, b)) gia[b] = p.giaBan[b] ?? BANH[b].gia;
  return {
    vay: 0, tra: 0, thue: 0, saThai: 0, quangCao: 0, mua: {}, lam: {}, gia, nghienCuu: null, nangLo: false, mayDanh: false, chiNhanh: false, nhanDon: false,
    // Doanh nhân
    thueCap: { 1: 0, 2: 0, 3: 0 }, daoTao: 0, thueQuay: 0, nghiQuay: 0, daoTaoQuay: 0, dauTuTN: [], donDep: !!st.cheDo && st.cheDo === 'dn', khaoSat: false, baoBi: false,
    muaCongThuc: null, vayNong: 0, theChapTS: null, theChapSo: 0, traKhoan: {}, giaHan: [], goiVon: 0, guiTK: 0, rutTK: 0,
    muaXe: false, gopTraiGa: false, muaMatBang: false, cuaHangKhu: null, cuaHangCach: 'thue', chienDich: null, anThuBanh: null, anThuSl: 0, gioVang: 0,
  };
}
function sach(kh, dn) {
  const o = { mua: {}, lam: {}, gia: { ...kh.gia } };
  for (const [k, v] of Object.entries(kh.mua)) if (v > 0) o.mua[k] = v;
  for (const [k, v] of Object.entries(kh.lam)) if (v > 0) o.lam[k] = v;
  for (const k of ['vay', 'tra', 'saThai', 'quangCao']) if (kh[k] > 0) o[k] = kh[k];
  if (!dn && kh.thue > 0) o.thue = kh.thue;
  if (kh.nghienCuu) o.nghienCuu = kh.nghienCuu;
  for (const k of ['nangLo', 'mayDanh', 'chiNhanh', 'nhanDon']) if (kh[k]) o[k] = true;
  if (!dn) return o;
  const tc = Object.fromEntries(Object.entries(kh.thueCap).filter(([, v]) => v > 0)); if (Object.keys(tc).length) o.thueCap = tc;
  for (const k of ['daoTao', 'thueQuay', 'nghiQuay', 'daoTaoQuay', 'vayNong', 'goiVon', 'guiTK', 'rutTK', 'gioVang']) if (kh[k] > 0) o[k] = kh[k];
  for (const k of ['donDep', 'khaoSat', 'baoBi', 'muaXe', 'gopTraiGa', 'muaMatBang']) if (kh[k]) o[k] = true;
  if (kh.dauTuTN.length) o.dauTuTN = [...kh.dauTuTN];
  if (kh.muaCongThuc) o.muaCongThuc = kh.muaCongThuc;
  if (kh.theChapTS && kh.theChapSo > 0) o.vayTheChap = { taiSan: kh.theChapTS, so: kh.theChapSo };
  const tk = Object.entries(kh.traKhoan).filter(([, v]) => v > 0).map(([id, v]) => ({ id: Number(id), so: v })); if (tk.length) o.traKhoan = tk;
  if (kh.giaHan.length) o.giaHan = [...kh.giaHan];
  if (kh.cuaHangKhu) o.moCuaHang = { khu: kh.cuaHangKhu, cach: kh.cuaHangCach };
  if (kh.chienDich) o.chienDich = kh.chienDich;
  if (kh.anThuBanh && kh.anThuSl) o.anThu = { banh: kh.anThuBanh, sl: kh.anThuSl };
  return o;
}
function khTuMay(st, p, k) {          // đổi kế hoạch máy gợi ý sang dạng ô nhập
  const kh = khRong(st, p);
  Object.assign(kh, { vay: k.vay || 0, tra: k.tra || 0, saThai: k.saThai || 0, quangCao: k.quangCao || 0, mua: { ...(k.mua || {}) }, lam: { ...(k.lam || {}) },
    nghienCuu: k.nghienCuu || null, nangLo: !!k.nangLo, mayDanh: !!k.mayDanh, chiNhanh: !!k.chiNhanh, nhanDon: !!k.nhanDon });
  Object.assign(kh.gia, k.gia || {});
  if (st.cheDo === 'dn') {
    kh.thueCap = { 1: 0, 2: k.thue || 0, 3: 0, ...(k.thueCap || {}) };
    Object.assign(kh, { daoTao: k.daoTao || 0, thueQuay: k.thueQuay || 0, dauTuTN: k.dauTuTN || [], donDep: !!k.donDep, gioVang: k.gioVang || 0,
      muaCongThuc: k.muaCongThuc || null, chienDich: k.chienDich || null });
    for (const t of k.traKhoan || []) kh.traKhoan[t.id] = t.so;
    if (k.moCuaHang) { kh.cuaHangKhu = k.moCuaHang.khu; kh.cuaHangCach = k.moCuaHang.cach; }
  } else kh.thue = k.thue || 0;
  if (![0, 10, 20, 40, 60].includes(kh.quangCao)) kh.quangCao = kh.quangCao ? 20 : 0;
  return kh;
}
// Thử áp kế hoạch: trả về { ok, loi, tienSau }
function thuKeHoach(st, id, kh) {
  try { const s2 = E.nopKeHoach(st, id, sach(kh, st.cheDo === 'dn')); return { ok: true, tienSau: s2.nguoi[id].tien }; }
  catch (e) { return { ok: false, loi: e.message }; }
}

// ---------------- Luồng ván ----------------
function ghiSoLieuSang() { G.soLieu = Object.fromEntries(G.st.nguoi.map((p) => [p.id, { tien: p.tien, no: p.no, chiMua: 0 }])); }
function batDauVan(cfg) {
  if (G && !G.st.ketThuc) { KHO = H.ghiBoVan(KHO, G.st, ganHoSo(G)); luuHS(); }     // bỏ ván đang dở
  const kt = H.kiemTraTaoVan(KHO, cfg.ds.map((x) => (x.loai === 'nguoi' ? x.hoSo || null : null)), Date.now(), cfg.cheDo);
  const st = E.taoVan({ seed: (Date.now() % 2147483647) | 0, mua: cfg.mua, cheDo: cfg.cheDo,
    nguoiChoi: cfg.ds.map((x) => ({ ten: x.ten.trim() || 'Tiệm bánh', icon: x.icon, may: x.loai === 'nguoi' ? null : x.loai, ...(cfg.cheDo === 'dn' ? { khu: x.khu } : {}) })) });
  G = { st, buoc: 'sang', cfg: JSON.parse(JSON.stringify(cfg)), khongTinhCup: kt.khongTinhCup,
    chuoi: Object.fromEntries(st.nguoi.map((p) => [p.id, [E.giaTriTiem(st, p)]])), gap: Object.fromEntries(st.nguoi.map((p) => [p.id, []])), daDo: {}, canhBao: {}, baiHocToi: {} };
  ghiSoLieuSang(); luu();
  UI.man = 'game'; UI.luot = null;
}
const ganHoSo = (g) => Object.fromEntries((g.cfg?.ds || []).map((x, i) => [i, x.loai === 'nguoi' ? x.hoSo || null : null]));
function tiepTheoLuot() {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  let st = G.st;
  for (;;) {
    const ds = E.choNop(st);
    if (!ds.length) { ketThucNgayUI(st); return; }
    const id = ds[0], p = st.nguoi[id];
    if (p.may) {
      try { st = E.nopKeHoach(st, id, keHoachMay(st, id, p.may)); } catch { st = E.nopKeHoach(st, id, {}); }
      continue;
    }
    G.st = st; UI.luot = id; UI.daCam = soNguoi() <= 1; UI.view = 'bang'; UI.tab = 'lam'; UI.kh = khRong(st, p); luu(); window.scrollTo(0, 0); return;
  }
}
function ketThucNgayUI(stTruoc) {
  G.soLieuToi = G.soLieu;
  const st = E.ketThucNgay(stTruoc);
  G.st = st; G.buoc = 'toi'; UI.luot = null; G.baiHocToi = {};
  for (const p of st.nguoi) {
    (G.chuoi[p.id] ||= []).push(E.giaTriTiem(st, p));
    const cb = H.canhBaoTiem(st, p.id, G.chuoi[p.id], { soKhoanVay: E.soKhoanVay ? E.soKhoanVay(p) : 0 });
    G.canhBao[p.id] = cb;
    if (cb.muc === 'do') G.daDo[p.id] = true;
    if (p.may) continue;
    const hs = hoSoCua(p.id);
    const b = H.baiHocHomNay(stTruoc, st, p.id, { daGap: hs?.baiHoc || [], daGapTrongMua: G.gap[p.id] || [], canhBao: cb, cheDo: st.cheDo });
    if (b) { G.baiHocToi[p.id] = b; (G.gap[p.id] ||= []).push(b); if (hs) { KHO = H.ghiBaiHoc(KHO, hs.id, b); luuHS(); } }
  }
  luu(); phat('ngay'); window.scrollTo(0, 0);
}
function xongLuot() {
  const st = G.st, id = UI.luot;
  try { G.st = E.nopKeHoach(st, id, sach(UI.kh, st.cheDo === 'dn')); } catch (e) { phat('loi'); toast(e.message); return; }
  G.soLieu[id].chiMua = chiMua(st, st.nguoi[id], UI.kh);
  phat('tien'); tiepTheoLuot();
}
function ngayMoi() {
  if (G.st.ketThuc) {
    G.buoc = 'het';
    const nguoi = G.st.nguoi.filter((p) => !p.may && hoSoCua(p.id));
    if (!G.cauDo && nguoi.length && !G.khongTinhCup) {
      G.cauDo = Object.fromEntries(nguoi.map((p) => [p.id, H.taoCauDo(G.gap[p.id] || [], G.st.seed + p.id, G.st.cheDo)]));
      G.traLoi = {}; G.cauDoLuot = nguoi.map((p) => p.id);
    }
    if (!G.cauDoLuot?.length) traoCup();
  } else { G.buoc = 'sang'; ghiSoLieuSang(); }
  luu(); window.scrollTo(0, 0);
}
function traoCup() {
  if (G.daTrao) return;
  const cd = G.st.cheDo || 'nm';
  if (!G.daMo) { G.daMo = true; if (G.st.mua === MO[cd] && MO[cd] < 5) { MO[cd] += 1; luuMO(); } }
  const cauDoDung = Object.fromEntries(Object.entries(G.cauDo || {}).map(([id, ds]) => [id, H.chamCauDo(ds, G.traLoi[id] || [])]));
  const r = H.traoCupCuoiMua(KHO, G.st, { ganHoSo: ganHoSo(G), cheDo: cd, khongTinhCup: G.khongTinhCup, daDo: G.daDo, cauDoDung, thongTinDN: cd === 'dn' ? H.thongTinDN(G.st) : {} });
  KHO = r.kho; luuHS(); G.ketQuaCup = r.ketQua; G.daTrao = true;
  phat('thang');
}

// ---------------- Mảnh giao diện chung ----------------
function thanhTren(tieuDe, veMenu = true) {
  return `<div class="top">${veMenu ? '<button data-a="veMenu" aria-label="Về menu">🏠</button>' : '<button data-a="veMenu" aria-label="Quay lại">←</button>'}
  <div class="t">${tieuDe}</div><button data-a="am" aria-label="Âm thanh">${CD.tat ? '🔇' : '🔊'}</button><button data-a="cd" aria-label="Cài đặt">⚙️</button></div>`;
}
const dai = (mua, chu) => `<div class="strip full" style="background-image:${daiMua(CD.theme, mua)}"><span>${chu}</span></div>`;
const buocSo = (path, val, { x5 = false } = {}) => `<div class="step">${x5 ? `<button class="x5" data-a="so" data-p="${path}" data-d="-5">−5</button>` : ''}<button data-a="so" data-p="${path}" data-d="-1">−</button><span>${val}</span><button data-a="so" data-p="${path}" data-d="1">+</button>${x5 ? `<button class="x5" data-a="so" data-p="${path}" data-d="5">+5</button>` : ''}</div>`;
const nutItem = (...a) => `<span class="opt" style="margin:0;flex:none">${nutChon(...a)}</span>`;
const nutChon = (p, v, on, chu, extra = '') => `<button data-a="chon" data-p="${p}" data-v="${v}" class="${on ? 'on' : ''}" ${extra}>${chu}</button>`;
const tieuDeNgay = (st) => `${MUA_ICON[st.mua - 1]} ${MUA[st.mua - 1].ten} · Ngày ${Math.min(st.ngay, MUA[st.mua - 1].ngay)}/${MUA[st.mua - 1].ngay}${st.cheDo === 'dn' ? ' · 💼' : ''}`;
function bangXepHang(st, cuoi = false) {
  return E.xepHang(st, cuoi).map((x, k) => {
    const p = st.nguoi[x.id];
    return `<div class="r"><span class="no" style="background:${mau(x.id)}">${x.pha ? '✖' : k + 1}</span><span class="nm">${p.icon} ${esc(p.ten)}${p.may ? ' <small>🤖</small>' : ''}</span><span class="star">${saoTxt(p.uyTin)}</span><span class="v">${x.pha ? 'Tạm đóng' : so(x.giaTri)}</span></div>`;
  }).join('');
}
function theCanhBao(id) {
  const cb = G?.canhBao?.[id]; if (!cb?.muc) return '';
  return `<div class="card cb ${cb.muc}"><div class="lbl">${cb.muc === 'do' ? '🔴 Cảnh báo đỏ' : '🟡 Cảnh báo'}</div><p class="note">${cb.ly.map(esc).join(' · ')}.${cb.muc === 'do' ? ' Hãy xem lại giá, số bánh làm và phiếu trải nghiệm khách.' : ''}</p></div>`;
}
function theBaiHoc(ma, tenTiem = '') {
  const b = H.BAI_HOC[ma]; if (!b) return '';
  return `<div class="card hoc"><div class="lbl">💡 Bài học${tenTiem ? ' cho ' + tenTiem : ''}</div><p class="note"><span style="font-size:1.3rem">${b.icon}</span> ${esc(b.noiDung)}</p></div>`;
}
function thePhieu(tn, seed) {
  const f = H.phieuTraiNghiem(tn, seed); if (!f) return '';
  return `<div class="tn5">${Object.entries(DIEM_CHAM).map(([k, t]) => `<div class="${k === f.yeu ? 'yeu' : ''}"><span>${t}</span><b class="star">${sao5(tn[k])}</b></div>`).join('')}</div>
   ${f.noi.length ? `<p class="note" style="margin-top:6px">${f.noi.map((x) => '💬 ' + esc(x)).join('<br>')}</p>` : ''}`;
}

// ---------------- Màn: Menu ----------------
function manMenu() {
  const coVan = G && G.buoc !== 'het';
  const cd = coVan ? G.st.cheDo || 'nm' : 'nm';
  const muaHien = coVan ? G.st.mua : MO.nm;
  return `<div class="menu">
   <div class="title"><div class="logo">🥐</div><h1>Đế chế<br>Tiệm Bánh</h1><div class="tag">Học mà chơi, chơi mà học</div></div>
   ${dai(muaHien, `${MUA_ICON[muaHien - 1]} ${MUA[muaHien - 1].ten}`)}
   <div style="margin-bottom:auto"></div>
   <div class="seasons">${MUA.map((m, i) => `<div class="${i + 1 > MO[cd] ? 'khoa' : ''}"><b>${i + 1 > MO[cd] ? '🔒' : MUA_ICON[i]}</b>${m.ten}</div>`).join('')}</div>
   ${coVan ? `<button class="btn" data-a="tiep">▶ Chơi tiếp · ${CHE_DO[cd]} · Mùa ${G.st.mua}, ngày ${G.st.ngay}</button>` : ''}
   <button class="btn ${coVan ? 'alt' : ''}" data-a="moi">＋ Ván mới</button>
   <button class="btn ghost" data-a="hoSo">🏆 Hồ sơ & Tủ cúp</button>
   <div class="g2" style="width:100%"><button class="btn ghost" data-a="hd">📖 Hướng dẫn</button><button class="btn ghost" data-a="cd">⚙️ Cài đặt</button></div>
  </div>`;
}

// ---------------- Màn: Hồ sơ & Tủ cúp ----------------
function manHoSo() {
  const mo = UI.hsMo && KHO.hoSo.find((h) => h.id === UI.hsMo);
  if (mo) {
    const cap = H.capNguoiChoi(mo.diem), sau = H.CAP_NGUOI_CHOI.find((c) => c.tu > mo.diem);
    const nhom = {}; for (const c of mo.cup) nhom[c.ma] = (nhom[c.ma] || 0) + 1;
    return `${thanhTren('🏆 Tủ cúp', false)}<div class="scr cot2">
     <div class="card full" style="text-align:center"><div style="font-size:2.6rem">${mo.icon}</div><h3>${esc(mo.ten)}</h3>
      <p class="note">${cap.icon} <b>${cap.ten}</b> · ${mo.diem} điểm${sau ? ` · còn ${sau.tu - mo.diem} điểm lên ${sau.icon} ${sau.ten}` : ''}</p>
      <p class="note mute">${H.duocChoiDoanhNhan(mo) ? '💼 Đã mở chế độ Doanh nhân' : '🔒 Thắng 1 mùa Nhập môn để mở Doanh nhân'}</p></div>
     <div class="card"><div class="lbl">Cúp đã đạt (${mo.cup.length})</div>${mo.cup.length ? `<div class="cups">${Object.entries(nhom).map(([ma, n]) => `<div><span>${H.CUP[ma].icon}</span><b>${H.CUP[ma].ten}</b>${n > 1 ? `<small>×${n}</small>` : ''}</div>`).join('')}</div>` : '<p class="note mute">Chưa có cúp. Chơi hết một mùa để nhận cúp nhé!</p>'}
      <p class="note" style="margin-top:6px">Kỷ lục tài sản: 🌱 ${mo.kyLuc.nm != null ? xu(mo.kyLuc.nm) : '—'} · 💼 ${mo.kyLuc.dn != null ? xu(mo.kyLuc.dn) : '—'}</p></div>
     <div class="card"><div class="lbl">📒 Sổ bài học (${mo.baiHoc.length}/30)</div>${mo.baiHoc.length ? mo.baiHoc.map((m) => `<p class="note">${H.BAI_HOC[m].icon} ${esc(H.BAI_HOC[m].noiDung)}</p>`).join('') : '<p class="note mute">Bài học sẽ hiện ra khi chơi.</p>'}</div>
     <div class="card full"><div class="g2"><button class="btn ghost sm" data-a="hsSua" data-v="${mo.id}">✏️ Đổi tên</button><button class="btn alt sm" data-a="hsXoa" data-v="${mo.id}">🗑️ Xoá hồ sơ</button></div>
      ${H.duocChoiDoanhNhan(mo) ? '' : `<button class="btn ghost sm" style="margin-top:7px" data-a="hsMoDN" data-v="${mo.id}">🔑 Người lớn mở khoá Doanh nhân</button>`}</div>
    </div><div class="act"><button class="btn" data-a="hsDong">← Danh sách hồ sơ</button></div>`;
  }
  return `${thanhTren('🏆 Hồ sơ & Tủ cúp', false)}<div class="scr">
   <p class="note mute" style="margin:0 4px 8px">Mỗi người trong nhà có 1 hồ sơ. Cúp, kỷ lục và bài học được lưu trên máy này.</p>
   ${KHO.hoSo.map((h) => { const c = H.capNguoiChoi(h.diem); return `<button class="pl hsRow" data-a="hsXem" data-v="${h.id}"><span style="font-size:1.6rem">${h.icon}</span><span class="sp"><b>${esc(h.ten)}</b><small>${c.icon} ${c.ten} · ${h.cup.length} cúp · ${h.baiHoc.length} bài học</small></span><span>›</span></button>`; }).join('')}
   ${UI.hsSua ? '' : `<div class="card"><div class="lbl">Tạo hồ sơ mới</div><div class="row" style="margin-top:6px"><input id="hsTen" maxlength="18" placeholder="Tên người chơi" style="flex:1;min-width:0;border-radius:10px;padding:9px 10px;border:1px solid #0003"><button class="btn sm" style="width:auto" data-a="hsTao">＋ Tạo</button></div>
    <div class="icons">${ICONS.map((ic) => `<button data-a="hsIcon" data-v="${ic}" class="${(UI.hsIcon || '👨') === ic ? 'on' : ''}">${ic}</button>`).join('')}</div></div>`}
  </div>`;
}

// ---------------- Màn: Ván mới ----------------
function cfgMacDinh() {
  const cu = G?.cfg;
  if (cu) { const c = JSON.parse(JSON.stringify(cu)); c.cheDo ||= 'nm'; c.mua = Math.min(c.mua, MO[c.cheDo]); c.ds.forEach((x, i) => { x.khu ||= 'danCu'; if (x.hoSo && !KHO.hoSo.some((h) => h.id === x.hoSo)) x.hoSo = null; }); return c; }
  const h0 = KHO.hoSo[0];
  return { cheDo: 'nm', mua: MO.nm, ds: [{ ten: 'Tiệm Bánh Nắng', icon: h0?.icon || '👨', loai: 'nguoi', hoSo: h0?.id || null, khu: 'truong' }, { ten: 'Tiệm Gấu Nâu', icon: '🐻', loai: 'vua', hoSo: null, khu: 'danCu' }] };
}
function manMoi() {
  const c = UI.cfg, dn = c.cheDo === 'dn';
  const nguoi = c.ds.filter((x) => x.loai === 'nguoi').length;
  const kt = H.kiemTraTaoVan(KHO, c.ds.map((x) => (x.loai === 'nguoi' ? x.hoSo || null : null)), Date.now(), c.cheDo);
  const khachDN = dn && c.ds.some((x) => x.loai === 'nguoi' && !x.hoSo);
  const chan = !nguoi || kt.chan || khachDN;
  return `${thanhTren('Ván mới', false)}<div class="scr">
   <div class="card"><div class="lbl">Chế độ</div><div class="opt">${Object.entries(CHE_DO).map(([k, t]) => nutChon('cfgCheDo', k, c.cheDo === k, t)).join('')}</div>
    <p class="note mute" style="margin-top:6px">${dn ? 'Đủ 8 nhóm tính năng: 4 khu, nhóm khách, thợ 3 cấp, trải nghiệm khách, vay vốn, chuỗi cửa hàng…' : 'Luật cơ bản, có bài học và câu đố. Thắng 1 mùa để mở Doanh nhân.'}</p></div>
   <div class="card"><div class="lbl">Chọn mùa</div><div class="opt">${MUA.map((m, i) => `<button data-a="chonMua" data-v="${i + 1}" class="${c.mua === i + 1 ? 'on' : ''}" ${i + 1 > MO[c.cheDo] ? 'disabled' : ''}>${i + 1 > MO[c.cheDo] ? '🔒' : MUA_ICON[i]} ${i + 1}. ${m.ten}</button>`).join('')}</div>
    <p class="note mute" style="margin-top:6px">${MUA[c.mua - 1].ngay} ngày. Chơi xong một mùa thì mở khoá mùa sau.</p></div>
   <div class="lbl" style="margin:4px 2px 6px">Các tiệm (2–4 tiệm, ít nhất 1 người thật)</div>
   ${c.ds.map((x, i) => `<div class="pl" style="border-left:6px solid ${mau(i)}">
     <div class="row"><span style="font-size:1.5rem">${x.icon}</span><input maxlength="18" data-ten="${i}" value="${esc(x.ten)}" placeholder="Tên tiệm" aria-label="Tên tiệm ${i + 1}">
     ${c.ds.length > 2 ? `<button class="btn ghost sm" style="width:auto" data-a="xoaNg" data-i="${i}">✕</button>` : ''}</div>
     <div class="icons">${ICONS.map((ic) => `<button data-a="icon" data-i="${i}" data-v="${ic}" class="${x.icon === ic ? 'on' : ''}">${ic}</button>`).join('')}</div>
     <div class="opt">${Object.entries(LOAI).map(([k, t]) => `<button data-a="loai" data-i="${i}" data-v="${k}" class="${x.loai === k ? 'on' : ''}">${t}</button>`).join('')}</div>
     ${x.loai === 'nguoi' ? `<div class="lbl" style="margin-top:7px">Chủ tiệm (hồ sơ)</div><div class="opt">${KHO.hoSo.map((h) => `<button data-a="ganHS" data-i="${i}" data-v="${h.id}" class="${x.hoSo === h.id ? 'on' : ''}">${h.icon} ${esc(h.ten)}</button>`).join('')}<button data-a="ganHS" data-i="${i}" data-v="" class="${!x.hoSo ? 'on' : ''}">👤 Khách</button></div>` : ''}
     ${dn ? `<div class="lbl" style="margin-top:7px">Khu đặt tiệm${x.loai !== 'nguoi' ? ' (máy tự chọn nếu để trống)' : ''}</div><div class="opt">${Object.entries(KHU).map(([k, z]) => `<button data-a="ganKhu" data-i="${i}" data-v="${k}" class="${x.khu === k ? 'on' : ''}">${z.icon} ${z.ten}</button>`).join('')}</div>` : ''}
    </div>`).join('')}
   ${c.ds.length < 4 ? '<button class="btn ghost" data-a="themNg">＋ Thêm tiệm</button>' : ''}
   ${KHO.hoSo.length ? '' : '<p class="note mute" style="margin:8px 4px">Mẹo: tạo hồ sơ ở menu "Hồ sơ & Tủ cúp" để lưu cúp và bài học.</p>'}
   ${kt.canhBao.map((x) => `<div class="card cb ${x.chan ? 'do' : 'vang'}"><p class="note">${x.chan ? '🔒' : '⚠️'} ${esc(x.noiDung)}</p></div>`).join('')}
   ${khachDN ? '<div class="card cb do"><p class="note">🔒 Chế độ Doanh nhân cần chọn hồ sơ cho mọi người chơi.</p></div>' : ''}
  </div><div class="act">${nguoi ? '' : '<div class="msg warn">Cần ít nhất 1 người thật chơi</div>'}<button class="btn" data-a="batDau" ${chan ? 'disabled' : ''}>Mở cửa tiệm! ▶</button></div>`;
}

// ---------------- Màn: Buổi sáng ----------------
function theSuKien(st) {
  const sk = E.suKienHomNay(st);
  let them = '';
  if (sk.loai === 'hongLo' || sk.loai === 'omTho') { const p = st.nguoi[st.suKien.may]; if (p) them = `<br>Tiệm bị ảnh hưởng: <b>${p.icon} ${esc(p.ten)}</b>`; }
  if (st.suKien.don) { const d = st.suKien.don; them = `<br>Đơn: <b>${d.sl} ${BANH[d.banh].icon} ${BANH[d.banh].ten}</b>, giao ngày ${d.han}, giá ${d.gia} xu/cái. Ai nhận ở thẻ Tiệm.`; }
  return `<div class="card ev"><div class="lbl">🎴 Sự kiện hôm nay</div><h4>${sk.icon} ${sk.ten}</h4><p>${sk.moTa}${them}</p></div>`;
}
function manSang() {
  const st = G.st, tt = THOI_TIET[st.thoiTiet];
  const gia = Object.entries(NGUYEN_LIEU).map(([k, n]) => {
    const g = st.thiTruong.gia[k];
    const mui = g > n.gia ? '<span class="neg">▲</span>' : g < n.gia ? '<span class="pos">▼</span>' : '';
    return `<div>${n.icon}<b>${g} ${mui}</b>${n.ten}</div>`;
  }).join('');
  return `${thanhTren(tieuDeNgay(st))}<div class="scr cot2">
   <div class="hd full"><h3>☀️ Buổi sáng</h3><span class="chip" style="background:${mau(1)}">Cả nhà cùng xem</span></div>
   ${dai(st.mua, `${MUA_ICON[st.mua - 1]} ${MUA[st.mua - 1].ten}`)}
   <div class="card"><div class="lbl">Thời tiết</div><div class="big">${tt.icon} ${tt.ten}</div><p class="note">Khách ra phố ${tt.khach}% so với ngày thường.</p></div>
   ${theSuKien(st)}
   <div class="card"><div class="lbl">Giá chợ hôm nay (xu/phần)</div><div class="stock">${gia}</div></div>
   <div class="card"><div class="lbl">🏆 Xếp hạng giá trị tiệm</div>${bangXepHang(st)}</div>
  </div><div class="act"><button class="btn" data-a="batDauKH">Bắt đầu lập kế hoạch →</button></div>`;
}

// ---------------- Màn: Bảng tiệm ----------------
function manBang() {
  const st = G.st, p = st.nguoi[UI.luot], dn = laDN();
  const kho = Object.keys(NGUYEN_LIEU).filter((nl) => khoDung(st, p, nl) > 0).map((nl) => {
    const h = hanGanNhat(st, p.kho[nl]);
    return `<div>${NGUYEN_LIEU[nl].icon}<b>${khoDung(st, p, nl)}</b>${h <= 1 ? '<span class="warn">hết hạn hôm nay!</span>' : `còn ${h} ngày`}</div>`;
  }).join('');
  const hang = Object.keys(BANH).filter((b) => hangDung(st, p, b) > 0).map((b) => {
    const h = hanGanNhat(st, p.hang[b]);
    return `<div>${BANH[b].icon}<b>${hangDung(st, p, b)}</b>${h <= 1 ? '<span class="warn">bán hôm nay</span>' : `còn ${h} ngày`}</div>`;
  }).join('');
  const don = st.donDat.filter((d) => d.nguoi === p.id).map((d) => `<li>Giao <b>${d.sl} ${BANH[d.banh].ten}</b> ngày ${d.han} (thiếu bị phạt)</li>`).join('');
  const thoTxt = dn ? Object.entries(TEN_CAP_THO).map(([c, t]) => { const n = p.tho.filter((x) => x.cap === +c).length; return n ? `${t} ×${n}` : ''; }).filter(Boolean).join(' · ') : '';
  const dnHtml = dn ? `
   <div class="card"><div class="lbl">🗺️ Cửa hàng</div><p class="note">${KHU[p.khu].icon} <b>${KHU[p.khu].ten}</b> (tiệm chính${p.matBangChinh ? ', mặt bằng của mình' : ', thuê'})${p.cuaHang.map((c) => `<br>${KHU[c.khu].icon} ${KHU[c.khu].ten} (${c.so === 'mua' ? 'mặt bằng của mình' : 'thuê'})`).join('')}</p>
    <p class="note mute" style="margin-top:4px">Thợ: ${thoTxt}${p.tho.some((t) => t.hoc) ? ' · 1 người đang đi học' : ''} · Quầy: ${p.quay || 0} người${p.lePhep ? ` (${p.lePhep} đã học lễ phép)` : ''}</p></div>
   <div class="card"><div class="lbl">💰 Vốn & đầu tư</div><p class="note">Tài sản ròng: <b>${xu(E.giaTriTiem(st, p))}</b>${p.tietKiem ? ` · Tiết kiệm ${xu(p.tietKiem)}` : ''}${p.gopVon ? ` · Vốn góp ${xu(p.gopVon)}` : ''}
    ${p.dauTu.xe ? ' · 🛵 Xe giao hàng' : ''}${p.dauTu.traiGa ? ' · 🐔 Trại gà' : ''}</p>
    ${p.khoanVay.length ? `<ul class="note" style="margin:4px 0 0 18px">${p.khoanVay.map((k) => `<li>${k.loai === 'nong' ? '⚡ Vay nóng' : '🏠 Thế chấp'} ${xu(k.goc)}, lãi ${k.lai / 10}%/ngày, hạn <b class="${k.han - st.ngay <= 1 ? 'warn' : ''}">ngày ${k.han}</b></li>`).join('')}</ul>` : ''}</div>
   ${p.homQua?.traiNghiem ? `<div class="card"><div class="lbl">📋 Khách nói gì hôm qua</div>${thePhieu(p.homQua.traiNghiem, st.ngay)}</div>` : ''}` : '';
  return `${thanhTren(tieuDeNgay(st))}<div class="scr cot2">
   <div class="hd full"><h3>${p.icon} ${esc(p.ten)}</h3><span class="chip" style="background:${mau(p.id)}">Lượt của bạn</span></div>
   ${dai(st.mua, `${MUA_ICON[st.mua - 1]} ${MUA[st.mua - 1].ten} · Ngày ${st.ngay}`)}
   ${theCanhBao(p.id)}
   <div class="card"><div class="lbl">Tiền mặt</div><div class="big ${p.tien < 0 ? 'neg' : ''}">${xu(p.tien)}</div>
    <div class="g3"><div class="mini"><span class="lbl">Uy tín</span><b class="star">${saoTxt(p.uyTin)}</b></div><div class="mini"><span class="lbl">Nợ NH</span><b>${so(p.no)}</b></div><div class="mini"><span class="lbl">Thợ · công</span><b>${p.tho.length} · ${E.congTho(st, p)}</b></div></div>
    <div class="g3"><div class="mini"><span class="lbl">Lò</span><b>Cấp ${p.lo} · ${E.sucLo(st, p)}</b></div><div class="mini"><span class="lbl">Máy đánh</span><b>${p.mayDanh ? 'Có' : 'Chưa'}</b></div><div class="mini"><span class="lbl">${dn ? 'Cửa hàng' : 'Chi nhánh'}</span><b>${dn ? E.soCuaHang(p) : p.chiNhanh}</b></div></div>
    ${p.tien < 0 ? '<p class="note warn" style="margin-top:6px">Tiền đang âm! Âm 2 ngày liền mà không vay thêm được thì tiệm phải tạm đóng.</p>' : ''}</div>
   ${theSuKien(st)}
   ${dnHtml}
   <div class="card"><div class="lbl">Kho nguyên liệu</div>${kho ? `<div class="stock">${kho}</div>` : '<p class="note mute">Kho trống, nhớ mua nguyên liệu.</p>'}</div>
   <div class="card"><div class="lbl">Bánh còn bán được</div>${hang ? `<div class="stock">${hang}</div>` : '<p class="note mute">Chưa có bánh tồn.</p>'}
    ${p.nghienCuu ? `<p class="note" style="margin-top:6px">🔬 Đang nghiên cứu ${BANH[p.nghienCuu.banh].ten}, còn ${p.nghienCuu.con} ngày.</p>` : ''}
    ${don ? `<ul class="note" style="margin:6px 0 0 18px">${don}</ul>` : ''}
    ${p.huyHieu.length ? `<p class="note" style="margin-top:6px">${p.huyHieu.map((h) => HUY_HIEU[h]).join(' · ')}</p>` : ''}</div>
  </div><div class="act">${dn ? '<div class="g2"><button class="btn ghost" data-a="thiTruong">📊 Thị trường</button><button class="btn" data-a="lapKH">Lập kế hoạch →</button></div>' : '<button class="btn" data-a="lapKH">Lập kế hoạch hôm nay →</button>'}</div>`;
}

// ---------------- Màn: Kế hoạch ----------------
function tabMua(st, p, kh) {
  const can = canNL(kh);
  const ds = Object.entries(NGUYEN_LIEU).map(([nl, n]) => {
    const g = giaNL(st, p, nl), co = khoDung(st, p, nl), m = kh.mua[nl] || 0, c = can[nl] || 0;
    const thieu = c > co + m;
    return `<div class="item"><span class="ic">${n.icon}</span><span class="nm"><b>${n.ten}</b> · ${g} xu<small>Kho ${co}${c ? ` · cần ${c}` : ''} · để được ${E.hanNL(st, nl)} ngày${thieu ? ` · <span class="warn">thiếu ${c - co - m}</span>` : ''}</small></span>${buocSo(`mua.${nl}`, m, { x5: true })}</div>`;
  }).join('');
  return `<div class="card"><div class="row"><div class="sp"><div class="lbl">Tiền mua hôm nay</div><b>${xu(chiMua(st, p, kh))}</b></div><button class="btn ghost sm" style="width:auto" data-a="tuMua">🛒 Mua đủ cho bánh</button></div></div><div class="card">${ds}</div>
  <p class="note mute" style="margin:0 4px 8px">Trứng, sữa, trái cây mau hỏng. Nguyên liệu quá hạn sẽ bị bỏ.</p>`;
}
function tabLam(st, p, kh) {
  let cong = 0, me = 0;
  for (const [b, sl] of Object.entries(kh.lam)) { cong += E.congBanh(p, b) * sl; me += sl; }
  const cT = E.congTho(st, p), lT = E.sucLo(st, p);
  const can = canNL(kh), thieu = Object.entries(can).filter(([nl, c]) => c > khoDung(st, p, nl) + (kh.mua[nl] || 0));
  const dn = laDN();
  const ds = E.banhDangCo(st).map((b) => {
    const B = BANH[b];
    if (!E.daMoKhoa(st, p, b)) return `<div class="item"><span class="ic" style="opacity:.5">${B.icon}</span><span class="nm"><b>${B.ten}</b> 🔒<small>Cần công thức: nghiên cứu ${B.phiNC} xu (${LUAT.ngayNghienCuu} ngày)${dn ? ` hoặc mua ${Math.floor((B.phiNC * LUAT.heSoMuaCongThuc) / 100)} xu` : ''} ở thẻ Tiệm${dn ? ` · hợp khu ${E.hopKhu(p.khu, b)}%` : ''}</small></span></div>`;
    const ct = Object.entries(B.ct).map(([nl, q]) => `${q}${NGUYEN_LIEU[nl].icon}`).join(' ');
    const ton = hangDung(st, p, b);
    return `<div class="item"><span class="ic">${B.icon}</span><span class="nm"><b>${B.ten}</b>${B.mo === 'mua' ? ' ✨' : ''}<small>${ct} · ${E.congBanh(p, b)} công · bán ${B.han} ngày${ton ? ` · tồn ${ton}` : ''}${dn ? ` · hợp khu ${E.hopKhu(p.khu, b)}%` : ''}${B.canThoCa ? ' · cần thợ cả' : ''}</small></span>${buocSo(`lam.${b}`, kh.lam[b] || 0, { x5: true })}</div>`;
  }).join('');
  return `<div class="card"><div class="lbl">Công thợ ${cong}/${cT} · Lò ${me}/${lT} bánh</div>
   <div class="bar ${cong > cT ? 'over' : ''}"><i style="width:${Math.min(100, cT ? (cong * 100) / cT : 0)}%"></i></div>
   <div class="bar ${me > lT ? 'over' : ''}"><i style="width:${Math.min(100, (me * 100) / lT)}%"></i></div></div>
   ${thieu.length ? `<div class="card"><p class="note warn">Thiếu ${thieu.map(([nl, c]) => `${c - khoDung(st, p, nl) - (kh.mua[nl] || 0)} ${NGUYEN_LIEU[nl].ten}`).join(', ')}.</p><button class="btn alt sm" style="margin-top:6px" data-a="tuMua">🛒 Tự mua phần còn thiếu</button></div>` : ''}
   <div class="card">${ds}</div>`;
}
function tabGia(st, p, kh) {
  const dn = laDN();
  const ds = Object.keys(kh.gia).map((b) => {
    const B = BANH[b], g = kh.gia[b], pt = Math.floor((g * 100) / B.gia);
    const nx = pt > 140 ? '<span class="warn">rất đắt: khách bỏ về, mất uy tín</span>' : pt > 120 ? '<span class="warn">đắt: khách bỏ về, trừ uy tín</span>' : pt > 110 ? 'hơi đắt: ít khách hơn' : pt < 85 ? 'rẻ: đông khách nhưng ít lãi' : 'hợp lý';
    const hq = p.homQua?.ban?.[b];
    return `<div class="item"><span class="ic">${B.icon}</span><span class="nm"><b>${B.ten}</b> · ${pt}%<small>Gợi ý ${B.gia} xu · ${nx}${hq ? ` · hôm qua bán ${hq}` : ''}</small></span>${buocSo(`gia.${b}`, g)}</div>`;
  }).join('');
  return `<div class="card">${ds}</div><p class="note mute" style="margin:0 4px 8px">${dn ? `Khách khu ${KHU[p.khu].ten} nhạy giá ${E.nhayKhu(p.khu)}% (càng thấp càng chịu chi). ` : ''}Giá quanh 100% giá gợi ý thường lãi nhất.</p>`;
}
function tabBan(st, p, kh) {          // Doanh nhân: chiến thuật bán hàng trong ngày
  const nhomChinh = Object.entries(KHU[p.khu].tyLe).sort((a, b) => b[1] - a[1])[0][0];
  const coBanh = Object.keys(BANH).filter((b) => hangDung(st, p, b) + (kh.lam[b] || 0) > 0);
  return `<div class="card"><div class="lbl">🧹 Hằng ngày</div>
    <div class="item"><span class="nm"><b>Dọn vệ sinh</b><small>${LUAT.phiDonDep} xu · giữ điểm Không gian (không dọn thì bẩn dần)</small></span>${nutItem('donDep', kh.donDep ? '' : '1', kh.donDep, kh.donDep ? '✓ Có' : 'Không')}</div>
    <div class="item"><span class="nm"><b>Bao bì đẹp</b><small>1 xu mỗi bánh làm hôm nay · +điểm Mắt</small></span>${nutItem('baoBi', kh.baoBi ? '' : '1', kh.baoBi, kh.baoBi ? '✓ Có' : 'Không')}</div></div>
   <div class="card"><div class="lbl">🌇 Giờ vàng cuối ngày (giảm giá bánh hết hạn hôm nay)</div><div class="opt">${[0, ...LUAT.gioVang].map((v) => nutChon('gioVang', v, kh.gioVang === v, v ? `−${v}%` : 'Không')).join('')}</div>
    <p class="note mute" style="margin-top:6px">${(p.gioVangLienTiep || 0) >= 2 ? '<span class="warn">Đã giảm giá ' + p.gioVangLienTiep + ' ngày liền: thêm hôm nay khách sẽ quen chờ giảm giá!</span>' : 'Bớt bỏ phí nhưng ít lãi. Giảm liên tục thì khách chỉ chờ giảm giá.'}</p></div>
   <div class="card"><div class="lbl">📣 Chiến dịch marketing (${LUAT.phiChienDich} xu, ${LUAT.ngayChienDich} ngày)</div>
    ${p.chienDich ? `<p class="note">Đang chạy cho ${NHOM_KHACH[p.chienDich.nhom].icon} ${NHOM_KHACH[p.chienDich.nhom].ten} tới ngày ${p.chienDich.den}.</p>` : `<div class="opt">${nutChon('chienDich', '', !kh.chienDich, 'Không')}${Object.entries(NHOM_KHACH).map(([k, g]) => nutChon('chienDich', k, kh.chienDich === k, `${g.icon} ${g.ten} ${KHU[p.khu].tyLe[k]}%`)).join('')}</div>
    <p class="note mute" style="margin-top:6px">Khách chính ở khu của bạn: ${NHOM_KHACH[nhomChinh].icon} ${NHOM_KHACH[nhomChinh].ten}. Nhắm đúng nhóm mới hiệu quả.</p>`}</div>
   <div class="card"><div class="lbl">🍰 Mời ăn thử miễn phí</div>
    ${coBanh.length ? `<div class="opt">${nutChon('anThuBanh', '', !kh.anThuBanh, 'Không')}${coBanh.map((b) => nutChon('anThuBanh', b, kh.anThuBanh === b, `${BANH[b].icon} ${BANH[b].ten}`)).join('')}</div>
    ${kh.anThuBanh ? `<div class="opt">${LUAT.anThu.map((n) => nutChon('anThuSl', n, kh.anThuSl === n, `${n} bánh`)).join('')}</div>` : ''}` : '<p class="note mute">Chưa có bánh để mời.</p>'}
    <p class="note mute" style="margin-top:6px">Bánh ngon thì thêm khách và uy tín; bánh dở thì phản tác dụng.</p></div>`;
}
function tabTiem(st, p, kh) {
  const m = MUA[st.mua - 1], sk = E.suKienHomNay(st), dn = laDN();
  let h = '';
  if (!dn) {
    h += `<div class="card"><div class="lbl">👩‍🍳 Thợ (lương ${LUAT.luongTho} xu/ngày)</div>
     <div class="item"><span class="ic">➕</span><span class="nm">Thuê thêm<small>Phí ${LUAT.phiThue} xu/người · thợ mới làm ${LUAT.congMoi} công, sau ${LUAT.ngayThao} ngày lên ${LUAT.congThao}</small></span>${buocSo('thue', kh.thue)}</div>
     <div class="item"><span class="ic">➖</span><span class="nm">Cho nghỉ<small>Đền ${LUAT.denBuSaThai} xu/người · đang có ${p.tho.length} thợ</small></span>${buocSo('saThai', kh.saThai)}</div></div>
     <div class="card"><div class="lbl">🏦 Vay và trả nợ (lãi 1%/ngày)</div>
     <div class="item"><span class="ic">💵</span><span class="nm">Vay thêm<small>Còn vay được ${xu(E.hanMucVay(st, p))} · hết mùa còn nợ bị trừ gấp đôi</small></span>${buocSo('vay', kh.vay, { x5: true })}</div>
     <div class="item"><span class="ic">✅</span><span class="nm">Trả nợ<small>Đang nợ ${xu(p.no)}</small></span>${buocSo('tra', kh.tra, { x5: true })}</div>
     <p class="note mute">Nút ±1 là 10 xu, ±5 là 50 xu.</p></div>`;
  } else {
    h += `<div class="card"><div class="lbl">👩‍🍳 Thợ 3 cấp</div>${[1, 2, 3].map((c) => { const t = LUAT.capTho[c]; return `<div class="item"><span class="nm"><b>Thuê ${TEN_CAP_THO[c]}</b><small>Phí ${t.phi} · lương ${t.luong}/ngày · ${t.cong} công · tay nghề ${t.tay}</small></span>${buocSo('thueCap.' + c, kh.thueCap[c])}</div>`; }).join('')}
     <div class="item"><span class="nm"><b>Cho nghỉ</b><small>Người tay nghề thấp nghỉ trước, đền 3 ngày lương · đang có ${p.tho.length} thợ</small></span>${buocSo('saThai', kh.saThai)}</div>
     <div class="item"><span class="nm"><b>Học lên Thợ cả</b><small>${LUAT.phiDaoTaoThoCa} xu/người, nghỉ ${LUAT.ngayDaoTao} ngày · bánh ngon hơn</small></span>${buocSo('daoTao', kh.daoTao)}</div></div>
     <div class="card"><div class="lbl">🧍 Nhân viên quầy (điểm Tai)</div>
     <div class="item"><span class="nm"><b>Thuê</b><small>Phí ${LUAT.phiQuay} · lương ${LUAT.luongQuay}/ngày · đang có ${p.quay}/${LUAT.quayMax}</small></span>${buocSo('thueQuay', kh.thueQuay)}</div>
     <div class="item"><span class="nm"><b>Cho nghỉ</b></span>${buocSo('nghiQuay', kh.nghiQuay)}</div>
     <div class="item"><span class="nm"><b>Học lễ phép, thân thiện</b><small>${LUAT.phiDaoTaoQuay} xu/người · đã học ${p.lePhep}</small></span>${buocSo('daoTaoQuay', kh.daoTaoQuay)}</div></div>
     <div class="card"><div class="lbl">✨ Đầu tư trải nghiệm khách (mua 1 lần)</div>${Object.entries(DAU_TU_TN).map(([ma, d]) => `<div class="item"><span class="nm">${d.icon} <b>${d.ten}</b><small>${xu(d.gia)} · +${DIEM_CHAM[d.diem]}${E.trongSoKhu(p.khu)[d.diem] ? ` (khách khu này coi trọng ${E.trongSoKhu(p.khu)[d.diem]}%)` : ''}</small></span>${p.tn[ma] ? '<b class="pos">✓ Đã có</b>' : nutItem('dauTuTN', ma, kh.dauTuTN.includes(ma), kh.dauTuTN.includes(ma) ? '✓ Chọn' : 'Mua')}</div>`).join('')}</div>`;
  }
  h += `<div class="card"><div class="lbl">📣 Quảng cáo hôm nay</div><div class="opt">${[0, 10, 20, 40, 60].map((v) => nutChon('quangCao', v, kh.quangCao === v, v ? v + ' xu' : 'Không')).join('')}</div></div>`;
  if (m.nghienCuu || dn) {
    const nc = [...E.BANH_NC, ...(dn ? E.BANH_DN : [])].filter((b) => !p.moKhoa.includes(b));
    h += `<div class="card"><div class="lbl">🔬 Công thức mới</div>${p.nghienCuu ? `<p class="note">Đang nghiên cứu ${BANH[p.nghienCuu.banh].ten}, còn ${p.nghienCuu.con} ngày.</p>`
      : nc.length ? `<p class="note mute">Tự nghiên cứu (${LUAT.ngayNghienCuu} ngày):</p><div class="opt">${nutChon('nghienCuu', '', !kh.nghienCuu, 'Không')}${nc.map((b) => nutChon('nghienCuu', b, kh.nghienCuu === b, `${BANH[b].icon} ${BANH[b].ten} · ${BANH[b].phiNC}`)).join('')}</div>` : '<p class="note">Đã có đủ công thức.</p>'}
     ${dn && nc.length ? `<p class="note mute" style="margin-top:6px">Mua công thức (làm được từ ngày mai):</p><div class="opt">${nutChon('muaCongThuc', '', !kh.muaCongThuc, 'Không')}${nc.filter((b) => p.nghienCuu?.banh !== b).map((b) => nutChon('muaCongThuc', b, kh.muaCongThuc === b, `${BANH[b].icon} ${BANH[b].ten} · ${Math.floor((BANH[b].phiNC * LUAT.heSoMuaCongThuc) / 100)}`)).join('')}</div>` : ''}</div>`;
  }
  const dt = [];
  if (p.lo < LUAT.lo.length) dt.push(['nangLo', `🔥 Nâng lò lên cấp ${p.lo + 1} (${LUAT.lo[p.lo]} bánh/ngày)`, LUAT.giaNangLo[p.lo]]);
  if (!p.mayDanh) dt.push(['mayDanh', '🌀 Máy đánh trứng (bông lan, su kem, bánh kem bớt 1 công)', LUAT.giaMayDanh]);
  if (!dn && m.chiNhanh && p.chiNhanh < 2) dt.push(['chiNhanh', `🏪 Mở chi nhánh (có khách riêng, thuê ${LUAT.thueChiNhanh} xu/ngày)`, LUAT.giaChiNhanh]);
  if (dt.length) h += `<div class="card"><div class="lbl">🛠️ Đầu tư</div>${dt.map(([k, t, g]) => `<div class="item"><span class="nm">${t}<small>${xu(g)}</small></span><button class="btn ${kh[k] ? '' : 'ghost'} sm" style="width:auto" data-a="chon" data-p="${k}" data-v="${kh[k] ? '' : '1'}">${kh[k] ? '✓ Đã chọn' : 'Chọn'}</button></div>`).join('')}</div>`;
  if (sk.loai === 'donDat' && st.suKien.don) {
    const d = st.suKien.don;
    h += `<div class="card ev"><div class="lbl">📦 Đơn đặt tiệc</div><p class="note">${d.sl} ${BANH[d.banh].icon} ${BANH[d.banh].ten}, giao ngày ${d.han}, ${d.gia} xu/cái. Thiếu bị phạt và mất uy tín.${E.daMoKhoa(st, p, d.banh) ? '' : ' <b>Bạn chưa có công thức này.</b>'}</p>
     <button class="btn ${kh.nhanDon ? '' : 'alt'} sm" style="margin-top:6px" data-a="chon" data-p="nhanDon" data-v="${kh.nhanDon ? '' : '1'}">${kh.nhanDon ? '✓ Đã nhận đơn (bấm để bỏ)' : 'Nhận đơn này'}</button></div>`;
  }
  return h;
}
function tabVon(st, p, kh) {          // Doanh nhân: vay, tiết kiệm, đầu tư khác, chuỗi
  const ts = E.taiSanTheChap(st, p).filter((t) => !t.dangTheChap);
  const tsChon = ts.find((t) => t.ma === kh.theChapTS);
  const daCo = [p.khu, ...p.cuaHang.map((c) => c.khu)];
  let h = `<div class="card"><div class="lbl">🏦 Vay ngân hàng (lãi 1%/ngày)</div>
    <div class="item"><span class="nm"><b>Vay thêm</b><small>Còn vay được ${xu(E.hanMucVay(st, p))} · hết mùa còn nợ bị trừ gấp đôi</small></span>${buocSo('vay', kh.vay, { x5: true })}</div>
    <div class="item"><span class="nm"><b>Trả nợ</b><small>Đang nợ ${xu(p.no)}</small></span>${buocSo('tra', kh.tra, { x5: true })}</div></div>
   <div class="card"><div class="lbl">⚡ Vay nóng (lãi ${LUAT.laiNong / 10}%/ngày, ${LUAT.hanNong} ngày)</div>
    <div class="item"><span class="nm"><b>Vay nóng</b><small>Tối đa ${LUAT.vayNongMax} xu · có tiền ngay nhưng lãi rất cao</small></span>${buocSo('vayNong', kh.vayNong, { x5: true })}</div></div>
   <div class="card"><div class="lbl">🏠 Vay thế chấp (lãi ${LUAT.laiTheChap / 10}%/ngày, ${LUAT.hanTheChap} ngày)</div>
    ${ts.length ? `<div class="opt">${nutChon('theChapTS', '', !kh.theChapTS, 'Không')}${ts.map((t) => nutChon('theChapTS', t.ma, kh.theChapTS === t.ma, `${esc(t.ten)} · ${t.giaTri}`)).join('')}</div>
    ${tsChon ? `<div class="item"><span class="nm"><b>Số tiền vay</b><small>Tối đa ${Math.floor((tsChon.giaTri * LUAT.tyLeTheChap) / 100)} xu · quá hạn không trả là mất ${esc(tsChon.ten)}</small></span>${buocSo('theChapSo', kh.theChapSo, { x5: true })}</div>` : ''}`
    : '<p class="note mute">Chưa có tài sản thế chấp được (lò đã nâng cấp, máy đánh trứng, xe, mặt bằng).</p>'}</div>`;
  if (p.khoanVay.length) {
    h += `<div class="card"><div class="lbl">📄 Các khoản đang vay</div>${p.khoanVay.map((k) => `<div class="item"><span class="nm"><b>${k.loai === 'nong' ? '⚡ Vay nóng' : '🏠 Thế chấp'} ${xu(k.goc)}</b><small>Hạn ngày ${k.han}${k.loai === 'theChap' && !k.giaHan ? ' · có thể gia hạn 1 lần' : ''}</small></span>${buocSo('traKhoan.' + k.id, kh.traKhoan[k.id] || 0, { x5: true })}</div>
     ${k.loai === 'theChap' && !k.giaHan ? `<div class="opt" style="margin:-2px 0 6px">${nutChon('giaHan', k.id, kh.giaHan.includes(k.id), kh.giaHan.includes(k.id) ? `✓ Gia hạn +${LUAT.giaHanNgay} ngày` : `Gia hạn +${LUAT.giaHanNgay} ngày (phí ${LUAT.phiGiaHan}%)`)}</div>` : ''}`).join('')}
     <p class="note mute">Số ở mỗi khoản là tiền trả bớt hôm nay (±1 = 10 xu).</p></div>`;
  }
  if (st.mua >= LUAT.goiVonTuMua && !p.gopVon) h += `<div class="card"><div class="lbl">🤝 Gọi vốn góp (1 lần/mùa)</div><div class="item"><span class="nm"><b>Số vốn</b><small>${LUAT.goiVonMin}–${LUAT.goiVonMax} xu, không lãi · cuối mùa chia ${LUAT.chiaLoiNhuan}% lợi nhuận cho người góp</small></span>${buocSo('goiVon', kh.goiVon)}</div></div>`;
  h += `<div class="card"><div class="lbl">💰 Tiết kiệm (lãi ${LUAT.laiTietKiem / 10}%/ngày) · đang có ${xu(p.tietKiem)}</div>
    <div class="item"><span class="nm"><b>Gửi</b></span>${buocSo('guiTK', kh.guiTK, { x5: true })}</div>
    <div class="item"><span class="nm"><b>Rút</b></span>${buocSo('rutTK', kh.rutTK, { x5: true })}</div></div>
   <div class="card"><div class="lbl">📈 Đầu tư khác</div>
    ${p.dauTu.xe ? '' : `<div class="item"><span class="nm">🛵 <b>Xe giao hàng</b><small>${xu(LUAT.giaXe)} · thêm khách, ngày mưa vẫn bán tốt · xăng ${LUAT.xangXe}/ngày</small></span>${nutItem('muaXe', kh.muaXe ? '' : '1', kh.muaXe, kh.muaXe ? '✓ Chọn' : 'Mua')}</div>`}
    ${p.dauTu.traiGa ? '' : `<div class="item"><span class="nm">🐔 <b>Góp vốn trại gà</b><small>${xu(LUAT.giaTraiGa)} · trứng rẻ ${LUAT.giamTrung}%, cổ tức ${LUAT.coTuc}/ngày</small></span>${nutItem('gopTraiGa', kh.gopTraiGa ? '' : '1', kh.gopTraiGa, kh.gopTraiGa ? '✓ Chọn' : 'Góp')}</div>`}
    ${p.matBangChinh ? '' : `<div class="item"><span class="nm">🏠 <b>Mua mặt bằng tiệm chính</b><small>${xu(KHU[p.khu].giaMatBang)} · không phải trả tiền thuê ${KHU[p.khu].thue}/ngày</small></span>${nutItem('muaMatBang', kh.muaMatBang ? '' : '1', kh.muaMatBang, kh.muaMatBang ? '✓ Chọn' : 'Mua')}</div>`}
    ${p.dauTu.xe && p.dauTu.traiGa && p.matBangChinh ? '<p class="note mute">Đã đầu tư đủ.</p>' : ''}</div>`;
  if (E.soCuaHang(p) < LUAT.cuaHangMax) {
    const kc = Object.keys(KHU).filter((k) => !daCo.includes(k));
    h += `<div class="card"><div class="lbl">🏬 Mở cửa hàng mới (${E.soCuaHang(p)}/${LUAT.cuaHangMax})</div><div class="opt">${nutChon('cuaHangKhu', '', !kh.cuaHangKhu, 'Không')}${kc.map((k) => nutChon('cuaHangKhu', k, kh.cuaHangKhu === k, `${KHU[k].icon} ${KHU[k].ten}`)).join('')}</div>
     ${kh.cuaHangKhu ? `<div class="opt">${nutChon('cuaHangCach', 'thue', kh.cuaHangCach === 'thue', `Thuê: cọc ${LUAT.cocThue} + ${KHU[kh.cuaHangKhu].thue}/ngày`)}${nutChon('cuaHangCach', 'mua', kh.cuaHangCach === 'mua', `Mua: ${so(KHU[kh.cuaHangKhu].giaMatBang)}`)}</div>` : ''}
     <p class="note mute" style="margin-top:6px">Mỗi cửa hàng phụ tốn thêm ${LUAT.phiCuaHang} xu/ngày. Bánh làm ở xưởng chung, máy tự chia ra các cửa hàng: nhớ thuê thêm thợ, nâng lò.</p></div>`;
  }
  return h;
}
function manKeHoach() {
  const st = G.st, p = st.nguoi[UI.luot], kh = UI.kh, dn = laDN();
  const kq = thuKeHoach(st, p.id, kh);
  const TAB = dn
    ? { mua: ['🛒', 'Mua', tabMua], lam: ['🧁', 'Làm', tabLam], gia: ['🏷️', 'Giá', tabGia], ban: ['🌇', 'Bán', tabBan], tiem: ['🏪', 'Tiệm', tabTiem], von: ['💰', 'Vốn', tabVon] }
    : { mua: ['🛒', 'Mua', tabMua], lam: ['🧁', 'Làm', tabLam], gia: ['🏷️', 'Giá', tabGia], tiem: ['🏪', 'Tiệm', tabTiem] };
  if (!TAB[UI.tab]) UI.tab = 'lam';
  return `${thanhTren(tieuDeNgay(st))}<div class="scr">
   <div class="hd"><h3>📋 ${p.icon} ${esc(p.ten)}</h3><button class="chip" style="background:${mau(p.id)};border:0" data-a="xemBang">${xu(p.tien)} · xem tiệm</button></div>
   <div class="tabs" style="grid-template-columns:repeat(${Object.keys(TAB).length},1fr)">${Object.entries(TAB).map(([k, [ic, t]]) => `<button data-a="tab" data-v="${k}" class="${UI.tab === k ? 'on' : ''}">${ic} ${t}</button>`).join('')}</div>
   ${TAB[UI.tab][2](st, p, kh)}
  </div><div class="act"><div class="msg ${kq.ok ? '' : 'warn'}">${kq.ok ? `Tiền sau khi chi: <b class="${kq.tienSau < 0 ? 'neg' : ''}">${xu(kq.tienSau)}</b>` : '⚠️ ' + esc(kq.loi)}</div>
   <div class="g2"><button class="btn ghost" data-a="goiY">🤖 Gợi ý</button><button class="btn" data-a="xongLuot" ${kq.ok ? '' : 'disabled'}>Xong lượt ✓</button></div></div>`;
}

// ---------------- Lớp phủ: Thị trường (Doanh nhân) ----------------
function dlgThiTruong() {
  const st = G.st, p = st.nguoi[UI.luot], pt = E.phanTichThiTruong(st);
  const ks = UI.kh?.khaoSat ? E.khaoSatKhu(st, p.khu) : null;
  return `<div class="dlg" data-a="dongNen"><div class="box"><h3>📊 Phân tích thị trường</h3>
   ${pt.map((z) => `<div class="card ${z.khu === p.khu ? 'ev' : ''}" style="margin-bottom:7px"><div class="row"><b>${z.icon} ${z.ten}</b><span class="sp"></span><small class="mute">${z.soTiem} tiệm · thuê ${z.thue}/ngày</small></div>
     <p class="note">${Object.entries(z.tyLe).map(([g, t]) => `${NHOM_KHACH[g].icon} ${t}%`).join(' · ')} · coi trọng ${DIEM_CHAM[z.coiTrong]}</p>
     <p class="note mute">Món hợp: ${z.monHop.map(([b, v]) => `${BANH[b].icon} ${v}%`).join(' · ')}</p></div>`).join('')}
   <div class="card"><div class="lbl">🔎 Khảo sát khách khu mình (${LUAT.phiKhaoSat} xu, số liệu hôm qua)</div>
    ${ks ? `<p class="note">Bán chạy: ${ks.banChay.length ? ks.banChay.map(([b, q]) => `${BANH[b].icon} ${q}`).join(' · ') : 'chưa có'}<br>Giá TB: ${Object.entries(ks.giaTB).slice(0, 6).map(([b, g]) => `${BANH[b].icon} ${g}`).join(' · ')}<br>Khách không mua được: <b>${ks.khachThieu}</b></p>`
      : `<button class="btn alt sm" style="margin-top:6px" data-a="chon" data-p="khaoSat" data-v="1">Khảo sát (${LUAT.phiKhaoSat} xu, trừ khi xong lượt)</button>`}</div>
   <button class="btn" style="margin-top:10px" data-a="dong">Đóng</button></div></div>`;
}

// ---------------- Màn: Báo cáo tối ----------------
function tinPho(st, bc) {
  const tin = [];
  for (const [id, r] of Object.entries(bc.nguoi)) {
    const p = st.nguoi[id], t = `${p.icon} ${esc(p.ten)}`;
    if (r.phaSan) tin.push(`💥 ${t} hết tiền, phải tạm đóng cửa.`);
    if (r.thieuKhach >= 3) tin.push(`🏃 ${t} hết bánh, ${r.thieuKhach} khách phải đi tiệm khác.`);
    if (r.bo > 0) tin.push(`🗑️ ${t} bỏ ${r.bo} bánh quá hạn.`);
    if (r.boNL > 0) tin.push(`🥀 ${t} bỏ ${r.boNL} phần nguyên liệu hỏng.`);
    if (r.giaTB > 120) tin.push(`😤 Khách chê ${t} bán đắt.`);
    if (r.moKhoa) tin.push(`🔬 ${t} học xong công thức ${BANH[r.moKhoa].ten}!`);
    if (r.don) tin.push(`📦 ${t}: ${r.don}.`);
    if (r.phebinh) tin.push(`📝 Nhà phê bình khen ${t}: thêm nửa sao.`);
    if (r.cuocThi) tin.push(`🏆 ${t} thắng cuộc thi làm bánh: +30 uy tín.`);
    if (r.veSinh) tin.push(`🧾 ${t} bị nhắc vì còn bánh cũ: trừ uy tín.`);
    if (r.gioVang?.ban) tin.push(`🌇 ${t} bán giờ vàng ${r.gioVang.ban} bánh (−${r.gioVang.giam}%).`);
    if (r.anThu) tin.push(r.anThu === 'ngon' ? `🍰 Khách ăn thử ở ${t} khen ngon!` : r.anThu === 'do' ? `😕 Khách ăn thử ở ${t} chê bánh chưa ngon.` : `🍰 ${t} mời khách ăn thử.`);
    if (r.matTheChap) tin.push(`💔 ${t} không trả kịp khoản thế chấp, bị thu tài sản.`);
    if (r.traNo) tin.push(`⚡ ${t} bị thu ${so(r.traNo)} xu vay nóng đến hạn.`);
    if (r.lenCap) tin.push(`💪 ${t} có thợ lên tay nghề!`);
    if (r.viec?.moCuaHang) tin.push(`🏬 ${t} khai trương cửa hàng ở ${KHU[r.viec.moCuaHang].ten}!`);
  }
  return tin.length ? tin : ['🙂 Một ngày bình yên trên phố bánh.'];
}
function manToi() {
  const st = G.st, bc = st.baoCao[st.baoCao.length - 1], sl = G.soLieuToi || {};
  const sk = SU_KIEN.find((s) => s.id === bc.suKien);
  const the = Object.entries(bc.nguoi).map(([id, r]) => {
    const p = st.nguoi[id], s = sl[id] || { tien: p.tien, no: p.no, chiMua: 0 };
    const ban = Object.values(r.ban).reduce((a, x) => a + x, 0);
    const cp = (r.chiPhi.luong || 0) + (r.chiPhi.thue || 0) + (r.chiPhi.lai || 0) + (r.chiPhi.khac || 0);
    const doi = (p.tien - p.no) - (s.tien - s.no);
    return `<div class="card"><div class="lbl" style="color:${mau(+id)}">${p.icon} ${esc(p.ten)}${r.khu ? ` · ${KHU[r.khu].icon}` : ''}</div>
     ${theCanhBao(+id)}
     <table class="tbl">
     <tr><td>Bán ${ban} bánh${r.khach ? ` (${r.khach} khách)` : ''}</td><td class="pos">+${so(r.doanhThu)}</td></tr>
     ${r.thuKhac ? `<tr><td>Cổ tức trại gà</td><td class="pos">+${so(r.thuKhac)}</td></tr>` : ''}
     <tr><td>Mua nguyên liệu</td><td class="neg">−${so(s.chiMua || 0)}</td></tr>
     <tr><td>Lương + thuê nhà + lãi${r.chiPhi.khac ? ' + xăng' : ''}</td><td class="neg">−${so(cp)}</td></tr>
     ${r.chiPhi.phatDon ? `<tr><td>Phạt đơn</td><td class="neg">−${so(r.chiPhi.phatDon)}</td></tr>` : ''}
     <tr><td><b>Tiền ròng tăng/giảm</b> <small>(gồm cả đầu tư, vay)</small></td><td class="${doi >= 0 ? 'pos' : 'neg'}">${dau(doi)} xu</td></tr></table>
     ${r.traiNghiem ? `<details class="note" style="margin-top:6px"><summary>📋 Phiếu trải nghiệm khách</summary>${thePhieu(r.traiNghiem, bc.ngay + +id)}</details>` : ''}
     ${G.baiHocToi?.[id] ? theBaiHoc(G.baiHocToi[id]) : ''}</div>`;
  }).join('');
  return `${thanhTren(`${MUA_ICON[st.mua - 1]} ${MUA[st.mua - 1].ten} · Tối ngày ${bc.ngay}`)}<div class="scr cot2">
   <div class="hd full"><h3>🌙 Báo cáo tối</h3><span class="chip" style="background:${mau(0)}">Cả nhà xem</span></div>
   <div class="card"><div class="lbl">🏆 Giá trị tiệm</div>${bangXepHang(st)}</div>
   <div class="card"><div class="lbl">📣 Chuyện trên phố · ${sk.icon} ${sk.ten}</div><p class="note" style="margin-top:4px">${tinPho(st, bc).join('<br>')}</p></div>
   ${the}
  </div><div class="act"><button class="btn" data-a="ngayMoi">${st.ketThuc ? 'Xem kết quả mùa 🏁' : `Sang ngày ${st.ngay} ☀️`}</button></div>`;
}

// ---------------- Màn: Câu đố cuối mùa + Hết mùa ----------------
function manCauDo() {
  const id = G.cauDoLuot[0], p = G.st.nguoi[id], ds = G.cauDo[id];
  const tl = G.traLoi[id] || [], i = tl.length;
  const xong = i >= ds.length;
  const c = ds[Math.min(i, ds.length - 1)];
  const daChon = UI.cdTraLoi;
  return `${thanhTren(`🎓 Câu đố cuối mùa`)}<div class="scr">
   <div class="hd"><h3>${p.icon} ${esc(p.ten)}</h3><span class="chip" style="background:${mau(id)}">${xong ? 'Xong' : `Câu ${i + 1}/${ds.length}`}</span></div>
   ${xong ? `<div class="card" style="text-align:center"><div style="font-size:2.4rem">${H.chamCauDo(ds, tl) === ds.length ? '🎓' : '👍'}</div><h3>Đúng ${H.chamCauDo(ds, tl)}/${ds.length} câu</h3><p class="note">${H.chamCauDo(ds, tl) === ds.length ? 'Tuyệt vời! Nhận cúp Học giỏi.' : 'Mùa sau cố gắng thêm nhé!'}</p></div>`
    : `<div class="card"><p class="note" style="font-size:1rem"><b>${esc(c.hoi)}</b></p><div class="quiz">${c.chon.map((x, k) => `<button data-a="cdChon" data-v="${k}" class="${daChon == null ? '' : k === c.dung ? 'dung' : k === daChon ? 'sai' : ''}" ${daChon != null ? 'disabled' : ''}>${'ABC'[k]}. ${esc(x)}</button>`).join('')}</div>
      ${daChon != null ? `<p class="note ${daChon === c.dung ? 'pos' : 'warn'}" style="margin-top:8px">${daChon === c.dung ? '✅ Đúng rồi!' : '❌ Chưa đúng.'} ${esc(c.giaiThich)}</p>` : ''}</div>`}
  </div><div class="act">${xong ? `<button class="btn" data-a="cdXong">${G.cauDoLuot.length > 1 ? 'Đưa máy cho người tiếp theo →' : 'Xem kết quả mùa 🏁'}</button>` : daChon != null ? '<button class="btn" data-a="cdTiep">Câu tiếp →</button>' : '<div class="msg">Chọn 1 đáp án</div>'}</div>`;
}
function manHet() {
  if (G.cauDoLuot?.length) return manCauDo();
  const st = G.st, xh = st.xepHang || E.xepHang(st, true), nhat = st.nguoi[xh[0].id], cd = st.cheDo || 'nm';
  const sau = st.mua < 5 && st.mua + 1 <= MO[cd];
  const kq = G.ketQuaCup || {};
  return `${thanhTren(`${MUA_ICON[st.mua - 1]} Hết mùa ${MUA[st.mua - 1].ten}`)}<div class="scr cot2">
   ${dai(st.mua, `🏁 Kết thúc mùa ${MUA[st.mua - 1].ten}`)}
   <div class="card" style="text-align:center"><div style="font-size:3rem">👑</div><h3>${nhat.icon} ${esc(nhat.ten)}</h3><p class="note">là tiệm bánh giỏi nhất phố mùa này!</p></div>
   <div class="card"><div class="lbl">Xếp hạng cuối mùa (nợ còn lại bị trừ gấp đôi)</div>${bangXepHang(st, true)}</div>
   <div class="card"><div class="lbl">🏆 Cúp mùa này</div>${G.khongTinhCup ? '<p class="note warn">Ván này có 1 người giữ nhiều tiệm nên không tính cúp.</p>' : ''}
    ${st.nguoi.filter((p) => !p.may).map((p) => { const r = kq[p.id]; const hs = hoSoCua(p.id); if (!hs) return `<p class="note">${p.icon} ${esc(p.ten)}: chơi khách, không lưu cúp.</p>`; return `<p class="note">${hs.icon} <b>${esc(hs.ten)}</b>: ${r?.cup?.length ? r.cup.map((m) => `${H.CUP[m].icon} ${H.CUP[m].ten}`).join(', ') : 'chưa có cúp'}${r ? ` · ${r.cap.icon} ${r.cap.ten} (${r.diem} điểm)` : ''}</p>`; }).join('')}
    <p class="note mute" style="margin-top:4px">${st.nguoi.map((p) => `${p.icon} ${p.huyHieu.length ? p.huyHieu.map((h) => HUY_HIEU[h]).join(', ') : ''}`).filter((x) => x.length > 3).join('<br>')}</p>
    ${sau ? `<p class="note pos" style="margin-top:6px"><b>🔓 Đã mở mùa ${st.mua + 1}: ${MUA[st.mua].ten}!</b></p>` : ''}
    ${cd === 'nm' && Object.values(kq).some((r) => r.cup.includes('hang1')) ? '<p class="note pos"><b>💼 Người thắng đã mở được chế độ Doanh nhân!</b></p>' : ''}</div>
  </div><div class="act"><div class="g2">${sau ? `<button class="btn" data-a="muaSau">Sang mùa ${st.mua + 1} ▶</button>` : ''}<button class="btn ${sau ? 'ghost' : ''}" data-a="choiLai">Chơi lại mùa này</button></div>
   <button class="btn ghost" style="margin-top:8px" data-a="veMenu">🏠 Về menu</button></div>`;
}

// ---------------- Lớp phủ ----------------
function lopPhu() {
  let h = '';
  if (UI.man === 'game' && G?.buoc === 'luot' && UI.luot != null && !UI.daCam) {
    const p = G.st.nguoi[UI.luot];
    h += `<div class="ov"><div class="av">${p.icon}</div><h3>Đưa máy cho<br>${esc(p.ten)}</h3><p>Người khác đừng nhìn nhé!<br>Kế hoạch của tiệm trước đã được giấu.</p><button class="go" data-a="daCam">Tôi đã cầm máy ✓</button></div>`;
  }
  if (UI.man === 'game' && G?.buoc === 'het' && G.cauDoLuot?.length && Object.keys(G.cauDo || {}).length > 1 && UI.daCamCD !== G.cauDoLuot[0] && !(G.traLoi[G.cauDoLuot[0]] || []).length) {
    const p = G.st.nguoi[G.cauDoLuot[0]];
    h += `<div class="ov"><div class="av">${p.icon}</div><h3>Câu đố cho<br>${esc(p.ten)}</h3><p>Tự trả lời nhé, không nhắc bài!</p><button class="go" data-a="daCamCD">Sẵn sàng ✓</button></div>`;
  }
  if (UI.dlg === 'tt') h += dlgThiTruong();
  if (UI.dlg === 'cd') {
    h += `<div class="dlg" data-a="dongNen"><div class="box"><h3>⚙️ Cài đặt</h3>
     <div class="lbl">Giao diện</div><div class="theme3">${[['A', 'Tiệm bánh ấm áp'], ['B', 'Kẹo ngọt vui nhộn'], ['C', 'Lò bánh cổ điển']].map(([k, t]) => `<button data-a="theme" data-v="${k}" class="${CD.theme === k ? 'on' : ''}"><i style="background-image:${nenGiaoDien(k)};${k === 'B' ? 'background-size:70px 70px' : ''}"></i>${k} · ${t}</button>`).join('')}</div>
     <div class="item" style="margin-top:8px"><span class="nm"><b>Âm thanh</b></span><button class="btn ghost sm" style="width:auto" data-a="am">${CD.tat ? '🔇 Đang tắt' : '🔊 Đang bật'}</button></div>
     <div class="item"><span class="nm"><b>Chữ lớn</b></span><button class="btn ghost sm" style="width:auto" data-a="chu">${CD.chuLon ? 'Đang bật' : 'Đang tắt'}</button></div>
     ${G ? '<div class="item"><span class="nm"><b>Bỏ ván đang lưu</b><small>Không lấy lại được</small></span><button class="btn alt sm" style="width:auto" data-a="boVan">Bỏ ván</button></div>' : ''}
     <button class="btn" style="margin-top:10px" data-a="dong">Đóng</button></div></div>`;
  }
  if (UI.dlg === 'hd') {
    h += `<div class="dlg" data-a="dongNen"><div class="box guide"><h3>📖 Cách chơi</h3>
     <p>Mỗi người làm chủ 1 tiệm bánh. Hết mùa, tiệm có <b>giá trị cao nhất</b> thắng (tiền + tài sản − nợ).</p>
     <h4>Mỗi ngày có 4 bước</h4><ul><li><b>Buổi sáng:</b> cả nhà xem thời tiết, sự kiện, giá chợ.</li><li><b>Lập kế hoạch:</b> chuyền máy lần lượt. Mua nguyên liệu, làm bánh, đặt giá, quản lý tiệm. Bấm "Xong lượt" rồi đưa máy cho người sau.</li><li><b>Mở cửa bán:</b> máy tự chia khách theo giá, uy tín, quảng cáo.</li><li><b>Báo cáo tối:</b> ai lãi, ai lỗ, bài học hôm nay.</li></ul>
     <h4>🌱 Nhập môn</h4><ul><li>Làm bánh cần nguyên liệu, <b>công thợ</b> và <b>chỗ trong lò</b>.</li><li>Giá quá đắt thì khách bỏ về, quá rẻ thì ít lãi.</li><li>Hết bánh thì khách sang tiệm khác; làm thừa thì phải bỏ.</li><li>Bí quá thì bấm <b>🤖 Gợi ý</b>.</li></ul>
     <h4>💼 Doanh nhân (mở khi thắng 1 mùa Nhập môn)</h4><ul><li><b>4 khu</b>: mỗi khu có nhóm khách riêng. Khu đông tiệm thì phải chia khách. Xem <b>📊 Thị trường</b>.</li><li>Khách "ăn" bằng <b>Mắt → Tai → Mũi → Không gian</b>, và <b>Miệng</b> sau cùng (bánh ngon thì quay lại).</li><li>Thợ 3 cấp, nhân viên quầy, giờ vàng, chiến dịch, ăn thử, vay nóng, thế chấp, chuỗi cửa hàng, tiết kiệm…</li></ul>
     <h4>🏆 Hồ sơ & cúp</h4><p>Mỗi người có hồ sơ lưu cúp, kỷ lục và Sổ bài học. Cuối mùa có 3 câu đố.</p>
     <button class="btn" style="margin-top:12px" data-a="dong">Đã hiểu</button></div></div>`;
  }
  if (UI.dlg === 'xn') h += `<div class="dlg"><div class="box"><h3>${UI.xn.tieuDe}</h3><p class="note">${UI.xn.noiDung}</p><div class="g2" style="margin-top:12px"><button class="btn ghost" data-a="dong">Không</button><button class="btn alt" data-a="dongY">Đồng ý</button></div></div></div>`;
  if (UI.dlg === 'sua') {
    const h0 = KHO.hoSo.find((x) => x.id === UI.hsSua);
    h += `<div class="dlg"><div class="box"><h3>✏️ Đổi tên hồ sơ</h3><input id="hsTenMoi" maxlength="18" value="${esc(h0?.ten || '')}" style="width:100%;border-radius:10px;padding:9px 10px;border:1px solid #0003">
     <div class="g2" style="margin-top:12px"><button class="btn ghost" data-a="dong">Huỷ</button><button class="btn" data-a="hsLuuTen">Lưu</button></div></div></div>`;
  }
  return h;
}

// ---------------- Vẽ ----------------
function manGame() {
  if (!G) { UI.man = 'menu'; return manMenu(); }
  if (G.buoc === 'sang') return manSang();
  if (G.buoc === 'luot') { if (UI.luot == null) tiepTheoLuot(); if (G.buoc !== 'luot') return manGame(); return UI.view === 'bang' ? manBang() : manKeHoach(); }
  if (G.buoc === 'toi') return manToi();
  return manHet();
}
function render() {
  document.body.className = CD.theme + (UI.man === 'menu' ? ' menuOn' : '');
  document.documentElement.classList.toggle('lon', !!CD.chuLon);
  $('#bg').style.backgroundImage = nenGiaoDien(CD.theme);
  $('#app').innerHTML = UI.man === 'moi' ? manMoi() : UI.man === 'hoSo' ? manHoSo() : UI.man === 'game' ? manGame() : manMenu();
  $('#ov').innerHTML = lopPhu();
}

// ---------------- Thao tác ----------------
function doiSo(path, d) {
  const kh = UI.kh, st = G.st, p = st.nguoi[UI.luot];
  const [a, b] = path.split('.');
  if (a === 'gia') { kh.gia[b] = Math.max(1, Math.min(BANH[b].gia * 3, (kh.gia[b] || 0) + d)); return; }
  if (a === 'mua' || a === 'lam') { kh[a][b] = Math.max(0, (kh[a][b] || 0) + d); return; }
  if (a === 'thueCap') { kh.thueCap[b] = Math.max(0, kh.thueCap[b] + d); return; }
  if (a === 'traKhoan') { const k = p.khoanVay.find((x) => x.id === +b); kh.traKhoan[b] = Math.max(0, Math.min(k?.goc || 0, (kh.traKhoan[b] || 0) + d * 10)); return; }
  const lim = {
    vay: [10, E.hanMucVay(st, p)], tra: [10, p.no], vayNong: [10, LUAT.vayNongMax], guiTK: [10, Math.max(0, p.tien)], rutTK: [10, p.tietKiem || 0],
    theChapSo: [10, (() => { const t = E.taiSanTheChap(st, p).find((x) => x.ma === kh.theChapTS); return t ? Math.floor((t.giaTri * LUAT.tyLeTheChap) / 100) : 0; })()],
    goiVon: [100, LUAT.goiVonMax], thue: [1, 12 - p.tho.length + kh.saThai], saThai: [1, p.tho.length - 1],
    daoTao: [1, p.tho.filter((t) => t.cap === 2 && !t.hoc).length], thueQuay: [1, LUAT.quayMax - (p.quay || 0)], nghiQuay: [1, p.quay || 0], daoTaoQuay: [1, (p.quay || 0) - (p.lePhep || 0)],
  }[a];
  if (!lim) return;
  let v = (kh[a] || 0) + d * lim[0];
  if (a === 'goiVon' && v > 0 && v < LUAT.goiVonMin) v = d > 0 ? LUAT.goiVonMin : 0;
  kh[a] = Math.max(0, Math.min(lim[1], v));
}
function tuMua() {
  const st = G.st, p = st.nguoi[UI.luot], kh = UI.kh;
  let n = 0;
  for (const [nl, c] of Object.entries(canNL(kh))) { const x = c - khoDung(st, p, nl); if (x > (kh.mua[nl] || 0)) { kh.mua[nl] = x; n++; } }
  toast(n ? 'Đã thêm nguyên liệu còn thiếu vào giỏ' : 'Đã đủ nguyên liệu cho số bánh định làm');
}
function goiY() {
  const st = G.st, p = st.nguoi[UI.luot];
  let k; try { k = keHoachMay(st, p.id, 'vua'); } catch { k = {}; }
  UI.kh = khTuMay(st, p, k); UI.tab = 'lam';
  toast('Máy đã điền gợi ý. Bạn xem lại và sửa nếu muốn.');
}
function chon(d) {
  const k = d.p, kh = UI.kh, v = d.v;
  if (['quangCao', 'gioVang', 'anThuSl'].includes(k)) kh[k] = +v;
  else if (['nghienCuu', 'muaCongThuc', 'chienDich', 'cuaHangKhu', 'cuaHangCach'].includes(k)) kh[k] = v || null;
  else if (k === 'anThuBanh') { kh.anThuBanh = v || null; if (v && !kh.anThuSl) kh.anThuSl = LUAT.anThu[0]; if (!v) kh.anThuSl = 0; }
  else if (k === 'theChapTS') { kh.theChapTS = v || null; kh.theChapSo = 0; }
  else if (k === 'dauTuTN') { kh.dauTuTN = kh.dauTuTN.includes(v) ? kh.dauTuTN.filter((x) => x !== v) : [...kh.dauTuTN, v]; }
  else if (k === 'giaHan') { const id = +v; kh.giaHan = kh.giaHan.includes(id) ? kh.giaHan.filter((x) => x !== id) : [...kh.giaHan, id]; }
  else if (k === 'cfgCheDo') { UI.cfg.cheDo = v; UI.cfg.mua = Math.min(UI.cfg.mua, MO[v]); if (v === 'dn') { const ds = []; UI.cfg.ds.forEach((x) => { if (x.loai !== 'nguoi' && !x.khuTay) x.khu = chonKhuMay(ds, ds.length); ds.push(x.khu); }); } }
  else kh[k] = !!v;
  if (k === 'khaoSat') toast(`Đã khảo sát: ${LUAT.phiKhaoSat} xu sẽ trừ khi xong lượt`);
}
function hoi(tieuDe, noiDung, lam) { UI.xn = { tieuDe, noiDung, lam }; UI.dlg = 'xn'; }

const HANH_DONG = {
  veMenu: () => { if (UI.man === 'hoSo' && UI.hsMo) { UI.hsMo = null; return; } UI.man = 'menu'; UI.luot = null; },
  tiep: () => { UI.man = 'game'; UI.luot = null; },
  moi: () => { UI.cfg = cfgMacDinh(); UI.man = 'moi'; },
  hoSo: () => { UI.man = 'hoSo'; UI.hsMo = null; },
  hd: () => { UI.dlg = 'hd'; }, cd: () => { UI.dlg = 'cd'; }, dong: () => { UI.dlg = null; },
  dongNen: (d, el, e) => { if (e.target === el) UI.dlg = null; else return false; },
  dongY: () => { const f = UI.xn?.lam; UI.dlg = null; UI.xn = null; f?.(); },
  theme: (d) => { CD.theme = d.v; luuCD(); },
  am: () => { CD.tat = !CD.tat; luuCD(); },
  chu: () => { CD.chuLon = !CD.chuLon; luuCD(); },
  boVan: () => hoi('Bỏ ván đang lưu?', 'Ván đang chơi sẽ bị xoá và không lấy lại được.', () => { if (G && !G.st.ketThuc) { KHO = H.ghiBoVan(KHO, G.st, ganHoSo(G)); luuHS(); } G = null; ghi(LS.van, null); UI.man = 'menu'; }),
  // hồ sơ
  hsXem: (d) => { UI.hsMo = d.v; }, hsDong: () => { UI.hsMo = null; },
  hsIcon: (d) => { UI.hsIcon = d.v; },
  hsTao: () => { const t = $('#hsTen')?.value || ''; try { const r = H.taoHoSo(KHO, t, UI.hsIcon || '👨'); KHO = r.kho; luuHS(); toast(`Đã tạo hồ sơ ${r.hoSo.ten}`); } catch (e) { phat('loi'); toast(e.message); } },
  hsSua: (d) => { UI.hsSua = d.v; UI.dlg = 'sua'; },
  hsLuuTen: () => { try { KHO = H.suaHoSo(KHO, UI.hsSua, { ten: $('#hsTenMoi')?.value }); luuHS(); UI.dlg = null; UI.hsSua = null; } catch (e) { phat('loi'); toast(e.message); } },
  hsXoa: (d) => hoi('Xoá hồ sơ?', 'Cúp, kỷ lục và sổ bài học của hồ sơ này sẽ mất, không lấy lại được.', () => { KHO = H.xoaHoSo(KHO, d.v); luuHS(); UI.hsMo = null; }),
  hsMoDN: (d) => hoi('Người lớn mở khoá Doanh nhân?', 'Chế độ Doanh nhân có vay vốn, thế chấp, chuỗi cửa hàng… Nên để trẻ thắng 1 mùa Nhập môn trước.', () => { KHO = H.moKhoaDoanhNhan(KHO, d.v); luuHS(); }),
  // ván mới
  chonMua: (d) => { UI.cfg.mua = +d.v; },
  icon: (d) => { UI.cfg.ds[+d.i].icon = d.v; },
  loai: (d) => { const x = UI.cfg.ds[+d.i]; x.loai = d.v; if (d.v !== 'nguoi') x.hoSo = null; },
  ganHS: (d) => { const x = UI.cfg.ds[+d.i]; x.hoSo = d.v || null; const h0 = KHO.hoSo.find((h) => h.id === d.v); if (h0) x.icon = h0.icon; },
  ganKhu: (d) => { const x = UI.cfg.ds[+d.i]; x.khu = d.v; x.khuTay = true; },
  xoaNg: (d) => { UI.cfg.ds.splice(+d.i, 1); },
  themNg: () => { const c = UI.cfg, i = c.ds.length; c.ds.push({ ten: ['Tiệm Bánh Nắng', 'Tiệm Gấu Nâu', 'Tiệm Mèo Mun', 'Tiệm Thỏ Trắng'][i] || `Tiệm ${i + 1}`, icon: ICONS[(i * 3) % ICONS.length], loai: 'nguoi', hoSo: null, khu: chonKhuMay(c.ds.map((x) => x.khu), i) }); },
  batDau: () => {
    const c = UI.cfg;
    if (G && G.buoc !== 'het') return hoi('Bắt đầu ván mới?', 'Ván đang lưu sẽ bị thay bằng ván mới.', () => batDauVan(c));
    batDauVan(c);
  },
  // trong ván
  batDauKH: () => { G.buoc = 'luot'; luu(); tiepTheoLuot(); },
  daCam: () => { UI.daCam = true; },
  lapKH: () => { UI.view = 'kh'; window.scrollTo(0, 0); },
  xemBang: () => { UI.view = 'bang'; window.scrollTo(0, 0); },
  thiTruong: () => { UI.dlg = 'tt'; },
  tab: (d) => { UI.tab = d.v; window.scrollTo(0, 0); },
  so: (d) => doiSo(d.p, +d.d),
  chon,
  tuMua, goiY, xongLuot,
  ngayMoi,
  // câu đố
  daCamCD: () => { UI.daCamCD = G.cauDoLuot[0]; },
  cdChon: (d) => { UI.cdTraLoi = +d.v; const id = G.cauDoLuot[0]; const c = G.cauDo[id][(G.traLoi[id] || []).length]; phat(+d.v === c.dung ? 'tien' : 'loi'); },
  cdTiep: () => { const id = G.cauDoLuot[0]; (G.traLoi[id] ||= []).push(UI.cdTraLoi); UI.cdTraLoi = null; luu(); },
  cdXong: () => { G.cauDoLuot.shift(); UI.cdTraLoi = null; if (!G.cauDoLuot.length) traoCup(); luu(); window.scrollTo(0, 0); },
  choiLai: () => { batDauVan({ ...G.cfg, mua: G.st.mua }); },
  muaSau: () => { batDauVan({ ...G.cfg, mua: G.st.mua + 1 }); },
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-a]');
  if (!el || el.disabled) return;
  const f = HANH_DONG[el.dataset.a]; if (!f) return;
  if (f(el.dataset, el, e) === false) return;
  if (!['dongNen', 'cdChon'].includes(el.dataset.a)) phat('bam');
  render();
});
document.addEventListener('input', (e) => { const t = e.target; if (t.dataset.ten != null && UI.cfg) UI.cfg.ds[+t.dataset.ten].ten = t.value; });

render();
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !/localhost|127\.0\.0\.1/.test(location.hostname)) navigator.serviceWorker.register('sw.js').catch(() => {});
// Cho kiểm thử tự động
window.__game = { get G() { return G; }, get KHO() { return KHO; }, UI, render, HANH_DONG };
