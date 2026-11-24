// Mô phỏng cân bằng: node tools/mophong.js [soVan=1000]
// Tiêu chí ĐẠT (in cuối bảng):
//  C1  Khó thắng nhiều nhất, thứ hạng TB: Khó < Vừa < Dễ (ván 3 người Dễ/Vừa/Khó)
//  C2  Không chiến thuật "lệch" nào thắng chắc: mỗi biến thể đấu 2 máy Vừa, tỷ lệ nhất < 50% (công bằng = 33%)
//  C3  Máy Vừa có lãi ở mọi mùa (giá trị tiệm TB > 1.000 xu tiền đầu)
//  C4  Máy Vừa hiếm phá sản (< 5%)
//  C5  Uy tín cuối mùa của máy Vừa TB ≥ 200 (2 sao)
import * as E from '../docs/engine.js';
import { keHoachMay } from '../docs/doiThu.js';

const N = Number(process.argv[2] || 1000);
function choi(seed, mua, muc, tuy = []) {
  let st = E.taoVan({ seed, mua, nguoiChoi: muc.map((m, i) => ({ ten: `${m}${i}` })) });
  while (!st.ketThuc) {
    for (const id of E.choNop(st)) st = E.nopKeHoach(st, id, keHoachMay(st, id, muc[id], tuy[id] || {}));
    st = E.ketThucNgay(st);
  }
  return st;
}

// --- C1, C3, C4, C5: ván Dễ / Vừa / Khó ---
const thongKe = { de: { nhat: 0, hang: 0 }, vua: { nhat: 0, hang: 0 }, kho: { nhat: 0, hang: 0 } };
const theoMua = {};
let vuaPha = 0, vuaUyTin = 0, soVan = 0;
for (let i = 0; i < N; i++) {
  const mua = (i % 5) + 1;
  // xoay vị trí ngồi để công bằng
  const muc = [['de', 'vua', 'kho'], ['vua', 'kho', 'de'], ['kho', 'de', 'vua']][i % 3];
  const st = choi(1000 + i, mua, muc);
  st.xepHang.forEach((x, h) => { const m = muc[x.id]; thongKe[m].hang += h + 1; if (h === 0) thongKe[m].nhat++; });
  const v = st.nguoi[muc.indexOf('vua')];
  (theoMua[mua] ||= { tong: 0, n: 0, min: Infinity });
  const gt = E.giaTriTiem(st, v, true);
  theoMua[mua].tong += gt; theoMua[mua].n++; theoMua[mua].min = Math.min(theoMua[mua].min, gt);
  if (v.pha) vuaPha++; vuaUyTin += v.uyTin; soVan++;
}
console.log(`\n=== ${N} ván 3 người (Dễ / Vừa / Khó), chia đều 5 mùa ===`);
for (const [m, t] of Object.entries(thongKe)) console.log(`  ${m.padEnd(4)} nhất ${(100 * t.nhat / N).toFixed(1).padStart(5)}%   hạng TB ${(t.hang / N).toFixed(2)}`);
console.log('  Máy Vừa — giá trị tiệm cuối mùa (TB / thấp nhất):');
for (const [m, t] of Object.entries(theoMua)) console.log(`    Mùa ${m} ${E.MUA[m - 1].ten.padEnd(12)} ${Math.round(t.tong / t.n)} / ${t.min}`);
console.log(`  Máy Vừa phá sản ${(100 * vuaPha / soVan).toFixed(1)}% · uy tín cuối TB ${Math.round(vuaUyTin / soVan)}`);

// --- C2: biến thể chiến thuật đấu 2 máy Vừa ---
const BIEN = {
  'Giá rẻ 70%': { heSoGia: 70 }, 'Giá cao 140%': { heSoGia: 140 }, 'Giá cao 120%': { heSoGia: 120 },
  'Làm nhiều 150%': { heSoLam: 150 }, 'Làm ít 60%': { heSoLam: 60 }, 'Không đầu tư': { khongDauTu: true }, 'Không thuê thợ': { khongThue: true },
};
const nBien = Math.max(50, Math.floor(N / 5));
const kqBien = {};
console.log(`\n=== Biến thể đấu 2 máy Vừa (${nBien} ván mỗi biến thể) ===`);
for (const [ten, tc] of Object.entries(BIEN)) {
  let nhat = 0;
  for (let i = 0; i < nBien; i++) {
    const viTri = i % 3; const tuy = [{}, {}, {}]; tuy[viTri] = tc;
    const st = choi(5000 + i, (i % 5) + 1, ['vua', 'vua', 'vua'], tuy);
    if (st.xepHang[0].id === viTri) nhat++;
  }
  kqBien[ten] = nhat / nBien;
  console.log(`  ${ten.padEnd(16)} nhất ${(100 * nhat / nBien).toFixed(1).padStart(5)}%`);
}

// --- Kết luận ---
const tb = (m) => thongKe[m].hang / N;
const ketQua = {
  C1: thongKe.kho.nhat >= Math.max(thongKe.vua.nhat, thongKe.de.nhat) && tb('kho') < tb('vua') && tb('vua') < tb('de'),
  C2: Object.values(kqBien).every((x) => x < 0.5),
  C3: Object.values(theoMua).every((t) => t.tong / t.n > E.LUAT.tienDau),
  C4: vuaPha / soVan < 0.05,
  C5: vuaUyTin / soVan >= 200,
};
console.log('\n=== KẾT LUẬN ===');
for (const [k, v] of Object.entries(ketQua)) console.log(`  ${k}: ${v ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
process.exitCode = Object.values(ketQua).every(Boolean) ? 0 : 1;
