'use strict';
(() => {
 const $=s=>document.querySelector(s),canvas=$('#view'),ctx=canvas.getContext('2d',{alpha:false}),map=JSON.parse($('#arena-map').textContent),keys=new Set();
 const colors=['#8dfbe3','#ff9bb8','#ffd27d','#b5a0ff','#7bcaff','#ffad7d','#daf27c','#ee9dff'];
 let joined=false,token='',room='',you='',players=[],events=0,angle=0,pitch=0,fire=false,raf=0,last=performance.now(),flash=0,hit=0,hurt=0,health=100,networkTimer,sound=false,audio,session=0;
 let camera={x:2.5,y:2.5},targets=new Map(),lastShot=0,latency=0;
 const touch=matchMedia('(pointer:coarse)').matches;
 const inviteRoom=new URL(location.href).searchParams.get('room');if(inviteRoom && /^[a-z0-9-]{3,20}$/i.test(inviteRoom))$('#room').value=inviteRoom.toUpperCase();
 function resize(){canvas.width=Math.min(1100,innerWidth);canvas.height=Math.round(canvas.width*innerHeight/innerWidth);}addEventListener('resize',resize);resize();
 function clearInput(){keys.clear();fire=false;}addEventListener('blur',clearInput);document.addEventListener('visibilitychange',clearInput);
 function note(text){$('#notice').textContent=text;}
 function beep(frequency=150){if(!sound||!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.type='sawtooth';o.frequency.setValueAtTime(frequency,audio.currentTime);o.frequency.exponentialRampToValueAtTime(50,audio.currentTime+.09);g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.13);}
 $('#sound').addEventListener('click',()=>{sound=!sound;$('#sound').setAttribute('aria-pressed',String(sound));$('#sound').textContent=`Son : ${sound?'oui':'non'}`;if(sound){audio??=new AudioContext();audio.resume();beep();}});
 async function request(data){const response=await fetch('arena-api.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(5000)});const value=await response.json();if(!response.ok){const err=new Error(value.error||'Connexion impossible.');err.status=response.status;throw err;}return value;}
 function score(){const ol=$('#scores');ol.replaceChildren();for(const p of [...players].sort((a,b)=>b.kills-a.kills||a.deaths-b.deaths)){const li=document.createElement('li'),name=document.createElement('span'),n=document.createElement('b');name.textContent=(p.id===you?'● ':'')+p.name;n.textContent=`${p.kills} / ${p.deaths}`;li.style.color=colors[p.color];li.append(name,n);ol.append(li);}$('#count').textContent=`${players.length}/8`;}
 function update(data,initial=false){
  players=data.players;const me=players.find(p=>p.id===you);if(!me)return;
  if(initial||Math.hypot(camera.x-me.x,camera.y-me.y)>2){camera.x=me.x;camera.y=me.y;}
  if(me.hp<health)hurt=1;health=me.hp;$('#health').textContent=health;$('#health-bar').style.width=`${health}%`;$('#kills').textContent=me.kills;
  for(const p of players){const old=targets.get(p.id)||{...p};targets.set(p.id,{...p,displayX:old.displayX??old.x,displayY:old.displayY??old.y});}
  for(const id of targets.keys())if(!players.some(p=>p.id===id))targets.delete(id);
  if(initial)events=Math.max(0,...data.events.map(e=>e.seq));
  else for(const e of data.events){if(e.seq<=events)continue;events=e.seq;if(e.by===you){flash=.16;lastShot=performance.now();beep();if(e.hit){hit=.25;beep(450);}}if(e.kill){const killer=players.find(p=>p.id===e.by);$('#feed').textContent=`${killer?.name||'Pilote'} → ${e.name}`;}}
  if(health<=0){note('Hors combat · Réapparition dans 3 secondes…');clearInput();}else if(players.length===1)note('En attente d’adversaires. Partagez l’invitation à vos amis.');else note('');
  score();
 }
 async function tick(generation){if(!joined||generation!==session)return;const started=performance.now();
  const forward=(keys.has('KeyW')||keys.has('KeyZ')?1:0)-(keys.has('KeyS')?1:0),strafe=(keys.has('KeyD')?1:0)-(keys.has('KeyA')||keys.has('KeyQ')?1:0);
  try{const data=await request({action:'tick',token,room,angle,forward,strafe,fire:fire&&health>0});if(!joined||generation!==session)return;latency=Math.round(performance.now()-started);update(data);$('#connection').textContent=`EN LIGNE · ${latency} ms`;}
  catch(e){if(!joined||generation!==session)return;if(e.status===401){disconnect();$('#lobby-error').textContent=e.message;return;}$('#connection').textContent='RECONNEXION…';note('Connexion interrompue. Nouvelle tentative…');}
  if(joined&&generation===session)networkTimer=setTimeout(()=>tick(generation),Math.max(10,100-(performance.now()-started)));
 }
 $('#join-form').addEventListener('submit',async e=>{e.preventDefault();const button=e.submitter;button.disabled=true;$('#lobby-error').textContent='Connexion au salon…';
  try{room=$('#room').value.trim().toUpperCase();const data=await request({action:'join',room,name:$('#name').value.trim()});token=data.token;you=data.you;joined=true;session++;angle=0;pitch=0;health=100;update(data,true);$('#lobby').hidden=true;$('#hud').hidden=false;$('#room-label').textContent=`SALON / ${room}`;$('#lobby-error').textContent='';$('#connection').textContent='EN LIGNE';if(touch)$('#resume').hidden=true;tick(session);}
  catch(err){$('#lobby-error').textContent=err.message;}finally{button.disabled=false;}
 });
 function disconnect(){joined=false;session++;clearTimeout(networkTimer);clearInput();document.exitPointerLock?.();players=[];targets.clear();$('#hud').hidden=true;$('#lobby').hidden=false;$('#connection').textContent='HORS LIGNE';$('#resume').hidden=false;}
 $('#leave').addEventListener('click',()=>{request({action:'leave',token,room}).catch(()=>{});disconnect();});
 addEventListener('pagehide',()=>{if(joined)navigator.sendBeacon('arena-api.php',new Blob([JSON.stringify({action:'leave',token,room})],{type:'application/json'}));});
 $('#invite').addEventListener('click',async()=>{const url=new URL(location.href);url.searchParams.set('room',room);try{await navigator.clipboard.writeText(url.href);note('Invitation copiée. Vos amis doivent pouvoir accéder à cette adresse.');}catch{note(`Lien du salon : ${url.href}`);}});
 $('#resume').addEventListener('click',async()=>{try{await canvas.requestPointerLock();}catch{note('Utilisez les flèches pour viser, et Espace pour tirer.');$('#resume').hidden=true;}});
 document.addEventListener('pointerlockchange',()=>{clearInput();$('#resume').hidden=!joined||document.pointerLockElement===canvas||touch;});
 document.addEventListener('mousemove',e=>{if(joined&&document.pointerLockElement===canvas){angle+=e.movementX*.0025;pitch=Math.max(-.55,Math.min(.55,pitch-e.movementY*.002));}});
 document.addEventListener('keydown',e=>{if(!joined||e.target.matches('input'))return;if(['KeyW','KeyZ','KeyA','KeyQ','KeyS','KeyD','ArrowLeft','ArrowRight','Space'].includes(e.code)){e.preventDefault();keys.add(e.code);if(e.code==='Space')fire=true;}});
 document.addEventListener('keyup',e=>{keys.delete(e.code);if(e.code==='Space')fire=false;});
 canvas.addEventListener('pointerdown',()=>{if(joined&&document.pointerLockElement===canvas)fire=true;});addEventListener('pointerup',()=>fire=false);
 rootTouch();function rootTouch(){let drag=null;canvas.addEventListener('pointerdown',e=>{if(touch&&joined)drag={id:e.pointerId,x:e.clientX,y:e.clientY};});canvas.addEventListener('pointermove',e=>{if(drag?.id===e.pointerId){angle+=(e.clientX-drag.x)*.008;pitch=Math.max(-.55,Math.min(.55,pitch-(e.clientY-drag.y)*.004));drag={id:e.pointerId,x:e.clientX,y:e.clientY};}});addEventListener('pointerup',()=>drag=null);document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();keys.add(b.dataset.key);b.setPointerCapture(e.pointerId);});for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>keys.delete(b.dataset.key));});$('#touch-fire').addEventListener('pointerdown',e=>{e.preventDefault();fire=true;e.target.setPointerCapture(e.pointerId);});for(const type of ['pointerup','pointercancel'])$('#touch-fire').addEventListener(type,()=>fire=false);}
 function trace(x,y,dx,dy){let mx=Math.floor(x),my=Math.floor(y),sx=dx<0?-1:1,sy=dy<0?-1:1,deltaX=Math.abs(1/dx),deltaY=Math.abs(1/dy),sideX=(dx<0?x-mx:mx+1-x)*deltaX,sideY=(dy<0?y-my:my+1-y)*deltaY,side=0;
  for(let n=0;n<64;n++){if(sideX<sideY){sideX+=deltaX;mx+=sx;side=0;}else{sideY+=deltaY;my+=sy;side=1;}if(!map[my]||!map[my][mx]||map[my][mx]==='1')break;}
  const dist=side===0?sideX-deltaX:sideY-deltaY,u=side===0?y+dist*dy:x+dist*dx;return {dist:Math.max(.05,dist),side,u:u-Math.floor(u)};
 }
 const sprites=colors.map(color=>{const c=document.createElement('canvas');c.width=64;c.height=128;const g=c.getContext('2d');g.fillStyle='#18273c';g.fillRect(17,7,30,30);g.fillStyle=color;g.fillRect(20,16,26,9);g.fillRect(10,44,44,42);g.fillStyle='#293e59';g.fillRect(18,42,28,40);g.fillRect(12,89,15,36);g.fillRect(37,89,15,36);g.fillRect(1,47,12,42);g.fillRect(51,47,12,42);g.fillStyle=color;g.fillRect(20,48,24,4);g.fillRect(15,114,9,7);g.fillRect(40,114,9,7);g.fillStyle='#0b1221';g.fillRect(27,65,10,30);return c;});
 function draw(time){const dt=Math.min(.05,(time-last)/1000);last=time;const w=canvas.width,h=canvas.height;
  if(joined){if(keys.has('ArrowLeft'))angle-=dt*1.8;if(keys.has('ArrowRight'))angle+=dt*1.8;const me=players.find(p=>p.id===you);if(me){camera.x+=(me.x-camera.x)*Math.min(1,dt*16);camera.y+=(me.y-camera.y)*Math.min(1,dt*16);}}else angle+=dt*.09;
  const horizon=h*(.5+pitch*.35),dirX=Math.cos(angle),dirY=Math.sin(angle),fov=.68;
  const ceiling=ctx.createLinearGradient(0,0,0,horizon);ceiling.addColorStop(0,'#060917');ceiling.addColorStop(1,'#17213b');ctx.fillStyle=ceiling;ctx.fillRect(0,0,w,horizon);const floor=ctx.createLinearGradient(0,horizon,0,h);floor.addColorStop(0,'#182237');floor.addColorStop(1,'#070b16');ctx.fillStyle=floor;ctx.fillRect(0,horizon,w,h-horizon);
  ctx.strokeStyle='#31415866';ctx.lineWidth=1;for(let n=1;n<18;n++){const y=horizon+(h-horizon)*n*n/324;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  const depth=new Float32Array(w);for(let x=0;x<w;x+=2){const plane=(2*x/w-1)*fov,dx=dirX-dirY*plane,dy=dirY+dirX*plane,ray=trace(camera.x,camera.y,dx,dy),size=h/ray.dist,top=horizon-size/2,shade=Math.max(.16,1-ray.dist/20),panel=ray.u<.035||ray.u>.965;
   depth[x]=depth[x+1]=ray.dist;const light=(ray.side?.72:1)*shade;ctx.fillStyle=`rgb(${Math.round(29*light)},${Math.round(49*light)},${Math.round(77*light)})`;ctx.fillRect(x,top,2,size);ctx.fillStyle=panel?`rgba(100,157,201,${shade*.55})`:`rgba(69,243,222,${shade*.9})`;if(panel)ctx.fillRect(x,top,2,size);else{ctx.fillRect(x,top+size*.12,2,Math.max(1,size*.014));ctx.fillRect(x,top+size*.88,2,Math.max(1,size*.014));}ctx.fillStyle=`rgba(0,0,0,${.3*(1-shade)})`;ctx.fillRect(x,top,2,size);
  }
  const enemies=[...targets.values()].filter(p=>p.id!==you&&p.hp>0).sort((a,b)=>Math.hypot(b.x-camera.x,b.y-camera.y)-Math.hypot(a.x-camera.x,a.y-camera.y));
  for(const p of enemies){p.displayX+=(p.x-p.displayX)*Math.min(1,dt*12);p.displayY+=(p.y-p.displayY)*Math.min(1,dt*12);const ox=p.displayX-camera.x,oy=p.displayY-camera.y,z=ox*dirX+oy*dirY,lateral=-ox*dirY+oy*dirX;if(z<.15)continue;const height=h/z*.9,width=height*.5,center=w/2*(1+lateral/(z*fov)),top=horizon-height*.5;const sprite=sprites[p.color];for(let x=Math.max(0,Math.floor(center-width/2));x<Math.min(w,center+width/2);x++){if(z<depth[x])ctx.drawImage(sprite,Math.floor((x-center+width/2)/width*64),0,1,128,x,top,1,height);}}
  if(joined){const recoil=Math.max(0,1-(time-lastShot)/140),bob=keys.size?Math.sin(time*.012)*3:0,gx=w*.61,gy=h+recoil*20+bob;ctx.save();ctx.translate(gx,gy);ctx.fillStyle='#18253b';ctx.beginPath();ctx.moveTo(-w*.1,0);ctx.lineTo(-w*.045,-h*.16);ctx.lineTo(w*.02,-h*.19);ctx.lineTo(w*.075,0);ctx.fill();ctx.fillStyle='#3b4a65';ctx.fillRect(-w*.033,-h*.22,w*.065,h*.16);ctx.fillStyle='#0c1425';ctx.fillRect(-w*.019,-h*.25,w*.038,h*.15);ctx.fillStyle='#83ffe3';ctx.fillRect(-w*.025,-h*.16,w*.008,h*.075);if(flash>0){ctx.fillStyle='#ffe9a4';ctx.beginPath();ctx.moveTo(0,-h*.34);ctx.lineTo(w*.035,-h*.23);ctx.lineTo(-w*.025,-h*.27);ctx.lineTo(w*.035,-h*.31);ctx.lineTo(0,-h*.22);ctx.closePath();ctx.fill();}ctx.restore();
   // Local radar: walls and the player's heading; opponents remain hidden.
   const scale=4,ox=18,oy=90;ctx.fillStyle='#050b18bb';ctx.fillRect(ox-5,oy-5,74,74);map.forEach((row,y)=>[...row].forEach((c,x)=>{if(c==='1'){ctx.fillStyle='#54718d';ctx.fillRect(ox+x*scale,oy+y*scale,scale,scale);}}));ctx.fillStyle='#91ffe7';ctx.beginPath();ctx.arc(ox+camera.x*scale,oy+camera.y*scale,2.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#91ffe7';ctx.beginPath();ctx.moveTo(ox+camera.x*scale,oy+camera.y*scale);ctx.lineTo(ox+(camera.x+dirX*1.5)*scale,oy+(camera.y+dirY*1.5)*scale);ctx.stroke();
  }
  flash=Math.max(0,flash-dt);hit=Math.max(0,hit-dt);hurt=Math.max(0,hurt-dt*2);$('#hitmarker').style.opacity=hit>0?'1':'0';if(hurt){ctx.fillStyle=`rgba(255,50,80,${hurt*.25})`;ctx.fillRect(0,0,w,h);}if(joined&&health<=0){ctx.fillStyle='#08091acc';ctx.fillRect(0,0,w,h);}
  raf=requestAnimationFrame(draw);
 }
 raf=requestAnimationFrame(draw);
})();
