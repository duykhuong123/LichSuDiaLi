/* Giao diện "Tải đề lên" cho giáo viên (chỉ hiện sau khi đăng nhập). Chữ hiển thị đều qua textContent. */
(function () {
  var D = window.DD, u = D.u, h = u.h, L = D.examlib;

  function fmtAt(s) { var d = new Date(s); return isNaN(d) ? '' : d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }); }

  D.examup = function (root) {
    var card = h('div', { class: 'card', id: 'examup', style: 'margin-top:16px' }); root.appendChild(card);
    var st = { editId: null, parsed: null, busy: false };
    var title = h('input', { class: 't', maxlength: 120, placeholder: 'Tên đề, ví dụ: KTTX Lần 2 - Lịch sử 9: Việt Nam 1930–1945', 'aria-label': 'Tên đề', style: 'width:100%' });
    var subj = h('select', { class: 't', 'aria-label': 'Môn' }, [['history', 'Lịch sử'], ['geography', 'Địa lí'], ['integrated', 'Lịch sử & Địa lí']].map(function (o) { return h('option', { value: o[0] }, o[1]); }));
    var grade = h('select', { class: 't', 'aria-label': 'Khối' }, [6, 7, 8, 9].map(function (g) { return h('option', { value: g }, 'Khối ' + g); }));
    var kind = h('select', { class: 't', 'aria-label': 'Loại đề' }, L.KINDS.map(function (k) { return h('option', { value: k }, k); }));
    var mins = h('input', { class: 't', type: 'number', min: 5, max: 120, value: 15, 'aria-label': 'Số phút', style: 'width:90px' });
    var file = h('input', { type: 'file', accept: '.docx,.txt', 'aria-label': 'Chọn tệp đề (.docx hoặc .txt)' });
    var ta = h('textarea', { class: 't', rows: 14, spellcheck: 'false', 'aria-label': 'Nội dung đề', placeholder: 'Dán nội dung đề vào đây, hoặc chọn tệp Word (.docx) ở trên.\nMỗi câu bắt đầu bằng "Câu 1." — xem mẫu bằng nút "Tải mẫu định dạng".', style: 'width:100%;font-family:ui-monospace,Consolas,monospace;font-size:.88rem;min-height:260px' });
    var msg = h('div', { role: 'status', 'aria-live': 'polite', style: 'margin:10px 0' });
    var report = h('div'), mine = h('div', { style: 'margin-top:18px' });
    var editNote = h('div', { class: 'note info', hidden: true, style: 'margin:10px 0' });

    function say(t, cls) { msg.textContent = t || ''; msg.className = cls ? 'note ' + cls : ''; }
    function meta() { var m = Math.round(Number(mins.value)); return { title: title.value.replace(/\s+/g, ' ').trim(), subject: subj.value, grade: Number(grade.value), kind: kind.value, minutes: m }; }
    function checkMeta(m) { if (m.title.length < 3) return 'Hãy nhập tên đề.'; if (!(m.minutes >= 5 && m.minutes <= 120)) return 'Thời gian làm bài từ 5 đến 120 phút.'; return ''; }

    function check() {
      u.clear(report); var r = L.parse(ta.value); st.parsed = r;
      var c = r.counts, line = 'Đọc được: ' + c.mcq + '/16 câu trắc nghiệm · Đúng/Sai ' + c.tf + '/1 · Trả lời ngắn ' + c.sa + '/1';
      report.appendChild(h('div', { class: 'note ' + (r.ok ? 'ok' : 'bad') }, h('b', null, r.ok ? '✔ Đề hợp lệ. ' : '✘ Đề chưa hợp lệ. '), line));
      if (r.errors.length) { var ul = h('ul', null); r.errors.slice(0, 25).forEach(function (e) { ul.appendChild(h('li', null, (e.ln ? 'Dòng ' + e.ln + ': ' : '') + e.msg)); }); if (r.errors.length > 25) ul.appendChild(h('li', null, '… và ' + (r.errors.length - 25) + ' lỗi khác.')); report.appendChild(h('div', { class: 'note bad', style: 'margin-top:8px' }, h('b', null, 'Cần sửa:'), ul)); }
      if (r.warnings.length) report.appendChild(h('div', { class: 'note', style: 'margin-top:8px' }, h('b', null, 'Lưu ý: '), r.warnings.join(' ')));
      if (r.ok) {
        var s = r.set, d = [0, 0, 0, 0]; s.mcq.forEach(function (q) { d[q.ans]++; });
        report.appendChild(h('div', { class: 'card', style: 'margin-top:8px' }, h('b', null, 'Xem nhanh'), h('p', null, 'Phân bố đáp án A/B/C/D: ' + d.join(' / ')), h('p', null, 'Câu 1: ' + s.mcq[0].q), h('p', null, 'Câu 17 (Đ/S): ' + s.tf.prompt), h('p', null, 'Câu 18 (TLN): ' + s.sa.prompt + ' → ' + s.sa.ans)));
        report.appendChild(h('div', { class: 'bar', style: 'margin-top:8px' }, h('button', { class: 'btn ghost sm', onclick: function () { preview(); } }, 'Xem đề + đáp án (như học sinh sẽ thấy)')));
      }
      return r;
    }
    function preview() {
      var r = st.parsed && st.parsed.ok ? st.parsed : check(); if (!r.ok) return;
      var m = meta(); L.register({ id: 'tmp-preview', title: m.title || '(Xem thử)', subject: m.subject, grade: m.grade, minutes: m.minutes || 15, kind: m.kind, hidden: true }, r.set); location.hash = '#/xemde/tmp-preview';
    }
    function send(publish) {
      if (st.busy) return; var m = meta(), e0 = checkMeta(m); if (e0) return say(e0, 'bad');
      var r = check(); if (!r.ok) return say('Hãy sửa các lỗi trong đề trước khi lưu.', 'bad');
      if (publish && !confirm('Đăng đề này cho học sinh làm bài? Học sinh sẽ thấy đề trong mục Kiểm tra.')) return;
      st.busy = true; say('Đang lưu…');
      L.authed('exam_put', { id: st.editId || undefined, meta: m, set: r.set, publish: !!publish }).then(function (j) {
        st.editId = null; editNote.hidden = true; say(publish ? 'Đã đăng đề cho học sinh.' : 'Đã lưu nháp (học sinh chưa thấy).', 'ok'); loadMine();
      }, function (e) { say(e.message, 'bad'); }).then(function () { st.busy = false; });
    }
    function edit(id) {
      say('Đang tải đề…'); L.authed('exam_load', { id: id }).then(function (j) {
        st.editId = id; title.value = j.meta.title; subj.value = j.meta.subject; grade.value = String(j.meta.grade); kind.value = j.meta.kind; mins.value = j.meta.minutes; ta.value = L.toText(j.set);
        editNote.hidden = false; editNote.textContent = 'Đang sửa đề "' + j.meta.title + '". Bấm "Đăng cho học sinh" hoặc "Lưu nháp" để cập nhật đề này.'; check(); say(''); card.scrollIntoView({ behavior: 'smooth' });
      }, function (e) { say(e.message, 'bad'); });
    }
    function cancelEdit() { st.editId = null; editNote.hidden = true; }
    function act(op, id, extra, okMsg) { L.authed(op, Object.assign({ id: id }, extra || {})).then(function () { say(okMsg, 'ok'); loadMine(); }, function (e) { say(e.message, 'bad'); }); }
    function view(id) { L.ensureTeacher(id).then(function () { location.hash = '#/xemde/' + id; }, function (e) { say(e.message, 'bad'); }); }

    function loadMine() {
      u.clear(mine); if (!L.enabled()) return;
      mine.appendChild(h('h3', null, 'Đề đã tải lên'));
      var box = h('div', { 'aria-live': 'polite' }, 'Đang tải danh sách…'); mine.appendChild(box);
      L.authed('exam_mine').then(function (j) {
        u.clear(box); if (!j.exams.length) { box.appendChild(h('p', { style: 'color:var(--mut)' }, 'Chưa có đề nào. Hãy tải đề đầu tiên ở trên.')); return; }
        var head = h('tr', null, ['Tên đề', 'Khối', 'Người đăng', 'Cập nhật', 'Trạng thái', 'Thao tác'].map(function (x) { return h('th', null, x); }));
        var body = h('tbody', null, j.exams.map(function (e) {
          return h('tr', null, h('td', null, e.title), h('td', null, String(e.grade)), h('td', null, e.by), h('td', null, fmtAt(e.at)),
            h('td', null, h('span', { class: 'tag ' + (e.published ? 'g' : '') }, e.published ? 'Đang mở cho học sinh' : 'Nháp')),
            h('td', null, h('div', { class: 'bar' },
              h('button', { class: 'btn sm ghost', onclick: function () { view(e.id); } }, 'Xem + đáp án'),
              h('button', { class: 'btn sm ghost', onclick: function () { edit(e.id); } }, 'Sửa'),
              h('button', { class: 'btn sm ghost', onclick: function () { if (e.published) act('exam_pub', e.id, { publish: false }, 'Đã ẩn đề khỏi học sinh.'); else if (confirm('Mở đề này cho học sinh?')) act('exam_pub', e.id, { publish: true }, 'Đã mở đề cho học sinh.'); } }, e.published ? 'Ẩn khỏi học sinh' : 'Mở cho học sinh'),
              h('button', { class: 'btn sm ghost', onclick: function () { if (confirm('Xóa hẳn đề "' + e.title + '"? Không thể khôi phục.')) act('exam_del', e.id, null, 'Đã xóa đề.'); } }, 'Xóa'))));
        }));
        box.appendChild(h('div', { class: 'scroll' }, h('table', null, h('thead', null, head), body)));
        if (j.role === 'TT' || j.role === 'TP') box.appendChild(h('p', { style: 'color:var(--mut);font-size:.88rem' }, 'Bạn là tổ trưởng/tổ phó nên thấy và quản lý đề của cả tổ.'));
      }, function (e) { u.clear(box); box.appendChild(h('div', { class: 'note bad' }, e.message)); });
    }

    file.addEventListener('change', function () {
      var f = file.files && file.files[0]; if (!f) return; say('Đang đọc tệp…');
      L.readFile(f).then(function (r) {
        ta.value = r.text; if (!title.value) title.value = f.name.replace(/\.[^.]+$/, '').slice(0, 120); cancelEdit();
        var ok = check(); say(r.numbered ? 'Tệp có danh sách tự động đánh số: nếu "Câu 1", "A." không hiện trong ô bên dưới, hãy gõ chúng thành chữ trong Word rồi chọn lại.' : 'Đã đọc tệp "' + f.name + '".', r.numbered ? '' : 'ok'); return ok;
      }, function (e) { say(e.message, 'bad'); }); file.value = '';
    });

    card.appendChild(h('h3', null, 'Tải đề lên cho học sinh'));
    card.appendChild(h('ol', { style: 'margin:.4em 0 .8em 1.2em' }, h('li', null, 'Chọn tệp Word (.docx) hoặc dán nội dung đề vào ô.'), h('li', null, 'Bấm "Kiểm tra đề": hệ thống báo lỗi theo từng dòng nếu có.'), h('li', null, 'Bấm "Đăng cho học sinh" (hoặc "Lưu nháp" để xem lại sau).')));
    if (!L.enabled()) card.appendChild(h('div', { class: 'note bad' }, 'Đăng đề lên cần máy chủ Google của tổ (syncUrl trong config.js). Bạn vẫn có thể kiểm tra đề và xem thử ngay trên trang này.'));
    card.appendChild(h('div', { class: 'bar' }, h('label', null, 'Tệp đề: ', file), h('button', { class: 'btn ghost sm', onclick: function () { u.download('mau-de-kiem-tra.txt', L.sample, 'text/plain'); } }, 'Tải mẫu định dạng'),
      h('button', { class: 'btn ghost sm', onclick: function () { ta.value = L.sample; cancelEdit(); } }, 'Điền mẫu vào ô')));
    card.appendChild(editNote);
    card.appendChild(h('div', { class: 'bar', style: 'margin-top:10px' }, title));
    card.appendChild(h('div', { class: 'bar', style: 'margin-top:8px' }, subj, grade, kind, h('label', null, 'Thời gian: ', mins, ' phút')));
    card.appendChild(h('div', { style: 'margin-top:8px' }, ta));
    card.appendChild(h('details', { style: 'margin-top:8px' }, h('summary', null, 'Quy tắc định dạng (bấm để xem)'), h('ul', null,
      h('li', null, 'Mỗi câu bắt đầu bằng "Câu 1.", "Câu 2."… Trắc nghiệm có 4 dòng A. B. C. D. rồi dòng "Đáp án: B" (hoặc đánh dấu * trước phương án đúng).'),
      h('li', null, 'Đúng/Sai: 4 ý a) b) c) d) rồi "Đáp án: a-Đ, b-S, c-Đ, d-S".'),
      h('li', null, 'Trả lời ngắn: không có phương án, chỉ có dòng "Đáp án: 1789". Nhiều cách viết đúng: "Đáp án khác: 1 789 | 1.789".'),
      h('li', null, 'Tùy chọn sau mỗi câu: "Giải thích: …", "Mức độ: Biết/Hiểu/Vận dụng", "Chủ đề: …".'),
      h('li', null, 'Mỗi đề đúng 16 trắc nghiệm + 1 Đúng/Sai + 1 trả lời ngắn (10 điểm). Trong Word, hãy gõ "Câu 1." và "A." thành chữ, không dùng đánh số tự động.'))));
    card.appendChild(h('div', { class: 'bar', style: 'margin-top:10px' },
      h('button', { class: 'btn ghost', onclick: function () { say(''); check(); } }, 'Kiểm tra đề'),
      h('button', { class: 'btn', id: 'pubBtn', disabled: !L.enabled(), onclick: function () { send(true); } }, 'Đăng cho học sinh'),
      h('button', { class: 'btn ghost', id: 'draftBtn', disabled: !L.enabled(), onclick: function () { send(false); } }, 'Lưu nháp')));
    card.appendChild(msg); card.appendChild(report);
    card.appendChild(h('p', { class: 'note', style: 'margin-top:12px;font-size:.85rem' }, 'Lưu ý: đề đã đăng được gửi về trình duyệt của học sinh khi các em mở đề (như các đề có sẵn), nên không phải bí mật tuyệt đối. Đề nháp chỉ giáo viên thấy.'));
    card.appendChild(mine); loadMine();
  };
})();
