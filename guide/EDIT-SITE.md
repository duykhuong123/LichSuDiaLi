# Chỉnh sửa trang dễ dàng

## Cách 1 — ngay trên trang (khuyên dùng)
1. Mở trang → **Giáo viên** → đăng nhập bằng mã gửi qua gmail (xem HUONG-DAN-GIAO-VIEN.md).
2. Kéo xuống **Chỉnh sửa thông tin trang**: sửa Hiệu trưởng (để trống = ẩn), Phụ trách kỹ thuật, điện thoại, địa chỉ; thêm/xoá/sắp xếp giáo viên và chọn vai trò TT (tổ trưởng) / TP (tổ phó); sửa lịch kiểm tra.
3. Bấm **Xem thử** (chỉ thấy trên máy bạn), rồi **Tải tệp site.js**.
4. Trên GitHub: kho → `docs/assets/js/data` → Add file → Upload files → kéo `site.js` vào (thay tệp cũ) → Commit.
5. Sau 1–2 phút tải lại trang (Ctrl+F5). Trên máy bạn bấm **Bỏ bản xem thử**.

## Thêm / bỏ quyền đăng nhập của giáo viên
Quyền đăng nhập nằm trong trang tính **GiaoVien** của Google Sheet (không phải trong `site.js`): thêm dòng = có quyền, xoá dòng = mất quyền ngay. Danh sách tên hiển thị ở chân trang là việc riêng, sửa ở mục *Chỉnh sửa thông tin trang*.

## Cách 2 — sửa trực tiếp trên GitHub
Mở `docs/assets/js/data/site.js` → biểu tượng bút chì → sửa `principal`, `tech`, `teachers`….
Đề, thẻ ôn tập, sơ đồ: các tệp trong `docs/assets/js/data/` (xem README).

## Giới hạn
Đăng nhập giáo viên là rào chắn giao diện để học sinh thông thường không xem/in đề; không giữ bí mật tuyệt đối vì đề nằm trong mã nguồn của trang tĩnh (người rành kĩ thuật vẫn đọc được). Đề thi chính thức nên giữ ngoài trang.
