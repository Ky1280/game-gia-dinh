// =====================================================================
// ĐẾ CHẾ TIỆM BÁNH — "Học mà chơi": bài học, câu đố, hồ sơ người chơi,
// tủ cúp, cảnh báo. Hàm thuần (không đụng giao diện, không đụng bộ nhớ máy):
// app tự lưu đối tượng `kho` vào bộ nhớ máy.
// =====================================================================
import { LUAT, KHU, giaTriTiem, soCuaHang } from './engine.js';

// ---------------- Bài học (30 thẻ) ----------------
// cheDo: 'nm' = có thể gặp ở Nhập môn (và Doanh nhân); 'dn' = chỉ Doanh nhân
// cauDo: [câu hỏi, [3 lựa chọn], chỉ số đáp án đúng, giải thích]
export const BAI_HOC = {
  boBanh:    { cheDo: 'nm', icon: '🗑️', noiDung: 'Làm nhiều không phải là bán nhiều. Bánh thừa bị bỏ là tiền rơi vào thùng rác.',
    cauDo: ['Làm 30 bánh nhưng chỉ bán được 20. 10 cái còn lại hết hạn thì sao?', ['Vẫn lãi như bán hết', 'Mất tiền nguyên liệu và công của 10 cái', 'Ngày mai bánh tự mới lại'], 1, 'Bánh thừa hết hạn là mất trắng tiền nguyên liệu và công làm.'] },
  hetBanh:   { cheDo: 'nm', icon: '🏃', noiDung: 'Khách không chờ ai cả. Hết hàng là tặng khách cho tiệm bên cạnh.',
    cauDo: ['Tiệm hết bánh lúc khách còn đông. Khách sẽ…', ['Đứng chờ tới mai', 'Sang tiệm khác mua', 'Tự làm bánh'], 1, 'Hết hàng thì khách đi tiệm khác, mình mất cả lãi lẫn uy tín.'] },
  giaCao:    { cheDo: 'nm', icon: '💸', noiDung: 'Bán đắt thì lời mỗi cái, nhưng ít người mua. Lãi = (giá bán − tiền vốn) × số bánh bán được.',
    cauDo: ['Công thức tính lãi đúng là?', ['Giá bán × số bánh làm', '(Giá bán − tiền vốn) × số bánh bán được', 'Giá bán − tiền thuê nhà'], 1, 'Chỉ bánh BÁN ĐƯỢC mới mang lãi về, và phải trừ tiền vốn.'] },
  giaRe:     { cheDo: 'nm', icon: '🏷️', noiDung: 'Bán rẻ thì đông khách, nhưng làm mệt mà chẳng lời bao nhiêu.',
    cauDo: ['Bán bánh rẻ hơn tiền vốn thì càng bán nhiều càng…', ['Giàu', 'Lỗ', 'Nổi tiếng mãi mãi'], 1, 'Giá thấp hơn vốn thì mỗi cái bán ra là một lần lỗ.'] },
  vayLanDau: { cheDo: 'nm', icon: '🏦', noiDung: 'Vay là mượn tiền của tương lai. Nhớ trả cả gốc lẫn lãi nhé!',
    cauDo: ['Vay 100 xu, lãi 1% mỗi ngày, sau 10 ngày nợ khoảng…', ['100 xu', '110 xu', '50 xu'], 1, 'Mỗi ngày nợ thêm khoảng 1 xu, 10 ngày thành khoảng 110 xu.'] },
  noCuoiMua: { cheDo: 'nm', icon: '⛓️', noiDung: 'Nợ để lâu thành gánh nặng. Hết mùa còn nợ bị tính gấp đôi!',
    cauDo: ['Vì sao nên trả nợ khi có dư tiền?', ['Để bớt tiền lãi mỗi ngày', 'Để ngân hàng buồn', 'Không cần trả'], 0, 'Trả bớt nợ là bớt tiền lãi phải đóng mỗi ngày.'] },
  muaCongThuc: { cheDo: 'dn', icon: '📜', noiDung: 'Mua công thức là dùng tiền để mua thời gian.',
    cauDo: ['Mua công thức đắt hơn tự nghiên cứu, vậy lợi ở đâu?', ['Bán được món mới sớm hơn', 'Bánh tự rẻ đi', 'Không có lợi gì'], 0, 'Có món mới sớm hơn vài ngày là có thêm vài ngày bán hàng.'] },
  thoCa:     { cheDo: 'dn', icon: '🎖️', noiDung: 'Thợ giỏi lương cao, nhưng bánh ngon giữ được khách lâu dài.',
    cauDo: ['Thợ cả lương cao hơn. Thuê thợ cả có lợi khi…', ['Bánh ngon giúp khách quay lại nhiều', 'Tiệm không có khách', 'Muốn tốn tiền cho vui'], 0, 'Chi phí cao đáng giá khi nó mang lại khách quen.'] },
  thoLenTay: { cheDo: 'nm', icon: '💪', noiDung: 'Ai cũng bắt đầu từ người mới. Kiên trì vài ngày là lên tay nghề.',
    cauDo: ['Thợ mới làm chậm. Sau vài ngày làm việc thì…', ['Giỏi lên, làm nhanh hơn', 'Chậm mãi', 'Nghỉ việc'], 0, 'Kinh nghiệm giúp người thợ làm nhanh và đẹp hơn.'] },
  nguyenLieuHong: { cheDo: 'nm', icon: '🥀', noiDung: 'Trứng, sữa, trái cây không chờ ai. Mua vừa đủ dùng thôi!',
    cauDo: ['Nguyên liệu nào mau hỏng nhất?', ['Đường', 'Sữa và trái cây', 'Bột mì'], 1, 'Đồ tươi như sữa, trứng, trái cây phải dùng nhanh.'] },
  matThap:   { cheDo: 'dn', icon: '👀', noiDung: 'Khách "ăn bằng mắt" trước tiên. Bánh đẹp, tủ kính sáng mời gọi khách bước vào.',
    cauDo: ['Khách đi ngang tiệm, điều đầu tiên khách cảm nhận là gì?', ['Vị bánh', 'Bánh và tiệm trông có đẹp không', 'Giá bột mì'], 1, 'Khách thấy bằng mắt trước khi được nếm.'] },
  taiThap:   { cheDo: 'dn', icon: '👂', noiDung: 'Một lời chào ấm áp giá 0 xu nhưng giữ khách cả năm.',
    cauDo: ['Nhân viên lễ phép, chào khách vui vẻ giúp tiệm…', ['Mất tiền', 'Khách thấy dễ chịu và muốn quay lại', 'Bánh nặng hơn'], 1, 'Lời nói dễ nghe là món quà miễn phí cho khách.'] },
  muiThom:   { cheDo: 'dn', icon: '👃', noiDung: 'Mùi bánh nướng thơm phức là "quảng cáo miễn phí" bay ra cả phố.',
    cauDo: ['Vì sao nhiều tiệm nướng bánh ngay ở quầy?', ['Cho mùi thơm kéo khách', 'Vì không có bếp', 'Để nóng tiệm'], 0, 'Mùi thơm khiến người đi đường thèm và ghé vào.'] },
  khongGianBan: { cheDo: 'dn', icon: '🧹', noiDung: 'Bánh ngon mấy mà tiệm bẩn thì khách cũng ngại bước vào.',
    cauDo: ['Tiệm có bánh ngon nhưng bàn bẩn, nóng bức. Khách sẽ…', ['Rất thích', 'Ngại vào, có khi bỏ đi', 'Tự dọn giúp'], 1, 'Không gian sạch, thoáng là điều kiện để khách ở lại.'] },
  miengThap: { cheDo: 'dn', icon: '👅', noiDung: 'Tiệm đẹp kéo khách lần đầu; bánh ngon mới kéo khách lần sau.',
    cauDo: ['Tiệm đẹp, thơm nhưng bánh dở. Điều gì xảy ra?', ['Khách đông mãi', 'Khách thử 1 lần rồi không quay lại', 'Khách tự mang bánh tới'], 1, 'Chất lượng bánh quyết định khách có quay lại hay không.'] },
  gioVangLienTuc: { cheDo: 'dn', icon: '🌇', noiDung: 'Giảm giá mãi thì khách chỉ chờ giảm giá mới mua.',
    cauDo: ['Ngày nào cũng giảm giá cuối ngày thì khách sẽ…', ['Mua sớm giá gốc', 'Chờ tới cuối ngày mới mua', 'Không bao giờ tới'], 1, 'Khách học rất nhanh: cứ chờ là có giá rẻ.'] },
  marketingSai: { cheDo: 'dn', icon: '📣', noiDung: 'Phát tờ rơi bánh kem cho học sinh đang vội đi học là phí tiền.',
    cauDo: ['Quảng cáo hiệu quả nhất khi…', ['Nói với đúng người cần món đó', 'Nói thật to', 'Phát cho tất cả mọi người'], 0, 'Đúng người, đúng chỗ thì mới có khách.'] },
  marketingDung: { cheDo: 'dn', icon: '🎯', noiDung: 'Nói đúng điều khách cần, ở đúng chỗ khách đứng.',
    cauDo: ['Khu văn phòng buổi sáng nên quảng cáo món gì?', ['Bánh kem 3 tầng', 'Bánh mì, bánh bao ăn sáng nhanh', 'Bánh Tết'], 1, 'Dân văn phòng cần bữa sáng nhanh gọn.'] },
  anThuNgon: { cheDo: 'dn', icon: '🍰', noiDung: 'Cho khách nếm thử là cách bán hàng tự tin nhất, khi bánh thật ngon.',
    cauDo: ['Mời ăn thử có lợi nhất khi…', ['Bánh thật ngon', 'Bánh sắp hỏng', 'Không ai đi qua'], 0, 'Nếm thấy ngon thì khách sẽ mua.'] },
  anThuDo:   { cheDo: 'dn', icon: '😅', noiDung: 'Mời thử bánh dở là tự quảng cáo… cái dở của mình.',
    cauDo: ['Bánh chưa ngon có nên mời khách ăn thử không?', ['Nên, càng nhiều càng tốt', 'Nên làm bánh ngon lên trước', 'Mời bánh hỏng cho đỡ phí'], 1, 'Sửa chất lượng trước, mời thử sau.'] },
  khuDongDoiThu: { cheDo: 'dn', icon: '🏪', noiDung: 'Chỗ đông người bán thì phải chia khách. Hãy tìm chỗ khách cần mà ít ai bán.',
    cauDo: ['Khu có 3 tiệm bánh, khu bên cạnh chưa có tiệm nào. Mở tiệm ở đâu dễ bán hơn?', ['Khu có 3 tiệm', 'Khu chưa có tiệm (nếu có khách)', 'Ở nhà'], 1, 'Ít đối thủ thì mỗi tiệm được nhiều khách hơn.'] },
  khaoSat:   { cheDo: 'dn', icon: '📊', noiDung: 'Hỏi khách trước khi làm rẻ hơn làm xong mới biết không ai mua.',
    cauDo: ['Trước khi bán món mới, nên làm gì?', ['Làm thật nhiều rồi tính', 'Tìm hiểu khách quanh đây thích gì', 'Đoán bừa'], 1, 'Hiểu khách giúp tránh làm bánh không ai mua.'] },
  banSaiMon: { cheDo: 'dn', icon: '🎒', noiDung: 'Học sinh ít tiền thì khó mua macaron đắt. Bán đúng món cho đúng người.',
    cauDo: ['Cổng trường nên bán món nào?', ['Món rẻ, vui mắt như pizza mini, flan', 'Bánh cưới 5 tầng', 'Hộp quà Tết đắt tiền'], 0, 'Học sinh thích món rẻ, đẹp, ăn nhanh.'] },
  moRong:    { cheDo: 'nm', icon: '🏬', noiDung: 'Mở rộng khi tiệm đầu tiên đã có lãi đều đặn, không phải khi đang lỗ.',
    cauDo: ['Lúc nào nên mở thêm cửa hàng?', ['Khi tiệm đầu đang lỗ', 'Khi tiệm đầu lãi đều và có vốn', 'Càng sớm càng tốt dù không có tiền'], 1, 'Mở thêm là thêm tiền thuê, thêm việc. Phải vững trước đã.'] },
  vayNong:   { cheDo: 'dn', icon: '⚡', noiDung: 'Tiền đến nhanh thì lãi cũng chạy nhanh!',
    cauDo: ['Vay nóng lãi 3%/ngày so với vay ngân hàng 1%/ngày thì…', ['Rẻ hơn', 'Đắt gấp 3', 'Bằng nhau'], 1, 'Vay nóng tiện nhưng rất đắt, chỉ dùng khi thật cần.'] },
  theChap:   { cheDo: 'dn', icon: '🏠', noiDung: 'Vay thế chấp lãi rẻ, nhưng không trả đúng hạn thì mất luôn tài sản.',
    cauDo: ['Thế chấp lò để vay tiền, rồi không trả được thì…', ['Được xoá nợ', 'Mất cái lò', 'Lò tự nhân đôi'], 1, 'Tài sản thế chấp sẽ bị thu khi không trả nợ.'] },
  matTheChap: { cheDo: 'dn', icon: '💔', noiDung: 'Đừng đặt cược cả "ngôi nhà" vào một khoản vay.',
    cauDo: ['Bài học khi mất tài sản thế chấp là gì?', ['Vay vừa sức trả', 'Vay càng nhiều càng tốt', 'Không bao giờ làm ăn'], 0, 'Chỉ vay số tiền mình chắc chắn trả được.'] },
  tietKiem:  { cheDo: 'dn', icon: '💰', noiDung: 'Tiền nằm im trong két không tự lớn lên. Gửi tiết kiệm thì có thêm chút lãi.',
    cauDo: ['Có tiền dư chưa dùng tới, cách an toàn để nó sinh thêm là?', ['Gửi tiết kiệm', 'Mua kẹo hết', 'Giấu dưới gối'], 0, 'Tiết kiệm lãi ít nhưng an toàn.'] },
  nguonNguyenLieu: { cheDo: 'dn', icon: '🥚', noiDung: 'Nắm được nguồn nguyên liệu giúp tiệm đỡ sốc khi chợ tăng giá.',
    cauDo: ['Góp vốn trại gà giúp tiệm bánh thế nào?', ['Mua trứng rẻ và ổn định hơn', 'Có gà nuôi chơi', 'Không giúp gì'], 0, 'Kiểm soát nguồn hàng giúp giá vốn ổn định.'] },
  canhBaoDo: { cheDo: 'nm', icon: '🚨', noiDung: 'Thua lỗ không đáng sợ. Đáng sợ là không biết vì sao mình lỗ. Xem lại báo cáo tối nhé!',
    cauDo: ['Tiệm lỗ nhiều ngày liền, việc đầu tiên nên làm là?', ['Xem báo cáo để tìm lý do lỗ', 'Vay thật nhiều để bù', 'Bỏ ván chơi lại'], 0, 'Tìm đúng nguyên nhân thì mới sửa đúng chỗ.'] },
};

// ---------------- Phát hiện bài học sau một ngày ----------------
// stTruoc: state trước khi kết thúc ngày; stSau: sau ketThucNgay; id: tiệm; daGap: mảng id bài học đã gặp (hồ sơ)
// canhBao: kết quả canhBaoTiem (tuỳ chọn). Trả về id bài học (tối đa 1/ngày) hoặc null.
export function baiHocHomNay(stTruoc, stSau, id, { daGap = [], daGapTrongMua = [], canhBao = null, cheDo = 'nm' } = {}) {
  const r = stSau.baoCao[stSau.baoCao.length - 1]?.nguoi?.[id];
  const p0 = stTruoc.nguoi[id], p1 = stSau.nguoi[id];
  if (!r || !p1) return null;
  const ung = [];
  if (canhBao?.muc === 'do') ung.push('canhBaoDo');
  if (r.matTheChap) ung.push('matTheChap');
  if (r.gioVangThoiQuen) ung.push('gioVangLienTuc');
  if (r.anThu === 'do') ung.push('anThuDo');
  if (p1.no > p0.no) ung.push('vayLanDau');
  if (r.bo > 0) ung.push('boBanh');
  if (r.thieuKhach >= 3) ung.push('hetBanh');
  if (r.boNL > 0) ung.push('nguyenLieuHong');
  if (r.giaTB > 120) ung.push('giaCao');
  else if (r.giaTB < 85 && Object.keys(r.ban).length) ung.push('giaRe');
  if (p1.chiNhanh > p0.chiNhanh) ung.push('moRong');
  if (p1.tho.some((t) => t.ngay === LUAT.ngayThao) || r.lenCap) ung.push('thoLenTay');
  if (r.viec?.muaCongThuc) ung.push('muaCongThuc');
  if (r.viec?.thueThoCa) ung.push('thoCa');
  if (r.viec?.vayNong) ung.push('vayNong');
  if (r.viec?.theChap) ung.push('theChap');
  if (r.viec?.chienDich && r.khu) ung.push((KHU[r.khu].tyLe[r.viec.chienDich] || 0) >= 40 ? 'marketingDung' : 'marketingSai');
  if (r.anThu === 'ngon') ung.push('anThuNgon');
  if (r.viec?.moCuaHang) ung.push('moRong');
  if (r.viec?.guiTK) ung.push('tietKiem');
  if (r.viec?.traiGa) ung.push('nguonNguyenLieu');
  const tn = r.traiNghiem, soBan = Object.values(r.ban || {}).reduce((x, y) => x + y, 0);
  if (tn) {
    if (soBan > 0 && tn.mieng <= 20) ung.push('miengThap');
    if (tn.kg <= 10) ung.push('khongGianBan');
    if (tn.mat <= 10) ung.push('matThap');
    if (tn.tai <= 10) ung.push('taiThap');
    if (soBan > 0 && tn.mui >= 40) ung.push('muiThom');
  }
  if (r.saiMon) ung.push('banSaiMon');
  if (r.soTiemKhu >= 3) ung.push('khuDongDoiThu');
  if (r.viec?.khaoSat) ung.push('khaoSat');
  if (stSau.ketThuc && p1.no > 0) ung.push('noCuoiMua');
  const hopLe = ung.filter((k) => BAI_HOC[k] && (cheDo === 'dn' || BAI_HOC[k].cheDo === 'nm') && !daGapTrongMua.includes(k));
  return hopLe.find((k) => !daGap.includes(k)) ?? hopLe[0] ?? null;   // ưu tiên bài chưa từng gặp
}

// ---------------- Câu đố cuối mùa ----------------
function rngSo(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
// Chọn 3 câu: ưu tiên bài đã gặp trong mùa, thiếu thì lấy bài Nhập môn khác. Cùng seed = cùng câu.
export function taoCauDo(daGapTrongMua, seed, cheDo = 'nm', soCau = 3) {
  const r = rngSo(seed);
  const tron = (a) => { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
  const duoc = (k) => BAI_HOC[k] && (cheDo === 'dn' || BAI_HOC[k].cheDo === 'nm');
  const gap = tron([...new Set(daGapTrongMua)].filter(duoc));
  const them = tron(Object.keys(BAI_HOC).filter((k) => duoc(k) && !gap.includes(k)));
  return gap.concat(them).slice(0, soCau).map((k) => {
    const [hoi, chon, dung, giaiThich] = BAI_HOC[k].cauDo;
    return { baiHoc: k, hoi, chon, dung, giaiThich };
  });
}
export const chamCauDo = (ds, traLoi) => ds.reduce((s, c, i) => s + (traLoi[i] === c.dung ? 1 : 0), 0);

// ---------------- Cảnh báo ----------------
// chuoi: giá trị tiệm cuối mỗi ngày (mảng số, ngày gần nhất ở cuối), bắt đầu bằng giá trị đầu mùa.
export function soNgayLoLienTiep(chuoi) {
  let n = 0;
  for (let i = chuoi.length - 1; i > 0 && chuoi[i] < chuoi[i - 1]; i--) n++;
  return n;
}
// soKhoanVay: dùng cho Doanh nhân (Nhập môn chỉ có 1 khoản vay ngân hàng)
export function canhBaoTiem(st, id, chuoi, { soKhoanVay = 0 } = {}) {
  const p = st.nguoi[id];
  const ly = [];
  let muc = null;
  const nang = (m) => { if (m === 'do' || !muc) muc = m; };
  if (!p || p.pha) return { muc, ly };
  const lo = soNgayLoLienTiep(chuoi);
  const dau = chuoi[0] ?? LUAT.tienDau;
  const gt = giaTriTiem(st, p);
  if (lo >= 5) { nang('do'); ly.push(`Lỗ ${lo} ngày liền`); }
  else if (lo >= 3) { nang('vang'); ly.push(`Lỗ ${lo} ngày liền`); }
  if (gt * 2 < dau) { nang('do'); ly.push('Giá trị tiệm còn dưới một nửa lúc đầu mùa'); }
  const tongTS = gt + p.no;                       // tổng tài sản = giá trị + nợ
  if (p.no > 0 && tongTS > 0) {
    const tl = Math.floor((p.no * 100) / tongTS);
    if (tl > 90) { nang('do'); ly.push(`Nợ bằng ${tl}% tài sản`); }
    else if (tl > 60) { nang('vang'); ly.push(`Nợ bằng ${tl}% tài sản`); }
  } else if (p.no > 0) { nang('do'); ly.push('Nợ nhiều hơn cả tài sản'); }
  if (soKhoanVay >= 3) { nang('do'); ly.push(`Đang có ${soKhoanVay} khoản vay cùng lúc (vay chồng)`); }
  return { muc, ly };
}

// ---------------- Hồ sơ người chơi ----------------
export const CAP_NGUOI_CHOI = [
  { ma: 'tapSu', ten: 'Tập sự', icon: '🌱', tu: 0 },
  { ma: 'chuTiem', ten: 'Chủ tiệm', icon: '🧁', tu: 30 },
  { ma: 'doanhNhan', ten: 'Doanh nhân', icon: '💼', tu: 100 },
  { ma: 'ongTrum', ten: 'Ông trùm bánh ngọt', icon: '👑', tu: 250 },
];
export const capNguoiChoi = (diem) => CAP_NGUOI_CHOI.filter((c) => diem >= c.tu).pop();

export const CUP = {
  hang1: { ten: 'Vô địch mùa', icon: '🥇', diem: 10 },
  hang2: { ten: 'Á quân mùa', icon: '🥈', diem: 6 },
  hang3: { ten: 'Hạng ba mùa', icon: '🥉', diem: 3 },
  chuoi: { ten: 'Ông chủ chuỗi', icon: '🏪', diem: 5 },          // Doanh nhân
  sachNo: { ten: 'Sạch nợ', icon: '💸', diem: 3 },
  khongBoPhi: { ten: 'Không bỏ phí', icon: '♻️', diem: 3 },
  khachQuen: { ten: 'Khách quen số 1', icon: '❤️', diem: 5 },     // Doanh nhân
  dauTuKhon: { ten: 'Nhà đầu tư khôn', icon: '📈', diem: 4 },     // Doanh nhân
  vuotKho: { ten: 'Vượt khó', icon: '🔥', diem: 5 },
  hocGioi: { ten: 'Học giỏi', icon: '🎓', diem: 3 },
  kyLuc: { ten: 'Phá kỷ lục', icon: '🏆', diem: 2 },
};

export const khoRong = () => ({ phienBan: 1, soTiep: 1, hoSo: [] });
const timHoSo = (kho, hsId) => kho.hoSo.find((h) => h.id === hsId);
const copy = (o) => JSON.parse(JSON.stringify(o));

export function taoHoSo(kho0, ten, icon = '🙂') {
  const t = String(ten || '').trim().slice(0, 18);
  if (!t) throw new Error('Cần nhập tên người chơi');
  if (kho0.hoSo.some((h) => h.ten.toLowerCase() === t.toLowerCase())) throw new Error('Tên này đã có hồ sơ');
  if (kho0.hoSo.length >= 12) throw new Error('Tối đa 12 hồ sơ');
  const kho = copy(kho0);
  const hs = { id: `hs${kho.soTiep++}`, ten: t, icon, diem: 0, cup: [], kyLuc: { nm: null, dn: null }, baiHoc: [], boVan: [], thangNhapMon: false, moDoanhNhan: false };
  kho.hoSo.push(hs);
  return { kho, hoSo: hs };
}
export function suaHoSo(kho0, hsId, { ten, icon } = {}) {
  const kho = copy(kho0); const h = timHoSo(kho, hsId);
  if (!h) throw new Error('Không thấy hồ sơ');
  if (ten != null) {
    const t = String(ten).trim().slice(0, 18);
    if (!t) throw new Error('Cần nhập tên người chơi');
    if (kho.hoSo.some((x) => x.id !== hsId && x.ten.toLowerCase() === t.toLowerCase())) throw new Error('Tên này đã có hồ sơ');
    h.ten = t;
  }
  if (icon) h.icon = icon;
  return kho;
}
export function xoaHoSo(kho0, hsId) { const kho = copy(kho0); kho.hoSo = kho.hoSo.filter((h) => h.id !== hsId); return kho; }
// Người lớn mở khoá Doanh nhân bằng tay (app hỏi xác nhận trước)
export function moKhoaDoanhNhan(kho0, hsId) { const kho = copy(kho0); const h = timHoSo(kho, hsId); if (h) h.moDoanhNhan = true; return kho; }
export const duocChoiDoanhNhan = (h) => !!(h && (h.thangNhapMon || h.moDoanhNhan));

export function ghiBaiHoc(kho0, hsId, maBai) {
  const kho = copy(kho0); const h = timHoSo(kho, hsId);
  if (h && BAI_HOC[maBai] && !h.baiHoc.includes(maBai)) h.baiHoc.push(maBai);
  return kho;
}

// ---------------- Kiểm tra khi tạo ván ----------------
const BAY_NGAY = 7 * 24 * 3600 * 1000;
// dsHoSo: mảng hsId (hoặc null nếu tiệm do máy chơi) theo thứ tự tiệm
export function kiemTraTaoVan(kho, dsHoSo, now = Date.now(), cheDo = 'nm') {
  const canhBao = [];
  let khongTinhCup = false;
  const dem = {};
  for (const id of dsHoSo) if (id) dem[id] = (dem[id] || 0) + 1;
  for (const [id, n] of Object.entries(dem)) if (n >= 2) {
    khongTinhCup = true;
    canhBao.push({ loai: 'nhieuTiem', hoSo: id, noiDung: `${timHoSo(kho, id)?.ten || 'Một người'} đang giữ ${n} tiệm. Ván này vẫn chơi được nhưng không tính cúp.` });
  }
  for (const id of Object.keys(dem)) {
    const h = timHoSo(kho, id); if (!h) continue;
    const gan = h.boVan.filter((t) => now - t <= BAY_NGAY).length;
    if (gan >= 2) canhBao.push({ loai: 'boVan', hoSo: id, noiDung: `${h.ten} đã bỏ ${gan} ván đang thua trong 7 ngày. Thử chơi tới cùng để biết vì sao lỗ nhé!` });
    if (cheDo === 'dn' && !duocChoiDoanhNhan(h)) canhBao.push({ loai: 'chuaMoDN', hoSo: id, chan: true, noiDung: `${h.ten} cần thắng 1 mùa Nhập môn (hoặc người lớn mở khoá) để chơi Doanh nhân.` });
  }
  return { canhBao, khongTinhCup, chan: canhBao.some((c) => c.chan) };
}
// Gọi khi người chơi bỏ ván đang dở. Chỉ ghi với hồ sơ đang xếp chót (trong số tiệm còn chơi).
export function ghiBoVan(kho0, st, ganHoSo, now = Date.now()) {
  if (!st || st.ketThuc) return kho0;
  const kho = copy(kho0);
  const xh = st.nguoi.filter((p) => !p.pha).map((p) => ({ id: p.id, gt: giaTriTiem(st, p) })).sort((a, b) => a.gt - b.gt);
  const chot = st.nguoi.filter((p) => p.pha).map((p) => p.id);
  if (xh.length > 1) chot.push(xh[0].id);
  for (const id of chot) { const h = timHoSo(kho, ganHoSo[id]); if (h) { h.boVan.push(now); h.boVan = h.boVan.filter((t) => now - t <= BAY_NGAY * 4); } }
  return kho;
}

// ---------------- Trao cúp cuối mùa ----------------
// ganHoSo: { idTiệm: hsId | null }; chuoiTaiSan: { idTiệm: [giá trị mỗi ngày] }; daDo: { idTiệm: true nếu từng bị cảnh báo đỏ }
// cauDoDung: { idTiệm: số câu đúng } ; thongTinDN: { idTiệm: { soCuaHang, diemTraiNghiemTB5Ngay, laiDauTu } } (Doanh nhân)
export function maxChuoiKhongBo(st, id) {
  let best = 0, cur = 0;
  for (const bc of st.baoCao) {
    const r = bc.nguoi[id]; if (!r) { cur = 0; continue; }
    if (r.bo === 0 && Object.keys(r.ban).length) { cur++; best = Math.max(best, cur); } else cur = 0;
  }
  return best;
}
export function traoCupCuoiMua(kho0, st, { ganHoSo = {}, cheDo = 'nm', now = Date.now(), khongTinhCup = false, daDo = {}, cauDoDung = {}, thongTinDN = {} } = {}) {
  if (!st.ketThuc) throw new Error('Mùa chưa kết thúc');
  const kho = copy(kho0);
  const ketQua = {};
  if (khongTinhCup) return { kho, ketQua };
  const xh = st.xepHang || [];
  const nguoiThat = Object.values(ganHoSo).filter(Boolean).length;
  for (const p of st.nguoi) {
    const h = timHoSo(kho, ganHoSo[p.id]); if (!h) continue;
    const ma = [];
    const hang = xh.findIndex((x) => x.id === p.id);
    const giaTri = xh[hang]?.giaTri ?? giaTriTiem(st, p, true);
    // hạng chỉ tính khi có đối thủ (người hoặc máy) và tiệm chưa phá sản
    if (!p.pha && st.nguoi.length >= 2 && hang >= 0 && hang <= 2) ma.push(['hang1', 'hang2', 'hang3'][hang]);
    if (!p.pha && p.no === 0) ma.push('sachNo');
    if (maxChuoiKhongBo(st, p.id) >= 5) ma.push('khongBoPhi');
    if (daDo[p.id] && !p.pha && hang >= 0 && hang <= 1) ma.push('vuotKho');
    if ((cauDoDung[p.id] || 0) >= 3) ma.push('hocGioi');
    if (cheDo === 'dn') {
      const dn = thongTinDN[p.id] || {};
      if ((dn.soCuaHang || 0) >= 3) ma.push('chuoi');
      if ((dn.diemTraiNghiemTB5Ngay || 0) >= 45) ma.push('khachQuen');   // thang 0–50 (= 0–5 sao × 10)
      if ((dn.laiDauTu || 0) > 0) ma.push('dauTuKhon');
    }
    const kl = h.kyLuc[cheDo];
    if (!p.pha && (kl == null || giaTri > kl)) { if (kl != null) ma.push('kyLuc'); h.kyLuc[cheDo] = giaTri; }
    for (const m of ma) { h.cup.push({ ma: m, ngay: now, mua: st.mua, cheDo }); h.diem += CUP[m].diem; }
    if (cheDo === 'nm' && hang === 0 && !p.pha && st.nguoi.length >= 2) h.thangNhapMon = true;
    ketQua[p.id] = { cup: ma, diem: h.diem, cap: capNguoiChoi(h.diem), nguoiThat };
  }
  return { kho, ketQua };
}

// ---------------- Phiếu trải nghiệm khách (Doanh nhân) ----------------
// Câu "khách nói" cho điểm chạm yếu nhất (và khen điểm mạnh nhất). Giọng vui, dễ hiểu.
export const KHACH_NOI = {
  mat:   { yeu: ['Bánh để lộn xộn, nhìn không muốn mua 😕', 'Tủ bánh tối quá, chẳng thấy bánh đâu!'], manh: 'Bánh đẹp như tranh, muốn chụp ảnh ngay 📸' },
  tai:   { yeu: ['Vào tiệm chẳng ai chào cả 😶', 'Hỏi giá mà nhân viên trả lời cộc lốc…'], manh: 'Chị bán hàng chào ngọt lắm, lần sau ghé tiếp! 😊' },
  mui:   { yeu: ['Tiệm bánh mà chẳng thơm mùi bánh gì cả', 'Bánh có vẻ để từ hôm qua…'], manh: 'Đi ngang qua đã ngửi thấy mùi bơ thơm phức 🤤' },
  kg:    { yeu: ['Bàn hơi bẩn, tiệm nóng quá 🥵', 'Không có chỗ ngồi, phải đứng ăn'], manh: 'Tiệm sạch sẽ, mát mẻ, ngồi thích ghê 🌿' },
  mieng: { yeu: ['Bánh đẹp mà ăn hơi dở…', 'Bánh khô, lần sau chắc không mua nữa'], manh: 'Bánh ngon tuyệt, mai mua tiếp! 😋' },
};
export function phieuTraiNghiem(tn, seed = 0) {
  if (!tn) return null;
  const ds = Object.entries(tn).sort((a, b) => (a[1] - b[1]) || a[0].localeCompare(b[0]));
  const yeu = ds[0][0], manh = ds[ds.length - 1][0];
  const sao = Object.fromEntries(ds.map(([k, v]) => [k, Math.round(v / 10)]));
  const noi = [];
  if (tn[manh] >= 30) noi.push(KHACH_NOI[manh].manh);
  if (tn[yeu] <= 20) noi.push(KHACH_NOI[yeu].yeu[Math.abs(seed) % 2]);
  const tb = Math.round(Object.values(tn).reduce((a, b) => a + b, 0) / ds.length);
  return { sao, yeu, manh, noi, tb };
}

// ---------------- Số liệu trao cúp Doanh nhân ----------------
// Điểm trải nghiệm TB 5 ngày cuối (thang 0–50), số cửa hàng, lãi từ đầu tư khác
export function thongTinDN(st) {
  const kq = {};
  for (const p of st.nguoi) {
    const bc = st.baoCao.slice(-5).map((b) => b.nguoi[p.id]?.traiNghiem).filter(Boolean);
    const tb = bc.length ? Math.floor(bc.reduce((a, t) => a + Object.values(t).reduce((x, y) => x + y, 0) / 5, 0) / bc.length) : 0;
    kq[p.id] = { soCuaHang: soCuaHang(p), diemTraiNghiemTB5Ngay: tb, laiDauTu: p.laiDauTu || 0 };
  }
  return kq;
}