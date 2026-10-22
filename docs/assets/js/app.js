/* Bộ định tuyến theo hash (#/...) — hoạt động trên GitHub Pages và khi mở file trực tiếp. */
(function () {
  var D = window.DD, u = D.u, h = u.h, S = u.store;
  var NAV = [['#/home', 'Trang chủ'], ['#/exams', 'Kiểm tra'], ['#/review', 'Ôn tập'], ['#/atlas', 'Địa cầu & Atlas'], ['#/timeline', 'Thời gian'], ['#/mindmaps', 'Sơ đồ tư duy'], ['#/drum', 'Trống đồng'], ['#/ai', 'Trợ lý'], ['#/scores', 'Bảng điểm'], ['#/teacher', 'Giáo viên'], ['#/admin', 'Quản trị']];
  var main = document.getElementById('main'), nav = document.getElementById('nav'), cur = null;
  NAV.forEach(function (n) { nav.appendChild(h('a', { href: n[0], 'data-r': n[0] }, n[1])); });
  document.getElementById('menu').addEventListener('click', function (e) { var o = nav.classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', String(o)); });
  var ys = document.getElementById('year');
  D.school.years.forEach(function (y) { ys.appendChild(h('option', { value: y, selected: y === S.get('year', D.school.year) }, y)); });
  ys.addEventListener('change', function () { S.set('year', ys.value); render(); });
  var bar = document.getElementById('alert');
  (function () { var s = D.schedule[0]; bar.querySelector('span').textContent = 'Lịch kiểm tra: ' + s.who + ' — ' + s.what + ' (' + s.when + ')'; bar.querySelector('a').setAttribute('href', '#/exam/' + s.exam); bar.querySelector('button').addEventListener('click', function () { bar.hidden = true; }); })();
  function render() {
    if (main._stop) { try { main._stop(); } catch (e) { } main._stop = null; }
    var hash = location.hash || '#/home', parts = hash.replace(/^#\//, '').split('/'), name = parts[0] || 'home';
    if (name === 'schedule' || name === 'resources') name = name === 'resources' ? 'home' : name;
    var view = D.views[name] || D.views.home; u.clear(main);
    var wrap = h('div', { class: 'wrap' }); main.appendChild(wrap); wrap._stop = null;
    try { view(wrap, parts[1]); } catch (err) { wrap.appendChild(h('div', { class: 'note bad' }, 'Không hiển thị được trang này: ' + err.message)); if (window.console) console.error(err); }
    main._stop = function () { if (wrap._stop) wrap._stop(); };
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) { if (a.getAttribute('data-r') === '#/' + name || (name === 'exam' && a.getAttribute('data-r') === '#/exams')) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    document.title = (name === 'home' ? '' : (NAV.filter(function (n) { return n[0] === '#/' + name; }).map(function (n) { return n[1] + ' · '; })[0] || '')) + 'Lịch sử & Địa lí — THCS Đak Đoa';
    nav.classList.remove('open'); if (name !== cur) { window.scrollTo(0, 0); if (cur !== null) main.focus({ preventScroll: true }); } cur = name;
  }
  window.addEventListener('hashchange', render); render();
  // Chân trang
  var f = document.getElementById('foot'), s = D.school;
  f.appendChild(h('div', null, h('h4', null, s.site), h('p', null, 'Cổng thông tin học tập, kiểm tra đánh giá môn Lịch sử và Địa lí. Hiệu trưởng: ' + s.principal + '.'), h('p', null, 'Phụ trách kỹ thuật & chuyên môn: ' + s.tech)));
  f.appendChild(h('div', null, h('h4', null, 'Địa chỉ'), h('p', null, s.name + ', ' + s.address), h('p', null, 'Điện thoại: ' + s.phone)));
  f.appendChild(h('div', null, h('h4', null, 'Giáo viên ' + s.dept + ' (' + s.teachers.length + ')'), h('ul', null, s.teachers.map(function (t) { return h('li', null, t); }))));
  document.getElementById('copy').textContent = '© 2026 ' + s.name + ' — ' + s.site + '.';
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(function () { });
})();
