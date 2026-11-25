// Mô phỏng cân bằng CHẾ ĐỘ DOANH NHÂN: node tools/mophongDN.js [soVan=600]
//  C1  Khó thắng nhiều nhất, hạng TB Khó < Vừa < Dễ (ván 3 tiệm, máy tự chọn khu)
//  C3  Máy Vừa có lãi ở mọi mùa (giá trị cuối mùa TB > 1.000)
//  C4  Máy Vừa phá sản < 5%
//  C5  Uy tín cuối mùa máy Vừa TB ≥ 200
//  C6  Không chiến thuật mới nào thắng chắc: mỗi biến thể (1 máy Vừa dùng, đấu 2 máy Vừa) thắng < 50% (công bằng 33%)
//  C7  Đầu tư trải nghiệm có lời trong 1 mùa: cùng hạt giống, tiệm có đầu tư trải nghiệm + dọn dẹp > tiệm không
//  C8  Chọn khu hợp lý có lợi rõ: lãi khi chọn khu vắng ≥ 110% lãi khi chen vào khu có 2 đối thủ
//  C9  Mất tài sản thế chấp < 10% số ván (biến thể thế chấp tối đa) và máy Vừa phá sản < 5%
//  C10 Số việc máy Khó quyết định mỗi ngày TB ≤ 10 (đại diện cho "ván vẫn gọn"; đo thật ở bước giao diện)
import * as E from '../docs/engine.js';
import { keHoachMay, chonKhuMay } from '../docs/doiThu.js';

const N = Number(process.argv[2] || 600);
const KS = Object.keys(E.KHU);
function choi(seed, mua, muc, { khu, tuy = [], sua = [] } = {}) {
  let st = E.taoVan({ seed, mua, cheDo: 'dn', nguoiChoi: muc.map((m, i) => ({ ten: `${m}${i}`, khu: khu[i] })) });
  let soViec = 0, soLuot = 0;
  while (!st.ketThuc) {
    for (const id of E.choNop(st)) {
      let kh = keHoachMay(st, id, muc[id], tuy[id] || {});
      if (sua[id]) { const k2 = sua[id](st, id, kh); if (E.kiemTraKeHoach(st, id, k2).ok) kh = k2; }
      if (muc[id] === 'kho') { soViec += Object.keys(kh).filter((k) => !['mua', 'lam', 'gia'].includes(k)).length + Object.keys(kh.lam || {}).length; soLuot++; }
      st = E.nopKeHoach(st, id, kh);
    }
    st = E.ketThucNgay(st);
  }
  st.soViecKho = soLuot ? soViec / soLuot : 0;
  return st;
}
const khuMay = (n, seed) => { const ds = []; for (let i = 0; i < n; i++) ds.push(chonKhuMay(ds, seed + i)); return ds; };
const pctS = (x) => (100 * x).toFixed(1).padStart(5) + '%';

// ---- C1, C3, C4, C5, C10 ----
const tk = { de: { nhat: 0, hang: 0 }, vua: { nhat: 0, hang: 0 }, kho: { nhat: 0, hang: 0 } };
const theoMua = {}; let vuaPha = 0, vuaUyTin = 0, viecKho = 0;
for (let i = 0; i < N; i++) {
  const mua = (i % 5) + 1;
  const muc = [['de', 'vua', 'kho'], ['vua', 'kho', 'de'], ['kho', 'de', 'vua']][i % 3];
  const st = choi(31000 + i, mua, muc, { khu: khuMay(3, i) });
  st.xepHang.forEach((x, h) => { const m = muc[x.id]; tk[m].hang += h + 1; if (h === 0) tk[m].nhat++; });
  const v = st.nguoi[muc.indexOf('vua')];
  (theoMua[mua] ||= { tong: 0, n: 0 }); theoMua[mua].tong += E.giaTriTiem(st, v, true); theoMua[mua].n++;
  if (v.pha) vuaPha++; vuaUyTin += v.uyTin; viecKho += st.soViecKho;
}
console.log(`\n=== DOANH NHÂN: ${N} ván 3 tiệm (Dễ / Vừa / Khó), máy tự chọn khu ===`);
for (const [m, t] of Object.entries(tk)) console.log(`  ${m.padEnd(4)} nhất ${pctS(t.nhat / N)}   hạng TB ${(t.hang / N).toFixed(2)}`);
for (const [m, t] of Object.entries(theoMua)) console.log(`  Mùa ${m} ${E.MUA[m - 1].ten.padEnd(12)} giá trị TB máy Vừa ${Math.round(t.tong / t.n)}`);
console.log(`  Máy Vừa phá sản ${pctS(vuaPha / N)} · uy tín TB ${Math.round(vuaUyTin / N)} · máy Khó TB ${(viecKho / N).toFixed(1)} việc/ngày`);

// ---- C6 + C9: biến thể ----
const nB = Math.max(60, Math.floor(N / 4));
const theChapToiDa = (st, id, kh) => {
  const p = st.nguoi[id];
  if (!p.dauTu.xe && st.ngay === 1) return { ...kh, muaXe: true };
  const ts = E.taiSanTheChap(st, p).find((t) => !t.dangTheChap);
  return ts ? { ...kh, vayTheChap: { taiSan: ts.ma, so: Math.floor((ts.giaTri * E.LUAT.tyLeTheChap) / 100) } } : kh;
};
const BIEN = {
  'Giờ vàng mỗi ngày': { tuy: { dn: { gioVangMoiNgay: true } } },
  'Mời ăn thử mỗi ngày': { tuy: { dn: { anThuMoiNgay: true } } },
  'Chiến dịch liên tục': { tuy: { dn: { chienDichLienTuc: true } } },
  'Mở chuỗi sớm': { tuy: { dn: { moChuoiSom: true } } },
  'Chỉ lo trải nghiệm': { tuy: { dn: { chiTN: true } } },
  'Thế chấp tối đa': { sua: theChapToiDa },
};
const kqBien = {}; let matTC = 0, vanTC = 0;
console.log(`\n=== Biến thể (${nB} ván mỗi biến thể; công bằng 33%) ===`);
for (const [ten, b] of Object.entries(BIEN)) {
  let nhat = 0;
  for (let i = 0; i < nB; i++) {
    const vt = i % 3; const tuy = [{}, {}, {}], sua = [];
    if (b.tuy) tuy[vt] = b.tuy; if (b.sua) sua[vt] = b.sua;
    const st = choi(41000 + i, (i % 5) + 1, ['vua', 'vua', 'vua'], { khu: khuMay(3, i), tuy, sua });
    if (st.xepHang[0].id === vt) nhat++;
    if (b.sua) { vanTC++; if (st.baoCao.some((bc) => bc.nguoi[vt]?.matTheChap)) matTC++; }
  }
  kqBien[ten] = nhat / nB;
  console.log(`  ${ten.padEnd(22)} nhất ${pctS(nhat / nB)}`);
}
console.log(`  Biến thể thế chấp tối đa: mất tài sản ở ${pctS(matTC / vanTC)} số ván`);

// ---- C7: đầu tư trải nghiệm (cặp cùng hạt giống) ----
let coTN = 0, khongTN = 0;
for (let i = 0; i < nB; i++) {
  const khu = khuMay(3, i);
  const a = choi(51000 + i, (i % 5) + 1, ['vua', 'vua', 'vua'], { khu, tuy: [{ dn: { chiTN: true } }, {}, {}] });
  const b = choi(51000 + i, (i % 5) + 1, ['vua', 'vua', 'vua'], { khu, tuy: [{ dn: { khongDonDep: true } }, {}, {}] });
  coTN += E.giaTriTiem(a, a.nguoi[0], true); khongTN += E.giaTriTiem(b, b.nguoi[0], true);
}
console.log(`\n=== C7 trải nghiệm: có đầu tư ${Math.round(coTN / nB)} · không đầu tư, không dọn ${Math.round(khongTN / nB)} ===`);

// ---- C8: chọn khu ----
let laiChon = 0, laiNN = 0;
for (let i = 0; i < nB; i++) {
  const dong = KS[i % 4], doiThu = [dong, dong];      // 2 đối thủ cùng ở 1 khu
  const chon = chonKhuMay(doiThu, i);                   // tự chọn: khu vắng
  const nn = dong;                                      // chen vào khu đông
  const a = choi(61000 + i, (i % 5) + 1, ['vua', 'vua', 'vua'], { khu: [chon, ...doiThu] });
  const b = choi(61000 + i, (i % 5) + 1, ['vua', 'vua', 'vua'], { khu: [nn, ...doiThu] });
  laiChon += E.giaTriTiem(a, a.nguoi[0], true) - E.LUAT.tienDau; laiNN += E.giaTriTiem(b, b.nguoi[0], true) - E.LUAT.tienDau;
}
console.log(`=== C8 chọn khu: lãi TB khi chọn khu vắng ${Math.round(laiChon / nB)} · khi chen vào khu đông ${Math.round(laiNN / nB)} ===`);

const tb = (m) => tk[m].hang / N;
const kq = {
  C1: tk.kho.nhat >= Math.max(tk.vua.nhat, tk.de.nhat) && tb('kho') < tb('vua') && tb('vua') < tb('de'),
  C3: Object.values(theoMua).every((t) => t.tong / t.n > E.LUAT.tienDau),
  C4: vuaPha / N < 0.05,
  C5: vuaUyTin / N >= 200,
  C6: Object.values(kqBien).every((x) => x < 0.5),
  C7: coTN > khongTN,
  C8: laiChon >= laiNN * 1.1 && laiChon > 0,
  C9: matTC / vanTC < 0.1 && vuaPha / N < 0.05,
  C10: viecKho / N <= 10,
};
console.log('\n=== KẾT LUẬN DOANH NHÂN ===');
for (const [k, v] of Object.entries(kq)) console.log(`  ${k}: ${v ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
process.exitCode = Object.values(kq).every(Boolean) ? 0 : 1;
