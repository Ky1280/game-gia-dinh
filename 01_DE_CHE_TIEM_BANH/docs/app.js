// =====================================================================
// ĐẾ CHẾ TIỆM BÁNH — Giao diện chơi (chuyền máy, nhiều người 1 máy)
// =====================================================================
import * as E from './engine.js';
import { keHoachMay } from './doiThu.js';
import { nenGiaoDien, daiMua } from './nen.js';
import { phat, datTat } from './amThanh.js';

const { BANH, NGUYEN_LIEU, MUA, LUAT, THOI_TIET, SU_KIEN } = E;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const so = (n) => n.toLocaleString('vi-VN');
const xu = (n) => `${so(n)} xu`;
const dau = (n) => (n > 0 ? '+' : n < 0 ? '−' : '') + so(Math.abs(n));
const saoTxt = (u) => { const s = Math.max(0, Math.min(5, E.sao(u))); return '★'.repeat(s) + '☆'.repeat(5 - s); };
const PCOL = { A: ['#c4452f', '#3b7ea1', '#4c9a52', '#8a5cc4'], B: ['#ff5b93', '#4aa8ff', '#2fbf8f', '#b07cff'], C: ['#e8763a', '#5aa4c8', '#7fbf6a', '#c18cff'] };
const ICONS = ['👨', '👩', '🧒', '👧', '👴', '👵', '🐻', '🐱', '🐰', '🦊'];
const LOAI = { nguoi: '🙋 Người', de: '🤖 Máy Dễ', vua: '🤖 Máy Vừa', kho: '🤖 Máy Khó' };
const MUA_ICON = ['🎀', '🌧️', '🥮', '🎄', '🧧'];
const HUY_HIEU = { khongBo: '♻️ Không bỏ phí 3 ngày liền', namSao: '🌟 Giữ 5 sao 10 ngày', hetNo: '💰 Hết nợ cuối mùa' };
const LS = { cd: 'dctb-caidat', van: 'dctb-van', mo: 'dctb-mo' };

function doc(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }
function ghi(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch { /* bộ nhớ đầy hoặc bị chặn */ } }

let CD = Object.assign({ theme: 'A', tat: false, chuLon: false }, doc(LS.cd, {}));
let MO = Math.min(5, Math.max(1, Number(doc(LS.mo, 1)) || 1));
let G = doc(LS.van, null);          // { st, buoc:'sang'|'luot'|'toi'|'het', soLieu, soLieuToi, daMo }
if (G && (!G.st || G.st.phienBan !== 1)) G = null;
const UI = { man: 'menu', dlg: null, luot: null, daCam: false, view: 'bang', tab: 'lam', kh: null, cfg: null, xn: null };
datTat(CD.tat);

const luu = () => ghi(LS.van, G);
const luuCD = () => { ghi(LS.cd, CD); datTat(CD.tat); };
const soNguoi = () => G.st.nguoi.filter((p) => !p.may && !p.pha).length;
const mau = (id) => PCOL[CD.theme][id % 4];

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
function chiMua(st, kh) { return Object.entries(kh.mua).reduce((s, [nl, q]) => s + q * st.thiTruong.gia[nl], 0); }
function tienSau(st, p, kh) {
  let c = kh.thue * LUAT.phiThue + kh.saThai * LUAT.denBuSaThai + chiMua(st, kh) + kh.quangCao;
  if (kh.nangLo) c += LUAT.giaNangLo[p.lo] || 0;
  if (kh.mayDanh) c += LUAT.giaMayDanh;
  if (kh.chiNhanh) c += LUAT.giaChiNhanh;
  if (kh.nghienCuu) c += BANH[kh.nghienCuu].phiNC;
  return p.tien + kh.vay - kh.tra - c;
}
function khRong(st, p) {
  const gia = {};
  for (const b of E.banhDangCo(st)) if (E.daMoKhoa(st, p, b)) gia[b] = p.giaBan[b] ?? BANH[b].gia;
  return { vay: 0, tra: 0, thue: 0, saThai: 0, quangCao: 0, mua: {}, lam: {}, gia, nghienCuu: null, nangLo: false, mayDanh: false, chiNhanh: false, nhanDon: false };
}
function sach(kh) {
  const o = { mua: {}, lam: {}, gia: { ...kh.gia } };
  for (const [k, v] of Object.entries(kh.mua)) if (v > 0) o.mua[k] = v;
  for (const [k, v] of Object.entries(kh.lam)) if (v > 0) o.lam[k] = v;
  for (const k of ['vay', 'tra', 'thue', 'saThai', 'quangCao']) if (kh[k] > 0) o[k] = kh[k];
  if (kh.nghienCuu) o.nghienCuu = kh.nghienCuu;
  for (const k of ['nangLo', 'mayDanh', 'chiNhanh', 'nhanDon']) if (kh[k]) o[k] = true;
  return o;
}

// ---------------- Luồng ván ----------------
function ghiSoLieuSang() { G.soLieu = Object.fromEntries(G.st.nguoi.map((p) => [p.id, { tien: p.tien, no: p.no, chiMua: 0 }])); }
function batDauVan(cfg) {
  const st = E.taoVan({ seed: (Date.now() % 2147483647) | 0, mua: cfg.mua, nguoiChoi: cfg.ds.map((x) => ({ ten: x.ten.trim() || 'Tiệm bánh', icon: x.icon, may: x.loai === 'nguoi' ? null : x.loai })) });
  G = { st, buoc: 'sang', cfg: JSON.parse(JSON.stringify(cfg)) };
  ghiSoLieuSang(); luu();
  UI.man = 'game'; UI.luot = null;
}
function tiepTheoLuot() {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  let st = G.st;
  for (;;) {
    const ds = E.choNop(st);
    if (!ds.length) {
      G.soLieuToi = G.soLieu; G.st = E.ketThucNgay(st); G.buoc = 'toi'; UI.luot = null; luu(); phat('ngay'); window.scrollTo(0, 0); return;
    }
    const id = ds[0], p = st.nguoi[id];
    if (p.may) {
      let kh; try { kh = keHoachMay(st, id, p.may); st = E.nopKeHoach(st, id, kh); } catch { st = E.nopKeHoach(st, id, {}); }
      continue;
    }
    G.st = st; UI.luot = id; UI.daCam = soNguoi() <= 1; UI.view = 'bang'; UI.tab = 'lam'; UI.kh = khRong(st, p); luu(); window.scrollTo(0, 0); return;
  }
}
function xongLuot() {
  const st = G.st, id = UI.luot, kh = sach(UI.kh);
  try { G.st = E.nopKeHoach(st, id, kh); } catch (e) { phat('loi'); toast(e.message); return; }
  G.soLieu[id].chiMua = chiMua(st, UI.kh);
  phat('tien'); tiepTheoLuot();
}
function ngayMoi() {
  if (G.st.ketThuc) {
    G.buoc = 'het';
    if (!G.daMo) { G.daMo = true; if (G.st.mua === MO && MO < 5) { MO += 1; ghi(LS.mo, MO); } }
    phat('thang');
  } else { G.buoc = 'sang'; ghiSoLieuSang(); }
  luu(); window.scrollTo(0, 0);
}

// ---------------- Mảnh giao diện chung ----------------
function thanhTren(tieuDe, veMenu = true) {
  return `<div class="top">${veMenu ? '<button data-a="veMenu" aria-label="Về menu">🏠</button>' : '<button data-a="veMenu" aria-label="Quay lại">←</button>'}
  <div class="t">${tieuDe}</div><button data-a="am" aria-label="Âm thanh">${CD.tat ? '🔇' : '🔊'}</button><button data-a="cd" aria-label="Cài đặt">⚙️</button></div>`;
}
const dai = (mua, chu) => `<div class="strip full" style="background-image:${daiMua(CD.theme, mua)}"><span>${chu}</span></div>`;
const buocSo = (path, val, { x5 = false, ds = '' } = {}) => `<div class="step">${x5 ? `<button class="x5" data-a="so" data-p="${path}" data-d="-5" ${ds}>−5</button>` : ''}<button data-a="so" data-p="${path}" data-d="-1">−</button><span>${val}</span><button data-a="so" data-p="${path}" data-d="1">+</button>${x5 ? `<button class="x5" data-a="so" data-p="${path}" data-d="5">+5</button>` : ''}</div>`;
const tieuDeNgay = (st) => `${MUA_ICON[st.mua - 1]} ${MUA[st.mua - 1].ten} · Ngày ${Math.min(st.ngay, MUA[st.mua - 1].ngay)}/${MUA[st.mua - 1].ngay}`;
function bangXepHang(st, cuoi = false) {
  return E.xepHang(st, cuoi).map((x, k) => {
    const p = st.nguoi[x.id];
    return `<div class="r"><span class="no" style="background:${mau(x.id)}">${x.pha ? '✖' : k + 1}</span><span class="nm">${p.icon} ${esc(p.ten)}${p.may ? ' <small>🤖</small>' : ''}</span><span class="star">${saoTxt(p.uyTin)}</span><span class="v">${x.pha ? 'Tạm đóng' : so(x.giaTri)}</span></div>`;
  }).join('');
}

// ---------------- Màn: Menu ----------------
function manMenu() {
  const coVan = G && G.buoc !== 'het';
  const muaHien = coVan ? G.st.mua : MO;
  return `<div class="menu">
   <div class="title"><div class="logo">🥐</div><h1>Đế chế<br>Tiệm Bánh</h1><div class="tag">Ai sẽ là ông chủ tiệm bánh giỏi nhất phố?</div></div>
   ${dai(muaHien, `${MUA_ICON[muaHien - 1]} ${MUA[muaHien - 1].ten}`)}
   <div style="margin-bottom:auto"></div>
   <div class="seasons">${MUA.map((m, i) => `<div class="${i + 1 > MO ? 'khoa' : ''}"><b>${i + 1 > MO ? '🔒' : MUA_ICON[i]}</b>${m.ten}</div>`).join('')}</div>
   ${coVan ? `<button class="btn" data-a="tiep">▶ Chơi tiếp · Mùa ${G.st.mua}, ngày ${G.st.ngay}</button>` : ''}
   <button class="btn ${coVan ? 'alt' : ''}" data-a="moi">＋ Ván mới</button>
   <div class="g2" style="width:100%"><button class="btn ghost" data-a="hd">📖 Hướng dẫn</button><button class="btn ghost" data-a="cd">⚙️ Cài đặt</button></div>
  </div>`;
}

// ---------------- Màn: Ván mới ----------------
function cfgMacDinh() {
  const cu = G?.cfg;
  return cu ? { mua: Math.min(cu.mua, MO), ds: cu.ds.map((x) => ({ ...x })) }
    : { mua: MO, ds: [{ ten: 'Tiệm Bánh Nắng', icon: '👨', loai: 'nguoi' }, { ten: 'Tiệm Gấu Nâu', icon: '🐻', loai: 'vua' }] };
}
function manMoi() {
  const c = UI.cfg;
  const nguoi = c.ds.filter((x) => x.loai === 'nguoi').length;
  return `${thanhTren('Ván mới', false)}<div class="scr">
   <div class="card"><div class="lbl">Chọn mùa</div><div class="opt">${MUA.map((m, i) => `<button data-a="chonMua" data-v="${i + 1}" class="${c.mua === i + 1 ? 'on' : ''}" ${i + 1 > MO ? 'disabled' : ''}>${i + 1 > MO ? '🔒' : MUA_ICON[i]} ${i + 1}. ${m.ten}</button>`).join('')}</div>
    <p class="note mute" style="margin-top:6px">${MUA[c.mua - 1].ngay} ngày. Chơi xong một mùa thì mở khoá mùa sau.</p></div>
   <div class="lbl" style="margin:4px 2px 6px">Các tiệm (2–4 tiệm, ít nhất 1 người thật)</div>
   ${c.ds.map((x, i) => `<div class="pl" style="border-left:6px solid ${mau(i)}">
     <div class="row"><span style="font-size:1.5rem">${x.icon}</span><input maxlength="18" data-ten="${i}" value="${esc(x.ten)}" placeholder="Tên tiệm" aria-label="Tên tiệm ${i + 1}">
     ${c.ds.length > 2 ? `<button class="btn ghost sm" style="width:auto" data-a="xoaNg" data-i="${i}">✕</button>` : ''}</div>
     <div class="icons">${ICONS.map((ic) => `<button data-a="icon" data-i="${i}" data-v="${ic}" class="${x.icon === ic ? 'on' : ''}">${ic}</button>`).join('')}</div>
     <div class="opt">${Object.entries(LOAI).map(([k, t]) => `<button data-a="loai" data-i="${i}" data-v="${k}" class="${x.loai === k ? 'on' : ''}">${t}</button>`).join('')}</div></div>`).join('')}
   ${c.ds.length < 4 ? '<button class="btn ghost" data-a="themNg">＋ Thêm tiệm</button>' : ''}
  </div><div class="act">${nguoi ? '' : '<div class="msg warn">Cần ít nhất 1 người thật chơi</div>'}<button class="btn" data-a="batDau" ${nguoi ? '' : 'disabled'}>Mở cửa tiệm! ▶</button></div>`;
}

// ---------------- Màn: Buổi sáng (cả nhà xem) ----------------
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
  const st = G.st, p = st.nguoi[UI.luot];
  const kho = Object.keys(NGUYEN_LIEU).filter((nl) => khoDung(st, p, nl) > 0).map((nl) => {
    const h = hanGanNhat(st, p.kho[nl]);
    return `<div>${NGUYEN_LIEU[nl].icon}<b>${khoDung(st, p, nl)}</b>${h <= 1 ? '<span class="warn">hết hạn hôm nay!</span>' : `còn ${h} ngày`}</div>`;
  }).join('');
  const hang = Object.keys(BANH).filter((b) => hangDung(st, p, b) > 0).map((b) => {
    const h = hanGanNhat(st, p.hang[b]);
    return `<div>${BANH[b].icon}<b>${hangDung(st, p, b)}</b>${h <= 1 ? '<span class="warn">bán hôm nay</span>' : `còn ${h} ngày`}</div>`;
  }).join('');
  const don = st.donDat.filter((d) => d.nguoi === p.id).map((d) => `<li>Giao <b>${d.sl} ${BANH[d.banh].ten}</b> ngày ${d.han} (thiếu bị phạt)</li>`).join('');
  return `${thanhTren(tieuDeNgay(st))}<div class="scr cot2">
   <div class="hd full"><h3>${p.icon} ${esc(p.ten)}</h3><span class="chip" style="background:${mau(p.id)}">Lượt của bạn</span></div>
   ${dai(st.mua, `${MUA_ICON[st.mua - 1]} ${MUA[st.mua - 1].ten} · Ngày ${st.ngay}`)}
   <div class="card"><div class="lbl">Tiền mặt</div><div class="big ${p.tien < 0 ? 'neg' : ''}">${xu(p.tien)}</div>
    <div class="g3"><div class="mini"><span class="lbl">Uy tín</span><b class="star">${saoTxt(p.uyTin)}</b></div><div class="mini"><span class="lbl">Nợ</span><b>${so(p.no)}</b></div><div class="mini"><span class="lbl">Thợ · công</span><b>${p.tho.length} · ${E.congTho(st, p)}</b></div></div>
    <div class="g3"><div class="mini"><span class="lbl">Lò</span><b>Cấp ${p.lo} · ${E.sucLo(st, p)}</b></div><div class="mini"><span class="lbl">Máy đánh</span><b>${p.mayDanh ? 'Có' : 'Chưa'}</b></div><div class="mini"><span class="lbl">Chi nhánh</span><b>${p.chiNhanh}</b></div></div>
    ${p.tien < 0 ? '<p class="note warn" style="margin-top:6px">Tiền đang âm! Âm 2 ngày liền mà không vay thêm được thì tiệm phải tạm đóng.</p>' : ''}</div>
   ${theSuKien(st)}
   <div class="card"><div class="lbl">Kho nguyên liệu</div>${kho ? `<div class="stock">${kho}</div>` : '<p class="note mute">Kho trống, nhớ mua nguyên liệu.</p>'}</div>
   <div class="card"><div class="lbl">Bánh còn bán được</div>${hang ? `<div class="stock">${hang}</div>` : '<p class="note mute">Chưa có bánh tồn.</p>'}
    ${p.nghienCuu ? `<p class="note" style="margin-top:6px">🔬 Đang nghiên cứu ${BANH[p.nghienCuu.banh].ten}, còn ${p.nghienCuu.con} ngày.</p>` : ''}
    ${don ? `<ul class="note" style="margin:6px 0 0 18px">${don}</ul>` : ''}
    ${p.huyHieu.length ? `<p class="note" style="margin-top:6px">${p.huyHieu.map((h) => HUY_HIEU[h]).join(' · ')}</p>` : ''}</div>
  </div><div class="act"><button class="btn" data-a="lapKH">Lập kế hoạch hôm nay →</button></div>`;
}

// ---------------- Màn: Kế hoạch ----------------
function tabMua(st, p, kh) {
  const can = canNL(kh);
  const ds = Object.entries(NGUYEN_LIEU).map(([nl, n]) => {
    const g = st.thiTruong.gia[nl], co = khoDung(st, p, nl), m = kh.mua[nl] || 0, c = can[nl] || 0;
    const thieu = c > co + m;
    return `<div class="item"><span class="ic">${n.icon}</span><span class="nm"><b>${n.ten}</b> · ${g} xu<small>Kho ${co}${c ? ` · cần ${c}` : ''} · để được ${E.hanNL(st, nl)} ngày${thieu ? ` · <span class="warn">thiếu ${c - co - m}</span>` : ''}</small></span>${buocSo(`mua.${nl}`, m, { x5: true })}</div>`;
  }).join('');
  return `<div class="card"><div class="row"><div class="sp"><div class="lbl">Tiền mua hôm nay</div><b>${xu(chiMua(st, kh))}</b></div><button class="btn ghost sm" style="width:auto" data-a="tuMua">🛒 Mua đủ cho bánh</button></div></div><div class="card">${ds}</div>
  <p class="note mute" style="margin:0 4px 8px">Trứng, sữa, trái cây mau hỏng. Nguyên liệu quá hạn sẽ bị bỏ.</p>`;
}
function tabLam(st, p, kh) {
  let cong = 0, me = 0;
  for (const [b, sl] of Object.entries(kh.lam)) { cong += E.congBanh(p, b) * sl; me += sl; }
  const cT = E.congTho(st, p), lT = E.sucLo(st, p);
  const can = canNL(kh), thieu = Object.entries(can).filter(([nl, c]) => c > khoDung(st, p, nl) + (kh.mua[nl] || 0));
  const ds = E.banhDangCo(st).map((b) => {
    const B = BANH[b];
    if (!E.daMoKhoa(st, p, b)) return `<div class="item"><span class="ic" style="opacity:.5">${B.icon}</span><span class="nm"><b>${B.ten}</b> 🔒<small>Cần nghiên cứu (${B.phiNC} xu, ${LUAT.ngayNghienCuu} ngày) ở thẻ Tiệm</small></span></div>`;
    const ct = Object.entries(B.ct).map(([nl, q]) => `${q}${NGUYEN_LIEU[nl].icon}`).join(' ');
    const ton = hangDung(st, p, b);
    return `<div class="item"><span class="ic">${B.icon}</span><span class="nm"><b>${B.ten}</b>${B.mo === 'mua' ? ' ✨' : ''}<small>${ct} · ${E.congBanh(p, b)} công · bán ${B.han} ngày${ton ? ` · tồn ${ton}` : ''}</small></span>${buocSo(`lam.${b}`, kh.lam[b] || 0, { x5: true })}</div>`;
  }).join('');
  return `<div class="card"><div class="lbl">Công thợ ${cong}/${cT} · Lò ${me}/${lT} bánh</div>
   <div class="bar ${cong > cT ? 'over' : ''}"><i style="width:${Math.min(100, cT ? (cong * 100) / cT : 0)}%"></i></div>
   <div class="bar ${me > lT ? 'over' : ''}"><i style="width:${Math.min(100, (me * 100) / lT)}%"></i></div></div>
   ${thieu.length ? `<div class="card"><p class="note warn">Thiếu ${thieu.map(([nl, c]) => `${c - khoDung(st, p, nl) - (kh.mua[nl] || 0)} ${NGUYEN_LIEU[nl].ten}`).join(', ')}.</p><button class="btn alt sm" style="margin-top:6px" data-a="tuMua">🛒 Tự mua phần còn thiếu</button></div>` : ''}
   <div class="card">${ds}</div>`;
}
function tabGia(st, p, kh) {
  const ds = Object.keys(kh.gia).map((b) => {
    const B = BANH[b], g = kh.gia[b], pt = Math.floor((g * 100) / B.gia);
    const nx = pt > 140 ? '<span class="warn">rất đắt: khách bỏ về, mất uy tín</span>' : pt > 120 ? '<span class="warn">đắt: khách bỏ về, trừ uy tín</span>' : pt > 110 ? 'hơi đắt: ít khách hơn' : pt < 85 ? 'rẻ: đông khách nhưng ít lãi' : 'hợp lý';
    const hq = p.homQua?.ban?.[b];
    return `<div class="item"><span class="ic">${B.icon}</span><span class="nm"><b>${B.ten}</b> · ${pt}%<small>Gợi ý ${B.gia} xu · ${nx}${hq ? ` · hôm qua bán ${hq}` : ''}</small></span>${buocSo(`gia.${b}`, g)}</div>`;
  }).join('');
  return `<div class="card">${ds}</div><p class="note mute" style="margin:0 4px 8px">Khách so giá giữa các tiệm. Giá quanh 100% giá gợi ý thường lãi nhất.</p>`;
}
function tabTiem(st, p, kh) {
  const m = MUA[st.mua - 1], sk = E.suKienHomNay(st);
  const nc = ['sukem', 'tart', 'banhkem'].filter((b) => !p.moKhoa.includes(b));
  const hm = E.hanMucVay(st, p);
  let h = `<div class="card"><div class="lbl">👩‍🍳 Thợ (lương ${LUAT.luongTho} xu/ngày)</div>
   <div class="item"><span class="ic">➕</span><span class="nm">Thuê thêm<small>Phí ${LUAT.phiThue} xu/người · thợ mới làm ${LUAT.congMoi} công, sau ${LUAT.ngayThao} ngày lên ${LUAT.congThao}</small></span>${buocSo('thue', kh.thue)}</div>
   <div class="item"><span class="ic">➖</span><span class="nm">Cho nghỉ<small>Đền ${LUAT.denBuSaThai} xu/người · đang có ${p.tho.length} thợ</small></span>${buocSo('saThai', kh.saThai)}</div></div>
   <div class="card"><div class="lbl">🏦 Vay và trả nợ (lãi 1%/ngày)</div>
   <div class="item"><span class="ic">💵</span><span class="nm">Vay thêm<small>Còn vay được ${xu(hm)} · hết mùa còn nợ bị trừ gấp đôi</small></span>${buocSo('vay', kh.vay, { x5: true })}</div>
   <div class="item"><span class="ic">✅</span><span class="nm">Trả nợ<small>Đang nợ ${xu(p.no)}</small></span>${buocSo('tra', kh.tra, { x5: true })}</div>
   <p class="note mute">Nút ±1 là 10 xu, ±5 là 50 xu.</p></div>
   <div class="card"><div class="lbl">📣 Quảng cáo hôm nay</div><div class="opt">${[0, 10, 20, 40, 60].map((v) => `<button data-a="chon" data-p="quangCao" data-v="${v}" class="${kh.quangCao === v ? 'on' : ''}">${v ? v + ' xu' : 'Không'}</button>`).join('')}</div>
    <p class="note mute" style="margin-top:6px">Tăng sức hút của tiệm, hiệu quả giảm dần qua các ngày.</p></div>`;
  if (m.nghienCuu) {
    h += `<div class="card"><div class="lbl">🔬 Nghiên cứu công thức (${LUAT.ngayNghienCuu} ngày)</div>${p.nghienCuu ? `<p class="note">Đang nghiên cứu ${BANH[p.nghienCuu.banh].ten}, còn ${p.nghienCuu.con} ngày.</p>`
      : nc.length ? `<div class="opt"><button data-a="chon" data-p="nghienCuu" data-v="" class="${!kh.nghienCuu ? 'on' : ''}">Không</button>${nc.map((b) => `<button data-a="chon" data-p="nghienCuu" data-v="${b}" class="${kh.nghienCuu === b ? 'on' : ''}">${BANH[b].icon} ${BANH[b].ten} · ${BANH[b].phiNC} xu</button>`).join('')}</div>` : '<p class="note">Đã có đủ công thức.</p>'}</div>`;
  }
  const dt = [];
  if (p.lo < LUAT.lo.length) dt.push(['nangLo', `🔥 Nâng lò lên cấp ${p.lo + 1} (${LUAT.lo[p.lo]} bánh/ngày)`, LUAT.giaNangLo[p.lo]]);
  if (!p.mayDanh) dt.push(['mayDanh', '🌀 Máy đánh trứng (bông lan, su kem, bánh kem bớt 1 công)', LUAT.giaMayDanh]);
  if (m.chiNhanh && p.chiNhanh < 2) dt.push(['chiNhanh', `🏪 Mở chi nhánh (có khách riêng, thuê ${LUAT.thueChiNhanh} xu/ngày)`, LUAT.giaChiNhanh]);
  if (dt.length) h += `<div class="card"><div class="lbl">🛠️ Đầu tư</div>${dt.map(([k, t, g]) => `<div class="item"><span class="nm">${t}<small>${xu(g)}</small></span><button class="btn ${kh[k] ? '' : 'ghost'} sm" style="width:auto" data-a="chon" data-p="${k}" data-v="${kh[k] ? '' : '1'}">${kh[k] ? '✓ Đã chọn' : 'Chọn'}</button></div>`).join('')}</div>`;
  if (sk.loai === 'donDat' && st.suKien.don) {
    const d = st.suKien.don;
    h += `<div class="card ev"><div class="lbl">📦 Đơn đặt tiệc</div><p class="note">${d.sl} ${BANH[d.banh].icon} ${BANH[d.banh].ten}, giao ngày ${d.han}, ${d.gia} xu/cái. Thiếu bị phạt và mất uy tín.${E.daMoKhoa(st, p, d.banh) ? '' : ' <b>Bạn chưa có công thức này.</b>'}</p>
     <button class="btn ${kh.nhanDon ? '' : 'alt'} sm" style="margin-top:6px" data-a="chon" data-p="nhanDon" data-v="${kh.nhanDon ? '' : '1'}">${kh.nhanDon ? '✓ Đã nhận đơn (bấm để bỏ)' : 'Nhận đơn này'}</button></div>`;
  }
  return h;
}
function manKeHoach() {
  const st = G.st, p = st.nguoi[UI.luot], kh = UI.kh;
  const kq = E.kiemTraKeHoach(st, p.id, sach(kh));
  const sau = tienSau(st, p, kh);
  const TAB = { mua: ['🛒', 'Mua', tabMua], lam: ['🧁', 'Làm', tabLam], gia: ['🏷️', 'Giá', tabGia], tiem: ['🏪', 'Tiệm', tabTiem] };
  return `${thanhTren(tieuDeNgay(st))}<div class="scr">
   <div class="hd"><h3>📋 ${p.icon} ${esc(p.ten)}</h3><button class="chip" style="background:${mau(p.id)};border:0" data-a="xemBang">${xu(p.tien)} · xem tiệm</button></div>
   <div class="tabs">${Object.entries(TAB).map(([k, [ic, t]]) => `<button data-a="tab" data-v="${k}" class="${UI.tab === k ? 'on' : ''}">${ic} ${t}</button>`).join('')}</div>
   ${TAB[UI.tab][2](st, p, kh)}
  </div><div class="act"><div class="msg ${kq.ok ? '' : 'warn'}">${kq.ok ? `Tiền sau khi chi: <b class="${sau < 0 ? 'neg' : ''}">${xu(sau)}</b>` : '⚠️ ' + esc(kq.loi[0])}</div>
   <div class="g2"><button class="btn ghost" data-a="goiY">🤖 Gợi ý</button><button class="btn" data-a="xongLuot" ${kq.ok ? '' : 'disabled'}>Xong lượt ✓</button></div></div>`;
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
  }
  return tin.length ? tin : ['🙂 Một ngày bình yên trên phố bánh.'];
}
function manToi() {
  const st = G.st, bc = st.baoCao[st.baoCao.length - 1], sl = G.soLieuToi || {};
  const sk = SU_KIEN.find((s) => s.id === bc.suKien);
  const muaRoi = Math.min(st.mua, 5);
  const the = Object.entries(bc.nguoi).map(([id, r]) => {
    const p = st.nguoi[id], s = sl[id] || { tien: p.tien, no: p.no, chiMua: 0 };
    const ban = Object.values(r.ban).reduce((a, x) => a + x, 0);
    const cp = (r.chiPhi.luong || 0) + (r.chiPhi.thue || 0) + (r.chiPhi.lai || 0);
    const doi = (p.tien - p.no) - (s.tien - s.no);
    return `<div class="card"><div class="lbl" style="color:${mau(+id)}">${p.icon} ${esc(p.ten)}</div><table class="tbl">
     <tr><td>Bán ${ban} bánh${r.khach ? ` (${r.khach} khách)` : ''}</td><td class="pos">+${so(r.doanhThu)}</td></tr>
     <tr><td>Mua nguyên liệu</td><td class="neg">−${so(s.chiMua || 0)}</td></tr>
     <tr><td>Lương + thuê nhà + lãi</td><td class="neg">−${so(cp)}</td></tr>
     ${r.chiPhi.phatDon ? `<tr><td>Phạt đơn</td><td class="neg">−${so(r.chiPhi.phatDon)}</td></tr>` : ''}
     <tr><td><b>Tài sản tăng/giảm</b> <small>(gồm cả đầu tư)</small></td><td class="${doi >= 0 ? 'pos' : 'neg'}">${dau(doi)} xu</td></tr></table></div>`;
  }).join('');
  return `${thanhTren(`${MUA_ICON[muaRoi - 1]} ${MUA[muaRoi - 1].ten} · Tối ngày ${bc.ngay}`)}<div class="scr cot2">
   <div class="hd full"><h3>🌙 Báo cáo tối</h3><span class="chip" style="background:${mau(0)}">Cả nhà xem</span></div>
   <div class="card"><div class="lbl">🏆 Giá trị tiệm</div>${bangXepHang(st)}</div>
   <div class="card"><div class="lbl">📣 Chuyện trên phố · ${sk.icon} ${sk.ten}</div><p class="note" style="margin-top:4px">${tinPho(st, bc).join('<br>')}</p></div>
   ${the}
  </div><div class="act"><button class="btn" data-a="ngayMoi">${st.ketThuc ? 'Xem kết quả mùa 🏁' : `Sang ngày ${st.ngay} ☀️`}</button></div>`;
}

// ---------------- Màn: Hết mùa ----------------
function manHet() {
  const st = G.st, xh = st.xepHang || E.xepHang(st, true), nhat = st.nguoi[xh[0].id];
  const sau = st.mua < 5 && st.mua + 1 <= MO;
  return `${thanhTren(`${MUA_ICON[st.mua - 1]} Hết mùa ${MUA[st.mua - 1].ten}`)}<div class="scr cot2">
   ${dai(st.mua, `🏁 Kết thúc mùa ${MUA[st.mua - 1].ten}`)}
   <div class="card" style="text-align:center"><div style="font-size:3rem">👑</div><h3>${nhat.icon} ${esc(nhat.ten)}</h3><p class="note">là tiệm bánh giỏi nhất phố mùa này!</p></div>
   <div class="card"><div class="lbl">Xếp hạng cuối mùa (nợ còn lại bị trừ gấp đôi)</div>${bangXepHang(st, true)}</div>
   <div class="card"><div class="lbl">🎖️ Huy hiệu</div><p class="note" style="margin-top:4px">${st.nguoi.map((p) => `${p.icon} ${esc(p.ten)}: ${p.huyHieu.length ? p.huyHieu.map((h) => HUY_HIEU[h]).join(', ') : 'chưa có'}`).join('<br>')}</p>
    ${sau ? `<p class="note pos" style="margin-top:6px"><b>🔓 Đã mở mùa ${st.mua + 1}: ${MUA[st.mua].ten}!</b></p>` : ''}</div>
  </div><div class="act"><div class="g2">${sau ? `<button class="btn" data-a="muaSau">Sang mùa ${st.mua + 1} ▶</button>` : ''}<button class="btn ${sau ? 'ghost' : ''}" data-a="choiLai">Chơi lại mùa này</button></div>
   <button class="btn ghost" style="margin-top:8px" data-a="veMenu">🏠 Về menu</button></div>`;
}

// ---------------- Lớp phủ: chuyền máy, cài đặt, hướng dẫn ----------------
function lopPhu() {
  let h = '';
  if (UI.man === 'game' && G?.buoc === 'luot' && UI.luot != null && !UI.daCam) {
    const p = G.st.nguoi[UI.luot];
    h += `<div class="ov"><div class="av">${p.icon}</div><h3>Đưa máy cho<br>${esc(p.ten)}</h3><p>Người khác đừng nhìn nhé!<br>Kế hoạch của tiệm trước đã được giấu.</p><button class="go" data-a="daCam">Tôi đã cầm máy ✓</button></div>`;
  }
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
     <p>Mỗi người làm chủ 1 tiệm bánh trên cùng một phố. Hết mùa, tiệm có <b>giá trị cao nhất</b> thắng (tiền + đồ đã đầu tư − nợ).</p>
     <h4>Mỗi ngày có 4 bước</h4><ul><li><b>Buổi sáng:</b> cả nhà xem thời tiết, sự kiện, giá chợ.</li><li><b>Lập kế hoạch:</b> chuyền máy lần lượt. Mua nguyên liệu, làm bánh, đặt giá, quản lý tiệm. Bấm "Xong lượt" rồi đưa máy cho người sau.</li><li><b>Mở cửa bán:</b> máy tự chia khách theo giá, uy tín và quảng cáo của từng tiệm.</li><li><b>Báo cáo tối:</b> xem ai lãi, ai lỗ, chuyện gì xảy ra trên phố.</li></ul>
     <h4>Mẹo</h4><ul><li>Làm bánh cần nguyên liệu, <b>công thợ</b> và <b>chỗ trong lò</b>.</li><li>Giá quá đắt thì khách bỏ về và tiệm mất uy tín. Giá quá rẻ thì ít lãi.</li><li>Trứng, sữa, trái cây mau hỏng; bánh mì, su kem, tart chỉ bán trong ngày.</li><li>Hết bánh thì khách sang tiệm khác. Làm thừa thì phải bỏ.</li><li>Vay được nhưng mất lãi mỗi ngày; hết mùa còn nợ bị trừ gấp đôi.</li><li>Bí quá thì bấm <b>🤖 Gợi ý</b> để máy điền giúp, rồi sửa lại.</li></ul>
     <h4>Mùa vụ</h4><p>5 mùa mở lần lượt: Khai trương → Mùa mưa (nghiên cứu, đơn tiệc) → Trung thu (bánh mùa vụ, chi nhánh) → Giáng sinh → Tết.</p>
     <button class="btn" style="margin-top:12px" data-a="dong">Đã hiểu</button></div></div>`;
  }
  if (UI.dlg === 'xn') {
    h += `<div class="dlg"><div class="box"><h3>${UI.xn.tieuDe}</h3><p class="note">${UI.xn.noiDung}</p><div class="g2" style="margin-top:12px"><button class="btn ghost" data-a="dong">Không</button><button class="btn alt" data-a="dongY">Đồng ý</button></div></div></div>`;
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
  $('#app').innerHTML = UI.man === 'moi' ? manMoi() : UI.man === 'game' ? manGame() : manMenu();
  $('#ov').innerHTML = lopPhu();
}

// ---------------- Thao tác ----------------
function doiSo(path, d) {
  const kh = UI.kh, st = G.st, p = st.nguoi[UI.luot];
  const [a, b] = path.split('.');
  if (b) {
    const cu = kh[a][b] || 0;
    if (a === 'gia') kh.gia[b] = Math.max(1, Math.min(BANH[b].gia * 3, cu + d));
    else kh[a][b] = Math.max(0, cu + d);
    return;
  }
  if (a === 'vay') kh.vay = Math.max(0, Math.min(E.hanMucVay(st, p), kh.vay + d * 10));
  else if (a === 'tra') kh.tra = Math.max(0, Math.min(p.no, kh.tra + d * 10));
  else if (a === 'thue') kh.thue = Math.max(0, Math.min(12 - p.tho.length + kh.saThai, kh.thue + d));
  else if (a === 'saThai') kh.saThai = Math.max(0, Math.min(p.tho.length - 1, kh.saThai + d));
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
  const kh = khRong(st, p);
  Object.assign(kh, { vay: k.vay || 0, tra: k.tra || 0, thue: k.thue || 0, saThai: k.saThai || 0, quangCao: k.quangCao || 0, mua: { ...(k.mua || {}) }, lam: { ...(k.lam || {}) }, nghienCuu: k.nghienCuu || null, nangLo: !!k.nangLo, mayDanh: !!k.mayDanh, chiNhanh: !!k.chiNhanh, nhanDon: !!k.nhanDon });
  Object.assign(kh.gia, k.gia || {});
  if (![10, 20, 40, 60].includes(kh.quangCao)) kh.quangCao = kh.quangCao ? 20 : 0;
  UI.kh = kh; UI.tab = 'lam';
  toast('Máy đã điền gợi ý. Bạn xem lại và sửa nếu muốn.');
}
function hoi(tieuDe, noiDung, lam) { UI.xn = { tieuDe, noiDung, lam }; UI.dlg = 'xn'; }

const HANH_DONG = {
  veMenu: () => { UI.man = 'menu'; UI.luot = null; },
  tiep: () => { UI.man = 'game'; UI.luot = null; },
  moi: () => { UI.cfg = cfgMacDinh(); UI.man = 'moi'; },
  hd: () => { UI.dlg = 'hd'; }, cd: () => { UI.dlg = 'cd'; }, dong: () => { UI.dlg = null; },
  dongNen: (d, el, e) => { if (e.target === el) UI.dlg = null; else return false; },
  dongY: () => { const f = UI.xn?.lam; UI.dlg = null; UI.xn = null; f?.(); },
  theme: (d) => { CD.theme = d.v; luuCD(); },
  am: () => { CD.tat = !CD.tat; luuCD(); },
  chu: () => { CD.chuLon = !CD.chuLon; luuCD(); },
  boVan: () => hoi('Bỏ ván đang lưu?', 'Ván đang chơi sẽ bị xoá và không lấy lại được.', () => { G = null; ghi(LS.van, null); UI.man = 'menu'; }),
  chonMua: (d) => { UI.cfg.mua = +d.v; },
  icon: (d) => { UI.cfg.ds[+d.i].icon = d.v; },
  loai: (d) => { UI.cfg.ds[+d.i].loai = d.v; },
  xoaNg: (d) => { UI.cfg.ds.splice(+d.i, 1); },
  themNg: () => { const i = UI.cfg.ds.length; UI.cfg.ds.push({ ten: ['Tiệm Bánh Nắng', 'Tiệm Gấu Nâu', 'Tiệm Mèo Mun', 'Tiệm Thỏ Trắng'][i] || `Tiệm ${i + 1}`, icon: ICONS[(i * 3) % ICONS.length], loai: 'nguoi' }); },
  batDau: () => {
    const c = UI.cfg;
    const run = () => { batDauVan(c); };
    if (G && G.buoc !== 'het') return hoi('Bắt đầu ván mới?', 'Ván đang lưu sẽ bị thay bằng ván mới.', run);
    run();
  },
  batDauKH: () => { G.buoc = 'luot'; luu(); tiepTheoLuot(); },
  daCam: () => { UI.daCam = true; },
  lapKH: () => { UI.view = 'kh'; window.scrollTo(0, 0); },
  xemBang: () => { UI.view = 'bang'; window.scrollTo(0, 0); },
  tab: (d) => { UI.tab = d.v; window.scrollTo(0, 0); },
  so: (d) => doiSo(d.p, +d.d),
  chon: (d) => { const k = d.p; UI.kh[k] = k === 'quangCao' ? +d.v : k === 'nghienCuu' ? (d.v || null) : !!d.v; },
  tuMua, goiY, xongLuot,
  ngayMoi,
  choiLai: () => { batDauVan({ ...G.cfg, mua: G.st.mua }); },
  muaSau: () => { batDauVan({ ...G.cfg, mua: G.st.mua + 1 }); },
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-a]');
  if (!el || el.disabled) return;
  const f = HANH_DONG[el.dataset.a]; if (!f) return;
  if (f(el.dataset, el, e) === false) return;
  if (el.dataset.a !== 'dongNen') phat('bam');
  render();
});
document.addEventListener('input', (e) => { const t = e.target; if (t.dataset.ten != null && UI.cfg) UI.cfg.ds[+t.dataset.ten].ten = t.value; });

render();
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !/localhost|127\.0\.0\.1/.test(location.hostname)) navigator.serviceWorker.register('sw.js').catch(() => {});
// Cho kiểm thử tự động
window.__game = { get G() { return G; }, UI, render, HANH_DONG };
