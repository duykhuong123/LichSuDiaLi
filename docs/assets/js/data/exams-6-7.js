/* Đề kiểm tra khối 6–7 (16 TN + 1 Đ/S 4 ý + 1 trả lời ngắn = 10 điểm). Nội dung do tổ chuyên môn rà soát trước khi dùng chính thức. */
(function () {
  var D = (window.DD = window.DD || {}); D.examSets = D.examSets || {};
  var m = function (q, o, a, e, l, t) { return { q: q, opts: o, ans: a, exp: e, level: l, topic: t }; };

  // ===== LỊCH SỬ 6 — Vì sao phải học Lịch sử & Thời nguyên thủy =====
  D.examSets['exam-hist-6-1'] = {
    mcq: [
      m('Lịch sử là gì?', ['Những gì đang diễn ra ở hiện tại', 'Những gì đã diễn ra trong quá khứ', 'Những dự đoán về tương lai', 'Những câu chuyện hoàn toàn do con người tưởng tượng'], 1, 'Lịch sử là toàn bộ những hoạt động của con người và xã hội loài người đã diễn ra trong quá khứ.', 'Biết', 'Vì sao phải học Lịch sử'),
      m('Một thế kỉ có bao nhiêu năm?', ['10 năm', '50 năm', '100 năm', '1000 năm'], 2, 'Một thế kỉ bằng 100 năm; một thiên niên kỉ bằng 1000 năm.', 'Biết', 'Thời gian trong lịch sử'),
      m('Trống đồng Đông Sơn thuộc loại tư liệu lịch sử nào?', ['Tư liệu truyền miệng', 'Tư liệu chữ viết', 'Tư liệu hiện vật', 'Tư liệu hình ảnh hiện đại'], 2, 'Trống đồng là vật do người xưa chế tác còn lưu lại nên là tư liệu hiện vật.', 'Biết', 'Nguồn sử liệu'),
      m('Công cụ lao động đầu tiên của người nguyên thủy được làm chủ yếu bằng chất liệu nào?', ['Sắt', 'Đồng thau', 'Đá', 'Thép'], 2, 'Người nguyên thủy ban đầu chế tác công cụ bằng đá (đá cũ), sau đó mới biết đến kim loại.', 'Biết', 'Xã hội nguyên thủy'),
      m('Tổ chức xã hội đầu tiên của loài người là gì?', ['Bầy người nguyên thủy', 'Công xã thị tộc', 'Nhà nước', 'Bộ lạc liên minh'], 0, 'Xã hội loài người bắt đầu từ giai đoạn bầy người nguyên thủy, sau đó phát triển thành công xã thị tộc.', 'Biết', 'Xã hội nguyên thủy'),
      m('Di tích Núi Đọ – nơi tìm thấy công cụ đá của người tối cổ ở Việt Nam – thuộc tỉnh nào hiện nay?', ['Thanh Hóa', 'Hòa Bình', 'Lạng Sơn', 'Nghệ An'], 0, 'Núi Đọ (Thiệu Hóa) thuộc Thanh Hóa, là di tích thuộc thời đại đá cũ ở Việt Nam.', 'Biết', 'Nguyên thủy ở Việt Nam'),
      m('Vì sao chúng ta cần học lịch sử?', ['Để biết cội nguồn và rút ra bài học cho hiện tại, tương lai', 'Để ghi nhớ thật nhiều ngày tháng mà không cần hiểu', 'Để biết chắc những gì sẽ xảy ra trong tương lai', 'Để thay đổi những sự kiện đã xảy ra'], 0, 'Học lịch sử giúp hiểu quá khứ, cội nguồn dân tộc và rút bài học cho hiện tại và tương lai.', 'Hiểu', 'Vì sao phải học Lịch sử'),
      m('Phát minh ra lửa có ý nghĩa nào sau đây đối với người nguyên thủy?', ['Giúp họ sống hoàn toàn không cần săn bắt', 'Giúp sưởi ấm, nấu chín thức ăn, xua đuổi thú dữ', 'Giúp họ làm ra kim loại ngay lập tức', 'Giúp họ chuyển sang định cư làm nông nghiệp'], 1, 'Lửa giúp con người sưởi ấm, nấu chín thức ăn và tự vệ trước thú dữ, cải thiện đời sống.', 'Hiểu', 'Xã hội nguyên thủy'),
      m('Đặc điểm nổi bật của công xã thị tộc là gì?', ['Chia thành giai cấp giàu – nghèo rõ rệt', 'Những người có chung dòng máu sống cùng nhau, làm chung, hưởng chung', 'Mỗi gia đình sống tách biệt và có tài sản riêng', 'Có nhà nước và pháp luật quản lí'], 1, 'Trong thị tộc, các thành viên cùng huyết thống chung sống, lao động và hưởng thụ chung.', 'Hiểu', 'Xã hội nguyên thủy'),
      m('Dương lịch lấy căn cứ chính vào chu kì chuyển động nào?', ['Mặt Trăng quay quanh Trái Đất', 'Trái Đất quay quanh Mặt Trời', 'Mặt Trời quay quanh Trái Đất', 'Mặt Trăng quay quanh Mặt Trời'], 1, 'Dương lịch dựa vào chu kì Trái Đất chuyển động quanh Mặt Trời (khoảng 365 ngày); âm lịch dựa vào chu kì Mặt Trăng.', 'Hiểu', 'Thời gian trong lịch sử'),
      m('Kim loại đầu tiên được con người sử dụng để chế tạo công cụ và đồ dùng là:', ['Sắt', 'Nhôm', 'Đồng', 'Vàng'], 2, 'Con người biết dùng đồng (đồng đỏ, sau đó là đồng thau) trước khi biết luyện sắt.', 'Hiểu', 'Xã hội nguyên thủy'),
      m('Nguyên nhân sâu xa dẫn đến sự tan rã của xã hội nguyên thủy là gì?', ['Do chiến tranh với người ngoài hành tinh', 'Công cụ kim loại ra đời, năng suất tăng, sản phẩm dư thừa dẫn đến tư hữu và phân hóa giàu nghèo', 'Do thiên tai xảy ra liên tục', 'Do dân số giảm mạnh'], 1, 'Công cụ kim loại làm năng suất tăng, xuất hiện của cải dư thừa, tư hữu và phân hóa giàu nghèo khiến thị tộc dần tan rã.', 'Hiểu', 'Xã hội nguyên thủy'),
      m('Năm 179 TCN thuộc thế kỉ nào?', ['Thế kỉ I TCN', 'Thế kỉ II TCN', 'Thế kỉ III TCN', 'Thế kỉ I'], 1, 'Từ năm 101 TCN đến 200 TCN là thế kỉ II TCN, nên năm 179 TCN thuộc thế kỉ II TCN.', 'Vận dụng', 'Thời gian trong lịch sử'),
      m('Từ năm 1 (CN) đến năm 2026 cách nhau bao nhiêu năm theo dương lịch (không tính năm 0)?', ['2025 năm', '2026 năm', '2027 năm', '2000 năm'], 0, 'Tính từ năm 1 đến năm 2026 cách nhau 2026 − 1 = 2025 năm.', 'Vận dụng', 'Thời gian trong lịch sử'),
      m('Muốn dựng lại một sự kiện lịch sử đáng tin cậy, cách làm nào sau đây là phù hợp nhất?', ['Chỉ tin vào một câu chuyện truyền miệng', 'Đối chiếu nhiều nguồn tư liệu: hiện vật, chữ viết, truyền miệng', 'Chỉ dựa vào phim ảnh', 'Chỉ dựa vào suy đoán cá nhân'], 1, 'Sử học đối chiếu, kiểm chứng nhiều loại nguồn tư liệu để bảo đảm độ tin cậy.', 'Vận dụng', 'Nguồn sử liệu'),
      m('Phát hiện nào cho thấy Việt Nam là một trong những nơi có người tối cổ sinh sống?', ['Công cụ đá ở Núi Đọ và răng người tối cổ ở hang Thẩm Khuyên, Thẩm Hai', 'Trống đồng Ngọc Lũ', 'Thành Cổ Loa', 'Bia tiến sĩ Văn Miếu'], 0, 'Công cụ đá Núi Đọ và dấu tích răng người tối cổ ở Lạng Sơn chứng tỏ người tối cổ sống trên đất Việt Nam từ rất sớm.', 'Vận dụng', 'Nguyên thủy ở Việt Nam')
    ],
    tf: { prompt: 'Đọc nhận định sau: "Khi công cụ lao động bằng kim loại xuất hiện, năng suất lao động tăng lên, sản phẩm làm ra có dư thừa." Hãy cho biết các ý sau Đúng hay Sai:', items: [
      { text: 'Sản phẩm dư thừa là một điều kiện dẫn đến tư hữu.', ans: true, exp: 'Của cải dư thừa tạo điều kiện cho một số người chiếm hữu làm của riêng.' },
      { text: 'Xã hội nguyên thủy sau đó vẫn giữ nguyên chế độ công hữu về tư liệu sản xuất.', ans: false, exp: 'Tư hữu xuất hiện làm chế độ công hữu dần tan rã.' },
      { text: 'Sự phân hóa giàu nghèo bắt đầu xuất hiện trong xã hội.', ans: true, exp: 'Tư hữu dẫn đến sự phân hóa giàu – nghèo.' },
      { text: 'Công cụ kim loại đầu tiên con người sử dụng là sắt.', ans: false, exp: 'Đồng được dùng trước sắt.' } ], level: 'Hiểu', topic: 'Xã hội nguyên thủy' },
    sa: { prompt: 'Một thiên niên kỉ có bao nhiêu thế kỉ? (Điền một số)', ans: '10', alts: ['mười'], exp: '1 thiên niên kỉ = 1000 năm = 10 thế kỉ.', level: 'Vận dụng', topic: 'Thời gian trong lịch sử' }
  };

  // ===== ĐỊA LÍ 6 — Trái Đất và bản đồ =====
  D.examSets['exam-geo-6-1'] = {
    mcq: [
      m('Trái Đất có dạng hình gì?', ['Hình tròn dẹt', 'Hình khối cầu', 'Hình vuông', 'Hình trụ'], 1, 'Trái Đất có dạng hình khối cầu hơi dẹt ở hai cực.', 'Biết', 'Trái Đất'),
      m('Theo thứ tự xa dần Mặt Trời, Trái Đất là hành tinh thứ mấy?', ['Thứ nhất', 'Thứ hai', 'Thứ ba', 'Thứ tư'], 2, 'Trái Đất là hành tinh thứ ba trong Hệ Mặt Trời tính từ Mặt Trời ra.', 'Biết', 'Trái Đất'),
      m('Đường kinh tuyến gốc có số độ là bao nhiêu?', ['0°', '90°', '180°', '23°27′'], 0, 'Kinh tuyến gốc là kinh tuyến 0°, đi qua đài thiên văn Grin-uých (Anh).', 'Biết', 'Bản đồ'),
      m('Đường vĩ tuyến gốc là đường nào?', ['Chí tuyến Bắc', 'Chí tuyến Nam', 'Xích đạo', 'Vòng cực Bắc'], 2, 'Xích đạo là vĩ tuyến gốc (0°).', 'Biết', 'Bản đồ'),
      m('Trái Đất tự quay quanh trục theo hướng nào?', ['Từ Tây sang Đông', 'Từ Đông sang Tây', 'Từ Bắc xuống Nam', 'Từ Nam lên Bắc'], 0, 'Trái Đất tự quay quanh trục từ Tây sang Đông.', 'Biết', 'Chuyển động của Trái Đất'),
      m('Cấu tạo bên trong của Trái Đất gồm mấy lớp chính?', ['2 lớp', '3 lớp', '4 lớp', '5 lớp'], 1, 'Gồm ba lớp: vỏ Trái Đất, lớp trung gian (man-ti) và nhân Trái Đất.', 'Biết', 'Cấu tạo Trái Đất'),
      m('Bản đồ có tỉ lệ 1 : 1 000 000, nghĩa là 1 cm trên bản đồ ứng với bao nhiêu km ngoài thực tế?', ['1 km', '10 km', '100 km', '1000 km'], 1, '1 cm × 1 000 000 = 1 000 000 cm = 10 km.', 'Hiểu', 'Bản đồ'),
      m('Hiện tượng ngày và đêm kế tiếp nhau trên Trái Đất là do:', ['Trái Đất tự quay quanh trục', 'Trái Đất chuyển động quanh Mặt Trời', 'Mặt Trăng chuyển động quanh Trái Đất', 'Mặt Trời quay quanh Trái Đất'], 0, 'Do Trái Đất hình cầu và tự quay quanh trục nên luôn có một nửa được chiếu sáng (ngày), nửa kia ở trong bóng tối (đêm).', 'Hiểu', 'Chuyển động của Trái Đất'),
      m('Trái Đất chuyển động quanh Mặt Trời hết một vòng khoảng bao lâu?', ['24 giờ', '30 ngày', 'Khoảng 365 ngày 6 giờ', '12 năm'], 2, 'Một năm dương lịch khoảng 365 ngày 6 giờ; vì vậy cứ 4 năm có một năm nhuận 366 ngày.', 'Hiểu', 'Chuyển động của Trái Đất'),
      m('Mùa trên Trái Đất hình thành chủ yếu do:', ['Trục Trái Đất nghiêng không đổi hướng khi Trái Đất chuyển động quanh Mặt Trời', 'Khoảng cách Trái Đất – Mặt Trời thay đổi rất lớn', 'Mặt Trăng che khuất Mặt Trời', 'Trái Đất tự quay quanh trục'], 0, 'Trục nghiêng và hướng không đổi làm góc chiếu sáng thay đổi, tạo ra các mùa.', 'Hiểu', 'Chuyển động của Trái Đất'),
      m('Lớp nào của Trái Đất mỏng nhất nhưng là nơi sinh sống của con người?', ['Nhân', 'Lớp trung gian (man-ti)', 'Vỏ Trái Đất', 'Nhân ngoài'], 2, 'Vỏ Trái Đất mỏng nhất và là nơi tồn tại của các thành phần tự nhiên và xã hội loài người.', 'Hiểu', 'Cấu tạo Trái Đất'),
      m('Hướng ngược với hướng Bắc trên bản đồ là hướng nào?', ['Nam', 'Đông', 'Tây', 'Đông Bắc'], 0, 'Hướng Nam đối diện hướng Bắc; hướng Đông đối diện hướng Tây.', 'Hiểu', 'Bản đồ'),
      m('Điểm A ở 105° Đông, 21° Bắc thì tọa độ địa lí của A được viết như thế nào?', ['(105°Đ, 21°B)', '(21°Đ, 105°B)', '(105°B, 21°Đ)', '(21°B, 105°T)'], 0, 'Kinh độ 105° Đông, vĩ độ 21° Bắc, viết là (105°Đ, 21°B). Đây là vị trí gần Hà Nội.', 'Vận dụng', 'Bản đồ'),
      m('Trên bản đồ có tỉ lệ 1 : 500 000, hai điểm cách nhau 4 cm. Khoảng cách thực tế là:', ['2 km', '20 km', '200 km', '4 km'], 1, '4 cm × 500 000 = 2 000 000 cm = 20 km.', 'Vận dụng', 'Bản đồ'),
      m('Vì sao khi ở Việt Nam là ban ngày thì ở bên kia Trái Đất có thể là ban đêm?', ['Vì Trái Đất hình cầu nên chỉ một nửa được Mặt Trời chiếu sáng tại một thời điểm', 'Vì Mặt Trời tắt vào ban đêm', 'Vì Mặt Trăng che khuất Mặt Trời', 'Vì Trái Đất dẹt như chiếc đĩa'], 0, 'Do Trái Đất hình cầu, luôn có một nửa được chiếu sáng và nửa còn lại trong bóng tối.', 'Vận dụng', 'Chuyển động của Trái Đất'),
      m('Đỉnh núi cao 3143 m được xếp vào dạng địa hình nào theo độ cao tuyệt đối?', ['Đồi', 'Núi thấp', 'Núi trung bình', 'Núi cao'], 3, 'Núi cao là núi có độ cao tuyệt đối trên 2000 m (phân loại theo chương trình lớp 6).', 'Vận dụng', 'Địa hình')
    ],
    tf: { prompt: 'Cho biết: Trái Đất tự quay quanh trục mất khoảng 24 giờ và đồng thời chuyển động quanh Mặt Trời. Các ý sau Đúng hay Sai:', items: [
      { text: 'Trái Đất tự quay một vòng quanh trục mất khoảng 24 giờ.', ans: true, exp: 'Đó là một ngày đêm.' },
      { text: 'Hướng tự quay của Trái Đất là từ Đông sang Tây.', ans: false, exp: 'Trái Đất quay từ Tây sang Đông.' },
      { text: 'Trục Trái Đất nghiêng so với mặt phẳng quỹ đạo.', ans: true, exp: 'Trục nghiêng khoảng 66°33′ so với mặt phẳng quỹ đạo.' },
      { text: 'Nhờ chuyển động quanh Mặt Trời mà có hiện tượng ngày đêm.', ans: false, exp: 'Ngày đêm là do Trái Đất tự quay quanh trục.' } ], level: 'Hiểu', topic: 'Chuyển động của Trái Đất' },
    sa: { prompt: 'Cứ bao nhiêu năm thì có một năm nhuận (366 ngày) trong dương lịch? (Điền một số)', ans: '4', alts: ['bốn'], exp: 'Một năm có khoảng 365 ngày 6 giờ, phần dư 6 giờ cộng dồn thành 1 ngày sau 4 năm.', level: 'Vận dụng', topic: 'Chuyển động của Trái Đất' }
  };

  // ===== LỊCH SỬ 7 — Tây Âu thời Trung đại & Các cuộc phát kiến địa lí =====
  D.examSets['exam-hist-7-1'] = {
    mcq: [
      m('Quốc gia nào ở Tây Âu có phong trào Văn hóa Phục hưng bắt đầu sớm nhất?', ['I-ta-li-a', 'Anh', 'Tây Ban Nha', 'Nga'], 0, 'Văn hóa Phục hưng bắt đầu ở I-ta-li-a vào thế kỉ XIV rồi lan sang nhiều nước châu Âu.', 'Biết', 'Văn hóa Phục hưng'),
      m('Đế quốc Tây La Mã bị diệt vong vào năm nào?', ['395', '476', '1054', '1453'], 1, 'Năm 476, các tộc người Giéc-man lật đổ Đế quốc Tây La Mã.', 'Biết', 'Tây Âu thời Trung đại'),
      m('Hai giai cấp cơ bản trong xã hội phong kiến Tây Âu là:', ['Lãnh chúa phong kiến và nông nô', 'Tư sản và vô sản', 'Chủ nô và nô lệ', 'Địa chủ và tá điền'], 0, 'Xã hội phong kiến Tây Âu gồm lãnh chúa (giai cấp thống trị) và nông nô (giai cấp bị trị).', 'Biết', 'Tây Âu thời Trung đại'),
      m('Người đầu tiên chỉ huy đoàn thám hiểm đến được châu Mĩ năm 1492 là:', ['Ma-gien-lăng', 'Cô-lôm-bô', 'Va-xcô đa Ga-ma', 'Đi-a-xơ'], 1, 'Năm 1492, C. Cô-lôm-bô cùng đoàn thủy thủ đến vùng đảo Ca-ri-bê thuộc châu Mĩ.', 'Biết', 'Phát kiến địa lí'),
      m('Va-xcô đa Ga-ma đã mở được tuyến đường biển từ châu Âu sang:', ['Ấn Độ', 'Châu Mĩ', 'Ô-xtrây-li-a', 'Bắc Cực'], 0, 'Năm 1497–1498, Va-xcô đa Ga-ma vòng qua mũi Hảo Vọng đến Ấn Độ.', 'Biết', 'Phát kiến địa lí'),
      m('Chuyến đi vòng quanh thế giới đầu tiên (1519–1522) gắn với tên tuổi:', ['Ma-gien-lăng', 'Cô-lôm-bô', 'Đi-a-xơ', 'Va-xcô đa Ga-ma'], 0, 'Đoàn thám hiểm do Ma-gien-lăng khởi hành đã chứng minh Trái Đất hình cầu.', 'Biết', 'Phát kiến địa lí'),
      m('Thành thị trung đại ở Tây Âu ra đời chủ yếu từ nhu cầu nào?', ['Trao đổi, buôn bán hàng thủ công và nông sản', 'Xây dựng lâu đài cho lãnh chúa', 'Đào tạo hiệp sĩ', 'Truyền bá đạo Ki-tô'], 0, 'Sản xuất thủ công và buôn bán phát triển khiến thợ thủ công, thương nhân tập trung lập nên thành thị.', 'Hiểu', 'Tây Âu thời Trung đại'),
      m('Lãnh địa phong kiến có đặc điểm nổi bật là:', ['Tự cung tự cấp, khép kín, lãnh chúa có quyền lực riêng', 'Buôn bán sôi động với nhiều nước', 'Do nhà nước tập quyền quản lí trực tiếp', 'Nông nô được tự do rời đi'], 0, 'Lãnh địa là đơn vị kinh tế – chính trị khép kín, tự cung tự cấp, lãnh chúa như một "ông vua" nhỏ.', 'Hiểu', 'Tây Âu thời Trung đại'),
      m('Nguyên nhân chủ yếu thúc đẩy các cuộc phát kiến địa lí thế kỉ XV–XVI là:', ['Nhu cầu về vàng bạc, hương liệu và thị trường', 'Tìm nơi nghỉ dưỡng', 'Truyền bá văn hóa Hy Lạp', 'Chạy trốn dịch bệnh'], 0, 'Sản xuất phát triển đòi hỏi nguyên liệu, thị trường và vàng bạc; con đường buôn bán truyền thống lại bị cản trở.', 'Hiểu', 'Phát kiến địa lí'),
      m('Điều kiện kĩ thuật nào giúp việc đi biển xa thuận lợi hơn thời kì phát kiến địa lí?', ['La bàn và thuyền buồm có khả năng đi xa', 'Động cơ hơi nước', 'Máy bay', 'Tàu ngầm'], 0, 'La bàn, bản đồ và thuyền buồm cải tiến giúp xác định phương hướng và đi biển xa.', 'Hiểu', 'Phát kiến địa lí'),
      m('Nội dung cốt lõi của tư tưởng chủ nghĩa nhân văn trong Văn hóa Phục hưng là:', ['Đề cao giá trị con người, chống sự lệ thuộc vào giáo hội', 'Đề cao quyền lực của lãnh chúa', 'Phủ nhận mọi khoa học', 'Quay lại thời nguyên thủy'], 0, 'Phục hưng đề cao con người, tri thức, khoa học và phê phán sự kìm hãm của giáo hội.', 'Hiểu', 'Văn hóa Phục hưng'),
      m('Thành tựu nổi tiếng nào sau đây là của thời Văn hóa Phục hưng?', ['Bức họa Mô-na Li-da của Lê-ô-na đơ Vanh-xi', 'Kim tự tháp Ai Cập', 'Vạn Lí Trường Thành', 'Đền Pác-tê-nông'], 0, 'Mô-na Li-da là kiệt tác của Lê-ô-na đơ Vanh-xi, danh họa thời Phục hưng.', 'Hiểu', 'Văn hóa Phục hưng'),
      m('Hệ quả tiêu cực của các cuộc phát kiến địa lí đối với các dân tộc bản địa là:', ['Bị cướp bóc tài nguyên, bị bắt làm nô lệ và thành thuộc địa', 'Được hưởng nền khoa học tiên tiến ngay lập tức', 'Trở thành các quốc gia giàu mạnh', 'Không chịu ảnh hưởng gì'], 0, 'Phát kiến mở đầu cho quá trình thực dân, cướp bóc và buôn bán nô lệ.', 'Vận dụng', 'Phát kiến địa lí'),
      m('Vì sao nói chuyến đi của Ma-gien-lăng cung cấp bằng chứng thực tế về hình dạng Trái Đất?', ['Vì đoàn thuyền đi về hướng tây và cuối cùng quay trở lại điểm xuất phát', 'Vì họ chụp ảnh Trái Đất từ vũ trụ', 'Vì họ đo được đường kính Trái Đất bằng máy bay', 'Vì họ tìm thấy rìa của Trái Đất'], 0, 'Đi liên tục về một hướng mà vẫn trở lại chỗ cũ chứng tỏ Trái Đất hình cầu.', 'Vận dụng', 'Phát kiến địa lí'),
      m('Sự ra đời của thành thị trung đại có tác động nào tới xã hội phong kiến Tây Âu?', ['Thúc đẩy kinh tế hàng hóa, làm suy yếu chế độ lãnh địa', 'Làm lãnh địa mạnh hơn', 'Xóa bỏ hoàn toàn giai cấp nông nô ngay lập tức', 'Chấm dứt buôn bán'], 0, 'Thành thị thúc đẩy sản xuất hàng hóa, tạo tiền đề cho sự suy yếu của lãnh địa và sự hình thành tư sản.', 'Vận dụng', 'Tây Âu thời Trung đại'),
      m('Phát minh máy in (Gút-ten-béc, giữa thế kỉ XV) có ý nghĩa gì?', ['Giúp truyền bá tri thức và tư tưởng Phục hưng nhanh rộng hơn', 'Làm giảm nhu cầu đọc sách', 'Chỉ phục vụ giáo hội', 'Không ảnh hưởng đến xã hội'], 0, 'Máy in làm sách phổ biến, thúc đẩy truyền bá tri thức và tư tưởng mới.', 'Vận dụng', 'Văn hóa Phục hưng')
    ],
    tf: { prompt: 'Đọc thông tin: "Cuối thế kỉ XV, các nhà hàng hải châu Âu thực hiện nhiều chuyến đi biển xa để tìm đường sang phương Đông." Các ý sau Đúng hay Sai:', items: [
      { text: 'C. Cô-lôm-bô đến châu Mĩ năm 1492.', ans: true, exp: 'Đây là mốc phát kiến nổi tiếng.' },
      { text: 'Va-xcô đa Ga-ma đi vòng qua mũi Hảo Vọng để tới Ấn Độ.', ans: true, exp: 'Tuyến đường biển châu Âu – Ấn Độ được mở năm 1497–1498.' },
      { text: 'Chuyến đi của Ma-gien-lăng chứng minh Trái Đất hình khối cầu.', ans: true, exp: 'Đoàn thuyền đi vòng quanh Trái Đất rồi trở về châu Âu.' },
      { text: 'Phát kiến địa lí không liên quan gì đến sự phát triển của chủ nghĩa tư bản.', ans: false, exp: 'Phát kiến thúc đẩy buôn bán, tích lũy tư bản ban đầu.' } ], level: 'Hiểu', topic: 'Phát kiến địa lí' },
    sa: { prompt: 'Năm nào C. Cô-lôm-bô đến được châu Mĩ? (Điền 4 chữ số)', ans: '1492', alts: [], exp: 'Cô-lôm-bô đến vùng đảo Ca-ri-bê năm 1492.', level: 'Vận dụng', topic: 'Phát kiến địa lí' }
  };

  // ===== LỊCH SỬ 7 — Việt Nam từ thế kỉ X đến đầu thế kỉ XV =====
  D.examSets['exam-hist-7-2'] = {
    mcq: [
      m('Năm 1010, Lý Công Uẩn quyết định dời đô từ Hoa Lư về:', ['Thăng Long (Đại La)', 'Phú Xuân', 'Cổ Loa', 'Lam Kinh'], 0, 'Lý Thái Tổ ban Chiếu dời đô, chuyển kinh đô về Thăng Long.', 'Biết', 'Nhà Lý'),
      m('Chiến thắng Bạch Đằng năm 938 do ai lãnh đạo?', ['Ngô Quyền', 'Lê Hoàn', 'Trần Hưng Đạo', 'Lý Thường Kiệt'], 0, 'Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng, mở ra thời kì độc lập lâu dài.', 'Biết', 'Ngô – Đinh – Tiền Lê'),
      m('Nhà Trần được thành lập vào năm nào?', ['1009', '1226', '1400', '1428'], 1, 'Năm 1226, Trần Cảnh lên ngôi, nhà Trần thay nhà Lý.', 'Biết', 'Nhà Trần'),
      m('Bài thơ "Nam quốc sơn hà" gắn với cuộc kháng chiến chống quân xâm lược nào?', ['Chống Tống (1075–1077) của Lý Thường Kiệt', 'Chống Mông – Nguyên', 'Chống Minh', 'Chống Nam Hán'], 0, 'Bài thơ được coi là bản tuyên ngôn độc lập đầu tiên, vang lên trong kháng chiến chống Tống.', 'Biết', 'Nhà Lý'),
      m('Cuộc kháng chiến chống Mông – Nguyên thời Trần diễn ra mấy lần?', ['2 lần', '3 lần', '4 lần', '5 lần'], 1, 'Ba lần: 1258, 1285 và 1287–1288.', 'Biết', 'Nhà Trần'),
      m('Người lãnh đạo khởi nghĩa Lam Sơn (1418–1427) là:', ['Lê Lợi', 'Lý Bí', 'Trần Quốc Tuấn', 'Hồ Quý Ly'], 0, 'Lê Lợi cùng Nguyễn Trãi lãnh đạo khởi nghĩa Lam Sơn đánh đuổi quân Minh.', 'Biết', 'Khởi nghĩa Lam Sơn'),
      m('Quốc hiệu "Đại Việt" bắt đầu được sử dụng dưới triều đại nào (từ thời vua Lý Thánh Tông)?', ['Nhà Đinh', 'Nhà Tiền Lê', 'Nhà Lý', 'Nhà Hồ'], 2, 'Năm 1054, Lý Thánh Tông đổi quốc hiệu thành Đại Việt.', 'Hiểu', 'Nhà Lý'),
      m('Việc xây dựng Văn Miếu (1070) và lập Quốc Tử Giám (1076) thể hiện điều gì?', ['Nhà Lý coi trọng giáo dục, đào tạo nhân tài', 'Nhà Lý chủ trương đóng cửa đất nước', 'Nhà Lý chú trọng xây thành quân sự', 'Nhà Lý bãi bỏ chữ viết'], 0, 'Văn Miếu – Quốc Tử Giám là trường đại học đầu tiên của nước ta, thể hiện sự coi trọng nho học và nhân tài.', 'Hiểu', 'Nhà Lý'),
      m('Hội nghị Diên Hồng (1284) có ý nghĩa gì?', ['Thể hiện quyết tâm đoàn kết, nhất trí chống giặc của toàn dân', 'Bàn việc dời đô', 'Bàn việc nhường ngôi', 'Quyết định đầu hàng'], 0, 'Các bô lão đều hô "Đánh!", thể hiện ý chí đoàn kết, quyết chiến chống Mông – Nguyên.', 'Hiểu', 'Nhà Trần'),
      m('Chiến thắng nào năm 1288 đã kết thúc cuộc kháng chiến lần thứ ba chống Mông – Nguyên?', ['Bạch Đằng', 'Chi Lăng', 'Rạch Gầm – Xoài Mút', 'Đống Đa'], 0, 'Trần Hưng Đạo cho đóng cọc trên sông Bạch Đằng, nhấn chìm đoàn thuyền của Ô Mã Nhi.', 'Hiểu', 'Nhà Trần'),
      m('"Bình Ngô đại cáo" (1428) do ai soạn thảo, có nội dung chính là gì?', ['Nguyễn Trãi; tuyên cáo chiến thắng quân Minh và khẳng định độc lập dân tộc', 'Lý Thường Kiệt; kêu gọi chống Tống', 'Trần Quốc Tuấn; khích lệ tướng sĩ', 'Lê Thánh Tông; ban hành luật'], 0, 'Nguyễn Trãi viết Bình Ngô đại cáo thay lời Lê Lợi, được xem là bản tuyên ngôn độc lập thứ hai.', 'Hiểu', 'Khởi nghĩa Lam Sơn'),
      m('Bộ luật nổi tiếng thời Lê sơ (thời Lê Thánh Tông) là:', ['Hình thư', 'Hình luật', 'Quốc triều hình luật (Luật Hồng Đức)', 'Hoàng Việt luật lệ'], 2, 'Quốc triều hình luật, còn gọi là Luật Hồng Đức, được ban hành thời Lê Thánh Tông.', 'Hiểu', 'Lê sơ'),
      m('Trong kháng chiến chống Tống (1075–1077), việc Lý Thường Kiệt chủ động đem quân sang đất Tống phá các căn cứ quân sự thể hiện chiến lược gì?', ['Tiến công để phòng vệ', 'Cố thủ trong thành', 'Rút lui bảo toàn lực lượng', 'Cầu hòa ngay từ đầu'], 0, 'Chủ động "tiên phát chế nhân" nhằm phá thế chuẩn bị của địch, sau đó lập phòng tuyến Như Nguyệt.', 'Vận dụng', 'Nhà Lý'),
      m('Nhận xét nào đúng về nghệ thuật quân sự của nhà Trần trong kháng chiến chống Mông – Nguyên?', ['Lui binh để bảo toàn lực lượng, "vườn không nhà trống", rồi phản công đúng thời cơ', 'Luôn giữ thành đến cùng', 'Chỉ dựa vào quân đội nước ngoài', 'Không có kế hoạch gì'], 0, 'Nhà Trần dùng chiến thuật rút lui chiến lược, "vườn không nhà trống", sau đó phản công và quyết chiến.', 'Vận dụng', 'Nhà Trần'),
      m('Nguyên nhân thắng lợi quan trọng nhất của ba lần kháng chiến chống Mông – Nguyên là:', ['Tinh thần đoàn kết toàn dân, sự lãnh đạo tài giỏi của vua tôi nhà Trần', 'Do kẻ thù yếu hơn hẳn', 'Do thiên nhiên giúp hoàn toàn', 'Do liên minh với nước ngoài'], 0, 'Sức mạnh đoàn kết toàn dân và đường lối chiến lược đúng đắn của vua tôi nhà Trần là nhân tố quyết định.', 'Vận dụng', 'Nhà Trần'),
      m('Vì sao nhà Hồ (1400) nhanh chóng thất bại trước quân Minh (1407)?', ['Chưa quy tụ được sức mạnh đoàn kết toàn dân, không dựa vào dân', 'Vì thiếu vũ khí hoàn toàn', 'Vì không có đất nước', 'Vì vua nhà Hồ không có tài năng'], 0, 'Các cải cách của Hồ Quý Ly chưa đủ thu phục lòng dân; cuộc kháng chiến không dựa được vào sức dân.', 'Vận dụng', 'Nhà Hồ')
    ],
    tf: { prompt: 'Cho biết: "Năm 1428, Lê Lợi lên ngôi hoàng đế, lập ra nhà Lê (Lê sơ), đặt tên nước là Đại Việt, đóng đô ở Thăng Long." Các ý sau Đúng hay Sai:', items: [
      { text: 'Khởi nghĩa Lam Sơn kết thúc thắng lợi năm 1427.', ans: true, exp: 'Sau trận Chi Lăng – Xương Giang, Vương Thông xin hàng, cuộc khởi nghĩa thắng lợi (1427).' },
      { text: 'Nguyễn Trãi là người soạn Bình Ngô đại cáo.', ans: true, exp: 'Bình Ngô đại cáo do Nguyễn Trãi soạn (1428).' },
      { text: 'Nhà Lê sơ đóng đô ở Phú Xuân.', ans: false, exp: 'Nhà Lê sơ đóng đô ở Thăng Long (Đông Kinh).' },
      { text: 'Nhà Lê sơ phát triển cực thịnh dưới thời vua Lê Thánh Tông (1460–1497).', ans: true, exp: 'Đây là thời kì thịnh trị nhất của nhà Lê sơ.' } ], level: 'Hiểu', topic: 'Lê sơ' },
    sa: { prompt: 'Cuộc kháng chiến chống Mông – Nguyên lần thứ ba kết thúc thắng lợi vào năm nào? (Điền 4 chữ số)', ans: '1288', alts: [], exp: 'Chiến thắng Bạch Đằng năm 1288 kết thúc lần kháng chiến thứ ba.', level: 'Vận dụng', topic: 'Nhà Trần' }
  };

  // ===== ĐỊA LÍ 7 — Thiên nhiên và dân cư, xã hội châu Âu – châu Á =====
  D.examSets['exam-geo-7-1'] = {
    mcq: [
      m('Châu lục có diện tích lớn nhất thế giới là:', ['Châu Phi', 'Châu Mĩ', 'Châu Á', 'Châu Âu'], 2, 'Châu Á rộng nhất (khoảng 44 triệu km² kể cả các đảo).', 'Biết', 'Châu Á'),
      m('Dãy núi nào là ranh giới tự nhiên giữa châu Á và châu Âu ở phía đông?', ['An-pơ', 'U-ran', 'Cap-ca', 'Hi-ma-lay-a'], 1, 'Dãy U-ran là ranh giới tự nhiên phía đông giữa châu Âu và châu Á.', 'Biết', 'Châu Âu'),
      m('Đỉnh núi cao nhất thế giới nằm ở dãy núi nào?', ['An-đét', 'An-pơ', 'Hi-ma-lay-a', 'U-ran'], 2, 'Đỉnh Ê-vơ-rét thuộc dãy Hi-ma-lay-a, là đỉnh cao nhất thế giới.', 'Biết', 'Châu Á'),
      m('Sông Trường Giang và Hoàng Hà chảy ở khu vực nào của châu Á?', ['Tây Á', 'Đông Á', 'Nam Á', 'Bắc Á'], 1, 'Cả hai sông đều bắt nguồn từ cao nguyên Thanh Tạng và chảy ở Đông Á (Trung Quốc).', 'Biết', 'Châu Á'),
      m('Phần lớn dân cư châu Âu thuộc chủng tộc nào?', ['Ơ-rô-pê-ô-it', 'Môn-gô-lô-it', 'Nê-grô-it', 'Ô-xtra-lô-it'], 0, 'Dân cư châu Âu chủ yếu thuộc chủng tộc Ơ-rô-pê-ô-it (người da trắng).', 'Biết', 'Dân cư châu Âu'),
      m('Châu Á có số dân như thế nào so với các châu lục khác?', ['Đông nhất thế giới', 'Ít nhất thế giới', 'Đứng thứ ba', 'Bằng châu Âu'], 0, 'Châu Á là châu lục đông dân nhất thế giới.', 'Biết', 'Dân cư châu Á'),
      m('Khí hậu gió mùa ở châu Á phân bố chủ yếu ở các khu vực nào?', ['Bắc Á', 'Đông Á, Nam Á và Đông Nam Á', 'Tây Á và Trung Á', 'Toàn bộ châu Á'], 1, 'Khí hậu gió mùa phổ biến ở Đông Á, Nam Á và Đông Nam Á.', 'Hiểu', 'Khí hậu châu Á'),
      m('Tây Âu có khí hậu ôn đới hải dương chủ yếu do ảnh hưởng của:', ['Dòng biển nóng Bắc Đại Tây Dương và gió Tây ôn đới', 'Dãy U-ran', 'Sa mạc Xa-ha-ra', 'Địa hình cao nguyên'], 0, 'Dòng biển nóng Bắc Đại Tây Dương và gió Tây ôn đới mang hơi ẩm, làm khí hậu ôn hòa, mưa quanh năm.', 'Hiểu', 'Khí hậu châu Âu'),
      m('Vì sao Tây Á và Trung Á có nhiều hoang mạc?', ['Nằm sâu trong nội địa, ít chịu ảnh hưởng của biển, lượng mưa thấp', 'Nằm sát biển', 'Có nhiều sông lớn', 'Có nhiều rừng rậm'], 0, 'Vị trí xa biển, khí hậu lục địa khô hạn dẫn đến hình thành hoang mạc.', 'Hiểu', 'Khí hậu châu Á'),
      m('Dạng địa hình nào chiếm diện tích lớn nhất ở châu Âu?', ['Đồng bằng', 'Núi cao', 'Sơn nguyên', 'Hoang mạc'], 0, 'Địa hình châu Âu chủ yếu là đồng bằng, tập trung nhiều ở Đông Âu và Bắc Âu; núi cao phân bố ở phía nam.', 'Hiểu', 'Địa hình châu Âu'),
      m('Các tôn giáo lớn như Phật giáo, Ấn Độ giáo ra đời ở khu vực nào?', ['Châu Á', 'Châu Âu', 'Châu Phi', 'Châu Mĩ'], 0, 'Phật giáo, Ấn Độ giáo (cùng Hồi giáo, Ki-tô giáo) đều ra đời ở châu Á.', 'Hiểu', 'Dân cư châu Á'),
      m('Liên minh châu Âu (EU) được thành lập nhằm mục đích chủ yếu nào?', ['Hợp tác phát triển kinh tế – chính trị giữa các nước thành viên', 'Chia lại lãnh thổ', 'Chuẩn bị chiến tranh', 'Ngăn việc buôn bán'], 0, 'EU là tổ chức liên kết khu vực về kinh tế – chính trị với nhiều chính sách chung.', 'Hiểu', 'Kinh tế – xã hội châu Âu'),
      m('Nhận định nào đúng về mối quan hệ giữa khí hậu và sông ngòi ở châu Á?', ['Gió mùa mang mưa làm sông ở Đông Á, Nam Á, Đông Nam Á nhiều nước, có lũ theo mùa', 'Mọi sông đều không có nước', 'Sông chỉ chảy ở Bắc Á', 'Sông không liên quan đến khí hậu'], 0, 'Mưa gió mùa là nguồn cung cấp nước, chế độ nước sông có lũ theo mùa.', 'Vận dụng', 'Khí hậu châu Á'),
      m('Dựa vào đặc điểm tự nhiên, vì sao đồng bằng Tây Âu và Đông Âu thuận lợi cho nông nghiệp?', ['Địa hình bằng phẳng, đất đai màu mỡ, nguồn nước dồi dào', 'Khí hậu hoang mạc', 'Địa hình núi cao hiểm trở', 'Không có sông ngòi'], 0, 'Đồng bằng rộng, đất tốt, nhiều sông là điều kiện thuận lợi cho trồng trọt, chăn nuôi.', 'Vận dụng', 'Địa hình châu Âu'),
      m('Dân cư châu Á tập trung đông nhất ở khu vực nào?', ['Các đồng bằng châu thổ và ven biển Đông Á, Nam Á, Đông Nam Á', 'Hoang mạc Tây Á', 'Cao nguyên Tây Tạng', 'Vùng Bắc Á lạnh giá'], 0, 'Nơi có điều kiện tự nhiên thuận lợi (đất phù sa, nước, khí hậu gió mùa) có dân cư tập trung đông.', 'Vận dụng', 'Dân cư châu Á'),
      m('Vì sao châu Âu có tỉ lệ dân thành thị cao?', ['Công nghiệp và dịch vụ phát triển sớm, quá trình đô thị hóa diễn ra mạnh', 'Nông nghiệp là ngành duy nhất', 'Không có thành phố', 'Dân cư sống du mục'], 0, 'Kinh tế công nghiệp – dịch vụ phát triển sớm kéo theo đô thị hóa cao.', 'Vận dụng', 'Dân cư châu Âu')
    ],
    tf: { prompt: 'Cho biết: "Châu Á là châu lục có địa hình đa dạng, có nhiều dãy núi cao, sơn nguyên đồ sộ và đồng bằng rộng lớn." Các ý sau Đúng hay Sai:', items: [
      { text: 'Dãy Hi-ma-lay-a nằm ở châu Á.', ans: true, exp: 'Hi-ma-lay-a là dãy núi cao nhất thế giới, thuộc châu Á.' },
      { text: 'Phần lớn diện tích châu Á là địa hình đồng bằng thấp.', ans: false, exp: 'Châu Á có nhiều núi và sơn nguyên, chiếm phần lớn diện tích.' },
      { text: 'Châu Á có khí hậu đa dạng: gió mùa, lục địa, hoang mạc...', ans: true, exp: 'Do lãnh thổ rộng và địa hình phức tạp nên khí hậu rất đa dạng.' },
      { text: 'Dãy U-ran nằm giữa châu Á và châu Phi.', ans: false, exp: 'U-ran là ranh giới giữa châu Á và châu Âu.' } ], level: 'Hiểu', topic: 'Châu Á' },
    sa: { prompt: 'Dãy núi nào là ranh giới tự nhiên giữa châu Âu và châu Á? (Điền một tên)', ans: 'u-ran', alts: ['u ran', 'uran', 'dãy u-ran', 'dãy u ran', 'ural', 'dãy ural'], exp: 'Dãy U-ran là ranh giới tự nhiên giữa hai châu lục.', level: 'Vận dụng', topic: 'Châu Âu' }
  };
})();
