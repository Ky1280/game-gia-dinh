# ĐẾ CHẾ TIỆM BÁNH — Thiết kế game v0.2

Game chiến thuật kinh doanh cho gia đình. 2–4 người thay phiên trên 1 máy (điện thoại / máy tính bảng), từ 10 tuổi.
Chạy không cần mạng, cài lên màn hình chính, có lưu ván. Một mùa chơi khoảng 30–45 phút.

---

## 1. Ý tưởng chính

Mỗi người chơi là chủ một tiệm bánh trên cùng một con phố. Mỗi lượt là **1 ngày**. Ngày nào cũng phải:
mua nguyên liệu → quyết định làm bánh gì, bao nhiêu → đặt giá → chờ khách tới.
Khách **chia nhau** giữa các tiệm, nên quyết định của người này ảnh hưởng tới người kia.

Kết thúc mùa, ai có **Giá trị tiệm** cao nhất thì thắng:

> **Giá trị tiệm = Tiền mặt + Giá trị lò/máy + Giá trị chi nhánh − Nợ vay**

Tiền trong game gọi là **xu**, không dùng tiền thật.

---

## 2. Một ngày chơi

| Bước | Ai làm | Nội dung |
|---|---|---|
| ① Buổi sáng | Cả nhà xem chung | Giá nguyên liệu hôm nay (lên xuống), **thẻ sự kiện** của ngày, dự báo thời tiết |
| ② Lập kế hoạch | Từng người, **chuyền máy** | Màn "Đưa máy cho Bố" che kế hoạch người trước. Mỗi người: mua nguyên liệu, chọn làm bánh, đặt giá, nhân sự, quảng cáo, vay/trả nợ |
| ③ Mở cửa bán | Máy tự tính | Khách chia giữa các tiệm theo **sức hút** của từng tiệm |
| ④ Báo cáo tối | Cả nhà xem chung | Doanh thu, chi phí, lãi/lỗ, bánh thừa bị bỏ, khách đánh giá sao, bảng xếp hạng |

Mọi người lập kế hoạch **trước**, máy tính **sau**, nên không ai nhìn trộm được quyết định của người khác trong cùng ngày.

---

## 3. Bánh và nguyên liệu

### 3.1 Nguyên liệu (giá dao động mỗi ngày ±15%, có sự kiện đẩy giá)

| Nguyên liệu | Giá gốc (xu) | Hạn dùng |
|---|---|---|
| Bột mì | 2 | 10 ngày |
| Đường | 1 | 15 ngày |
| Trứng | 2 | 5 ngày |
| Bơ | 4 | 7 ngày |
| Sữa/kem | 3 | 3 ngày |
| Trái cây | 4 | 2 ngày |
| Hạt/socola | 5 | 15 ngày |

Nguyên liệu quá hạn **tự bỏ** → mua nhiều để được rẻ có thể bị phí.

### 3.2 Bánh (công thức = số phần nguyên liệu)

| Bánh | Công thức | Giá gợi ý | Công làm | Để được | Mở khoá |
|---|---|---|---|---|---|
| Bánh mì | 2 bột + 1 trứng | 12 | 1 | 1 ngày | Có sẵn |
| Cookies | 1 bột + 1 đường + 1 bơ + 1 hạt | 24 | 1 | 5 ngày | Có sẵn |
| Bông lan | 1 bột + 2 trứng + 1 đường + 1 sữa | 22 | 2 | 2 ngày | Có sẵn |
| Su kem | 1 bột + 2 trứng + 2 sữa | 26 | 2 | 1 ngày | Nghiên cứu 150 xu |
| Tart trái cây | 1 bột + 1 bơ + 2 trái cây | 32 | 3 | 1 ngày | Nghiên cứu 200 xu |
| Bánh kem | 2 bột + 3 trứng + 2 sữa + 1 trái cây + 1 đường | 55 | 5 | 2 ngày | Nghiên cứu 300 xu |
| Bánh mùa vụ | Trung thu 40 · khúc cây Noel 38 · quy Tết 30 | — | 2–3 | 3–10 ngày | Chỉ trong mùa đó |

**Công làm:** mỗi thợ có 8 công/ngày. Lò quyết định tối đa bao nhiêu bánh nướng được 1 ngày.

---

## 4. Khách hàng: phần "kinh tế thật"

**Nhu cầu cả phố mỗi loại bánh** = nhu cầu gốc × hệ số mùa × hệ số sự kiện × hệ số thời tiết × (ngẫu nhiên 0,9–1,1).

**Sức hút của 1 tiệm với 1 loại bánh** phụ thuộc vào:
- **Giá:** đắt hơn giá gợi ý thì sức hút giảm nhanh, rẻ hơn thì tăng nhưng lãi mỏng (độ co giãn khác nhau theo bánh: bánh mì nhạy giá, bánh kem ít nhạy).
- **Uy tín (1–5 sao):** tăng khi đủ hàng, bánh tươi, giá hợp lý; giảm khi khách tới mà hết hàng hoặc giá "cắt cổ".
- **Quảng cáo:** chi xu để tăng sức hút trong 3 ngày, hiệu quả giảm dần nếu chi liên tục.
- **Vị trí:** chi nhánh mới mở thêm một khu khách riêng.

Khách chia theo tỷ lệ sức hút. Tiệm hết bánh thì khách dư **chuyển sang tiệm khác**, và tiệm hết bánh bị trừ uy tín.

**Bánh thừa:** còn hạn thì để bán hôm sau (giảm sức hút vì "bánh cũ"), quá hạn thì bỏ, tính là lỗ.

**Uy tín (đã chỉnh khi cân bằng):** được +6/ngày chỉ khi vừa đủ hàng (≥ 90% khách mua được) vừa giá hợp lý (giá bán trung bình ≤ 110% giá gợi ý).
Hơn nửa khách về tay không thì −10. Giá trung bình trên 120% thì −5, trên 140% thì −10.
**Khách chê giá:** khách tới tiệm đắt thì một phần bỏ về, kể cả khách chuyển từ tiệm hết hàng sang.

---

## 5. Quản lý: phần làm game "sâu"

| Hạng mục | Cách chơi |
|---|---|
| **Thợ** | Thuê (phí thuê 1 lần + lương/ngày), sa thải (đền 3 ngày lương). Thợ mới làm được 6 công, sau 5 ngày thành thạo lên 8 công |
| **Lò / máy** | Nâng cấp lò: tăng số mẻ/ngày. Máy đánh trứng: giảm công làm bánh kem/bông lan. Máy móc hao mòn, bán lại được 50% |
| **Nghiên cứu** | Bỏ xu + 2 ngày để mở khoá công thức mới |
| **Vay vốn** | Vay tối đa theo giá trị tiệm, lãi mỗi ngày. Hết mùa chưa trả thì bị trừ gấp đôi |
| **Chi nhánh** | Từ mùa 3: mở chi nhánh (vốn lớn), có khu khách riêng, cần thêm thợ |
| **Phá sản** | Tiền âm 2 ngày liền mà không vay thêm được → tiệm "tạm đóng", người chơi vẫn xem tiếp nhưng không xếp hạng mùa đó |

---

## 6. Thẻ sự kiện (khoảng 30 thẻ)

Ví dụ:
- **Mưa to:** khách giảm 30%, bánh giao tận nhà được thưởng uy tín.
- **Bơ khan hiếm:** giá bơ ×2 trong 3 ngày.
- **Lễ hội phố:** nhu cầu ×1,5 cả ngày.
- **Nhà phê bình ẩm thực:** tiệm có uy tín cao nhất được +1 sao.
- **Khách đặt tiệc:** cần 20 bánh kem trong 3 ngày; ai nhận thì phải giao đủ, thiếu bị phạt.
- **Máy hỏng:** 1 tiệm ngẫu nhiên giảm 1 mẻ hôm nay.

Thẻ có "may" có "rủi", được chia đều theo hạt giống ngẫu nhiên của ván, nên chơi lại cùng hạt giống thì ra cùng diễn biến (công bằng, dễ kiểm thử).

---

## 7. Các màn (mùa vụ)

| Mùa | Tên | Số ngày | Điểm mới / mục tiêu phụ |
|---|---|---|---|
| 1 | **Khai trương** | 15 | Màn hướng dẫn: chỉ 3 bánh cơ bản, có gợi ý từng bước. Mục tiêu: không lỗ 5 ngày liền |
| 2 | **Mùa mưa** | 20 | Thời tiết mạnh, nguyên liệu tươi hỏng nhanh. Mở nghiên cứu |
| 3 | **Trung thu** | 20 | Bánh mùa vụ, đơn đặt tiệc. Mở chi nhánh |
| 4 | **Giáng sinh** | 20 | Cạnh tranh quảng cáo, khách sang tiệm "đẹp" |
| 5 | **Tết** | 25 | Mọi tính năng, vay vốn lớn, giá biến động mạnh. Mùa quyết định "Đế chế" |

- Mỗi mùa có **huy hiệu thành tích** (ví dụ "Không bỏ bánh nào", "5 sao 10 ngày liền", "Trả hết nợ").
- Tiền và tài sản **không mang** sang mùa sau. Mỗi mùa bắt đầu bằng nhau cho công bằng. Bảng thành tích được giữ lại.
- **Lưu ván:** tự lưu sau mỗi ngày, hôm sau mở lại chơi tiếp.

---

## 8. Giao diện

- 3 màn chính:
  - **(1) Chuyền máy + Bảng tiệm**: tiền, uy tín, kho, sự kiện hôm nay.
  - **(2) Kế hoạch ngày**: các thẻ Mua · Làm bánh · Giá · Tiệm.
  - **(3) Báo cáo tối + Xếp hạng**.
- Phụ: Menu ván mới / tiếp tục, Hướng dẫn, Cài đặt (âm thanh, cỡ chữ).
- **3 giao diện đổi được bất cứ lúc nào** (chủ nhà chốt 24/11/2026). Nút đổi nằm ở Cài đặt → "Giao diện", có xem trước.
  App nhớ lựa chọn trên máy. Đổi giao diện không ảnh hưởng ván đang chơi.
  Mockup: `mockup/mockup_v0.2_3PA.html`.
  - **A · Tiệm bánh ấm áp** (mặc định): kem – nâu caramel – hồng dâu. Nền: mái hiên sọc, kệ gỗ bày bánh kem, bánh mì, croissant, quầy kính.
  - **B · Kẹo ngọt vui nhộn**: pastel hồng – bạc hà – vàng bơ. Nền: hoạ tiết donut rắc cốm, macaron, cupcake lặp lại. Nút nổi như kẹo.
  - **C · Lò bánh cổ điển**: socola – vàng đồng – trắng ngà. Nền: lò gạch đang cháy, bánh mì vừa ra lò, cán bột, bột mì rắc.
- **Hình nền vẽ bằng mã** (không dùng ảnh ngoài, không lo bản quyền), mỗi nền vài KB, chạy không cần mạng.
- **Mỗi mùa có dải hình riêng** đặt trên Bảng tiệm và menu, vẽ theo màu của giao diện đang chọn:
  Khai trương (ruy băng, bóng bay) · Mùa mưa (mây, ô) · Trung thu (trăng, đèn lồng, bánh nướng — đã có mẫu) · Giáng sinh · Tết.
- Chữ luôn đặt trên thẻ nền đặc/mờ để đọc rõ. Font hệ thống có đủ dấu tiếng Việt, không tải font từ mạng.
- Mỗi người chơi 1 màu riêng (đổi sắc theo giao diện). Nút to, dùng được cả điện thoại dọc và máy tính bảng ngang
  (máy ngang chia 2 cột).
- **Âm thanh nhẹ** do máy tự tạo (tiếng bấm, tiền vào, chuông thắng), có nút tắt. Không dùng nhạc có bản quyền.
- Không quảng cáo, không mua bán trong game, không thu thập thông tin, không cần mạng sau khi cài.

---

## 9. Kỹ thuật (tóm tắt)

- PWA tĩnh, đăng GitHub Pages trong kho công khai `game-gia-dinh` (mỗi game 1 đường link).
- **Bộ máy game tách riêng** (`engine.js`), không phụ thuộc giao diện, ngẫu nhiên theo hạt giống, mọi số là số nguyên.
  Có kiểm thử tự động: không âm kho, không quá công thợ, đúng lượt, khách chia đúng tổng, bánh quá hạn bị bỏ,
  vay/lãi đúng, điều kiện thắng/phá sản, cùng hạt giống ra cùng kết quả,
  và **mô phỏng 1.000 ván bằng "người chơi máy"** để kiểm tra cân bằng (không có chiến thuật nào thắng chắc).
- Lưu ván trong bộ nhớ máy. Có nút xuất/nhập file ván để chuyển sang máy khác.

---

## 10. Quyết định của chủ nhà (24/11/2026)

1. **Tên tiệm:** mỗi ván người chơi tự đặt tên tiệm và chọn biểu tượng. App nhớ tên dùng lần trước.
2. **Có chế độ 1 người chơi với "đối thủ máy"** (1–3 đối thủ). Dùng chung "người chơi máy" của phần kiểm tra cân bằng.
   Có 3 mức: Dễ / Vừa / Khó.
3. **Mở màn lần lượt:** phải chơi xong mùa trước mới mở mùa sau.
4. Đã chốt trước đó: ván 30–45 phút có lưu ván; âm thanh nhẹ, tắt được; kinh tế mức "sâu"
   (vay vốn, hạn dùng, quảng cáo, đánh giá khách).


---

## 11. Kết quả bước 2: bộ máy game + cân bằng (24/11/2026)

- Mã: `docs/engine.js` (luật chơi), `docs/doiThu.js` (đối thủ máy Dễ/Vừa/Khó).
  Kiểm thử: `tests/engine.test.js` (27 ca). Mô phỏng: `tools/mophong.js` (chạy `npm run mophong`).
- **Mô phỏng 1.000 ván đạt cả 5 tiêu chí:**
  - Khó thắng 79%, Vừa 20%, Dễ 0,3%. Hạng TB: Khó 1,21 · Vừa 1,81 · Dễ 2,98.
  - Không chiến thuật lệch nào thắng chắc (mỗi biến thể đấu 2 máy Vừa, công bằng là 33%):
    giá rẻ 70% thắng 0% · giá cao 120% thắng 1% · giá cao 140% thắng 0% · làm nhiều 150% thắng 30% ·
    không thuê thợ thắng 37% · không đầu tư thắng 10%.
  - Máy Vừa có lãi mọi mùa, 0% phá sản, uy tín cuối mùa TB khoảng 3 sao.
- **Các chỉnh sửa khi cân bằng:** khách mỗi tiệm giảm cho khớp sức 3 thợ; khách nhạy giá hơn (để giá gợi ý ≈ giá có lợi nhất);
  sửa vòng lặp uy tín "giá cao → luôn đủ hàng"; máy Khó bỏ thói quen cho thợ nghỉ và quảng cáo tràn lan.

## 12. Kết quả bước 3: giao diện chơi thật (24/11/2026)

- Tệp trong `docs/`: `index.html`, `styles.css` (3 giao diện A/B/C), `nen.js` (hình nền + dải hình 5 mùa vẽ bằng mã),
  `app.js` (các màn), `amThanh.js` (âm thanh tự tạo), `sw.js` + `manifest.webmanifest` + `icons/` (cài lên máy, chạy không cần mạng).
- Màn: Menu → Ván mới (chọn mùa đã mở, 2–4 tiệm, tên/biểu tượng, Người hoặc Máy Dễ/Vừa/Khó) → Buổi sáng (cả nhà xem)
  → Chuyền máy → Bảng tiệm → Kế hoạch 4 thẻ Mua/Làm/Giá/Tiệm (nút "🤖 Gợi ý", "🛒 Tự mua phần còn thiếu") → Báo cáo tối → Hết mùa (mở mùa sau).
- Lưu ván tự động sau mỗi lượt và mỗi ngày; Cài đặt: đổi giao diện, tắt âm, chữ lớn, bỏ ván.
- Đã thử trên khung điện thoại 375×812 và màn rộng (tự chia 2 cột): máy tự chơi hết 5 mùa qua giao diện, không lỗi, không tràn chữ.
