// ── CUSTOM CURSOR (desktop/mouse only) ────────────────────
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
let cursorActive = false;

// Only activate cursor on actual mouse movement (not touch)
document.addEventListener('mousemove', e => {
  if (!cursorActive) {
    cursorActive = true;
    cursor.style.opacity = '1';
    cursorRing.style.opacity = '0.5';
  }
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

// Start hidden, show only when mouse moves
cursor.style.opacity = '0';
cursorRing.style.opacity = '0';

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform     = 'translate(-50%,-50%) scale(2)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform     = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// ── HAMBURGER MENU ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

function closeNav() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}

// Close nav on outside click
document.addEventListener('click', e => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    closeNav();
  }
});

// ── SCROLL REVEAL ───────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('section').forEach(s => {
  s.style.opacity    = '0';
  s.style.transform  = 'translateY(20px)';
  s.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(s);
});

