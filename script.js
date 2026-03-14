// ══════════════════════════════════════════════════════════
//  RUDRA PANCHAL — NEXT LEVEL ANIMATION ENGINE 🚀
// ══════════════════════════════════════════════════════════

// ── LOADER ──────────────────────────────────────────────────
(function(){
  var bar = document.getElementById('loaderBar');
  var pct = document.getElementById('loaderPercent');
  var w = 0;
  var iv = setInterval(function(){
    w += Math.random() * 12;
    if(w >= 100){ w = 100; clearInterval(iv); }
    bar.style.width = w + '%';
    if(pct) pct.textContent = Math.floor(w) + '%';
  }, 80);
  window.addEventListener('load', function(){
    bar.style.width = '100%';
    if(pct) pct.textContent = '100%';
    setTimeout(function(){
      document.getElementById('loader').classList.add('done');
    }, 500);
  });
})();

// ── CURSOR ───────────────────────────────────────────────────
var cursorEl  = document.getElementById('cursor');
var dot       = cursorEl ? cursorEl.querySelector('.cursor-dot') : null;
var ring      = document.getElementById('cursorRing');
var curTxt    = document.getElementById('cursorText');
var mx=0,my=0,rx=0,ry=0;

// Trail
var TRAIL_COUNT = 16;
var trails = [];
for(var i=0;i<TRAIL_COUNT;i++){
  var t = document.createElement('div');
  var s = Math.max(2, 8 - i * 0.4);
  t.style.cssText = 'position:fixed;width:'+s+'px;height:'+s+'px;border-radius:50%;pointer-events:none;z-index:99990;transform:translate(-50%,-50%);top:0;left:0;background:rgba(79,142,247,'+(0.55-i*0.03)+');transition:none;';
  document.body.appendChild(t);
  trails.push({el:t, x:0, y:0});
}

document.addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; });

(function loop(){
  if(cursorEl){ cursorEl.style.left=mx+'px'; cursorEl.style.top=my+'px'; }
  rx+=(mx-rx)*0.14; ry+=(my-ry)*0.14;
  if(ring){ ring.style.left=rx+'px'; ring.style.top=ry+'px'; }
  var px=mx,py=my;
  trails.forEach(function(t,i){
    var ox=t.x,oy=t.y;
    t.x+=(px-t.x)*(0.7-i*0.04);
    t.y+=(py-t.y)*(0.7-i*0.04);
    t.el.style.left=t.x+'px'; t.el.style.top=t.y+'px';
    px=ox; py=oy;
  });
  requestAnimationFrame(loop);
})();

// Cursor hover effects
document.querySelectorAll('a,button,.tilt,.magnetic').forEach(function(el){
  var label = el.getAttribute('data-cursor');
  el.addEventListener('mouseenter', function(){
    if(dot){ dot.style.transform='scale(3)'; dot.style.background='#06b6d4'; dot.style.boxShadow='0 0 20px #06b6d4,0 0 40px rgba(6,182,212,.5)'; }
    if(ring){ ring.style.width='60px'; ring.style.height='60px'; ring.style.borderColor='#06b6d4'; ring.style.opacity='0.8'; }
    if(curTxt && label){ curTxt.textContent=label; curTxt.style.opacity='1'; }
  });
  el.addEventListener('mouseleave', function(){
    if(dot){ dot.style.transform='scale(1)'; dot.style.background='#4f8ef7'; dot.style.boxShadow='0 0 14px #4f8ef7,0 0 28px rgba(79,142,247,.4)'; }
    if(ring){ ring.style.width='42px'; ring.style.height='42px'; ring.style.borderColor='#4f8ef7'; ring.style.opacity='0.5'; }
    if(curTxt){ curTxt.style.opacity='0'; }
  });
});

// cursorText follow
document.addEventListener('mousemove', function(e){
  if(curTxt){ curTxt.style.left=(e.clientX+28)+'px'; curTxt.style.top=(e.clientY-10)+'px'; }
});

// ── PARTICLES ────────────────────────────────────────────────
var canvas = document.getElementById('particles');
if(canvas){
  var ctx = canvas.getContext('2d');
  function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  var pts=[], PCOUNT=90;
  for(var i=0;i<PCOUNT;i++){
    pts.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.8+0.3,
      dx: (Math.random()-.5)*.45,
      dy: (Math.random()-.5)*.45,
      a: Math.random()*.5+.1,
      phase: Math.random()*Math.PI*2,
      color: ['79,142,247','6,182,212','139,92,246'][Math.floor(Math.random()*3)]
    });
  }

  var mouseP={x:-999,y:-999};
  document.addEventListener('mousemove',function(e){mouseP.x=e.clientX;mouseP.y=e.clientY;});

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var now = Date.now()*0.001;
    pts.forEach(function(p,pi){
      p.phase+=0.018;
      var g = 0.5+Math.sin(p.phase)*0.5;
      p.x+=p.dx; p.y+=p.dy;
      if(p.x<0||p.x>canvas.width) p.dx*=-1;
      if(p.y<0||p.y>canvas.height) p.dy*=-1;
      var mdx=p.x-mouseP.x, mdy=p.y-mouseP.y, md=Math.sqrt(mdx*mdx+mdy*mdy);
      if(md<120){ p.dx+=mdx/md*0.35; p.dy+=mdy/md*0.35; }
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r*(1+g*.35),0,Math.PI*2);
      ctx.fillStyle='rgba('+p.color+','+(p.a*g)+')';
      ctx.shadowBlur=8*g; ctx.shadowColor='rgba('+p.color+',.6)';
      ctx.fill(); ctx.shadowBlur=0;
      for(var j=pi+1;j<pts.length;j++){
        var p2=pts[j];
        var dx=p.x-p2.x,dy=p.y-p2.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<140){
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p2.x,p2.y);
          ctx.strokeStyle='rgba(79,142,247,'+(0.07*(1-d/140))+')';
          ctx.lineWidth=0.5;ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── TYPED TEXT ───────────────────────────────────────────────
var roles=['Full Stack Developer','React.js Developer','Node.js Developer','IoT Enthusiast','Problem Solver','Code Craftsman'];
var ri=0,ci=0,del=false;
var typedEl=document.getElementById('typed');
function typeIt(){
  if(!typedEl)return;
  var cur=roles[ri];
  if(del){typedEl.textContent=cur.substring(0,--ci);}
  else{typedEl.textContent=cur.substring(0,++ci);}
  var spd=del?50:95;
  if(!del&&ci===cur.length){spd=2200;del=true;}
  else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;spd=400;}
  setTimeout(typeIt,spd);
}
typeIt();

// ── SCROLL REVEAL ────────────────────────────────────────────
function reveal(){
  document.querySelectorAll('.reveal:not(.revealed)').forEach(function(el){
    if(el.getBoundingClientRect().top < window.innerHeight - 55)
      el.classList.add('revealed');
  });
}
window.addEventListener('scroll',reveal,{passive:true});
reveal();

// Stagger children auto-reveal
document.querySelectorAll('.stagger').forEach(function(p){
  Array.from(p.children).forEach(function(c,i){
    c.style.transitionDelay=(i*0.1)+'s';
    if(!c.classList.contains('reveal')) c.classList.add('reveal');
  });
});

// ── 3D TILT ──────────────────────────────────────────────────
document.querySelectorAll('.tilt').forEach(function(card){
  card.addEventListener('mousemove',function(e){
    var r=card.getBoundingClientRect();
    var x=e.clientX-r.left, y=e.clientY-r.top;
    var rx2=((y-r.height/2)/r.height)*-9;
    var ry2=((x-r.width/2)/r.width)*9;
    card.style.transform='perspective(900px) rotateX('+rx2+'deg) rotateY('+ry2+'deg) translateY(-8px) scale(1.025)';
    // Moving spotlight
    var xPct=(x/r.width)*100, yPct=(y/r.height)*100;
    card.style.background='radial-gradient(circle at '+xPct+'% '+yPct+'%, rgba(79,142,247,0.07) 0%, transparent 65%)';
  });
  card.addEventListener('mouseleave',function(){
    card.style.transform=''; card.style.background='';
  });
});

// ── MAGNETIC BUTTONS ─────────────────────────────────────────
document.querySelectorAll('.magnetic').forEach(function(el){
  el.addEventListener('mousemove',function(e){
    var r=el.getBoundingClientRect();
    var x=(e.clientX-r.left-r.width/2)*0.3;
    var y=(e.clientY-r.top-r.height/2)*0.3;
    el.style.transform='translate('+x+'px,'+y+'px)';
  });
  el.addEventListener('mouseleave',function(){
    el.style.transform='';
  });
});

// ── SCROLL PROGRESS ──────────────────────────────────────────
var prog=document.getElementById('scrollProgress');
window.addEventListener('scroll',function(){
  if(!prog)return;
  var s=document.documentElement;
  prog.style.width=((s.scrollTop/(s.scrollHeight-s.clientHeight))*100)+'%';
},{passive:true});

// ── NAV ACTIVE + SHRINK ───────────────────────────────────────
window.addEventListener('scroll',function(){
  var nav=document.getElementById('mainNav');
  if(nav) nav.classList.toggle('scrolled',window.scrollY>50);
  var sy=window.scrollY+130;
  document.querySelectorAll('section[id]').forEach(function(s){
    if(sy>=s.offsetTop&&sy<s.offsetTop+s.offsetHeight){
      document.querySelectorAll('.nav-links a').forEach(function(a){a.classList.remove('active');});
      var act=document.querySelector('.nav-links a[href="#'+s.id+'"]');
      if(act) act.classList.add('active');
    }
  });
},{passive:true});

// ── HAMBURGER ────────────────────────────────────────────────
var hbg=document.getElementById('hamburger');
var navL=document.getElementById('navLinks');
hbg.addEventListener('click',function(){hbg.classList.toggle('open');navL.classList.toggle('open');});
function closeNav(){hbg.classList.remove('open');navL.classList.remove('open');}
document.addEventListener('click',function(e){if(!hbg.contains(e.target)&&!navL.contains(e.target))closeNav();});

// ── COUNT UP ─────────────────────────────────────────────────
var counted=new Set();
new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting&&!counted.has(e.target)){
      counted.add(e.target);
      var el=e.target;
      var val=parseInt(el.getAttribute('data-val')||0);
      var suf=el.getAttribute('data-suffix')||'';
      var start=null;
      (function step(ts){
        if(!start)start=ts;
        var p=Math.min((ts-start)/1800,1);
        var ease=1-Math.pow(1-p,4);
        el.textContent=Math.floor(ease*val)+suf;
        if(p<1)requestAnimationFrame(step);
      })(performance.now());
    }
  });
},{threshold:.5}).observe.bind(new IntersectionObserver(function(en){
  en.forEach(function(e){if(e.isIntersecting&&!counted.has(e.target)){counted.add(e.target);var el=e.target;var val=parseInt(el.getAttribute('data-val')||0);var suf=el.getAttribute('data-suffix')||'';var start=null;(function step(ts){if(!start)start=ts;var p=Math.min((ts-start)/1800,1);var ease=1-Math.pow(1-p,4);el.textContent=Math.floor(ease*val)+suf;if(p<1)requestAnimationFrame(step);})(performance.now());}});
},{threshold:.5}));
// simpler version:
var cObs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(!e.isIntersecting||counted.has(e.target))return;
    counted.add(e.target);
    var el=e.target,val=parseInt(el.getAttribute('data-val')||0),suf=el.getAttribute('data-suffix')||'',st=null;
    (function step(ts){
      if(!st)st=ts;
      var p=Math.min((ts-st)/1800,1),ease=1-Math.pow(1-p,4);
      el.textContent=Math.floor(ease*val)+suf;
      if(p<1)requestAnimationFrame(step);
    })(performance.now());
  });
},{threshold:.5});
document.querySelectorAll('.count-up').forEach(function(el){cObs.observe(el);});

// ── GLITCH NAME ───────────────────────────────────────────────
var heroName=document.querySelector('.hero-name');
if(heroName){
  setInterval(function(){
    heroName.classList.add('glitch');
    setTimeout(function(){heroName.classList.remove('glitch');},280);
  },5000);
}

// ── HERO SECTION PARALLAX ────────────────────────────────────
window.addEventListener('scroll',function(){
  var sc=window.scrollY;
  var hn=document.querySelector('.hero-name');
  var hd=document.querySelector('.hero-desc');
  if(hn)hn.style.transform='translateY('+(sc*0.12)+'px)';
  if(hd)hd.style.transform='translateY('+(sc*0.08)+'px)';
},{passive:true});

// ── SECTION TITLE SPLIT ANIMATE ──────────────────────────────
document.querySelectorAll('.s-title').forEach(function(title){
  var obs=new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting){
      title.style.animation='titleReveal .8s ease forwards';
      obs.disconnect();
    }
  },{threshold:.3});
  obs.observe(title);
});

// ── SKILLS CARD COLOR MATCH ───────────────────────────────────
document.querySelectorAll('.sk-card').forEach(function(card){
  var color=card.getAttribute('data-color');
  if(!color)return;
  var rgb=color.replace('#','');
  var r=parseInt(rgb.substring(0,2),16);
  var g=parseInt(rgb.substring(2,4),16);
  var b=parseInt(rgb.substring(4,6),16);
  card.addEventListener('mouseenter',function(){
    card.querySelector('.sk-glow').style.background='radial-gradient(circle,rgba('+r+','+g+','+b+',.15),transparent 70%)';
    card.style.borderColor='rgba('+r+','+g+','+b+',.3)';
    card.querySelector('.sk-name').style.color=color;
  });
  card.addEventListener('mouseleave',function(){
    card.style.borderColor='';
    card.querySelector('.sk-name').style.color='';
  });
});
