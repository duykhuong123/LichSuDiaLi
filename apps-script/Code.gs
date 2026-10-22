/**
 * Nhận điểm từ cổng học tập, ghi vào Google Sheet: MỖI LỚP MỘT TRANG TÍNH ("6.1", "6.2", "7.1"...).
 * Triển khai: Tiện ích mở rộng > Apps Script > dán mã này > Triển khai > Ứng dụng web
 *   Thực thi với: Tôi | Ai có quyền truy cập: Bất kỳ ai  -> sao chép URL /exec vào docs/assets/js/config.js
 * Mã chung (SYNC_KEY) chỉ để chặn gửi bừa; học sinh vẫn có thể xem trong mã trang.
 */
var SYNC_KEY = '';            // nếu đặt, phải trùng syncKey trong config.js
var HEAD = ['Thời gian nộp', 'Họ và tên', 'Lớp', 'Mã đề', 'Tên đề', 'Điểm', 'Số lần rời trang', 'Giây rời trang', 'Thời gian làm (giây)', 'Mã lượt'];

function normClass_(s) {
  s = String(s || '').toUpperCase().replace(/LỚP|LOP/g, '').trim();
  var m = s.match(/^([6-9])\s*[A-Z]?\s*[.\/\\\-_,\s]*\s*(\d{1,2})$/);
  if (!m) return null; var n = parseInt(m[2], 10); return (n < 1 || n > 30) ? null : m[1] + '.' + n;
}
function normName_(s) {
  return String(s || '').replace(/\s+/g, ' ').trim().substring(0, 60).toLowerCase().replace(/(^|\s)(\S)/g, function (x, a, b) { return a + b.toUpperCase(); });
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doGet() { return json_({ ok: true, service: 'dakdoa-scores' }); }

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var d = JSON.parse(e.postData.contents);
    if (SYNC_KEY && d.key !== SYNC_KEY) return json_({ ok: false, error: 'Sai mã chung' });
    var cls = normClass_(d.cls), name = normName_(d.name), score = Number(d.score);
    if (!cls) return json_({ ok: false, error: 'Lớp không hợp lệ' });
    if (name.length < 2) return json_({ ok: false, error: 'Thiếu họ tên' });
    if (!isFinite(score) || score < 0 || score > 10) return json_({ ok: false, error: 'Điểm không hợp lệ' });
    var id = String(d.id || '').substring(0, 40); if (!id) return json_({ ok: false, error: 'Thiếu mã lượt' });
    var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(cls);
    if (!sh) { sh = ss.insertSheet(cls); sh.appendRow(HEAD); sh.setFrozenRows(1); sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold'); }
    var last = sh.getLastRow();
    if (last > 1) { var ids = sh.getRange(2, 10, last - 1, 1).getValues(); for (var i = 0; i < ids.length; i++) if (ids[i][0] === id) return json_({ ok: true, duplicate: true }); } // gửi lại không bị trùng
    function safe(v) { v = String(v == null ? '' : v); return /^[=+\-@]/.test(v) ? "'" + v : v; } // chặn công thức trong ô
    sh.appendRow([new Date(d.at || Date.now()), safe(name), cls, safe(d.examId), safe(d.title), score, Number(d.leaves) || 0, Number(d.awaySecs) || 0, Number(d.secs) || 0, id]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err).substring(0, 120) });
  } finally { try { lock.releaseLock(); } catch (x) { } }
}
