/* Thư viện đề do giáo viên tải lên: đọc văn bản/.docx -> kiểm tra cấu trúc (16 TN + 1 Đúng/Sai 4 ý + 1 trả lời ngắn) -> đăng lên máy chủ.
   Mọi chữ hiển thị đều qua textContent (u.h); không dùng innerHTML, không eval. */
(function () {
  var D = window.DD, u = D.u, S = u.store;
  var LIM = { stem: 900, opt: 300, exp: 800, title: 120, ans: 120 };
  var SUBJ = { history: 'Lịch sử', geography: 'Địa lí', integrated: 'Lịch sử & Địa lí' };
  var KINDS = ['KTTX', 'Giữa kì', 'Cuối kì'];

  function clean(s) { return String(s == null ? '' : s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f​-‍﻿]/g, '').replace(/[ \t ]+/g, ' ').trim(); }

  var RE_Q = /^(?:câu|cau)\s*(\d{1,3})\s*[.:)\-–]?\s*(.*)$/i;
  var RE_Q2 = /^(\d{1,3})\s*[.)]\s+(.+)$/;
  var RE_TAG = /^[(\[]\s*(?:đúng\s*\/?\s*sai|trả lời ngắn|trắc nghiệm|nhiều lựa chọn|biết|hiểu|vận dụng|\d+(?:[.,]\d+)?\s*đ(?:iểm)?)[^)\]]{0,30}[)\]]\s*[.:]?\s*/i;
  var RE_OPT = /^(\*?)\s*([A-Da-d])\s*[.)]\s*(.*)$/;
  var RE_ALT = /^(?:đáp án khác|dap an khac|chấp nhận(?: thêm)?|cũng đúng)\s*[:=]\s*(.*)$/i;
  var RE_ANS = /^(?:đáp án|dap an|đ\/a|đáp số|answer|ans)(?![a-zà-ỹ])\s*[:=\-–]?\s*(.*)$/i;
  var RE_ANS2 = /^đa\s*[:=]\s*(.*)$/i;
  var RE_EXP = /^(?:giải thích|giai thich|hướng dẫn giải|lời giải)\s*[:\-–]\s*(.*)$/i;
  var RE_LEVEL = /^(?:mức độ|muc do)\s*[:=]\s*(.*)$/i;
  var RE_TOPIC = /^(?:chủ đề|chu de)\s*[:=]\s*(.*)$/i;
  var RE_SKIP = /^(?:phần|part)\s+[ivx\d]+(?![a-zà-ỹ])|^[ivx]{1,4}\s*[.)]\s*(?:trắc nghiệm|câu hỏi|đúng|trả lời|tự luận|phần)|^[=\-_*#]{3,}$/i;
  var LEVELS = { 'biết': 'Biết', 'hiểu': 'Hiểu', 'vận dụng': 'Vận dụng' };

  /* ===== Phân tích văn bản thành bộ đề ===== */
  function parse(text) {
    var lines = String(text || '').normalize('NFC').replace(/\r/g, '').split('\n'), blocks = [], cur = null, field = '', errors = [], warns = [];
    function put(t) {
      if (!cur) return;
      var f = field;
      if (f === 'stem') cur.stem = (cur.stem + ' ' + t).trim();
      else if (f === 'exp') cur.exp = (cur.exp + ' ' + t).trim();
      else if (f === 'ans') cur.ans = (cur.ans + ' ' + t).trim();
      else if (f.indexOf('opt:') === 0) { var k = f.slice(4); cur.opts[k] = (cur.opts[k] + ' ' + t).trim(); }
    }
    lines.forEach(function (raw, i) {
      var ln = i + 1, t = clean(raw), m; if (!t) return;
      if (RE_SKIP.test(t)) return;
      m = RE_Q.exec(t);
      if (!m) { m = RE_Q2.exec(t); if (m && Number(m[1]) !== blocks.length + 1) m = null; }
      if (m) {
        var rest = m[2].replace(RE_TAG, '');
        cur = { ln: ln, num: Number(m[1]), stem: rest, opts: {}, mark: null, ans: '', alts: [], exp: '', level: '', topic: '' }; blocks.push(cur); field = 'stem'; return;
      }
      if (!cur) return;                                   // dòng tiêu đề trước câu 1: bỏ qua
      if ((m = RE_ALT.exec(t))) { cur.alts = m[1].split(/\s*[|;]\s*/).map(clean).filter(Boolean); field = ''; return; }
      if ((m = RE_ANS.exec(t) || RE_ANS2.exec(t))) { cur.ans = clean(m[1]); field = 'ans'; return; }
      if ((m = RE_EXP.exec(t))) { cur.exp = clean(m[1]); field = 'exp'; return; }
      if ((m = RE_LEVEL.exec(t))) { cur.level = clean(m[1]); field = ''; return; }
      if ((m = RE_TOPIC.exec(t))) { cur.topic = clean(m[1]); field = ''; return; }
      if ((m = RE_OPT.exec(t)) && field !== 'exp') {
        var key = m[2]; if (cur.opts[key] !== undefined) { errors.push({ ln: ln, msg: 'Câu ' + cur.num + ': phương án ' + key + ' bị lặp.' }); }
        cur.opts[key] = clean(m[3]); if (m[1] === '*') cur.mark = key; field = 'opt:' + key; return;
      }
      put(t);
    });

    var set = { mcq: [], tf: null, sa: null }, nTF = 0, nSA = 0, letters = {};
    blocks.forEach(function (b) {
      var up = ['A', 'B', 'C', 'D'].filter(function (k) { return b.opts[k] !== undefined; }), lo = ['a', 'b', 'c', 'd'].filter(function (k) { return b.opts[k] !== undefined; }), tag = 'Câu ' + b.num;
      if (!b.stem) errors.push({ ln: b.ln, msg: tag + ': thiếu nội dung câu hỏi.' });
      if (b.stem.length > LIM.stem) errors.push({ ln: b.ln, msg: tag + ': nội dung quá dài (tối đa ' + LIM.stem + ' ký tự).' });
      if (b.exp.length > LIM.exp) errors.push({ ln: b.ln, msg: tag + ': giải thích quá dài (tối đa ' + LIM.exp + ' ký tự).' });
      if (up.length) {                                     // ---- trắc nghiệm
        if (up.length !== 4) { errors.push({ ln: b.ln, msg: tag + ': cần đủ 4 phương án A, B, C, D (đang có ' + up.join(', ') + ').' }); return; }
        var bad = false; ['A', 'B', 'C', 'D'].forEach(function (k) { if (!b.opts[k]) { errors.push({ ln: b.ln, msg: tag + ': phương án ' + k + ' đang trống.' }); bad = true; } else if (b.opts[k].length > LIM.opt) { errors.push({ ln: b.ln, msg: tag + ': phương án ' + k + ' quá dài.' }); bad = true; } });
        var lm = /^\s*\*?([A-Da-d])(?![A-Za-zÀ-ỹ])/.exec(b.ans || ''), L = b.mark || (lm ? lm[1].toUpperCase() : '');
        if (!L) { errors.push({ ln: b.ln, msg: tag + ': thiếu dòng "Đáp án: A/B/C/D" (hoặc đánh dấu * trước phương án đúng).' }); return; }
        if (bad) return;
        var ai = 'ABCD'.indexOf(L), lvl = LEVELS[(b.level || '').toLowerCase()] || (b.level ? clean(b.level).slice(0, 20) : 'Biết');
        letters[L] = (letters[L] || 0) + 1;
        set.mcq.push({ q: b.stem, opts: ['A', 'B', 'C', 'D'].map(function (k) { return b.opts[k]; }), ans: ai, exp: b.exp || ('Đáp án đúng: ' + L + '. ' + b.opts[L]), level: lvl, topic: clean(b.topic).slice(0, 60) });
        if (!b.exp) b.noexp = true;
      } else if (lo.length) {                              // ---- đúng/sai
        nTF++; if (nTF > 1) { errors.push({ ln: b.ln, msg: tag + ': chỉ được 1 câu Đúng/Sai (4 ý a, b, c, d).' }); return; }
        if (lo.length !== 4) { errors.push({ ln: b.ln, msg: tag + ': câu Đúng/Sai cần đủ 4 ý a), b), c), d) (đang có ' + lo.join(', ') + ').' }); return; }
        var ans = parseTF(b.ans);
        if (!ans) { errors.push({ ln: b.ln, msg: tag + ': đáp án Đúng/Sai chưa đọc được. Viết dạng: Đáp án: a-Đ, b-S, c-Đ, d-S' }); return; }
        var items = lo.map(function (k, j) { return { text: b.opts[k], ans: ans[j] }; });
        if (items.some(function (x) { return !x.text || x.text.length > LIM.opt; })) { errors.push({ ln: b.ln, msg: tag + ': có ý trống hoặc quá dài.' }); return; }
        if (b.exp) items[0].exp = b.exp;
        set.tf = { prompt: b.stem, items: items };
      } else {                                             // ---- trả lời ngắn
        nSA++; if (nSA > 1) { errors.push({ ln: b.ln, msg: tag + ': chỉ được 1 câu trả lời ngắn.' }); return; }
        if (!b.ans) { errors.push({ ln: b.ln, msg: tag + ': câu trả lời ngắn thiếu dòng "Đáp án: ...".' }); return; }
        if (b.ans.length > LIM.ans) { errors.push({ ln: b.ln, msg: tag + ': đáp án trả lời ngắn quá dài.' }); return; }
        set.sa = { prompt: b.stem, ans: b.ans, alts: b.alts.slice(0, 8), exp: b.exp, level: 'Vận dụng', topic: clean(b.topic).slice(0, 60) };
      }
    });
    if (!blocks.length) errors.push({ ln: 0, msg: 'Không tìm thấy câu nào. Mỗi câu bắt đầu bằng "Câu 1." (xem mẫu định dạng).' });
    else {
      if (set.mcq.length !== 16) errors.push({ ln: 0, msg: 'Cần đúng 16 câu trắc nghiệm (đang đọc được ' + set.mcq.length + ').' });
      if (!set.tf) errors.push({ ln: 0, msg: 'Thiếu 1 câu Đúng/Sai có 4 ý a), b), c), d).' });
      if (!set.sa) errors.push({ ln: 0, msg: 'Thiếu 1 câu trả lời ngắn (câu không có phương án, có dòng "Đáp án: ...").' });
    }
    var big = Object.keys(letters).filter(function (k) { return letters[k] > 10; })[0];
    if (big) warns.push('Đáp án đúng đa số là ' + big + ' (' + letters[big] + '/16). Nên kiểm tra lại cho cân bằng.');
    var ne = blocks.filter(function (b) { return b.noexp; }).length; if (ne) warns.push(ne + ' câu trắc nghiệm chưa có "Giải thích:" — học sinh chỉ thấy đáp án đúng.');
    var okSet = !errors.length;
    return { ok: okSet, set: okSet ? set : null, errors: errors, warnings: warns, counts: { mcq: set.mcq.length, tf: set.tf ? 1 : 0, sa: set.sa ? 1 : 0 } };
  }
  function parseTF(t) {
    t = clean(t); if (!t) return null; var res = {}, re = /([a-d])\s*[-:=.)]?\s*(đúng|sai|true|false|đ|s)(?![a-zà-ỹ])/gi, m, n = 0;
    while ((m = re.exec(t))) { var v = m[2].toLowerCase(); res[m[1].toLowerCase()] = (v === 'đúng' || v === 'true' || v === 'đ'); n++; }
    if (n === 4 && Object.keys(res).length === 4) return ['a', 'b', 'c', 'd'].map(function (k) { return res[k]; });
    var tk = t.toLowerCase().replace(/đúng/g, 'đ').replace(/sai/g, 's').match(/[đs]/g);
    if (tk && tk.length === 4) return tk.map(function (x) { return x === 'đ'; });
    return null;
  }

  /* ===== Chuyển bộ đề ngược về văn bản (để sửa lại) ===== */
  function toText(set) {
    var o = [];
    set.mcq.forEach(function (q, i) { o.push('Câu ' + (i + 1) + '. ' + q.q); q.opts.forEach(function (x, k) { o.push('ABCD'[k] + '. ' + x); }); o.push('Đáp án: ' + 'ABCD'[q.ans]); if (q.exp) o.push('Giải thích: ' + q.exp); if (q.level) o.push('Mức độ: ' + q.level); if (q.topic) o.push('Chủ đề: ' + q.topic); o.push(''); });
    o.push('Câu 17. ' + set.tf.prompt); set.tf.items.forEach(function (it, k) { o.push('abcd'[k] + ') ' + it.text); });
    o.push('Đáp án: ' + set.tf.items.map(function (it, k) { return 'abcd'[k] + '-' + (it.ans ? 'Đ' : 'S'); }).join(', ')); var e0 = set.tf.items[0] && set.tf.items[0].exp; if (e0) o.push('Giải thích: ' + e0); o.push('');
    o.push('Câu 18. ' + set.sa.prompt); o.push('Đáp án: ' + set.sa.ans); if (set.sa.alts && set.sa.alts.length) o.push('Đáp án khác: ' + set.sa.alts.join(' | ')); if (set.sa.exp) o.push('Giải thích: ' + set.sa.exp);
    return o.join('\n');
  }

  var SAMPLE = [
    'Câu 1. Cuộc cách mạng tư sản đầu tiên trên thế giới nổ ra ở nước nào?',
    'A. Pháp', 'B. Anh', 'C. Hoa Kỳ', 'D. Đức', 'Đáp án: B', 'Giải thích: Cách mạng tư sản Anh (1640–1688) là cuộc cách mạng tư sản đầu tiên.', 'Mức độ: Biết', '',
    'Câu 2. Sự kiện mở đầu Đại cách mạng Pháp là:', 'A. Xử tử vua Lu-i XVI', 'B. Phá ngục Ba-xti', 'C. Thành lập nền cộng hòa', 'D. Thông qua Hiến pháp', 'Đáp án: B', 'Giải thích: Ngày 14-7-1789.', '',
    '... (viết tiếp đến Câu 16, mỗi câu có 4 phương án A. B. C. D. và dòng Đáp án) ...', '',
    'Câu 17. Đọc thông tin: "..." Các ý sau Đúng hay Sai:', 'a) Ý thứ nhất', 'b) Ý thứ hai', 'c) Ý thứ ba', 'd) Ý thứ tư', 'Đáp án: a-Đ, b-S, c-Đ, d-S', 'Giải thích: ...', '',
    'Câu 18. Ngày 14 tháng 7 năm nào nhân dân Pa-ri phá ngục Ba-xti? (Điền 4 chữ số)', 'Đáp án: 1789', 'Đáp án khác: 1 789', 'Giải thích: Mở đầu Đại cách mạng Pháp.'
  ].join('\n');

  /* ===== Đọc tệp Word (.docx): giải nén word/document.xml bằng DecompressionStream (có sẵn trong trình duyệt hiện đại) ===== */
  function u16(b, o) { return b[o] | (b[o + 1] << 8); }
  function u32(b, o) { return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0; }
  function inflate(bytes) {
    if (typeof DecompressionStream !== 'function') return Promise.reject(new Error('Trình duyệt này chưa hỗ trợ đọc .docx. Hãy dán nội dung vào ô bên dưới hoặc dùng Chrome/Edge bản mới.'));
    var ds = new DecompressionStream('deflate-raw'), w = ds.writable.getWriter(); w.write(bytes); w.close();
    return new Response(ds.readable).arrayBuffer();
  }
  function docxText(buf) {
    var b = new Uint8Array(buf), eocd = -1, i;
    if (b.length < 30 || b.length > 15 * 1024 * 1024) return Promise.reject(new Error('Tệp quá lớn hoặc không hợp lệ (tối đa 15 MB).'));
    for (i = b.length - 22; i >= Math.max(0, b.length - 65600); i--) if (u32(b, i) === 0x06054b50) { eocd = i; break; }
    if (eocd < 0) return Promise.reject(new Error('Không phải tệp .docx hợp lệ.'));
    var n = u16(b, eocd + 10), p = u32(b, eocd + 16), ent = null;
    for (i = 0; i < n && p + 46 <= b.length; i++) {
      var nl = u16(b, p + 28), xl = u16(b, p + 30), cl = u16(b, p + 32), nm = '';
      for (var j = 0; j < nl; j++) nm += String.fromCharCode(b[p + 46 + j]);
      if (nm === 'word/document.xml') { ent = { m: u16(b, p + 10), cs: u32(b, p + 20), us: u32(b, p + 24), lo: u32(b, p + 42) }; break; }
      p += 46 + nl + xl + cl;
    }
    if (!ent) return Promise.reject(new Error('Không tìm thấy nội dung văn bản trong tệp .docx.'));
    if (ent.us > 20 * 1024 * 1024) return Promise.reject(new Error('Nội dung tệp quá lớn.'));
    var ho = ent.lo, fl = u16(b, ho + 26), el = u16(b, ho + 28), start = ho + 30 + fl + el, data = b.subarray(start, start + ent.cs);
    var go = ent.m === 0 ? Promise.resolve(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)) : ent.m === 8 ? inflate(data) : Promise.reject(new Error('Kiểu nén của tệp không được hỗ trợ.'));
    return go.then(function (ab) {
      var xml = new TextDecoder('utf-8').decode(ab), doc = new DOMParser().parseFromString(xml, 'application/xml');
      if (doc.getElementsByTagName('parsererror').length) throw new Error('Không đọc được nội dung tệp .docx.');
      var ps = doc.getElementsByTagName('w:p'), out = [], numbered = false;
      Array.prototype.forEach.call(ps, function (p) {
        if (p.getElementsByTagName('w:numPr').length) numbered = true;
        var t = '';
        (function walk(nd) { Array.prototype.forEach.call(nd.childNodes, function (c) { if (c.nodeType !== 1) return; var tn = c.nodeName; if (tn === 'w:t') t += c.textContent; else if (tn === 'w:tab') t += ' '; else if (tn === 'w:br') t += '\n'; else if (tn !== 'w:pPr' && tn !== 'w:rPr') walk(c); }); })(p);
        out.push(t);
      });
      return { text: out.join('\n'), numbered: numbered };
    });
  }
  function readFile(file) {
    if (!file) return Promise.reject(new Error('Chưa chọn tệp.'));
    if (file.size > 15 * 1024 * 1024) return Promise.reject(new Error('Tệp quá lớn (tối đa 15 MB).'));
    var nm = String(file.name || '').toLowerCase();
    if (/\.docx$/.test(nm)) return file.arrayBuffer().then(docxText);
    if (/\.(txt|md|csv)$/.test(nm)) return file.text().then(function (t) { return { text: t, numbered: false }; });
    if (/\.doc$/.test(nm)) return Promise.reject(new Error('Tệp .doc (Word cũ) chưa đọc được. Hãy mở bằng Word → Lưu thành → .docx rồi chọn lại, hoặc dán nội dung vào ô.'));
    return Promise.reject(new Error('Chỉ nhận tệp .docx hoặc .txt (hoặc dán nội dung vào ô).'));
  }

  /* ===== Đăng ký đề vào hệ thống thi ===== */
  var remote = [], loaded = false;
  function url() { return D.config && D.config.syncUrl; }
  function api(op, body) {
    if (!url()) return Promise.reject(new Error('Chưa cấu hình máy chủ (syncUrl trong config.js).'));
    var ctl = typeof AbortController === 'function' ? new AbortController() : null, tm = setTimeout(function () { if (ctl) ctl.abort(); }, 25000);
    return fetch(url(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(Object.assign({ op: op }, body || {})), signal: ctl ? ctl.signal : undefined, redirect: 'follow' })
      .then(function (r) { return r.json(); }).then(function (j) { clearTimeout(tm); if (!j || j.ok !== true) throw new Error((j && j.error) || 'Máy chủ không phản hồi đúng.'); return j; }, function (e) { clearTimeout(tm); throw new Error(e && e.name === 'AbortError' ? 'Quá thời gian chờ máy chủ.' : 'Không kết nối được máy chủ.'); });
  }
  function toMeta(m) { return { id: String(m.id), subject: SUBJ[m.subject] ? m.subject : 'history', grade: Number(m.grade) || 6, code: 'GV', minutes: Math.max(5, Math.min(120, Number(m.minutes) || 15)), kind: KINDS.indexOf(m.kind) >= 0 ? m.kind : 'KTTX', title: clean(m.title).slice(0, LIM.title), custom: true, by: clean(m.by || '').slice(0, 60), hidden: !!m.hidden, server: !!m.server }; }
  function register(meta, set) {
    var mm = toMeta(meta); D.exams = D.exams.filter(function (e) { return e.id !== mm.id; }); D.exams.push(mm); D.examSets[mm.id] = set; return mm;
  }
  function refresh() {
    if (!url()) return Promise.resolve([]);
    return api('exam_list').then(function (j) { remote = (j.exams || []).map(toMeta); loaded = true; try { S.set('remoteExams', remote); } catch (e) { } return remote; }, function () { remote = S.get('remoteExams', []); loaded = true; return remote; });
  }
  function all() {
    var ids = {}, out = [];
    D.exams.forEach(function (e) { if (e.hidden) return; ids[e.id] = 1; out.push(e); });
    (remote.length ? remote : S.get('remoteExams', [])).forEach(function (e) { if (!ids[e.id]) out.push(e); });
    return out;
  }
  /* Học sinh mở đề của giáo viên: tải bộ câu hỏi (đã đăng) rồi đăng ký; mất mạng thì dùng bản đã lưu trên máy. */
  function ensure(id) {
    if (D.examSets[id]) return Promise.resolve(true);
    return api('exam_get', { id: id }).then(function (j) { register(Object.assign({ id: id }, j.meta), j.set); try { S.set('exset:' + id, { meta: j.meta, set: j.set }); } catch (e) { } return true; }, function (e) {
      var c = S.get('exset:' + id, null); if (c && c.set) { register(Object.assign({ id: id }, c.meta), c.set); return true; } throw e;
    });
  }
  function hasFull(id) { var m = D.exams.filter(function (e) { return e.id === id; })[0]; return !!(D.examSets[id] && m && !m.server); }
  function ensureTeacher(id) {
    if (hasFull(id)) return Promise.resolve(true);
    return api('exam_load', { sess: sessionStorage.getItem('dd:sess') || '', id: id }).then(function (j) { register(Object.assign({ id: id }, j.meta, { server: false }), j.set); return true; });
  }
  /* Nộp bài đề do giáo viên tải lên: máy chủ chấm và trả điểm + đáp án + giải thích. */
  function submit(id, a, extra) {
    var m = [], i; for (i = 0; i < 16; i++) m.push(a.m[i] < 0 ? -1 : a.order[i][a.m[i]]);
    return api('exam_submit', { id: a.aid, key: (D.config && D.config.syncKey) || '', examId: id, name: a.name, cls: a.cls, answers: { m: m, t: a.t, s: a.s || '' }, at: new Date().toISOString(), secs: extra.secs, leaves: extra.leaves, awaySecs: extra.awaySecs });
  }
  function authed(op, body) { return api(op, Object.assign({ sess: (function () { try { return sessionStorage.getItem('dd:sess') || ''; } catch (e) { return ''; } })() }, body || {})); }

  D.examlib = { parse: parse, parseTF: parseTF, toText: toText, sample: SAMPLE, readFile: readFile, docxText: docxText, register: register, refresh: refresh, all: all, ensure: ensure, ensureTeacher: ensureTeacher, hasFull: hasFull, submit: submit, api: api, authed: authed, SUBJ: SUBJ, KINDS: KINDS, LIM: LIM, enabled: function () { return !!url(); } };
})();
