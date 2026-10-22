// Kiểm tra cấu trúc dữ liệu nội dung. Dùng: node tools/validate-data.mjs
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path';
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../docs/assets/js/data');
const ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx);
const errs = [], warns = [];
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort()) {
  try { vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f }); }
  catch (e) { errs.push(`${f}: không chạy được: ${e.message}`); }
}
const D = ctx.window.DD || {};
const ids = new Set();
for (const c of D.cards || []) {
  const w = `thẻ ${c.id}`;
  if (!c.id || ids.has(c.id)) errs.push(`${w}: id thiếu/trùng`); ids.add(c.id);
  if (!['history','geography'].includes(c.subject)) errs.push(`${w}: subject sai`);
  if (![6,7,8,9].includes(c.grade)) errs.push(`${w}: grade sai`);
  for (const k of ['chapter','title','summary']) if (!c[k]) errs.push(`${w}: thiếu ${k}`);
  if (!Array.isArray(c.points) || c.points.length < 3 || c.points.length > 7) errs.push(`${w}: points cần 3–7 mục`);
  if (!Array.isArray(c.check) || !c.check.length) warns.push(`${w}: chưa có check`);
}
for (const [id, s] of Object.entries(D.examSets || {})) {
  const w = `đề ${id}`;
  if (!s.mcq || s.mcq.length !== 16) errs.push(`${w}: cần đúng 16 câu mcq (có ${s.mcq?.length})`);
  const cnt = { A:0,B:0,C:0,D:0 }; const lv = {};
  (s.mcq || []).forEach((m, i) => {
    if (!m.q || !Array.isArray(m.opts) || m.opts.length !== 4 || m.opts.some(o => !o) || m.opts.every((o, k) => o.startsWith('ABCD'[k] + '.') || o.startsWith('ABCD'[k] + ')'))) errs.push(`${w} mcq${i+1}: opts sai (thiếu hoặc còn tiền tố A. B. C. D.)`);
    if (!Number.isInteger(m.ans) || m.ans < 0 || m.ans > 3) errs.push(`${w} mcq${i+1}: ans sai`); else cnt['ABCD'[m.ans]]++;
    if (!m.exp) errs.push(`${w} mcq${i+1}: thiếu exp`);
    if (/^Câu\s*\d+/i.test(m.q)) errs.push(`${w} mcq${i+1}: bỏ tiền tố "Câu n:"`);
    if (new Set(m.opts).size !== 4) errs.push(`${w} mcq${i+1}: phương án trùng`);
    lv[m.level] = (lv[m.level] || 0) + 1;
  });
  const qs = (s.mcq || []).map(m => m.q); if (new Set(qs).size !== qs.length) errs.push(`${w}: câu hỏi trùng`);
  if (!s.tf || s.tf.items?.length !== 4 || s.tf.items.some(i => typeof i.ans !== 'boolean' || !i.text)) errs.push(`${w}: tf cần 4 ý có ans boolean`);
  if (!s.sa || !s.sa.prompt || !String(s.sa.ans || '').length) errs.push(`${w}: sa thiếu`);
  console.log(`${id}: đáp án ${JSON.stringify(cnt)} mức ${JSON.stringify(lv)}`);
}
for (const t of D.timeline || []) {
  if (!t.id || !Number.isInteger(t.year) || !t.title || !t.text || !['vn','world'].includes(t.scope)) errs.push(`timeline ${t.id}: thiếu trường`);
}
const walk = (n, d, w) => { if (!n.t || n.t.length > 80) errs.push(`${w}: nút thiếu/ dài: ${n.t}`); if (d > 4) errs.push(`${w}: quá sâu`); (n.c || []).forEach(x => walk(x, d + 1, w)); };
for (const m of D.mindmaps || []) walk(m.root, 0, `mindmap ${m.id}`);
console.log(`cards=${(D.cards||[]).length} exams=${Object.keys(D.examSets||{}).length} timeline=${(D.timeline||[]).length} mindmaps=${(D.mindmaps||[]).length}`);
warns.forEach(w => console.log('CẢNH BÁO', w)); errs.forEach(e => console.log('LỖI', e));
process.exit(errs.length ? 1 : 0);
