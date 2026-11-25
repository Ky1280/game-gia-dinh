// Chặn lỡ tay phá cân bằng Doanh nhân (bản nhanh; bản đầy đủ: npm run mophong:dn)
import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../docs/engine.js';
import { keHoachMay, chonKhuMay } from '../docs/doiThu.js';

function choi(seed, muc, khu, tuy = []) {
  let st = E.taoVan({ seed, mua: (seed % 5) + 1, cheDo: 'dn', nguoiChoi: muc.map((m, i) => ({ khu: khu[i] })) });
  while (!st.ketThuc) { for (const id of E.choNop(st)) st = E.nopKeHoach(st, id, keHoachMay(st, id, muc[id], tuy[id] || {})); st = E.ketThucNgay(st); }
  return st;
}

test('khu càng đông thì mỗi tiệm càng ít khách', () => {
  const st = E.taoVan({ seed: 1, nguoiChoi: [{}], cheDo: 'dn' });
  const moiTiem = [1, 2, 3, 4].map((n) => E.nhuCauKhu(st, 'danCu', 'banhmi', n) / n);
  for (let i = 1; i < 4; i++) assert.ok(moiTiem[i] < moiTiem[i - 1]);
});

test('máy chọn khu: rải ra khu vắng', () => {
  const ds = []; for (let i = 0; i < 4; i++) ds.push(chonKhuMay(ds, i));
  assert.equal(new Set(ds).size, 4);
});

test('cân bằng nhanh (30 ván): Khó hơn Dễ; Vừa có lãi; đầu tư trải nghiệm có lời', () => {
  let khoHonDe = 0, laiVua = 0, coTN = 0, khongTN = 0;
  for (let i = 0; i < 30; i++) {
    const khu = []; for (let j = 0; j < 3; j++) khu.push(chonKhuMay(khu, i + j));
    const st = choi(81000 + i, ['de', 'vua', 'kho'], khu);
    if (E.giaTriTiem(st, st.nguoi[2], true) > E.giaTriTiem(st, st.nguoi[0], true)) khoHonDe++;
    laiVua += E.giaTriTiem(st, st.nguoi[1], true) - E.LUAT.tienDau;
    if (i < 15) {
      const a = choi(82000 + i, ['vua', 'vua', 'vua'], khu, [{ dn: { chiTN: true } }]);
      const b = choi(82000 + i, ['vua', 'vua', 'vua'], khu, [{ dn: { khongDonDep: true } }]);
      coTN += E.giaTriTiem(a, a.nguoi[0], true); khongTN += E.giaTriTiem(b, b.nguoi[0], true);
    }
  }
  assert.ok(khoHonDe >= 20, `Khó hơn Dễ ${khoHonDe}/30`);
  assert.ok(laiVua > 0, 'máy Vừa có lãi');
  assert.ok(coTN > khongTN, `trải nghiệm ${coTN} > ${khongTN}`);
});
