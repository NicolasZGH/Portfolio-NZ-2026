/* ============================================================
   Portafolio Nicolás Zorrilla — interactividad (JavaScript puro)
   Sin frameworks ni pasos de compilación. Todo corre en el navegador.
   Secciones:
     1) Tema claro/oscuro
     2) Estado del header al hacer scroll
     3) Menú móvil
     4) Aparición al hacer scroll (reveal)
     5) Botones magnéticos
     6) Tarjetas con inclinación 3D (tilt)
     7) Resplandor que sigue al cursor
     8) Carrusel de logotipos
   ============================================================ */

// Preferencias del usuario: respetar "menos movimiento" y solo activar
// efectos de puntero en dispositivos con mouse.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ---------- 1) Tema claro/oscuro ---------- */
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (_) {
      /* si localStorage falla, ignoramos */
    }
  });
}

/* ---------- 2) Header: fondo de vidrio al hacer scroll ---------- */
function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 50);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- 3) Menú móvil ---------- */
function initNav() {
  const menu = document.getElementById('mobile-menu');
  const open = document.getElementById('menu-open');
  const close = document.getElementById('menu-close');
  if (!menu || !open) return;

  const setOpen = (state) => {
    menu.classList.toggle('hidden', !state);
    menu.setAttribute('aria-hidden', String(!state));
    open.setAttribute('aria-expanded', String(state));
    document.body.style.overflow = state ? 'hidden' : '';
    if (state) close && close.focus();
    else open.focus();
  };

  open.addEventListener('click', () => setOpen(true));
  close && close.addEventListener('click', () => setOpen(false));
  menu.querySelectorAll('.mobile-link').forEach((l) => l.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.classList.contains('hidden')) setOpen(false);
  });
}

/* ---------- 4) Aparición al hacer scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- 5) Botones magnéticos ---------- */
function initMagnetic() {
  if (!finePointer || reduce) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    const strength = 0.28;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

/* ---------- 6) Tarjetas con inclinación 3D ---------- */
function initTilt() {
  if (!finePointer || reduce) return;
  document.querySelectorAll('.tilt').forEach((el) => {
    const max = 6;
    el.style.transformStyle = 'preserve-3d';
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

/* ---------- 7) Resplandor que sigue al cursor ---------- */
function initCursorGlow() {
  if (!finePointer || reduce) return;
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);
  let raf = 0;
  window.addEventListener('pointermove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glow.style.opacity = '0.6';
      raf = 0;
    });
  });
  window.addEventListener('pointerleave', () => (glow.style.opacity = '0'));
}

/* ============================================================
   8) Carrusel de logotipos (bucle infinito, con autoplay)
   El HTML solo tiene las 8 tarjetas reales; este código clona
   2 al principio y 2 al final para que el bucle no tenga saltos.
   ============================================================ */
const CL = 2; // cantidad de clones a cada lado
const AUTOPLAY_MS = 5000;

function initCarousel() {
  document.querySelectorAll('[data-carousel]').forEach(setupCarousel);
}

function setupCarousel(root) {
  const track = root.querySelector('[data-track]');
  const viewport = root.querySelector('[data-viewport]');
  const dotsWrap = root.parentElement && root.parentElement.querySelector('[data-dots]');
  const prev = root.querySelector('[data-prev]');
  const next = root.querySelector('[data-next]');
  if (!track) return;

  // Clonar los bordes para el efecto infinito (solo una vez).
  const realSlides = Array.from(track.children);
  const REAL = realSlides.length;
  if (REAL <= 0) return;

  for (let i = 0; i < CL; i++) {
    const head = realSlides[i].cloneNode(true);
    const tail = realSlides[REAL - 1 - i].cloneNode(true);
    head.setAttribute('aria-hidden', 'true');
    tail.setAttribute('aria-hidden', 'true');
    track.appendChild(head); // clones de las primeras al final
    track.insertBefore(tail, track.firstChild); // clones de las últimas al principio
  }

  const slides = Array.from(track.children);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = CL;
  let step = 0;
  let timer;
  let animating = false;

  const measure = () => {
    step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : slides[0].offsetWidth;
  };

  const place = (animate) => {
    const vw = viewport ? viewport.clientWidth : track.clientWidth;
    const slideW = slides[0].getBoundingClientRect().width;
    const offset = Math.max(0, (vw - slideW) / 2);
    track.style.transition = animate && !reduceMotion ? 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' : 'none';
    track.style.transform = `translate3d(${-step * index + offset}px,0,0)`;
  };

  const realIndex = () => (((index - CL) % REAL) + REAL) % REAL;

  const syncDots = () => {
    if (!dotsWrap) return;
    const r = realIndex();
    dotsWrap.querySelectorAll('button').forEach((d, i) => {
      const on = i === r;
      d.classList.toggle('is-active', on);
      d.setAttribute('aria-current', on ? 'true' : 'false');
    });
  };

  const go = (i) => {
    if (animating) return;
    animating = true;
    index = i;
    place(true);
    syncDots();
    if (reduceMotion) normalize();
  };

  const normalize = () => {
    if (index >= CL + REAL) index -= REAL;
    else if (index <= CL - 1) index += REAL;
    else {
      animating = false;
      return;
    }
    place(false);
    animating = false;
  };

  track.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'transform') normalize();
  });

  const nextSlide = () => go(index + 1);
  const prevSlide = () => go(index - 1);

  // Puntos de navegación
  if (dotsWrap) {
    for (let i = 0; i < REAL; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel-dot';
      b.setAttribute('aria-label', `Ir al logotipo ${i + 1}`);
      b.addEventListener('click', () => {
        go(CL + i);
        restart();
      });
      dotsWrap.appendChild(b);
    }
    dotsWrap.removeAttribute('aria-hidden');
  }

  next && next.addEventListener('click', () => { nextSlide(); restart(); });
  prev && prev.addEventListener('click', () => { prevSlide(); restart(); });

  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); restart(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); restart(); }
  });

  const start = () => {
    if (reduceMotion) return;
    stop();
    timer = window.setInterval(nextSlide, AUTOPLAY_MS);
  };
  const stop = () => { if (timer) window.clearInterval(timer); timer = undefined; };
  const restart = () => { stop(); start(); };

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  let rt;
  window.addEventListener('resize', () => {
    window.clearTimeout(rt);
    rt = window.setTimeout(() => { measure(); place(false); }, 120);
  });

  measure();
  place(false);
  syncDots();
  start();
}

/* ---------- Arranque ---------- */
initTheme();
initHeader();
initNav();
initReveal();
initMagnetic();
initTilt();
initCursorGlow();
initCarousel();
