import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../docs/engine.js';
import { keHoachMay } from '../docs/doiThu.js';

const ba = () => [{ ten: 'A' }, { ten: 'B' }, { ten: 'C' }];
const van = (o = {}) => E.taoVan({ seed: 7, mua: 1, nguoiChoi: ba(), ...o });
// Ép ngày "bình thường", nắng đẹp, giá gốc để kiểm thử dễ đoán
function chuan(st) {
  st.suKien = { id: 'thuong', may: null, don: null }; st.thoiTiet = 1; st.hieuUng = [];
  for (const nl of Object.keys(E.NGUYEN_LIEU)) st.thiTruong.gia[nl] = E.NGUYEN_LIEU[nl].gia;
  return st;
}
const nopHet = (st, kh = {}) => { for (const id of E.choNop(st)) st = E.nopKeHoach(st, id, typeof kh === 'function' ? kh(id, st) : kh); return st; };
const choiHet = (st, muc = ['de', 'vua', 'kho'], tuy = []) => {
  while (!st.ketThuc) { for (const id of E.choNop(st)) st = E.nopKeHoach(st, id, keHoachMay(st, id, muc[id] || 'vua', tuy[id] || {})); st = E.ketThucNgay(st); }
  return st;
};
const nguyen = (v) => Number.isSafeInteger(v);

// ---------- Tạo ván, hạt giống ----------
test('tạo ván: đủ người, tiền đầu, 3 thợ, lò cấp 1, ngày 1', () => {
  const st = van();
  assert.equal(st.nguoi.length, 3); assert.equal(st.ngay, 1);
  for (const p of st.nguoi) { assert.equal(p.tien, E.LUAT.tienDau); assert.equal(p.tho.length, 3); assert.equal(p.lo, 1); }
  assert.throws(() => E.taoVan({ seed: 1, nguoiChoi: [] }));
  assert.throws(() => E.taoVan({ seed: 1, nguoiChoi: Array(5).fill({}) }));
});
test('cùng hạt giống → cùng diễn biến cả mùa; khác hạt giống → khác', () => {
  const a = choiHet(van({ seed: 99 })), b = choiHet(van({ seed: 99 })), c = choiHet(van({ seed: 100 }));
  assert.deepEqual(a.xepHang, b.xepHang);
  assert.deepEqual(a.baoCao.map((x) => x.suKien), b.baoCao.map((x) => x.suKien));
  assert.notDeepEqual(a.baoCao.map((x) => x.suKien), c.baoCao.map((x) => x.suKien));
});
test('hàm công khai không sửa state đầu vào', () => {
  const st = chuan(van()); const truoc = JSON.stringify(st);
  const s2 = E.nopKeHoach(st, 0, { mua: { bot: 10 } });
  assert.equal(JSON.stringify(st), truoc);
  assert.notEqual(s2.nguoi[0].tien, st.nguoi[0].tien);
});

// ---------- Mua, làm bánh, năng lực ----------
test('mua nguyên liệu trừ đúng tiền, hạn dùng đúng', () => {
  let st = chuan(van());
  st = E.nopKeHoach(st, 0, { mua: { bot: 10, trung: 5 } });
  const p = st.nguoi[0];
  assert.equal(p.tien, 1000 - 10 * 2 - 5 * 2);
  assert.equal(E.tonKho(p, 'bot'), 10);
  assert.equal(p.kho.trung[0].exp, 1 + E.NGUYEN_LIEU.trung.han - 1);
});
test('làm bánh tiêu đúng nguyên liệu; thiếu nguyên liệu / vượt công / vượt lò bị chặn', () => {
  let st = chuan(van());
  const s1 = E.nopKeHoach(st, 0, { mua: { bot: 20, trung: 10 }, lam: { banhmi: 10 } });
  assert.equal(E.tonKho(s1.nguoi[0], 'bot'), 0); assert.equal(E.tonKho(s1.nguoi[0], 'trung'), 0);
  assert.equal(E.tonHang(s1.nguoi[0], 'banhmi'), 10);
  assert.match(E.kiemTraKeHoach(st, 0, { mua: { bot: 20, trung: 9 }, lam: { banhmi: 10 } }).loi[0], /Thiếu Trứng/);
  assert.match(E.kiemTraKeHoach(st, 0, { mua: { bot: 50, trung: 25 }, lam: { banhmi: 25 } }).loi[0], /Vượt công thợ/); // 3 thợ = 24 công
  st.nguoi[0].tho = Array(8).fill({ ngay: 9 });                                     // 64 công, lò 40
  assert.match(E.kiemTraKeHoach(st, 0, { mua: { bot: 90, trung: 45 }, lam: { banhmi: 45 } }).loi[0], /Vượt sức lò/);
});
test('thợ mới 6 công, sau 5 ngày thành 8 công', () => {
  let st = chuan(van());
  st = E.nopKeHoach(st, 0, { thue: 1 }); st = nopHet(st);
  assert.equal(E.congTho(st, st.nguoi[0]), 24 + 6);
  for (let i = 0; i < 5; i++) { st = E.ketThucNgay(st); chuan(st); st = nopHet(st); }
  assert.equal(E.congTho(st, st.nguoi[0]), 32);
});
test('không đủ tiền thì chặn; vay thêm thì được; vượt hạn mức vay bị chặn', () => {
  const st = chuan(van());
  assert.match(E.kiemTraKeHoach(st, 0, { mua: { hat: 300 } }).loi[0], /Không đủ tiền/);
  assert.equal(E.kiemTraKeHoach(st, 0, { vay: 300, mua: { hat: 250 } }).ok, true);
  assert.match(E.kiemTraKeHoach(st, 0, { vay: 301 }).loi[0], /tối đa 300/);   // mùa 1 trần 300
  assert.match(E.kiemTraKeHoach(st, 0, { mua: { bot: -1 } }).loi[0], /số nguyên không âm/);
  assert.match(E.kiemTraKeHoach(st, 0, { mua: { bot: 1.5 } }).loi[0], /số nguyên/);
});
test('mùa 1 chưa có nghiên cứu, chi nhánh; bánh chưa mở khoá thì không làm được', () => {
  const st = chuan(van());
  assert.match(E.kiemTraKeHoach(st, 0, { nghienCuu: 'sukem' }).loi[0], /chưa mở nghiên cứu/);
  assert.match(E.kiemTraKeHoach(st, 0, { chiNhanh: true }).loi[0], /chưa mở được chi nhánh/);
  assert.match(E.kiemTraKeHoach(st, 0, { lam: { sukem: 1 } }).loi[0], /không có trong mùa/);
  const s2 = chuan(van({ mua: 2 }));
  assert.match(E.kiemTraKeHoach(s2, 0, { mua: { bot: 1, trung: 2, sua: 2 }, lam: { sukem: 1 } }).loi[0], /Chưa nghiên cứu/);
});
test('nghiên cứu mất 2 ngày rồi mở khoá công thức', () => {
  let st = chuan(van({ mua: 2 }));
  st = E.nopKeHoach(st, 0, { nghienCuu: 'sukem' }); assert.equal(st.nguoi[0].tien, 1000 - 150);
  st = E.ketThucNgay(nopHet(st)); assert.equal(st.nguoi[0].moKhoa.includes('sukem'), false);
  st = E.ketThucNgay(nopHet(chuan(st))); assert.equal(st.nguoi[0].moKhoa.includes('sukem'), true);
  assert.equal(E.kiemTraKeHoach(chuan(st), 0, { mua: { bot: 1, trung: 2, sua: 2 }, lam: { sukem: 1 } }).ok, true);
});
test('máy đánh trứng giảm 1 công cho bông lan; nâng lò tăng sức nướng', () => {
  let st = chuan(van());
  st = E.nopKeHoach(st, 0, { mayDanh: true, nangLo: true });
  const p = st.nguoi[0];
  assert.equal(E.congBanh(p, 'bonglan'), 1); assert.equal(E.congBanh(p, 'banhmi'), 1);
  assert.equal(E.sucLo(st, p), 70); assert.equal(p.tien, 1000 - 300 - 400);
});

// ---------- Bán hàng ----------
test('bán: không vượt số khách, không vượt hàng; tiền vào đúng giá × số bán', () => {
  let st = chuan(van());
  st = nopHet(st, (id) => ({ mua: { bot: 40, trung: 20 }, lam: { banhmi: 20 }, gia: { banhmi: 12 } }));
  const s2 = E.ketThucNgay(st);
  const r = s2.baoCao[0];
  let tongBan = 0;
  for (const id of [0, 1, 2]) {
    const x = r.nguoi[id]; const ban = x.ban.banhmi || 0; tongBan += ban;
    assert.ok(ban <= 20); assert.equal(x.doanhThu, ban * 12);
    assert.equal(s2.nguoi[id].tien, 1000 - 120 - 75 - 30 + ban * 12);
  }
  assert.ok(tongBan <= Math.ceil(E.nhuCauDuKien(st, 'banhmi') * 1.1) + 1);
});
test('tiệm hết bánh thì khách chuyển sang tiệm còn bánh', () => {
  let st = chuan(van());
  st = E.nopKeHoach(st, 0, { mua: { bot: 4, trung: 2 }, lam: { banhmi: 2 } });
  st = E.nopKeHoach(st, 1, { mua: { bot: 80, trung: 40 }, lam: { banhmi: 24 } });
  st = E.nopKeHoach(st, 2, {});
  const r = E.ketThucNgay(st).baoCao[0].nguoi;
  assert.equal(r[0].ban.banhmi, 2);
  assert.ok(r[0].thieuKhach > 0);
  assert.ok(r[1].ban.banhmi > 2 * 18 / 3);       // B nhận cả khách dư của A và C
});
test('giá cao hơn → bán ít hơn (cùng điều kiện)', () => {
  const chay = (gia) => {
    let st = chuan(van());
    st = E.nopKeHoach(st, 0, { mua: { bot: 48, trung: 24 }, lam: { banhmi: 24 }, gia: { banhmi: gia } });
    st = E.nopKeHoach(st, 1, { mua: { bot: 48, trung: 24 }, lam: { banhmi: 24 } });
    st = E.nopKeHoach(st, 2, { mua: { bot: 48, trung: 24 }, lam: { banhmi: 24 } });
    return E.ketThucNgay(st).baoCao[0].nguoi[0].ban.banhmi || 0;
  };
  const re = chay(10), vua = chay(12), dat = chay(16);
  assert.ok(re > vua && vua > dat, `${re} > ${vua} > ${dat}`);
});
test('hệ số giá: đúng giá gợi ý = 100%, kẹp trong 5–250%', () => {
  assert.equal(E.heSoGia('banhmi', 12), 100);
  assert.equal(E.heSoGia('banhmi', 36), 5);
  assert.ok(E.heSoGia('banhkem', 66) > E.heSoGia('banhmi', 14));   // bánh kem ít nhạy giá hơn
});

// ---------- Hết hạn, chi phí, nợ ----------
test('bánh hết hạn bị bỏ, nguyên liệu hết hạn bị bỏ, có đếm', () => {
  let st = chuan(van());
  st = E.nopKeHoach(st, 0, { mua: { bot: 100, trung: 51, traicay: 3 }, lam: { banhmi: 24 } });
  st = E.ketThucNgay(nopHet(st));
  const r = st.baoCao[0].nguoi[0];
  assert.equal(r.bo, 24 - (r.ban.banhmi || 0));
  assert.equal(E.tonHang(st.nguoi[0], 'banhmi'), 0);
  st = E.ketThucNgay(nopHet(chuan(st)));          // trái cây hạn 2 ngày → bỏ cuối ngày 2
  assert.equal(st.baoCao[1].nguoi[0].boNL, 3);
});
test('lương, tiền thuê, lãi vay trừ cuối ngày; trả nợ được', () => {
  let st = chuan(van());
  st = E.nopKeHoach(st, 0, { vay: 300 });
  st = E.ketThucNgay(nopHet(st));
  const cp = st.baoCao[0].nguoi[0].chiPhi;
  assert.deepEqual(cp, { luong: 75, thue: 30, lai: 3 });
  assert.equal(st.nguoi[0].tien, 1000 + 300 - 75 - 30 - 3);
  st = E.nopKeHoach(chuan(st), 0, { tra: 300 }); assert.equal(st.nguoi[0].no, 0);
});
test('sa thải đền 3 ngày lương; thuê mất phí', () => {
  const st = E.nopKeHoach(chuan(van()), 0, { saThai: 1, thue: 2 });
  assert.equal(st.nguoi[0].tien, 1000 - 75 - 80); assert.equal(st.nguoi[0].tho.length, 4);
});
test('hết mùa còn nợ thì giá trị tiệm trừ nợ gấp đôi', () => {
  const st = van(); const p = st.nguoi[0]; p.no = 200;
  assert.equal(E.giaTriTiem(st, p, false), 1000 - 200);
  assert.equal(E.giaTriTiem(st, p, true), 1000 - 400);
});
test('âm tiền 2 ngày liền mà không vay được → phá sản, không xếp hạng trên người còn chơi', () => {
  let st = chuan(van());
  st.nguoi[0].tien = 50; st.nguoi[0].no = 300;  // hết hạn mức vay mùa 1
  st.nguoi[0].tho = Array(8).fill({ ngay: 9 });
  st = E.ketThucNgay(nopHet(st)); assert.equal(st.nguoi[0].pha, false);
  st = E.ketThucNgay(nopHet(chuan(st))); assert.equal(st.nguoi[0].pha, true);
  assert.throws(() => E.nopKeHoach(st, 0, {}), /không chơi được/);
  assert.equal(E.choNop(st).includes(0), false);
  assert.equal(E.xepHang(st).at(-1).id, 0);
});

// ---------- Sự kiện ----------
test('đơn đặt tiệc: giao đủ được thưởng 160% giá; thiếu bị phạt và trừ uy tín', () => {
  let st = chuan(van({ mua: 2 }));
  st.suKien = { id: 'tiec', may: null, don: { banh: 'cookies', sl: 5, han: 3, gia: 38 } };
  st = E.nopKeHoach(st, 0, { nhanDon: true });
  st = E.nopKeHoach(st, 1, { nhanDon: true });
  st = E.ketThucNgay(nopHet(st)); st = E.ketThucNgay(nopHet(chuan(st)));
  chuan(st);
  st = E.nopKeHoach(st, 0, { mua: { bot: 5, duong: 5, bo: 5, hat: 5 }, lam: { cookies: 5 } });
  const uyTinB = st.nguoi[1].uyTin;
  st = E.ketThucNgay(nopHet(st));
  const r = st.baoCao[2].nguoi;
  assert.match(r[0].don, /Giao đủ 5/); assert.ok(r[0].doanhThu >= 5 * 38);
  assert.match(r[1].don, /phạt 60 xu/); assert.equal(r[1].chiPhi.phatDon, 60);
  assert.ok(st.nguoi[1].uyTin < uyTinB);
  assert.match(E.kiemTraKeHoach(chuan(st), 0, { nhanDon: true }).loi[0], /không có đơn/);
});
test('hỏng lò / thợ ốm chỉ ảnh hưởng đúng 1 tiệm trong ngày', () => {
  const st = chuan(van());
  st.suKien = { id: 'hongMay', may: 1, don: null };
  assert.equal(E.sucLo(st, st.nguoi[1]), 28); assert.equal(E.sucLo(st, st.nguoi[0]), 40);
  st.suKien = { id: 'thoOm', may: 2, don: null };
  assert.equal(E.congTho(st, st.nguoi[2]), 16); assert.equal(E.congTho(st, st.nguoi[0]), 24);
});
test('nhà phê bình: tiệm uy tín cao nhất +50', () => {
  let st = chuan(van()); st.suKien = { id: 'phongBa', may: null, don: null };
  st.nguoi[2].uyTin = 400;
  st = E.ketThucNgay(nopHet(st));
  assert.equal(st.nguoi[2].uyTin, 450); assert.ok(st.nguoi[0].uyTin < 400);
});
test('giá nguyên liệu theo sự kiện kéo dài đúng số ngày', () => {
  let st = van({ seed: 3 });
  st.hieuUng = [{ giaNL: { bo: 200 }, den: 2 }];
  st = E.ketThucNgay(nopHet(st));
  assert.ok(st.thiTruong.gia.bo >= 6);           // giá gốc 4 ×2, dao động ±15%
  st = E.ketThucNgay(nopHet(st));
  assert.ok(st.hieuUng.every((h) => h.den >= st.ngay));
});

// ---------- Mùa, xếp hạng, huy hiệu ----------
test('mùa kết thúc đúng số ngày, có xếp hạng, không nộp thêm được', () => {
  for (const mua of [1, 2, 3, 4, 5]) {
    const st = choiHet(van({ mua, seed: mua * 11 }));
    assert.equal(st.ketThuc, true); assert.equal(st.baoCao.length, E.MUA[mua - 1].ngay);
    assert.equal(st.xepHang.length, 3);
    for (let i = 1; i < st.xepHang.length; i++) assert.ok(st.xepHang[i - 1].pha <= st.xepHang[i].pha);
    assert.throws(() => E.nopKeHoach(st, 0, {}), /kết thúc/);
  }
});
test('chưa đủ người nộp kế hoạch thì không kết thúc ngày được; không nộp 2 lần', () => {
  let st = van(); st = E.nopKeHoach(st, 0, {});
  assert.throws(() => E.ketThucNgay(st), /chưa nộp/);
  assert.throws(() => E.nopKeHoach(st, 0, {}), /đã nộp/);
});

// ---------- Bất biến trên nhiều ván ----------
test('200 ván máy chơi: kế hoạch máy luôn hợp lệ, mọi số là số nguyên, không âm kho, tiền khớp sổ', () => {
  for (let seed = 1; seed <= 200; seed++) {
    const mua = (seed % 5) + 1;
    let st = E.taoVan({ seed, mua, nguoiChoi: [{}, {}, {}, {}].slice(0, 2 + (seed % 3)) });
    const muc = ['de', 'vua', 'kho', 'vua'];
    while (!st.ketThuc) {
      const truoc = st.nguoi.map((p) => p.tien);
      for (const id of E.choNop(st)) {
        const kh = keHoachMay(st, id, muc[id]);
        const kt = E.kiemTraKeHoach(st, id, kh);
        assert.ok(kt.ok, `seed ${seed} ngày ${st.ngay} tiệm ${id}: ${kt.loi}`);
        st = E.nopKeHoach(st, id, kh);
      }
      const sauKH = st.nguoi.map((p) => p.tien);
      st = E.ketThucNgay(st);
      const bc = st.baoCao.at(-1).nguoi;
      for (const p of st.nguoi) {
        for (const v of [p.tien, p.no, p.uyTin]) assert.ok(nguyen(v), `seed ${seed}: không phải số nguyên`);
        for (const lots of [...Object.values(p.kho), ...Object.values(p.hang)]) for (const l of lots) assert.ok(l.q > 0 && nguyen(l.q));
        assert.ok(p.uyTin >= 0 && p.uyTin <= 500);
        if (bc[p.id] && !st.nguoi[p.id].pha) {
          const cp = Object.values(bc[p.id].chiPhi).reduce((s, x) => s + x, 0);
          assert.equal(p.tien, sauKH[p.id] + bc[p.id].doanhThu - cp, `seed ${seed} ngày ${st.ngay - 1}: tiền lệch sổ`);
        }
      }
      void truoc;
    }
  }
});

// ---------- Cân bằng (bản rút gọn của tools/mophong.js) ----------
test('cân bằng: Khó xếp hạng tốt hơn Vừa, Vừa tốt hơn Dễ; giá cao 120% không thắng chắc', () => {
  const hang = { de: 0, vua: 0, kho: 0 };
  for (let i = 0; i < 60; i++) {
    const muc = [['de', 'vua', 'kho'], ['vua', 'kho', 'de'], ['kho', 'de', 'vua']][i % 3];
    const st = choiHet(E.taoVan({ seed: 20000 + i, mua: (i % 5) + 1, nguoiChoi: ba() }), muc);
    st.xepHang.forEach((x, h) => { hang[muc[x.id]] += h + 1; });
  }
  assert.ok(hang.kho < hang.vua && hang.vua < hang.de, JSON.stringify(hang));
  let nhat = 0;
  for (let i = 0; i < 45; i++) {
    const tuy = [{}, {}, {}]; tuy[i % 3] = { heSoGia: 120 };
    const st = choiHet(E.taoVan({ seed: 30000 + i, mua: (i % 5) + 1, nguoiChoi: ba() }), ['vua', 'vua', 'vua'], tuy);
    if (st.xepHang[0].id === i % 3) nhat++;
  }
  assert.ok(nhat / 45 < 0.5, `giá 120% thắng ${nhat}/45`);
});
