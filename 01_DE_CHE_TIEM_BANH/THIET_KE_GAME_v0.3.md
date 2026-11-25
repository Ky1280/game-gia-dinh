# ĐẾ CHẾ TIỆM BÁNH — Thiết kế nâng cấp v0.3 ("Học mà chơi, chơi mà học")

Bản này **bổ sung** cho `THIET_KE_GAME_v0.2.md` (giữ nguyên). Mọi luật cũ còn hiệu lực trừ chỗ ghi "thay".
Mã game sẽ là phiên bản v0.4. Mọi con số dưới đây là **đề xuất ban đầu**: sẽ được chỉnh ở bước cân bằng (mô phỏng 1.000 ván).

Nguyên tắc giữ nguyên: số nguyên, cùng hạt giống ra cùng diễn biến; không quảng cáo, không mua bán thật,
không thu thập thông tin; không dùng tên/thương hiệu có thật; chơi chung 1 máy; chạy không cần mạng; 3 giao diện A/B/C.

---

## 0. Quyết định của chủ nhà (25/11/2026)

| # | Nội dung | Chốt |
|---|---|---|
| 1 | Tổ chức độ khó | **2 chế độ:** Nhập môn và Doanh nhân |
| 2 | Số khu buôn bán | **4 khu:** Cổng trường · Văn phòng · Dân cư · Phố du lịch |
| 3 | Cảnh báo "lách luật" | Cả 3: bỏ ván thua chơi lại liên tục · vay chồng nhiều khoản · 1 người giữ nhiều tiệm trong 1 ván |
| 4 | Tủ cúp | Lưu theo **hồ sơ từng người chơi** trên máy, qua mọi ván |
| 5 | Thứ tự trải nghiệm khách | **Mắt → Tai → Mũi → (Không gian) → Miệng sau cùng** |

---

## 1. Hai chế độ chơi

| | **🌱 Nhập môn** | **💼 Doanh nhân** |
|---|---|---|
| Dành cho | Người mới, trẻ 10–12 tuổi | Người đã thắng ít nhất 1 mùa Nhập môn (hoặc người lớn) |
| Luật | Luật v0.2 hiện tại | Luật v0.2 + 8 nhóm tính năng mới (mục 2–9) |
| Bài học + câu đố | Có | Có (thêm bài học nâng cao) |
| Hồ sơ + tủ cúp | Có | Có (cúp riêng của Doanh nhân) |
| Phố | 1 phố chung | 4 khu |

- Màn "Ván mới" có công tắc chế độ. Doanh nhân bị khoá 🔒 cho tới khi **hồ sơ** đó thắng 1 mùa Nhập môn (người lớn có nút "Mở khoá", hỏi xác nhận).
- Ván đang lưu của bản cũ **vẫn chơi tiếp được** vì nó chính là luật Nhập môn.
- Các mùa vẫn mở lần lượt, theo từng chế độ.

---

## 2. Sản phẩm, công thức, thợ nhiều cấp (Doanh nhân)

### 2.1 Món mới (5 món)

| Món | Công thức | Công | Giá gợi ý | Hợp nhóm khách | Đặc điểm |
|---|---|---|---|---|---|
| 🥐 Croissant bơ | 1 bột, 2 bơ | 2 | 28 | Văn phòng, Du lịch | Mùi thơm mạnh (+Mũi) |
| 🥟 Bánh bao | 2 bột, 1 trứng, 1 sữa | 2 | 18 | Văn phòng, Học sinh | Bán trong ngày |
| 🍕 Pizza mini | 2 bột, 1 sữa, 1 trái cây | 2 | 22 | Học sinh | Học sinh rất thích |
| 🍮 Bánh flan | 2 trứng, 2 sữa, 1 đường | 1 | 14 | Gia đình, Học sinh | Rẻ, mau hỏng |
| 🌈 Macaron | 1 hạt, 2 đường, 1 trứng | 4 | 45 | Du lịch | **Cần thợ cả**; rất đẹp (+Mắt) |

### 2.2 Có công thức bằng 2 cách

| Cách | Giá | Thời gian | Bài học |
|---|---|---|---|
| 🔬 Tự nghiên cứu | 100% giá nghiên cứu | 2 ngày | Rẻ nhưng chậm |
| 📜 **Mua công thức** | 150% giá nghiên cứu | **Làm được ngay hôm sau** | "Dùng tiền để mua thời gian" |

Giá nghiên cứu các món mới: croissant 180, bánh bao 120, pizza mini 150, flan 100, macaron 350.

### 2.3 Thợ 3 cấp (thay luật "thợ mới 6 công → 8 công")

| Cấp | Phí thuê | Lương/ngày | Công/ngày | Điểm tay nghề | Ghi chú |
|---|---|---|---|---|---|
| 🧑‍🍳 Học việc | 20 | 15 | 5 | 1 | Làm đủ 6 ngày tự lên Lành nghề |
| 👩‍🍳 Lành nghề | 40 | 25 | 8 | 2 | Học khoá "Thợ cả": 150 xu, nghỉ 2 ngày |
| 🎖️ Thợ cả | 100 | 45 | 9 | 3 | Bắt buộc với macaron, bánh kem cao cấp |

- **Chất lượng bánh (điểm Miệng)** = điểm tay nghề trung bình của các thợ (theo công đóng góp), trừ điểm nếu dùng nguyên liệu sắp hết hạn.
- Cho nghỉ: đền 3 ngày lương theo cấp.
- 🧍 **Nhân viên quầy** (mới, 0–3 người, lương 15/ngày): không làm bánh, tăng điểm **Tai** và bán được thêm khách giờ cao điểm.
  Khoá "Lễ phép & thân thiện" 60 xu/người: +1 Tai.

---

## 3. Vốn: nhiều hình thức vay (Doanh nhân)

| Hình thức | Hạn mức | Lãi/ngày | Kỳ hạn | Rủi ro | Bài học |
|---|---|---|---|---|---|
| 🏦 Vay ngân hàng (đã có) | Theo giá trị tiệm | 1% | Hết mùa | Còn nợ cuối mùa bị trừ ×2 | Vay vừa sức |
| ⚡ Vay nóng | 300 xu | **3%** | 5 ngày | Lãi rất cao | "Tiền đến nhanh thì đi cũng nhanh" |
| 🏠 Vay thế chấp | 70% giá trị tài sản đem thế chấp | **0,5%** | 8 ngày, gia hạn 1 lần | Quá hạn không trả → **mất tài sản đó** | Lãi rẻ nhưng có thể mất nhà |
| 🤝 Gọi vốn góp (mùa 4–5) | 500–1.500 xu | Không lãi | Cả mùa | Cuối mùa chia **30% lợi nhuận** cho người góp | Chia lợi nhuận thay vì trả lãi |

- Tài sản thế chấp được: lò (đã nâng cấp), máy móc, **cửa hàng sở hữu**, xe giao hàng.
- Tài sản đang thế chấp không bán được, hiện biểu tượng 🔒.

---

## 4. Chiến thuật trong ngày (Doanh nhân)

| Chiến thuật | Cách chơi | Lợi | Hại | Bài học |
|---|---|---|---|---|
| 🌇 **Giờ vàng giảm giá cuối ngày** | Chọn giảm 20% / 40% / 50% cho bánh sắp hết hạn | Bán thêm cho khách săn giảm giá, ít bỏ phí | Ít lãi. Giảm giá **3 ngày liền** thì 15% khách quen **chờ tới giờ vàng** mới mua | "Đừng tập cho khách thói quen chờ giảm giá" |
| 📣 **Chiến dịch marketing** | 120 xu, kéo dài 3 ngày, **chọn nhóm khách mục tiêu** | +40% sức hút; nhắm đúng nhóm khách chính của khu thì **+80%** | Nhắm sai nhóm gần như phí tiền | "Quảng cáo phải đúng người" |
| 🍰 **Mời ăn thử miễn phí** | Mời 5 / 10 / 20 bánh | Ngày sau thêm khách mới, +uy tín | Mất bánh. **Chất lượng thấp thì ăn thử phản tác dụng** (−uy tín) | "Mời thử chỉ có lợi khi bánh thật ngon" |

---

## 5. Phố 4 khu và nhóm khách (Doanh nhân)

### 5.1 Nhóm khách (4 nhóm)

| Nhóm | Thích món | Nhạy giá | Coi trọng nhất |
|---|---|---|---|
| 🎒 Học sinh | Pizza mini, flan, cookies, bánh mì | Rất cao | **Mắt** (bánh đẹp, màu sắc) |
| 💼 Dân văn phòng | Bánh mì, bánh bao, croissant | Trung bình | **Tai** (phục vụ nhanh, chào hỏi) |
| 👨‍👩‍👧 Gia đình | Bánh kem, bông lan, flan | Trung bình | **Không gian** (sạch, thoáng, chỗ ngồi) |
| 📸 Khách du lịch | Macaron, tart, croissant | Thấp (chịu chi) | **Mắt + Mũi** (đẹp để chụp ảnh, thơm) |

### 5.2 Bốn khu

| Khu | Tỷ lệ khách (HS / VP / GĐ / DL) | Lượng khách | Thuê nhà/ngày | Giá mua mặt bằng |
|---|---|---|---|---|
| 🏫 Cổng trường | 60 / 10 / 25 / 5 | Nhiều | 25 | 900 |
| 🏢 Văn phòng | 10 / 60 / 15 / 15 | Nhiều buổi sáng | 35 | 1.200 |
| 🏘️ Dân cư | 20 / 15 / 60 / 5 | Vừa, ổn định | 30 | 1.000 |
| 🏖️ Phố du lịch | 10 / 15 / 20 / 55 | Ít nhưng chịu chi | 50 | 1.800 |

- Đầu ván mỗi người **chọn khu** đặt tiệm đầu tiên. Khách của khu chỉ chia cho các tiệm **trong khu đó**.
  Khu đông đối thủ thì phải chia khách; khu vắng đối thủ thì dễ bán nhưng có thể thuê cao hoặc ít khách.
- Mỗi món có "hệ số hợp khu" = tổng (tỷ lệ nhóm × mức thích của nhóm) → bán đúng món cho đúng khu thì đông khách.

### 5.3 Màn "📊 Phân tích thị trường"

- **Miễn phí:** tỷ lệ nhóm khách từng khu, số tiệm đang ở mỗi khu, thời tiết và sự kiện.
- **Khảo sát khách (30 xu):** món bán chạy nhất khu hôm qua, giá trung bình của đối thủ, nhóm khách nào đang "bỏ về tay không".
- Bài học: "Hỏi khách trước khi làm bánh: rẻ hơn làm xong mới biết không ai mua".

---

## 6. Trải nghiệm khách hàng: 5 điểm chạm (Doanh nhân)

Theo thứ tự CEO chốt: khách **ăn bằng mắt, bằng tai, bằng mũi**, cảm nhận **không gian**, và **bằng miệng sau cùng**.
Mỗi điểm chạm có thang 0–5 sao.

| Điểm chạm | Đầu tư / việc làm tăng điểm | Bị giảm khi |
|---|---|---|
| 👀 **Mắt**: hình ảnh bánh, trưng bày | Tủ kính 150 xu (+1) · Kệ trưng bày đẹp 250 xu (+1) · Bao bì đẹp +1 xu/bánh (+1) · Món đẹp (macaron, bánh kem) | Bánh cũ bày ra |
| 👂 **Tai**: lời chào, nhân viên thân thiện, lễ phép | Nhân viên quầy (+1/người, tối đa 2) · Khoá lễ phép 60 xu (+1) · Loa nhạc nhẹ 40 xu (+1) | Thiếu người đứng quầy ngày đông |
| 👃 **Mũi**: mùi thơm sản phẩm | Lò nướng ngay quầy 200 xu (+2) · Làm croissant, bánh mì tươi trong ngày (+1) | Bán bánh tồn nhiều ngày |
| 🌿 **Không gian**: thoáng mát, sạch đẹp | Dọn vệ sinh 10 xu/ngày (giữ điểm) · Quạt/máy lạnh 150 xu (+1) · Bàn ghế 200 xu (+1) | **Không dọn vệ sinh: −1 mỗi 2 ngày** · Nắng nóng không có máy lạnh |
| 👅 **Miệng**: chất lượng bánh | Tay nghề thợ (mục 2.3) · Nguyên liệu tươi | Dùng nguyên liệu sắp hỏng |

**Tác động:**
- **Mắt, Tai, Mũi, Không gian = kéo khách vào tiệm** (sức hút hôm nay). Mỗi nhóm khách có trọng số riêng (mục 5.1).
- **Miệng = giữ khách quay lại** (uy tín dài hạn). Bánh ngon mà tiệm xấu thì ít khách thử; tiệm đẹp mà bánh dở thì khách thử một lần rồi không quay lại.
- **📋 Phiếu trải nghiệm khách** trong báo cáo tối: 5 thanh sao + 1–2 câu "khách nói" chỉ ra **điểm yếu nhất**.
  Ví dụ: *"Bánh đẹp quá! Nhưng chị bán hàng không chào ai cả 😕"* (Tai yếu).

---

## 7. Mở rộng, tài sản, đầu tư (Doanh nhân)

### 7.1 Chuỗi cửa hàng

- Tối đa **4 cửa hàng** (mỗi khu 1). Mở cửa hàng: **thuê** (cọc 300 + thuê/ngày) hoặc **mua mặt bằng** (giá mục 5.2, không trả thuê, là tài sản, thế chấp được).
- Bánh làm chung ở **xưởng chính** (thợ + lò). Người chơi nhập **tổng số bánh**; máy **tự chia** ra các cửa hàng theo nhu cầu dự kiến từng khu (hiện bảng chia để người chơi xem). *Không bắt trẻ phân bổ tay.*
- Mỗi cửa hàng có điểm trải nghiệm riêng (Mắt, Tai, Không gian); Mũi và Miệng tính theo xưởng.
- Bài học: "Mở rộng quá nhanh khi chưa có lãi = gánh nhiều tiền thuê".

### 7.2 Đầu tư khác

| Khoản | Vốn | Lợi | Rủi ro | Bài học |
|---|---|---|---|---|
| 💰 Gửi tiết kiệm | Tuỳ ý | 0,3%/ngày | Gần như không | An toàn nhưng lời ít |
| 🛵 Xe giao hàng | 400 | Mở kênh đặt bánh giao tận nhà (+khách Gia đình, ngày mưa không giảm khách) | Tốn xăng 10 xu/ngày | Đi tới chỗ khách |
| 🥚 Góp vốn trại gà | 600 | Trứng mua rẻ 25% + cổ tức nhỏ | Dịch bệnh (thẻ sự kiện) làm mất cổ tức vài ngày | Kiểm soát nguồn nguyên liệu |
| 🏠 Mua mặt bằng | Theo khu | Không trả thuê; giá trị tăng nhẹ mỗi mùa | Kẹt vốn | Tài sản vs tiền mặt |

### 7.3 Tài sản ròng

> **Tài sản ròng = Tiền mặt + Tiết kiệm + Giá trị tài sản (lò, máy, xe, mặt bằng, phần góp vốn) − Mọi khoản nợ − Phần lợi nhuận phải chia cho người góp vốn**

Bảng xếp hạng dùng tài sản ròng. Báo cáo cuối mùa có **biểu đồ tài sản ròng theo ngày** của mỗi tiệm.

---

## 8. Hồ sơ người chơi, tủ cúp, danh hiệu

- **Hồ sơ** (tên + biểu tượng, lưu trên máy). Khi tạo ván, mỗi tiệm chọn hồ sơ chủ tiệm (hoặc "Máy").
- **Cấp người chơi** theo điểm tích luỹ (thắng, cúp, câu đố đúng):
  🌱 Tập sự → 🧁 Chủ tiệm → 💼 Doanh nhân → 👑 Ông trùm bánh ngọt.
- **Cúp và danh hiệu** (lưu vào tủ cúp, ghi ngày đạt):

| Cúp | Điều kiện |
|---|---|
| 🥇🥈🥉 Hạng mùa | Đứng 1/2/3 cuối mùa (theo từng mùa, từng chế độ) |
| 🏪 Ông chủ chuỗi | Có 3 cửa hàng cùng lúc |
| 💸 Sạch nợ | Hết mùa không nợ đồng nào |
| ♻️ Không bỏ phí | 5 ngày liền không bỏ bánh nào |
| ❤️ Khách quen số 1 | Trung bình 5 điểm chạm ≥ 4,5 sao trong 5 ngày |
| 📈 Nhà đầu tư khôn | Khoản đầu tư khác có lời cuối mùa |
| 🔥 Vượt khó | Từng bị cảnh báo đỏ mà cuối mùa vào top 2 |
| 🎓 Học giỏi | Trả lời đúng hết câu đố cuối mùa |
| 🏆 Kỷ lục | Phá kỷ lục tài sản ròng của chính mình |

- Cúp **không tính** cho tiệm do máy chơi, và không tính khi bị cảnh báo "1 người giữ nhiều tiệm" (mục 9).

---

## 9. Cảnh báo

| Loại | Điều kiện | Mức | Cách hiện |
|---|---|---|---|
| 📉 Thua lỗ | Lỗ 3 ngày liền | 🟡 Vàng | Thẻ cảnh báo đầu lượt + gợi ý xem Phiếu trải nghiệm / giá / thị trường |
| 📉 Thua lỗ | Lỗ 5 ngày liền, hoặc tài sản ròng < 50% vốn đầu mùa | 🔴 Đỏ | Như trên + "kế hoạch cứu tiệm" 3 bước |
| 🏦 Nợ cao | Nợ / tổng tài sản > 60% (vàng), > 90% (đỏ) | 🟡/🔴 | |
| 🔁 Vay chồng | Từ 3 khoản vay trở lên cùng lúc | 🔴 | Khoản vay mới +1% lãi; bài học "lấy nợ trả nợ" |
| 🎲 Bỏ ván thua | Hồ sơ bỏ ván khi đang **xếp chót** 2 lần trong 7 ngày | 🟡 | Hiện khi tạo ván mới; bài học "trốn lỗ không giúp mình giỏi hơn". Có ghi trong hồ sơ |
| 👥 Một người nhiều tiệm | Cùng 1 hồ sơ chọn cho từ 2 tiệm trở lên trong 1 ván | 🟡 | Hiện khi tạo ván; ván đó **không tính cúp** |

Cảnh báo **không chặn** chơi; chỉ nhắc và dạy.

---

## 10. Học mà chơi: bài học và câu đố

### 10.1 Thẻ "💡 Bài học"

Hiện **1 thẻ/ngày tối đa**, đúng lúc chuyện xảy ra, giọng vui nhộn, 1–2 câu. Đã gặp thì lưu vào **"Sổ bài học"** trong hồ sơ.
Danh sách đề xuất (30 thẻ):

| # | Khi nào hiện | Bài học |
|---|---|---|
| 1 | Bỏ bánh quá hạn lần đầu | Làm nhiều không phải là bán nhiều. Bánh thừa = tiền rơi vào thùng rác 🗑️ |
| 2 | Hết bánh, khách sang tiệm khác | Khách không chờ ai cả. Hết hàng là tặng khách cho đối thủ |
| 3 | Giá > 120% | Bán đắt thì lời mỗi cái, nhưng ít người mua. Lãi = (giá − vốn) × số bán được |
| 4 | Giá < 85% | Bán rẻ đông khách nhưng mệt mà chẳng lời bao nhiêu |
| 5 | Vay lần đầu | Vay là mượn tiền của tương lai. Nhớ trả kèm lãi nhé |
| 6 | Còn nợ cuối mùa | Nợ để lâu thì thành gánh nặng gấp đôi |
| 7 | Mua công thức | Mua công thức là dùng tiền để mua thời gian |
| 8 | Thuê thợ cả | Thợ giỏi lương cao, nhưng bánh ngon giữ được khách lâu |
| 9 | Học việc lên Lành nghề | Ai cũng bắt đầu từ học việc. Kiên trì là lên tay nghề |
| 10 | Nguyên liệu hỏng | Trứng, sữa không chờ ai. Mua vừa đủ dùng |
| 11 | Trải nghiệm Mắt thấp | Khách "ăn bằng mắt" trước tiên. Bánh đẹp mời gọi khách |
| 12 | Tai thấp | Một lời chào ấm áp giá 0 xu nhưng giữ khách cả năm |
| 13 | Mũi cao, khách tăng | Mùi bánh nướng là "quảng cáo miễn phí" bay ra cả phố |
| 14 | Không gian bẩn | Bánh ngon mấy mà tiệm bẩn thì khách cũng ngại bước vào |
| 15 | Miệng thấp, khách không quay lại | Tiệm đẹp kéo khách lần đầu; bánh ngon kéo khách lần sau |
| 16 | Giờ vàng 3 ngày liền | Giảm giá mãi thì khách chỉ chờ giảm giá |
| 17 | Marketing nhắm sai nhóm | Phát tờ rơi bánh kem cho học sinh đi học thì phí tiền |
| 18 | Marketing đúng nhóm | Nói đúng điều khách cần, đúng chỗ khách đứng |
| 19 | Ăn thử khi bánh ngon | Cho khách nếm thử là cách tự tin nhất để bán hàng |
| 20 | Ăn thử khi bánh dở | Mời thử bánh dở là tự quảng cáo… cái dở 😅 |
| 21 | Mở tiệm ở khu đông đối thủ | Chỗ đông người bán thì phải chia khách. Tìm chỗ khách cần mà ít người bán |
| 22 | Khảo sát khách | Hỏi trước khi làm rẻ hơn làm xong mới biết không ai mua |
| 23 | Bán sai món cho khu | Học sinh ít tiền mua macaron. Bán đúng món cho đúng người |
| 24 | Mở cửa hàng thứ 2 | Mở rộng khi tiệm đầu đã có lãi đều đặn |
| 25 | Vay nóng | Tiền đến nhanh thì lãi cũng chạy nhanh ⚡ |
| 26 | Thế chấp | Lãi rẻ nhưng nếu không trả, ngân hàng lấy luôn tài sản |
| 27 | Mất tài sản thế chấp | Đừng đặt cược cả "ngôi nhà" vào một khoản vay |
| 28 | Gửi tiết kiệm | Tiền nhàn rỗi để trong két không tự lớn lên |
| 29 | Góp vốn trại gà, trứng tăng giá | Nắm nguồn nguyên liệu giúp đỡ sốc khi chợ tăng giá |
| 30 | Cảnh báo đỏ | Thua lỗ không đáng sợ, đáng sợ là không biết vì sao lỗ. Xem lại sổ sách nhé |

### 10.2 Câu đố cuối mùa

- 3 câu trắc nghiệm, chọn từ các bài học người đó **đã gặp** trong mùa. Ví dụ:
  *"Tiệm của Gấu đẹp, thơm, nhưng bánh dở. Điều gì sẽ xảy ra? A) Khách đông mãi · B) Khách thử 1 lần rồi không quay lại · C) Khách tự mang bánh tới."*
- Đúng 3/3 → cúp 🎓 Học giỏi + điểm cấp người chơi. Sai thì hiện giải thích, không trừ điểm.

---

## 11. Màn mới / thay đổi giao diện

| Màn | Nội dung |
|---|---|
| Ván mới | Công tắc **Nhập môn / Doanh nhân**; chọn **hồ sơ** cho từng tiệm; Doanh nhân: chọn **khu** đặt tiệm |
| Hồ sơ & Tủ cúp (từ Menu) | Danh sách hồ sơ, cấp người chơi, cúp, kỷ lục, Sổ bài học |
| 📊 Phân tích thị trường | Mục 5.3 (thẻ mới trong kế hoạch: Mua · Làm · Giá · **Bán** · Tiệm) |
| Thẻ **Bán** (mới) | Giờ vàng, chiến dịch marketing, mời ăn thử |
| Thẻ **Tiệm** | Thêm: thợ 3 cấp, nhân viên quầy, đầu tư trải nghiệm, cửa hàng, vay nhiều hình thức, đầu tư khác |
| Báo cáo tối | Thêm: **Phiếu trải nghiệm khách**, cảnh báo, thẻ bài học |
| Hết mùa | Biểu đồ tài sản ròng, cúp mới, câu đố |

Nhập môn chỉ thêm: thẻ bài học, câu đố, hồ sơ và tủ cúp. Giao diện Nhập môn **không** hiện các nút Doanh nhân.

---

## 12. Đề xuất HOÃN (để không quá rối cho trẻ)

- Giờ trong ngày (sáng/trưa/chiều) với lượng khách khác nhau → gộp vào "hệ số khu".
- Chuyển hàng tay giữa các cửa hàng → máy tự chia (mục 7.1).
- Tính cách từng nhân viên, đình công, nghỉ phép.
- Chứng khoán, bất động sản đầu cơ, tỷ giá.
- Chơi nhiều máy qua mạng (giữ hướng nối Đấu trường Nhà Mình sau này).

---

## 13. Cân bằng (bước GĐ2): tiêu chí mới

Giữ 5 tiêu chí cũ (C1–C5) cho **cả 2 chế độ**, thêm cho Doanh nhân:

| Mã | Tiêu chí |
|---|---|
| C6 | Không chiến thuật mới nào thắng chắc (giờ vàng hằng ngày, ăn thử tối đa, vay thế chấp tối đa, mở chuỗi sớm, chỉ đầu tư trải nghiệm): mỗi biến thể < 50% (công bằng 33%) |
| C7 | Đầu tư trải nghiệm khách **có lời trong 1 mùa** (so với không đầu tư) |
| C8 | Chọn khu đúng món có lợi rõ (≥ +10% lãi) so với chọn khu ngẫu nhiên |
| C9 | Máy Vừa Doanh nhân phá sản < 5%, mất tài sản thế chấp < 10% số ván |
| C10 | Ván 1 mùa Doanh nhân vẫn chơi trong khoảng 45 phút (giới hạn số quyết định/ngày) |

---

## 14. Kế hoạch làm (sau khi chủ nhà duyệt bản này)

| Giai đoạn | Nội dung | Model đề xuất |
|---|---|---|
| GĐ1a | Hồ sơ + cúp + bài học + câu đố + cảnh báo (dùng cho cả Nhập môn) | Opus |
| GĐ1b | Doanh nhân: món mới, mua công thức, thợ 3 cấp, nhân viên quầy | Opus |
| GĐ1c | Doanh nhân: 4 khu, nhóm khách, 5 điểm chạm, phân tích thị trường | Opus |
| GĐ1d | Doanh nhân: vay nhiều hình thức, chiến thuật ngày, chuỗi, đầu tư khác | Opus |
| GĐ2 | Đối thủ máy biết dùng tính năng mới + mô phỏng 1.000 ván, đạt C1–C10 | Opus |
| GĐ3 | Giao diện các màn mới, thử điện thoại + máy tính bảng | Sonnet |
| GĐ4 | Đăng bản mới lên web (hỏi chủ nhà trước) | Sonnet |

Mỗi giai đoạn xong dừng báo cáo, chờ duyệt. Ván đang lưu của bản cũ giữ chơi được (luật Nhập môn).

---

## 15. Kết quả GĐ1a (25/11/2026)

- Mã: `docs/hocChoi.js` (bộ máy "học mà chơi", chưa gắn vào giao diện; gắn ở GĐ3). Không sửa `engine.js`, `doiThu.js`.
- Có: 30 thẻ bài học kèm câu đố (11 thẻ dùng được ở Nhập môn, 19 thẻ chờ tính năng Doanh nhân) · tự phát hiện bài học sau mỗi ngày (tối đa 1 thẻ, ưu tiên thẻ chưa gặp, cảnh báo đỏ ưu tiên nhất) ·
  câu đố cuối mùa 3 câu ưu tiên bài đã gặp · cảnh báo vàng/đỏ (lỗ liên tiếp, dưới nửa vốn, nợ/tài sản, vay chồng) ·
  hồ sơ người chơi (tối đa 12, chống trùng tên) · cấp người chơi 4 bậc · 11 loại cúp · kiểm tra khi tạo ván (1 người nhiều tiệm → không tính cúp; bỏ ván thua 2 lần/7 ngày → nhắc; Doanh nhân khoá tới khi thắng Nhập môn hoặc người lớn mở khoá).
- Kiểm thử: `tests/hocChoi.test.js` 16 ca (tổng 43/43 đạt), gồm 1 ca chạy 100 ván thật: 783 thẻ bài học, 106 lượt cảnh báo đỏ, không lỗi.
- Cân bằng cũ không đổi: mô phỏng vẫn đạt C1–C5.

---

## 16. Kết quả GĐ1b (25/11/2026)

- Mã: `docs/engine.js` thêm chế độ `cheDo: 'nm' | 'dn'` (`taoVan({ ..., cheDo })`). Mọi luật mới chỉ chạy khi `cheDo = 'dn'`.
  **Nhập môn giữ y hệt:** 40 ván máy chơi trước và sau khi sửa cho cùng kết quả ("dấu vân tay" 651256035); mô phỏng vẫn đạt C1–C5.
- Có ở Doanh nhân:
  - 5 món mới: croissant, bánh bao, pizza mini, flan, macaron (macaron cần Thợ cả đang làm việc).
    **Chỉnh giá so với mục 2.1:** bánh bao 18 → 20, flan 14 → 18 (giá cũ quá thấp so với tiền nguyên liệu).
  - Nghiên cứu được từ mùa 1. **Mua công thức** (150% giá nghiên cứu), làm được từ hôm sau.
  - **Thợ 3 cấp** (phí thuê / lương / công / tay nghề): Học việc 20/15/5/1 · Lành nghề 40/25/8/2 · Thợ cả 100/45/9/3.
    Học việc tự lên Lành nghề sau 6 ngày; khoá Thợ cả 150 xu, nghỉ 2 ngày. Cho nghỉ: người tay nghề thấp trước, đền 3 ngày lương.
  - **Chất lượng bánh** = tay nghề trung bình theo công (10–30). Từ 25 trở lên +2 uy tín/ngày; từ 12 trở xuống −2.
  - **Nhân viên quầy** (tối đa 3, phí 10, lương 15) và khoá lễ phép (60 xu): mỗi người +5% sức hút (tính tối đa 2). GĐ1c sẽ thay bằng điểm Tai.
  - Bài học mới tự hiện: mua công thức, thuê thợ cả, thợ lên cấp.
- Lãi mỗi công ở giá gợi ý (giá nguyên liệu gốc): món mới 5,5–9 xu, cùng khoảng với món cũ (6–9; cookies 12 nhưng ít khách).
- Kiểm thử: `tests/doanhNhan.test.js` 14 ca, có 1 ca máy chơi **200 ván Doanh nhân** (tiền khớp sổ từng ngày). Tổng **57/57 đạt**.
- Đối thủ máy chưa biết dùng món mới, thợ cấp, quầy: sẽ dạy ở GĐ2 khi cân bằng.

---

## 17. Kết quả GĐ1c (25/11/2026)

- Mã: `docs/engine.js` (Doanh nhân): `NHOM_KHACH`, `KHU`, `DAU_TU_TN`, `hopKhu`, `nhayKhu`, `trongSoKhu`, `diemTraiNghiem`, `hutTraiNghiem`,
  `nhuCauKhu`, `phanTichThiTruong`, `khaoSatKhu`. `docs/hocChoi.js`: `phieuTraiNghiem` + câu "khách nói" + bài học điểm chạm.
  `docs/doiThu.js`: máy dự báo khách theo khu của mình (chỉ Doanh nhân).
  **Nhập môn vẫn y hệt** (dấu vân tay 40 ván không đổi; C1–C5 đạt).
- Luật đã chạy:
  - Mỗi tiệm đặt ở 1 khu (mặc định Dân cư); **khách chỉ chia giữa các tiệm trong cùng khu**; tiền thuê theo khu.
  - Khách 1 món ở 1 khu = (số tiệm trong khu + 0,25) × khách chuẩn × quy mô khu × độ hợp món × mùa/sự kiện.
    **Chỉnh so với mục 5:** lợi thế khu vắng đối thủ giảm từ +0,5 xuống +0,25 (thử +0,5 thì tiệm né đối thủ thắng 99%);
    quy mô khu: Cổng trường 100, Văn phòng 100, Dân cư 100, Du lịch 90.
  - Độ nhạy giá theo khu (học sinh 140%, khách du lịch 60%).
  - 5 điểm chạm thang 0–50: Mắt (tủ kính, kệ, bao bì, món đẹp; bánh cũ −10) · Tai (nhân viên quầy, lễ phép, loa) ·
    Mũi (lò ngay quầy, bánh mì/croissant làm trong ngày; bánh cũ −10) · Không gian (độ sạch: không dọn −5/ngày, dọn 10 xu giữ đủ; quạt, bàn ghế; nắng nóng không quạt −10) ·
    Miệng (tay nghề thợ; bánh cũ −10).
  - Mắt + Tai + Mũi + Không gian (theo trọng số khách của khu) đổi sức hút từ 70% tới khoảng 143%. **Miệng** quyết định uy tín (≥ 40: +2/ngày; ≤ 20: −2/ngày).
  - Khảo sát khách 30 xu: món bán chạy của khu hôm qua, giá trung bình, số khách không mua được.
  - Báo cáo tối ghi: khu, số tiệm trong khu, điểm chạm, món không hợp khu (`saiMon`).
- Thử nhanh 150 ván máy Vừa (3 tiệm): cùng khu thắng 41/31/28%; **1 tiệm dời sang khu vắng thắng 51%** (công bằng 33%); dọn dẹp mỗi ngày thắng 39%.
- **Việc để GĐ2 (cân bằng):** máy ở Phố du lịch còn yếu (chưa biết tăng giá, chưa chọn món hợp khu); gói đầu tư trải nghiệm đầy đủ chưa hoàn vốn trong 1 mùa (tiêu chí C7);
  khi 2 tiệm giống hệt nhau, tiệm số 1 hơi lợi do cách làm tròn chia khách (nên xoay vòng theo ngày; sửa sẽ làm đổi kết quả Nhập môn nên cần duyệt).
- Kiểm thử: `tests/khuTraiNghiem.test.js` 16 ca (có 200 ván tiệm rải 4 khu). Tổng **73/73 đạt**.

---

## 18. Kết quả GĐ1d (25/11/2026)

- Mã: `docs/engine.js` (Doanh nhân) + `docs/hocChoi.js` (bài học + `thongTinDN` cho cúp). **Nhập môn vẫn y hệt** (dấu vân tay 40 ván không đổi; C1–C5 đạt).
- Đã chạy được:
  - **Vay nóng** (tối đa 300, lãi 3%/ngày, 5 ngày tự bị thu) · **Vay thế chấp** lò/máy/xe/mặt bằng (70% giá trị, 0,5%/ngày, 8 ngày, gia hạn 1 lần +4 ngày phí 2%; quá hạn **mất tài sản**)
    · **Vay chồng** (từ khoản thứ 3 lãi khoản mới +1%) · **Gọi vốn góp** từ mùa 4 (500–1.500; tài sản ròng trừ vốn góp + 30% lợi nhuận) · trả bớt từng khoản.
  - **Giờ vàng** 20/40/50%: bán thêm bánh hết hạn hôm nay (30/60/75% số dư); 3 ngày liền → mất 15% sức hút (khách chờ giảm giá).
  - **Chiến dịch marketing** 120 xu/3 ngày theo nhóm khách: đúng nhóm chính +80% sức hút, sai nhóm gần như không tác dụng.
  - **Mời ăn thử** 5/10/20 bánh: Miệng ≥ 30 → +sức hút 3 ngày và +uy tín; Miệng ≤ 20 → ngược lại.
  - **Chuỗi** tối đa 4 cửa hàng (mỗi khu 1), thuê (cọc 300 + tiền thuê) hoặc mua mặt bằng; **hàng của xưởng tự chia cho các cửa hàng** theo khách dự kiến.
    Cửa hàng phụ dùng chung điểm chạm của tiệm chính (đơn giản hoá cho trẻ). Chi nhánh kiểu cũ không dùng ở Doanh nhân.
  - **Đầu tư khác:** tiết kiệm 0,3%/ngày · xe giao hàng 400 (+8% sức hút, ngày mưa +25%, xăng 10/ngày) · góp vốn trại gà 600 (trứng rẻ 25%, cổ tức 10/ngày; sự kiện mới "Dịch cúm gà" chỉ có ở Doanh nhân) · mua mặt bằng tiệm chính (không trả thuê).
  - **Tài sản ròng** Doanh nhân = tiền + tiết kiệm + tài sản (lò, máy, xe, trại gà, mặt bằng, cọc) − mọi khoản nợ − phần người góp vốn.
  - Bài học tự hiện: vay nóng, thế chấp, mất tài sản, giờ vàng liên tục, marketing đúng/sai, ăn thử ngon/dở, mở rộng, tiết kiệm, nguồn nguyên liệu.
- Sửa thêm: bộ máy chặn "sang ngày" khi mùa đã kết thúc (lỗ hổng cũ, không ảnh hưởng game).
- Kiểm thử: `tests/vonChuoi.test.js` 15 ca (có 200 ván máy chơi + dùng ngẫu nhiên tính năng mới hơn 500 lần, tiền khớp sổ từng ngày). Tổng **88/88 đạt**.
- Thử nhanh 150 ván/biến thể (1 máy Vừa dùng chiến thuật, đấu 2 máy Vừa; công bằng 33%):
  không thêm gì 35% · giờ vàng mỗi ngày 3% · chiến dịch đúng nhóm 30% · sai nhóm 0% · ăn thử mỗi ngày 6% · dọn dẹp + tủ kính + loa 16% · mở cửa hàng ngày 1: 1% · tiết kiệm 32% · vay nóng liên tục 7%.
  → Không chiến thuật nào thắng chắc (C6 đạt). Dùng sai thì thua (đúng bài học). **Nhưng dùng đúng cũng chưa có lời** vì máy chưa biết làm thêm bánh khi có thêm khách:
  **việc chính của GĐ2** là dạy máy dùng tính năng mới + chỉnh số để đạt C7 (đầu tư trải nghiệm có lời) và C8 (chọn khu đúng có lợi).

---

## 19. Kết quả GĐ2: cân bằng Doanh nhân (25/11/2026)

- Công cụ: `tools/mophongDN.js` (`npm run mophong:dn [số ván]`). Kiểm thử nhanh chống phá cân bằng: `tests/canBangDN.test.js`. Tổng **91/91 kiểm thử đạt**.
- **Nhập môn vẫn y hệt** (dấu vân tay 40 ván không đổi; C1–C5 đạt).
- **Mô phỏng 400 ván Doanh nhân đạt cả 9 tiêu chí** (C1, C3–C10; C2 là tiêu chí của Nhập môn):

| Tiêu chí | Kết quả |
|---|---|
| C1 Khó > Vừa > Dễ | Khó nhất 60,5% · Vừa 39,5% · Dễ 0% (hạng TB 1,48 / 1,66 / 2,87) |
| C3 Vừa có lãi mọi mùa | 1.380 · 1.250 · 2.798 · 2.826 · 3.680 (vốn đầu 1.000) |
| C4, C9 | Vừa phá sản 0%; biến thể thế chấp tối đa mất tài sản 1% |
| C5 Uy tín Vừa | TB 365 (≈ 3,7 sao) |
| C6 Không chiến thuật thắng chắc | giờ vàng mỗi ngày 0% · ăn thử mỗi ngày 0% · chiến dịch liên tục 16% · mở chuỗi sớm 1% · chỉ lo trải nghiệm 40% · thế chấp tối đa 19% |
| C7 Trải nghiệm có lời | có đầu tư 2.708 so với không đầu tư, không dọn 1.960 |
| C8 Chọn khu vắng có lợi | lãi 1.455 so với chen vào khu có 2 đối thủ 852 |
| C10 Gọn | máy Khó TB 7 việc/ngày (đo thật khi có giao diện) |

- **Thay đổi luật trong GĐ2 (chỉ Doanh nhân):**
  1. Trải nghiệm khách, chiến dịch, xe, ăn thử và **uy tín** giờ **kéo thêm khách cho cả khu**, không chỉ giành khách của tiệm bên cạnh
     (lý do: máy tự rải ra mỗi khu 1 tiệm thì trải nghiệm trước đó vô dụng). Uy tín 300 = 100% khách, 500 = 120%.
  2. Hệ số trải nghiệm ×3 mỗi điểm lệch mốc 12 (tiệm bình thường có dọn dẹp ≈ 100%), tối thiểu 40%.
  3. Khu đông: mỗi tiệm 125% khách khi một mình, 100% khi 2 tiệm, ~92% khi 3 tiệm, ~88% khi 4 tiệm.
  4. Chiến dịch marketing: tối đa +30% (đúng nhóm chính), giá 150 xu.
  5. Mỗi cửa hàng phụ tốn thêm 40 xu/ngày (điện nước, người trông).
- **Máy đối thủ Doanh nhân:** dự báo theo khu + trải nghiệm + uy tín, học từ số bán hôm qua; nghiên cứu món hợp khu; dọn dẹp mỗi ngày; giờ vàng khi thừa bánh;
  trả trước khoản vay sắp đến hạn. Máy Khó thêm: đầu tư trải nghiệm hợp khu, thuê quầy ở khu coi trọng Tai, chiến dịch ngày lễ,
  đào tạo thợ cả khi uy tín ≥ 350, mở cửa hàng khi lò đã nâng cấp và thiếu hàng, mua công thức chỉ khi rất dư tiền.
  Máy Khó Doanh nhân tối đa 6 thợ (8 thợ làm lỗ lương).
- **Còn chờ chủ nhà quyết:** khi 2 tiệm giống hệt nhau, tiệm số 1 hơi lợi do cách làm tròn chia khách. Sửa (xoay vòng theo ngày) sẽ làm thay đổi nhẹ kết quả Nhập môn.

---

## 20. Kết quả GĐ3: giao diện v0.4 (25/11/2026)

- `docs/app.js` viết lại (bản v0.3 giữ dự phòng ngoài dự án). `docs/styles.css` thêm kiểu cho cảnh báo, bài học, phiếu trải nghiệm, tủ cúp, câu đố. `docs/sw.js` lên `dctb-v0.4.0` (thêm `hocChoi.js`).
- Màn mới / đổi:
  - **Menu:** thêm "🏆 Hồ sơ & Tủ cúp". **Hồ sơ:** tạo, đổi tên, xoá (hỏi xác nhận), cấp người chơi, cúp, kỷ lục 2 chế độ, Sổ bài học; nút "🔑 Người lớn mở khoá Doanh nhân" (hỏi xác nhận).
  - **Ván mới:** công tắc 🌱 Nhập môn / 💼 Doanh nhân; mỗi tiệm người chọn hồ sơ (hoặc "Khách", không lưu cúp); Doanh nhân chọn khu (máy tự rải khu vắng);
    hiện cảnh báo khi tạo ván (1 người nhiều tiệm, bỏ ván thua, chưa mở Doanh nhân). Doanh nhân cần hồ sơ cho mọi người chơi.
  - **Bảng tiệm Doanh nhân:** cửa hàng, thợ theo cấp, quầy, tài sản ròng, khoản vay (hạn đỏ khi sắp đến), phiếu "khách nói gì hôm qua", cảnh báo vàng/đỏ; nút 📊 Thị trường.
  - **Kế hoạch Doanh nhân 6 thẻ:** Mua · Làm (độ hợp khu từng món) · Giá (độ nhạy giá của khu) · **Bán** (dọn dẹp, bao bì, giờ vàng, chiến dịch theo nhóm khách, ăn thử) ·
    **Tiệm** (thợ 3 cấp, học thợ cả, quầy + lễ phép, 6 đầu tư trải nghiệm, nghiên cứu/mua công thức, lò, máy, đơn tiệc) ·
    **Vốn** (vay ngân hàng, vay nóng, thế chấp theo tài sản, trả/gia hạn từng khoản, gọi vốn, tiết kiệm, xe, trại gà, mặt bằng, mở cửa hàng).
    "Tiền sau khi chi" và báo lỗi lấy thẳng từ bộ máy (thử nộp kế hoạch trên bản sao).
  - **Thị trường:** 4 khu (nhóm khách, số tiệm, tiền thuê, điểm chạm coi trọng, món hợp) + khảo sát 30 xu.
  - **Báo cáo tối:** cảnh báo từng tiệm, phiếu trải nghiệm (mở/thu gọn), **💡 bài học** cho từng tiệm người chơi (lưu vào Sổ bài học), tin giờ vàng/ăn thử/mất thế chấp/vay nóng/cửa hàng mới.
  - **Hết mùa:** **câu đố 3 câu** cho từng người có hồ sơ (có màn chuyền máy khi ≥ 2 người, hiện đúng/sai + giải thích) → **trao cúp**, cấp người chơi, mở mùa sau (riêng từng chế độ), thông báo mở Doanh nhân.
- Tự kiểm tra qua giao diện thật (máy tự bấm): 1 mùa Nhập môn (2 người + máy) và 1 mùa Doanh nhân (1 người + máy Vừa + máy Khó), đi qua mọi thẻ, Thị trường, khảo sát, chiến dịch, đầu tư, tiết kiệm:
  **0 lỗi, 0 tràn chữ** ở khung điện thoại 375×812 (giao diện A) và máy tính bảng ngang 1024×768 (giao diện C); không có lỗi trong bảng điều khiển trình duyệt.
  Cúp, câu đố, Sổ bài học, mở khoá Doanh nhân, khoá Doanh nhân với người chưa thắng đều chạy đúng.
- Kiểm thử bộ máy: **91/91 đạt**.
