/* Quả địa cầu (canvas, phép chiếu trực giao) và Atlas Việt Nam (SVG). Dữ liệu số hóa thủ công, chỉ để minh họa học tập. */
(function () {
  var D = window.DD, u = D.u, h = u.h, G = D.geo, V = G.vn, R = Math.PI / 180;

  /* ---------- QUẢ ĐỊA CẦU ---------- */
  var LABELS = [
    ['CHÂU Á', 88, 46], ['CHÂU ÂU', 15, 52], ['CHÂU PHI', 20, 5], ['BẮC MĨ', -100, 45], ['NAM MĨ', -60, -12], ['CHÂU ĐẠI DƯƠNG', 134, -25], ['CHÂU NAM CỰC', 0, -80],
    ['Thái Bình Dương', -150, 5], ['Đại Tây Dương', -30, 15], ['Ấn Độ Dương', 78, -22], ['Bắc Băng Dương', 0, 84]];
  function Globe(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext('2d'), lon0 = 105, lat0 = 14, spin = false, drag = null, last = 0, raf = 0, labels = !!opts.labels, grat = true;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function size() { var w = canvas.clientWidth || 300, d = Math.min(window.devicePixelRatio || 1, 2); canvas.width = canvas.height = Math.round(w * d); }
    function proj(lon, lat, r, c) { // trả về [x,y,cosc]
      var l = (lon - lon0) * R, p = lat * R, p0 = lat0 * R;
      var cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
      var x = Math.cos(p) * Math.sin(l), y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l);
      return [c + x * r, c - y * r, cosc, x, y];
    }
    function path(ring, r, c, closed) {
      ctx.beginPath(); var any = false;
      for (var i = 0; i < ring.length; i++) {
        var q = proj(ring[i][0], ring[i][1], r, c), x = q[0], y = q[1];
        if (q[2] < 0) { var m = Math.hypot(q[3], q[4]) || 1; x = c + q[3] / m * r; y = c - q[4] / m * r; } else any = true;
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      if (closed) ctx.closePath(); return any;
    }
    function line(pts, r, c) { // đường chỉ vẽ phần nhìn thấy
      var on = false; ctx.beginPath();
      pts.forEach(function (p) { var q = proj(p[0], p[1], r, c); if (q[2] > 0) { if (on) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); on = true; } else on = false; });
      ctx.stroke();
    }
    function draw() {
      var W = canvas.width, c = W / 2, r = W * 0.46; ctx.clearRect(0, 0, W, W);
      var g = ctx.createRadialGradient(c - r * .35, c - r * .35, r * .1, c, c, r * 1.05); g.addColorStop(0, '#4aa3d8'); g.addColorStop(1, '#0d3f73');
      ctx.fillStyle = 'rgba(80,170,255,.18)'; ctx.beginPath(); ctx.arc(c, c, r * 1.05, 0, 7); ctx.fill();
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c, c, r, 0, 7); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(c, c, r, 0, 7); ctx.clip();
      ctx.fillStyle = '#d9c58f'; ctx.strokeStyle = '#7a6a3c'; ctx.lineWidth = Math.max(1, W / 400);
      G.land.forEach(function (p) { if (path(p.ring, r, c, true)) { ctx.fill(); ctx.stroke(); } });
      ctx.fillStyle = '#4aa3d8';
      (G.lakes || []).forEach(function (p) { if (path(p.ring, r, c, true)) ctx.fill(); });
      // Việt Nam tô nổi bật
      ctx.fillStyle = '#c0392b'; path(V.vietnam.ring, r, c, true); ctx.fill();
      V.archipelagos.forEach(function (a) { a.points.forEach(function (pt) { var q = proj(pt[0], pt[1], r, c); if (q[2] > 0) { ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(q[0], q[1], Math.max(1.4, W / 260), 0, 7); ctx.fill(); } }); });
      if (grat) {
        ctx.lineWidth = Math.max(.6, W / 700); ctx.strokeStyle = 'rgba(255,255,255,.35)';
        for (var lo = -180; lo < 180; lo += 30) { var a = []; for (var la = -90; la <= 90; la += 3) a.push([lo, la]); line(a, r, c); }
        for (var la2 = -60; la2 <= 60; la2 += 30) { var b = []; for (var l2 = -180; l2 <= 180; l2 += 3) b.push([l2, la2]); line(b, r, c); }
        ctx.lineWidth = Math.max(1, W / 380);
        [[0, 'rgba(255,230,120,.9)'], [23.44, 'rgba(255,170,120,.85)'], [-23.44, 'rgba(255,170,120,.85)'], [66.56, 'rgba(160,230,255,.8)'], [-66.56, 'rgba(160,230,255,.8)']].forEach(function (t) {
          ctx.strokeStyle = t[1]; var pts = []; for (var l3 = -180; l3 <= 180; l3 += 3) pts.push([l3, t[0]]); line(pts, r, c);
        });
      }
      if (labels) {
        ctx.font = '600 ' + Math.round(W / 38) + 'px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.fillStyle = '#fff';
        LABELS.forEach(function (L) { var q = proj(L[1], L[2], r, c); if (q[2] > .25) { ctx.strokeText(L[0], q[0], q[1]); ctx.fillText(L[0], q[0], q[1]); } });
        var vq = proj(108, 16, r, c); if (vq[2] > .3) { ctx.fillStyle = '#ffe08a'; ctx.strokeText('VIỆT NAM', vq[0] + W * .07, vq[1]); ctx.fillText('VIỆT NAM', vq[0] + W * .07, vq[1]); }
      }
      ctx.restore();
      var sh = ctx.createRadialGradient(c - r * .4, c - r * .4, r * .2, c, c, r); sh.addColorStop(0, 'rgba(255,255,255,.18)'); sh.addColorStop(.6, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.38)');
      ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(c, c, r, 0, 7); ctx.fill();
    }
    function tick(t) { raf = 0; if (spin && !drag) { lon0 = ((lon0 + (t - last) * 0.01 + 540) % 360) - 180; draw(); } last = t; if (spin) raf = requestAnimationFrame(tick); }
    function setSpin(v) { spin = v && !reduce; if (spin && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); } return spin; }
    canvas.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY, lo: lon0, la: lat0 }; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', function (e) { if (!drag) return; var k = 180 / (canvas.clientWidth * .46 * Math.PI); lon0 = ((drag.lo - (e.clientX - drag.x) * k * 1.0 + 540) % 360) - 180; lat0 = Math.max(-85, Math.min(85, drag.la + (e.clientY - drag.y) * k)); draw(); });
    function up() { drag = null; } canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.tabIndex = 0; canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', 'Quả địa cầu tương tác. Kéo để xoay, hoặc dùng phím mũi tên.');
    canvas.addEventListener('keydown', function (e) { var m = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, 8], ArrowDown: [0, -8] }[e.key]; if (m) { e.preventDefault(); lon0 = ((lon0 + m[0] + 540) % 360) - 180; lat0 = Math.max(-85, Math.min(85, lat0 + m[1])); draw(); } });
    size(); draw(); window.addEventListener('resize', function () { size(); draw(); });
    return {
      draw: draw, spin: setSpin, isSpin: function () { return spin; }, toggleLabels: function () { labels = !labels; draw(); return labels; }, toggleGrat: function () { grat = !grat; draw(); return grat; },
      focus: function (lon, lat) { lon0 = lon; lat0 = lat; draw(); }, stop: function () { spin = false; }
    };
  }

  /* ---------- ATLAS VIỆT NAM (SVG) ---------- */
  var K = 42, W0 = V.window[0], N0 = V.window[3];
  function X(lon) { return +((lon - W0) * K * 0.966).toFixed(1); }
  function Y(lat) { return +((N0 - lat) * K).toFixed(1); }
  function pts(a) { return a.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' '); }
  function Atlas(root, infoBox) {
    var Wd = X(V.window[2]), Hd = Y(V.window[1]), layers = {}, st = { x: 0, y: 0, w: Wd, h: Hd };
    var svg = h('svg', { viewBox: '0 0 ' + Wd + ' ' + Hd, role: 'img', 'aria-label': 'Bản đồ Việt Nam: sông, núi, cao nguyên, thành phố và hai quần đảo Hoàng Sa, Trường Sa' });
    svg.appendChild(h('rect', { x: 0, y: 0, width: Wd, height: Hd, class: 'sea' }));
    function L(n) { var g = h('g', { 'data-l': n }); layers[n] = g; svg.appendChild(g); return g; }
    var gl = L('land');
    V.region.forEach(function (r) { gl.appendChild(h('polygon', { points: pts(r.ring), class: 'land' })); });
    G.land.forEach(function (p) { if (p.ring.some(function (q) { return q[0] > 98 && q[0] < 122 && q[1] > 3 && q[1] < 27; })) gl.appendChild(h('polygon', { points: pts(p.ring), class: 'land' })); });
    gl.appendChild(h('polygon', { points: pts(V.vietnam.ring), class: 'vnland' }));
    V.islands.forEach(function (i) {
      var foreign = /Trung Quốc/.test(i.name);
      if (i.ring) gl.appendChild(h('polygon', { points: pts(i.ring), class: foreign ? 'land' : 'vnland' }));
      else { gl.appendChild(h('circle', { cx: X(i.point[0]), cy: Y(i.point[1]), r: 2.6, fill: '#4d6b3a', stroke: '#fff', 'stroke-width': .8 })); gl.appendChild(h('text', { x: X(i.point[0]) + 5, y: Y(i.point[1]) + 3, class: 'maplabel', 'font-size': 8 }, i.name)); }
    });
    var gb = L('borders'); Object.keys(V.borders).forEach(function (k) { gb.appendChild(h('polyline', { points: pts(V.borders[k]), class: 'border' })); });
    var gr = L('rivers'); V.rivers.forEach(function (r) {
      gr.appendChild(h('polyline', { points: pts(r.line), class: 'river' }));
      var e = r.line[Math.floor(r.line.length / 2)];
      var hit = h('polyline', { points: pts(r.line), fill: 'none', stroke: 'transparent', 'stroke-width': 10, class: 'hit', tabindex: 0, role: 'button', 'aria-label': r.name, onclick: function () { info(r.name, 'Sông', r.note || 'Hệ thống sông của Việt Nam.'); } });
      gr.appendChild(hit);
    });
    var gm = L('mountains'); V.mountains.forEach(function (m) {
      var x = X(m.lonlat[0]), y = Y(m.lonlat[1]);
      gm.appendChild(h('polygon', { points: (x - 5) + ',' + (y + 4) + ' ' + x + ',' + (y - 6) + ' ' + (x + 5) + ',' + (y + 4), fill: '#7a5a3a', class: 'hit', tabindex: 0, role: 'button', 'aria-label': m.name, onclick: function () { info(m.name, 'Núi · ' + m.elev + ' m', m.note); } }));
      gm.appendChild(h('text', { x: x + 7, y: y + 3, class: 'maplabel' }, m.name));
    });
    var gp = L('plateaus'); V.plateaus.forEach(function (p) {
      var x = X(p.lonlat[0]), y = Y(p.lonlat[1]);
      gp.appendChild(h('rect', { x: x - 4, y: y - 4, width: 8, height: 8, fill: '#b8863b', class: 'hit', tabindex: 0, role: 'button', 'aria-label': 'Cao nguyên ' + p.name, onclick: function () { info('Cao nguyên ' + p.name, 'Cao nguyên', 'Một trong các cao nguyên xếp tầng ở Tây Nguyên và cực Nam Trung Bộ.'); } }));
      gp.appendChild(h('text', { x: x + 6, y: y + 3, class: 'maplabel' }, p.name));
    });
    var ga = L('archipelagos'); V.archipelagos.forEach(function (a) {
      var b = a.bbox, x1 = X(b[0]), y1 = Y(b[3]), x2 = X(b[2]), y2 = Y(b[1]);
      ga.appendChild(h('rect', { x: x1, y: y1, width: x2 - x1, height: y2 - y1, fill: 'none', stroke: '#c0392b', 'stroke-dasharray': '4 3', 'stroke-width': 1.2 }));
      a.points.forEach(function (p) { ga.appendChild(h('circle', { cx: X(p[0]), cy: Y(p[1]), r: 1.8, fill: '#c0392b' })); });
      ga.appendChild(h('text', { x: x1, y: y1 - 4, class: 'maplabel hit', tabindex: 0, role: 'button', onclick: function () { info(a.name, 'Quần đảo thuộc chủ quyền Việt Nam', a.id === 'hoang-sa' ? 'Hoàng Sa thuộc thành phố Đà Nẵng.' : 'Trường Sa thuộc tỉnh Khánh Hòa.'); } }, a.name));
    });
    var gc = L('cities'); V.cities.forEach(function (c) {
      var x = X(c.lonlat[0]), y = Y(c.lonlat[1]), star = /Thủ đô/.test(c.role || '');
      gc.appendChild(h('circle', { cx: x, cy: y, r: star ? 5 : 3.5, fill: star ? '#c0392b' : '#0b1f3a', stroke: '#fff', 'stroke-width': 1, class: 'hit', tabindex: 0, role: 'button', 'aria-label': c.name, onclick: function () { info(c.name, c.role || 'Địa danh', c.name === 'Đak Đoa' ? 'Huyện lị trên cao nguyên Plei Ku, tỉnh Gia Lai — quê hương trường chúng ta.' : ''); } }));
      gc.appendChild(h('text', { x: x + 6, y: y - 4, class: 'maplabel' }, c.name));
    });
    var gx = L('extremes'); gx.setAttribute('visibility', 'hidden'); V.extremes.forEach(function (e) {
      var x = X(e.lonlat[0]), y = Y(e.lonlat[1]);
      gx.appendChild(h('circle', { cx: x, cy: y, r: 4, fill: '#6b3fa0', stroke: '#fff', class: 'hit', tabindex: 0, role: 'button', 'aria-label': e.name, onclick: function () { info(e.name, 'Điểm cực', e.desc); } }));
    });
    var gs = L('seas'); V.seas.forEach(function (s) { gs.appendChild(h('text', { x: X(s.lonlat[0]), y: Y(s.lonlat[1]), class: 'maplabel sea', 'text-anchor': 'middle', 'font-size': 13 }, s.name)); });
    root.appendChild(svg);
    function info(t, kind, d) { if (!infoBox) return; u.clear(infoBox); infoBox.appendChild(h('h3', null, t)); infoBox.appendChild(h('p', null, h('span', { class: 'tag' }, kind))); if (d) infoBox.appendChild(h('p', null, d)); }
    // thu phóng bằng viewBox
    function vb() { svg.setAttribute('viewBox', st.x + ' ' + st.y + ' ' + st.w + ' ' + st.h); }
    function zoom(f, cx, cy) { var nw = Math.max(Wd / 8, Math.min(Wd, st.w * f)), nh = nw * Hd / Wd; cx = cx == null ? st.x + st.w / 2 : cx; cy = cy == null ? st.y + st.h / 2 : cy; st.x = Math.max(0, Math.min(Wd - nw, cx - (cx - st.x) * nw / st.w)); st.y = Math.max(0, Math.min(Hd - nh, cy - (cy - st.y) * nh / st.h)); st.w = nw; st.h = nh; vb(); }
    var dr = null;
    svg.addEventListener('pointerdown', function (e) { dr = { x: e.clientX, y: e.clientY, sx: st.x, sy: st.y, m: false }; });
    svg.addEventListener('pointermove', function (e) { if (!dr) return; var k = st.w / svg.clientWidth, dx = e.clientX - dr.x, dy = e.clientY - dr.y; if (Math.abs(dx) + Math.abs(dy) > 4) dr.m = true; if (!dr.m) return; st.x = Math.max(0, Math.min(Wd - st.w, dr.sx - dx * k)); st.y = Math.max(0, Math.min(Hd - st.h, dr.sy - dy * k)); vb(); });
    svg.addEventListener('pointerup', function () { dr = null; }); svg.addEventListener('pointerleave', function () { dr = null; });
    return {
      toggle: function (n) { var g = layers[n], on = g.getAttribute('visibility') === 'hidden'; g.setAttribute('visibility', on ? 'visible' : 'hidden'); return on; },
      isOn: function (n) { return layers[n].getAttribute('visibility') !== 'hidden'; },
      zoomIn: function () { zoom(.7); }, zoomOut: function () { zoom(1 / .7); }, reset: function () { st = { x: 0, y: 0, w: Wd, h: Hd }; vb(); },
      goto: function (name) { // zoom tới Tây Nguyên / quần đảo
        var t = { 'tay-nguyen': [108, 13.5, 3], 'hoang-sa': [112, 16.5, 3.5], 'truong-sa': [114, 9, 3.5] }[name]; if (!t) return;
        var nw = Wd / t[2], nh = nw * Hd / Wd; st.w = nw; st.h = nh; st.x = Math.max(0, Math.min(Wd - nw, X(t[0]) - nw / 2)); st.y = Math.max(0, Math.min(Hd - nh, Y(t[1]) - nh / 2)); vb();
      }, svg: svg
    };
  }
  D.geoui = { Globe: Globe, Atlas: Atlas };
})();
