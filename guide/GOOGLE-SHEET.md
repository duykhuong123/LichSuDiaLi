# Hướng dẫn cài Google Sheet: tổng hợp điểm + đăng nhập giáo viên

Làm **một lần duy nhất**, khoảng 15 phút, trên máy tính. Sau đó:
- Điểm học sinh tự về Google Sheet, **mỗi lớp một trang tính** (6.1, 7.2…), cùng một tệp.
- Giáo viên đăng nhập khu vực xem/in đề bằng **mã 6 số gửi qua gmail** (hiệu lực 10 phút), có thể **ghi nhớ thiết bị 30 ngày**.

Bạn cần: tài khoản Google (gmail) của người quản trị, tệp `Code.gs` (thư mục `apps-script/`), tệp `GiaoVien-nhap-vao-Sheet.csv`.

---

## Phần A. Tạo Google Sheet

1. Vào **sheets.google.com**, đăng nhập gmail quản trị.
2. Bấm **Trống** (dấu +) để tạo bảng tính mới.
3. Bấm vào tên ở góc trên bên trái, đổi thành: `Bảng điểm Sử-Địa 2026-2027`.

> Đây là **một tệp duy nhất** cho cả tổ. Các trang tính lớp sẽ tự sinh ra ở phần G.

## Phần B. Tạo trang tính GiaoVien (danh sách giáo viên được phép)

1. Dưới cùng bên trái bấm dấu **+** để thêm trang tính mới.
2. Bấm chuột phải vào tên trang tính mới → **Đổi tên** → gõ đúng: `GiaoVien` (viết hoa G và V, không dấu, không cách).
3. Ô **A1** gõ 4 tiêu đề, mỗi tiêu đề một cột:

| A | B | C | D |
|---|---|---|---|
| Họ tên | Gmail | Vai trò (TT/TP) | Tạm khóa (x) |

4. Mở tệp `GiaoVien-nhap-vao-Sheet.csv`, chọn các dòng giáo viên (từ dòng 2), sao chép, dán vào ô **A2**.
   Hoặc gõ tay, ví dụ (dữ liệu giả):

| Họ tên | Gmail | Vai trò (TT/TP) | Tạm khóa (x) |
|---|---|---|---|
| Cô Thử Một | thu1@gmail.com | TT | |
| Thầy Thử Hai | thu2@gmail.com | TP | |
| Cô Thử Ba | thu3@gmail.com | | |
| Thầy Đã Nghỉ | nghi@gmail.com | | x |

Quy ước:
- **Gmail** phải đúng địa chỉ mà giáo viên mở được hộp thư (viết hoa/thường không quan trọng).
- **Vai trò:** `TT` tổ trưởng, `TP` tổ phó, để trống nếu là giáo viên.
- **Tạm khóa:** gõ `x` để khóa tạm một người; xóa `x` để mở lại.
- Muốn **gỡ quyền hẳn:** xóa cả dòng. Có hiệu lực ngay, kể cả người đang đăng nhập và các thiết bị đã được nhớ.

> Trang tính này **riêng tư**: chỉ chia sẻ cả tệp Sheet cho người thật sự cần xem. Gmail giáo viên không nằm trong mã trang trên GitHub.

## Phần C. Dán mã Apps Script

1. Trong Google Sheet bấm **Tiện ích mở rộng → Apps Script**. Một tab mới mở ra.
2. Ở cột bên trái bấm tệp **Code.gs**. Chọn hết nội dung có sẵn (Ctrl+A) rồi xóa.
3. Mở `apps-script/Code.gs` (bằng Notepad), chọn hết (Ctrl+A), sao chép (Ctrl+C), dán vào khung Apps Script (Ctrl+V).
4. Bấm biểu tượng **đĩa mềm (Lưu dự án)**. Nếu được hỏi tên dự án, đặt `Cong hoc tap Su Dia`.

## Phần D. Triển khai thành Web App

1. Bấm nút xanh **Triển khai → Tùy chọn triển khai mới**.
2. Bấm biểu tượng **bánh răng** cạnh "Chọn loại" → chọn **Ứng dụng web**.
3. Điền:
   - **Thực thi với tư cách:** `Tôi` (gmail của bạn)
   - **Ai có quyền truy cập:** `Bất kỳ ai`
4. Bấm **Triển khai**.
5. Google hỏi cấp quyền (xem, ghi bảng tính; **gửi email**): bấm **Cấp quyền truy cập** → chọn tài khoản của bạn.
   Nếu hiện "Google chưa xác minh ứng dụng này": bấm **Nâng cao** → **Đi tới … (không an toàn)** → **Cho phép**. Đây là mã của chính bạn.
6. Sao chép **URL ứng dụng web** dạng `https://script.google.com/macros/s/AKfycb.../exec` và dán tạm vào Notepad.

> Nếu không thấy hộp thoại cấp quyền gửi email: trong Apps Script, chọn hàm `doGet` ở ô trên cùng → bấm **Chạy** → cấp quyền như bước 5, rồi triển khai lại.

## Phần E. Điền địa chỉ vào trang web

1. Mở `docs/assets/js/config.js` bằng Notepad.
2. Tìm dòng `syncUrl: ''` và dán URL vào giữa hai dấu nháy:

```js
syncUrl: 'https://script.google.com/macros/s/AKfycb.../exec',
```

3. Lưu tệp.
4. (Tùy chọn) Chống gửi điểm bừa: đặt cùng một chuỗi vào `SYNC_KEY` trong Code.gs và `syncKey` trong config.js. Đây chỉ là rào nhẹ, không phải bí mật (học sinh xem được config.js).

## Phần F. Đưa lên GitHub

1. Vào kho `duykhuong123/LichSuDiaLi` trên GitHub.
2. **Add file → Upload files**, kéo thư mục `docs` mới vào (hoặc riêng tệp đã đổi), rồi **Commit changes**.
3. Đợi 1–2 phút, mở trang và bấm **Ctrl+F5**.
4. **KHÔNG** đưa tệp `GiaoVien-nhap-vao-Sheet.csv` lên GitHub.

## Phần G. Thử nghiệm (làm đủ 3 việc)

**1) Đăng nhập giáo viên**
1. Mở trang → **Giáo viên** → nhập gmail của một giáo viên có trong danh sách → **Gửi mã vào gmail**.
2. Mở hộp thư (xem cả Spam), lấy mã 6 số, nhập vào → **Đăng nhập**.
3. Vào được khu vực giáo viên, thấy nút **Xem đề + đáp án** và **In đề** là xong.
4. Thử thêm: tích **Ghi nhớ thiết bị này 30 ngày**, đóng trình duyệt, mở lại trang → tự vào.

**2) Gmail lạ không vào được**
Nhập một gmail không có trong danh sách → trang vẫn báo "Nếu gmail có trong danh sách… đã gửi" (cố ý, để không lộ danh sách) nhưng **không có thư nào** được gửi.

**3) Điểm vào đúng lớp**
Tự làm một đề với tên `Thử Nghiệm`, lớp `6/1`. Trong Google Sheet phải xuất hiện trang tính **6.1** với một dòng điểm. Sau đó xóa dòng thử.

Ví dụ trang tính lớp (dữ liệu giả):

| Thời gian nộp | Họ và tên | Lớp | Mã đề | Tên đề | Điểm | Số lần rời trang | Giây rời trang | Thời gian làm (giây) | Mã lượt |
|---|---|---|---|---|---|---|---|---|---|
| 20/10/2026 18:05 | Nguyễn Văn A | 8.1 | exam-hist-8-1 | KTTX_L1 - Lịch sử 8 | 8.5 | 0 | 0 | 612 | a1b2c3 |
| 20/10/2026 18:07 | Trần Thị B | 8.1 | exam-hist-8-1 | KTTX_L1 - Lịch sử 8 | 7.0 | 2 | 25 | 840 | d4e5f6 |

---

## Đề do giáo viên tải lên (tự tạo trang tính "DeGiaoVien")
Khi giáo viên đăng đề đầu tiên, máy chủ tự tạo trang tính **DeGiaoVien** (mỗi đề một dòng; cột JSON là nội dung đề — đừng sửa tay). Chủ Sheet xem được; chia sẻ Sheet cẩn thận. Giới hạn: mỗi giáo viên 60 đề, tổng 400 đề, mỗi đề ≤ 45.000 ký tự. **Nếu bạn đã triển khai bản cũ của `Code.gs`, hãy dán bản mới rồi triển khai lại bằng Phiên bản mới** (xem mục "Khi sửa Code.gs"). Cách dùng: `HUONG-DAN-TAI-DE.md`.

## Cách gộp lớp
Học sinh nhập "6.1", "6/1", "6-1", "6 1", "6A1", "Lớp 6.1" đều thành **6.1** (cả trên trang web lẫn Apps Script). Họ tên được chuẩn hóa khoảng trắng và viết hoa chữ đầu. Lớp ngoài khối 6–9 bị từ chối và học sinh được nhắc nhập lại.

## Quy tắc đăng nhập giáo viên (tóm tắt)
- Mã 6 số dùng một lần, hết hạn sau **10 phút**; nhập sai không làm mã sống lâu hơn.
- Sai quá **5 lần** phải xin mã mới. Mỗi gmail 1 thư mỗi 60 giây; tối đa 80 thư mỗi ngày (Gmail miễn phí khoảng 100/ngày).
- Phiên đăng nhập 6 giờ. Thông báo giống nhau dù gmail có trong danh sách hay không.
- **Ghi nhớ thiết bị** (tùy chọn, mặc định không chọn): 30 ngày, tối đa 4 thiết bị mỗi người, máy chủ chỉ lưu bản băm. Bấm "Đăng xuất và quên thiết bị này" hoặc xóa dòng trong GiaoVien là thu hồi. Chỉ chọn trên máy/điện thoại cá nhân.
- Mất điện thoại: xóa dòng của giáo viên đó trong GiaoVien (rồi thêm lại) để thu hồi mọi thiết bị.

## Khi sửa Code.gs sau này
**Triển khai → Quản lý triển khai → biểu tượng bút chì → Phiên bản: Mới → Triển khai.** URL giữ nguyên, không phải sửa `config.js`.

## Xử lý lỗi thường gặp
| Hiện tượng | Cách xử lý |
|---|---|
| Nút "Gửi mã vào gmail" bị mờ / báo chưa cấu hình | `syncUrl` trong config.js còn trống hoặc GitHub chưa cập nhật. Điền lại, đưa lên GitHub, Ctrl+F5. |
| Không nhận được thư mã | Xem mục Spam; đợi 1 phút rồi Gửi lại; kiểm tra gmail trong GiaoVien có đúng, không thừa khoảng trắng, dòng không có `x`. |
| Báo "Lỗi"/không kết nối | Kiểm tra "Ai có quyền truy cập" là *Bất kỳ ai*; đã triển khai **phiên bản mới** sau khi sửa mã. |
| Điểm không vào Sheet | Học sinh phải ghi lớp 6–9 (vd 6.1). Trang báo "CHƯA gửi" thì bấm Gửi lại ở mục Bảng điểm. |
| Hết quota gửi thư trong ngày | Đợi sang ngày hôm sau; giáo viên đã "ghi nhớ thiết bị" vẫn vào bình thường. |

## Lưu ý quan trọng
- Mỗi lượt làm bài là một dòng; có "Mã lượt" nên gửi lại không bị trùng.
- Trang chỉ báo "Đã gửi" khi Apps Script trả `ok:true`; lỗi/mất mạng sẽ báo "CHƯA gửi" và có nút Gửi lại.
- Học sinh có thể khai sai tên/lớp hoặc gửi dữ liệu giả bằng công cụ lập trình; điểm do trình duyệt tính. Dùng để theo dõi, thầy cô đối chiếu khi cần.
- Chủ Sheet xem được tất cả. Đây là dữ liệu cá nhân học sinh, tuân thủ quy định của nhà trường.
- Đề thi nằm trong mã trang tĩnh, nên đăng nhập giáo viên chỉ chặn học sinh thông thường, không phải bảo mật tuyệt đối.
- **Chưa kiểm thử trên Google thật:** gửi thư thật (vào hộp thư hay Spam), CORS khi gọi từ GitHub Pages. Đã kiểm thử logic bằng bản giả lập (xem `TEST-REPORT.md`).
