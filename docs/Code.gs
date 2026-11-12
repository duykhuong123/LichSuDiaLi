/**
 * MÁY CHỦ CHO CỔNG HỌC TẬP SỬ - ĐỊA (Google Apps Script). Làm hai việc:
 *  1) Nhận điểm học sinh, ghi vào Google Sheet: MỖI LỚP MỘT TRANG TÍNH ("6.1", "7.2"...).
 *  2) Đăng nhập giáo viên: nhập gmail -> nhận mã 6 số qua gmail (10 phút) -> nhập mã. Chỉ chủ hộp thư nhận được mã.
 *     Danh sách giáo viên được phép nằm trong trang tính "GiaoVien" của Google Sheet này (chỉ chủ Sheet thấy).
 *
 * Triển khai: Tiện ích mở rộng > Apps Script > dán mã này > Triển khai > Ứng dụng web
 *   Thực thi với: Tôi | Ai có quyền truy cập: Bất kỳ ai -> sao chép URL /exec vào docs/assets/js/config.js (syncUrl)
 */
var SYNC_KEY = '';                 // nếu đặt, phải trùng syncKey trong config.js (chỉ dùng cho gửi điểm)
var HEAD = ['Thời gian nộp', 'Họ và tên', 'Lớp', 'Mã đề', 'Tên đề', 'Điểm', 'Số lần rời trang', 'Giây rời trang', 'Thời gian làm (giây)', 'Mã lượt'];
var T_SHEET = 'GiaoVien';          // cột: Họ tên | Gmail | Vai trò (TT/TP) | Tạm khóa (gõ x để khóa)
var T_HEAD = ['Họ tên', 'Gmail', 'Vai trò (TT/TP)', 'Tạm khóa (x)'];
var OTP_SECONDS = 600;             // mã 6 số có hiệu lực 10 phút
var SESSION_SECONDS = 6 * 3600;    // phiên đăng nhập 6 giờ (giới hạn của CacheService)
var DEVICE_DAYS = 30;              // "Ghi nhớ thiết bị": hiệu lực 30 ngày kể từ lúc đăng nhập bằng mã
var MAX_DEVICES = 4;               // mỗi giáo viên tối đa 4 thiết bị được nhớ (cái cũ nhất bị bỏ)
var MAX_TRIES = 5;                 // nhập sai quá 5 lần thì phải xin mã mới
var E_SHEET = 'DeGiaoVien';        // đề giáo viên tải lên (trang tính riêng tư, chủ Sheet xem được)
var E_HEAD = ['Mã đề', 'Tiêu đề', 'Khối', 'Môn', 'Loại', 'Phút', 'Mở cho học sinh (x)', 'Người đăng', 'Gmail', 'Cập nhật', 'Dữ liệu đề (JSON — đừng sửa tay)'];
var MAX_EXAM_JSON = 45000;         // giới hạn 1 ô Google Sheet là 50.000 ký tự
var MAX_EXAMS_PER_TEACHER = 60;
var MAX_EXAMS_TOTAL = 400;
var MAX_MAILS_PER_DAY = 80;        // Gmail miễn phí gửi tối đa khoảng 100 thư/ngày

function normClass_(s) {
  s = String(s || '').toUpperCase().replace(/LỚP|LOP/g, '').trim();
  var m = s.match(/^([6-9])\s*[A-Z]?\s*[.\/\\\-_,\s]*\s*(\d{1,2})$/);
  if (!m) return null; var n = parseInt(m[2], 10); return (n < 1 || n > 30) ? null : m[1] + '.' + n;
}
function normName_(s) {
  return String(s || '').replace(/\s+/g, ' ').trim().substring(0, 60).toLowerCase().replace(/(^|\s)(\S)/g, function (x, a, b) { return a + b.toUpperCase(); });
}
function normMail_(v) { return String(v == null ? '' : v).trim().toLowerCase(); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function sha_(s) { var b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s), Utilities.Charset.UTF_8); return b.map(function (x) { return ('0' + (x & 255).toString(16)).slice(-2); }).join(''); }
function rand_() { return (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, ''); }

function doGet() { return json_({ ok: true, service: 'dakdoa' }); }

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var d = JSON.parse(e.postData.contents);
    if (d.op) return json_(handleOp_(d));
    return json_(saveScore_(d));
  } catch (err) {
    return json_({ ok: false, error: String(err).substring(0, 120) });
  } finally { try { lock.releaseLock(); } catch (x) { } }
}

/* ===== 1) ĐIỂM ===== */
function saveScore_(d) {
  if (SYNC_KEY && d.key !== SYNC_KEY) return { ok: false, error: 'Sai mã chung' };
  var cls = normClass_(d.cls), name = normName_(d.name), score = Number(d.score);
  if (!cls) return { ok: false, error: 'Lớp không hợp lệ' };
  if (name.length < 2) return { ok: false, error: 'Thiếu họ tên' };
  if (!isFinite(score) || score < 0 || score > 10) return { ok: false, error: 'Điểm không hợp lệ' };
  var id = String(d.id || '').substring(0, 40); if (!id) return { ok: false, error: 'Thiếu mã lượt' };
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(cls);
  if (!sh) { sh = ss.insertSheet(cls); sh.appendRow(HEAD); sh.setFrozenRows(1); sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold'); }
  var last = sh.getLastRow();
  if (last > 1) { var ids = sh.getRange(2, 10, last - 1, 1).getValues(); for (var i = 0; i < ids.length; i++) if (ids[i][0] === id) return { ok: true, duplicate: true }; }
  function safe(v) { v = String(v == null ? '' : v); return /^[=+\-@]/.test(v) ? "'" + v : v; }
  sh.appendRow([new Date(d.at || Date.now()), safe(name), cls, safe(d.examId), safe(d.title), score, Number(d.leaves) || 0, Number(d.awaySecs) || 0, Number(d.secs) || 0, id]);
  return { ok: true };
}

/* ===== 2) ĐĂNG NHẬP GIÁO VIÊN BẰNG MÃ 6 SỐ GỬI QUA GMAIL ===== */
function teachers_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(T_SHEET);
  if (!sh) { sh = ss.insertSheet(T_SHEET); sh.appendRow(T_HEAD); sh.setFrozenRows(1); sh.getRange(1, 1, 1, T_HEAD.length).setFontWeight('bold'); return []; }
  var v = sh.getDataRange().getValues(), out = [];
  for (var i = 1; i < v.length; i++) {
    var r = v[i]; if (!r[0] || !r[1] || String(r[3]).trim() !== '') continue;   // bỏ dòng trống và người bị tạm khóa
    out.push({ name: String(r[0]).trim(), mail: normMail_(r[1]), role: String(r[2] || '').trim() });
  }
  return out;
}
function code6_() { var h = rand_().replace(/[^0-9]/g, '') + '123456'; return h.substring(0, 6); }
function newDevice_(props, mail) {                          // tạo mã thiết bị (chỉ lưu bản băm), giữ tối đa MAX_DEVICES thiết bị mỗi người
  var all = props.getProperties(), mine = [];
  Object.keys(all).forEach(function (k) { if (k.indexOf('dev:') !== 0) return; try { var v = JSON.parse(all[k]); if (Date.now() > v.exp) props.deleteProperty(k); else if (v.mail === mail) mine.push({ k: k, exp: v.exp }); } catch (e) { props.deleteProperty(k); } });
  mine.sort(function (a, b) { return a.exp - b.exp; });
  while (mine.length >= MAX_DEVICES) props.deleteProperty(mine.shift().k);
  var tk = rand_(); props.setProperty('dev:' + sha_(tk), JSON.stringify({ mail: mail, exp: Date.now() + DEVICE_DAYS * 86400000 }));
  return tk;
}
function today_() { return new Date().toISOString().substring(0, 10); }

function handleOp_(d) {
  var cache = CacheService.getScriptCache(), props = PropertiesService.getScriptProperties(), op = d.op;
  if (String(op).indexOf('exam_') === 0) return examOp_(d, cache);
  var GENERIC = { ok: true, message: 'Nếu gmail có trong danh sách giáo viên, mã đã được gửi (kiểm tra cả mục Spam). Mã có hiệu lực 10 phút.' };
  if (op === 'mail_send') {                                   // gửi mã 6 số tới gmail (luôn trả lời giống nhau để không lộ ai có trong danh sách)
    var ml = normMail_(d.mail); if (!/^\S+@\S+\.\S+$/.test(ml) || ml.length > 80) return { ok: false, error: 'Gmail không hợp lệ' };
    var day = 'mails:' + today_(), cnt = Number(props.getProperty(day) || 0); if (cnt >= MAX_MAILS_PER_DAY) return { ok: false, error: 'Hôm nay đã gửi quá nhiều thư, thử lại vào ngày mai' };
    if (cache.get('cool:' + sha_(ml))) return GENERIC;       // 1 thư / 60 giây cho mỗi gmail
    cache.put('cool:' + sha_(ml), '1', 60);
    var t = teachers_().filter(function (x) { return x.mail === ml; })[0];
    if (t) {
      var c = code6_();
      cache.put('otp:' + sha_(ml), JSON.stringify({ h: sha_(c + ':' + ml), tries: 0, exp: Date.now() + OTP_SECONDS * 1000 }), OTP_SECONDS);
      props.setProperty(day, String(cnt + 1));
      MailApp.sendEmail({ to: ml, subject: 'Mã đăng nhập khu vực giáo viên: ' + c, body: 'Xin chào ' + t.name + ',\n\nMã đăng nhập của bạn là: ' + c + '\nMã có hiệu lực 10 phút và chỉ dùng một lần.\n\nNếu bạn không yêu cầu mã này, hãy bỏ qua thư. Không chia sẻ mã cho ai.\n\n— Cổng học tập Lịch sử - Địa lí THCS Đak Đoa' });
    }
    return GENERIC;
  }
  if (op === 'mail_verify') {                                 // kiểm tra mã, tạo phiên
    var m2 = normMail_(d.mail), k = 'otp:' + sha_(m2), raw = cache.get(k);
    if (!raw) return { ok: false, error: 'Mã không đúng hoặc đã hết hạn. Hãy bấm Gửi lại mã.' };
    var o = JSON.parse(raw);
    if (Date.now() > o.exp) { cache.remove(k); return { ok: false, error: 'Mã không đúng hoặc đã hết hạn. Hãy bấm Gửi lại mã.' }; }   // không gia hạn khi nhập sai
    if (o.tries >= MAX_TRIES) { cache.remove(k); return { ok: false, error: 'Nhập sai quá nhiều lần. Hãy gửi mã mới.' }; }
    if (sha_(String(d.code || '').trim() + ':' + m2) !== o.h) { var left = Math.floor((o.exp - Date.now()) / 1000); if (left < 1) { cache.remove(k); return { ok: false, error: 'Mã không đúng hoặc đã hết hạn. Hãy bấm Gửi lại mã.' }; } o.tries++; cache.put(k, JSON.stringify(o), left); return { ok: false, error: 'Mã không đúng hoặc đã hết hạn. Hãy bấm Gửi lại mã.' }; }
    var tt = teachers_().filter(function (x) { return x.mail === m2; })[0]; cache.remove(k);
    if (!tt) return { ok: false, error: 'Bạn không còn trong danh sách giáo viên' };
    var sess = rand_(); cache.put('sess:' + sess, JSON.stringify({ name: tt.name, mail: tt.mail }), SESSION_SECONDS);
    var out = { ok: true, name: tt.name, role: tt.role, sess: sess };
    if (d.remember === true) out.dev = newDevice_(props, tt.mail);
    return out;
  }
  if (op === 'dev_login') {                                   // thiết bị đã được nhớ: vào thẳng, không cần mã
    if (Number(cache.get('dfail') || 0) >= 30) return { ok: false, error: 'Thử quá nhiều lần, thử lại sau vài phút' };
    var tk = String(d.token || ''), dk = 'dev:' + sha_(tk), dr = tk.length >= 32 ? props.getProperty(dk) : null;
    if (!dr) { cache.put('dfail', String(Number(cache.get('dfail') || 0) + 1), 600); return { ok: false, error: 'Thiết bị chưa được nhớ hoặc đã hết hạn' }; }
    var dv = JSON.parse(dr), dt = teachers_().filter(function (x) { return x.mail === dv.mail; })[0];
    if (Date.now() > dv.exp || !dt) { props.deleteProperty(dk); return { ok: false, error: 'Thiết bị chưa được nhớ hoặc đã hết hạn' }; }
    var s2 = rand_(); cache.put('sess:' + s2, JSON.stringify({ name: dt.name, mail: dt.mail }), SESSION_SECONDS);
    return { ok: true, name: dt.name, role: dt.role, sess: s2 };
  }
  if (op === 'dev_forget') { props.deleteProperty('dev:' + sha_(String(d.token || ''))); return { ok: true }; }
  if (op === 'sess_check') {                                  // kiểm tra phiên còn hiệu lực + gmail còn trong danh sách
    var s = cache.get('sess:' + String(d.sess || '')); if (!s) return { ok: false };
    var m = JSON.parse(s), still = teachers_().filter(function (x) { return x.mail === m.mail; })[0];
    if (!still) { cache.remove('sess:' + d.sess); return { ok: false }; }
    return { ok: true, name: m.name };
  }
  if (op === 'sess_end') { cache.remove('sess:' + String(d.sess || '')); return { ok: true }; }
  return { ok: false, error: 'Không hỗ trợ' };
}

/* ===== 3) ĐỀ DO GIÁO VIÊN TẢI LÊN ===== */
var SUBJECTS_ = ['history', 'geography', 'integrated'], KINDS_ = ['KTTX', 'Giữa kì', 'Cuối kì'];
function cl_(v, max) { return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u200b-\u200d\ufeff]/g, '').replace(/\s+/g, ' ').trim().substring(0, max); }
function sessTeacher_(cache, sess) {
  var s = cache.get('sess:' + String(sess || '')); if (!s) return null;
  var m = JSON.parse(s), t = teachers_().filter(function (x) { return x.mail === m.mail; })[0];
  return t || null;
}
function validExam_(meta, set) {                 // kiểm tra lại ở máy chủ (không tin trình duyệt)
  if (!meta || !set) return 'Thiếu dữ liệu đề';
  var title = cl_(meta.title, 120); if (title.length < 3) return 'Thiếu tên đề';
  var grade = Number(meta.grade); if ([6, 7, 8, 9].indexOf(grade) < 0) return 'Khối phải từ 6 đến 9';
  if (SUBJECTS_.indexOf(meta.subject) < 0) return 'Môn không hợp lệ';
  if (KINDS_.indexOf(meta.kind) < 0) return 'Loại đề không hợp lệ';
  var mins = Number(meta.minutes); if (!isFinite(mins) || mins < 5 || mins > 120) return 'Thời gian làm bài 5–120 phút';
  if (!set.mcq || set.mcq.length !== 16) return 'Cần đúng 16 câu trắc nghiệm';
  for (var i = 0; i < 16; i++) {
    var q = set.mcq[i]; if (!q || !cl_(q.q, 900) || !q.opts || q.opts.length !== 4) return 'Câu ' + (i + 1) + ' không hợp lệ';
    for (var k = 0; k < 4; k++) if (!cl_(q.opts[k], 300)) return 'Câu ' + (i + 1) + ' thiếu phương án';
    if (q.ans !== 0 && q.ans !== 1 && q.ans !== 2 && q.ans !== 3) return 'Câu ' + (i + 1) + ' thiếu đáp án';
  }
  if (!set.tf || !cl_(set.tf.prompt, 900) || !set.tf.items || set.tf.items.length !== 4) return 'Câu Đúng/Sai cần 4 ý';
  for (var j = 0; j < 4; j++) { var it = set.tf.items[j]; if (!it || !cl_(it.text, 300) || typeof it.ans !== 'boolean') return 'Ý ' + 'abcd'.charAt(j) + ' của câu Đúng/Sai không hợp lệ'; }
  if (!set.sa || !cl_(set.sa.prompt, 900) || !cl_(set.sa.ans, 120)) return 'Câu trả lời ngắn không hợp lệ';
  return '';
}
function cleanExam_(meta, set) {                 // chỉ giữ các trường biết, cắt độ dài, bỏ ký tự điều khiển
  return {
    meta: { title: cl_(meta.title, 120), grade: Number(meta.grade), subject: meta.subject, kind: meta.kind, minutes: Math.round(Number(meta.minutes)) },
    set: {
      mcq: set.mcq.map(function (q) { return { q: cl_(q.q, 900), opts: q.opts.map(function (o) { return cl_(o, 300); }), ans: q.ans, exp: cl_(q.exp, 800), level: cl_(q.level, 20) || 'Biết', topic: cl_(q.topic, 60) }; }),
      tf: { prompt: cl_(set.tf.prompt, 900), items: set.tf.items.map(function (it) { var o = { text: cl_(it.text, 300), ans: it.ans }; if (it.exp) o.exp = cl_(it.exp, 800); return o; }) },
      sa: { prompt: cl_(set.sa.prompt, 900), ans: cl_(set.sa.ans, 120), alts: (set.sa.alts || []).slice(0, 8).map(function (a) { return cl_(a, 120); }).filter(Boolean), exp: cl_(set.sa.exp, 800), level: 'Vận dụng', topic: cl_(set.sa.topic, 60) }
    }
  };
}
function sf_(v) { v = String(v == null ? '' : v); return /^[=+\-@]/.test(v) ? "'" + v : v; }   // chống công thức trong ô
function examSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(E_SHEET);
  if (!sh) { sh = ss.insertSheet(E_SHEET); sh.appendRow(E_HEAD); sh.setFrozenRows(1); sh.getRange(1, 1, 1, E_HEAD.length).setFontWeight('bold'); }
  return sh;
}
function examRows_() { var sh = examSheet_(), n = sh.getLastRow(); return { sh: sh, v: n > 1 ? sh.getRange(2, 1, n - 1, E_HEAD.length).getValues() : [] }; }
function examMeta_(r) { return { id: String(r[0]), title: String(r[1]), grade: Number(r[2]), subject: String(r[3]), kind: String(r[4]), minutes: Number(r[5]), published: String(r[6]).trim() !== '', by: String(r[7]), at: r[9] instanceof Date ? r[9].toISOString() : String(r[9]) }; }
function canEdit_(t, r) { return t.role === 'TT' || t.role === 'TP' || normMail_(r[8]) === t.mail; }

function examOp_(d, cache) {
  var op = d.op;
  if (op === 'exam_list') {                       // công khai: chỉ đề đang mở cho học sinh, không kèm nội dung
    var c = cache.get('examlist'); if (c) return { ok: true, exams: JSON.parse(c) };
    var list = examRows_().v.filter(function (r) { return r[0] && String(r[6]).trim() !== ''; }).map(function (r) { var m = examMeta_(r); return { id: m.id, title: m.title, grade: m.grade, subject: m.subject, kind: m.kind, minutes: m.minutes, by: m.by }; });
    cache.put('examlist', JSON.stringify(list), 60); return { ok: true, exams: list };
  }
  if (op === 'exam_get') {                        // công khai: chỉ đề đã đăng
    var id = String(d.id || ''), r = examRows_().v.filter(function (x) { return String(x[0]) === id; })[0];
    if (!r || String(r[6]).trim() === '') return { ok: false, error: 'Đề không tồn tại hoặc chưa mở cho học sinh' };
    var m = examMeta_(r), data = JSON.parse(r[10]);      // KHÔNG gửi đáp án/giải thích cho học sinh: máy chủ tự chấm khi nộp bài
    return { ok: true, meta: { id: m.id, title: m.title, grade: m.grade, subject: m.subject, kind: m.kind, minutes: m.minutes, by: m.by, server: true }, set: hideKey_(data.set) };
  }
  if (op === 'exam_submit') return examSubmit_(d);
  var t = sessTeacher_(cache, d.sess); if (!t) return { ok: false, error: 'Hãy đăng nhập giáo viên (phiên đã hết hạn).' };
  var E = examRows_(), rows = E.v, sh = E.sh;
  function find(id) { for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === id) return i; return -1; }
  if (op === 'exam_mine') {
    var mine = rows.filter(function (r) { return r[0] && canEdit_(t, r); }).map(examMeta_); mine.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    return { ok: true, exams: mine, role: t.role };
  }
  var id2 = String(d.id || ''), ix = id2 ? find(id2) : -1;
  if (op === 'exam_load') {
    if (ix < 0) return { ok: false, error: 'Không tìm thấy đề' }; if (!canEdit_(t, rows[ix])) return { ok: false, error: 'Bạn không có quyền với đề này' };
    var mm = examMeta_(rows[ix]); return { ok: true, meta: mm, set: JSON.parse(rows[ix][10]).set, published: mm.published };
  }
  if (op === 'exam_put') {
    var bad = validExam_(d.meta, d.set); if (bad) return { ok: false, error: bad };
    var cx = cleanExam_(d.meta, d.set), js = JSON.stringify({ set: cx.set });
    if (js.length > MAX_EXAM_JSON) return { ok: false, error: 'Đề quá dài (' + js.length + ' ký tự, tối đa ' + MAX_EXAM_JSON + '). Hãy rút gọn.' };
    var pub = d.publish === true ? 'x' : '', now = new Date();
    if (id2) {
      if (ix < 0) return { ok: false, error: 'Không tìm thấy đề để cập nhật' }; if (!canEdit_(t, rows[ix])) return { ok: false, error: 'Bạn không có quyền sửa đề này' };
      sh.getRange(ix + 2, 2, 1, 6).setValues([[sf_(cx.meta.title), cx.meta.grade, cx.meta.subject, cx.meta.kind, cx.meta.minutes, pub]]); sh.getRange(ix + 2, 10, 1, 2).setValues([[now, js]]);
    } else {
      if (rows.length >= MAX_EXAMS_TOTAL) return { ok: false, error: 'Kho đề đã đầy, hãy xóa bớt đề cũ' };
      if (rows.filter(function (r) { return normMail_(r[8]) === t.mail; }).length >= MAX_EXAMS_PER_TEACHER) return { ok: false, error: 'Bạn đã có quá nhiều đề, hãy xóa bớt đề cũ' };
      id2 = 'u-' + rand_().substring(0, 10);
      sh.appendRow([id2, sf_(cx.meta.title), cx.meta.grade, cx.meta.subject, cx.meta.kind, cx.meta.minutes, pub, t.name, t.mail, now, js]);
    }
    cache.remove('examlist'); return { ok: true, id: id2, published: pub !== '' };
  }
  if (op === 'exam_pub') {
    if (ix < 0) return { ok: false, error: 'Không tìm thấy đề' }; if (!canEdit_(t, rows[ix])) return { ok: false, error: 'Bạn không có quyền với đề này' };
    sh.getRange(ix + 2, 7).setValue(d.publish === true ? 'x' : ''); cache.remove('examlist'); return { ok: true, published: d.publish === true };
  }
  if (op === 'exam_del') {
    if (ix < 0) return { ok: false, error: 'Không tìm thấy đề' }; if (!canEdit_(t, rows[ix])) return { ok: false, error: 'Bạn không có quyền xóa đề này' };
    sh.deleteRow(ix + 2); cache.remove('examlist'); return { ok: true };
  }
  return { ok: false, error: 'Không hỗ trợ' };
}

/* ===== 4) CHẤM ĐIỂM TRÊN MÁY CHỦ cho đề giáo viên tải lên (đáp án không rời khỏi máy chủ cho tới khi học sinh nộp bài) ===== */
var MAX_ATTEMPTS = 2;              // mỗi học sinh nộp tối đa 2 lượt cho một đề; thầy cô lấy lượt đầu để tính điểm
function hideKey_(set) {
  return {
    mcq: set.mcq.map(function (q) { return { q: q.q, opts: q.opts, level: q.level, topic: q.topic }; }),
    tf: { prompt: set.tf.prompt, items: set.tf.items.map(function (it) { return { text: it.text }; }) },
    sa: { prompt: set.sa.prompt }
  };
}
function normAns_(s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, ' ').trim(); }
function examSubmit_(d) {
  if (SYNC_KEY && d.key !== SYNC_KEY) return { ok: false, error: 'Sai mã chung' };
  var id = String(d.examId || ''), r = examRows_().v.filter(function (x) { return String(x[0]) === id; })[0];
  if (!r || String(r[6]).trim() === '') return { ok: false, error: 'Đề đã đóng hoặc không tồn tại' };
  var cls = normClass_(d.cls), name = normName_(d.name), aid = String(d.id || '').substring(0, 40);
  if (!cls) return { ok: false, error: 'Lớp không hợp lệ' }; if (name.length < 2) return { ok: false, error: 'Thiếu họ tên' }; if (!aid) return { ok: false, error: 'Thiếu mã lượt' };
  var A = d.answers || {}, set = JSON.parse(r[10]).set, score = 0, det = { m: [], t: [], s: null };
  for (var i = 0; i < 16; i++) {
    var pick = Number((A.m || [])[i]); if (!(pick === 0 || pick === 1 || pick === 2 || pick === 3)) pick = -1;
    var ok = pick === set.mcq[i].ans; if (ok) score += 0.5; det.m.push({ ok: ok, ans: set.mcq[i].ans, exp: set.mcq[i].exp });
  }
  for (var j = 0; j < 4; j++) { var tv = (A.t || [])[j], okt = tv === set.tf.items[j].ans; if (okt) score += 0.25; det.t.push({ ok: okt, ans: set.tf.items[j].ans, exp: set.tf.items[j].exp || '' }); }
  var acc = [set.sa.ans].concat(set.sa.alts || []).map(normAns_), given = normAns_(String(A.s || '').substring(0, 80)), oks = given !== '' && acc.indexOf(given) >= 0;
  if (oks) score += 1; det.s = { ok: oks, ans: set.sa.ans, exp: set.sa.exp || '' };
  score = Math.round(score * 100) / 100;
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(cls);
  if (!sh) { sh = ss.insertSheet(cls); sh.appendRow(HEAD); sh.setFrozenRows(1); sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold'); }
  var last = sh.getLastRow(), tries = 0, dup = false;
  if (last > 1) { var v = sh.getRange(2, 1, last - 1, 10).getValues(); for (var k = 0; k < v.length; k++) { if (v[k][9] === aid) dup = true; else if (String(v[k][3]) === id && v[k][1] === name) tries++; } }
  if (!dup && tries >= MAX_ATTEMPTS) return { ok: false, error: 'Em đã nộp đề này tối đa ' + MAX_ATTEMPTS + ' lần.' };
  if (!dup) sh.appendRow([new Date(d.at || Date.now()), sf_(name), cls, id, sf_(String(r[1])), score, Math.max(0, Math.min(99, Number(d.leaves) || 0)), Math.max(0, Math.min(86400, Number(d.awaySecs) || 0)), Math.max(0, Math.min(86400, Number(d.secs) || 0)), aid]);
  return { ok: true, score: score, detail: det, attempt: tries + (dup ? 0 : 1), duplicate: dup };
}
