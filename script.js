// ══════════════════════════════════════════════════════════
//  RUDRA PANCHAL — NEXT LEVEL ANIMATION ENGINE v2 🚀
//  Upgrades: Three.js 3D Hero + Project Card v2 interactions
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

// Cursor hover effects — includes project v2 buttons
function bindCursorHovers(){
  document.querySelectorAll('a,button,.tilt,.magnetic,.pcv2-btn').forEach(function(el){
    if(el._cursorBound) return;
    el._cursorBound = true;
    var label = el.getAttribute('data-cursor');
    el.addEventListener('mouseenter', function(){
      if(dot){ dot.style.transform='scale(3)'; dot.style.background='#06b6d4'; dot.style.boxShadow='0 0 20px #06b6d4,0 0 40px rgba(6,182,212,.5)'; }
      // project cards get a bigger ring expansion
      var isProj = el.closest('.proj-card-v2');
      var ringSize = isProj ? '80px' : '60px';
      if(ring){ ring.style.width=ringSize; ring.style.height=ringSize; ring.style.borderColor='#06b6d4'; ring.style.opacity='0.8'; }
      if(curTxt && label){ curTxt.textContent=label; curTxt.style.opacity='1'; }
    });
    el.addEventListener('mouseleave', function(){
      if(dot){ dot.style.transform='scale(1)'; dot.style.background='#4f8ef7'; dot.style.boxShadow='0 0 14px #4f8ef7,0 0 28px rgba(79,142,247,.4)'; }
      if(ring){ ring.style.width='42px'; ring.style.height='42px'; ring.style.borderColor='#4f8ef7'; ring.style.opacity='0.5'; }
      if(curTxt){ curTxt.style.opacity='0'; }
    });
  });
}
bindCursorHovers();

// cursorText follow
document.addEventListener('mousemove', function(e){
  if(curTxt){ curTxt.style.left=(e.clientX+28)+'px'; curTxt.style.top=(e.clientY-10)+'px'; }
});

// ══════════════════════════════════════════════════════════
//  THREE.JS — 3D INTERACTIVE FLOATING GEOMETRY
//  Replaces the old 2D canvas particle system in #hero
// ══════════════════════════════════════════════════════════
(function initThreeScene(){
  if(typeof THREE === 'undefined') return; // CDN fallback guard

  var canvas = document.getElementById('threeCanvas');
  if(!canvas) return;

  // ── Renderer ──
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true       // transparent background — page bg shows through
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0); // fully transparent
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ── Scene + Camera ──
  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 5);

  // ── Color palette matching CSS tokens ──
  var C = {
    blue:   new THREE.Color(0x4f8ef7),
    cyan:   new THREE.Color(0x06b6d4),
    violet: new THREE.Color(0x8b5cf6),
    dim:    new THREE.Color(0x3a3d55)
  };

  // ── 1. WIREFRAME ICOSAHEDRON (main focal mesh) ──
  var icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
  var icoMat = new THREE.MeshBasicMaterial({
    color: C.blue,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  var icoMesh = new THREE.Mesh(icoGeo, icoMat);
  scene.add(icoMesh);

  // ── 2. INNER SOLID ICOSAHEDRON (subtle glow core) ──
  var innerGeo = new THREE.IcosahedronGeometry(1.0, 1);
  var innerMat = new THREE.MeshBasicMaterial({
    color: C.cyan,
    wireframe: true,
    transparent: true,
    opacity: 0.07
  });
  var innerMesh = new THREE.Mesh(innerGeo, innerMat);
  scene.add(innerMesh);

  // ── 3. OUTER RING (torus) ──
  var torusGeo = new THREE.TorusGeometry(2.2, 0.012, 8, 80);
  var torusMat = new THREE.MeshBasicMaterial({
    color: C.violet,
    transparent: true,
    opacity: 0.25
  });
  var torusMesh = new THREE.Mesh(torusGeo, torusMat);
  torusMesh.rotation.x = Math.PI / 4;
  scene.add(torusMesh);

  // ── 4. FLOATING PARTICLES (point cloud) ──
  var pCount = 200;
  var pPositions = new Float32Array(pCount * 3);
  for(var i=0; i<pCount; i++){
    var theta = Math.random() * Math.PI * 2;
    var phi   = Math.acos(2 * Math.random() - 1);
    var r     = 2 + Math.random() * 3;
    pPositions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pPositions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pPositions[i*3+2] = r * Math.cos(phi);
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  var pMat = new THREE.PointsMaterial({
    color: C.blue,
    size: 0.025,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true
  });
  var pointCloud = new THREE.Points(pGeo, pMat);
  scene.add(pointCloud);

  // ── 5. CONNECTION LINES between nearby particles ──
  // We'll use a few static line segments for a "network" feel
  var linePositions = [];
  for(var i=0; i<pCount; i++){
    for(var j=i+1; j<pCount; j++){
      var ax=pPositions[i*3], ay=pPositions[i*3+1], az=pPositions[i*3+2];
      var bx=pPositions[j*3], by=pPositions[j*3+1], bz=pPositions[j*3+2];
      var dist = Math.sqrt((ax-bx)**2+(ay-by)**2+(az-bz)**2);
      if(dist < 1.2){
        linePositions.push(ax,ay,az,bx,by,bz);
      }
    }
  }
  var lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  var lMat = new THREE.LineBasicMaterial({ color: C.blue, transparent: true, opacity: 0.05 });
  scene.add(new THREE.LineSegments(lGeo, lMat));

  // ── Mouse Inertia ──
  var mouse  = { x:0, y:0 };
  var target = { x:0, y:0 };
  document.addEventListener('mousemove', function(e){
    mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize Handler ──
  window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation Loop ──
  var clock = new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    // Inertial mouse tracking
    target.x += (mouse.x - target.x) * 0.04;
    target.y += (mouse.y - target.y) * 0.04;

    // Main icosahedron: slow auto-rotation + mouse influence
    icoMesh.rotation.x = t * 0.12  + target.y * 0.6;
    icoMesh.rotation.y = t * 0.18  + target.x * 0.6;

    // Inner mesh: counter-rotate for layered effect
    innerMesh.rotation.x = -t * 0.09 + target.y * 0.4;
    innerMesh.rotation.y = -t * 0.15 + target.x * 0.4;

    // Torus: independent axis
    torusMesh.rotation.z = t * 0.07;
    torusMesh.rotation.y = t * 0.04 + target.x * 0.2;

    // Particle cloud: very slow drift
    pointCloud.rotation.y = t * 0.04;
    pointCloud.rotation.x = t * 0.02 + target.y * 0.15;

    // Subtle breathing scale on ico
    var breathe = 1 + Math.sin(t * 0.8) * 0.025;
    icoMesh.scale.setScalar(breathe);

    // Shift camera slightly toward mouse for parallax depth
    camera.position.x += (target.x * 0.4 - camera.position.x) * 0.03;
    camera.position.y += (target.y * 0.3 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  // ── Position the scene toward hero-right side ──
  icoMesh.position.set(1.2, 0, 0);
  innerMesh.position.set(1.2, 0, 0);
  torusMesh.position.set(1.2, 0, 0);
  pointCloud.position.set(0.6, 0, 0);

})(); // end initThreeScene

// ══════════════════════════════════════════════════════════

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
    var xPct=(x/r.width)*100, yPct=(y/r.height)*100;
    // Only apply background spotlight if it's NOT a v2 project card (they have their own preview)
    if(!card.classList.contains('proj-card-v2')){
      card.style.background='radial-gradient(circle at '+xPct+'% '+yPct+'%, rgba(79,142,247,0.07) 0%, transparent 65%)';
    }
  });
  card.addEventListener('mouseleave',function(){
    card.style.transform='';
    if(!card.classList.contains('proj-card-v2')) card.style.background='';
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

// ── PROJECT CARD v2: DYNAMIC ACCENT COLOR on hover ───────────
document.querySelectorAll('.proj-card-v2').forEach(function(card){
  var accent = card.getAttribute('data-accent') || '#4f8ef7';
  var hex = accent.replace('#','');
  var r = parseInt(hex.substring(0,2),16);
  var g = parseInt(hex.substring(2,4),16);
  var b = parseInt(hex.substring(4,6),16);

  var glow = card.querySelector('.pcv2-glow');
  var num  = card.querySelector('.pcv2-num');
  var stacks = card.querySelectorAll('.pcv2-stack span');
  var primBtn = card.querySelector('.pcv2-btn--primary');

  card.addEventListener('mouseenter', function(){
    if(glow) glow.style.background = 'radial-gradient(circle,rgba('+r+','+g+','+b+',.16),transparent 70%)';
    // Tint primary button with accent
    if(primBtn){
      primBtn.style.boxShadow = '0 6px 28px rgba('+r+','+g+','+b+',.45)';
    }
    stacks.forEach(function(s){
      s.style.color = accent;
      s.style.borderColor = 'rgba('+r+','+g+','+b+',.35)';
      s.style.background = 'rgba('+r+','+g+','+b+',.08)';
    });
  });
  card.addEventListener('mouseleave', function(){
    if(primBtn) primBtn.style.boxShadow = '';
    stacks.forEach(function(s){
      s.style.color = '';
      s.style.borderColor = '';
      s.style.background = '';
    });
  });

  // Expand cursor ring specifically on pcv2-btn hover
  card.querySelectorAll('.pcv2-btn').forEach(function(btn){
    btn._cursorBound = false; // reset so bindCursorHovers re-binds
  });
});
// Re-bind cursor hovers to pick up v2 buttons
bindCursorHovers();

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

