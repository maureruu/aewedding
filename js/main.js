const CONFIG = {
  lugar: "Iglesia Bautista Independiente Maranatha",
  direccion: "42CG+V3X, Santiago, Provincia de Veraguas",
  mapaUrl: "https://www.google.com/maps/search/?api=1&query=8.122236,-80.977337",
  portada: "fotos/foto_novios.jpeg",
  vestimenta: "fotos/vestimenta.jpeg",
  galeria: [
    "fotos/galeria_1.jpeg","fotos/galeria_2.jpeg","fotos/galeria_3.jpeg","fotos/galeria_4.jpeg",
    "fotos/galeria_5.jpeg","fotos/galeria_6.jpeg","fotos/galeria_7.jpeg"
  ],
  decoracion: {
    rama: "decoracion/rama_esquina.webp",
    flor: "decoracion/flor_espiritu_santo.webp",
    cordon: "decoracion/cordon.webp"
  },
  sobre: "decoracion/sobre",
  sello: "decoracion/sello",
  selloPos: [50, 50],
  musica: "",
  scriptUrl: "https://script.google.com/macros/s/AKfycbztD_cnONkPvg9fcLf7LGf8c2gq_a0RNce3XYFn-OQNIkB_N2fANKMXpp8fOT3PNg-Uvw/exec",
  fecha: "2026-12-04T13:00:00-05:00",
  inicio: "20261204T130000", fin: "20261204T180000"
};

const $=s=>document.querySelector(s);
let LANG=(()=>{try{const g=localStorage.getItem('idioma');if(g==='es'||g==='en')return g}catch(e){}return ((navigator.languages&&navigator.languages[0])||navigator.language||'es').toLowerCase().startsWith('en')?'en':'es'})();
const L=(k,v={})=>TXT[LANG][k].replace(/\{(\w+)\}/g,(_,x)=>v[x]);
const ph=t=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dbe5f1"/><stop offset="1" stop-color="#a9b9d0"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><text x="200" y="262" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#17335c" fill-opacity=".6">${t}</text></svg>`);
const toast=t=>{const e=$('#toast');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),2800)};

$('#lugar').textContent=CONFIG.lugar; $('#dir').textContent=CONFIG.direccion;
if(CONFIG.mapaUrl){const a=$('#mapa');a.href=CONFIG.mapaUrl;a.hidden=false}
const cv=$('#cover'),nom=p=>p.split('/').pop();
cv.onerror=()=>{cv.onerror=null;cv.src=ph(nom(CONFIG.portada))};cv.src=CONFIG.portada;

const fotos=CONFIG.galeria.slice(0,9);
let cur=0;
$('#grid').innerHTML=fotos.map((s,i)=>`<button type="button" data-i="${i}" aria-label="${L('ampliar',{n:i+1})}"><img src="${s}" alt="${L('fotoAlt',{n:i+1})}" loading="lazy" onerror="this.onerror=null;this.src=ph('${nom(s)}')"></button>`).join('');
const lb=$('#lb'),show=i=>{cur=(i+fotos.length)%fotos.length;$('#lbI').src=document.querySelectorAll('#grid img')[cur].src;$('#lbI').alt=L('fotoDe',{n:cur+1,t:fotos.length})};
$('#grid').onclick=e=>{const b=e.target.closest('button');if(b){show(+b.dataset.i);lb.showModal()}};
$('#lbP').onclick=()=>show(cur-1);$('#lbN').onclick=()=>show(cur+1);$('#lbX').onclick=()=>lb.close();
lb.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
let tx=0;lb.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});
lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)show(cur+(d<0?1:-1))});

$('#cal').onclick=()=>{
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT','UID:boda-ester-aureliano@invitacion',
   'DTSTAMP:20260101T000000Z','DTSTART;TZID=America/Panama:'+CONFIG.inicio,'DTEND;TZID=America/Panama:'+CONFIG.fin,
   'SUMMARY:'+L('icsTitulo'),'LOCATION:'+CONFIG.lugar+' '+CONFIG.direccion,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='boda-aureliano-ester.ics';a.click();
};

const fm=$('#fabM');let audio=null;
fm.onclick=()=>{
  if(!CONFIG.musica){toast(L('sinMusica'));return}
  if(!audio){audio=new Audio(CONFIG.musica);audio.loop=true}
  const play=audio.paused;
  play?audio.play().catch(()=>toast(L('errAudio'))):audio.pause();
  fm.setAttribute('aria-pressed',play);fm.setAttribute('aria-label',play?L('pausa'):L('play'));
};

const dlg=$('#dlg'),f=$('#f');
document.querySelectorAll('[data-rsvp]').forEach(b=>b.onclick=()=>{$('#formView').hidden=false;$('#thanks').hidden=true;dlg.showModal();$('#n').focus()});
$('#dx').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
f.onsubmit=async e=>{
  e.preventDefault();const d=Object.fromEntries(new FormData(f)),err=$('#err');
  if(!d.nombre.trim()){err.textContent=L('errNombre');$('#n').focus();return}
  if(!(d.personas>=1&&d.personas<=10)){err.textContent=L('errPersonas');$('#p').focus();return}
  if(!d.asistencia){err.textContent=L('errAsistir');return}
  err.textContent='';const btn=$('#send');btn.disabled=true;btn.textContent=L('enviando');
  try{
    if(CONFIG.scriptUrl){await fetch(CONFIG.scriptUrl,{method:'POST',mode:'no-cors',body:new URLSearchParams(d)})}
    else{
      const l=JSON.parse(localStorage.getItem('rsvp')||'[]');l.push({fecha:new Date().toISOString(),...d});localStorage.setItem('rsvp',JSON.stringify(l));
      console.warn('CONFIG.scriptUrl está vacío: la respuesta solo se guardó en este navegador.');
    }
    $('#formView').hidden=true;$('#thanks').hidden=false;f.reset();
  }catch(x){err.textContent=L('errEnvio')}
  btn.disabled=false;btn.textContent=L('enviar');
};

function pintarCal(){
  const D=TXT[LANG],[y,m,dia]=CONFIG.fecha.slice(0,10).split('-').map(Number),mes=D.meses[m-1];
  const ini=new Date(Date.UTC(y,m-1,1)).getUTCDay(),total=new Date(Date.UTC(y,m,0)).getUTCDate();
  let h='<h3>'+L('mesAnio',{m:mes,y})+'</h3><div class="g" role="grid">'+D.dsem.map(d=>'<span class="h" aria-hidden="true">'+d+'</span>').join('');
  for(let i=0;i<ini;i++)h+='<span></span>';
  for(let d=1;d<=total;d++)h+=d===dia?'<span class="d on" aria-label="'+L('diaBoda',{d,m:mes})+'">'+d+'</span>':'<span class="d">'+d+'</span>';
  $('#cal-m').innerHTML=h+'</div>';
}

(()=>{
  const meta=new Date(CONFIG.fecha).getTime(),box=$('#count');let t;
  const tick=()=>{
    const ms=meta-Date.now();
    if(ms<=0){box.innerHTML='<p style="font:italic 1.6rem var(--serif)">'+L('hoy')+'</p>';clearInterval(t);return}
    const mins=Math.floor(ms/60000);
    $('#cd').textContent=Math.floor(mins/1440);$('#ch').textContent=Math.floor(mins%1440/60);$('#cm').textContent=mins%60;
  };
  t=setInterval(tick,15000);tick();
})();

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
const fr=$('#fabR'),fin=$('#confirmar');
const vis=()=>{const r=fin.getBoundingClientRect();fr.classList.toggle('on',scrollY>innerHeight*.7&&!(r.top<innerHeight&&r.bottom>0))};
addEventListener('scroll',vis,{passive:true});vis();

(()=>{
  const p=$('#petals');
  if(!p||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  for(let i=0;i<12;i++){
    const e=document.createElement('i'),s=8+Math.random()*8;
    e.style.cssText='left:'+Math.random()*100+'%;width:'+s+'px;height:'+s*1.3+'px;animation-duration:'+(9+Math.random()*8)+'s;animation-delay:-'+Math.random()*12+'s;--dx:'+(Math.random()*80-40)+'px';
    p.appendChild(e);
  }
  new IntersectionObserver(en=>p.classList.toggle('off',!en[0].isIntersecting)).observe(p.parentElement);
})();

(()=>{
  const get={rama:()=>[...document.querySelectorAll('.rama')],flor:()=>[...document.querySelectorAll('use[href="#flor"]')].map(u=>u.parentNode),cordon:()=>[...document.querySelectorAll('.cordon')]};
  Object.entries(CONFIG.decoracion).forEach(([k,src])=>{
    const im=new Image();
    im.onload=()=>{get[k]().forEach(e=>{e.style.backgroundImage='url("'+im.src+'")';e.classList.add('img-'+k)})};
    im.src=src;
  });
})();

(()=>{
  const h=$('#nombres');let n=0;
  [...h.childNodes].forEach(nd=>{
    if(nd.nodeType!==3||!nd.textContent.trim())return;
    const f=document.createDocumentFragment();
    [...nd.textContent.trim()].forEach(ch=>{const i=document.createElement('i');i.className='l';i.textContent=ch;i.style.setProperty('--i',n++);f.appendChild(i)});
    nd.replaceWith(f);
  });
})();

document.querySelectorAll('.cards,.pair,.gifts,.grid,.count').forEach(c=>[...c.children].forEach((e,i)=>{e.classList.add('st');e.style.setProperty('--k',i)}));

(()=>{
  const probar=(base,cb,i=0)=>{const ex=['webp','png','jpeg','jpg'];if(i>=ex.length)return;const im=new Image();im.onload=()=>cb(im);im.onerror=()=>probar(base,cb,i+1);im.src=base+'.'+ex[i]};
  const b=document.body,o=document.createElement('div'),hero=[...document.querySelectorAll('.hero .rv')];
  b.classList.add('cerrado');o.id='sobre';
  o.innerHTML='<div class="env"><div class="paper">Aureliano & Ester</div><div class="flapw"><div class="flap"></div></div><button type="button" class="seal" aria-label="Abrir invitación">A&E</button></div><p data-t="tocaSello"></p>';
  b.appendChild(o);
  const s=o.querySelector('.seal'),env=o.querySelector('.env');
  probar(CONFIG.sobre,im=>{env.classList.add('con-img');im.className='env-img';im.alt='';env.prepend(im);s.style.left=CONFIG.selloPos[0]+'%';s.style.top=CONFIG.selloPos[1]+'%'});
  probar(CONFIG.sello,im=>{s.style.backgroundImage='url("'+im.src+'")';s.classList.add('img-sello')});
  s.onclick=()=>{
    o.classList.add('open');
    setTimeout(()=>{
      hero.forEach(e=>e.classList.remove('in'));b.classList.remove('cerrado');o.classList.add('gone');
      requestAnimationFrame(()=>requestAnimationFrame(()=>hero.forEach(e=>e.classList.add('in'))));
    },1000);
    setTimeout(()=>o.remove(),2100);
  };
})();

(()=>{const im=$('#vestImg');im.onerror=()=>{im.onerror=null;im.src=ph(nom(CONFIG.vestimenta))};im.src=CONFIG.vestimenta})();

const ATTR=[['#nombres','aria-label','nombresAria'],['#cover','alt','altCover'],['#vestImg','alt','altVest'],['#dx','aria-label','cerrar'],['#lbX','aria-label','cerrar'],['#lbP','aria-label','anterior'],['#lbN','aria-label','siguiente'],['#lb','aria-label','visor'],['#count','aria-label','cuentaAria'],['#cal-m','aria-label','calAria'],['.mapa iframe','title','mapaTitulo'],['.seal','aria-label','abrir'],['.lang','aria-label','idiomaAria']];
function partir(h){
  const t=h.textContent.trim();h.setAttribute('aria-label',t);
  h.innerHTML=t.split(/\s+/).map((w,i)=>'<span class="w" aria-hidden="true" style="--i:'+i+'">'+w+'</span>').join(' ');
}
function traducir(l){
  LANG=l;const D=TXT[l];
  document.documentElement.lang=l;
  document.querySelectorAll('[data-t]').forEach(e=>{e.innerHTML=D[e.dataset.t]});
  ATTR.forEach(([s,a,k])=>document.querySelectorAll(s).forEach(e=>e.setAttribute(a,D[k])));
  document.title=D.titulo;
  [['meta[name=description]',D.desc],['meta[property="og:title"]',D.ogt],['meta[property="og:description"]',D.ogd]].forEach(([s,v])=>$(s).setAttribute('content',v));
  document.querySelectorAll('.wrap h2').forEach(partir);
  pintarCal();
  document.querySelectorAll('#grid button').forEach((b,i)=>{b.setAttribute('aria-label',L('ampliar',{n:i+1}));b.querySelector('img').alt=L('fotoAlt',{n:i+1})});
  fm.setAttribute('aria-label',fm.getAttribute('aria-pressed')==='true'?D.pausa:D.play);
  document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===l));
}
document.querySelectorAll('.lang button').forEach(b=>b.onclick=()=>{traducir(b.dataset.lang);try{localStorage.setItem('idioma',b.dataset.lang)}catch(e){}});
traducir(LANG);
