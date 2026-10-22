/* Cấu hình đồng bộ điểm. Để trống syncUrl = chỉ lưu trên máy (không gửi đi đâu).
   Điền địa chỉ Web App của Google Apps Script (xem guide/GOOGLE-SHEET.md). KHÔNG đặt mật khẩu/khóa quan trọng ở đây: mọi thứ trong tệp này học sinh đều xem được. */
(function () {
  var D = (window.DD = window.DD || {});
  D.config = {
    syncUrl: '',   // ví dụ: 'https://script.google.com/macros/s/AKfycb.../exec'
    syncKey: '',   // mã chung tuỳ chọn, chỉ để chặn gửi bừa; không phải bí mật
    // Quy định chống gian lận mặc định cho MỌI máy học sinh (sửa rồi đẩy lại lên GitHub):
    policy: { grace: 1, autoSubmit: false, maxLeaves: 3, fullscreen: true, block: true, deduct: 0.25 }
  };
})();
