/* ============================================================
   FAZAL KHAN — Interactive CV · script.js
   ============================================================ */

(function () {
  'use strict';

  /* ─── CUSTOM CURSOR ───────────────────────────────────────── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.body.classList.add('cursor-ready');
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth ring follow
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Cursor grow on hover
  document.querySelectorAll('a, button, .skill-pill, .ai-chip, .job-card, .edu-card, .lang-card, .nav-dot').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '16px';
      cursor.style.height = '16px';
      cursor.style.background = 'var(--teal)';
      cursorRing.style.width  = '52px';
      cursorRing.style.height = '52px';
      cursorRing.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '10px';
      cursor.style.height = '10px';
      cursor.style.background = 'var(--accent)';
      cursorRing.style.width  = '36px';
      cursorRing.style.height = '36px';
      cursorRing.style.opacity = '0.5';
    });
  });

  /* ─── SCROLL PROGRESS BAR ─────────────────────────────────── */
  const progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ─── INTERSECTION OBSERVER — SECTION REVEALS ────────────── */
  const sections = document.querySelectorAll('.section-card');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  sections.forEach(s => revealObs.observe(s));

  /* ─── LANGUAGE DOTS ANIMATION ─────────────────────────────── */
  const langDotGroups = document.querySelectorAll('.lang-dots');
  const langObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const dots = entry.target.querySelectorAll('.lang-dot');
        dots.forEach((dot, i) => {
          setTimeout(() => dot.classList.add('filled'), i * 80);
        });
        langObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  langDotGroups.forEach(g => langObs.observe(g));

  /* ─── NAV DOTS ─────────────────────────────────────────────── */
  const navDots = document.querySelectorAll('.nav-dot');
  const sectionEls = Array.from(document.querySelectorAll('[data-section]'));

  function getActiveSection() {
    const mid = window.innerHeight / 2;
    let active = sectionEls[0];
    sectionEls.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= mid) active = sec;
    });
    return active;
  }

  function updateNavDots() {
    const activeId = getActiveSection()?.dataset.section;
    navDots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.target === activeId);
    });
  }

  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.querySelector(`[data-section="${dot.dataset.target}"]`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  window.addEventListener('scroll', updateNavDots, { passive: true });
  updateNavDots();

  /* ─── SKILL PILL RIPPLE ────────────────────────────────────── */
  document.querySelectorAll('.skill-pill').forEach(pill => {
    pill.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:60px; height:60px;
        background:rgba(255,255,255,0.35);
        left:${e.clientX - rect.left - 30}px;
        top:${e.clientY - rect.top - 30}px;
        transform:scale(0); pointer-events:none;
        animation: rippleAnim 0.5s ease-out forwards;
      `;
      if (!document.getElementById('ripple-style')) {
        const s = document.createElement('style');
        s.id = 'ripple-style';
        s.textContent = '@keyframes rippleAnim { to { transform:scale(3); opacity:0; } }';
        document.head.appendChild(s);
      }
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  /* ─── TYPED SUBTITLE EFFECT ────────────────────────────────── */
  const titles = ['AI Video Creator', 'VFX Artist', 'Digital Production Specialist', 'Generative AI Specialist'];
  const typedEl = document.getElementById('typed-title');
  if (typedEl) {
    let ti = 0, ci = 0, deleting = false;
    function typeStep() {
      const current = titles[ti];
      if (!deleting) {
        typedEl.textContent = current.slice(0, ++ci);
        if (ci === current.length) {
          deleting = true;
          setTimeout(typeStep, 1800);
          return;
        }
      } else {
        typedEl.textContent = current.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          ti = (ti + 1) % titles.length;
        }
      }
      setTimeout(typeStep, deleting ? 40 : 75);
    }
    setTimeout(typeStep, 1000);
  }

  /* ─── STAGGER JOB CARDS ────────────────────────────────────── */
  const jobCards = document.querySelectorAll('.job-card');
  const jobObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        jobObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  jobCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(12px)';
    card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    jobObs.observe(card);
  });

  /* ─── PRINT ────────────────────────────────────────────────── */
  document.getElementById('print-btn')?.addEventListener('click', () => window.print());

})();
