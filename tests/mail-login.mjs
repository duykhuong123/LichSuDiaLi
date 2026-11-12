// Kiểm thử đăng nhập bằng mã 6 số gửi qua gmail: chạy nguyên văn apps-script/Code.gs trong bản giả lập Google. Dữ liệu giáo viên dưới đây là GIẢ.
import { chromium } from 'playwright';
import { startHarness } from './appsScriptHarness.mjs';
const R=[];const ok=(n,c,x='')=>R.push((c?'PASS ':'FAIL ')+n+(x?' — '+x:''));
const U='http://localhost:8123/index.html';const API='http://localhost:8124/exec';
const H=startHarness(8124,new URL('../apps-script/Code.gs',import.meta.url).pathname,[
 ['Cô Thử Một','thu1@gmail.com','TT',''],['Thầy Thử Hai','thu2@gmail.com','',''],['Cô Bị Khóa','khoa@gmail.com','','x']]);
const cfg="window.DD=window.DD||{};DD.config={syncUrl:'"+API+"',syncKey:'',policy:{grace:1,autoSubmit:false,maxLeaves:3,fullscreen:false,block:true,deduct:0.25}};";
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const mkctx=async()=>{const c=await b.newContext({serviceWorkers:'block',viewport:{width:1280,height:900}});await c.route('**/assets/js/config.js',r=>r.fulfill({contentType:'application/javascript',body:cfg}));const p=await c.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));return p;};
const call=(p,op,body)=>p.evaluate(async([a,op,body])=>{const r=await fetch(a,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({op,...body})});return r.json()},[API,op,body]);
const lastCode=()=>{const m=H.mails[H.mails.length-1];return m&&(m.body.match(/: (\d{6})/)||[])[1];};
const p=await mkctx();
const send=async(mail)=>{await p.fill('input[type=email]',mail);await p.click('button:has-text("Gửi")');await p.waitForSelector('text=Nếu gmail có trong danh sách');};
// 1. chưa đăng nhập
await p.goto(U+'#/teacher');ok('Chưa đăng nhập: chỉ thấy khung nhập gmail',await p.isVisible('text=Đăng nhập bằng mã gửi qua gmail')&&!(await p.isVisible('text=Công cụ giáo viên')));
await p.goto(U+'#/xemde/exam-geo-9-1');ok('Học sinh vào thẳng trang xem đề: bị chặn',await p.isVisible('text=Chỉ dành cho giáo viên')&&!(await p.isVisible('text=Giải thích')));
// 2. gmail lạ / bị khóa: không gửi thư, thông báo giống hệt
await p.goto(U+'#/teacher');await send('la@gmail.com');const t1=await p.textContent('[role=status]');
ok('Gmail lạ: KHÔNG gửi thư',H.mails.length===0);
await p.goto(U+'#/home');await p.goto(U+'#/teacher');await send('khoa@gmail.com');ok('Giáo viên bị tạm khóa (x): không gửi thư',H.mails.length===0);
await p.goto(U+'#/home');await p.goto(U+'#/teacher');await send('thu1@gmail.com');const t2=await p.textContent('[role=status]');
ok('Thông báo giống nhau dù gmail có hay không (không lộ danh sách)',t1===t2);
ok('Gmail đúng: gửi đúng 1 thư tới đúng địa chỉ, mã 6 số',H.mails.length===1&&H.mails[0].to==='thu1@gmail.com'&&/^\d{6}$/.test(lastCode()||''));
ok('Thư ghi rõ hiệu lực 10 phút',/10 phút/.test(H.mails[0].body));
ok('Không lưu mã dạng rõ trong cache/properties',!JSON.stringify(H.cache).includes(lastCode())&&!JSON.stringify(H.props).includes(lastCode()));
// 3. sai mã
await p.fill('input[placeholder="Mã 6 số"]','000000');await p.click('button:has-text("Đăng nhập")');await p.waitForSelector('text=Mã không đúng');ok('Sai mã: bị từ chối, chưa vào',!(await p.isVisible('text=Công cụ giáo viên')));
// 4. đúng mã (gmail viết hoa/thường)
const c1=lastCode();await p.fill('input[type=email]','THU1@Gmail.com');await p.fill('input[placeholder="Mã 6 số"]',c1);await p.click('button:has-text("Đăng nhập")');await p.waitForSelector('text=Đã đăng nhập',{timeout:10000});
ok('Đúng mã → vào, hiện tên Cô Thử Một',await p.isVisible('text=Cô Thử Một'));
ok('Thấy thống kê và nút Xem đề/In đề',await p.isVisible('text=Công cụ giáo viên')&&await p.isVisible('a:has-text("Xem đề + đáp án") >> nth=0'));
await p.goto(U+'#/xemde/exam-geo-9-1');await p.waitForTimeout(300);ok('Xem đề + đáp án mở được',await p.isVisible('text=Giải thích'));
ok('Không lưu gmail/mã trong trình duyệt',!(await p.evaluate(()=>JSON.stringify(localStorage)+JSON.stringify(sessionStorage))).match(new RegExp('thu1@gmail|'+c1,'i')));
// 5. mã dùng một lần
const r1=await call(p,'mail_verify',{mail:'thu1@gmail.com',code:c1});ok('Mã đã dùng không dùng lại được',r1.ok===false);
// 6. đăng xuất
await p.evaluate(()=>DD.auth.logout());await p.goto(U+'#/home');await p.goto(U+'#/teacher');ok('Sau đăng xuất: lại bị khóa',await p.isVisible('text=Đăng nhập bằng mã gửi qua gmail'));
// 7. hết hạn sau 10 phút (và chưa hết ở phút thứ 9)
H.clock.now+=70000;await call(p,'mail_send',{mail:'thu2@gmail.com'});const c2=lastCode();
H.clock.now+=9*60000;const rA=await call(p,'mail_verify',{mail:'thu2@gmail.com',code:'x'});ok('Phút thứ 9 vẫn còn hiệu lực (mã còn trong bộ nhớ)',rA.ok===false&&!!Object.keys(H.cache).find(k=>k.startsWith('otp:')));
H.clock.now+=70000;const rB=await call(p,'mail_verify',{mail:'thu2@gmail.com',code:c2});ok('Quá 10 phút: mã hết hạn',rB.ok===false&&/hết hạn/.test(rB.error));
// 8. dò mã: khóa sau 5 lần sai, mã đúng cũng vô hiệu
H.clock.now+=70000;await call(p,'mail_send',{mail:'thu2@gmail.com'});const c3=lastCode();
for(let i=0;i<5;i++)await call(p,'mail_verify',{mail:'thu2@gmail.com',code:i===0?'111111':'22222'+i});
const rC=await call(p,'mail_verify',{mail:'thu2@gmail.com',code:c3});ok('Sai 5 lần: mã đúng cũng bị vô hiệu, phải xin mã mới',rC.ok===false);
// 9. mã của người này không dùng cho gmail người khác
H.clock.now+=70000;await call(p,'mail_send',{mail:'thu1@gmail.com'});const c4=lastCode();const rD=await call(p,'mail_verify',{mail:'thu2@gmail.com',code:c4});ok('Mã gửi cho người này không dùng được cho gmail khác',rD.ok===false);
// 10. giới hạn gửi
const n0=H.mails.length;await call(p,'mail_send',{mail:'thu1@gmail.com'});await call(p,'mail_send',{mail:'thu1@gmail.com'});ok('Gửi dồn dập: tối đa 1 thư / 60 giây / gmail',H.mails.length-n0<=1);
// 11. phiên giả; gỡ khỏi Sheet → mất quyền ngay
const f3=await call(p,'sess_check',{sess:'giamao'});ok('Phiên giả không hợp lệ',f3.ok===false);
H.clock.now+=70000;await call(p,'mail_send',{mail:'thu1@gmail.com'});const jj=await call(p,'mail_verify',{mail:'thu1@gmail.com',code:lastCode()});
const okSess=(await call(p,'sess_check',{sess:jj.sess})).ok===true;H.sheets['GiaoVien'].rows.splice(1,1);
ok('Gỡ khỏi Google Sheet → phiên đang đăng nhập mất hiệu lực ngay',okSess&&(await call(p,'sess_check',{sess:jj.sess})).ok===false);
// 12. phiên 6 giờ
H.clock.now+=70000;await call(p,'mail_send',{mail:'thu2@gmail.com'});const j2=await call(p,'mail_verify',{mail:'thu2@gmail.com',code:lastCode()});H.clock.now+=6*3600*1000+5000;ok('Phiên hết hạn sau 6 giờ',(await call(p,'sess_check',{sess:j2.sess})).ok===false);
// 12b. GHI NHỚ THIẾT BỊ
const ctxR=await b.newContext({serviceWorkers:'block',viewport:{width:1280,height:900}});await ctxR.route('**/assets/js/config.js',r=>r.fulfill({contentType:'application/javascript',body:cfg}));
const pr1=await ctxR.newPage();pr1.errs=[];pr1.on('pageerror',e=>pr1.errs.push(e.message));
const tick=()=>{H.clock.now+=70000;};
H.sheets['GiaoVien'].rows.push(['Thầy Thử Hai','thu2@gmail.com','','']);
tick();await pr1.goto(U+'#/teacher');await pr1.fill('input[type=email]','thu2@gmail.com');await pr1.click('button:has-text("Gửi")');await pr1.waitForSelector('text=Nếu gmail có trong danh sách');
ok('Ô "Ghi nhớ thiết bị" mặc định KHÔNG chọn',!(await pr1.isChecked('#remdev')));
await pr1.fill('input[placeholder="Mã 6 số"]',lastCode());await pr1.click('button:has-text("Đăng nhập")');await pr1.waitForSelector('text=Đã đăng nhập',{timeout:10000});
ok('Không chọn ghi nhớ → không có mã thiết bị trên trình duyệt',!(await pr1.evaluate(()=>localStorage.getItem('dd:dev'))));
await pr1.evaluate(()=>DD.auth.logout());
tick();await pr1.goto(U+'#/home');await pr1.goto(U+'#/teacher');await pr1.fill('input[type=email]','thu2@gmail.com');await pr1.click('button:has-text("Gửi")');await pr1.waitForSelector('text=Nếu gmail có trong danh sách');
await pr1.check('#remdev');await pr1.fill('input[placeholder="Mã 6 số"]',lastCode());await pr1.click('button:has-text("Đăng nhập")');await pr1.waitForSelector('text=Đã đăng nhập',{timeout:10000});
const dev=await pr1.evaluate(()=>localStorage.getItem('dd:dev'));
ok('Chọn ghi nhớ → trình duyệt giữ mã thiết bị',!!dev&&dev.length>=32);
ok('Máy chủ chỉ lưu BẢN BĂM của mã thiết bị',!JSON.stringify(H.props).includes(JSON.parse(dev)));
// mở lại trình duyệt (tab mới, không còn phiên) → tự vào
const pr2=await ctxR.newPage();pr2.errs=[];pr2.on('pageerror',e=>pr2.errs.push(e.message));
await pr2.goto(U+'#/teacher');await pr2.waitForSelector('text=Đã đăng nhập',{timeout:10000});ok('Mở lại trang: tự đăng nhập, KHÔNG cần gmail/mã',await pr2.isVisible('text=Thầy Thử Hai')&&H.mails.length>0);
const nm=H.mails.length;await pr2.goto(U+'#/xemde/exam-geo-9-1');await pr2.waitForTimeout(500);ok('Vào thẳng trang xem đề cũng tự mở được (không gửi thêm thư)',await pr2.isVisible('text=Giải thích')&&H.mails.length===nm);
// thiết bị khác không có mã → vẫn bị khoá
const pr3=await mkctx();await pr3.goto(U+'#/teacher');ok('Máy khác (không ghi nhớ) vẫn phải nhập gmail + mã',await pr3.isVisible('text=Đăng nhập bằng mã gửi qua gmail'));
// mã thiết bị giả
const fk=await call(p,'dev_login',{token:'a'.repeat(40)});ok('Mã thiết bị giả bị từ chối',fk.ok===false);
// hết hạn 30 ngày
const saveNow=H.clock.now;H.clock.now+=31*86400000;const ex=await call(p,'dev_login',{token:JSON.parse(dev)});ok('Quá 30 ngày: thiết bị hết hạn nhớ',ex.ok===false);H.clock.now=saveNow;
ok('Mã thiết bị hết hạn bị xoá khỏi máy chủ',Object.keys(H.props).filter(k=>k.startsWith('dev:')).length===0);
// ghi nhớ lại, rồi gỡ giáo viên khỏi Sheet → mất quyền
tick();await pr1.goto(U+'#/home');await pr1.evaluate(()=>DD.auth.logout());await pr1.goto(U+'#/teacher');await pr1.fill('input[type=email]','thu2@gmail.com');await pr1.click('button:has-text("Gửi")');await pr1.waitForSelector('text=Nếu gmail có trong danh sách');await pr1.check('#remdev');await pr1.fill('input[placeholder="Mã 6 số"]',lastCode());await pr1.click('button:has-text("Đăng nhập")');await pr1.waitForSelector('text=Đã đăng nhập',{timeout:10000});
const dev2=JSON.parse(await pr1.evaluate(()=>localStorage.getItem('dd:dev')));
// đăng xuất = quên thiết bị
const lbl=await pr1.textContent('button:has-text("Đăng xuất")');ok('Nút đăng xuất ghi rõ "quên thiết bị này"',/quên thiết bị/.test(lbl));
await pr1.click('button:has-text("Đăng xuất")');await pr1.waitForTimeout(800);
ok('Đăng xuất: xoá mã thiết bị trên trình duyệt',!(await pr1.evaluate(()=>localStorage.getItem('dd:dev'))));
ok('Đăng xuất: mã thiết bị cũ bị vô hiệu ở máy chủ',(await call(p,'dev_login',{token:dev2})).ok===false);
// gỡ khỏi Sheet
tick();await call(p,'mail_send',{mail:'thu2@gmail.com'});const jr=await call(p,'mail_verify',{mail:'thu2@gmail.com',code:lastCode(),remember:true});
ok('Thiết bị được nhớ đăng nhập được',(await call(p,'dev_login',{token:jr.dev})).ok===true);
{const R2=H.sheets['GiaoVien'].rows;for(let i=R2.length-1;i>0;i--)if(R2[i][1]==='thu2@gmail.com')R2.splice(i,1);}
ok('Gỡ khỏi Google Sheet → thiết bị đã nhớ mất quyền ngay',(await call(p,'dev_login',{token:jr.dev})).ok===false);
// tối đa 4 thiết bị
H.sheets['GiaoVien'].rows.push(['Thầy Thử Hai','thu2@gmail.com','','']);const toks=[];
for(let i=0;i<6;i++){tick();await call(p,'mail_send',{mail:'thu2@gmail.com'});toks.push((await call(p,'mail_verify',{mail:'thu2@gmail.com',code:lastCode(),remember:true})).dev);H.clock.now+=1000;}
const alive=[];for(const t of toks)alive.push((await call(p,'dev_login',{token:t})).ok);
ok('Tối đa 4 thiết bị được nhớ mỗi giáo viên (cái cũ nhất bị bỏ)',alive.filter(Boolean).length===4&&!alive[0]&&!alive[1]&&alive[5]);
ok('Không lỗi JS (ghi nhớ thiết bị)',pr1.errs.length+pr2.errs.length===0,pr1.errs.concat(pr2.errs).join('|'));
// 13. điểm vẫn ghi theo lớp
const pr=await p.evaluate(async(a)=>{const r=await fetch(a,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({id:'abc1',name:'an',cls:'6/1',examId:'e',title:'t',score:8,at:new Date().toISOString()})});return r.json()},API);
ok('Gửi điểm vẫn hoạt động (lớp 6/1 → trang 6.1)',pr.ok===true&&!!H.sheets['6.1']);
ok('Không lỗi JS',p.errs.length===0,p.errs.join('|'));
console.log(R.join('\n'));H.close();await b.close();process.exit(R.some(x=>x.startsWith('FAIL'))?1:0);
