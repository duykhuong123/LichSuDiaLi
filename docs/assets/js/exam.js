/* Phòng thi: 16 TN (0,5đ) + 1 Đúng/Sai 4 ý (0,25đ/ý) + 1 trả lời ngắn (1,0đ) = 10 điểm. Tự lưu nháp cục bộ, chấm, xem lại, in A4. */
(function () {
  var D = window.DD, u = D.u, h = u.h, S = u.store;
  var FIXED_ORDER = { 'exam-int-8-gk': true }; // giữ nguyên thứ tự phương án gốc của tổ chuyên môn
  var MCQ_PT = 0.5, TF_PT = 0.25, SA_PT = 1;
  function norm(s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function meta(id) { return D.exams.filter(function (e) { return e.id === id; })[0]; }
  function build(id, seed) {
    var set = D.examSets[id], r = u.rng(seed), order = set.mcq.map(function (m) { var idx = [0, 1, 2, 3]; return FIXED_ORDER[id] ? idx : u.shuffle(idx, r); });
    var qo = set.mcq.map(function (_, i) { return i; }); if (!FIXED_ORDER[id]) qo = u.shuffle(qo, r);
    return { id: id, seed: seed, order: order, qo: qo, m: set.mcq.map(function () { return -1; }), t: [null, null, null, null], s: '', flags: {}, start: Date.now(), name: '', cls: '', cur: 0, minutes: meta(id).minutes };
  }
  function grade(id, a) {
    var set = D.examSets[id], d = { mcq: [], tf: [], sa: 0, total: 0 };
    set.mcq.forEach(function (q, i) { var pick = a.m[i] < 0 ? -1 : a.order[i][a.m[i]]; var ok = pick === q.ans; d.mcq.push(ok); if (ok) d.total += MCQ_PT; });
    set.tf.items.forEach(function (it, i) { var ok = a.t[i] === it.ans; d.tf.push(ok); if (ok) d.total += TF_PT; });
    var accepted = [set.sa.ans].concat(set.sa.alts || []).map(norm), ok = norm(a.s) !== '' && accepted.indexOf(norm(a.s)) >= 0; d.sa = ok ? SA_PT : 0; d.total += d.sa;
    d.total = Math.round(d.total * 100) / 100; return d;
  }
  var PDEF = { grace: 1, autoSubmit: false, maxLeaves: 3, fullscreen: true, block: true, deduct: 0.25 };
  function policy(id) { var P = S.get('policy', {}), o = {}, C = (D.config && D.config.policy) || {}; Object.keys(PDEF).forEach(function (k) { o[k] = k in C ? C[k] : PDEF[k]; }); var e = P[id] || {}; Object.keys(e).forEach(function (k) { if (k in PDEF) o[k] = e[k]; }); if (typeof P._deduct === 'number') o.deduct = P._deduct; return o; }
  function advice(n, grace) { return n <= 0 ? '' : n <= grace ? 'Nhắc nhở' : 'Giáo viên xem xét'; }
  function results() { return S.get('results', []); }
  function saveResult(rec) { var l = results(); l.push(rec); return S.set('results', l); }

  function render(root, id) {
    var m = meta(id), set = D.examSets[id]; u.clear(root);
    if (!m || !set) { root.appendChild(h('div', { class: 'note bad' }, 'Không tìm thấy đề.')); return; }
    var key = 'attempt:' + id, a = S.get(key, null), timer = 0, N = 18;
    function save() { if (a) S.set(key, a); }
    function start() {
      var nm = D.sync.normName((root.querySelector('#nm') || {}).value), cl = D.sync.normClass((root.querySelector('#cl') || {}).value), er = root.querySelector('#er');
      if (nm.length < 2) { er.textContent = 'Hãy nhập họ và tên.'; return; }
      if (!cl) { er.textContent = 'Lớp chưa đúng. Ví dụ: 6.1, 6/1, 7A2, 8-3, 9.4 (khối 6–9).'; return; }
      a = build(id, (Date.now() & 0x7fffffff) ^ u.hash(id)); a.aid = D.sync.uid(); a.name = nm; a.cls = cl; save(); play();
    }
    function intro() {
      u.clear(root); var open = a && !a.done;
      root.appendChild(h('div', { class: 'qbox' },
        h('span', { class: u.tagCls(m.subject) }, u.subjName(m.subject)), h('span', { class: 'tag' }, 'Khối ' + m.grade), h('span', { class: 'tag' }, m.minutes + ' phút'),
        h('h2', null, m.title),
        h('p', null, 'Cấu trúc: 16 câu trắc nghiệm (0,5 điểm/câu) + 1 câu Đúng/Sai gồm 4 ý (0,25 điểm/ý) + 1 câu trả lời ngắn (1,0 điểm) = 10 điểm.'),
        m.opensAt ? h('p', null, 'Lịch mở đề: ' + new Date(m.opensAt).toLocaleString('vi-VN') + '. Giáo viên có thể cho làm bất kỳ lúc nào; trang này không khóa đề.') : null,
        h('div', { class: 'note' }, 'Quy định làm bài: bài thi chạy toàn màn hình (nếu thiết bị hỗ trợ); không sao chép/chuột phải. Nếu bạn chuyển tab, sang ứng dụng khác hoặc thoát toàn màn hình, trang sẽ cảnh báo: lần đầu chỉ nhắc nhở, từ lần thứ hai được ghi vào kết quả để giáo viên xem xét' + (policy(id).autoSubmit ? '; đạt ' + policy(id).maxLeaves + ' lần bài sẽ tự nộp' : '') + '. Thứ tự câu hỏi và đáp án được xáo ngẫu nhiên. '+(D.sync.enabled() ? 'Họ tên, lớp và điểm sẽ được gửi về bảng điểm của tổ khi nộp bài (lớp 6.1, 6/1, 6A1… được gộp làm một).' : 'Kết quả chỉ lưu trong trình duyệt này, chưa được gửi về cho giáo viên.')+' Họ tên và lớp là bắt buộc.'),
        open ? h('div', { class: 'note info' }, 'Có bài đang làm dở trên máy này.', ' ', h('button', { class: 'btn sm', onclick: function () { play(); } }, 'Làm tiếp')) : null,
        h('div', { class: 'bar', style: 'margin-top:12px' },
          h('input', { id: 'nm', class: 't', placeholder: 'Họ và tên', maxlength: 60, required: true, 'aria-label': 'Họ và tên' }),
          h('input', { id: 'cl', class: 't', placeholder: 'Lớp (vd 6.1 hoặc 6/1)', maxlength: 12, size: 18, required: true, 'aria-label': 'Lớp', oninput: function (e) { var c = D.sync.normClass(e.target.value); root.querySelector('#cn').textContent = c ? '→ Lớp ' + c : ''; } }), h('span', { id: 'cn', class: 'tag g', 'aria-live': 'polite' }),
          h('span', { id: 'er', style: 'color:var(--bad);font-weight:600', role: 'alert' }), h('button', { class: 'btn', onclick: start }, open ? 'Làm bài mới' : 'Bắt đầu làm bài'),
          D.auth.isTeacher() ? h('button', { class: 'btn ghost', onclick: function () { printSheet(id, false); } }, 'In đề A4') : null,
          D.auth.isTeacher() ? h('button', { class: 'btn ghost', onclick: function () { printSheet(id, true); } }, 'In đề + đáp án') : h('a', { class: 'btn ghost', href: '#/teacher' }, '🔒 In đề (dành cho giáo viên)'))));
    }

    /* Giám sát: rời trang/cửa sổ, thoát toàn màn hình; chặn sao chép. Lần đầu chỉ nhắc nhở (không tính). */
    var wOn = false, overlay = null, P = null, fsWant = false, blockFns = null;
    function leave(why) {
      if (!wOn || !a || a.done || a.out) return; a.viol = a.viol || { n: 0, secs: 0, log: [] };
      a.out = Date.now(); a.viol.n++; a.viol.log.push({ at: new Date().toISOString(), why: why }); a.lastWhy = why; save();
    }
    function wantFS() { var el = document.documentElement; if (P.fullscreen && el.requestFullscreen && !document.fullscreenElement) { fsWant = true; try { var r = el.requestFullscreen(); if (r && r.catch) r.catch(function () { }); } catch (e) { } } }
    function back() {
      if (!wOn || !a || !a.out) return; var s = (Date.now() - a.out) / 1000; a.viol.secs += s; a.out = null; save();
      var n = a.viol.n, counted = Math.max(0, n - P.grace), auto = P.autoSubmit && n >= P.maxLeaves;
      if (auto) { a.byViol = true; finish(false, true); return; }
      if (overlay) overlay.remove();
      var msg = n <= P.grace ? 'Đây là lần NHẮC NHỞ đầu tiên, chưa bị tính. Từ lần sau, mỗi lần rời trang sẽ được tính và giáo viên sẽ xem xét.' : 'Lần này ĐÃ ĐƯỢC TÍNH (' + counted + ' lần bị tính). Giáo viên sẽ xem xét khi chấm điểm.';
      overlay = h('div', { role: 'alertdialog', 'aria-modal': 'true', 'aria-label': 'Cảnh báo rời trang làm bài', style: 'position:fixed;inset:0;z-index:100;background:rgba(80,10,10,.94);color:#fff;display:grid;place-items:center;padding:20px;text-align:center' },
        h('div', { style: 'max-width:540px' }, h('h2', { style: 'color:#ffd3d3' }, '⚠ Bạn vừa rời khỏi trang làm bài'),
          h('p', null, (a.lastWhy || '') + '. Lần thứ ' + n + ', vắng mặt khoảng ' + Math.round(s) + ' giây (tổng ' + Math.round(a.viol.secs) + ' giây).'),
          h('p', { style: 'font-weight:700' }, msg),
          P.autoSubmit ? h('p', null, 'Khi đạt ' + P.maxLeaves + ' lần rời trang, bài sẽ được NỘP TỰ ĐỘNG (còn ' + (P.maxLeaves - n) + ' lần).') : null,
          h('button', { class: 'btn', onclick: function () { overlay.remove(); overlay = null; wantFS(); } }, 'Tôi đã hiểu, tiếp tục làm bài')));
      document.body.appendChild(overlay); overlay.querySelector('button').focus();
    }
    function onVis() { if (document.hidden) leave('Chuyển tab / thu nhỏ trình duyệt'); else back(); }
    function onBlur() { leave('Chuyển sang cửa sổ/ứng dụng khác'); }
    function onFS() { if (wOn && fsWant && !document.fullscreenElement) { leave('Thoát chế độ toàn màn hình'); back(); } }
    function inRoot(t) { return t && t.nodeType && root.contains(t); }
    function watch(on) {
      if (on === wOn) return; wOn = on; var f = on ? 'addEventListener' : 'removeEventListener';
      if (on) {
        P = policy(id); a.viol = a.viol || { n: 0, secs: 0, log: [] };
        blockFns = {
          ctx: function (e) { if (inRoot(e.target)) { e.preventDefault(); a.viol.blocked = (a.viol.blocked || 0) + 1; } },
          cp: function (e) { if (inRoot(e.target)) { e.preventDefault(); a.viol.blocked = (a.viol.blocked || 0) + 1; } },
          sel: function (e) { if (inRoot(e.target) && !(e.target.closest && e.target.closest('input'))) e.preventDefault(); },
          key: function (e) { if ((e.ctrlKey || e.metaKey) && /^[cxuspa]$/i.test(e.key) && !(e.target && e.target.tagName === 'INPUT' && /^[a]$/i.test(e.key))) { if (/^[cxu]$/i.test(e.key)) e.preventDefault(); } }
        };
        if (P.block) { root.classList.add('noselect'); }
        wantFS();
      } else { fsWant = false; root.classList.remove('noselect'); if (document.fullscreenElement && document.exitFullscreen) { try { document.exitFullscreen().catch(function () { }); } catch (e) { } } }
      document[f]('visibilitychange', onVis); window[f]('blur', onBlur); window[f]('focus', back); document[f]('fullscreenchange', onFS);
      if (blockFns && P && P.block) { document[f]('contextmenu', blockFns.ctx); document[f]('copy', blockFns.cp); document[f]('cut', blockFns.cp); document[f]('paste', blockFns.cp); document[f]('selectstart', blockFns.sel); document[f]('keydown', blockFns.key); }
      if (!on && overlay) { overlay.remove(); overlay = null; }
    }
    function left() { return Math.max(0, a.start + a.minutes * 60000 - Date.now()); }
    function play() {
      clearInterval(timer); u.clear(root); watch(true); document.body.classList.add('inexam');
      var q = h('div', { class: 'qbox', id: 'q' }), nav = h('div', { class: 'nav', role: 'group', 'aria-label': 'Danh sách câu' }), tm = h('div', { class: 'timer', role: 'timer' });
      var side = h('aside', { class: 'side qbox' }, h('div', null, 'Thời gian còn lại'), tm, h('div', { class: 'note info', style: 'margin:8px 0;font-size:.8rem' }, 'Bài tự lưu nháp trên máy này.'), nav,
        h('div', { class: 'legend', style: 'margin:8px 0' }, h('span', null, h('i', { style: 'background:#dbe8f7' }), 'đã làm'), h('span', null, h('i', { style: 'background:#e0b45a' }), 'đánh dấu xem lại')),
        h('button', { class: 'btn', style: 'width:100%', onclick: function () { if (confirm('Nộp bài? Bạn không thể sửa sau khi nộp.')) finish(false); } }, 'Nộp bài'));
      root.appendChild(h('h2', null, m.title)); root.appendChild(h('div', { class: 'exam' }, q, side));
      function answered(i) { return i < 16 ? a.m[a.qo ? a.qo[i] : i] >= 0 : i === 16 ? a.t.some(function (x) { return x !== null; }) : norm(a.s) !== ''; }
      function tick() { var l = left(); tm.textContent = Math.floor(l / 60000) + ':' + ('0' + Math.floor(l / 1000) % 60).slice(-2); tm.className = 'timer' + (l < 60000 ? ' low' : ''); if (l <= 0) { clearInterval(timer); finish(true); } }
      function navDraw() { u.clear(nav); for (var i = 0; i < N; i++) (function (i) { nav.appendChild(h('button', { class: (answered(i) ? 'done ' : '') + (a.flags[i] ? 'flag ' : '') + (a.cur === i ? 'cur' : ''), 'aria-label': 'Câu ' + (i + 1) + (answered(i) ? ', đã làm' : ''), onclick: function () { a.cur = i; save(); show(); } }, String(i + 1))); })(i); }
      function show() {
        u.clear(q); var i = a.cur;
        if (i < 16) {
          var qi = a.qo ? a.qo[i] : i, mq = set.mcq[qi]; q.appendChild(h('h3', null, 'Câu ' + (i + 1) + '. ' + mq.q));
          var box = h('div', { role: 'radiogroup', 'aria-label': 'Phương án' });
          a.order[qi].forEach(function (orig, k) { box.appendChild(h('button', { class: 'opt', role: 'radio', 'aria-checked': a.m[qi] === k ? 'true' : 'false', onclick: function () { a.m[qi] = k; save(); show(); } }, h('b', null, 'ABCD'[k]), h('span', null, mq.opts[orig]))); });
          q.appendChild(box);
        } else if (i === 16) {
          q.appendChild(h('h3', null, 'Câu 17 (Đúng/Sai). ' + set.tf.prompt));
          set.tf.items.forEach(function (it, k) {
            function b(v, lab) { return h('button', { class: 'chip', 'aria-pressed': a.t[k] === v ? 'true' : 'false', onclick: function () { a.t[k] = v; save(); show(); } }, lab); }
            q.appendChild(h('div', { class: 'tfrow' }, h('span', null, 'abcd'[k] + ') ' + it.text), h('span', null, b(true, 'Đúng'), ' ', b(false, 'Sai'))));
          });
        } else {
          q.appendChild(h('h3', null, 'Câu 18 (Trả lời ngắn). ' + set.sa.prompt));
          q.appendChild(h('input', { class: 't', style: 'width:100%', maxlength: 80, value: a.s, 'aria-label': 'Câu trả lời', oninput: function (e) { a.s = e.target.value; save(); navDraw(); } }));
        }
        q.appendChild(h('div', { class: 'bar', style: 'margin-top:14px' },
          h('button', { class: 'btn ghost sm', disabled: i === 0, onclick: function () { a.cur--; save(); show(); } }, '← Câu trước'),
          h('button', { class: 'btn ghost sm', onclick: function () { a.flags[i] = !a.flags[i]; save(); show(); } }, a.flags[i] ? 'Bỏ đánh dấu' : 'Đánh dấu xem lại'),
          h('button', { class: 'btn sm', disabled: i === N - 1, onclick: function () { a.cur++; save(); show(); } }, 'Câu sau →')));
        navDraw();
      }
      show(); tick(); timer = setInterval(tick, 1000);
    }
    function finish(timeUp, byViol) {
      clearInterval(timer); watch(false); document.body.classList.remove('inexam');
      if (m.server) return finishRemote(timeUp, byViol);
      var d = grade(id, a), rec = { id: D.sync.uid(), viol: { n: (a.viol || {}).n || 0, counted: Math.max(0, ((a.viol || {}).n || 0) - policy(id).grace), advice: advice((a.viol || {}).n || 0, policy(id).grace), secs: Math.round((a.viol || {}).secs || 0), blocked: (a.viol || {}).blocked || 0, byViol: !!byViol, log: ((a.viol || {}).log || []).slice(0, 20) }, examId: id, title: m.title, name: a.name, cls: a.cls, score: d.total, max: 10, at: new Date().toISOString(), secs: Math.round((Date.now() - a.start) / 1000), timeUp: !!timeUp, src: 'local' };
      var okSave = saveResult(rec); S.del(key); a.done = true; review(d, timeUp, okSave, rec, byViol);
    }
    /* Đề giáo viên tải lên: máy chủ chấm (đáp án không nằm trong trình duyệt cho tới khi nộp). */
    function finishRemote(timeUp, byViol) {
      if (!a.aid) { a.aid = D.sync.uid(); save(); }
      var v = a.viol || {}, extra = { secs: Math.round((Date.now() - a.start) / 1000), leaves: v.n || 0, awaySecs: Math.round(v.secs || 0) };
      u.clear(root); var box = h('div', { class: 'qbox', role: 'status', 'aria-live': 'polite' }, h('h2', null, m.title), h('p', null, 'Đang nộp bài và chấm điểm…')); root.appendChild(box);
      D.examlib.submit(id, a, extra).then(function (j) {
        var det = j.detail, n = 0;
        set.mcq.forEach(function (q, i) { q.ans = det.m[i].ans; q.exp = det.m[i].exp; });
        set.tf.items.forEach(function (it, k) { it.ans = det.t[k].ans; it.exp = det.t[k].exp; });
        set.sa.ans = det.s.ans; set.sa.exp = det.s.exp; set.sa.alts = [];
        var d = { mcq: det.m.map(function (x) { return x.ok; }), tf: det.t.map(function (x) { return x.ok; }), sa: det.s.ok ? SA_PT : 0, total: j.score };
        var rec = { id: a.aid, viol: { n: v.n || 0, counted: Math.max(0, (v.n || 0) - policy(id).grace), advice: advice(v.n || 0, policy(id).grace), secs: Math.round(v.secs || 0), blocked: v.blocked || 0, byViol: !!byViol, log: (v.log || []).slice(0, 20) }, examId: id, title: m.title, name: a.name, cls: a.cls, score: j.score, max: 10, at: new Date().toISOString(), secs: extra.secs, timeUp: !!timeUp, src: 'server', sync: 'sent' };
        var okSave = saveResult(rec); S.del(key); a.done = true; review(d, timeUp, okSave, rec, byViol);
      }, function (e) {
        u.clear(box); box.appendChild(h('h2', null, m.title)); box.appendChild(h('div', { class: 'note bad' }, 'Chưa nộp được bài: ' + e.message + ' Bài làm của em vẫn được giữ trên máy. Hãy kiểm tra mạng rồi bấm "Nộp lại".'));
        box.appendChild(h('div', { class: 'bar', style: 'margin-top:10px' }, h('button', { class: 'btn', onclick: function () { finishRemote(timeUp, byViol); } }, 'Nộp lại')));
        if (/tối đa|đã đóng|không hợp lệ|Thiếu/.test(e.message)) box.appendChild(h('a', { class: 'btn ghost', href: '#/exams', style: 'margin-left:8px' }, 'Các đề khác'));
      });
    }
    function review(d, timeUp, okSave, rec, byViol) {
      u.clear(root); var wrap = h('div', null), syncBox = h('div', { class: 'note', role: 'status', 'aria-live': 'polite' });
      function paint(st, msg) { syncBox.className = 'note ' + (st === 'sent' ? 'ok' : st === 'failed' ? 'bad' : 'info'); u.clear(syncBox); syncBox.appendChild(document.createTextNode(st === 'sent' ? 'Đã gửi điểm về bảng điểm của tổ (máy chủ đã xác nhận).' : st === 'pending' ? 'Đang gửi điểm…' : st === 'failed' ? 'CHƯA gửi được điểm (' + (msg || 'lỗi mạng') + '). Điểm vẫn lưu trên máy này; hãy giữ trang, bật mạng rồi bấm Gửi lại.' : 'Chưa cấu hình gửi điểm: kết quả chỉ nằm trên máy này.')); if (st === 'failed') syncBox.appendChild(h('button', { class: 'btn sm', style: 'margin-left:8px', onclick: function () { D.sync.submit(rec, paint); } }, 'Gửi lại')); }
      if (rec && rec.src === 'server') paint('sent'); else if (rec) D.sync.submit(rec, paint);
      wrap.appendChild(h('div', { class: 'qbox' }, h('h2', null, m.title), byViol ? h('div', { class: 'note bad' }, 'Bài được NỘP TỰ ĐỘNG vì rời trang làm bài quá số lần cho phép.') : timeUp ? h('div', { class: 'note' }, 'Hết giờ — bài đã được nộp tự động.') : null,
        h('div', { class: 'score' }, u.fmt(d.total) + ' / 10'),
        h('p', null, 'Trắc nghiệm: ' + u.fmt(d.mcq.filter(Boolean).length * MCQ_PT) + '/8 · Đúng/Sai: ' + u.fmt(d.tf.filter(Boolean).length * TF_PT) + '/1 · Trả lời ngắn: ' + u.fmt(d.sa) + '/1'),
        (a.viol && a.viol.n) ? h('div', { class: 'note bad' }, 'Đã ghi nhận ' + a.viol.n + ' lần rời trang làm bài (tổng ' + Math.round(a.viol.secs) + ' giây): ' + rec.viol.advice + (rec.viol.counted ? ' — ' + rec.viol.counted + ' lần bị tính.' : ' — chưa bị tính.')) : null,
        syncBox,
        h('div', { class: 'note ' + (okSave ? 'ok' : 'bad') }, okSave ? 'Kết quả được lưu trong trình duyệt này (Bảng điểm). Việc gửi về tổ được báo ở khung phía trên.' : 'Không lưu được kết quả (trình duyệt chặn lưu trữ). Hãy chụp màn hình lại.'),
        h('div', { class: 'bar' }, h('button', { class: 'btn', onclick: function () { a = null; intro(); } }, 'Làm lại'), h('a', { class: 'btn ghost', href: '#/scores' }, 'Bảng điểm'), h('a', { class: 'btn ghost', href: '#/exams' }, 'Các đề khác'))));
      var set2 = set;
      set2.mcq.forEach(function (q0, i) {
        var qi = a.qo ? a.qo[i] : i, q = set.mcq[qi], pick = a.m[qi] < 0 ? -1 : a.order[qi][a.m[qi]], card = h('div', { class: 'qbox', style: 'margin-top:12px' }, h('h3', null, 'Câu ' + (i + 1) + '. ' + q.q));
        a.order[qi].forEach(function (orig, k) { var cls = 'opt' + (orig === q.ans ? ' right' : orig === pick ? ' wrong' : ''); card.appendChild(h('div', { class: cls }, h('b', null, 'ABCD'[k]), h('span', null, q.opts[orig] + (orig === q.ans ? '  ✔ đáp án đúng' : orig === pick ? '  ✘ bạn chọn' : '')))); });
        if (pick < 0) card.appendChild(h('p', { class: 'note' }, 'Bạn chưa trả lời câu này.'));
        card.appendChild(h('div', { class: 'exp' }, 'Giải thích: ' + q.exp)); wrap.appendChild(card);
      });
      var tc = h('div', { class: 'qbox', style: 'margin-top:12px' }, h('h3', null, 'Câu 17 (Đúng/Sai). ' + set.tf.prompt));
      set.tf.items.forEach(function (it, k) { tc.appendChild(h('div', { class: 'tfrow' }, h('span', null, 'abcd'[k] + ') ' + it.text), h('span', { class: 'tag ' + (d.tf[k] ? 'g' : 'h') }, 'Đáp án: ' + (it.ans ? 'Đúng' : 'Sai') + ' · bạn chọn: ' + (a.t[k] === null ? 'bỏ trống' : a.t[k] ? 'Đúng' : 'Sai')))); if (it.exp) tc.appendChild(h('div', { class: 'exp' }, it.exp)); });
      wrap.appendChild(tc);
      wrap.appendChild(h('div', { class: 'qbox', style: 'margin-top:12px' }, h('h3', null, 'Câu 18 (Trả lời ngắn). ' + set.sa.prompt), h('p', null, 'Bạn trả lời: ' + (a.s || '(bỏ trống)')), h('p', null, 'Đáp án: ' + set.sa.ans), h('div', { class: 'exp' }, set.sa.exp || '')));
      if (set.mcq.some(function (q) { return q.review; }) || set.review) wrap.appendChild(h('div', { class: 'note' }, 'Lưu ý: đề này có câu đánh dấu cần giáo viên rà soát lại nội dung.'));
      root.appendChild(wrap); window.scrollTo(0, 0);
    }
    if (a && a.done) a = null; intro();
    root._stop = function () { clearInterval(timer); watch(false); document.body.classList.remove('inexam'); };
  }

  /* In đề A4 (giữ nguyên thứ tự gốc; đáp án chỉ in khi chọn) */
  function printSheet(id, withKey) {
    if (!D.auth.guard()) return;
    var m = meta(id), set = D.examSets[id], box = document.getElementById('print'); u.clear(box);
    box.appendChild(h('div', { style: 'text-align:center' }, h('div', null, 'TRƯỜNG THCS ĐAK ĐOA — TỔ LỊCH SỬ - ĐỊA LÍ'), h('h2', null, m.title), h('div', null, 'Năm học ' + (u.store.get('year', D.school.year)) + ' · Thời gian: ' + m.minutes + ' phút · Họ tên: ................................ Lớp: ......')));
    box.appendChild(h('p', null, 'I. TRẮC NGHIỆM (8,0 điểm — mỗi câu 0,5 điểm). Chọn một đáp án đúng.'));
    set.mcq.forEach(function (q, i) { box.appendChild(h('div', { style: 'break-inside:avoid;margin-bottom:6px' }, h('b', null, 'Câu ' + (i + 1) + '. '), q.q, q.opts.map(function (o, k) { return h('div', { style: 'margin-left:1.2em' }, 'ABCD'[k] + '. ' + o); }))); });
    box.appendChild(h('p', null, 'II. ĐÚNG/SAI (1,0 điểm — mỗi ý 0,25 điểm).'));
    box.appendChild(h('div', { style: 'break-inside:avoid' }, h('b', null, 'Câu 17. '), set.tf.prompt, set.tf.items.map(function (it, k) { return h('div', { style: 'margin-left:1.2em' }, 'abcd'[k] + ') ' + it.text + '   ☐ Đúng   ☐ Sai'); })));
    box.appendChild(h('p', null, 'III. TRẢ LỜI NGẮN (1,0 điểm).'));
    box.appendChild(h('div', null, h('b', null, 'Câu 18. '), set.sa.prompt, h('div', null, 'Trả lời: ..............................................')));
    if (withKey) {
      box.appendChild(h('h3', { style: 'break-before:page' }, 'ĐÁP ÁN — ' + m.title));
      box.appendChild(h('p', null, 'Trắc nghiệm: ' + set.mcq.map(function (q, i) { return (i + 1) + '-' + 'ABCD'[q.ans]; }).join('  ')));
      box.appendChild(h('p', null, 'Đúng/Sai: ' + set.tf.items.map(function (it, k) { return 'abcd'[k] + '-' + (it.ans ? 'Đ' : 'S'); }).join('  ')));
      box.appendChild(h('p', null, 'Trả lời ngắn: ' + set.sa.ans));
    }
    box.appendChild(h('p', { style: 'font-size:.8em' }, 'Tổng điểm: 8,0 + 1,0 + 1,0 = 10 điểm.'));
    document.body.classList.add("printing"); setTimeout(function () { window.print(); document.body.classList.remove("printing"); }, 80);
  }
  D.exam = { policy: policy, advice: advice, render: render, printSheet: printSheet, grade: grade, norm: norm, build: build, results: results };
})();
