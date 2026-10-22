/* Lõi: dựng DOM an toàn (không innerHTML với dữ liệu người dùng), lưu trữ cục bộ, tiện ích. */
(function () {
  var D = (window.DD = window.DD || {});
  var NS = 'http://www.w3.org/2000/svg';
  // h('div',{class:'x',onclick:fn},'text',child)  — chuỗi luôn là textContent
  function h(tag, attrs) {
    var svg = /^(svg|g|path|circle|rect|text|line|polyline|polygon|defs|use|ellipse)$/.test(tag);
    var el = svg ? document.createElementNS(NS, tag) : document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k]; if (v == null || v === false) return;
      if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'class') el.setAttribute('class', v);
      else if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) c.forEach(function (x) { add(el, x); });
    else if (c.nodeType) el.appendChild(c);
    else el.appendChild(document.createTextNode(String(c)));
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

  // Lưu trữ cục bộ: CHỈ trên trình duyệt này, không phải cơ sở dữ liệu dùng chung.
  var mem = {}, ok = true;
  try { localStorage.setItem('dd:t', '1'); localStorage.removeItem('dd:t'); } catch (e) { ok = false; }
  var store = {
    persistent: ok,
    get: function (k, d) { try { var v = ok ? localStorage.getItem('dd:' + k) : mem[k]; return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { var s = JSON.stringify(v); if (ok) localStorage.setItem('dd:' + k, s); else mem[k] = s; return true; } catch (e) { return false; } },
    del: function (k) { try { if (ok) localStorage.removeItem('dd:' + k); else delete mem[k]; } catch (e) { } },
    keys: function () { var r = []; if (!ok) return Object.keys(mem); for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k.indexOf('dd:') === 0) r.push(k.slice(3)); } return r; }
  };
  // Xáo trộn có hạt giống (ổn định theo từng đề + lần làm)
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function hash(str) { var x = 2166136261; for (var i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
  function shuffle(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function download(name, text, type) {
    var b = new Blob([text], { type: type || 'application/json' }), u = URL.createObjectURL(b);
    var a = h('a', { href: u, download: name }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 1500);
  }
  function fmt(n) { return (Math.round(n * 100) / 100).toString().replace('.', ','); }
  function subjName(s) { return s === 'history' ? 'Lịch sử' : s === 'geography' ? 'Địa lí' : 'Lịch sử & Địa lí'; }
  function tagCls(s) { return s === 'history' ? 'tag h' : s === 'geography' ? 'tag g' : 'tag i'; }
  function toast(msg, kind) {
    var box = document.getElementById('toast'); if (!box) return;
    box.className = 'note ' + (kind || 'info'); box.textContent = msg; box.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { box.hidden = true; }, 5000);
  }
  D.u = { h: h, clear: clear, store: store, rng: rng, hash: hash, shuffle: shuffle, download: download, fmt: fmt, subjName: subjName, tagCls: tagCls, toast: toast };
})();
