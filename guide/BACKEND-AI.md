# Nâng cấp sau: máy chủ và trợ lý AI

Phiên bản hiện tại là trang tĩnh. Các hạng mục sau cần máy chủ và CHƯA được làm:
| Hạng mục | Cần gì |
|---|---|
| Tài khoản, đăng nhập, phân quyền giáo viên/học sinh | Firebase Auth / Supabase Auth / máy chủ riêng |
| Bảng điểm dùng chung nhiều máy | Cơ sở dữ liệu (Supabase, Firestore, Google Sheets API qua máy chủ) |
| Trợ lý AI | Máy chủ trung gian giữ khóa API |
| Mở/khóa đề theo giờ, chống gian lận mạnh | Kiểm tra giờ và chấm điểm phía máy chủ; đáp án không gửi xuống trình duyệt |

## Trợ lý AI an toàn
1. Tạo hàm serverless (Cloudflare Workers / Vercel / Firebase Functions); khóa API đặt trong biến môi trường của hàm, **không** đặt trong mã trong `docs/`.
2. Hàm nhận `{question, grade}`, giới hạn độ dài và tần suất, thêm chỉ dẫn hệ thống "chỉ trả lời Lịch sử và Địa lí lớp 6–9", gọi mô hình, trả `{answer}`.
3. Bật CORS chỉ cho địa chỉ GitHub Pages của trường.
4. Trong `docs/assets/js/views.js` (hàm `V.ai`) thêm ô hỏi gọi `fetch` tới hàm đó, hiển thị lỗi thật khi hàm không trả lời — không hiển thị câu trả lời mẫu.
5. Dữ liệu học sinh gửi đi phải tối giản (không họ tên).
