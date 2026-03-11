// ── CUSTOM CURSOR ──────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

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
    cursor.style.transform    = 'translate(-50%,-50%) scale(2)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform    = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// ── SCROLL REVEAL ───────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(s => {
  s.style.opacity    = '0';
  s.style.transform  = 'translateY(20px)';
  s.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(s);
});
