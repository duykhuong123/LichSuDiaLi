import { chromium } from 'playwright';
const SP=process.argv[2];const R=[];const ok=(n,c,x='')=>{R.push((c?'PASS ':'FAIL ')+n+(x?' — '+x:''));};
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:1280,height:900},acceptDownloads:true});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
p.on('dialog',d=>d.accept());
const U='http://localhost:8123/index.html';
// 1. làm bài đầy đủ
await p.goto(U+'#/exam/exam-hist-8-1');await p.fill('#nm','Nguyễn Văn A');await p.fill('#cl','8A1');await p.fill('#nm','Học Sinh');await p.fill('#cl','9.1');await p.click('button:has-text("Bắt đầu làm bài")');
for(let i=0;i<16;i++){await p.click('.opt >> nth=0');await p.click('button:has-text("Câu sau")');}
for(const t of ['Đúng','Sai','Đúng','Sai']){}
for(let i=0;i<4;i++){await p.click('.tfrow >> nth='+i+' >> button >> nth=0');}
await p.click('button:has-text("Câu sau")');await p.fill('input.t','abc');
await p.click('button:has-text("Nộp bài")');await p.waitForSelector('.score');
const sc=await p.textContent('.score');ok('Nộp bài ra điểm',/\/ 10/.test(sc),sc);
ok('Có giải thích',(await p.$$('.exp')).length>=16);
await p.screenshot({path:SP+'/b-result.png'});
// điểm lưu
await p.goto(U+'#/scores');ok('Bảng điểm có 1 dòng',(await p.$$('tbody tr')).length===1);
const dl=p.waitForEvent('download');await p.click('button:has-text("Xuất CSV")');const d=await dl;ok('Xuất CSV',d.suggestedFilename()==='bang-diem.csv');
// 2. tự lưu nháp: làm dở rồi tải lại
await p.goto(U+'#/exam/exam-geo-8-1');await p.fill('#nm','Học Sinh');await p.fill('#cl','8.1');await p.fill('#nm','Học Sinh');await p.fill('#cl','8.1');await p.click('button:has-text("Bắt đầu làm bài")');await p.click('.opt >> nth=1');await p.reload();
ok('Còn bài làm dở sau tải lại',await p.isVisible('text=Có bài đang làm dở'));await p.click('button:has-text("Làm tiếp")');
ok('Giữ đáp án đã chọn',(await p.getAttribute('.opt >> nth=1','aria-checked'))==='true');
// 3. nhập điểm CSV xem trước/xác nhận
import('fs').then(()=>{});
const fs=await import('fs');fs.writeFileSync(SP+'/imp.csv','name,cls,examId,score,at\nTrần B,9A,exam-geo-9-1,8.5,2026-10-20T10:00:00Z\nX,9A,bad-exam,7,2026-10-20T10:00:00Z\nY,9A,exam-geo-9-1,15,2026-10-20T10:00:00Z\n');
await p.goto(U+'#/scores');await p.setInputFiles('input[type=file]',SP+'/imp.csv');await p.waitForSelector('text=Xem trước nhập điểm');
ok('Xem trước báo 1 hợp lệ, 2 lỗi',await p.isVisible('text=1 dòng hợp lệ, 2 dòng lỗi'));
ok('Chưa ghi trước khi xác nhận',(await p.$$('tbody tr')).length===1);
await p.click('button:has-text("Xác nhận thêm")');await p.waitForTimeout(200);ok('Sau xác nhận có 2 dòng',(await p.$$('tbody tr')).length===2);
// 4. Sao lưu / khôi phục
await p.goto(U+'#/admin');const dl2=p.waitForEvent('download');await p.click('button:has-text("Tải bản sao lưu")');const d2=await dl2;const path=await d2.path();const j=JSON.parse(fs.readFileSync(path,'utf8'));ok('Sao lưu JSON hợp lệ',j.app==='dakdoa-portal'&&j.data.results.length===2);
// 5. AI trung thực
await p.goto(U+'#/ai');ok('AI nói rõ chưa bật',await p.isVisible('text=Trợ lý AI chưa được bật'));
await p.fill('input[type=search]','Tây Sơn');ok('Tra cứu hoạt động',await p.isVisible('text=thẻ kiến thức'));
// 6. mọi đề: dựng được và có 18 nút
for(const e of ['exam-hist-6-1','exam-geo-6-1','exam-hist-7-1','exam-hist-7-2','exam-geo-7-1','exam-hist-8-1','exam-geo-8-1','exam-int-8-gk','exam-hist-9-1','exam-hist-9-2','exam-geo-9-1']){await p.goto(U+'#/exam/'+e);await p.fill('#nm','Học Sinh');await p.fill('#cl','9.1');await p.fill('#nm','Học Sinh');await p.fill('#cl','9.1');await p.click('button:text-matches("Bắt đầu làm bài|Làm bài mới")');ok('Đề '+e+' mở được 18 câu',(await p.$$('.nav button')).length===18);}
// 7. các trang không lỗi JS
for(const r of ['home','exams','review','atlas','timeline','mindmaps','drum','ai','scores','teacher','admin','about','schedule']){await p.goto(U+'#/'+r);await p.waitForTimeout(150);}
ok('Không có lỗi console/JS',errs.length===0,errs.join(' | '));
// 8. chấm điểm đúng: tất cả đúng => 10
const full=await p.evaluate(()=>{const D=DD;const id='exam-geo-9-1';const a=D.exam.build(id,123);const s=D.examSets[id];s.mcq.forEach((q,i)=>{a.m[i]=a.order[i].indexOf(q.ans)});s.tf.items.forEach((t,i)=>a.t[i]=t.ans);a.s=s.sa.ans;return D.exam.grade(id,a).total});
ok('Chấm đúng hết = 10 điểm',full===10,String(full));
const zero=await p.evaluate(()=>{const D=DD;const a=D.exam.build('exam-geo-9-1',1);return D.exam.grade('exam-geo-9-1',a).total});ok('Bỏ trống = 0 điểm',zero===0,String(zero));
// 9. XSS: tên có thẻ HTML không chạy
await p.goto(U+'#/exam/exam-geo-9-1');await p.fill('#cl','9.1');await p.fill('#nm','<img src=x onerror=window.__x=1>');await p.click('button:has-text("Làm bài mới")');await p.click('button:has-text("Nộp bài")');await p.waitForTimeout(200);await p.goto(U+'#/scores');await p.waitForTimeout(200);
ok('Tên chứa HTML không thực thi (XSS)',!(await p.evaluate(()=>window.__x))&&(await p.$$('img[src="x"]')).length===0);
console.log(R.join('\n'));await b.close();
