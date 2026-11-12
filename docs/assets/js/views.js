/* Các trang của cổng học tập. Mọi nội dung chèn vào DOM đều qua textContent (h()). */
(function () {
  var D = window.DD, u = D.u, h = u.h, S = u.store, V = {};
  var SUBJ = [['all', 'Tất cả'], ['history', 'Lịch sử'], ['geography', 'Địa lí'], ['integrated', 'Liên môn']];
  function pills(opts, cur, on) { var box = h('div', { class: 'bar', role: 'group' }); opts.forEach(function (o) { box.appendChild(h('button', { class: 'chip', 'aria-pressed': String(cur === o[0]), onclick: function () { on(o[0]); } }, o[1])); }); return box; }
  function gradeSel(cur, on) { var s = h('select', { 'aria-label': 'Khối', onchange: function (e) { on(e.target.value); } }); [['all', 'Mọi khối'], ['6', 'Khối 6'], ['7', 'Khối 7'], ['8', 'Khối 8'], ['9', 'Khối 9']].forEach(function (o) { s.appendChild(h('option', { value: o[0], selected: String(cur) === o[0] }, o[1])); }); return s; }
  function head(t, p) { return h('div', null, h('h1', null, t), p ? h('p', { style: 'color:var(--mut);max-width:70ch' }, p) : null); }

  /* TRANG CHỦ */
  V.home = function (root) {
    var art = h('div', { class: 'hero-art' }, h('img', { src: 'assets/art/drum.svg', alt: 'Mặt trống đồng Đông Sơn', width: 210, height: 210 }), h('canvas', { id: 'hg', width: 300, height: 300 }));
    var tnum = D.exams.length, cnum = D.cards.length, tl = D.timeline.length, mm = D.mindmaps.length;
    root.appendChild(h('section', { class: 'hero' },
      h('div', null, h('div', { class: 'eyebrow' }, 'Tổ Lịch sử - Địa lí · THCS Đak Đoa · Năm học ' + S.get('year', D.school.year)),
        h('h1', null, 'Cổng học tập số Lịch sử và Địa lí'),
        h('p', null, 'Ôn tập theo khối, làm bài trắc nghiệm có giải thích, xem trống đồng, quả địa cầu và bản đồ Việt Nam — chạy hoàn toàn trên trình duyệt, không cần cài đặt.'),
        h('div', { class: 'bar' }, h('a', { class: 'btn', href: '#/exams' }, 'Làm bài kiểm tra'), h('a', { class: 'btn ghost', href: '#/review' }, 'Ôn tập theo khối'), h('a', { class: 'btn ghost', href: '#/atlas' }, 'Quả địa cầu & Atlas')),
        h('div', { class: 'stat' }, [[tnum, 'đề kiểm tra'], [cnum, 'thẻ kiến thức'], [tl, 'mốc thời gian'], [mm, 'sơ đồ tư duy']].map(function (x) { return h('div', null, h('b', null, x[0]), x[1]); }))),
      art));
    var g = D.geoui.Globe(art.querySelector('canvas'), { labels: false }); g.spin(true);
    root._stop = function () { g.stop(); };
    root.appendChild(h('div', { class: 'section' }, h('h2', null, 'Lịch kiểm tra sắp tới'), scheduleList()));
    root.appendChild(h('div', { class: 'section' }, h('h2', null, 'Khám phá'), h('div', { class: 'grid' }, D.resources.map(function (r) { return h('a', { class: 'card', href: r.go, style: 'text-decoration:none;color:inherit' }, h('h3', null, r.t), h('p', { style: 'color:var(--mut);margin:0' }, r.d)); }))));
    root.appendChild(h('div', { class: 'section note info' }, 'Điểm số và bài làm được lưu ngay trên thiết bị này. Để đồng bộ nhiều máy cần cấu hình máy chủ riêng (xem mục Quản trị).'));
  };
  function scheduleList() { return h('div', { class: 'grid' }, D.schedule.map(function (s) { return h('div', { class: 'card' }, h('span', { class: 'tag h' }, s.who), h('h3', null, s.what), h('p', { style: 'color:var(--mut)' }, s.when), s.exam ? h('a', { class: 'btn sm', href: '#/exam/' + s.exam }, 'Mở đề') : null); })); }
  V.schedule = function (root) { root.appendChild(head('Lịch kiểm tra', 'Năm học ' + S.get('year', D.school.year) + '. Lịch do tổ chuyên môn công bố; trang web không tự khóa/mở đề.')); root.appendChild(scheduleList()); };

  /* NGÂN HÀNG ĐỀ */
  V.exams = function (root) {
    var st = { s: 'all', g: 'all', q: '' }, list = h('div', { class: 'grid' });
    function draw() {
      u.clear(list); var n = 0;
      D.examlib.all().forEach(function (e) {
        if (st.s !== 'all' && e.subject !== st.s) return; if (st.g !== 'all' && String(e.grade) !== st.g) return; if (st.q && e.title.toLowerCase().indexOf(st.q.toLowerCase()) < 0) return; n++;
        var best = D.exam.results().filter(function (r) { return r.examId === e.id; }).reduce(function (m, r) { return Math.max(m, r.score); }, -1);
        list.appendChild(h('div', { class: 'card' }, h('span', { class: u.tagCls(e.subject) }, u.subjName(e.subject)), h('span', { class: 'tag' }, 'Khối ' + e.grade), h('span', { class: 'tag' }, e.kind + ' · ' + e.minutes + ' phút'), h('h3', null, e.title),
          best >= 0 ? h('p', { class: 'tag g' }, 'Điểm cao nhất trên máy này: ' + u.fmt(best)) : null,
          h('div', { class: 'bar' }, h('a', { class: 'btn sm', href: '#/exam/' + e.id }, 'Vào thi'), (D.auth.isTeacher() ? h('button', { class: 'btn sm ghost', onclick: function () { D.exam.printSheet(e.id, false); } }, 'In đề') : h('a', { class: 'btn sm ghost lock', href: '#/teacher', title: 'Chỉ giáo viên trong tổ' }, '🔒 In đề')))));
      });
      if (!n) list.appendChild(h('p', null, 'Không có đề phù hợp.'));
    }
    var sp = h('div'); function bar() { u.clear(sp); sp.appendChild(pills(SUBJ, st.s, function (v) { st.s = v; bar(); draw(); })); } bar();
    root.appendChild(head('Ngân hàng đề kiểm tra', 'Mỗi đề gồm 16 câu trắc nghiệm, 1 câu Đúng/Sai 4 ý và 1 câu trả lời ngắn (tổng 10 điểm), có giải thích sau khi nộp. Nội dung do tổ chuyên môn rà soát trước khi dùng chính thức.'));
    root.appendChild(sp); root.appendChild(h('div', { class: 'bar' }, gradeSel(st.g, function (v) { st.g = v; draw(); }), h('input', { type: 'search', placeholder: 'Tìm đề…', 'aria-label': 'Tìm đề', oninput: function (e) { st.q = e.target.value; draw(); } })));
    root.appendChild(list); draw();
    if (D.examlib.enabled()) D.examlib.refresh().then(function () { if (root.isConnected) draw(); });
  };
  V.exam = function (root, id) {
    if (D.examSets[id] || !/^u-/.test(id)) return D.exam.render(root, id);
    root.appendChild(h('p', { role: 'status' }, 'Đang tải đề…'));
    D.examlib.ensure(id).then(function () { if (root.isConnected) { u.clear(root); D.exam.render(root, id); } }, function (e) { if (root.isConnected) { u.clear(root); root.appendChild(h('div', { class: 'note bad' }, 'Không tải được đề: ' + e.message)); root.appendChild(h('a', { class: 'btn', href: '#/exams' }, 'Về danh sách đề')); } });
  };

  /* ÔN TẬP: THẺ KIẾN THỨC */
  V.review = function (root) {
    var st = { s: 'all', g: 'all', q: '' }, list = h('div');
    function draw() {
      u.clear(list); var n = 0, chap = '';
      D.cards.filter(function (c) { return (st.s === 'all' || c.subject === st.s) && (st.g === 'all' || String(c.grade) === st.g) && (!st.q || (c.title + c.summary + c.points.join(' ')).toLowerCase().indexOf(st.q.toLowerCase()) >= 0); }).forEach(function (c) {
        n++; if (c.chapter !== chap) { chap = c.chapter; list.appendChild(h('h3', { style: 'margin-top:20px' }, (c.subject === 'history' ? 'Lịch sử ' : 'Địa lí ') + c.grade + ' — ' + c.chapter)); }
        list.appendChild(h('details', null, h('summary', null, c.title), h('p', { style: 'color:var(--mut)' }, c.summary), h('ul', null, c.points.map(function (p) { return h('li', null, p); })),
          c.terms && c.terms.length ? h('div', null, h('b', null, 'Thuật ngữ: '), c.terms.map(function (t) { return h('span', { class: 'tag' }, t.t + ': ' + t.d); })) : null,
          c.check && c.check.length ? h('div', { class: 'note info', style: 'margin-top:8px' }, h('b', null, 'Tự kiểm tra'), c.check.map(function (k) { return h('details', null, h('summary', null, k.q), h('p', null, k.a)); })) : null));
      });
      if (!n) list.appendChild(h('p', null, 'Không có thẻ phù hợp.'));
    }
    root.appendChild(head('Ôn tập theo khối', 'Tóm tắt bằng lời riêng của tổ, bám khung chương trình GDPT 2018. Tổ chuyên môn nên đối chiếu với sách giáo khoa đang dùng.'));
    var sp = h('div'); function bar() { u.clear(sp); sp.appendChild(pills(SUBJ.slice(0, 3), st.s, function (v) { st.s = v; bar(); draw(); })); } bar();
    root.appendChild(sp); root.appendChild(h('div', { class: 'bar' }, gradeSel(st.g, function (v) { st.g = v; draw(); }), h('input', { type: 'search', placeholder: 'Tìm trong thẻ…', 'aria-label': 'Tìm', oninput: function (e) { st.q = e.target.value; draw(); } })));
    root.appendChild(list); draw();
  };

  /* SƠ ĐỒ TƯ DUY */
  V.mindmaps = function (root) {
    var sel = h('select', { 'aria-label': 'Chọn sơ đồ' }, D.mindmaps.map(function (m) { return h('option', { value: m.id }, (m.subject === 'history' ? 'Lịch sử ' : 'Địa lí ') + m.grade + ' — ' + m.title); }));
    var box = h('div', { class: 'mm' }), st = { x: 0, y: 0, w: 900, h: 560 }, svg, sizes = { w: 900, h: 560 };
    var COL = ['#0b1f3a', '#1f5c99', '#0f7f7a', '#6b3fa0', '#b8863b'];
    function layout(n, d, ctx) { n._d = d; n._w = Math.min(320, Math.round(n.t.length * 8 + 44)); n._open = n._open !== false; var kids = n._open ? (n.c || []) : []; if (!kids.length) { n._y = ctx.y; ctx.y += 38; } else { kids.forEach(function (k) { layout(k, d + 1, ctx); }); n._y = (kids[0]._y + kids[kids.length - 1]._y) / 2; } n._kids = kids; }
    function draw() {
      var m = D.mindmaps.filter(function (x) { return x.id === sel.value; })[0]; var root = m.root; var ctx = { y: 20 }; layout(root, 0, ctx);
      var colx = []; (function cx(n) { colx[n._d] = Math.max(colx[n._d] || 0, n._w); n._kids.forEach(cx); })(root);
      var xs = [10]; for (var i = 1; i < colx.length; i++) xs[i] = xs[i - 1] + colx[i - 1] + 50;
      sizes.w = xs[xs.length - 1] + colx[colx.length - 1] + 20; sizes.h = ctx.y + 10; st.x = 0; st.y = 0; st.w = Math.max(sizes.w, 600); st.h = Math.max(sizes.h, 300);
      u.clear(box); svg = h('svg', { viewBox: [st.x, st.y, st.w, st.h].join(' '), role: 'img', 'aria-label': 'Sơ đồ tư duy: ' + m.title, preserveAspectRatio: 'xMidYMid meet' });
      (function paint(n) { n._kids.forEach(function (k) { var x1 = xs[n._d] + n._w, y1 = n._y, x2 = xs[k._d], y2 = k._y; svg.appendChild(h('path', { d: 'M' + x1 + ' ' + y1 + ' C' + (x1 + 25) + ' ' + y1 + ' ' + (x2 - 25) + ' ' + y2 + ' ' + x2 + ' ' + y2, fill: 'none', stroke: '#9aa7bd', 'stroke-width': 1.6 })); paint(k); }); })(root);
      (function paint(n) {
        var col = COL[Math.min(n._d, 4)], g = h('g', { class: 'hit', tabindex: (n.c && n.c.length) ? 0 : null, role: (n.c && n.c.length) ? 'button' : null, 'aria-label': n.t, onclick: function () { if (n.c && n.c.length) { n._open = !n._open; var s0 = { x: st.x, y: st.y, w: st.w, h: st.h }; draw(); } } });
        g.appendChild(h('rect', { x: xs[n._d], y: n._y - 15, width: n._w, height: 30, rx: 15, fill: col })); g.appendChild(h('text', { x: xs[n._d] + 13, y: n._y + 4 }, n.t));
        if (n.c && n.c.length) g.appendChild(h('text', { x: xs[n._d] + n._w - 12, y: n._y + 4, 'text-anchor': 'middle' }, n._open ? '–' : '+'));
        svg.appendChild(g); n._kids.forEach(paint);
      })(root);
      box.appendChild(svg); var tools = h('div', { class: 'tools' }, h('button', { class: 'btn sm', 'aria-label': 'Phóng to', onclick: function () { zoom(.8); } }, '+'), h('button', { class: 'btn sm', 'aria-label': 'Thu nhỏ', onclick: function () { zoom(1.25); } }, '–'), h('button', { class: 'btn sm ghost', onclick: function () { st = { x: 0, y: 0, w: Math.max(sizes.w, 600), h: Math.max(sizes.h, 300) }; vb(); } }, 'Vừa khung')); box.appendChild(tools);
      var dr = null; svg.addEventListener('pointerdown', function (e) { dr = { x: e.clientX, y: e.clientY, sx: st.x, sy: st.y }; }); svg.addEventListener('pointermove', function (e) { if (!dr) return; var k = st.w / svg.clientWidth; st.x = dr.sx - (e.clientX - dr.x) * k; st.y = dr.sy - (e.clientY - dr.y) * k; vb(); }); svg.addEventListener('pointerup', function () { dr = null; });
    }
    function vb() { svg.setAttribute('viewBox', [st.x, st.y, st.w, st.h].join(' ')); }
    function zoom(f) { var cx = st.x + st.w / 2, cy = st.y + st.h / 2; st.w *= f; st.h *= f; st.x = cx - st.w / 2; st.y = cy - st.h / 2; vb(); }
    sel.onchange = draw;
    root.appendChild(head('Sơ đồ tư duy', 'Bấm vào nhánh có dấu +/– để mở/thu gọn; kéo để di chuyển; dùng nút để phóng to, thu nhỏ.')); root.appendChild(h('div', { class: 'bar' }, sel)); root.appendChild(box); draw();
  };

  /* TUYẾN THỜI GIAN */
  V.timeline = function (root) {
    var st = { sc: 'vn', g: 'all' }, list = h('div');
    function draw() {
      u.clear(list); var ps = D.periods.filter(function (p) { return p.scope === st.sc; });
      ps.forEach(function (p) {
        var ev = D.timeline.filter(function (t) { return t.scope === st.sc && t.year >= p.from && t.year < p.to && (st.g === 'all' || String(t.grade) === st.g); }).sort(function (a, b) { return a.year - b.year; }); if (!ev.length) return;
        list.appendChild(h('div', { class: 'band', style: 'background:' + p.color }, p.title));
        list.appendChild(h('div', { class: 'tl' }, ev.map(function (t) { return h('div', { class: 'ev ' + t.scope }, h('b', { class: 'y' }, t.yearLabel), ' — ', h('b', null, t.title), h('div', null, t.text), h('span', { class: 'tag' }, 'Khối ' + t.grade + ' · ' + t.topic)); })));
      });
      if (!list.firstChild) list.appendChild(h('p', null, 'Không có mốc phù hợp.'));
    }
    var sp = h('div'); function bar() { u.clear(sp); sp.appendChild(pills([['vn', 'Việt Nam'], ['world', 'Thế giới']], st.sc, function (v) { st.sc = v; bar(); draw(); })); } bar();
    root.appendChild(head('Tuyến thời gian', 'Các mốc chính theo chương trình; năm trước Công nguyên ghi TCN.')); root.appendChild(sp); root.appendChild(h('div', { class: 'bar' }, gradeSel(st.g, function (v) { st.g = v; draw(); }))); root.appendChild(list); draw();
  };

  /* ĐỊA CẦU & ATLAS */
  V.atlas = function (root) {
    var gbox = h('div', { class: 'stage' }), canvas = h('canvas', { width: 700, height: 700 }); gbox.appendChild(canvas);
    var abox = h('div', { class: 'stage' }), info = h('div', { class: 'card', 'aria-live': 'polite' }, h('p', null, 'Bấm vào địa danh trên bản đồ để xem thông tin.'));
    var gl = null, at = null, tab = 'globe';
    var gtools = h('div', { class: 'bar' }), atools = h('div', { class: 'bar' });
    var gv = h('div', null, gtools, gbox, h('div', { class: 'legend', style: 'margin-top:8px' }, h('span', null, h('i', { style: 'background:#c0392b' }), 'Việt Nam'), h('span', null, h('i', { style: 'background:#ffe678' }), 'Xích đạo'), h('span', null, h('i', { style: 'background:#ffaa78' }), 'Chí tuyến'), h('span', null, h('i', { style: 'background:#a0e6ff' }), 'Vòng cực')), h('p', { class: 'note', style: 'margin-top:8px' }, 'Hình dạng lục địa được số hóa thủ công, độ chính xác cỡ vài độ — chỉ để học tập, không dùng để đo đạc.'));
    var av = h('div', { class: 'two' }, h('div', null, atools, abox), h('div', null, info, h('p', { class: 'note', style: 'margin-top:10px' }, 'Hoàng Sa (Đà Nẵng) và Trường Sa (Khánh Hòa) là hai quần đảo thuộc chủ quyền Việt Nam. Đường nét bản đồ là số hóa thủ công, mang tính minh họa.')));
    var body = h('div');
    function show(t) { tab = t; u.clear(body); body.appendChild(t === 'globe' ? gv : av); if (t === 'globe' && !gl) { gl = D.geoui.Globe(canvas, { labels: true }); } if (t === 'vn' && !at) { at = D.geoui.Atlas(abox, info); mk(); } tabs(); if (gl) gl.draw(); }
    function mk() { u.clear(atools); [['rivers', 'Sông'], ['mountains', 'Núi'], ['plateaus', 'Cao nguyên'], ['cities', 'Thành phố'], ['borders', 'Biên giới'], ['archipelagos', 'Hoàng Sa, Trường Sa'], ['extremes', 'Điểm cực'], ['seas', 'Tên biển']].forEach(function (l) { var b = h('button', { class: 'chip', 'aria-pressed': String(at.isOn(l[0])), onclick: function () { b.setAttribute('aria-pressed', String(at.toggle(l[0]))); } }, l[1]); atools.appendChild(b); }); atools.appendChild(h('button', { class: 'btn sm', 'aria-label': 'Phóng to', onclick: function () { at.zoomIn(); } }, '+')); atools.appendChild(h('button', { class: 'btn sm', 'aria-label': 'Thu nhỏ', onclick: function () { at.zoomOut(); } }, '–')); atools.appendChild(h('button', { class: 'btn sm ghost', onclick: function () { at.reset(); } }, 'Toàn cảnh')); atools.appendChild(h('button', { class: 'btn sm ghost', onclick: function () { at.goto('tay-nguyen'); } }, 'Tây Nguyên')); atools.appendChild(h('button', { class: 'btn sm ghost', onclick: function () { at.goto('hoang-sa'); } }, 'Hoàng Sa')); atools.appendChild(h('button', { class: 'btn sm ghost', onclick: function () { at.goto('truong-sa'); } }, 'Trường Sa')); }
    var tb = h('div'); function tabs() { u.clear(tb); tb.appendChild(pills([['globe', 'Quả địa cầu'], ['vn', 'Atlas Việt Nam']], tab, show)); }
    root.appendChild(head('Quả địa cầu & Atlas Việt Nam', 'Kéo để xoay quả địa cầu (hoặc dùng phím mũi tên). Chuyển sang Atlas để xem sông, núi, cao nguyên, biển đảo.')); root.appendChild(tb); root.appendChild(body); show('globe');
    // nút điều khiển địa cầu
    var spin = h('button', { class: 'chip', 'aria-pressed': 'false', onclick: function () { var on = gl.spin(!gl.isSpin()); spin.setAttribute('aria-pressed', String(on)); } }, 'Tự quay');
    gtools.appendChild(spin); gtools.appendChild(h('button', { class: 'chip', 'aria-pressed': 'true', onclick: function (e) { e.target.setAttribute('aria-pressed', String(gl.toggleLabels())); } }, 'Tên châu lục, đại dương'));
    gtools.appendChild(h('button', { class: 'chip', 'aria-pressed': 'true', onclick: function (e) { e.target.setAttribute('aria-pressed', String(gl.toggleGrat())); } }, 'Lưới kinh, vĩ tuyến'));
    gtools.appendChild(h('button', { class: 'btn sm ghost', onclick: function () { gl.focus(108, 14); } }, 'Về Việt Nam'));
    root._stop = function () { if (gl) gl.stop(); };
  };

  /* TRỐNG ĐỒNG */
  var RINGS = [['Tâm: ngôi sao', 'Ngôi sao nhiều cánh (14 tia) ở chính giữa mặt trống, tượng trưng cho Mặt Trời — trung tâm của vũ trụ trong tâm thức cư dân nông nghiệp lúa nước.'], ['Vành răng cưa và tam giác lông vũ', 'Các vành hình răng cưa, tam giác tạo nhịp điệu lan tỏa như tia nắng.'], ['Người hóa trang lông vũ', 'Hình người đội mũ lông chim, múa trong lễ hội — phản ánh đời sống tinh thần cư dân Đông Sơn.'], ['Chim Lạc bay', 'Hàng chim Lạc bay ngược chiều kim đồng hồ, gắn với truyền thuyết Lạc Việt; hình ảnh tiêu biểu trên trống Ngọc Lũ, Hoàng Hạ.'], ['Vòng tròn tiếp tuyến', 'Các vòng tròn có chấm giữa nối nhau, biểu tượng cho Mặt Trời và sự sinh sôi.']];
  V.drum = function (root) {
    root.appendChild(head('Trống đồng Đông Sơn', 'Biểu tượng của văn hóa Đông Sơn (khoảng thế kỉ VII TCN – thế kỉ I), thuộc thời Văn Lang – Âu Lạc.'));
    root.appendChild(h('div', { class: 'two' }, h('div', { class: 'stage', style: 'text-align:center' }, h('img', { src: 'assets/art/drum.svg', alt: 'Mặt trống đồng Đông Sơn do tổ vẽ lại: ngôi sao 14 tia ở tâm, người hóa trang lông vũ, chim Lạc bay và các vòng tròn tiếp tuyến', style: 'max-width:520px;width:100%' })),
      h('div', null, h('p', { class: 'note' }, 'Đây là bản vẽ lại mang tính minh họa dựa trên bố cục chung của các trống Đông Sơn (như trống Ngọc Lũ), không phải bản sao chính xác của một hiện vật cụ thể.'), RINGS.map(function (r) { return h('details', null, h('summary', null, r[0]), h('p', null, r[1])); }),
        h('p', null, 'Giá trị: trống đồng là nhạc cụ, vật quyền uy và là nguồn tư liệu quý về đời sống vật chất, tinh thần của cư dân Việt cổ.'))));
  };

  /* TRỢ LÝ AI — trung thực: chưa bật */
  V.ai = function (root) {
    var out = h('div', { 'aria-live': 'polite' });
    function search(q) {
      u.clear(out); q = q.trim().toLowerCase(); if (q.length < 2) return;
      var hits = D.cards.filter(function (c) { return (c.title + ' ' + c.summary + ' ' + c.points.join(' ') + ' ' + (c.terms || []).map(function (t) { return t.t + ' ' + t.d; }).join(' ')).toLowerCase().indexOf(q) >= 0; });
      var ev = D.timeline.filter(function (t) { return (t.title + ' ' + t.text).toLowerCase().indexOf(q) >= 0; });
      out.appendChild(h('p', null, hits.length + ' thẻ kiến thức, ' + ev.length + ' mốc thời gian phù hợp.'));
      hits.slice(0, 8).forEach(function (c) { out.appendChild(h('details', null, h('summary', null, c.title + ' (' + (c.subject === 'history' ? 'Sử' : 'Địa') + ' ' + c.grade + ')'), h('ul', null, c.points.map(function (p) { return h('li', null, p); })))); });
      ev.slice(0, 8).forEach(function (t) { out.appendChild(h('p', null, h('b', null, t.yearLabel + ': '), t.title + ' — ' + t.text)); });
    }
    root.appendChild(head('Trợ lý học tập'));
    root.appendChild(h('div', { class: 'note bad' }, h('b', null, 'Trợ lý AI chưa được bật. '), 'Phiên bản GitHub Pages là trang tĩnh, không có máy chủ nên không thể gọi mô hình AI một cách an toàn (khóa API không được để trong mã trình duyệt). Trang này không tạo câu trả lời giả.'));
    root.appendChild(h('div', { class: 'card', style: 'margin-top:14px' }, h('h3', null, 'Tra cứu trong kho kiến thức (hoạt động ngay, không cần AI)'), h('input', { class: 't', type: 'search', style: 'width:100%', placeholder: 'Ví dụ: Tây Sơn, Hoàng Sa, cao nguyên…', 'aria-label': 'Từ khóa', oninput: function (e) { search(e.target.value); } }), out));
    root.appendChild(h('details', null, h('summary', null, 'Muốn bật trợ lý AI thật? (cần thiết lập sau)'), h('ol', null, h('li', null, 'Tạo một máy chủ trung gian (Cloudflare Workers, Vercel hoặc Firebase Functions) giữ khóa API trong biến môi trường.'), h('li', null, 'Máy chủ nhận câu hỏi, giới hạn tần suất, gọi mô hình và trả lời.'), h('li', null, 'Bổ sung mã gọi địa chỉ máy chủ đó trong views.js (V.ai). Mã này CHƯA có sẵn trong phiên bản hiện tại — xem guide/BACKEND-AI.md.'), h('li', null, 'Không đặt khóa API vào mã chạy trên trình duyệt.'))));
  };

  /* BẢNG ĐIỂM */
  function csvEsc(s) { s = String(s == null ? '' : s); if (/^[=+\-@]/.test(s)) s = "'" + s; return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  function parseCSV(t) { var rows = [], r = [], f = '', q = false; for (var i = 0; i < t.length; i++) { var c = t[i]; if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { r.push(f); f = ''; } else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; r.push(f); f = ''; if (r.length > 1 || r[0] !== '') rows.push(r); r = []; } else f += c; } if (f !== '' || r.length) { r.push(f); rows.push(r); } return rows; }
  V.scores = function (root) {
    var box = h('div'), prev = h('div');
    function draw() {
      u.clear(box); var L = D.exam.results().slice().reverse();
      if (!L.length) { box.appendChild(h('p', null, 'Chưa có kết quả nào trên thiết bị này.')); return; }
      box.appendChild(h('div', { class: 'scroll' }, h('table', null, h('thead', null, h('tr', null, ['Thời gian', 'Họ tên', 'Lớp', 'Đề', 'Điểm', 'Rời trang', 'Điểm gợi ý sau trừ', 'Gửi về tổ', 'Nguồn'].map(function (x) { return h('th', null, x); }))), h('tbody', null, L.map(function (r) { return h('tr', null, h('td', null, new Date(r.at).toLocaleString('vi-VN')), h('td', null, r.name || '—'), h('td', null, r.cls || '—'), h('td', null, r.title), h('td', null, u.fmt(r.score) + '/10'), h('td', { style: (r.viol && r.viol.n) ? 'color:var(--bad);font-weight:700' : '' }, r.viol ? (r.viol.n ? r.viol.n + ' lần · ' + r.viol.secs + ' giây · ' + (r.viol.advice || D.exam.advice(r.viol.n, 1)) + (r.viol.byViol ? ' · tự nộp' : '') : '0') : '—'), h('td', null, sug(r)), h('td', null, r.src === 'import' ? '—' : ({ sent: 'Đã gửi', failed: 'CHƯA gửi', pending: 'Đang gửi', off: 'Không bật' })[r.sync] || '—'), h('td', null, r.src === 'import' ? 'nhập file' : 'làm trên máy')); })))));
    }
    function sug(r) { var c = r.viol ? (typeof r.viol.counted === 'number' ? r.viol.counted : Math.max(0, r.viol.n - 1)) : 0; return c ? u.fmt(Math.max(0, r.score - c * D.exam.policy(r.examId).deduct)) + ' (trừ ' + u.fmt(c * D.exam.policy(r.examId).deduct) + ')' : '—'; }
    function exportCSV() { var L = D.exam.results(); u.download('bang-diem.csv', '﻿' + ['name,cls,examId,score,at,leaves,awaySecs,counted,advice,suggestedScore'].concat(L.map(function (r) { return [r.name, r.cls, r.examId, r.score, r.at, r.viol ? r.viol.n : '', r.viol ? r.viol.secs : '', r.viol ? (typeof r.viol.counted === 'number' ? r.viol.counted : Math.max(0, r.viol.n - 1)) : '', r.viol ? (r.viol.advice || '') : '', (function () { var c = r.viol ? (typeof r.viol.counted === 'number' ? r.viol.counted : Math.max(0, r.viol.n - 1)) : 0; return c ? Math.max(0, r.score - c * D.exam.policy(r.examId).deduct) : r.score; })()].map(csvEsc).join(','); })).join('\n'), 'text/csv'); }
    function onFile(e) {
      var f = e.target.files[0]; if (!f) return; if (f.size > 2e6) { u.toast('File quá lớn (tối đa 2 MB).', 'bad'); return; }
      var rd = new FileReader(); rd.onload = function () {
        var rows = [], errs = [], txt = String(rd.result).replace(/^﻿/, '');
        try { if (/\.json$/i.test(f.name)) { var j = JSON.parse(txt); rows = (Array.isArray(j) ? j : j.results || []).map(function (x) { return [x.name, x.cls, x.examId, x.score, x.at]; }); } else { var c = parseCSV(txt); if (c.length && /name/i.test(c[0][0])) c.shift(); rows = c; } } catch (er) { u.toast('File không đọc được: ' + er.message, 'bad'); return; }
        var good = []; var ids = D.exams.map(function (x) { return x.id; }); function knownId(x) { return ids.indexOf(x) >= 0 || /^u-[0-9a-f]{6,}$/.test(x); }
        rows.forEach(function (r, i) { var sc = parseFloat(String(r[3]).replace(',', '.')), at = new Date(r[4]); if (!knownId(r[2])) errs.push('Dòng ' + (i + 1) + ': mã đề không có trong hệ thống'); else if (!isFinite(sc) || sc < 0 || sc > 10) errs.push('Dòng ' + (i + 1) + ': điểm phải từ 0 đến 10'); else if (isNaN(at)) errs.push('Dòng ' + (i + 1) + ': thời gian không hợp lệ'); else good.push({ examId: r[2], title: D.exams.filter(function (x) { return x.id === r[2]; })[0].title, name: String(r[0] || '').slice(0, 60), cls: String(r[1] || '').slice(0, 12), score: sc, max: 10, at: at.toISOString(), src: 'import', viol: (r[5] !== undefined && r[5] !== '' && isFinite(r[5])) ? { n: +r[5], secs: +r[6] || 0, log: [] } : undefined }); });
        u.clear(prev); prev.appendChild(h('div', { class: 'card' }, h('h3', null, 'Xem trước nhập điểm'), h('p', null, good.length + ' dòng hợp lệ, ' + errs.length + ' dòng lỗi (sẽ bỏ qua).'), errs.slice(0, 8).map(function (x) { return h('div', { class: 'note bad' }, x); }),
          good.length ? h('div', { class: 'bar' }, h('button', { class: 'btn', onclick: function () { var cur = D.exam.results(), seen = {}; cur.forEach(function (r) { seen[r.examId + r.at + r.name] = 1; }); var add = good.filter(function (r) { return !seen[r.examId + r.at + r.name]; }); S.set('results', cur.concat(add)); u.clear(prev); draw(); u.toast('Đã thêm ' + add.length + ' kết quả (bỏ qua ' + (good.length - add.length) + ' dòng trùng). Dữ liệu cũ không bị ghi đè.', 'ok'); } }, 'Xác nhận thêm vào bảng điểm'), h('button', { class: 'btn ghost', onclick: function () { u.clear(prev); } }, 'Hủy')) : null));
      }; rd.readAsText(f); e.target.value = '';
    }
    root.appendChild(head('Bảng điểm', 'Kết quả làm bài lưu trong trình duyệt này. Đây KHÔNG phải bảng điểm dùng chung: mỗi máy có dữ liệu riêng. Giáo viên có thể nhập file CSV/JSON để gộp.'));
    root.appendChild(h('div', { class: 'bar noprint' }, h('button', { class: 'btn sm', onclick: exportCSV }, 'Xuất CSV'), h('button', { class: 'btn sm ghost', onclick: function () { window.print(); } }, 'In'), D.sync.enabled() ? h('button', { class: 'btn sm alt', onclick: function () { D.sync.retryAll(function (ok, n) { u.toast(n ? 'Đã gửi lại ' + ok + '/' + n + ' bài.' : 'Không có bài nào chờ gửi.', ok === n ? 'ok' : 'bad'); draw(); }); } }, 'Gửi lại bài chưa gửi (' + D.sync.pending().length + ')') : null, h('label', { class: 'btn sm ghost' }, 'Nhập CSV/JSON ', h('input', { type: 'file', accept: '.csv,.json', style: 'display:none', onchange: onFile }))));
    root.appendChild(h('p', { class: 'note info noprint' }, 'Cột CSV: name, cls, examId, score (0–10), at (ngày giờ ISO), leaves và awaySecs (tuỳ chọn: số lần và số giây rời trang). Điểm trừ do giáo viên quyết định, hệ thống không tự trừ. Dữ liệu nhập luôn được xem trước và cần xác nhận, không tự ghi đè.')); root.appendChild(prev); root.appendChild(box); draw();
  };

  /* GIÁO VIÊN */
  function teacherBody(root) {
    root.appendChild(head('Công cụ giáo viên', 'Thống kê đề, in đề kèm đáp án, kiểm tra cấu trúc.'));
    root.appendChild(h('div', { class: 'scroll' }, h('table', null, h('thead', null, h('tr', null, ['Đề', 'Phân bố đáp án A/B/C/D', 'Mức độ', 'In'].map(function (x) { return h('th', null, x); }))), h('tbody', null, D.exams.filter(function (e) { return !e.hidden && !e.server && D.examSets[e.id]; }).map(function (e) {
      var s = D.examSets[e.id], c = [0, 0, 0, 0], lv = {}; s.mcq.forEach(function (q) { c[q.ans]++; lv[q.level] = (lv[q.level] || 0) + 1; });
      return h('tr', null, h('td', null, e.title), h('td', null, c.join(' / ') + (e.id === 'exam-int-8-gk' ? ' (giữ thứ tự gốc)' : ' (xáo khi thi)')), h('td', null, Object.keys(lv).map(function (k) { return k + ': ' + lv[k]; }).join(', ')), h('td', null, h('a', { class: 'btn sm', href: '#/xemde/' + e.id }, 'Xem đề + đáp án'), ' ', h('button', { class: 'btn sm ghost', onclick: function () { D.exam.printSheet(e.id, true); } }, 'In đề + đáp án')));
    })))));
    (function () {
      var box = h('div', { class: 'card', style: 'margin-top:16px' }, h('h3', null, 'Quy định chống gian lận khi làm bài'));
      box.appendChild(h('p', { style: 'color:var(--mut)' }, 'Áp dụng trên máy học sinh khi họ mở đề trên trang này. Lần rời trang đầu chỉ nhắc nhở; từ lần thứ hai được tính. Hệ thống chỉ GỢI Ý điểm sau trừ, không thay đổi điểm gốc — giáo viên quyết định. Cài đặt ở bảng này chỉ lưu trên máy này (dùng để thử). Muốn áp dụng cho mọi học sinh, sửa mục policy trong docs/assets/js/config.js rồi đẩy lại lên GitHub.'));
      var P = S.get('policy', {});
      box.appendChild(h('div', { class: 'bar' }, h('label', null, 'Điểm trừ gợi ý mỗi lần bị tính: ', h('input', { type: 'number', class: 't', min: 0, max: 2, step: 0.25, value: typeof P._deduct === 'number' ? P._deduct : 0.25, style: 'width:90px', onchange: function (e) { var q = S.get('policy', {}); q._deduct = Math.max(0, Math.min(2, parseFloat(e.target.value) || 0)); S.set('policy', q); u.toast('Đã lưu điểm trừ gợi ý.', 'ok'); } }))));
      box.appendChild(h('div', { class: 'scroll' }, h('table', null, h('thead', null, h('tr', null, ['Đề', 'Toàn màn hình', 'Tự nộp khi vi phạm', 'Ngưỡng (lần)'].map(function (x) { return h('th', null, x); }))), h('tbody', null, D.exams.map(function (e) {
        var cur = D.exam.policy(e.id);
        function set(k, val) { var q = S.get('policy', {}); q[e.id] = q[e.id] || {}; q[e.id][k] = val; S.set('policy', q); u.toast('Đã lưu quy định cho ' + e.code + ' — ' + u.subjName(e.subject) + ' ' + e.grade + '.', 'ok'); }
        return h('tr', null, h('td', null, e.title), h('td', null, h('input', { type: 'checkbox', checked: cur.fullscreen, 'aria-label': 'Toàn màn hình', onchange: function (x) { set('fullscreen', x.target.checked); } })),
          h('td', null, h('input', { type: 'checkbox', checked: cur.autoSubmit, 'aria-label': 'Tự nộp', onchange: function (x) { set('autoSubmit', x.target.checked); } })),
          h('td', null, h('input', { type: 'number', class: 't', min: 2, max: 10, value: cur.maxLeaves, style: 'width:80px', 'aria-label': 'Ngưỡng', onchange: function (x) { set('maxLeaves', Math.max(2, Math.min(10, parseInt(x.target.value, 10) || 3))); } })));
      })))));
      root.appendChild(box);
    })();
    root.appendChild(h('p', { class: 'note', style: 'margin-top:12px' }, 'Phân bố đáp án gốc lệch về A ở một số đề; khi học sinh làm bài, thứ tự phương án được xáo ngẫu nhiên theo từng lượt để giảm đoán mò. Đề kiểm tra liên môn lớp 8 giữ nguyên thứ tự gốc. Giáo viên nên rà soát nội dung các đề trước khi dùng chính thức.'));
  }



  V.teacher = function (root) {
    if (D.auth.isTeacher()) {
      root.appendChild(h('div', { class: 'note ok' }, 'Đã đăng nhập: ' + D.auth.who() + '. ', h('button', { class: 'btn sm ghost', onclick: function () { D.auth.logout(); location.reload(); } }, D.auth.remembered() ? 'Đăng xuất và quên thiết bị này' : 'Đăng xuất')));
      D.examup(root); teacherBody(root); siteEditor(root); return;
    }
    root.appendChild(head('Khu vực giáo viên', 'Xem đề, đáp án, in đề, thống kê và chỉnh sửa thông tin trang chỉ dành cho giáo viên trong Tổ Lịch sử - Địa lí.'));
    if (D.auth.remembered() && D.auth.enabled()) { var ab = h('div', { class: 'note', role: 'status' }, 'Thiết bị đã được nhớ — đang đăng nhập tự động…'); root.appendChild(ab); D.auth.auto().then(function (ok) { if (ok) location.reload(); else { ab.textContent = 'Thiết bị đã hết hạn ghi nhớ hoặc không còn quyền. Hãy đăng nhập bằng mã gmail.'; ab.className = 'note bad'; } }); }
    if (!D.auth.enabled()) root.appendChild(h('div', { class: 'note bad' }, 'Đăng nhập bằng mã gửi qua gmail cần máy chủ Google của tổ. Chưa cấu hình: xem guide/GOOGLE-SHEET.md (điền syncUrl trong config.js). Khi chưa cấu hình, khu vực này bị khoá.'));
    var mail = h('input', { class: 't', type: 'email', autocomplete: 'email', placeholder: 'Gmail đã đăng ký với tổ', 'aria-label': 'Gmail', style: 'width:100%' });
    var code = h('input', { class: 't', type: 'text', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: 6, placeholder: 'Mã 6 số', 'aria-label': 'Mã 6 số', style: 'width:100%;letter-spacing:.3em;font-size:1.2rem' });
    var rem = h('input', { type: 'checkbox', id: 'remdev' }), status = h('div', { role: 'status', 'aria-live': 'polite', style: 'margin:10px 0;font-weight:600' }), step2 = h('div', { hidden: true }), busy = false, wait = 0, tick = 0;
    var sendBtn = h('button', { class: 'btn', disabled: !D.auth.enabled(), onclick: send }, 'Gửi mã vào gmail');
    var okBtn = h('button', { class: 'btn', onclick: check }, 'Đăng nhập');
    function say(t, bad) { status.style.color = bad ? 'var(--bad)' : ''; status.textContent = t; }
    function cool() { clearInterval(tick); wait = 60; sendBtn.disabled = true; tick = setInterval(function () { wait--; if (wait <= 0) { clearInterval(tick); sendBtn.disabled = !D.auth.enabled(); sendBtn.textContent = 'Gửi lại mã'; } else sendBtn.textContent = 'Gửi lại mã (' + wait + ' giây)'; }, 1000); sendBtn.textContent = 'Gửi lại mã (60 giây)'; }
    function send() {
      if (busy) return; if (!/^\S+@\S+\.\S+$/.test(mail.value.trim())) return say('Hãy nhập đúng địa chỉ gmail.', true);
      busy = true; say('Đang gửi…');
      D.auth.sendCode(mail.value).then(function (j) { cool(); step2.hidden = false; say(j.message || 'Nếu gmail có trong danh sách giáo viên, mã đã được gửi (kiểm tra cả mục Spam). Mã có hiệu lực 10 phút.'); code.focus(); }, function (e) { say(e.message, true); }).then(function () { busy = false; });
    }
    function check() {
      if (busy) return; if (!/^\d{6}$/.test(code.value.trim())) return say('Mã gồm đúng 6 chữ số.', true);
      busy = true; say('Đang kiểm tra…');
      D.auth.verifyCode(mail.value, code.value.trim(), rem.checked).then(function (j) { say('Xin chào ' + j.name + '. Đang vào…'); setTimeout(function () { location.reload(); }, 300); }, function (e) { busy = false; say(e.message, true); });
    }
    mail.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); }); code.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
    step2.appendChild(h('label', { style: 'display:block;margin:10px 0' }, h('b', null, 'Nhập mã vừa nhận trong gmail'), code)); step2.appendChild(h('label', { style: 'display:block;margin:10px 0;font-weight:400' }, rem, ' Ghi nhớ thiết bị này 30 ngày, lần sau không cần mã ', h('small', { style: 'color:var(--mut)' }, '(chỉ chọn trên máy/điện thoại của riêng bạn, đừng chọn ở máy dùng chung)'))); step2.appendChild(okBtn);
    root._stop = function () { clearInterval(tick); };
    root.appendChild(h('div', { class: 'card', style: 'max-width:520px' }, h('h3', null, 'Đăng nhập bằng mã gửi qua gmail'),
      h('ol', null, h('li', null, 'Nhập gmail của bạn (đã đăng ký với tổ), bấm "Gửi mã vào gmail".'), h('li', null, 'Mở gmail, lấy mã 6 số (có hiệu lực 10 phút).'), h('li', null, 'Nhập mã và bấm "Đăng nhập".')),
      h('label', { style: 'display:block;margin:10px 0' }, h('b', null, 'Gmail'), mail), sendBtn, status, step2));
    root.appendChild(h('p', { class: 'note', style: 'margin-top:14px;max-width:640px' }, 'Lưu ý: đây là cổng giao diện để học sinh không xem/in đề. Trang chạy trên trình duyệt nên người rành kĩ thuật vẫn có thể đọc dữ liệu đề trong mã nguồn; không dùng để giữ bí mật đề thi chính thức.'));
  };

  /* CHỈNH SỬA THÔNG TIN TRANG (xuất tệp site.js để thay trên GitHub) */
  function siteEditor(root) {
    var cur = S.get('siteDraft', null) || D.site || {}, st = JSON.parse(JSON.stringify({ principal: cur.principal || '', phone: cur.phone || D.school.phone, address: cur.address || D.school.address, tech: cur.tech || '', teachers: cur.teachers || [], schedule: D.schedule }));
    var box = h('div', { class: 'card', style: 'margin-top:18px' }), listT = h('div'), listS = h('div');
    function field(label, key, ph) { return h('label', { style: 'display:block;margin:8px 0' }, h('b', null, label), h('input', { class: 't', style: 'width:100%', value: st[key], placeholder: ph || '', oninput: function (e) { st[key] = e.target.value; } })); }
    function drawT() {
      u.clear(listT);
      st.teachers.forEach(function (t, i) {
        listT.appendChild(h('div', { class: 'bar' },
          h('input', { class: 't', value: t.name, style: 'flex:1;min-width:200px', 'aria-label': 'Họ tên', oninput: function (e) { t.name = e.target.value; } }),
          h('select', { class: 't', 'aria-label': 'Vai trò', onchange: function (e) { t.role = e.target.value; } }, [['', 'Giáo viên'], ['TT', 'TT — Tổ trưởng'], ['TP', 'TP — Tổ phó']].map(function (o) { return h('option', { value: o[0], selected: (t.role || '') === o[0] }, o[1]); })),
          h('button', { class: 'btn sm ghost', 'aria-label': 'Lên', disabled: i === 0, onclick: function () { st.teachers.splice(i - 1, 0, st.teachers.splice(i, 1)[0]); drawT(); } }, '↑'),
          h('button', { class: 'btn sm ghost', 'aria-label': 'Xuống', disabled: i === st.teachers.length - 1, onclick: function () { st.teachers.splice(i + 1, 0, st.teachers.splice(i, 1)[0]); drawT(); } }, '↓'),
          h('button', { class: 'btn sm danger', onclick: function () { if (confirm('Xoá "' + t.name + '" khỏi danh sách? (chỉ xoá khỏi danh sách hiển thị)')) { st.teachers.splice(i, 1); drawT(); } } }, 'Xoá')));
      });
      var n = h('input', { class: 't', placeholder: 'Họ tên mới (vd: Cô Nguyễn Văn B)', style: 'flex:1;min-width:200px', 'aria-label': 'Họ tên mới' });
      listT.appendChild(h('div', { class: 'bar', style: 'margin-top:10px' }, n, h('button', { class: 'btn sm', onclick: function () { if (!n.value.trim()) return; st.teachers.push({ name: n.value.trim(), role: '' }); drawT(); } }, '+ Thêm vào danh sách hiển thị')));
      listT.appendChild(h('p', { style: 'font-size:.85rem;color:var(--mut)' }, 'Danh sách này chỉ để HIỂN THỊ ở chân trang. Quyền đăng nhập giáo viên được quản lý riêng trong Google Sheet (trang "GiaoVien") — thêm/xoá người ở đó.'));
    }
    function drawS() {
      u.clear(listS);
      st.schedule.forEach(function (x, i) {
        listS.appendChild(h('div', { class: 'bar' }, h('input', { class: 't', value: x.when, placeholder: 'Thời gian', style: 'width:200px', oninput: function (e) { x.when = e.target.value; } }), h('input', { class: 't', value: x.who, placeholder: 'Khối', style: 'width:110px', oninput: function (e) { x.who = e.target.value; } }),
          h('input', { class: 't', value: x.what, placeholder: 'Nội dung', style: 'flex:1;min-width:220px', oninput: function (e) { x.what = e.target.value; } }),
          h('select', { class: 't', 'aria-label': 'Đề', onchange: function (e) { x.exam = e.target.value || null; } }, [h('option', { value: '' }, '(không gắn đề)')].concat(D.exams.map(function (d) { return h('option', { value: d.id, selected: x.exam === d.id }, d.title.slice(0, 48)); }))),
          h('button', { class: 'btn sm danger', onclick: function () { st.schedule.splice(i, 1); drawS(); } }, 'Xoá')));
      });
      listS.appendChild(h('button', { class: 'btn sm', onclick: function () { st.schedule.push({ when: '', who: '', what: '', exam: null }); drawS(); } }, '+ Thêm lịch'));
    }
    function finalize() {
      return Promise.resolve({ principal: st.principal.trim(), phone: st.phone.trim(), address: st.address.trim(), tech: st.tech.trim(), teachers: st.teachers.map(function (t) { return { name: String(t.name).trim(), role: t.role || '' }; }).filter(function (t) { return t.name; }), schedule: st.schedule.filter(function (x) { return x.what || x.when; }) });
    }
    box.appendChild(h('h3', null, 'Chỉnh sửa thông tin trang'));
    box.appendChild(h('p', { style: 'color:var(--mut)' }, 'Sửa các ô bên dưới → bấm "Xem thử" để thấy ngay trên máy này → bấm "Tải tệp site.js" rồi thay vào GitHub để mọi người cùng thấy.'));
    box.appendChild(field('Hiệu trưởng (để trống = không hiển thị)', 'principal')); box.appendChild(field('Phụ trách kỹ thuật', 'tech')); box.appendChild(field('Điện thoại trường', 'phone')); box.appendChild(field('Địa chỉ', 'address'));
    box.appendChild(h('h4', { style: 'margin-top:14px' }, 'Giáo viên trong tổ')); box.appendChild(listT);
    box.appendChild(h('h4', { style: 'margin-top:14px' }, 'Lịch kiểm tra (hiện ở thanh thông báo và trang chủ)')); box.appendChild(listS);
    box.appendChild(h('div', { class: 'bar', style: 'margin-top:16px' },
      h('button', { class: 'btn alt', onclick: function () { finalize().then(function (o) { S.set('siteDraft', o); D.applySite(); u.toast('Đã áp dụng bản xem thử trên máy này (học sinh chưa thấy).', 'ok'); }, function (e) { u.toast(e.message, 'bad'); }); } }, 'Xem thử'),
      h('button', { class: 'btn', onclick: function () { finalize().then(function (o) { u.download('site.js', "/* THÔNG TIN TRANG — xem hướng dẫn trong guide/EDIT-SITE.md. */\n(function(){var D=(window.DD=window.DD||{});D.site=" + JSON.stringify(o, null, 1) + ";})();\n", 'application/javascript'); }, function (e) { u.toast(e.message, 'bad'); }); } }, 'Tải tệp site.js'),
      h('button', { class: 'btn ghost', onclick: function () { S.del('siteDraft'); location.reload(); } }, 'Bỏ bản xem thử')));
    box.appendChild(h('details', null, h('summary', null, 'Cách đưa thay đổi lên GitHub (để mọi học sinh thấy)'), h('ol', null,
      h('li', null, 'Bấm "Tải tệp site.js" (tệp được tải về máy).'), h('li', null, 'Vào kho GitHub của tổ → mở thư mục docs/assets/js/data.'), h('li', null, 'Bấm Add file → Upload files → kéo tệp site.js vào (cùng tên, sẽ thay tệp cũ) → Commit changes.'),
      h('li', null, 'Đợi 1–2 phút rồi tải lại trang (Ctrl+F5). Xong.'), h('li', null, 'Sau đó bấm "Bỏ bản xem thử" trên máy này để không còn xem bản nháp.'))));
    root.appendChild(box); drawT(); drawS();
  }

  /* XEM ĐỀ + ĐÁP ÁN (chỉ giáo viên đăng nhập) */
  V.xemde = function (root, id) {
    if (D.auth.isTeacher() && !D.examlib.hasFull(id) && /^u-/.test(id)) { root.appendChild(h('p', { role: 'status' }, 'Đang tải đề…')); return D.examlib.ensureTeacher(id).then(function () { if (root.isConnected) { u.clear(root); xemde(root, id); } }, function (e) { if (root.isConnected) { u.clear(root); root.appendChild(h('div', { class: 'note bad' }, e.message)); } }); }
    xemde(root, id);
  };
  function xemde(root, id) {
    var m = D.exams.filter(function (x) { return x.id === id; })[0], s = D.examSets[id];
    if (!D.auth.isTeacher()) { root.appendChild(head('Chỉ dành cho giáo viên')); root.appendChild(h('p', null, 'Hãy đăng nhập bằng mã gửi qua gmail của bạn để xem đề và đáp án.')); root.appendChild(h('a', { class: 'btn', href: '#/teacher' }, 'Đăng nhập giáo viên')); return; }
    if (!m || !s) { root.appendChild(h('div', { class: 'note bad' }, 'Không tìm thấy đề.')); return; }
    root.appendChild(h('div', { class: 'bar noprint' }, h('a', { class: 'btn ghost sm', href: '#/teacher' }, '← Quay lại'), h('button', { class: 'btn sm', onclick: function () { D.exam.printSheet(id, true); } }, 'In đề + đáp án')));
    root.appendChild(head(m.title, 'Đáp án đúng được tô xanh. Chỉ giáo viên đã đăng nhập mới thấy trang này.'));
    s.mcq.forEach(function (q, i) { root.appendChild(h('div', { class: 'qbox', style: 'margin-top:10px' }, h('h3', null, 'Câu ' + (i + 1) + '. ' + q.q), q.opts.map(function (o, k) { return h('div', { class: 'opt' + (k === q.ans ? ' right' : '') }, h('b', null, 'ABCD'[k]), h('span', null, o)); }), h('div', { class: 'exp' }, 'Giải thích: ' + q.exp))); });
    root.appendChild(h('div', { class: 'qbox', style: 'margin-top:10px' }, h('h3', null, 'Câu 17 (Đúng/Sai). ' + s.tf.prompt), s.tf.items.map(function (it, k) { return h('div', { class: 'tfrow' }, h('span', null, 'abcd'[k] + ') ' + it.text), h('span', { class: 'tag g' }, it.ans ? 'Đúng' : 'Sai')); })));
    root.appendChild(h('div', { class: 'qbox', style: 'margin-top:10px' }, h('h3', null, 'Câu 18 (Trả lời ngắn). ' + s.sa.prompt), h('p', null, 'Đáp án: ' + s.sa.ans), h('div', { class: 'exp' }, s.sa.exp || '')));
  };

  /* QUẢN TRỊ — sao lưu / khôi phục cục bộ */
  V.admin = function (root) {
    var prev = h('div');
    function all() { var d = {}; S.keys().forEach(function (k) { d[k] = S.get(k); }); return { app: 'dakdoa-portal', version: 1, exportedAt: new Date().toISOString(), data: d }; }
    function onFile(e) {
      var f = e.target.files[0]; if (!f) return; var rd = new FileReader(); rd.onload = function () {
        var j; try { j = JSON.parse(rd.result); } catch (er) { u.toast('Không phải JSON hợp lệ.', 'bad'); return; } if (!j || j.app !== 'dakdoa-portal' || typeof j.data !== 'object') { u.toast('File không phải bản sao lưu của cổng này.', 'bad'); return; }
        var ks = Object.keys(j.data).filter(function (k) { return /^(results|year|attempt:[\w-]+)$/.test(k); }); u.clear(prev);
        prev.appendChild(h('div', { class: 'card' }, h('h3', null, 'Xem trước khôi phục'), h('p', null, 'Bản sao lưu ngày ' + (j.exportedAt || '?') + ', gồm ' + ks.length + ' mục; kết quả: ' + ((j.data.results || []).length) + '.'),
          h('div', { class: 'bar' }, h('button', { class: 'btn', onclick: function () { var cur = S.get('results', []), seen = {}; cur.forEach(function (r) { seen[r.examId + r.at + r.name] = 1; }); var add = (j.data.results || []).filter(function (r) { return r && r.examId && isFinite(r.score) && !seen[r.examId + r.at + r.name]; }); S.set('results', cur.concat(add)); u.clear(prev); u.toast('Đã gộp ' + add.length + ' kết quả mới. Dữ liệu hiện có được giữ nguyên.', 'ok'); } }, 'Gộp vào dữ liệu hiện có'), h('button', { class: 'btn danger', onclick: function () { if (!confirm('Thay thế toàn bộ kết quả hiện có bằng bản sao lưu? Nên xuất bản sao lưu trước.')) return; S.set('results', j.data.results || []); u.clear(prev); u.toast('Đã thay thế kết quả.', 'ok'); } }, 'Thay thế'), h('button', { class: 'btn ghost', onclick: function () { u.clear(prev); } }, 'Hủy'))));
      }; rd.readAsText(f); e.target.value = '';
    }
    root.appendChild(head('Quản trị', 'Phiên bản GitHub Pages là trang tĩnh: không có tài khoản, không có mật khẩu quản trị, không có cơ sở dữ liệu dùng chung.'));
    root.appendChild(h('div', { class: 'note bad' }, 'Đăng nhập, đăng ký và đồng bộ nhiều máy hiện CHƯA có. Các tính năng này cần máy chủ (xem README, mục "Nâng cấp"). Giao diện không giả lập thành công.'));
    root.appendChild(h('div', { class: 'grid', style: 'margin-top:14px' },
      h('div', { class: 'card' }, h('h3', null, 'Năm học'), h('select', { class: 't', 'aria-label': 'Năm học', onchange: function (e) { S.set('year', e.target.value); u.toast('Đã đặt năm học ' + e.target.value, 'ok'); } }, D.school.years.map(function (y) { return h('option', { value: y, selected: y === S.get('year', D.school.year) }, y); })), h('p', { style: 'color:var(--mut)' }, 'Mặc định ' + D.school.year + '. Chỉ ảnh hưởng hiển thị trên máy này.')),
      h('div', { class: 'card' }, h('h3', null, 'Sao lưu'), h('p', null, 'Xuất toàn bộ kết quả và bài làm dở ra file JSON.'), h('button', { class: 'btn', onclick: function () { u.download('sao-luu-dakdoa-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(all(), null, 1)); } }, 'Tải bản sao lưu')),
      h('div', { class: 'card' }, h('h3', null, 'Khôi phục'), h('p', null, 'Chọn file sao lưu để xem trước rồi gộp hoặc thay thế (cần xác nhận).'), h('label', { class: 'btn alt' }, 'Chọn file ', h('input', { type: 'file', accept: '.json', style: 'display:none', onchange: onFile }))),
      h('div', { class: 'card' }, h('h3', null, 'Lưu trữ trình duyệt'), h('p', null, S.persistent ? 'Hoạt động. Dữ liệu chỉ nằm trên thiết bị này và có thể mất nếu xóa dữ liệu duyệt web.' : 'Bị chặn: dữ liệu chỉ tồn tại đến khi đóng trang.'), h('button', { class: 'btn danger', onclick: function () { if (confirm('Xóa TOÀN BỘ kết quả và bài làm dở trên máy này? Hãy sao lưu trước.')) { S.keys().forEach(function (k) { S.del(k); }); u.toast('Đã xóa dữ liệu cục bộ.', 'ok'); } } }, 'Xóa dữ liệu cục bộ'))));
    root.appendChild(prev);
  };

  /* GIỚI THIỆU / CÀI ĐẶT ỨNG DỤNG */
  V.about = function (root) {
    root.appendChild(head('Giới thiệu & cài đặt'));
    root.appendChild(h('div', { class: 'card' }, h('h3', null, D.school.name + ' — ' + D.school.dept), h('p', null, 'Địa chỉ: ' + D.school.address), h('p', null, 'Điện thoại: ' + D.school.phone), D.school.principal ? h('p', null, 'Hiệu trưởng: ' + D.school.principal) : null, D.school.tech ? h('p', null, 'Phụ trách kỹ thuật: ' + D.school.tech) : null));
    root.appendChild(h('div', { class: 'card', style: 'margin-top:14px' }, h('h3', null, 'Thêm vào màn hình chính'), h('p', null, 'Android (Chrome): menu ⋮ → "Thêm vào màn hình chính". iPhone (Safari): nút Chia sẻ → "Thêm vào MH chính". Sau lần mở đầu có mạng, trang có thể mở lại khi không có mạng (nếu trình duyệt cho phép lưu bộ nhớ đệm).')));
  };
  window.DD.views = V;
})();
