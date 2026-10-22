# Tính năng

## Đã hoàn thành (chạy được ngay, không cần thiết lập)
- Trang chủ, thông báo lịch kiểm tra, chọn năm học (mặc định 2026-2027)
- 11 đề kiểm tra: đếm giờ, bảng câu hỏi, đánh dấu xem lại, tự lưu nháp, xáo phương án, chấm tự động 10 điểm, xem lại kèm giải thích, in đề A4 (có/không đáp án)
- Ôn tập 58 thẻ kiến thức khối 6–9 (lọc, tìm kiếm, tự kiểm tra)
- Quả địa cầu quay/kéo, Atlas Việt Nam (sông, núi, cao nguyên, thành phố, biên giới, điểm cực, Hoàng Sa, Trường Sa, thu phóng)
- Trống đồng Đông Sơn và giải thích các vành hoa văn
- Tuyến thời gian Việt Nam/Thế giới; 6 sơ đồ tư duy mở/thu, kéo, phóng to
- Bảng điểm cục bộ, xuất CSV, nhập CSV/JSON có xem trước và xác nhận
- Công cụ giáo viên (thống kê đáp án, in đề + đáp án), sao lưu/khôi phục JSON
- Tra cứu từ khóa trong kho kiến thức; chạy ngoại tuyến (service worker); thích ứng điện thoại; giảm chuyển động; liên kết bỏ qua; tiêu điểm bàn phím

## Phụ thuộc thiết lập bên ngoài (CHƯA có)
Tài khoản đăng nhập, đồng bộ nhiều máy/bảng điểm chung, trợ lý AI, khóa/mở đề theo giờ có kiểm soát, chống gian lận mạnh. Xem `BACKEND-AI.md`.

## Giám sát rời trang khi làm bài
Khi học sinh chuyển tab/ứng dụng, trang hiện cảnh báo toàn màn hình, ghi số lần và số giây rời trang vào kết quả (hiện ở Bảng điểm và cột `leaves`, `awaySecs` của CSV). Hệ thống KHÔNG tự trừ điểm; giáo viên quyết định. Đây là biện pháp răn đe, không ngăn được gian lận hoàn toàn (dùng thiết bị thứ hai, sửa mã trình duyệt). Dữ liệu chỉ nằm trên máy học sinh cho đến khi xuất/nhập file.

## Chống gian lận (cập nhật)
- Lần rời trang đầu tiên chỉ nhắc nhở; từ lần 2 được tính. Gợi ý: 1 lần = Nhắc nhở; từ 2 lần = Giáo viên xem xét. Điểm gợi ý sau trừ (mặc định 0,25/lần bị tính) chỉ là gợi ý, điểm gốc giữ nguyên.
- Tự nộp khi đạt ngưỡng (mặc định tắt, ngưỡng 3 lần) — bật/tắt theo từng đề trong trang Giáo viên (thử) hoặc `config.js` (áp dụng chung).
- Bắt buộc toàn màn hình khi làm bài (nếu thiết bị hỗ trợ); thoát ra tính một lần rời trang.
- Chặn chuột phải, sao chép, cắt, dán, bôi chọn nội dung câu hỏi (chỉ cản trở, không tuyệt đối).
- Xáo thứ tự câu hỏi và phương án mỗi lượt làm (đề liên môn lớp 8 giữ thứ tự gốc).
- Họ tên + lớp bắt buộc; lớp được chuẩn hoá (6.1, 6/1, 6-1, 6A1 → 6.1; chỉ nhận khối 6–9).
- Gửi điểm về Google Sheet, mỗi lớp một trang tính trong một tệp: xem `GOOGLE-SHEET.md` (cần thầy cô thiết lập; chưa thử trên Google thật).
