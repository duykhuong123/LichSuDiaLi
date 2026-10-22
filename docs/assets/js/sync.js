/* Chuẩn hoá họ tên/lớp và gửi kết quả về Google Sheet (mỗi lớp một trang tính). Chỉ báo "đã gửi" khi máy chủ trả {ok:true}. */
(function () {
  var D = window.DD, u = D.u, S = u.store;
  // "6.1", "6/1", "6-1", "6 1", "6a1", "Lớp 6A1", "61" -> "6.1"
  function normClass(s) {
    s = String(s || '').toUpperCase().replace(/LỚP|LOP/g, '').trim();
    var m = s.match(/^([6-9])\s*[A-Z]?\s*[.\/\\\-_,\s]*\s*(\d{1,2})$/); if (!m) return null;
    var n = parseInt(m[2], 10); if (n < 1 || n > 30) return null; return m[1] + '.' + n;
  }
  function normName(s) { return String(s || '').replace(/\s+/g, ' ').trim().slice(0, 60).toLocaleLowerCase('vi').replace(/(^|\s)(\S)/g, function (x, a, b) { return a + b.toLocaleUpperCase('vi'); }); }
  function uid() { var a = new Uint8Array(8); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach(function (_, i) { a[i] = Math.random() * 256; }); return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function on() { return !!(D.config && D.config.syncUrl); }
  function box() { return S.get('outbox', []); }
  function payload(r) { return { id: r.id, key: D.config.syncKey || '', name: r.name, cls: r.cls, examId: r.examId, title: r.title, score: r.score, at: r.at, secs: r.secs, leaves: r.viol ? r.viol.n : 0, awaySecs: r.viol ? r.viol.secs : 0 }; }
  function post(r) {
    var ctl = window.AbortController ? new AbortController() : null, t = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
    return fetch(D.config.syncUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload(r)), signal: ctl && ctl.signal, redirect: 'follow' })
      .then(function (x) { clearTimeout(t); return x.json(); })
      .then(function (j) { if (!j || j.ok !== true) throw new Error((j && j.error) || 'Máy chủ không xác nhận'); return j; });
  }
  function setState(id, st, msg) { var L = S.get('results', []); L.forEach(function (r) { if (r.id === id) { r.sync = st; r.syncMsg = msg || ''; } }); S.set('results', L); }
  // Gửi một kết quả; cb(state, msg). state: 'sent' | 'failed' | 'off'
  function submit(r, cb) {
    cb = cb || function () { };
    if (!on()) { setState(r.id, 'off'); return cb('off'); }
    setState(r.id, 'pending'); cb('pending');
    post(r).then(function () { setState(r.id, 'sent'); cb('sent'); }, function (e) { setState(r.id, 'failed', String(e.message || e).slice(0, 120)); cb('failed', String(e.message || e)); });
  }
  function pending() { return S.get('results', []).filter(function (r) { return r.id && r.src !== 'import' && (r.sync === 'failed' || r.sync === 'pending'); }); }
  function retryAll(done) {
    if (!on()) { if (done) done(0, 0); return; } var list = pending(), ok = 0, i = 0;
    (function next() { if (i >= list.length) { if (done) done(ok, list.length); return; } var r = list[i++]; post(r).then(function () { setState(r.id, 'sent'); ok++; }, function (e) { setState(r.id, 'failed', String(e.message || e).slice(0, 120)); }).then(next); })();
  }
  window.addEventListener('online', function () { retryAll(); });
  D.sync = { normClass: normClass, normName: normName, uid: uid, enabled: on, submit: submit, pending: pending, retryAll: retryAll };
})();
