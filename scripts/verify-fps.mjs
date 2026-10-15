import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base=process.env.TCGN_TEST_URL||'http://127.0.0.1:8000';
const room=`TEST-${Date.now().toString(36)}`.toUpperCase();
const endpoint=new URL('arena-api.php',base+'/');
async function api(data,status=200){const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({room,...data})});assert.equal(response.status,status);return response.json();}
await api({action:'tick',token:'invalid'},401);
await api({action:'join',room:'!'},422);
const a=await api({action:'join',name:'Alpha'}),b=await api({action:'join',name:'Bravo'});
assert.equal(a.players.length,1);assert.equal(b.players.length,2);
await api({token:a.token,angle:'invalid'},422);
for(let n=0;n<4;n++){await api({token:a.token,angle:0,fire:true});await new Promise(r=>setTimeout(r,290));}
let state=await api({token:b.token});
assert.equal(state.players.find(p=>p.id===b.you).hp,0);
assert.equal(state.players.find(p=>p.id===a.you).kills,1);
await new Promise(r=>setTimeout(r,3100));state=await api({token:b.token});assert.equal(state.players.find(p=>p.id===b.you).hp,100);
// The server ignores client position/score claims.
state=await api({token:a.token,x:99,y:99,kills:10000});assert.equal(state.players.find(p=>p.id===a.you).x,2.5);assert.equal(state.players.find(p=>p.id===a.you).kills,1);
const extras=[];for(let n=0;n<6;n++)extras.push(await api({action:'join',name:'Extra'+n}));await api({action:'join'},409);
for(const p of [a,b,...extras])await api({action:'leave',token:p.token});
const browser=await chromium.launch({channel:process.env.TCGN_BROWSER||'msedge'});
try{
 const contexts=await Promise.all([browser.newContext(),browser.newContext()]);
 const pages=await Promise.all(contexts.map(c=>c.newPage()));const errors=[];pages.forEach(p=>p.on('pageerror',e=>errors.push(e.message)));
 for(let i=0;i<2;i++){const p=pages[i];await p.goto(base+'/fps.php?room='+room);await p.locator('#name').fill('Player'+i);await p.locator('#join-form button').click();await p.locator('#hud').waitFor({state:'visible'});}
 await pages[0].waitForFunction(()=>document.querySelector('#count').textContent==='2/8');await pages[1].waitForFunction(()=>document.querySelector('#count').textContent==='2/8');
 // Keyboard movement works with the join button still focused.
 await pages[0].keyboard.down('KeyW');await pages[0].waitForTimeout(450);await pages[0].keyboard.up('KeyW');
 const observer=await api({action:'join',name:'Observer'});
 assert.ok(observer.players.find(p=>p.name==='Player0').x>2.8,'Keyboard input must move the player on the server');
 await api({action:'leave',token:observer.token});
 await pages[0].keyboard.down('Space');await pages[0].waitForTimeout(1400);await pages[0].keyboard.up('Space');
 await pages[0].waitForFunction(()=>document.querySelector('#kills').textContent==='1');
 assert.equal(await pages[1].locator('#health').textContent(),'0');
 await pages[0].locator('#invite').click();
 await pages[0].locator('#view').screenshot({path:'artifacts/fps-arena.png'});
 for(const width of [320,768,1440]){await pages[1].setViewportSize({width,height:900});assert.ok(await pages[1].evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await pages[1].locator('#leave').click();await pages[0].waitForFunction(()=>document.querySelector('#count').textContent==='1/8');await pages[0].locator('#leave').click();
 assert.deepEqual(errors,[]);console.log('PASS: two browser clients, room membership, damage, elimination, respawn, authorization, capacity, authoritative positions/scores, responsive UI and no JS errors.');
}finally{await browser.close();}
