# Báo cáo kiểm thử

Ngày chạy: 22-10-2026. Môi trường: Chromium (Playwright) trong máy chủ ảo Linux, trang phục vụ qua `python3 -m http.server`. Mã kiểm thử: `tests/functional.mjs`, `tests/environment.mjs`, `tools/validate-data.mjs`.

## ĐẠT (PASS) — đã chạy thật
- Nộp bài ra điểm — 2,5 / 10
- Có giải thích
- Bảng điểm có 1 dòng
- Xuất CSV
- Còn bài làm dở sau tải lại
- Giữ đáp án đã chọn
- Xem trước báo 1 hợp lệ, 2 lỗi
- Chưa ghi trước khi xác nhận
- Sau xác nhận có 2 dòng
- Sao lưu JSON hợp lệ
- AI nói rõ chưa bật
- Tra cứu hoạt động
- Đề exam-hist-6-1 mở được 18 câu
- Đề exam-geo-6-1 mở được 18 câu
- Đề exam-hist-7-1 mở được 18 câu
- Đề exam-hist-7-2 mở được 18 câu
- Đề exam-geo-7-1 mở được 18 câu
- Đề exam-hist-8-1 mở được 18 câu
- Đề exam-geo-8-1 mở được 18 câu
- Đề exam-int-8-gk mở được 18 câu
- Đề exam-hist-9-1 mở được 18 câu
- Đề exam-hist-9-2 mở được 18 câu
- Đề exam-geo-9-1 mở được 18 câu
- Không có lỗi console/JS
- Chấm đúng hết = 10 điểm — 10
- Bỏ trống = 0 điểm — 0
- Tên chứa HTML không thực thi (XSS)
- Service worker đã đăng ký
- Mở lại khi ngoại tuyến
- Mở trực tiếp file:// được
- Không tải tài nguyên bên ngoài (CDN/font)
- Di động 375px không tràn ngang: home — dư 0px
- Di động 375px không tràn ngang: exam/exam-hist-8-1 — dư 0px
- Di động 375px không tràn ngang: atlas — dư 0px
- Di động 375px không tràn ngang: timeline — dư 0px
- Di động 375px không tràn ngang: mindmaps — dư 0px
- Giảm chuyển động: nút Tự quay không bật
- Phím Tab đầu tiên tới "Bỏ qua đến nội dung"
- Kiểm tra cấu trúc dữ liệu: 58 thẻ, 11 đề (mỗi đề đúng 16 TN + 4 ý Đ/S + 1 trả lời ngắn, 4 phương án khác nhau, có giải thích), 37 mốc thời gian, 6 sơ đồ tư duy — không lỗi (`validate-data.mjs`).

## KHÔNG ĐẠT (FAIL)
- Không có trong lần chạy cuối.

Hai lỗi đã gặp và sửa trong quá trình thử (xem BUGS.md): atlas không vẽ do đảo dạng điểm; phím Tab đầu tiên không tới liên kết bỏ qua; sơ đồ tư duy tràn ngang trên điện thoại.

## CHƯA KIỂM THỬ
- Triển khai thật trên GitHub Pages (chưa đẩy lên kho nào).
- Trình duyệt Safari, Firefox, Edge; iPhone/iPad; điện thoại Android thật; thao tác cảm ứng kéo địa cầu/bản đồ trên thiết bị thật.
- In giấy A4 / xuất PDF của đề và bảng điểm (hàm in có viết nhưng chưa xem kết quả in).
- Dùng bàn phím trọn vẹn trong phòng thi, trình đọc màn hình (NVDA, VoiceOver), kiểm tra tương phản bằng công cụ chuyên dụng.
- Cài thành ứng dụng (PWA) trên điện thoại; cập nhật phiên bản service worker.
- Hiệu năng máy yếu; tải đồng thời nhiều học sinh (không áp dụng: không có máy chủ).
- Độ chính xác học thuật của đề, đáp án, giải thích và thẻ kiến thức: CHƯA được giáo viên rà soát.
- Độ chính xác địa lí của đường nét bản đồ so với nguồn chuẩn (dữ liệu số hóa thủ công).
- Đăng nhập, đồng bộ, AI thật: không có nên không thể kiểm thử.

## Bổ sung: giám sát rời trang (tests/antiCheat.mjs) — 7/7 ĐẠT
Cảnh báo khi quay lại trang, đếm cả chuyển tab lẫn chuyển cửa sổ, ghi vào kết quả, hiện ở bảng điểm và CSV, không kích hoạt ngoài phòng thi, không lỗi JS. Mô phỏng bằng sự kiện trình duyệt; CHƯA thử trên điện thoại thật (khóa màn hình, kéo thông báo, chia đôi màn hình).

## Bổ sung: chống gian lận nâng cao, gộp lớp, gửi điểm (tests/policy.mjs) — 42/42 ĐẠT
Đã chạy thật: nhắc nhở lần đầu (không tính) / từ lần 2 được tính; tự nộp khi đạt ngưỡng; bật/thoát toàn màn hình (Chromium); chặn chuột phải/sao chép/bôi chọn; xáo thứ tự câu hỏi (đề liên môn lớp 8 giữ thứ tự gốc) và chấm đúng 8/10 khi trả lời đúng cả 16 câu dù đã xáo; chuẩn hoá lớp (6.1 = 6/1 = 6-1 = 6A1 = "Lớp 6.1" = 61); từ chối lớp ngoài khối 6–9; gửi điểm tới MÁY CHỦ GIẢ LẬP (mô phỏng Apps Script): 3 cách ghi lớp vào cùng một trang tính, lỗi máy chủ báo "CHƯA gửi", gửi lại thành công, không gửi trùng.

**CHƯA KIỂM THỬ:** chạy `apps-script/Code.gs` trên Google Sheet thật (mới kiểm tra cú pháp và mô phỏng logic); toàn màn hình trên iPhone/iPad (Safari không hỗ trợ — tính năng tự bỏ qua); hành vi trên điện thoại khi có cuộc gọi/thông báo; CORS thực tế của Google Apps Script khi gọi từ GitHub Pages.

## Bổ sung: đăng nhập giáo viên bằng mã gửi qua gmail, khoá in đề, chỉnh sửa trang (tests/mail-login.mjs) — 25/25 ĐẠT
Chạy nguyên văn `apps-script/Code.gs` trong bản giả lập Google (Sheet, Cache, Properties, MailApp; dữ liệu giáo viên GIẢ): chưa đăng nhập chỉ thấy khung nhập gmail; học sinh vào thẳng trang xem đề bị chặn; gmail lạ và gmail bị tạm khoá (x) không bị gửi thư và thông báo giống hệt gmail đúng (không lộ danh sách); gmail đúng nhận đúng 1 thư, mã 6 số, thư ghi 10 phút; mã không lưu dạng rõ; sai mã bị từ chối; đúng mã (gmail hoa/thường) vào được, thấy nút Xem/In đề; mã dùng một lần; đăng xuất lại bị khoá; mã còn hiệu lực ở phút 9, hết hạn quá 10 phút và nhập sai KHÔNG gia hạn (lỗi này đã gặp khi thử và đã sửa); sai 5 lần thì mã đúng cũng vô hiệu; mã của người này không dùng cho gmail khác; giới hạn 1 thư/60 giây; phiên giả bị từ chối; xoá khỏi Sheet thì phiên mất hiệu lực ngay; phiên hết hạn sau 6 giờ; gửi điểm lớp 6/1 vẫn vào trang 6.1; không lỗi JS.
Ghi nhớ thiết bị: ô mặc định không chọn; không chọn thì không lưu mã; chọn thì máy chủ chỉ lưu bản băm; mở lại trang tự vào (kể cả vào thẳng trang xem đề) và không gửi thêm thư; máy khác vẫn bị khoá; mã giả bị từ chối; hết hạn sau 30 ngày; đăng xuất xoá mã ở cả trình duyệt và máy chủ; gỡ khỏi Sheet thì mất quyền ngay; tối đa 4 thiết bị mỗi người.
**CHƯA KIỂM THỬ:** Apps Script trên Google thật (MailApp gửi thư thật, thư vào hộp thư hay vào Spam, CacheService thật, CORS khi gọi từ GitHub Pages); in thật ra giấy; hành vi sau khi tải site.js lên GitHub thật. Giới hạn đã nêu: đề nằm trong mã trang tĩnh nên cổng này chỉ chặn học sinh thông thường.

## Bổ sung: giáo viên tải đề lên + chấm điểm trên máy chủ (tests/exam-upload.mjs) — 68/68 ĐẠT
Đọc đề từ văn bản và tệp .docx/.txt (A./B), * đánh dấu đáp án, Đúng/Sai nhiều cách viết, đáp án khác; báo lỗi đúng dòng khi thiếu câu/đáp án/phương án; cảnh báo đánh số tự động trong Word; từ chối tệp lạ; chuyển đề ngược về văn bản rồi đọc lại giống hệt; đăng đề → học sinh (không đăng nhập) thấy, mở, làm, điểm 10 và điểm về Sheet lớp 7.2; nháp không lộ; không đăng nhập thì không đăng/sửa/xóa/xem danh sách; giáo viên khác không sửa đề của người khác, tổ trưởng thì được; máy chủ tự kiểm tra lại cấu trúc (thiếu câu, khối sai, đáp án ngoài A–D); tên đề bắt đầu "=" bị vô hiệu công thức; ẩn/sửa/xóa; xem thử đề chưa đăng. Bộ cũ vẫn đạt (27, 11, 7, 25, 42).
**CHƯA KIỂM THỬ:** tệp Word thật do giáo viên soạn (nhiều kiểu định dạng, bảng, ảnh, đánh số tự động); trình duyệt cũ không có DecompressionStream; Apps Script thật (giới hạn tốc độ, ô 50.000 ký tự, nhiều người cùng đăng); đề tải lên đọc được bằng trình đọc màn hình.
Chấm điểm trên máy chủ cho đề tải lên: đề công khai không chứa đáp án/giải thích (cả trong phản hồi mạng, bộ nhớ trang và bản lưu máy); nộp giấy trắng = 0 điểm dù trình duyệt tự gửi "score:10"; làm đúng hết = 10 ("1 789" được chấp nhận, tên/lớp viết khác vẫn gộp 6/3 → 6.3); gửi lại cùng mã lượt không ghi trùng; lượt thứ 3 bị từ chối; tên/lớp sai, đề nháp bị từ chối; dữ liệu nộp bị làm bậy không làm sập máy chủ; mất mạng lúc nộp thì giữ bài, Nộp lại thành công và ghi đúng 1 dòng.
**CHƯA KIỂM THỬ:** tải nặng (cả trường nộp cùng lúc) và giới hạn lượt gọi của Google; độ trễ thật 1–3 giây.
