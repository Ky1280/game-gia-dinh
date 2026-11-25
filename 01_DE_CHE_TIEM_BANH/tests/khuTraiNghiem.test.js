import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../docs/engine.js';
import { keHoachMay } from '../docs/doiThu.js';
import * as H from '../docs/hocChoi.js';

const { KHU, NHOM_KHACH, LUAT } = E;
const van = (khu = ['danCu', 'danCu'], opt = {}) => E.taoVan({ seed: 8, mua: 1, nguoiChoi: khu.map((k) => ({ khu: k })), cheDo: 'dn', ...opt });
const ngay = (st, ...kh) => { for (const id of E.choNop(st)) st = E.nopKeHoach(st, id, kh[id] || {}); return E.ketThucNgay(st); };
const COOK = { mua: { bot: 4, duong: 4, bo: 4, hat: 4 }, lam: { cookies: 4 } };

test('dữ liệu: 4 khu, tỷ lệ nhóm khách cộng 100; trọng số điểm chạm cộng 100', () => {
  assert.deepEqual(Object.keys(KHU), ['truong', 'vanPhong', 'danCu', 'duLich']);
  for (const z of Object.values(KHU)) assert.equal(Object.values(z.tyLe).reduce((a, b) => a + b, 0), 100);
  for (const g of Object.values(NHOM_KHACH)) assert.equal(Object.values(g.tn).reduce((a, b) => a + b, 0), 100);
  assert.ok(E.hopKhu('truong', 'pizza') > E.hopKhu('truong', 'macaron'), 'học sinh thích pizza hơn macaron');
  assert.ok(E.hopKhu('duLich', 'macaron') > 130, 'phố du lịch hợp macaron');
  assert.ok(E.hopKhu('vanPhong', 'banhbao') > E.hopKhu('vanPhong', 'banhkem'));
  assert.ok(E.nhayKhu('truong') > E.nhayKhu('duLich'), 'học sinh nhạy giá hơn khách du lịch');
});

test('tạo ván: khu mặc định Dân cư, khu lạ bị từ chối, Nhập môn không có khu', () => {
  assert.equal(E.taoVan({ seed: 1, nguoiChoi: [{}], cheDo: 'dn' }).nguoi[0].khu, 'danCu');
  assert.throws(() => E.taoVan({ seed: 1, nguoiChoi: [{ khu: 'sao_hoa' }], cheDo: 'dn' }), /Khu/);
  assert.equal(E.taoVan({ seed: 1, nguoiChoi: [{}] }).nguoi[0].khu, undefined);
});

test('khách chỉ chia trong cùng khu: tiệm khác khu không giành khách của nhau', () => {
  const kh0 = COOK, kh1 = { ...COOK, gia: { cookies: 12 } };   // tiệm 1 bán nửa giá
  const cung = ngay(van(['danCu', 'danCu']), kh0, kh1);
  const khac = ngay(van(['danCu', 'vanPhong']), kh0, kh1);
  assert.ok(khac.baoCao[0].nguoi[0].khach >= cung.baoCao[0].nguoi[0].khach, 'khác khu thì không bị giá rẻ hút mất khách');
  assert.equal(cung.baoCao[0].nguoi[0].soTiemKhu, 2);
  assert.equal(khac.baoCao[0].nguoi[0].soTiemKhu, 1);
});

test('nhu cầu khu: ít đối thủ thì mỗi tiệm nhiều khách hơn; món hợp khu nhiều khách hơn', () => {
  const st = van();
  const motMinh = E.nhuCauKhu(st, 'danCu', 'cookies', 1), baTiem = E.nhuCauKhu(st, 'danCu', 'cookies', 3);
  assert.ok(motMinh > baTiem / 3);
  assert.ok(E.nhuCauKhu(st, 'truong', 'pizza', 1) > E.nhuCauKhu(st, 'truong', 'tart', 1));
});

test('tiền thuê theo khu', () => {
  const a = ngay(van(['duLich', 'truong']));
  assert.equal(a.baoCao[0].nguoi[0].chiPhi.thue, KHU.duLich.thue);
  assert.equal(a.baoCao[0].nguoi[1].chiPhi.thue, KHU.truong.thue);
});

test('độ nhạy giá theo khu: cùng giá cao, khách du lịch ít bỏ về hơn học sinh', () => {
  assert.ok(E.heSoGia('cookies', 30, E.nhayKhu('duLich')) > E.heSoGia('cookies', 30, E.nhayKhu('truong')));
  assert.equal(E.heSoGia('cookies', 30), E.heSoGia('cookies', 30, 100), 'Nhập môn không đổi');
});

test('5 điểm chạm: mặc định, đầu tư làm tăng đúng điểm, bánh cũ trừ Mắt/Mũi/Miệng', () => {
  const st = van(); const p = st.nguoi[0];
  const d0 = E.diemTraiNghiem(st, p, {});
  assert.deepEqual(d0, { mat: 10, tai: 10, mui: 10, kg: 30, mieng: 30 });
  const p2 = { ...p, tn: { tuKinh: true, ke: true, loa: true, loQuay: true, quat: true, banGhe: true }, quay: 2, lePhep: 2 };
  const d1 = E.diemTraiNghiem(st, p2, { baoBi: true, lamTuoi: true });
  assert.ok(d1.mat === 40 && d1.tai === 48 && d1.mui === 50 && d1.kg === 50, JSON.stringify(d1));
  const cu = { ...p, hang: { cookies: [{ q: 2, exp: st.ngay + 2 }] } };   // bánh làm từ trước hôm nay
  cu.hang.cookies[0].exp = st.ngay + 2; // hạn 5 ngày, làm 2 ngày trước
  const st2 = { ...st, ngay: 3 }; cu.hang.cookies[0].exp = 5;
  const d2 = E.diemTraiNghiem(st2, cu, {});
  assert.ok(d2.mat < d0.mat || d2.mat === 0); assert.equal(d2.mieng, 20);
});

test('độ sạch giảm khi không dọn, giữ khi dọn 10 xu/ngày; Không gian thay đổi theo', () => {
  let st = van();
  st = ngay(st, { donDep: true }, {});
  assert.equal(st.nguoi[0].sach, LUAT.sachMax); assert.equal(st.nguoi[1].sach, LUAT.sachMax - LUAT.sachGiam);
  for (let i = 0; i < 5; i++) st = ngay(st, { donDep: true }, {});
  assert.equal(st.nguoi[1].sach, 0);
  assert.ok(st.baoCao.at(-1).nguoi[0].traiNghiem.kg > st.baoCao.at(-1).nguoi[1].traiNghiem.kg);
});

test('trải nghiệm tốt kéo nhiều khách hơn (cùng giá, cùng hàng)', () => {
  let a = van(), b = van();
  const dt = { dauTuTN: ['tuKinh', 'ke', 'loa'], thueQuay: 2, daoTaoQuay: 2, donDep: true };
  a = ngay(a, COOK, COOK); b = ngay(b, { ...COOK, ...dt }, COOK);
  assert.ok(b.baoCao[0].nguoi[0].hut.cookies > a.baoCao[0].nguoi[0].hut.cookies);
  assert.ok(E.hutTraiNghiem('danCu', { mat: 50, tai: 50, mui: 50, kg: 50 }) >= 140);
  assert.ok(E.hutTraiNghiem('danCu', { mat: 0, tai: 0, mui: 0, kg: 0 }) <= 72);
});

test('đầu tư trải nghiệm: trừ tiền đúng, không mua trùng, chặn ở Nhập môn', () => {
  const st = van(); const t0 = st.nguoi[0].tien;
  const s1 = E.nopKeHoach(st, 0, { dauTuTN: ['tuKinh', 'loa'], donDep: true, khaoSat: true, baoBi: true, ...COOK });
  assert.equal(t0 - s1.nguoi[0].tien, 150 + 40 + 10 + 30 + 4 + (4 * 2 + 4 * 1 + 4 * 4 + 4 * 5) * 0 + Object.entries(COOK.mua).reduce((s, [nl, q]) => s + q * st.thiTruong.gia[nl], 0));
  assert.equal(s1.nguoi[0].khaoSat, st.ngay);
  const s2 = ngay(st, { dauTuTN: ['tuKinh'] });
  assert.match(E.kiemTraKeHoach(s2, 0, { dauTuTN: ['tuKinh'] }).loi[0], /Đã có/);
  assert.equal(E.kiemTraKeHoach(st, 0, { dauTuTN: ['xeBay'] }).ok, false);
  const nm = E.taoVan({ seed: 1, nguoiChoi: [{}, {}] });
  for (const kh of [{ dauTuTN: ['loa'] }, { donDep: true }, { khaoSat: true }, { baoBi: true }]) assert.equal(E.kiemTraKeHoach(nm, 0, kh).ok, false);
});

test('Miệng quyết định uy tín: toàn thợ cả +2, toàn học việc −2 (khi có bán)', () => {
  let a = van(), b = van();
  a = ngay(a, { ...COOK, thueCap: { 3: 3 }, saThai: 3 }, COOK);
  b = ngay(b, { ...COOK, thueCap: { 1: 5 }, saThai: 3 }, COOK);
  assert.ok(a.baoCao[0].nguoi[0].traiNghiem.mieng >= 40);
  assert.ok(b.baoCao[0].nguoi[0].traiNghiem.mieng <= 20);
  assert.ok(a.nguoi[0].uyTin > b.nguoi[0].uyTin);
});

test('phân tích thị trường và khảo sát khách', () => {
  let st = van(['truong', 'truong', 'duLich']);
  const pt = E.phanTichThiTruong(st);
  assert.equal(pt.length, 4);
  assert.equal(pt.find((x) => x.khu === 'truong').soTiem, 2);
  assert.equal(pt.find((x) => x.khu === 'vanPhong').soTiem, 0);
  assert.equal(pt.find((x) => x.khu === 'truong').coiTrong, 'mat');
  assert.equal(pt.find((x) => x.khu === 'vanPhong').coiTrong, 'tai');
  st = ngay(st, COOK, COOK, COOK);
  const ks = E.khaoSatKhu(st, 'truong');
  assert.equal(ks.soTiem, 2);
  assert.equal(ks.banChay[0][0], 'cookies');
  assert.ok(ks.giaTB.cookies > 0);
});

test('báo cáo: món không hợp khu bị ghi lại → bài học "bán đúng món cho đúng người"', () => {
  let st = ngay(van(['truong', 'danCu']), { muaCongThuc: 'macaron', thueCap: { 3: 1 } });
  const truoc = st;
  st = ngay(st, { mua: { hat: 1, duong: 2, trung: 1 }, lam: { macaron: 1 } });
  assert.equal(st.baoCao.at(-1).nguoi[0].saiMon, 'macaron');
  const b = H.baiHocHomNay(truoc, st, 0, { cheDo: 'dn', daGapTrongMua: ['matThap', 'taiThap', 'khongGianBan', 'miengThap'] });
  assert.equal(b, 'banSaiMon');
});

test('phiếu trải nghiệm khách: chỉ điểm yếu nhất, khen điểm mạnh nhất', () => {
  const f = H.phieuTraiNghiem({ mat: 40, tai: 10, mui: 20, kg: 30, mieng: 30 }, 1);
  assert.equal(f.yeu, 'tai'); assert.equal(f.manh, 'mat');
  assert.equal(f.noi.length, 2);
  assert.ok(f.noi[1].includes('chào') || f.noi[1].includes('cộc lốc'));
  assert.equal(f.sao.mat, 4);
  assert.equal(H.phieuTraiNghiem(null), null);
});

test('bài học điểm chạm chỉ hiện ở Doanh nhân', () => {
  const st = van(); const s1 = ngay(st, COOK, COOK);
  const b = H.baiHocHomNay(st, s1, 0, { cheDo: 'dn' });
  assert.ok(['matThap', 'taiThap', 'khongGianBan', 'miengThap', 'muiThom'].includes(b), b);
  const nm0 = E.taoVan({ seed: 8, mua: 1, nguoiChoi: [{}, {}] });
  const nm1 = ngay(nm0, COOK, COOK);
  assert.equal(nm1.baoCao[0].nguoi[0].traiNghiem, undefined);
});

test('200 ván Doanh nhân với tiệm rải 4 khu: hợp lệ, tiền khớp sổ, điểm chạm luôn trong 0–50', () => {
  const ks = Object.keys(KHU);
  for (let s = 0; s < 200; s++) {
    const muc = ['de', 'vua', 'kho'];
    let st = E.taoVan({ seed: 7000 + s, mua: (s % 5) + 1, cheDo: 'dn', nguoiChoi: muc.map((m, i) => ({ khu: ks[(s + i * (s % 2 ? 1 : 0)) % 4] })) });
    while (!st.ketThuc) {
      for (const id of E.choNop(st)) {
        let kh = keHoachMay(st, id, muc[id]);
        if (s % 3 === 0) kh = { ...kh, donDep: true };
        if (!E.kiemTraKeHoach(st, id, kh).ok) kh = keHoachMay(st, id, muc[id]);
        st = E.nopKeHoach(st, id, kh);
      }
      const truoc = st; st = E.ketThucNgay(st);
      const bc = st.baoCao.at(-1);
      for (const p of st.nguoi) {
        const r = bc.nguoi[p.id]; if (!r || truoc.nguoi[p.id].pha) continue;
        const c = r.chiPhi;
        assert.equal(p.tien, truoc.nguoi[p.id].tien + r.doanhThu - (c.luong + c.thue + c.lai + (c.phatDon || 0)));
        for (const v of Object.values(r.traiNghiem)) assert.ok(Number.isInteger(v) && v >= 0 && v <= 50);
      }
    }
  }
});
