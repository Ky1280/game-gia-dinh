import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../docs/engine.js';
import { keHoachMay } from '../docs/doiThu.js';
import * as H from '../docs/hocChoi.js';

const { LUAT, KHU } = E;
const van = (opt = {}) => E.taoVan({ seed: 3, mua: 1, nguoiChoi: [{ khu: 'danCu' }, { khu: 'danCu' }], cheDo: 'dn', ...opt });
const ngay = (st, ...kh) => { for (const id of E.choNop(st)) st = E.nopKeHoach(st, id, kh[id] || {}); return E.ketThucNgay(st); };
const COOK = { mua: { bot: 4, duong: 4, bo: 4, hat: 4 }, lam: { cookies: 4 } };
const MI = (n) => ({ mua: { bot: 2 * n, trung: n }, lam: { banhmi: n } });
const doiTien = (truoc, sau, id) => {
  const r = sau.baoCao.at(-1).nguoi[id], c = r.chiPhi;
  return truoc.nguoi[id].tien + r.doanhThu + (r.thuKhac || 0) - (c.luong + c.thue + c.lai + (c.phatDon || 0) + (c.khac || 0)) - (r.traNo || 0);
};

test('Nhập môn không dùng được tính năng GĐ1d', () => {
  const nm = E.taoVan({ seed: 3, mua: 4, nguoiChoi: [{}, {}] });
  for (const kh of [{ vayNong: 100 }, { goiVon: 500 }, { guiTK: 10 }, { muaXe: true }, { moCuaHang: { khu: 'truong', cach: 'thue' } }, { chienDich: 'hs' }, { gioVang: 20 }]) assert.equal(E.kiemTraKeHoach(nm, 0, kh).ok, false, JSON.stringify(kh));
  assert.equal(E.SU_KIEN.find((x) => x.id === 'dichGa').dn, true);
});

test('vay nóng: tối đa 300, lãi 3%/ngày, đến hạn 5 ngày tự bị thu', () => {
  let st = van();
  assert.equal(E.kiemTraKeHoach(st, 0, { vayNong: 301 }).ok, false);
  st = ngay(st, { vayNong: 200 });
  const p = st.nguoi[0];
  assert.equal(p.khoanVay.length, 1); assert.equal(p.khoanVay[0].lai, 30);
  assert.equal(st.baoCao[0].nguoi[0].chiPhi.lai, 6);
  assert.equal(E.kiemTraKeHoach(st, 0, { vayNong: 101 }).ok, false, 'cộng dồn vượt 300');
  for (let i = 0; i < 4; i++) { const t = st; st = ngay(st); assert.equal(st.nguoi[0].tien, doiTien(t, st, 0)); }
  assert.equal(st.nguoi[0].khoanVay.length, 0);
  assert.equal(st.baoCao.at(-1).nguoi[0].traNo, 200);
});

test('thế chấp: cần tài sản, vay tối đa 70%, lãi 0,5%; quá hạn mất tài sản; gia hạn 1 lần', () => {
  let st = van(); st.nguoi[0].tien = 5000;      // đủ tiền để không phá sản trước ngày đến hạn
  assert.equal(E.kiemTraKeHoach(st, 0, { vayTheChap: { taiSan: 'xe', so: 100 } }).ok, false, 'chưa có xe');
  st = ngay(st, { muaXe: true });
  assert.deepEqual(E.taiSanTheChap(st, st.nguoi[0]).map((x) => x.ma), ['xe']);
  assert.equal(E.kiemTraKeHoach(st, 0, { vayTheChap: { taiSan: 'xe', so: 141 } }).ok, false, '70% của 200 = 140');
  st = ngay(st, { vayTheChap: { taiSan: 'xe', so: 140 } });
  const k = st.nguoi[0].khoanVay[0];
  assert.equal(k.lai, 5); assert.equal(k.han, 2 + LUAT.hanTheChap - 1);
  assert.equal(E.kiemTraKeHoach(st, 0, { vayTheChap: { taiSan: 'xe', so: 10 } }).ok, false, 'đang thế chấp');
  // gia hạn 1 lần, phí 2%
  const t = st.nguoi[0].tien;
  st = ngay(st, { giaHan: [k.id] });
  assert.equal(st.nguoi[0].khoanVay[0].han, k.han + LUAT.giaHanNgay);
  assert.equal(E.kiemTraKeHoach(st, 0, { giaHan: [k.id] }).ok, false);
  while (st.nguoi[0].khoanVay.length && !st.ketThuc) st = ngay(st);
  assert.equal(st.nguoi[0].dauTu.xe, false, 'mất xe');
  assert.ok(st.baoCao.some((b) => b.nguoi[0].matTheChap?.includes('xe')));
  assert.ok(t > 0);
});

test('trả bớt khoản vay theo mã khoản', () => {
  let st = ngay(van(), { vayNong: 200 });
  const id = st.nguoi[0].khoanVay[0].id;
  assert.equal(E.kiemTraKeHoach(st, 0, { traKhoan: [{ id, so: 201 }] }).ok, false);
  st = ngay(st, { traKhoan: [{ id, so: 200 }] });
  assert.equal(st.nguoi[0].khoanVay.length, 0);
});

test('vay chồng: từ khoản thứ 3, khoản mới lãi thêm 1%/ngày; đếm số khoản cho cảnh báo', () => {
  let st = ngay(van(), { vay: 100, vayNong: 100 });
  st = ngay(st, { muaXe: true });
  st = ngay(st, { vayTheChap: { taiSan: 'xe', so: 100 } });
  assert.equal(E.soKhoanVay(st.nguoi[0]), 3);
  st = ngay(st, { vayNong: 100 });
  assert.equal(st.nguoi[0].khoanVay.at(-1).lai, LUAT.laiNong + LUAT.laiVayChong);
  assert.equal(H.canhBaoTiem(st, 0, [1000], { soKhoanVay: E.soKhoanVay(st.nguoi[0]) }).muc, 'do');
});

test('gọi vốn góp: từ mùa 4, 1 lần, 500–1500; tài sản ròng trừ vốn góp + 30% lợi nhuận', () => {
  assert.equal(E.kiemTraKeHoach(van(), 0, { goiVon: 500 }).ok, false, 'mùa 1 chưa được');
  let st = van({ mua: 4 });
  assert.equal(E.kiemTraKeHoach(st, 0, { goiVon: 400 }).ok, false);
  const g0 = E.giaTriTiem(st, st.nguoi[0]);
  st = E.nopKeHoach(st, 0, { goiVon: 1000 });
  assert.equal(E.giaTriTiem(st, st.nguoi[0]), g0, 'nhận vốn góp không làm mình giàu thêm');
  const p = JSON.parse(JSON.stringify(st.nguoi[0])); p.tien += 1000;   // giả sử lãi 1000
  assert.equal(E.giaTriTiem(st, p), g0 + 700, 'người góp vốn hưởng 30% lợi nhuận');
  assert.equal(E.kiemTraKeHoach(st, 0, { goiVon: 500 }).ok, false, 'chỉ 1 lần/mùa');
});

test('tiết kiệm: gửi, rút, lãi 0,3%/ngày cộng vào sổ; tính vào tài sản', () => {
  let st = ngay(van(), { guiTK: 500 });
  assert.equal(st.nguoi[0].tietKiem, 501);
  assert.equal(st.baoCao[0].nguoi[0].laiTietKiem, 1);
  assert.equal(E.kiemTraKeHoach(st, 0, { rutTK: 502 }).ok, false);
  const t = st.nguoi[0].tien;
  st = E.nopKeHoach(st, 0, { rutTK: 100 });
  assert.equal(st.nguoi[0].tien, t + 100);
});

test('trại gà: trứng rẻ 25%, cổ tức 10 xu/ngày; xe: tốn xăng, tăng sức hút', () => {
  let st = ngay(van(), { gopTraiGa: true, muaXe: true });
  const p = st.nguoi[0];
  assert.ok(E.giaMuaNL(st, p, 'trung') < st.thiTruong.gia.trung || st.thiTruong.gia.trung === 1);
  assert.equal(E.giaMuaNL(st, st.nguoi[1], 'trung'), st.thiTruong.gia.trung);
  assert.equal(st.baoCao[0].nguoi[0].thuKhac, 10);
  assert.equal(st.baoCao[0].nguoi[0].chiPhi.khac, 10);
  assert.ok(E.hutThemDN(st, p, 'danCu') > 100);
  assert.equal(E.giaTriTiem(st, p) - E.giaTriTiem(st, { ...p, dauTu: {} }), E.TAI_SAN_GIA.xe + E.TAI_SAN_GIA.traiGa);
});

test('mua mặt bằng tiệm chính: không trả tiền thuê, thế chấp được', () => {
  let st = van({ mua: 3 });
  st.nguoi[0].tien = 3000;
  st = ngay(st, { muaMatBang: true });
  assert.equal(st.baoCao[0].nguoi[0].chiPhi.thue, st.thueThem);
  assert.ok(E.taiSanTheChap(st, st.nguoi[0]).some((x) => x.ma === 'mb:danCu'));
});

test('chuỗi cửa hàng: mỗi khu 1, tối đa 4, thuê (cọc 300) hoặc mua; bán ở khu mới', () => {
  let st = van(); st.nguoi[0].tien = 6000;
  assert.equal(E.kiemTraKeHoach(st, 0, { moCuaHang: { khu: 'danCu', cach: 'thue' } }).ok, false, 'trùng khu tiệm chính');
  const t = st.nguoi[0].tien;
  st = E.nopKeHoach(st, 0, { moCuaHang: { khu: 'truong', cach: 'thue' }, ...MI(20) });
  assert.equal(t - st.nguoi[0].tien, LUAT.cocThue + MI(20).mua.bot * st.thiTruong.gia.bot + MI(20).mua.trung * st.thiTruong.gia.trung);
  st = E.ketThucNgay(E.nopKeHoach(st, 1, {}));
  const r = st.baoCao[0].nguoi[0];
  assert.equal(r.chiPhi.thue, KHU.danCu.thue + KHU.truong.thue + LUAT.phiCuaHang + st.thueThem);
  assert.ok((r.banCuaHang?.truong || 0) > 0, 'có bán ở cửa hàng Cổng trường');
  st = ngay(st, { moCuaHang: { khu: 'vanPhong', cach: 'mua' } });
  st = ngay(st, { moCuaHang: { khu: 'duLich', cach: 'thue' } });
  assert.equal(E.soCuaHang(st.nguoi[0]), 4);
  assert.equal(E.kiemTraKeHoach(st, 0, { moCuaHang: { khu: 'truong', cach: 'thue' } }).ok, false);
  assert.equal(H.thongTinDN(st)[0].soCuaHang, 4);
});

test('chiến dịch marketing: nhắm đúng nhóm chính của khu mạnh hơn nhắm sai', () => {
  const st = van();
  const dung = { ...st.nguoi[0], chienDich: { nhom: 'gd', den: 5 } }, sai = { ...st.nguoi[0], chienDich: { nhom: 'dl', den: 5 } };
  assert.equal(E.hutThemDN(st, dung, 'danCu'), 100 + LUAT.chienDichMax);
  assert.ok(E.hutThemDN(st, sai, 'danCu') < 110);
  const s1 = ngay(st, { chienDich: 'gd' });
  assert.equal(s1.nguoi[0].chienDich.den, 3);
  const b = H.baiHocHomNay(st, s1, 0, { cheDo: 'dn', daGapTrongMua: ['matThap', 'taiThap', 'khongGianBan', 'miengThap'] });
  assert.equal(b, 'marketingDung');
  const s2 = ngay(st, { chienDich: 'dl' });
  assert.equal(H.baiHocHomNay(st, s2, 0, { cheDo: 'dn' }), 'marketingSai');
});

test('mời ăn thử: lấy bánh trong kho; bánh ngon tăng uy tín + khách, bánh dở thì ngược lại', () => {
  const st = van();
  assert.equal(E.kiemTraKeHoach(st, 0, { anThu: { banh: 'cookies', sl: 5 } }).ok, false, 'chưa có bánh');
  assert.equal(E.kiemTraKeHoach(st, 0, { ...COOK, anThu: { banh: 'cookies', sl: 7 } }).ok, false, 'chỉ 5/10/20');
  const ngon = ngay(st, { ...MI(10), thueCap: { 3: 3 }, saThai: 3, anThu: { banh: 'banhmi', sl: 5 } });
  const do_ = ngay(st, { ...MI(10), thueCap: { 1: 5 }, saThai: 3, anThu: { banh: 'banhmi', sl: 5 } });
  assert.equal(ngon.baoCao[0].nguoi[0].anThu, 'ngon');
  assert.equal(do_.baoCao[0].nguoi[0].anThu, 'do');
  assert.ok(ngon.nguoi[0].anThuHL.pct > 0 && do_.nguoi[0].anThuHL.pct < 0);
  assert.ok(ngon.nguoi[0].uyTin > do_.nguoi[0].uyTin);
  assert.equal(H.baiHocHomNay(st, do_, 0, { cheDo: 'dn' }), 'anThuDo');
});

test('giờ vàng: bán bánh sắp hết hạn giá giảm; 3 ngày liền thì khách tập thói quen chờ', () => {
  let st = van();
  const kh = { ...MI(24), gia: { banhmi: 30 }, gioVang: 50 };   // giá cao → còn dư nhiều cuối ngày
  st = ngay(st, kh);
  const gv = st.baoCao[0].nguoi[0].gioVang;
  assert.ok(gv.ban > 0); assert.equal(gv.tien, gv.ban * 15);
  st = ngay(st, kh); st = ngay(st, kh);
  assert.equal(st.nguoi[0].gioVangLienTiep, 3);
  assert.ok(st.baoCao.at(-1).nguoi[0].gioVangThoiQuen);
  assert.equal(E.hutThemDN(st, st.nguoi[0], 'danCu'), 100 - LUAT.gioVangMatKhach);
  st = ngay(st, {});
  assert.equal(st.nguoi[0].gioVangLienTiep, 0);
});

test('cúp Doanh nhân dùng số liệu thật: chuỗi, đầu tư khôn', () => {
  let st = van(); st.nguoi[0].tien = 6000;
  st = ngay(st, { moCuaHang: { khu: 'truong', cach: 'thue' }, guiTK: 1000 });
  st = ngay(st, { moCuaHang: { khu: 'vanPhong', cach: 'thue' } });
  const tt = H.thongTinDN(st);
  assert.equal(tt[0].soCuaHang, 3); assert.ok(tt[0].laiDauTu > 0);
  assert.ok(tt[0].diemTraiNghiemTB5Ngay >= 0 && tt[0].diemTraiNghiemTB5Ngay <= 50);
});

test('200 ván Doanh nhân máy chơi + ngẫu nhiên dùng tính năng mới: hợp lệ, tiền khớp sổ', () => {
  const ks = Object.keys(KHU);
  let dungThu = 0;
  for (let s = 0; s < 200; s++) {
    const muc = ['de', 'vua', 'kho'];
    let st = E.taoVan({ seed: 9000 + s, mua: (s % 5) + 1, cheDo: 'dn', nguoiChoi: muc.map((m, i) => ({ khu: ks[(s + i) % 4] })) });
    let r = (s * 7919) % 1000;
    const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
    while (!st.ketThuc) {
      for (const id of E.choNop(st)) {
        const p = st.nguoi[id];
        let kh = keHoachMay(st, id, muc[id]);
        const them = {};
        const x = rnd();
        if (x < 0.06) them.vayNong = 100;
        else if (x < 0.1 && E.taiSanTheChap(st, p).some((t) => !t.dangTheChap)) { const t = E.taiSanTheChap(st, p).find((y) => !y.dangTheChap); them.vayTheChap = { taiSan: t.ma, so: Math.floor(t.giaTri / 2) }; }
        else if (x < 0.14) them.gioVang = 40;
        else if (x < 0.17) them.chienDich = ['hs', 'vp', 'gd', 'dl'][s % 4];
        else if (x < 0.19 && !p.dauTu.xe) them.muaXe = true;
        else if (x < 0.21) them.guiTK = 50;
        else if (x < 0.23 && E.soCuaHang(p) < 4) { const k = ks.find((k2) => k2 !== p.khu && !p.cuaHang.some((c) => c.khu === k2)); them.moCuaHang = { khu: k, cach: 'thue' }; }
        else if (x < 0.25 && p.khoanVay.length) them.traKhoan = [{ id: p.khoanVay[0].id, so: Math.min(50, p.khoanVay[0].goc) }];
        let kh2 = { ...kh, ...them };
        if (E.kiemTraKeHoach(st, id, kh2).ok) { kh = kh2; if (Object.keys(them).length) dungThu++; }
        st = E.nopKeHoach(st, id, kh);
      }
      const truoc = st; st = E.ketThucNgay(st);
      for (const p of st.nguoi) {
        if (truoc.nguoi[p.id].pha) continue;
        assert.equal(p.tien, doiTien(truoc, st, p.id), `tiền lệch ván ${s} ngày ${truoc.ngay}`);
        assert.ok(Number.isSafeInteger(p.tien) && Number.isSafeInteger(E.giaTriTiem(st, p)));
        for (const k of p.khoanVay) assert.ok(k.goc > 0 && k.han >= st.ngay - 1);
      }
    }
  }
  assert.ok(dungThu > 500, `có dùng tính năng mới (${dungThu} lần)`);
});
