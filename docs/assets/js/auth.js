/* Đăng nhập giáo viên bằng mã 6 số gửi qua gmail (chỉ chủ hộp thư mới nhận được mã).
   Danh sách giáo viên được phép nằm riêng trong Google Sheet của tổ (trang "GiaoVien"), máy chủ Google kiểm tra — không nằm trong mã trang.
   LƯU Ý: dữ liệu đề vẫn nằm trong mã trang tĩnh nên đây là cổng giao diện chặn học sinh thông thường, không phải bảo mật tuyệt đối. */
(function () {
  var D = window.DD, u = D.u, S = u.store;
  function url() { return D.config && D.config.syncUrl; }
  function api(op, body) {
    if (!url()) return Promise.reject(new Error('Chưa cấu hình máy chủ Google (xem guide/GOOGLE-SHEET.md).'));
    var o = { op: op }; Object.keys(body || {}).forEach(function (k) { o[k] = body[k]; });
    var ctl = window.AbortController ? new AbortController() : null, t = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
    return fetch(url(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(o), signal: ctl && ctl.signal, redirect: 'follow' })
      .then(function (r) { clearTimeout(t); return r.json(); })
      .then(function (j) { if (!j) throw new Error('Máy chủ không trả lời'); if (j.ok === false && j.error) throw new Error(j.error); return j; });
  }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k) || ''; if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { return ''; } }
  function who() { return ss('dd:teacher'); }
  function isTeacher() { return !!(ss('dd:teacher') && ss('dd:sess')); }
  function logout() { var s = ss('dd:sess'), dv = S.get('dev', null); ss('dd:teacher', null); ss('dd:sess', null); S.del('dev'); if (url()) { if (s) api('sess_end', { sess: s }).catch(function () { }); if (dv) api('dev_forget', { token: dv }).catch(function () { }); } }
  function guard() { if (isTeacher()) return true; u.toast('Chỉ giáo viên trong tổ đăng nhập mới in/xem đề.', 'bad'); location.hash = '#/teacher'; return false; }
  function verify() { if (!isTeacher()) return; api('sess_check', { sess: ss('dd:sess') }).then(function (j) { if (j && j.ok === false) { ss('dd:teacher', null); ss('dd:sess', null); if (/#\/(teacher|xemde)/.test(location.hash)) location.reload(); } }, function () { }); }

  /* Đăng nhập bằng mã 6 số gửi tới gmail đã đăng ký (hiệu lực 10 phút). */
  function sendCode(mail) { return api('mail_send', { mail: String(mail || '').trim() }); }
  function verifyCode(mail, code, remember) { return api('mail_verify', { mail: String(mail || '').trim(), code: String(code || '').trim(), remember: !!remember }).then(function (j) { ss('dd:teacher', j.name); ss('dd:sess', j.sess); if (j.dev) S.set('dev', j.dev); return j; }); }
  /* Thiết bị đã bấm "Ghi nhớ": tự vào bằng mã thiết bị (máy chủ vẫn kiểm tra danh sách giáo viên + hạn 30 ngày). */
  function remembered() { return !!S.get('dev', null); }
  function auto() {
    var dv = S.get('dev', null); if (!dv || isTeacher() || !url()) return Promise.resolve(false);
    return api('dev_login', { token: dv }).then(function (j) { ss('dd:teacher', j.name); ss('dd:sess', j.sess); return true; }, function (e) { if (/chưa được nhớ|hết hạn/.test(e.message)) S.del('dev'); return false; });
  }

  D.auth = { who: who, isTeacher: isTeacher, logout: logout, guard: guard, verify: verify, sendCode: sendCode, verifyCode: verifyCode, remembered: remembered, auto: auto, enabled: function () { return !!url(); } };
  setTimeout(function () {
    if (isTeacher()) return verify();
    auto().then(function (ok) { if (!ok) return; var hs = location.hash; if (/#\/(teacher|xemde)/.test(hs)) location.reload(); else if (!document.body.classList.contains('inexam')) window.dispatchEvent(new HashChangeEvent('hashchange')); });
  }, 300);
})();
