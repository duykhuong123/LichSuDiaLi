// Kiểm thử tính năng giáo viên tải đề lên: đọc văn bản/.docx, kiểm tra lỗi, đăng/ẩn/xóa/sửa, học sinh làm bài, phân quyền. Dữ liệu GIẢ.
import { chromium } from 'playwright';
import { startHarness } from './appsScriptHarness.mjs';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
const R=[];const ok=(n,c,x='')=>R.push((c?'PASS ':'FAIL ')+n+(x?' — '+x:''));
const U='http://localhost:8123/index.html';const API='http://localhost:8124/exec';
const H=startHarness(8124,new URL('../apps-script/Code.gs',import.meta.url).pathname,[['Cô Một','a@gmail.com','',''],['Thầy Hai','b@gmail.com','',''],['Cô Tổ Trưởng','tt@gmail.com','TT','']]);
const cfg="window.DD=window.DD||{};DD.config={syncUrl:'"+API+"',syncKey:'',policy:{grace:1,autoSubmit:false,maxLeaves:3,fullscreen:false,block:true,deduct:0.25}};";
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const mk=async()=>{const c=await b.newContext({serviceWorkers:'block',viewport:{width:1280,height:900}});await c.route('**/assets/js/config.js',r=>r.fulfill({contentType:'application/javascript',body:cfg}));const p=await c.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));p.on('dialog',d=>d.accept());return p;};
const call=(p,op,body)=>p.evaluate(async([a,op,body])=>{const r=await fetch(a,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({op,...body})});return r.json()},[API,op,body]);
const lastCode=()=>(H.mails[H.mails.length-1].body.match(/: (\d{6})/)||[])[1];
const sc=process.env.SCRATCH||'/tmp';
// ---- sinh đề mẫu
const mkText=(o={})=>{const L=[];L.push('ĐỀ KIỂM TRA THỬ','I. TRẮC NGHIỆM');for(let i=1;i<=(o.n??16);i++){const ans='ABCD'[i%4];L.push(`Câu ${i}. Nội dung câu ${i} là gì?`,'A. Phương án một','B) Phương án hai','C. Phương án ba','D. Phương án bốn');if(!(o.noAns&&i===3))L.push('Đáp án: '+ans);if(i%2)L.push('Giải thích: Vì sao câu '+i+' đúng.');}
 if(o.tf!==false)L.push('II. ĐÚNG/SAI','Câu 17 (Đúng/Sai). Đọc thông tin sau, các ý đúng hay sai:','a) Ý một','b) Ý hai','c) Ý ba','d) Ý bốn','Đáp án: '+(o.tfAns??'a-Đ, b-S, c-Đ, d-S'),'Giải thích: vì thế.');
 if(o.sa!==false){L.push('III. TRẢ LỜI NGẮN','Câu 18. Ngày 14 tháng 7 năm nào phá ngục Ba-xti?','Đáp án: 1789','Đáp án khác: 1 789 | 1.789');}return L.join('\n');};
const p=await mk();await p.goto(U+'#/home');
const parse=(t)=>p.evaluate(t=>{const r=DD.examlib.parse(t);return {ok:r.ok,errs:r.errors.map(e=>e.msg),warns:r.warnings,c:r.counts,set:r.set}},t);
// 1. phân tích
let r=await parse(mkText());ok('Đề đủ 16 TN + Đ/S + TLN: hợp lệ',r.ok&&r.c.mcq===16&&r.c.tf===1&&r.c.sa===1,r.errs.join('|'));
ok('Nhận cả "A." và "B)"; bỏ tiêu đề/phần I, II',r.set&&r.set.mcq[0].opts[1]==='Phương án hai'&&r.set.mcq[0].q==='Nội dung câu 1 là gì?');
ok('Đáp án đúng đọc đúng (câu 1 → B)',r.set&&r.set.mcq[0].ans===1&&r.set.mcq[1].ans===2);
ok('Đúng/Sai a-Đ,b-S,c-Đ,d-S; bỏ "(Đúng/Sai)" ở đầu câu',r.set&&r.set.tf.items.map(x=>x.ans).join()==='true,false,true,false'&&!/Đúng\/Sai\)/.test(r.set.tf.prompt));
ok('Trả lời ngắn + đáp án khác',r.set&&r.set.sa.ans==='1789'&&r.set.sa.alts.join('|')==='1 789|1.789');
ok('Câu thiếu giải thích: có giải thích mặc định + cảnh báo',r.set&&/Đáp án đúng/.test(r.set.mcq[1].exp)&&r.warns.some(w=>/chưa có "Giải thích/.test(w)));
r=await parse(mkText({n:15}));ok('Thiếu câu: báo "Cần đúng 16 câu"',!r.ok&&r.errs.some(e=>/16 câu/.test(e)));
r=await parse(mkText({noAns:true}));ok('Câu thiếu đáp án: báo lỗi kèm số câu',!r.ok&&r.errs.some(e=>/Câu 3.*thiếu dòng "Đáp án/.test(e)));
r=await parse(mkText({tf:false}));ok('Thiếu Đúng/Sai: báo lỗi',!r.ok&&r.errs.some(e=>/Thiếu 1 câu Đúng\/Sai/.test(e)));
r=await parse(mkText({sa:false}));ok('Thiếu trả lời ngắn: báo lỗi',!r.ok&&r.errs.some(e=>/trả lời ngắn/.test(e)));
r=await parse(mkText({tfAns:'xyz'}));ok('Đáp án Đúng/Sai không đọc được: báo lỗi',!r.ok&&r.errs.some(e=>/Đúng\/Sai chưa đọc được/.test(e)));
r=await parse(mkText({tfAns:'Đúng, Sai, Đúng, Sai'}));ok('Đáp án Đúng/Sai viết kiểu "Đúng, Sai, Đúng, Sai" vẫn đọc được',r.ok&&r.set.tf.items[1].ans===false);
r=await parse(mkText().replace('D. Phương án bốn\nĐáp án: C','Đáp án: C'));ok('Thiếu phương án D: báo lỗi',!r.ok&&r.errs.some(e=>/4 phương án/.test(e)));
r=await parse('');ok('Rỗng: báo không tìm thấy câu',!r.ok&&r.errs.some(e=>/Không tìm thấy câu/.test(e)));
r=await parse(mkText().replace('B) Phương án hai','*B. Phương án hai').replace(/Đáp án: [ABCD]\n(Giải thích: Vì sao câu 1 đúng\.)/,'$1'));ok('Đánh dấu * trước phương án đúng thay cho dòng Đáp án',r.ok&&r.set.mcq[0].ans===1,r.errs.join('|'));
// khứ hồi toText -> parse
r=await p.evaluate(t=>{const a=DD.examlib.parse(t);const b=DD.examlib.parse(DD.examlib.toText(a.set));return JSON.stringify(a.set)===JSON.stringify(b.set)&&b.ok},mkText());ok('Chuyển ngược về văn bản (để sửa) rồi đọc lại: giống hệt',r===true);
r=await parse(mkText().replace('Nội dung câu 2 là gì?','<img src=x onerror=alert(1)> Nội dung câu 2'));ok('Chuỗi HTML trong đề chỉ là chữ (không bị diễn giải khi đọc)',r.ok&&/<img/.test(r.set.mcq[1].q));
// 2. docx
const dx=`${sc}/de-thu.docx`,dn=`${sc}/de-tudong.docx`;
execSync(`python3 -I - <<'PY'
import zipfile,html
T=${JSON.stringify(mkText())}
def mk(path,num):
    ps=''.join('<w:p>'+('<w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>' if num else '')+'<w:r><w:t xml:space="preserve">'+html.escape(l)+'</w:t></w:r></w:p>' for l in T.split('\\n'))
    doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+ps+'</w:body></w:document>'
    with zipfile.ZipFile(path,'w',zipfile.ZIP_DEFLATED) as z:
        z.writestr('[Content_Types].xml','<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>')
        z.writestr('word/document.xml',doc)
mk(${JSON.stringify(dx)},False);mk(${JSON.stringify(dn)},True)
PY`);
fs.writeFileSync(`${sc}/bad.exe`,'MZ');fs.writeFileSync(`${sc}/de-thu.txt`,mkText());
// 3. đăng nhập giáo viên A
const login=async(pg,mail)=>{await pg.goto(U+'#/home');await pg.goto(U+'#/teacher');await pg.fill('input[type=email]',mail);await pg.click('button:has-text("Gửi")');await pg.waitForSelector('text=Nếu gmail có trong danh sách');H.clock.now+=70000;await pg.fill('input[placeholder="Mã 6 số"]',lastCode());await pg.click('button:has-text("Đăng nhập")');await pg.waitForSelector('text=Đã đăng nhập',{timeout:10000});};
await login(p,'a@gmail.com');
ok('Giáo viên đăng nhập thấy khung "Tải đề lên cho học sinh"',await p.isVisible('text=Tải đề lên cho học sinh'));
await p.setInputFiles('input[type=file]',dx);await p.waitForSelector('text=Đề hợp lệ',{timeout:8000});
ok('Chọn tệp .docx: đọc được nội dung và báo "Đề hợp lệ"',(await p.inputValue('textarea')).includes('Câu 16.')&&await p.isVisible('text=16/16 câu trắc nghiệm'));
ok('Tên đề tự điền từ tên tệp',(await p.inputValue('input[placeholder^="Tên đề"]'))==='de-thu');
await p.setInputFiles('input[type=file]',dn);await p.waitForSelector('text=danh sách tự động đánh số',{timeout:8000});ok('.docx có đánh số tự động: cảnh báo cho giáo viên',true);
await p.setInputFiles('input[type=file]',`${sc}/bad.exe`);await p.waitForSelector('text=Chỉ nhận tệp .docx hoặc .txt');ok('Tệp lạ (.exe) bị từ chối với thông báo rõ',true);
await p.setInputFiles('input[type=file]',`${sc}/de-thu.txt`);await p.waitForSelector('text=Đã đọc tệp "de-thu.txt"');ok('Chọn tệp .txt đọc được',true);
// 4. đăng đề
await p.fill('input[placeholder^="Tên đề"]','Đề thử của cô Một');await p.selectOption('select[aria-label="Khối"] >> nth=0','7');
await p.click('#pubBtn');await p.waitForSelector('text=Đã đăng đề cho học sinh',{timeout:8000});
ok('Đăng đề: thông báo thành công, đề hiện trong "Đề đã tải lên" ở trạng thái đang mở',await p.isVisible('td:has-text("Đề thử của cô Một")')&&await p.isVisible('text=Đang mở cho học sinh'));
const pubRows=H.sheets['DeGiaoVien'].rows;ok('Máy chủ lưu 1 đề, người đăng = Cô Một, gmail thật không hiện ở danh sách công khai',pubRows.length===2&&pubRows[1][7]==='Cô Một');
const eid=pubRows[1][0];
// 5. học sinh
const sp=await mk();
await sp.goto(U+'#/exams');await sp.waitForSelector('text=Đề thử của cô Một',{timeout:8000});ok('Học sinh (chưa đăng nhập) thấy đề đã đăng trong mục Kiểm tra',true);
ok('Đề xem thử "tmp-preview" không lộ cho học sinh',!(await sp.isVisible('text=Xem thử')));
await sp.goto(U+'#/exam/'+eid);await sp.waitForSelector('#nm',{timeout:8000});ok('Học sinh mở được đề của giáo viên (tải từ máy chủ)',await sp.isVisible('text=Đề thử của cô Một'));
await sp.fill('#nm','nguyen van an');await sp.fill('#cl','7/2');await sp.click('button:has-text("Bắt đầu")');
for(let i=0;i<16;i++){await sp.waitForSelector('.opt');const t=(await sp.textContent('h3'));const n=Number((t.match(/Câu (\d+)/)||[])[1]);
  // đáp án đúng (theo thứ tự xáo) lấy từ nội dung phương án: câu có đáp án = 'ABCD'[ i%4 ] theo thứ tự gốc
  const qn=Number((t.match(/Nội dung câu (\d+)/)||[])[1]);const want=['Phương án một','Phương án hai','Phương án ba','Phương án bốn']['ABCD'.indexOf('ABCD'[qn%4])];
  await sp.click(`.opt:has-text("${want}")`);if(i<15)await sp.click('button:has-text("Câu sau")');}
await sp.click('button:has-text("Câu sau")');await sp.click('button:has-text("Đúng") >> nth=0');await sp.click('button:has-text("Sai") >> nth=1');await sp.click('button:has-text("Đúng") >> nth=2');await sp.click('button:has-text("Sai") >> nth=3');
await sp.click('button:has-text("Câu sau")');await sp.fill('input[aria-label="Câu trả lời"]','1789');
await sp.click('button:has-text("Nộp bài")');await sp.waitForSelector('text=Điểm',{timeout:8000});await sp.waitForTimeout(1200);
const txt=await sp.textContent('body');ok('Học sinh làm đúng hết → điểm 10',/10(,0+)?\s*\/\s*10|Điểm[^0-9]*10/.test(txt),(txt.match(/Điểm[^.]{0,40}/)||[''])[0]);
ok('Điểm của đề giáo viên tự về Google Sheet lớp 7.2',!!H.sheets['7.2']&&H.sheets['7.2'].rows.length===2&&String(H.sheets['7.2'].rows[1][3])===eid);
// 6. phân quyền & bảo mật máy chủ
const pa=p;
let x=await call(sp,'exam_put',{meta:{title:'hack',grade:7,subject:'history',kind:'KTTX',minutes:15},set:r&&{}});ok('Không đăng nhập: không đăng/sửa được đề',x.ok===false&&/đăng nhập/.test(x.error));
x=await call(sp,'exam_mine',{});ok('Không đăng nhập: không xem được danh sách đề',x.ok===false);
x=await call(sp,'exam_load',{id:eid});ok('Không đăng nhập: không đọc được bản đề dành cho giáo viên',x.ok===false);
x=await call(sp,'exam_del',{id:eid});ok('Không đăng nhập: không xóa được đề',x.ok===false);
// giáo viên B không sửa được đề của A; TT sửa được
const pb=await mk();await login(pb,'b@gmail.com');
const sessB=await pb.evaluate(()=>sessionStorage.getItem('dd:sess'));
x=await call(pb,'exam_del',{sess:sessB,id:eid});ok('Giáo viên khác (không phải tổ trưởng/phó) không xóa được đề của người khác',x.ok===false&&/quyền/.test(x.error));
x=await call(pb,'exam_pub',{sess:sessB,id:eid,publish:false});ok('Giáo viên khác không ẩn được đề của người khác',x.ok===false);
x=await call(pb,'exam_mine',{sess:sessB});ok('Giáo viên khác không thấy đề của người khác trong danh sách của mình',x.ok&&x.exams.length===0);
const ptt=await mk();await login(ptt,'tt@gmail.com');const sessT=await ptt.evaluate(()=>sessionStorage.getItem('dd:sess'));
x=await call(ptt,'exam_mine',{sess:sessT});ok('Tổ trưởng thấy đề của cả tổ',x.ok&&x.exams.length===1);
// dữ liệu sai bị máy chủ chặn dù trình duyệt bị qua mặt
const good=(await p.evaluate(t=>DD.examlib.parse(t).set,mkText()));
const meta={title:'Đề kiểm tra tay',grade:7,subject:'history',kind:'KTTX',minutes:15};
x=await call(pb,'exam_put',{sess:sessB,meta,set:{...good,mcq:good.mcq.slice(0,15)}});ok('Máy chủ từ chối đề thiếu câu (không tin trình duyệt)',x.ok===false&&/16 câu/.test(x.error));
x=await call(pb,'exam_put',{sess:sessB,meta:{...meta,grade:12},set:good});ok('Máy chủ từ chối khối ngoài 6–9',x.ok===false);
x=await call(pb,'exam_put',{sess:sessB,meta,set:{...good,mcq:good.mcq.map((q,i)=>i===0?{...q,ans:7}:q)}});ok('Máy chủ từ chối đáp án ngoài A–D',x.ok===false);
const huge={...good,mcq:good.mcq.map(q=>({...q,exp:'x'.repeat(800),q:'y'.repeat(900),opts:q.opts.map(()=> 'z'.repeat(300))}))};x=await call(pb,'exam_put',{sess:sessB,meta,set:huge});ok('Máy chủ cắt độ dài hoặc từ chối đề quá lớn (không vượt giới hạn ô Sheet)',x.ok===false||(H.sheets['DeGiaoVien'].rows.every(r=>String(r[10]).length<=45000)));
x=await call(pb,'exam_put',{sess:sessB,meta:{...meta,title:'=HYPERLINK("http://x","click")'},set:good});ok('Tên đề bắt đầu bằng "=" được vô hiệu hóa công thức trong Sheet',x.ok===true&&H.sheets['DeGiaoVien'].rows.some(r=>String(r[1]).startsWith("'=")));
const draftId=x.id;
const l1=await call(sp,'exam_list',{});ok('Danh sách công khai chỉ có đề đã đăng (bản nháp không lộ)',l1.ok&&l1.exams.length===1&&l1.exams[0].id===eid&&!JSON.stringify(l1).includes('"mcq"'));
x=await call(sp,'exam_get',{id:draftId});ok('Học sinh không tải được đề nháp',x.ok===false);
x=await call(sp,'exam_get',{id:eid});ok('Học sinh tải được đề đã đăng',x.ok&&x.set.mcq.length===16);
// ---- CHẤM ĐIỂM TRÊN MÁY CHỦ
const gj=await call(sp,'exam_get',{id:eid});const gs=JSON.stringify(gj);
ok('Máy chủ KHÔNG gửi đáp án/giải thích cho học sinh (đề công khai chỉ có câu hỏi và phương án)',gj.ok&&!/"ans"|"exp"|Vì sao câu|1789/.test(gs));
ok('Trình duyệt học sinh không giữ đáp án trước khi nộp (bộ nhớ và bản lưu máy)',await sp.evaluate(id=>{const s=JSON.parse(localStorage.getItem('dd:exset:'+id)||'null');return !!s&&!JSON.stringify(s).match(/"ans"|"exp"/)},eid));
const sp2=await mk();await sp2.goto(U+'#/exam/'+eid);await sp2.waitForSelector('#nm');
ok('Trong trang làm bài, đối tượng đề không có đáp án (kiểm tra bằng console)',await sp2.evaluate(id=>DD.examSets[id].mcq.every(q=>q.ans===undefined&&q.exp===undefined)&&DD.examSets[id].sa.ans===undefined,eid));
const blank={m:Array(16).fill(-1),t:[null,null,null,null],s:''};
x=await call(sp2,'exam_submit',{id:'att1',examId:eid,name:'tran thi b',cls:'6.3',answers:blank,score:10});
ok('Máy chủ tự chấm: nộp giấy trắng = 0 điểm, bỏ qua "score:10" do trình duyệt tự gửi',x.ok&&x.score===0);
ok('Kết quả trả về có đáp án + giải thích sau khi nộp',x.detail.m.length===16&&x.detail.m[0].exp&&x.detail.s.ans==='1789');
const ansM=x.detail.m.map(q=>q.ans);
x=await call(sp2,'exam_submit',{id:'att1',examId:eid,name:'tran thi b',cls:'6.3',answers:blank});ok('Gửi lại cùng mã lượt: không tạo dòng trùng',x.ok&&x.duplicate===true&&H.sheets['6.3'].rows.length===2);
x=await call(sp2,'exam_submit',{id:'att2',examId:eid,name:'Tran Thi B',cls:'6/3',answers:{m:ansM,t:[true,false,true,false],s:'1 789'},leaves:2,awaySecs:30,secs:300});
ok('Lượt 2: làm đúng hết → 10 điểm ("1 789" được chấp nhận), vào cùng lớp 6.3, tên viết khác vẫn gộp',x.ok&&x.score===10&&H.sheets['6.3'].rows.length===3);
x=await call(sp2,'exam_submit',{id:'att3',examId:eid,name:'tran thi b',cls:'6.3',answers:{m:ansM,t:[true,false,true,false],s:'1789'}});ok('Lượt 3 bị từ chối (tối đa 2 lượt/đề)',x.ok===false&&/tối đa/.test(x.error)&&H.sheets['6.3'].rows.length===3);
x=await call(sp2,'exam_submit',{id:'att4',examId:eid,name:'x',cls:'6.3',answers:blank});ok('Tên quá ngắn / lớp sai bị từ chối',x.ok===false);
x=await call(sp2,'exam_submit',{id:'att5',examId:eid,name:'le van c',cls:'12.1',answers:blank});ok('Lớp ngoài khối 6–9 bị từ chối',x.ok===false);
x=await call(sp2,'exam_submit',{id:'att6',examId:draftId,name:'le van c',cls:'6.1',answers:blank});ok('Đề nháp (chưa đăng) không nhận bài',x.ok===false&&/đóng|không tồn tại/.test(x.error));
x=await call(sp2,'exam_submit',{id:'att7',examId:eid,name:'le van d',cls:'6.4',answers:{m:['9','x',null,-5,99,1.5,{},[],'A','',0,1,2,3,0,1],t:['x',1,null,'true'],s:'a'.repeat(5000)}});ok('Dữ liệu nộp bị làm bậy: máy chủ không sập, chấm các ô sai là 0',x.ok===true&&x.score<=2);
// nộp thất bại → giữ bài, nộp lại được
const sp3=await mk();await sp3.goto(U+'#/exam/'+eid);await sp3.waitForSelector('#nm');await sp3.fill('#nm','pham van e');await sp3.fill('#cl','8.1');await sp3.click('button:has-text("Bắt đầu")');
await sp3.waitForSelector('.opt');await sp3.route(API,r=>r.abort());
for(let i=0;i<17;i++){await sp3.click('button:has-text("Câu sau")');}
await sp3.click('button:has-text("Nộp bài")');await sp3.waitForSelector('text=Chưa nộp được bài',{timeout:8000});
ok('Mất mạng khi nộp: báo rõ, giữ bài làm, có nút Nộp lại (không mất bài)',await sp3.isVisible('button:has-text("Nộp lại")')&&!H.sheets['8.1']);
await sp3.unroute(API);await sp3.click('button:has-text("Nộp lại")');await sp3.waitForSelector('text=Đã gửi điểm',{timeout:8000});
ok('Có mạng lại: Nộp lại thành công, đúng 1 dòng điểm',H.sheets['8.1']&&H.sheets['8.1'].rows.length===2);
// A ẩn đề → học sinh không thấy nữa; sửa; xóa
await p.goto(U+'#/home');await p.goto(U+'#/teacher');await p.waitForSelector('td:has-text("Đề thử của cô Một")');
await p.click('tr:has-text("Đề thử của cô Một") >> button:has-text("Ẩn khỏi học sinh")');await p.waitForSelector('tr:has-text("Đề thử của cô Một") >> text=Nháp');
H.clock.now+=70000;const l2=await call(sp,'exam_list',{});ok('Ẩn đề: học sinh không còn thấy (sau khi làm mới danh sách)',l2.exams.length===0);
await p.click('tr:has-text("Đề thử của cô Một") >> button:has-text("Sửa")');await p.waitForSelector('text=Đang sửa đề');
ok('Bấm Sửa: nội dung đề hiện lại trong ô để chỉnh',(await p.inputValue('textarea')).includes('Câu 1. Nội dung câu 1 là gì?'));
await p.fill('input[placeholder^="Tên đề"]','Đề thử đã sửa');await p.click('#draftBtn');await p.waitForSelector('text=Đã lưu nháp',{timeout:8000});
ok('Sửa rồi lưu nháp: cập nhật đúng đề cũ (không tạo thêm)',H.sheets['DeGiaoVien'].rows.filter(r=>r[1]==='Đề thử đã sửa').length===1&&H.sheets['DeGiaoVien'].rows.filter(r=>r[8]==='a@gmail.com').length===1);
await p.click('tr:has-text("Đề thử đã sửa") >> button:has-text("Xóa")');await p.waitForSelector('text=Đã xóa đề',{timeout:8000});ok('Xóa đề: biến khỏi Sheet',!H.sheets['DeGiaoVien'].rows.some(r=>r[0]===eid));
// xem đề + đáp án đề giáo viên (nháp của B) bởi TT
await ptt.goto(U+'#/home');await ptt.goto(U+'#/teacher');await ptt.waitForSelector('td:has-text("HYPERLINK")');await ptt.click('tr:has-text("HYPERLINK") >> button:has-text("Xem + đáp án")');await ptt.waitForSelector('text=Giải thích',{timeout:8000});ok('Tổ trưởng xem được đề + đáp án của người khác',true);
// học sinh không vào được trang xem đề
await sp.goto(U+'#/xemde/'+draftId);ok('Học sinh không xem được đề + đáp án (chỉ giáo viên)',await sp.isVisible('text=Chỉ dành cho giáo viên')&&!(await sp.isVisible('text=Giải thích')));
// xem thử không cần máy chủ
await p.goto(U+'#/home');await p.goto(U+'#/teacher');await p.fill('textarea',mkText());await p.fill('input[placeholder^="Tên đề"]','Xem thử');await p.click('button:has-text("Kiểm tra đề")');await p.click('button:has-text("Xem đề + đáp án (như học sinh")');await p.waitForSelector('text=Giải thích',{timeout:8000});ok('Xem thử đề (chưa đăng) bằng trang xem đề + đáp án',(await p.textContent('h1')).includes('Xem thử'));
ok('Không lỗi JS',[p,sp,pb,ptt,sp2,sp3].every(q=>q.errs.length===0),[p,sp,pb,ptt,sp2,sp3].flatMap(q=>q.errs).join('|'));
console.log(R.join('\n'));H.close();await b.close();process.exit(R.some(x=>x.startsWith('FAIL'))?1:0);
