/* Danh mục đề, lịch kiểm tra, thông tin trường. Giữ nguyên tên trường, tổ chuyên môn, năm học mặc định và phụ trách kỹ thuật như bản gốc. */
(function () {
  var D = (window.DD = window.DD || {});
  D.school = {
    name: 'Trường THCS Đak Đoa',
    dept: 'Tổ Lịch sử - Địa lí',
    site: 'LỊCH SỬ VÀ ĐỊA LÍ - ĐAK ĐOA',
    year: '2026-2027',
    years: ['2025-2026', '2026-2027'],
    principal: 'Bà Phan Thị Thùy Trang',
    phone: '02693 831 138',
    address: '25 Lê Hồng Phong, Thôn 9, xã Đak Đoa, tỉnh Gia Lai',
    tech: 'Thầy Nguyễn Văn Duy Khương',
    teachers: ['Cô Trương Thị Thu Hà', 'Cô Trương Thị Thanh Thủy', 'Thầy Nguyễn Văn Duy Khương', 'Cô Trần Thị Lệ', 'Cô Đinh Thị Xuân Nương', 'Cô Nguyễn Thị Tuyết', 'Cô Nguyễn Thị An', 'Cô Phùng Thị Trang', 'Thầy Lê Mạnh Cường', 'Cô Nhữ Thị Hà', 'Cô Phạm Bích Tuyết']
  };
  // minutes: thời gian làm bài (phút). opensAt: ISO có múi giờ +07:00 (chỉ để hiển thị lịch, không khóa đề).
  D.exams = [
    { id: 'exam-hist-6-1', subject: 'history', grade: 6, code: 'Đề 1', minutes: 15, kind: 'KTTX', title: 'KTTX_L1 - Lịch sử 6: Vì sao phải học Lịch sử & Thời nguyên thủy' },
    { id: 'exam-geo-6-1', subject: 'geography', grade: 6, code: 'Đề 1', minutes: 15, kind: 'KTTX', title: 'Đề 1 - Địa lí 6: Trái Đất và bản đồ' },
    { id: 'exam-hist-7-1', subject: 'history', grade: 7, code: 'Đề 1', minutes: 15, kind: 'KTTX', title: 'KTTX_L1 - Lịch sử 7: Tây Âu thời Trung đại & Các cuộc phát kiến địa lí' },
    { id: 'exam-hist-7-2', subject: 'history', grade: 7, code: 'Đề 2', minutes: 15, kind: 'KTTX', title: 'Đề 2 - Lịch sử 7: Việt Nam từ thế kỉ X đến đầu thế kỉ XV' },
    { id: 'exam-geo-7-1', subject: 'geography', grade: 7, code: 'Đề 2', minutes: 15, kind: 'KTTX', title: 'Đề 2 - Địa lí 7: Thiên nhiên và Dân cư, xã hội Châu Âu - Châu Á' },
    { id: 'exam-hist-8-1', subject: 'history', grade: 8, code: 'Đề 1', minutes: 15, kind: 'KTTX', title: 'KTTX_L1 - Lịch sử 8: Cách mạng tư sản & Cách mạng công nghiệp', opensAt: '2026-10-20T17:30:00+07:00' },
    { id: 'exam-geo-8-1', subject: 'geography', grade: 8, code: 'Đề 1', minutes: 15, kind: 'KTTX', title: 'Đề 1 - Địa lí 8: Vị trí địa lí, phạm vi lãnh thổ và địa hình Việt Nam' },
    { id: 'exam-int-8-gk', subject: 'integrated', grade: 8, code: 'GK1', minutes: 45, kind: 'Giữa kì', title: 'Đề Ôn Tập Giữa Kì 1 - Lịch sử & Địa lí 8 (Chuẩn ma trận phối hợp)' },
    { id: 'exam-hist-9-1', subject: 'history', grade: 9, code: 'Đề 1', minutes: 15, kind: 'KTTX', title: 'KTTX_L1 - Lịch sử 9: Thế giới từ năm 1918 đến năm 1945' },
    { id: 'exam-hist-9-2', subject: 'history', grade: 9, code: 'Đề 2', minutes: 15, kind: 'KTTX', title: 'Đề 2 - Lịch sử 9: Việt Nam từ năm 1930 đến năm 1945' },
    { id: 'exam-geo-9-1', subject: 'geography', grade: 9, code: 'Đề 2', minutes: 15, kind: 'KTTX', title: 'Đề 2 - Địa lí 9: Dân cư, lao động và Địa lí ngành Nông nghiệp Việt Nam' }
  ];
  D.schedule = [
    { when: '17:30 ngày 20/10/2026', who: 'Khối 8', what: 'KTTX Lần 1 – Lịch sử 8 (Cách mạng tư sản & Cách mạng công nghiệp)', exam: 'exam-hist-8-1' },
    { when: 'Mở tự do ôn luyện', who: 'Khối 9', what: 'KTTX Lần 1 – Địa lí 9 (Dân cư & Nông nghiệp Việt Nam)', exam: 'exam-geo-9-1' },
    { when: 'Chuẩn bị Giữa học kì I', who: 'Khối 6 & 7', what: 'Ôn tập theo ma trận 16 trắc nghiệm + 1 đúng/sai + 1 trả lời ngắn', exam: null }
  ];
  D.resources = [
    { t: 'Thẻ kiến thức theo khối', d: 'Tóm tắt trọng tâm, thuật ngữ và câu tự kiểm tra cho từng chủ đề.', go: '#/review' },
    { t: 'Ngân hàng đề', d: 'Đề trắc nghiệm có giải thích, chấm tự động, xem lại bài.', go: '#/exams' },
    { t: 'Sơ đồ tư duy', d: 'Phóng to, kéo thả, mở rộng nhánh.', go: '#/mindmaps' },
    { t: 'Tuyến thời gian', d: 'Lịch sử Việt Nam và thế giới, lọc theo khối.', go: '#/timeline' },
    { t: 'Quả địa cầu & Atlas Việt Nam', d: 'Địa cầu quay kéo thả; bản đồ sông, núi, cao nguyên, biển đảo.', go: '#/atlas' },
    { t: 'Trống đồng Đông Sơn', d: 'Các vành hoa văn: sao, chim Lạc, người hóa trang lông vũ.', go: '#/drum' }
  ];
})();
