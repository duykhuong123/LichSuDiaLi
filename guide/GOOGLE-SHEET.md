# Tổng hợp điểm vào Google Sheet (mỗi lớp một trang tính)

1. Tạo một Google Sheet mới (một tệp duy nhất cho cả trường/tổ), ví dụ "Bảng điểm Sử-Địa 2026-2027".
2. Tiện ích mở rộng → Apps Script → dán toàn bộ `apps-script/Code.gs` → Lưu.
3. Triển khai → Triển khai mới → loại *Ứng dụng web* → Thực thi với: **Tôi**; Ai có quyền truy cập: **Bất kỳ ai** → Triển khai → cấp quyền → sao chép URL kết thúc bằng `/exec`.
4. Mở `docs/assets/js/config.js`, dán URL vào `syncUrl`. (Tuỳ chọn: đặt cùng một chuỗi vào `SYNC_KEY` trong Code.gs và `syncKey` trong config.js.)
5. Đẩy lại lên GitHub, đổi `VERSION` trong `docs/sw.js`.
6. Thử: tự làm một đề với tên "Thử Nghiệm", lớp "6/1" → Sheet có trang "6.1" và một dòng điểm.

## Cách gộp lớp
Học sinh nhập "6.1", "6/1", "6-1", "6 1", "6A1", "Lớp 6.1" đều thành **6.1** (cả trên trang web lẫn Apps Script). Họ tên được chuẩn hoá khoảng trắng và viết hoa chữ đầu. Lớp ngoài khối 6–9 bị từ chối và học sinh được nhắc nhập lại.

## Lưu ý
- Mỗi lượt làm bài là một dòng; có "Mã lượt" nên gửi lại không bị trùng.
- Trang chỉ báo "Đã gửi" khi Apps Script trả `ok:true`; nếu lỗi/mất mạng sẽ báo "CHƯA gửi" và có nút Gửi lại (Bảng điểm cũng có nút gửi lại hàng loạt).
- Không có đăng nhập thật: học sinh có thể khai sai tên/lớp hoặc gửi dữ liệu giả bằng công cụ lập trình. Điểm do trình duyệt tính. Dùng để theo dõi, thầy cô đối chiếu khi cần.
- Chủ Sheet có quyền xem tất cả; chỉ chia sẻ Sheet cho giáo viên. Đây là dữ liệu cá nhân học sinh, nên tuân thủ quy định của nhà trường.
