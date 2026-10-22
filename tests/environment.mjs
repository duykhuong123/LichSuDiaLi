import { chromium } from 'playwright';
const SP=process.argv[2];const R=[];const ok=(n,c,x='')=>R.push((c?'PASS ':'FAIL ')+n+(x?' — '+x:''));
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
// offline
const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();
await p.goto('http://localhost:8123/index.html');await p.waitForTimeout(1500);
ok('Service worker đã đăng ký',await p.evaluate(async()=>!!(await navigator.serviceWorker.getRegistration())));
await p.waitForTimeout(1500);await ctx.setOffline(true);
await p.goto('http://localhost:8123/index.html#/atlas').catch(()=>{});await p.reload().catch(e=>{});await p.waitForTimeout(800);
ok('Mở lại khi ngoại tuyến',await p.isVisible('h1:has-text("Quả địa cầu")'));
await ctx.setOffline(false);
// file://
const p2=await b.newPage();const e2=[];p2.on('pageerror',e=>e2.push(e.message));
await p2.goto('file://'+process.cwd()+'/docs/index.html#/exams');await p2.waitForTimeout(500);
ok('Mở trực tiếp file:// được',await p2.isVisible('h1:has-text("Ngân hàng đề")')&&!e2.length,e2.join());
// không gọi mạng ngoài
const ext=[];const p3=await b.newPage();p3.on('request',r=>{if(!r.url().startsWith('http://localhost')&&!r.url().startsWith('data:'))ext.push(r.url())});
await p3.goto('http://localhost:8123/index.html#/home');await p3.waitForTimeout(800);ok('Không tải tài nguyên bên ngoài (CDN/font)',ext.length===0,ext.join());
// mobile
const m=await b.newContext({viewport:{width:375,height:760},isMobile:true,hasTouch:true});const pm=await m.newPage();
for(const r of ['home','exam/exam-hist-8-1','atlas','timeline','mindmaps']){await pm.goto('http://localhost:8123/index.html#/'+r);await pm.waitForTimeout(400);
 const ov=await pm.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);ok('Di động 375px không tràn ngang: '+r,ov<=1,'dư '+ov+'px');await pm.screenshot({path:`${SP}/m-${r.split('/')[0]}.png`});}
// reduced motion: không tự quay
const rm=await b.newContext({reducedMotion:'reduce'});const pr=await rm.newPage();await pr.goto('http://localhost:8123/index.html#/atlas');await pr.click('button:has-text("Tự quay")');ok('Giảm chuyển động: nút Tự quay không bật',(await pr.getAttribute('button:has-text("Tự quay")','aria-pressed'))==='false');
// bàn phím: skip link
const pk=await (await b.newContext()).newPage();await pk.goto('http://localhost:8123/index.html');await pk.keyboard.press('Tab');ok('Phím Tab đầu tiên tới "Bỏ qua đến nội dung"',(await pk.evaluate(()=>document.activeElement.className))==='skip');
console.log(R.join('\n'));await b.close();
