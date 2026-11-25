import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../docs/engine.js';
import { keHoachMay } from '../docs/doiThu.js';
import * as H from '../docs/hocChoi.js';

const NGAY = 24 * 3600 * 1000;
function choiHet(seed, mua = 1, muc = ['vua', 'vua']) {
  let st = E.taoVan({ seed, mua, nguoiChoi: muc.map((m, i) => ({ ten: `T${i}` })) });
  while (!st.ketThuc) { for (const id of E.choNop(st)) st = E.nopKeHoach(st, id, keHoachMay(st, id, muc[id])); st = E.ketThucNgay(st); }
  return st;
}

test('30 bài học, mỗi bài có câu đố hợp lệ', () => {
  const ds = Object.entries(H.BAI_HOC);
  assert.equal(ds.length, 30);
  for (const [k, b] of ds) {
    assert.ok(['nm', 'dn'].includes(b.cheDo), k);
    assert.ok(b.noiDung.length > 10 && b.icon, k);
    const [hoi, chon, dung, gt] = b.cauDo;
    assert.ok(hoi && gt, k); assert.equal(chon.length, 3, k); assert.ok(dung >= 0 && dung < 3, k);
  }
  assert.ok(ds.filter(([, b]) => b.cheDo === 'nm').length >= 10, 'đủ bài cho Nhập môn');
});

test('câu đố: 3 câu, cùng seed cùng câu, ưu tiên bài đã gặp, chỉ bài Nhập môn khi chơi Nhập môn', () => {
  const a = H.taoCauDo(['boBanh', 'hetBanh'], 42), b = H.taoCauDo(['boBanh', 'hetBanh'], 42);
  assert.deepEqual(a, b);
  assert.equal(a.length, 3);
  assert.deepEqual(new Set(a.slice(0, 2).map((c) => c.baiHoc)), new Set(['boBanh', 'hetBanh']));
  for (const c of H.taoCauDo([], 7)) assert.equal(H.BAI_HOC[c.baiHoc].cheDo, 'nm');
  assert.equal(new Set(H.taoCauDo([], 9).map((c) => c.baiHoc)).size, 3, 'không trùng câu');
  const cd = H.taoCauDo(['giaCao'], 1);
  assert.equal(H.chamCauDo(cd, cd.map((c) => c.dung)), 3);
  assert.equal(H.chamCauDo(cd, cd.map((c) => (c.dung + 1) % 3)), 0);
});

test('bài học hôm nay: phát hiện đúng tình huống, tối đa 1 bài, ưu tiên bài chưa gặp', () => {
  let st = E.taoVan({ seed: 3, mua: 1, nguoiChoi: [{ ten: 'A' }, { ten: 'B' }] });
  const truoc = st;
  // A vay tiền + làm quá nhiều bánh mì (sẽ bỏ) ; B không làm gì
  st = E.nopKeHoach(st, 0, { vay: 100, mua: { bot: 48, trung: 24 }, lam: { banhmi: 24 }, gia: { banhmi: 36 } });
  st = E.nopKeHoach(st, 1, {});
  const sau = E.ketThucNgay(st);
  const r = sau.baoCao[0].nguoi[0];
  assert.ok(r.bo > 0);
  assert.equal(H.baiHocHomNay(truoc, sau, 0), 'vayLanDau');
  assert.equal(H.baiHocHomNay(truoc, sau, 0, { daGap: ['vayLanDau'] }), 'boBanh');
  assert.equal(H.baiHocHomNay(truoc, sau, 0, { daGapTrongMua: ['vayLanDau', 'boBanh'] }), 'giaCao');
  assert.equal(H.baiHocHomNay(truoc, sau, 0, { daGapTrongMua: ['vayLanDau', 'boBanh', 'giaCao'] }), null, 'đã gặp hết trong mùa thì không lặp');
  // bài Doanh nhân không hiện ở Nhập môn
  for (const k of ['vayLanDau', 'boBanh']) assert.equal(H.BAI_HOC[k].cheDo, 'nm');
});

test('bài học: cảnh báo đỏ được ưu tiên trước mọi bài khác', () => {
  let st = E.taoVan({ seed: 3, mua: 1, nguoiChoi: [{ ten: 'A' }, { ten: 'B' }] });
  const truoc = st;
  st = E.nopKeHoach(E.nopKeHoach(st, 0, { vay: 100 }), 1, {});
  const sau = E.ketThucNgay(st);
  assert.equal(H.baiHocHomNay(truoc, sau, 0, { canhBao: { muc: 'do' } }), 'canhBaoDo');
});

test('đếm số ngày lỗ liên tiếp', () => {
  assert.equal(H.soNgayLoLienTiep([1000]), 0);
  assert.equal(H.soNgayLoLienTiep([1000, 990, 980, 970]), 3);
  assert.equal(H.soNgayLoLienTiep([1000, 900, 950, 940]), 1);
  assert.equal(H.soNgayLoLienTiep([1000, 1000]), 0);
});

test('cảnh báo: lỗ 3 ngày vàng, 5 ngày đỏ, dưới nửa vốn đỏ, nợ cao, vay chồng', () => {
  const st = E.taoVan({ seed: 1, mua: 1, nguoiChoi: [{ ten: 'A' }, { ten: 'B' }] });
  assert.deepEqual(H.canhBaoTiem(st, 0, [1000, 1000]), { muc: null, ly: [] });
  assert.equal(H.canhBaoTiem(st, 0, [1100, 1050, 1030, 1000]).muc, 'vang');
  assert.equal(H.canhBaoTiem(st, 0, [1200, 1150, 1100, 1060, 1030, 1000]).muc, 'do');
  assert.equal(H.canhBaoTiem(st, 0, [2100, 1000]).muc, 'do', 'giá trị dưới nửa lúc đầu');
  const st2 = JSON.parse(JSON.stringify(st));
  st2.nguoi[0].no = 2000; st2.nguoi[0].tien = 2600;       // giá trị 600, nợ/tài sản = 2000/2600 = 76%
  const v = H.canhBaoTiem(st2, 0, [600]);
  assert.equal(v.muc, 'vang'); assert.match(v.ly[0], /Nợ bằng 76%/);
  st2.nguoi[0].tien = 2100;                                 // nợ/tài sản 95%
  assert.equal(H.canhBaoTiem(st2, 0, [100]).muc, 'do');
  assert.equal(H.canhBaoTiem(st, 0, [1000], { soKhoanVay: 3 }).muc, 'do');
});

test('hồ sơ: tạo, chống trùng tên, sửa, xoá, giới hạn; hàm không sửa đầu vào', () => {
  let kho = H.khoRong();
  const k0 = JSON.stringify(kho);
  ({ kho } = H.taoHoSo(kho, 'Bố', '👨'));
  assert.equal(JSON.stringify(H.khoRong()), k0);
  assert.throws(() => H.taoHoSo(kho, ' bố '), /đã có/);
  assert.throws(() => H.taoHoSo(kho, '   '), /Cần nhập tên/);
  const r = H.taoHoSo(kho, 'Mẹ', '👩'); kho = r.kho;
  assert.equal(kho.hoSo.length, 2); assert.notEqual(kho.hoSo[0].id, kho.hoSo[1].id);
  kho = H.suaHoSo(kho, r.hoSo.id, { ten: 'Mẹ Hiền' });
  assert.equal(kho.hoSo[1].ten, 'Mẹ Hiền');
  assert.throws(() => H.suaHoSo(kho, r.hoSo.id, { ten: 'bố' }), /đã có/);
  kho = H.xoaHoSo(kho, r.hoSo.id);
  assert.equal(kho.hoSo.length, 1);
  for (let i = 0; i < 11; i++) ({ kho } = H.taoHoSo(kho, `Người ${i}`));
  assert.throws(() => H.taoHoSo(kho, 'Thừa'), /Tối đa 12/);
  assert.equal(H.capNguoiChoi(0).ma, 'tapSu'); assert.equal(H.capNguoiChoi(30).ma, 'chuTiem'); assert.equal(H.capNguoiChoi(300).ma, 'ongTrum');
});

test('sổ bài học: ghi 1 lần, bỏ qua mã lạ', () => {
  let { kho, hoSo } = H.taoHoSo(H.khoRong(), 'Bin');
  kho = H.ghiBaiHoc(kho, hoSo.id, 'boBanh'); kho = H.ghiBaiHoc(kho, hoSo.id, 'boBanh'); kho = H.ghiBaiHoc(kho, hoSo.id, 'khongCo');
  assert.deepEqual(kho.hoSo[0].baiHoc, ['boBanh']);
});

test('tạo ván: 1 người giữ nhiều tiệm → cảnh báo + không tính cúp', () => {
  let { kho, hoSo: a } = H.taoHoSo(H.khoRong(), 'Bố');
  const r = H.kiemTraTaoVan(kho, [a.id, a.id, null]);
  assert.equal(r.khongTinhCup, true);
  assert.equal(r.canhBao[0].loai, 'nhieuTiem');
  assert.equal(H.kiemTraTaoVan(kho, [a.id, null]).canhBao.length, 0);
});

test('bỏ ván đang thua: chỉ ghi người xếp chót; 2 lần trong 7 ngày → cảnh báo', () => {
  let kho = H.khoRong(); let a, b;
  ({ kho, hoSo: a } = H.taoHoSo(kho, 'An')); ({ kho, hoSo: b } = H.taoHoSo(kho, 'Bình'));
  const st = JSON.parse(JSON.stringify(E.taoVan({ seed: 2, mua: 1, nguoiChoi: [{ ten: 'A' }, { ten: 'B' }] })));
  st.nguoi[0].tien = 500;                                   // An đang chót
  const t0 = 1_000_000_000_000;
  kho = H.ghiBoVan(kho, st, { 0: a.id, 1: b.id }, t0);
  kho = H.ghiBoVan(kho, st, { 0: a.id, 1: b.id }, t0 + 2 * NGAY);
  assert.equal(kho.hoSo[0].boVan.length, 2); assert.equal(kho.hoSo[1].boVan.length, 0);
  const r = H.kiemTraTaoVan(kho, [a.id, b.id], t0 + 3 * NGAY);
  assert.equal(r.canhBao.filter((c) => c.loai === 'boVan').length, 1);
  assert.equal(r.khongTinhCup, false, 'chỉ nhắc, vẫn tính cúp');
  assert.equal(H.kiemTraTaoVan(kho, [a.id], t0 + 10 * NGAY).canhBao.length, 0, 'quá 7 ngày thì thôi nhắc');
  const het = JSON.parse(JSON.stringify(st)); het.ketThuc = true;
  assert.equal(H.ghiBoVan(kho, het, { 0: a.id }, t0), kho, 'ván đã xong không tính bỏ ván');
});

test('Doanh nhân bị khoá tới khi thắng Nhập môn hoặc người lớn mở khoá', () => {
  let { kho, hoSo } = H.taoHoSo(H.khoRong(), 'Bin');
  assert.equal(H.kiemTraTaoVan(kho, [hoSo.id], Date.now(), 'dn').chan, true);
  kho = H.moKhoaDoanhNhan(kho, hoSo.id);
  assert.equal(H.kiemTraTaoVan(kho, [hoSo.id], Date.now(), 'dn').chan, false);
});

test('trao cúp cuối mùa: hạng, sạch nợ, học giỏi, kỷ lục, mở Doanh nhân; máy không nhận cúp', () => {
  const st = choiHet(11, 1, ['vua', 'vua', 'de']);
  let kho = H.khoRong(); let a, b;
  ({ kho, hoSo: a } = H.taoHoSo(kho, 'An')); ({ kho, hoSo: b } = H.taoHoSo(kho, 'Bình'));
  const ganHoSo = { 0: a.id, 1: b.id, 2: null };
  const { kho: k1, ketQua } = H.traoCupCuoiMua(kho, st, { ganHoSo, cauDoDung: { 0: 3, 1: 1 }, now: 5 });
  const hangCua = (id) => st.xepHang.findIndex((x) => x.id === id);
  for (const [id, hs] of [[0, k1.hoSo[0]], [1, k1.hoSo[1]]]) {
    const ma = ketQua[id].cup;
    if (hangCua(id) <= 2) assert.ok(ma.includes(['hang1', 'hang2', 'hang3'][hangCua(id)]));
    assert.equal(ma.includes('sachNo'), st.nguoi[id].no === 0 && !st.nguoi[id].pha);
    assert.equal(hs.diem, ma.reduce((s, m) => s + H.CUP[m].diem, 0), 'điểm = tổng điểm cúp');
    assert.equal(hs.kyLuc.nm, st.xepHang[hangCua(id)].giaTri);
    assert.ok(!ma.includes('kyLuc'), 'lần đầu chỉ ghi kỷ lục, chưa trao cúp');
    assert.equal(hs.thangNhapMon, hangCua(id) === 0);
  }
  assert.ok(ketQua[0].cup.includes('hocGioi')); assert.ok(!ketQua[1].cup.includes('hocGioi'));
  assert.equal(ketQua[2], undefined, 'tiệm máy không có hồ sơ');
  // mùa sau giá trị cao hơn → cúp kỷ lục
  const st2 = JSON.parse(JSON.stringify(st)); st2.xepHang = st2.xepHang.map((x) => ({ ...x, giaTri: x.giaTri + 5000 }));
  const { ketQua: kq2 } = H.traoCupCuoiMua(k1, st2, { ganHoSo });
  assert.ok(kq2[0].cup.includes('kyLuc'));
});

test('trao cúp: ván bị đánh dấu không tính cúp; mùa chưa xong thì báo lỗi', () => {
  const st = choiHet(12);
  const { kho, hoSo } = H.taoHoSo(H.khoRong(), 'An');
  const r = H.traoCupCuoiMua(kho, st, { ganHoSo: { 0: hoSo.id }, khongTinhCup: true });
  assert.equal(r.kho.hoSo[0].cup.length, 0);
  assert.throws(() => H.traoCupCuoiMua(kho, E.taoVan({ seed: 1, mua: 1, nguoiChoi: [{}] }), {}), /chưa kết thúc/);
});

test('cúp Không bỏ phí và Vượt khó', () => {
  const st = choiHet(13);
  const id = st.xepHang[0].id;
  const { kho, hoSo } = H.taoHoSo(H.khoRong(), 'An');
  const { ketQua } = H.traoCupCuoiMua(kho, st, { ganHoSo: { [id]: hoSo.id }, daDo: { [id]: true } });
  assert.ok(ketQua[id].cup.includes('vuotKho'));
  assert.equal(ketQua[id].cup.includes('khongBoPhi'), H.maxChuoiKhongBo(st, id) >= 5);
});

test('cúp Doanh nhân chỉ trao ở chế độ Doanh nhân', () => {
  const st = choiHet(14);
  const { kho, hoSo } = H.taoHoSo(H.khoRong(), 'An');
  const tt = { 0: { soCuaHang: 3, diemTraiNghiemTB5Ngay: 46, laiDauTu: 10 } };
  const nm = H.traoCupCuoiMua(kho, st, { ganHoSo: { 0: hoSo.id }, thongTinDN: tt }).ketQua[0].cup;
  const dn = H.traoCupCuoiMua(kho, st, { ganHoSo: { 0: hoSo.id }, thongTinDN: tt, cheDo: 'dn' }).ketQua[0].cup;
  for (const m of ['chuoi', 'khachQuen', 'dauTuKhon']) { assert.ok(!nm.includes(m)); assert.ok(dn.includes(m)); }
});

test('chạy 100 ván thật: theo dõi cảnh báo + bài học mỗi ngày không lỗi, số bài/ngày ≤ 1', () => {
  let tongBai = 0, coDo = 0;
  for (let s = 0; s < 100; s++) {
    const muc = ['vua', 'de', 'kho'];
    let st = E.taoVan({ seed: 900 + s, mua: (s % 5) + 1, nguoiChoi: muc.map((m) => ({ ten: m })) });
    const chuoi = { 0: [E.giaTriTiem(st, st.nguoi[0])], 1: [E.giaTriTiem(st, st.nguoi[1])], 2: [E.giaTriTiem(st, st.nguoi[2])] };
    const gap = { 0: [], 1: [], 2: [] };
    while (!st.ketThuc) {
      const truoc = st;
      for (const id of E.choNop(st)) st = E.nopKeHoach(st, id, keHoachMay(st, id, muc[id]));
      st = E.ketThucNgay(st);
      for (const id of [0, 1, 2]) {
        chuoi[id].push(E.giaTriTiem(st, st.nguoi[id]));
        const cb = H.canhBaoTiem(st, id, chuoi[id]);
        if (cb.muc === 'do') coDo++;
        const b = H.baiHocHomNay(truoc, st, id, { daGapTrongMua: gap[id], canhBao: cb });
        if (b) { assert.equal(H.BAI_HOC[b].cheDo, 'nm'); gap[id].push(b); tongBai++; }
      }
    }
    for (const id of [0, 1, 2]) assert.equal(H.taoCauDo(gap[id], st.seed).length, 3);
  }
  assert.ok(tongBai > 100, `có bài học xuất hiện (${tongBai})`);
  console.log(`  100 ván: ${tongBai} thẻ bài học, ${coDo} lượt cảnh báo đỏ`);
});
