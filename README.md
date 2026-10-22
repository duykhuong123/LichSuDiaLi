# Cổng học tập số — Lịch sử và Địa lí, THCS Đak Đoa (bản GitHub Pages)

Trang web tĩnh (HTML/CSS/JS thuần), không cần máy chủ, không CDN, phông chữ Inter nằm sẵn trong `docs/assets/fonts`. Chạy được trên GitHub Pages, trên máy chủ tĩnh bất kỳ, và mở trực tiếp `docs/index.html`.

Tên trường, tổ chuyên môn, năm học mặc định 2026-2027 và người phụ trách kỹ thuật (Thầy Nguyễn Văn Duy Khương) được giữ nguyên.

## Chạy thử trên máy
```
cd docs && python3 -m http.server 8000   # rồi mở http://localhost:8000
```
Hoặc nháy đúp `docs/index.html` (service worker chỉ hoạt động khi chạy qua http/https).

## Đưa lên GitHub Pages
1. Tạo kho GitHub, đẩy toàn bộ thư mục này lên nhánh `main`.
2. Settings → Pages → Source: *Deploy from a branch* → Branch `main`, thư mục `/docs` → Save.
3. Sau 1–2 phút trang có tại `https://<tài-khoản>.github.io/<tên-kho>/`.
Mọi đường dẫn là tương đối nên chạy được cả ở thư mục con. Tệp `.nojekyll` đã có.

## Cấu trúc
- `docs/index.html`, `assets/css/styles.css`, `assets/js/{core,geo,exam,views,app}.js`
- `docs/assets/js/data/` — dữ liệu: đề (`exams-*.js`), thẻ kiến thức (`cards-*.js`), tuyến thời gian, sơ đồ tư duy, bản đồ (`geo-*.js`), danh mục đề & lịch (`catalog.js`)
- `docs/assets/art/drum.svg` — trống đồng (sinh bằng `tools/make-drum.py`)
- `tools/` — sinh trống đồng, sinh dữ liệu bản đồ, kiểm tra dữ liệu; `tests/` — kiểm thử Playwright
- `guide/` — sao lưu/khôi phục, cập nhật không mất dữ liệu, backend & AI, báo cáo kiểm thử, lỗi, tính năng

## Kiểm thử
```
node tools/validate-data.mjs        # kiểm tra cấu trúc đề/thẻ/mốc/sơ đồ
cd docs && python3 -m http.server 8123 &   # rồi:
node tests/functional.mjs && node tests/environment.mjs   # cần Playwright + Chromium
```
Kết quả đã chạy: xem `guide/TEST-REPORT.md`.

## Thêm/sửa nội dung
Sửa các tệp trong `docs/assets/js/data/`, chạy `node tools/validate-data.mjs`. Mỗi đề có đúng 16 trắc nghiệm (0,5đ) + 1 Đúng/Sai 4 ý (0,25đ/ý) + 1 trả lời ngắn (1,0đ) = 10 điểm. Khi thêm đề mới, khai báo thêm vào `catalog.js` (`D.exams`) và đổi `VERSION` trong `docs/sw.js`.

## Giới hạn quan trọng (đọc kỹ)
- **Gửi điểm về Google Sheet** (mỗi lớp một trang tính) là tuỳ chọn, cần thiết lập theo `guide/GOOGLE-SHEET.md`; nếu chưa thiết lập, điểm chỉ ở trình duyệt học sinh.
- **Không có máy chủ riêng**: không có tài khoản, mật khẩu, đồng bộ nhiều máy hay bảng điểm dùng chung. Điểm và bài làm lưu trong `localStorage` của từng trình duyệt; xóa dữ liệu duyệt web sẽ mất. Dùng *Quản trị → Tải bản sao lưu*.
- **Trợ lý AI chưa bật** (không có khóa API an toàn trong trang tĩnh). Trang có ô tra cứu từ khóa trong kho kiến thức thật, không tạo câu trả lời giả.
- **Chống gian lận không tuyệt đối**: trang chạy phía trình duyệt, đáp án nằm trong mã nguồn. Phù hợp để ôn tập/kiểm tra thường xuyên có giám sát, không phải thi chính thức.
- **Bản đồ/quả địa cầu** là dữ liệu số hóa thủ công (sai số khoảng 0,1–0,3° với Việt Nam, vài độ với thế giới) — dùng minh họa, không dùng đo đạc. Hoàng Sa, Trường Sa được thể hiện thuộc chủ quyền Việt Nam. Trống đồng là bản vẽ lại theo bố cục chung, không sao chép một hiện vật cụ thể.
- **Nội dung đề và thẻ kiến thức do trợ lý soạn bằng lời riêng, tổ chuyên môn cần rà soát** với SGK trước khi dùng chính thức (đặc biệt câu về Tây Sơn trong đề liên môn lớp 8 đã được gắn cờ).
- Khóa API, mật khẩu: không có trong mã nguồn.
