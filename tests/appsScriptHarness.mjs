// Chạy NGUYÊN VĂN apps-script/Code.gs trong Node với bản giả lập dịch vụ Google (Sheet, Cache, Properties, Lock) để kiểm thử logic.
// Dùng: import { startHarness } from './appsScriptHarness.mjs'
import fs from 'node:fs'; import vm from 'node:vm'; import http from 'node:http'; import crypto from 'node:crypto';
export function startHarness(port, codePath, teacherRows) {
  const clock = { now: Date.now() };
  const sheets = {}; const mk = (name) => { const rows = []; const sh = { name, rows,
    getLastRow: () => rows.length, appendRow: (r) => rows.push(r), deleteRow: (n) => { rows.splice(n - 1, 1); }, setFrozenRows() { }, getRange(r, c, n = 1, m = 1) { return { setFontWeight() { }, setValues: (vals) => { vals.forEach((vr, i) => { rows[r - 1 + i] = rows[r - 1 + i] || []; vr.forEach((v, j) => { rows[r - 1 + i][c - 1 + j] = v; }); }); }, setValue: (v) => { rows[r - 1] = rows[r - 1] || []; rows[r - 1][c - 1] = v; }, getValues: () => rows.slice(r - 1, r - 1 + n).map(x => { const o = []; for (let i = 0; i < m; i++) o.push(x[c - 1 + i] === undefined ? '' : x[c - 1 + i]); return o; }) }; },
    getDataRange() { return { getValues: () => rows.map(r => r.slice()) }; } }; return sh; };
  sheets['GiaoVien'] = mk('GiaoVien'); sheets['GiaoVien'].rows.push(['Họ tên', 'Gmail', 'Vai trò (TT/TP)', 'Tạm khóa (x)']); teacherRows.forEach(r => sheets['GiaoVien'].rows.push(r));
  const cacheStore = {}; const props = {}; const mails = [];
  const ctx = {
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: (n) => sheets[n] || null, insertSheet: (n) => (sheets[n] = mk(n)) }) },
    CacheService: { getScriptCache: () => ({ get: (k) => { const e = cacheStore[k]; if (!e || e.exp < clock.now) return null; return e.v; }, put: (k, v, s) => { cacheStore[k] = { v, exp: clock.now + (s || 600) * 1000 }; }, remove: (k) => { delete cacheStore[k]; } }) },
    PropertiesService: { getScriptProperties: () => ({ getProperties: () => ({ ...props }), getProperty: (k) => props[k] ?? null, setProperty: (k, v) => { props[k] = v; }, deleteProperty: (k) => { delete props[k]; } }) },
    MailApp: { sendEmail: (o) => { mails.push(o); } },
    LockService: { getScriptLock: () => ({ waitLock() { }, releaseLock() { } }) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (s) => ({ s, setMimeType() { return this; } }) },
    Utilities: { getUuid: () => crypto.randomUUID(), DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { UTF_8: 'utf8' }, computeDigest: (a, s) => Array.from(crypto.createHash('sha256').update(String(s)).digest()).map(x => x > 127 ? x - 256 : x) },
    Date: class extends Date { constructor(...a){ if(a.length) super(...a); else super(clock.now); } static now(){ return clock.now; } },
    console };
  vm.createContext(ctx); vm.runInContext(fs.readFileSync(codePath, 'utf8'), ctx);
  const server = http.createServer((rq, rs) => {
    rs.setHeader('Access-Control-Allow-Origin', '*'); rs.setHeader('Content-Type', 'application/json');
    if (rq.method === 'OPTIONS') { rs.writeHead(204, { 'Access-Control-Allow-Headers': '*' }); return rs.end(); }
    let body = ''; rq.on('data', c => body += c); rq.on('end', () => { if (server.fail) { rs.writeHead(500); return rs.end('{"ok":false,"error":"Lỗi giả lập"}'); }
      const out = ctx.doPost({ postData: { contents: body } }); rs.end(out.s); });
  }).listen(port);
  return { server, sheets, props, mails, clock, cache: cacheStore, close: () => server.close() };
}
