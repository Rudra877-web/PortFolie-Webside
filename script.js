// ── CURSOR ─────────────────────────────────────────────────
const dot  = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

// Track mouse
document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot follows instantly
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

// Ring follows with lag
function animateRing() {
  ringX += (mouseX - ringX) * 0.13;
  ringY += (mouseY - ringY) * 0.13;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Scale on hover
document.querySelectorAll('a, button').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    dot.style.transform  = 'translate(-50%,-50%) scale(2.5)';
    ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
    ring.style.opacity   = '0.8';
  });
  el.addEventListener('mouseleave', function() {
    dot.style.transform  = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.opacity   = '0.5';
  });
});

// ── HAMBURGER ──────────────────────────────────────────────
var hamburger = document.getElementById('hamburger');
var navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', function() {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

function closeNav() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}

document.addEventListener('click', function(e) {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    closeNav();
  }
});

// ── SCROLL REVEAL ──────────────────────────────────────────
var sections = document.querySelectorAll('section');

var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.07 });

sections.forEach(function(s) {
  s.style.opacity    = '0';
  s.style.transform  = 'translateY(22px)';
  s.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(s);
});
