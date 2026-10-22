import { chromium } from 'playwright';
const R=[];const ok=(n,c,x='')=>R.push((c?'PASS ':'FAIL ')+n+(x?' — '+x:''));
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage();p.on('dialog',d=>d.accept());
const errs=[];p.on('pageerror',e=>errs.push(e.message));
const U='http://localhost:8123/index.html';
await p.goto(U+'#/exam/exam-geo-9-1');await p.fill('#nm','Học Sinh');await p.fill('#cl','9.1');await p.fill('#nm','Học Sinh');await p.fill('#cl','9.1');await p.click('button:has-text("Bắt đầu làm bài")');
const hide=h=>p.evaluate(h=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>h});document.dispatchEvent(new Event('visibilitychange'))},h);
await hide(true);await p.waitForTimeout(1200);await hide(false);
ok('Hiện cảnh báo khi quay lại',await p.isVisible('text=Bạn vừa rời khỏi trang làm bài')&&await p.isVisible('text=lần thứ 1'));
await p.click('text=Tôi đã hiểu');
await p.evaluate(()=>window.dispatchEvent(new Event('blur')));await p.waitForTimeout(300);await p.evaluate(()=>window.dispatchEvent(new Event('focus')));
ok('Lần 2 (blur) được đếm',await p.isVisible('text=lần thứ 2'));await p.click('text=Tôi đã hiểu');
await p.click('button:has-text("Nộp bài")');await p.waitForSelector('.score');
ok('Kết quả báo 2 lần rời trang',await p.isVisible('text=Đã ghi nhận 2 lần rời trang'));
await p.goto(U+'#/scores');ok('Bảng điểm hiện cột Rời trang',await p.isVisible('td:has-text("2 lần")'));
const dl=p.waitForEvent('download');await p.click('button:has-text("Xuất CSV")');const f=await (await dl).path();const t=(await import('fs')).readFileSync(f,'utf8');ok('CSV có cột leaves/awaySecs',/leaves,awaySecs/.test(t)&&/,2,\d+/.test(t));
// không đếm ngoài phòng thi
await p.goto(U+'#/home');await p.evaluate(()=>window.dispatchEvent(new Event('blur')));await p.evaluate(()=>window.dispatchEvent(new Event('focus')));ok('Ngoài phòng thi không cảnh báo',!(await p.isVisible('text=Bạn vừa rời khỏi')));
ok('Không lỗi JS',errs.length===0,errs.join());console.log(R.join('\n'));await b.close();
