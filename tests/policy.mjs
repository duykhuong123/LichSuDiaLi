// Kiểm thử: nhắc nhở lần đầu, tự nộp, toàn màn hình, chặn sao chép, xáo câu hỏi, chuẩn hoá lớp, gửi điểm (máy chủ giả lập).
import { chromium } from 'playwright';
import http from 'node:http';
const R=[];const ok=(n,c,x='')=>R.push((c?'PASS ':'FAIL ')+n+(x?' — '+x:''));
const U='http://localhost:8123/index.html';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const newPage=async(cfg)=>{const c=await b.newContext({viewport:{width:1280,height:900}});const p=await c.newPage();p.on('dialog',d=>d.accept());p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 if(cfg)await p.route('**/assets/js/config.js',r=>r.fulfill({contentType:'application/javascript',body:cfg}));return p;};
const start=async(p,id,name='Nguyễn Văn A',cls='6.1')=>{await p.goto(U+'#/home');await p.goto(U+'#/exam/'+id);await p.fill('#nm',name);await p.fill('#cl',cls);await p.click('button:text-matches("Bắt đầu làm bài|Làm bài mới")');};
const leave=async(p)=>{await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))});await p.waitForTimeout(80);await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'))});await p.waitForTimeout(80);};
// A. nhắc nhở lần đầu
let p=await newPage();await start(p,'exam-geo-9-1');await leave(p);
ok('Lần 1: chỉ NHẮC NHỞ, chưa tính',await p.isVisible('text=NHẮC NHỞ đầu tiên'));await p.click('text=Tôi đã hiểu');
await leave(p);ok('Lần 2: ĐÃ ĐƯỢC TÍNH',await p.isVisible('text=ĐÃ ĐƯỢC TÍNH'));await p.click('text=Tôi đã hiểu');
await p.click('button:has-text("Nộp bài")');await p.waitForSelector('.score');
ok('Kết quả: 2 lần rời, 1 lần bị tính, Giáo viên xem xét',await p.isVisible('text=Giáo viên xem xét')&&await p.isVisible('text=1 lần bị tính'));
await p.goto(U+'#/scores');ok('Bảng điểm có điểm gợi ý trừ 0,25',await p.isVisible('td:has-text("trừ 0,25")')||(await p.textContent('tbody')).includes('—')&&false);
// B. tự nộp
p=await newPage();await p.goto(U);await p.evaluate(()=>localStorage.setItem('dd:policy',JSON.stringify({'exam-geo-9-1':{autoSubmit:true,maxLeaves:3}})));
await start(p,'exam-geo-9-1');await leave(p);await p.click('text=Tôi đã hiểu');await leave(p);await p.click('text=Tôi đã hiểu');ok('Chưa tự nộp ở lần 2',await p.isVisible('.timer'));await leave(p);
await p.waitForSelector('.score');ok('Lần 3: tự động nộp bài',await p.isVisible('text=NỘP TỰ ĐỘNG'));
// C. toàn màn hình
p=await newPage();await start(p,'exam-geo-9-1');await p.waitForTimeout(300);
const fs1=await p.evaluate(()=>!!document.fullscreenElement);ok('Vào thi: bật toàn màn hình (hoặc trình duyệt không hỗ trợ)',fs1||!document?.documentElement,String(fs1));
if(fs1){await p.evaluate(()=>document.exitFullscreen());await p.waitForTimeout(300);ok('Thoát toàn màn hình bị ghi nhận',await p.isVisible('text=Thoát chế độ toàn màn hình'));}else R.push('CHƯA KIỂM THỬ toàn màn hình: Chromium không bật được trong môi trường thử');
// D. chặn sao chép
const blk=await p.evaluate(()=>{const q=document.querySelector('#q');const e1=new MouseEvent('contextmenu',{bubbles:true,cancelable:true});q.dispatchEvent(e1);const e2=new Event('copy',{bubbles:true,cancelable:true});q.dispatchEvent(e2);return [e1.defaultPrevented,e2.defaultPrevented,getComputedStyle(q).userSelect]});
ok('Chặn chuột phải, sao chép, bôi chọn',blk[0]&&blk[1]&&blk[2]==='none',JSON.stringify(blk));
// E. xáo câu hỏi
const qo=async(id)=>{const pg=await newPage();await start(pg,id);return pg.evaluate(id=>JSON.parse(localStorage.getItem('dd:attempt:'+id)).qo,id)};
const q1=await qo('exam-hist-8-1'),q2=await qo('exam-hist-8-1'),q3=await qo('exam-int-8-gk');
ok('Thứ tự câu hỏi là hoán vị 0–15',[...q1].sort((x,y)=>x-y).join()===[...Array(16).keys()].join());
ok('Hai lần làm có thứ tự câu khác nhau',q1.join()!==q2.join());
ok('Đề liên môn lớp 8 giữ nguyên thứ tự gốc',q3.join()===[...Array(16).keys()].join());
// chấm đúng với thứ tự bị xáo: trả lời đúng cả 16 câu TN bằng cách đọc nội dung
p=await newPage();await start(p,'exam-hist-9-1');
for(let i=0;i<16;i++){const r=await p.evaluate(()=>{const t=document.querySelector('#q h3').textContent.replace(/^Câu \d+\. /,'');const q=DD.examSets['exam-hist-9-1'].mcq.filter(m=>m.q===t)[0];const right=q.opts[q.ans];const opts=[...document.querySelectorAll('.opt span')].map(s=>s.textContent);return opts.indexOf(right)});await p.click('.opt >> nth='+r);await p.click('button:has-text("Câu sau")');}
await p.click('button:has-text("Nộp bài")');await p.waitForSelector('.score');ok('Trả lời đúng 16 câu TN dù xáo → 8/10 điểm',(await p.textContent('.score')).trim()==='8 / 10',await p.textContent('.score'));
// F. chuẩn hoá lớp
const nc=await p.evaluate(()=>['6.1','6/1','6-1','6 1','6a1','6A1','Lớp 6.1','61','6.01','7/2','9A10','5.1','10.1','abc','6.0','6.31',''].map(x=>DD.sync.normClass(x)));
ok('Gộp lớp 6.1 / 6/1 / 6-1 / 6a1 / "Lớp 6.1" / 61 / 6.01 → 6.1',nc.slice(0,8).every(x=>x==='6.1')&&nc[8]==='6.1',JSON.stringify(nc));
ok('Lớp 7/2→7.2, 9A10→9.10; sai (5.1, 10.1, abc, 6.0, 6.31, rỗng) bị từ chối',nc[9]==='7.2'&&nc[10]==='9.10'&&nc.slice(11).every(x=>x===null),JSON.stringify(nc));
ok('Chuẩn hoá họ tên',await p.evaluate(()=>DD.sync.normName('  nGUYỄN   văn  a ')==='Nguyễn Văn A'));
await p.goto(U+'#/exam/exam-geo-9-1');await p.fill('#nm','An');await p.fill('#cl','12.3');await p.click('button:has-text("Bắt đầu")');ok('Lớp sai: báo lỗi, không vào thi',await p.isVisible('text=Lớp chưa đúng')&&!(await p.isVisible('.timer')));
await p.fill('#nm','');await p.fill('#cl','6/1');await p.click('button:has-text("Bắt đầu")');ok('Thiếu họ tên: báo lỗi',await p.isVisible('text=Hãy nhập họ và tên'));
// G. gửi điểm (máy chủ giả lập mô phỏng Apps Script: gộp lớp, chống trùng)
const sheets={};let mode='ok';
const srv=http.createServer((rq,rs)=>{rs.setHeader('Access-Control-Allow-Origin','*');rs.setHeader('Content-Type','application/json');if(rq.method==='OPTIONS'){rs.writeHead(204,{'Access-Control-Allow-Headers':'*'});return rs.end();}
 let body='';rq.on('data',c=>body+=c);rq.on('end',()=>{if(mode==='fail'){rs.writeHead(500);return rs.end('{"ok":false,"error":"Lỗi giả lập"}');}
  const d=JSON.parse(body);const m=String(d.cls).toUpperCase().match(/^([6-9])\s*[A-Z]?\s*[.\/\\\-_,\s]*\s*(\d{1,2})$/);if(!m)return rs.end('{"ok":false,"error":"Lớp không hợp lệ"}');const c=m[1]+'.'+parseInt(m[2],10);(sheets[c]=sheets[c]||[]);
  if(sheets[c].some(r=>r.id===d.id))return rs.end('{"ok":true,"duplicate":true}');sheets[c].push(d);rs.end('{"ok":true}');});}).listen(8124);
const cfg="window.DD=window.DD||{};DD.config={syncUrl:'http://localhost:8124/exec',syncKey:'',policy:{grace:1,autoSubmit:false,maxLeaves:3,fullscreen:false,block:true,deduct:0.25}};";
p=await newPage(cfg);
for(const [n,c] of [['nguyễn văn a','6.1'],['Trần Thị B','6/1'],['Lê Văn C','6A1']]){await start(p,'exam-geo-6-1',n,c);await p.click('button:has-text("Nộp bài")');await p.waitForSelector('text=Đã gửi điểm');}
ok('3 học sinh ghi 6.1 / 6/1 / 6A1 vào CÙNG một trang tính "6.1"',Object.keys(sheets).join()==='6.1'&&sheets['6.1'].length===3,JSON.stringify(Object.keys(sheets)));
ok('Họ tên được chuẩn hoá khi gửi',sheets['6.1'][0].name==='Nguyễn Văn A');
mode='fail';await start(p,'exam-geo-6-1','Phạm D','7/2');await p.click('button:has-text("Nộp bài")');await p.waitForSelector('text=CHƯA gửi được điểm');
ok('Máy chủ lỗi: báo CHƯA gửi (không báo thành công giả)',!(await p.isVisible('text=Đã gửi điểm')));
await p.goto(U+'#/scores');ok('Bảng điểm đánh dấu CHƯA gửi',await p.isVisible('td:has-text("CHƯA gửi")'));
mode='ok';await p.click('button:has-text("Gửi lại bài chưa gửi")');await p.waitForTimeout(800);
ok('Gửi lại thành công → trang tính 7.2 có 1 dòng',(sheets['7.2']||[]).length===1);
await p.click('button:has-text("Gửi lại bài chưa gửi")').catch(()=>{});await p.waitForTimeout(300);
ok('Không gửi trùng khi bấm lại',(sheets['7.2']||[]).length===1&&sheets['6.1'].length===3);
ok('Không lỗi JS ở trang có đồng bộ',p.errs.length===0,p.errs.join());
srv.close();console.log(R.join('\n'));await b.close();
