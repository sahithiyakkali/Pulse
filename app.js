// Pulse app logic.

const $=s=>document.querySelector(s);
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const NOW=new Date(),TK=iso(NOW),WI=(NOW.getDay()+6)%7+1;
const WD=[...Array(7)].map((_,i)=>{const d=new Date(NOW);d.setDate(NOW.getDate()-WI+1+i);return iso(d)});
let S={w:140,goal:'build',activity:'moderate',diet:'veg',time:0,fav:[],mix:'mix',more:[],no:[],budget:30,log:[],custom:[],have:[],done:false};
const S0=JSON.stringify(S);
try{Object.assign(S,JSON.parse(localStorage.getItem('pulse2')||'{}'))}catch(e){}
S.custom.forEach(m=>MM[m.id]=m);
let tab='today',step=0;
let RS='',RST=false,LD=TK,SM=null;const E={desc:'',q:'',asked:false};
(async()=>{try{SM=await window.claude.use('sample')}catch(e){}if(SM&&tab=='log')draw()})();
const save=()=>{try{localStorage.setItem('pulse2',JSON.stringify(S))}catch(e){}};
const ld=()=>tab=='log'?LD:TK;
const usd=x=>'$'+x.toFixed(2);
const elig=()=>M.filter(m=>{const ks=Object.keys(m.ing);return(S.diet=='veg'||!ks.some(k=>ANIMAL.includes(k)))&&!ks.some(k=>S.no.includes(k))&&(!S.time||m.t<=S.time)});
const cps=m=>Object.entries(m.ing).reduce((a,[k,u])=>a+D[k][1]/D[k][2]*u,0);
const moreN=m=>Object.keys(m.ing).filter(k=>S.more.includes(k)).length;
const dT=()=>({P:Math.max(S.w||0,60)*BASE[S.goal]*ACT[S.activity]*.67,F:28*.67,Fe:15*.67});
function have(ds){const h={P:0,F:0,Fe:0};for(const [id,d] of S.log){const m=MM[id];if(m&&ds.includes(d)){h.P+=m.P;h.F+=m.F;h.Fe+=m.Fe}}return h}
function cuis(ds){const c={};for(const [id,d] of S.log){const m=MM[id];if(m&&ds.includes(d)&&m.c!='Other')c[m.c]=(c[m.c]||0)+1}return c}
const bars=(H,T)=>NUT.map(([k,l,u,col])=>{const p=Math.min(100,H[k]/T[k]*100);return `<div class="bar"><div class="top"><span>${l}</span><span>${Math.round(H[k])} of ${Math.round(T[k])} ${u}</span></div><div class="track"><div class="fill" style="width:${p}%;background:var(${col})"></div></div></div>`}).join('');

function rec(){
 const T=dT(),Hd=have([TK]),Hw=have(WD),wg={},mx=MIX[S.mix],cc=cuis(WD);
 NUT.forEach(([k])=>wg[k]=Math.max(0,1-Hw[k]/(T[k]*WI)));
 const sc=elig().map(m=>{let s=0,best=null,bv=0;for(const [k,l] of NUT){const v=(k=='P'&&S.goal!='health'?1.6:1)*(1+wg[k])*Math.min(m[k],Math.max(0,T[k]-Hd[k]))/T[k];s+=v;if(v>bv){bv=v;best=l.toLowerCase()}}
  s*=(S.fav.includes(m.c)?mx[0]:1)*Math.pow(mx[1],cc[m.c]||0)*Math.pow(1.15,moreN(m));return{m,s,best}}).sort((a,b)=>b.s-a.s);
 const out=[];for(const r of sc)if(out.length<3&&!out.some(o=>o.m.c==r.m.c))out.push(r);
 for(const r of sc)if(out.length<3&&!out.includes(r))out.push(r);
 return{out,wg};
}
const recRow=({m,best},i)=>`<div class="rec ${i?'':'big'}"><div><div class="nm"><button class="lnk" data-recipe="${m.id}">${m.n}</button></div><div class="meta"><span>${m.c}</span><span>${m.P} g protein</span><span>${m.F} g fiber</span><span>${m.t} min</span><span>about ${usd(cps(m))}</span></div>${i?'':`<div class="why">Best for your ${best} gap today.</div>`}</div><button class="btn" data-add="${m.id}">Ate this</button></div>`;

function basket(cnt){let c=0,list=[];for(const k in cnt){if(S.have.includes(k))continue;const [n,p,u]=D[k],packs=Math.ceil(cnt[k]/u);c+=packs*p;list.push([n,packs,packs*p])}return{c,list}}
function plan(){
 const el=elig(),mx=MIX[S.mix];let cnt={},picks={},cc={},total=0,n=0;
 const val=m=>(m.P*(S.goal=='build'||S.goal=='lean'?1.3:1)+m.F*.6+m.Fe)*(S.fav.includes(m.c)?mx[0]:1)*Math.pow(1.15,moreN(m))*Math.pow(.85,picks[m.id]||0)*Math.pow(mx[1],cc[m.c]||0);
 while(n<14){let best=null,bs=0;
  for(const m of el){const c2={...cnt};for(const k in m.ing)c2[k]=(c2[k]||0)+m.ing[k];const nc=basket(c2).c;if(nc>S.budget+1e-9)continue;const s=val(m)/Math.max(nc-total,.05);if(s>bs){bs=s;best=[m,c2,nc]}}
  if(!best)break;cnt=best[1];total=best[2];picks[best[0].id]=(picks[best[0].id]||0)+1;cc[best[0].c]=(cc[best[0].c]||0)+1;n++}
 return{picks,cnt,cc,total,n};
}
function shop(){
 $('#bv').textContent='$'+S.budget;
 const p=plan();
 if(!p.n){$('#shop').innerHTML='<p>That budget is too small for these filters. Raise it a bit.</p>';return}
 const b=basket(p.cnt);let pro=0;
 const rows=Object.entries(p.picks).map(([id,n])=>{const m=MM[id];pro+=m.P*n;return `<tr><td><button class="lnk" data-recipe="${m.id}">${m.n}</button></td><td>${n} serving${n>1?'s':''}</td></tr>`}).join('');
 $('#shop').innerHTML=`<div class="stats"><div><strong>${p.n}</strong>meals</div><div><strong>${usd(b.c/p.n)}</strong>per meal</div><div><strong>${Math.round(pro/p.n)} g</strong>protein per meal</div><div><strong>${usd(b.c)}</strong>total</div></div>
 <p class="meta" style="margin:0 0 12px">Cuisines in this plan: ${Object.entries(p.cc).map(([c,n])=>`${c} ${n}`).join(', ')}</p>
 <div class="grid"><div class="scroll"><table><tr><th>Cook this</th><th>Servings</th></tr>${rows}</table></div>
 <div class="scroll"><table><tr><th>Buy this</th><th>Qty</th><th>Cost</th></tr>${b.list.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${usd(r[2])}</td></tr>`).join('')}</table></div></div><div class="row"><span class="meta" id="cpm"></span><button class="btn ghost" data-copy="1">Copy list</button></div>`;
}

const sel=(k,o)=>`<select data-k="${k}">${o.map(([v,l])=>`<option value="${v}"${S[k]==v?' selected':''}>${l}</option>`).join('')}</select>`;
const chp=(k,l)=>`<div class="chips">${l.map(([v,t])=>`<button class="chip" data-ck="${k}" data-v="${v}" aria-pressed="${S[k].includes(v)}">${t}</button>`).join('')}</div>`;
const G=[
()=>`<label class="fld">Weight (lb)<input type="number" data-k="w" min="60" max="400" value="${S.w}"></label><label class="fld">Main goal${sel('goal',[['build','Build muscle'],['lean','Lose fat, keep muscle'],['keep','Stay strong and steady'],['health','Eat healthier overall']])}</label><label class="fld">Activity${sel('activity',[['light','Light, mostly studying'],['moderate','Moderate, workouts 2 to 4 days'],['heavy','Heavy, training most days']])}</label><label class="fld">Diet${sel('diet',[['veg','Vegetarian, with eggs and dairy'],['vegan','Vegan']])}</label><label class="fld">Time per meal${sel('time',[[0,'Any'],[20,'20 min or less'],[30,'30 min or less']])}</label>`,
()=>`<p class="nm">Cuisines you love</p>${chp('fav',CU.map(c=>[c,c]))}<label class="fld" style="margin-top:14px">How much variety?${sel('mix',[['fav','Mostly my favorites'],['mix','A healthy mix'],['wild','Surprise me']])}</label><p class="meta">Even if you pick one cuisine, Pulse keeps other cuisines in your rotation.</p>`,
()=>`<p class="nm">Foods you want more of</p>${chp('more',FOODS)}<p class="nm" style="margin-top:14px">Foods you do not eat</p>${chp('no',FOODS)}`
];
const TT=[['Welcome to Pulse','Three quick steps and Pulse sets your protein, fiber, and iron targets and picks meals you will want to eat.'],['What do you like to eat?','Pick every cuisine you enjoy.'],['Foods to add or skip','Tap what you want more of and what you never eat.']];
function ov(){
 const o=$('#ov');o.hidden=S.done;if(S.done)return;
 const T=dT();
 o.innerHTML=`<div class="in"><h1 style="font-size:2.3rem">${TT[step][0]}</h1><p class="sub">${TT[step][1]}</p>${G[step]()}${step==2?`<p class="why">Your daily protein goal is about ${Math.round(T.P/.67)} g. Pulse plans two main meals a day, so it aims for about ${Math.round(T.P)} g from cooked meals.</p>`:''}<div class="row">${step?'<button class="btn ghost" data-step="-1">Back</button>':'<span></span>'}<button class="btn" data-step="1">${step==2?'Start using Pulse':'Next'}</button></div></div>`;
}

const V={
today(){const r=rec(),T=dT(),w=Object.entries(r.wg).sort((a,b)=>b[1]-a[1])[0],nm=NUT.find(n=>n[0]==w[0])[1].toLowerCase();
 return `<div class="grid"><section class="panel"><h2>Today</h2>${bars(have([TK]),T)}<p class="note">Targets cover the meals you cook, about two thirds of a full day.</p></section><section class="panel"><h2>Eat next</h2><div class="gap">${w[1]<.05?'You are on track this week.':`This week you are ${Math.round(w[1]*100)}% short on ${nm}.`}</div>${r.out.map(recRow).join('')||'<p>No meals match your filters. Try a longer time limit.</p>'}</section></div>`},
week(){const T=dT(),Tw={P:T.P*WI,F:T.F*WI,Fe:T.Fe*WI},cs=Object.entries(cuis(WD)).sort((a,b)=>b[1]-a[1]).map(([c,n])=>`${c} ${n}`).join(', ');
 const days=WD.map((d,i)=>{const h=i<WI?Math.min(90,Math.round(have([d]).P/T.P*90)):0;return `<div${i==WI-1?' style="color:var(--ink);font-weight:700"':''}><i style="height:${h||3}px;opacity:${i<WI?1:.25}"></i>${'MTWTFSS'[i]}</div>`}).join('');
 return `<div class="grid"><section class="panel"><h2>This week so far</h2>${bars(have(WD),Tw)}</section><section class="panel"><h2>Protein by day</h2><div class="days">${days}</div><p class="meta">Each bar is a day, measured against your daily protein target.</p><h2 style="margin-top:18px">Cuisines this week</h2><p>${cs||'Nothing logged yet.'}</p></section></div>`},
log(){const row=(m,x)=>`<div class="rec" style="padding:8px 0"><div><div class="nm">${x?m.n:`<button class="lnk" data-recipe="${m.id}">${m.n}</button>`}</div><div class="meta"><span>${m.c=='Other'?'Your food':m.c}</span><span>${m.P} g protein</span><span>${m.F} g fiber</span></div></div><div class="ctl">${x?`<button class="step" data-del="${m.id}" aria-label="Delete ${m.n}" title="Delete this food">×</button>`:''}<button class="step" data-sub="${m.id}" aria-label="Remove one ${m.n}">−</button><b>${S.log.filter(y=>y[0]==m.id&&y[1]==LD).length}</b><button class="step" data-add="${m.id}" aria-label="Add one ${m.n}">+</button></div></div>`;
 return `<section class="panel"><label class="fld" style="max-width:260px">Logging for<select id="ldSel">${WD.slice(0,WI).map((d,i)=>`<option value="${d}"${d==LD?' selected':''}>${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i]}${d==TK?' (today)':''}</option>`).join('')}</select></label><h2>Add something else you ate</h2>${SM?`<div class="fld"><label>Describe it and Pulse estimates the nutrition<input id="estIn" value="${qa(E.desc)}" placeholder="A bowl of curd rice with quinoa"></label><div class="row" style="margin-top:8px"><span class="meta">Uses your Claude account. Estimates are rough.</span><button class="btn" data-est="1">Estimate</button></div><div id="estOut" style="margin-top:8px"></div></div><p class="meta">Check the numbers, then add it:</p>`:''}<div class="fields"><label>What was it?<input id="cfName" placeholder="Dining hall dal, protein shake"></label><label>Protein (g)<input id="cfP" type="number" min="0" placeholder="0"></label><label>Fiber (g)<input id="cfF" type="number" min="0" placeholder="0"></label><label>Iron (mg)<input id="cfI" type="number" min="0" placeholder="0"></label><label>Cuisine<select id="cfC"><option value="Other">Not sure or other</option>${CU.map(c=>`<option>${c}</option>`).join('')}</select></label></div><div class="row"><span class="meta">Numbers are optional. A food label or a quick search gives good estimates.</span><button class="btn" data-addcustom="1">Add and log it</button></div>${S.custom.length?`<h2 style="margin-top:18px">Your foods</h2>${S.custom.map(m=>row(m,1)).join('')}`:''}</section><section class="panel"><h2>Pulse meals</h2>${elig().map(m=>row(m,0)).join('')}</section>`},
shop(){return `<section class="panel"><h2>Grocery run</h2><p class="nm">Already in your kitchen</p>${chp('have',Object.keys(D).map(k=>[k,D[k][0].split(' (')[0]]))}<label for="budget" style="margin-top:14px">Budget for the week: <b id="bv"></b></label><input id="budget" data-k="budget" type="range" min="10" max="60" step="1" value="${S.budget}"><div id="shop" style="margin-top:14px"></div></section>`},
swaps(){return `<section class="panel"><h2>Easy swaps for carb-heavy meals</h2><p class="sub" style="margin-bottom:6px">Keep the meal you like and change one thing.</p>${SW.filter(s=>S.diet=='veg'||s[4]).map(s=>`<div class="swap"><div class="nm">${s[0]} → ${s[1]}</div><div class="meta"><span>${s[2]}</span><span>${s[3]}</span></div></div>`).join('')}</section>`},
me(){return `<section class="panel"><h2>Your profile</h2><div class="grid"><div>${G[0]()}</div><div>${G[1]()}<div style="margin-top:14px">${G[2]()}</div></div></div><div class="row"><button class="btn ghost" data-redo="1">Redo the welcome tour</button></div></section><section class="panel"><h2>Your data</h2><p class="meta">Pulse saves your data in this browser only. Before you move it to a new website, tap Back up, copy the text, and paste it on the new site with Restore.</p><textarea id="bk" rows="4" style="width:100%;margin-top:8px;font:inherit;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:8px;padding:8px"></textarea><div class="row"><button class="btn ghost" data-exp="1">Back up</button><button class="btn ghost" data-imp="1">Restore</button><button class="btn ghost" data-reset="1">Erase everything</button></div><p class="meta" id="bkm"></p></section>`}
};
const TABS=[['today','Today'],['week','Week'],['log','Log meals'],['shop','Groceries'],['swaps','Swaps'],['me','Profile']];
function draw(){RST=false;save();ov();$('#tabs').innerHTML=TABS.map(([k,l])=>`<button role="tab" data-tab="${k}" aria-selected="${tab==k}">${l}</button>`).join('');$('#main').innerHTML=V[tab]();if(tab=='shop')shop();if(tab=='log')renderEst()}

const qa=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
function renderEst(){const o=$('#estOut');if(!o||!E.q)return;
 o.innerHTML='<label class="fld"><span id="estQ"></span><input id="estAns" placeholder="For example, one large bowl"></label><div class="row"><button class="btn ghost" data-estguess="1">Use a typical portion</button><button class="btn" data-est2="1">Estimate</button></div>';
 $('#estQ').textContent=E.q}
async function estimate(ans){
 const o=$('#estOut');o.textContent='Estimating...';
 const p=`You estimate nutrition for a vegetarian meal-tracking app. The person described a meal they ate. Use typical values for the foods described and a typical single serving if no portion is given.
Meal: ${E.desc}
${ans?'Portion details from the person: '+ans:''}
${E.asked||ans?'Do not ask questions. Give your best estimate.':'If the portion is truly unclear and would change the numbers a lot, reply with only {"ask":"one short question about how much they ate"}. Otherwise estimate.'}
Reply with only JSON. Estimate format: {"name":"short meal name","portion":"the portion you assumed","protein_g":number,"fiber_g":number,"iron_mg":number,"calories":number,"cuisine":"one of ${CU.join(', ')}, or Other","note":"one short caveat"}`;
 try{
  const r=await SM.json(p,{modelTier:'quick'});
  if(r.ask&&!E.asked&&!ans){E.asked=true;E.q=String(r.ask);o.textContent='';renderEst();return}
  if(r.protein_g==null){o.textContent='Could not estimate that. Try describing it differently or enter the numbers yourself.';return}
  E.q='';
  $('#cfName').value=String(r.name||E.desc);$('#cfP').value=Math.round(r.protein_g);$('#cfF').value=Math.round((r.fiber_g||0)*10)/10;$('#cfI').value=Math.round((r.iron_mg||0)*10)/10;$('#cfC').value=CU.includes(r.cuisine)?r.cuisine:'Other';
  o.textContent=`Estimated for ${r.portion||'a typical serving'}, about ${Math.round(r.calories||0)} calories. ${r.note||''} Check the numbers below, then tap Add and log it.`;
 }catch(e){o.textContent=e&&e.code=='not_granted'?'Estimates need your permission to use Claude.':'Could not estimate right now. You can enter the numbers yourself.'}
}

const FR=[[0,''],[.25,'1/4'],[1/3,'1/3'],[.5,'1/2'],[2/3,'2/3'],[.75,'3/4'],[1,'']];
function fmt(n){let w=Math.floor(n+1e-9),f=n-w,b=FR.reduce((a,c)=>Math.abs(c[0]-f)<Math.abs(a[0]-f)?c:a);if(b[0]==1){w++;b=FR[0]}return((w?w+(b[1]?' ':''):'')+b[1])||'0'}
const sc=(t,n)=>n==1?t:t.replace(/^(\d+ \d\/\d|\d+\/\d+|\d+(?:\.\d+)?)/,x=>fmt(x.split(' ').reduce((a,q)=>a+(q.includes('/')?q.split('/')[0]/q.split('/')[1]:+q),0)*n));
function recipe(id,n){n=n||1;const m=MM[id],r=R[id];if(!m||!r)return;RS=id;const o=$('#rc');
 o.innerHTML=`<div class="in"><h1 style="font-size:2rem">${m.n}</h1><div class="meta" style="margin-bottom:14px"><span>${m.c}</span><span>${m.t} min total</span><span>${m.P} g protein per serving</span><span>${m.F} g fiber</span><span>${m.Fe} mg iron</span><span>about ${usd(cps(m)*n)} for ${n}</span></div><label class="fld" style="max-width:200px">Servings<select id="rsN">${[1,2,3,4].map(x=>`<option${x==n?' selected':''}>${x}</option>`).join('')}</select></label><h2>Ingredients</h2><p class="meta">Tick what you already have. The rest is what to buy.</p><ul style="list-style:none;padding:0">${r[0].split(';').map(x=>`<li><label class="ck"><input type="checkbox">${sc(x.trim(),n)}</label></li>`).join('')}</ul><h2>Steps</h2><ol>${r[1].split('|').map(x=>`<li>${x.trim()}</li>`).join('')}</ol><p class="note">${n>1?'Amounts inside the steps are for 1 serving. ':''}Nutrition is approximate.</p><div class="row"><button class="btn ghost" data-close="1">Close</button><button class="btn" data-add="${m.id}" data-close="1">I ate 1 serving</button></div></div>`;
 o.hidden=false;$('#rsN').focus()}
function fallback(t){const o=$('#cpm');o.innerHTML='<textarea readonly rows="8" style="width:100%"></textarea>';o.firstChild.value=t;o.firstChild.select()}
function copyList(){const p=plan(),b=basket(p.cnt);
 const t='Grocery list ('+usd(b.c)+')\n'+b.list.map(r=>`- ${r[0]} x${r[1]}`).join('\n')+'\n\nCook:\n'+Object.entries(p.picks).map(([id,n])=>`- ${MM[id].n} x${n}`).join('\n');
 try{navigator.clipboard.writeText(t).then(()=>{$('#cpm').textContent='Copied to your clipboard.'},()=>fallback(t))}catch(e){fallback(t)}}
document.addEventListener('keydown',e=>{if(e.key=='Escape')$('#rc').hidden=true});
document.addEventListener('change',e=>{if(e.target.id=='ldSel'){LD=e.target.value;draw();return}if(e.target.id=='rsN'){recipe(RS,+e.target.value);return}const k=e.target.dataset.k;if(!k||k=='budget')return;S[k]=(k=='w'||k=='time')?+e.target.value:e.target.value;draw()});
document.addEventListener('input',e=>{if(e.target.id=='estIn')E.desc=e.target.value;if(e.target.dataset.k=='budget'){S.budget=+e.target.value;shop();save()}});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if(d.recipe){recipe(d.recipe);return}
 if(d.close)$('#rc').hidden=true;
 if(d.tab)tab=d.tab;
 else if(d.ck){const a=S[d.ck];S[d.ck]=a.includes(d.v)?a.filter(x=>x!=d.v):[...a,d.v]}
 else if(d.add)S.log.push([d.add,ld()]);
 else if(d.sub){const i=S.log.map(x=>x[0]+x[1]).lastIndexOf(d.sub+ld());if(i>=0)S.log.splice(i,1)}
 else if(d.est){E.desc=$('#estIn').value.trim();if(!E.desc){$('#estIn').focus();return}E.asked=false;E.q='';estimate('');return}
 else if(d.est2){estimate($('#estAns').value.trim());return}
 else if(d.estguess){estimate('A typical single serving.');return}
 else if(d.addcustom){const n=$('#cfName').value.trim();if(!n){$('#cfName').focus();return}const id='c'+Date.now(),m={id,n,c:$('#cfC').value,P:+$('#cfP').value||0,F:+$('#cfF').value||0,Fe:+$('#cfI').value||0,t:0,ing:{}};S.custom.push(m);MM[id]=m;S.log.push([id,ld()]);E.desc='';E.q='';E.asked=false}
 else if(d.del){S.custom=S.custom.filter(m=>m.id!=d.del);S.log=S.log.filter(x=>x[0]!=d.del);delete MM[d.del]}
 else if(d.copy){copyList();return}
 else if(d.exp){$('#bk').value=JSON.stringify(S);$('#bk').select();$('#bkm').textContent='Copy this text and keep it somewhere safe.';return}
 else if(d.imp){try{const o=JSON.parse($('#bk').value);if(!Array.isArray(o.log))throw 0;Object.assign(S,o);S.custom=S.custom||[];S.custom.forEach(m=>MM[m.id]=m)}catch(x){$('#bkm').textContent='That backup text could not be read.';return}}
 else if(d.reset){if(!RST){RST=true;b.textContent='Tap again to erase everything';return}for(const k in MM)if(/^c\d+$/.test(k))delete MM[k];S=JSON.parse(S0);step=0;tab='today'}
 else if(d.step){step+=+d.step;if(step>2){S.done=true;step=0;tab='today'}}
 else if(d.redo){S.done=false;step=0}
 else return;
 draw()});
draw();
