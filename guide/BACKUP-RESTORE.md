# Sao lưu, khôi phục, cập nhật không mất dữ liệu

Dữ liệu người dùng (kết quả làm bài, bài làm dở, năm học đã chọn) nằm trong `localStorage` của từng trình duyệt (khóa bắt đầu bằng `dd:`).

## Sao lưu
Quản trị → **Tải bản sao lưu** → file `sao-luu-dakdoa-AAAA-MM-DD.json`. Nên làm hằng tuần và trước khi xóa dữ liệu trình duyệt.

## Khôi phục
Quản trị → **Chọn file** → xem trước → chọn **Gộp** (giữ dữ liệu hiện có, bỏ dòng trùng) hoặc **Thay thế** (có hộp xác nhận). Không bao giờ tự ghi đè.

## Gộp điểm từ nhiều máy
Mỗi máy: Bảng điểm → Xuất CSV. Trên máy giáo viên: Bảng điểm → Nhập CSV/JSON → xem trước, dòng lỗi bị bỏ qua → Xác nhận.

## Cập nhật trang mà không mất điểm
Cập nhật chỉ thay mã nguồn/đề trên GitHub; dữ liệu học sinh nằm ở trình duyệt nên không bị ảnh hưởng, miễn là địa chỉ trang (tên miền + đường dẫn kho) không đổi. Đổi địa chỉ = trình duyệt coi là trang mới → dữ liệu cũ không thấy; hãy sao lưu trước. Sau khi cập nhật, đổi `VERSION` trong `docs/sw.js` để thiết bị tải bản mới.
