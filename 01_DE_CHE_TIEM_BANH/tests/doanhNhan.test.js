import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../docs/engine.js';
import { keHoachMay } from '../docs/doiThu.js';
import * as H from '../docs/hocChoi.js';

const { BANH, LUAT } = E;
const van = (opt = {}) => E.taoVan({ seed: 3, mua: 1, nguoiChoi: [{ ten: 'A' }, { ten: 'B' }], cheDo: 'dn', ...opt });
const ngay = (st, kh0 = {}, kh1 = {}) => E.ketThucNgay(E.nopKeHoach(E.nopKeHoach(st, 0, kh0), 1, kh1));
const giuNguyen = (st) => JSON.parse(JSON.stringify(st));

test('tạo ván Doanh nhân: 3 thợ Lành nghề, có quầy; chế độ lạ bị từ chối; Nhập môn không có món mới', () => {
  const st = van();
  assert.equal(st.cheDo, 'dn');
  assert.deepEqual(st.nguoi[0].tho.map((t) => t.cap), [2, 2, 2]);
  assert.equal(st.nguoi[0].quay, 0);
  assert.equal(E.congTho(st, st.nguoi[0]), 24);
  assert.throws(() => E.taoVan({ seed: 1, nguoiChoi: [{}], cheDo: 'xyz' }), /Chế độ/);
  const nm = E.taoVan({ seed: 5, mua: 1, nguoiChoi: [{}, {}] });
  assert.equal(nm.cheDo, 'nm');
  for (const b of E.BANH_DN) { assert.ok(!E.banhDangCo(nm).includes(b)); assert.ok(E.banhDangCo(st).includes(b)); }
  assert.match(E.kiemTraKeHoach(nm, 0, { nghienCuu: 'croissant' }).loi[0], /chưa mở nghiên cứu|chỉ có ở chế độ Doanh nhân/);
});

test('Doanh nhân: nghiên cứu được ngay mùa 1; tính năng Doanh nhân bị chặn ở Nhập môn', () => {
  const st = van();
  assert.ok(E.kiemTraKeHoach(st, 0, { nghienCuu: 'flan' }).ok);
  const nm = E.taoVan({ seed: 5, mua: 2, nguoiChoi: [{}, {}] });
  for (const kh of [{ thueCap: { 3: 1 } }, { daoTao: 1 }, { thueQuay: 1 }, { muaCongThuc: 'sukem' }]) assert.equal(E.kiemTraKeHoach(nm, 0, kh).ok, false, JSON.stringify(kh));
});

test('mua công thức: giá 150%, chưa làm được trong ngày, làm được từ hôm sau', () => {
  let st = van();
  const t0 = st.nguoi[0].tien;
  assert.match(E.kiemTraKeHoach(st, 0, { muaCongThuc: 'flan', mua: { trung: 2, sua: 2, duong: 1 }, lam: { flan: 1 } }).loi[0], /Chưa có công thức/);
  st = ngay(st, { muaCongThuc: 'flan' });
  assert.ok(st.nguoi[0].moKhoa.includes('flan'));
  assert.equal(st.baoCao[0].nguoi[0].viec.muaCongThuc, 'flan');
  assert.equal(t0 - st.nguoi[0].tien - st.baoCao[0].nguoi[0].chiPhi.luong - st.baoCao[0].nguoi[0].chiPhi.thue, 150);
  assert.ok(E.kiemTraKeHoach(st, 0, { mua: { trung: 2, sua: 2, duong: 1 }, lam: { flan: 1 } }).ok);
  assert.match(E.kiemTraKeHoach(st, 0, { muaCongThuc: 'flan' }).loi[0], /Đã có công thức/);
  // đang nghiên cứu món nào thì không mua đúng món đó
  const s2 = ngay(van(), { nghienCuu: 'pizza' });
  assert.match(E.kiemTraKeHoach(s2, 0, { muaCongThuc: 'pizza' }).loi[0], /Đang nghiên cứu/);
  assert.ok(E.kiemTraKeHoach(s2, 0, { muaCongThuc: 'flan' }).ok);
});

test('thợ 3 cấp: phí thuê, lương, công khác nhau; kh.thue = Lành nghề', () => {
  let st = van();
  const p0 = st.nguoi[0];
  st = E.nopKeHoach(st, 0, { thueCap: { 1: 1, 3: 1 }, thue: 1 });
  const p = st.nguoi[0];
  assert.equal(p0.tien - p.tien, 20 + 100 + 40);
  assert.deepEqual(p.tho.map((t) => t.cap).sort(), [1, 2, 2, 2, 2, 3]);
  assert.equal(E.congTho(st, p), 8 * 4 + 5 + 9);
  assert.equal(E.luongNgay(st, p), 25 * 4 + 15 + 45);
  assert.equal(E.kiemTraKeHoach(van(), 0, { thueCap: { 4: 1 } }).ok, false);
});

test('học việc lên Lành nghề sau 6 ngày; báo cáo ghi lên cấp; bài học thợ lên tay', () => {
  let st = ngay(van(), { thueCap: { 1: 1 } });
  for (let i = 0; i < 5; i++) { const truoc = st; st = ngay(st); if (i === 4) {
    assert.deepEqual(st.baoCao.at(-1).nguoi[0].lenCap, [2]);
    assert.equal(H.baiHocHomNay(truoc, st, 0, { cheDo: 'dn' }), 'thoLenTay');
  } }
  assert.ok(st.nguoi[0].tho.every((t) => t.cap >= 2));
});

test('đào tạo Thợ cả: 150 xu, nghỉ 2 ngày (mất công), rồi lên cấp 3', () => {
  let st = van();
  const c0 = E.congTho(st, st.nguoi[0]);
  st = E.nopKeHoach(st, 0, { daoTao: 1 });
  assert.equal(E.congTho(st, st.nguoi[0]), c0 - 8, 'thợ đi học không làm bánh');
  assert.equal(E.kiemTraKeHoach(van(), 0, { daoTao: 4 }).ok, false);
  st = E.ketThucNgay(E.nopKeHoach(st, 1, {}));
  assert.ok(!E.coThoCa(st.nguoi[0]));
  st = ngay(st);
  assert.ok(E.coThoCa(st.nguoi[0]));
  assert.deepEqual(st.baoCao.at(-1).nguoi[0].lenCap, [3]);
});

test('macaron cần Thợ cả đang làm việc', () => {
  let st = ngay(van(), { muaCongThuc: 'macaron' });
  const kh = { mua: { hat: 1, duong: 2, trung: 1 }, lam: { macaron: 1 } };
  assert.match(E.kiemTraKeHoach(st, 0, kh).loi[0], /cần ít nhất 1 Thợ cả/);
  assert.ok(E.kiemTraKeHoach(st, 0, { ...kh, thueCap: { 3: 1 } }).ok);
});

test('cho nghỉ: người tay nghề thấp trước, đền 3 ngày lương theo cấp', () => {
  let st = ngay(van(), { thueCap: { 1: 1, 3: 1 } });
  const t = st.nguoi[0].tien;
  st = E.nopKeHoach(st, 0, { saThai: 2 });
  assert.equal(t - st.nguoi[0].tien, 15 * 3 + 25 * 3);
  assert.deepEqual(st.nguoi[0].tho.map((x) => x.cap).sort(), [2, 2, 3]);
});

test('chất lượng bánh theo tay nghề; thợ cả tăng uy tín, toàn học việc thì giảm', () => {
  const p = { tho: [{ cap: 2 }, { cap: 2 }] };
  assert.equal(E.chatLuong(p), 20);
  assert.equal(E.chatLuong({ tho: [{ cap: 3 }, { cap: 3 }] }), 30);
  assert.equal(E.chatLuong({ tho: [{ cap: 1 }] }), 10);
  assert.equal(E.chatLuong({ tho: [{ cap: 3, hoc: { con: 1 } }] }), 0, 'thợ đi học không tính');
  // cùng kế hoạch bán, tiệm có thợ cả được uy tín cao hơn
  const kh = { mua: { bot: 2, duong: 2, bo: 2, hat: 2 }, lam: { cookies: 2 } };
  const a = ngay(van(), kh, kh);
  const b = ngay(van(), { ...kh, thueCap: { 3: 3 }, saThai: 3 }, kh);
  assert.ok(b.baoCao[0].nguoi[0].chatLuong > a.baoCao[0].nguoi[0].chatLuong);
});

test('nhân viên quầy: thuê, cho nghỉ, học lễ phép, giới hạn 3, có lương', () => {
  let st = van();
  const t0 = st.nguoi[0].tien;
  st = E.nopKeHoach(st, 0, { thueQuay: 2, daoTaoQuay: 1 });
  assert.equal(t0 - st.nguoi[0].tien, 2 * 10 + 60);
  assert.equal(st.nguoi[0].quay, 2); assert.equal(st.nguoi[0].lePhep, 1);
  assert.equal(E.luongNgay(st, st.nguoi[0]), 75 + 30);
  assert.equal(E.kiemTraKeHoach(van(), 0, { thueQuay: 4 }).ok, false);
  assert.equal(E.kiemTraKeHoach(van(), 0, { daoTaoQuay: 1 }).ok, false, 'chưa có ai để học');
  st = E.ketThucNgay(E.nopKeHoach(st, 1, {}));
  st = E.nopKeHoach(st, 0, { nghiQuay: 2 });
  assert.equal(st.nguoi[0].quay, 0); assert.equal(st.nguoi[0].lePhep, 0);
});

test('nhân viên quầy tăng sức hút', () => {
  const kh = { mua: { bot: 2, duong: 2, bo: 2, hat: 2 }, lam: { cookies: 2 } };
  const a = ngay(van(), kh, kh);
  const b = ngay(van(), { ...kh, thueQuay: 2, daoTaoQuay: 2 }, kh);
  assert.ok(b.baoCao[0].nguoi[0].hut.cookies > a.baoCao[0].nguoi[0].hut.cookies);
});

test('bài học Doanh nhân: mua công thức, thuê thợ cả; không hiện ở chế độ Nhập môn', () => {
  const st = van();
  const s1 = ngay(st, { muaCongThuc: 'flan' });
  assert.equal(H.baiHocHomNay(st, s1, 0, { cheDo: 'dn' }), 'muaCongThuc');
  assert.equal(H.baiHocHomNay(st, s1, 0, { cheDo: 'nm' }), null);
  const s2 = ngay(st, { thueCap: { 3: 1 } });
  assert.equal(H.baiHocHomNay(st, s2, 0, { cheDo: 'dn' }), 'thoCa');
});

test('hàm công khai không sửa state đầu vào (Doanh nhân)', () => {
  const st = van(); const g = giuNguyen(st);
  E.kiemTraKeHoach(st, 0, { thueCap: { 3: 1 }, muaCongThuc: 'flan', thueQuay: 1 });
  E.nopKeHoach(st, 0, { daoTao: 1 });
  assert.deepEqual(st, g);
});

test('200 ván Doanh nhân máy chơi: kế hoạch luôn hợp lệ, tiền khớp sổ, số nguyên, không âm kho', () => {
  for (let s = 0; s < 200; s++) {
    const muc = ['de', 'vua', 'kho'];
    let st = E.taoVan({ seed: 3000 + s, mua: (s % 5) + 1, nguoiChoi: muc.map((m) => ({ ten: m })), cheDo: 'dn' });
    while (!st.ketThuc) {
      for (const id of E.choNop(st)) {
        const kh = keHoachMay(st, id, muc[id]);
        assert.ok(E.kiemTraKeHoach(st, id, kh).ok, `ván ${s} ngày ${st.ngay}: ${E.kiemTraKeHoach(st, id, kh).loi}`);
        st = E.nopKeHoach(st, id, kh);
      }
      const truoc = st;
      st = E.ketThucNgay(st);
      const bc = st.baoCao.at(-1);
      for (const p of st.nguoi) {
        const r = bc.nguoi[p.id]; if (!r || truoc.nguoi[p.id].pha) continue;
        const c = r.chiPhi;
        assert.equal(p.tien, truoc.nguoi[p.id].tien + r.doanhThu - (c.luong + c.thue + c.lai + (c.phatDon || 0)), `tiền lệch ván ${s}`);
        assert.ok(Number.isSafeInteger(p.tien) && Number.isSafeInteger(p.uyTin));
        for (const lots of [...Object.values(p.kho), ...Object.values(p.hang)]) for (const l of lots) assert.ok(l.q > 0);
      }
    }
  }
});
