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

/* ============================================================
   Campo de puntos interactivo del hero (canvas 2D)
   Inspirado en el fondo de junie.jetbrains.com, adaptado a la
   paleta lime del sitio.
     - Grilla tenue de puntos con difusión: parches que se encienden
       solos y fluyen (campo tipo plasma), más auto-blooms esporádicos.
     - Al hacer click nace un "bloom": los puntos cercanos se
       encienden en un anillo que se expande y se desvanece.
       Varios clicks se acumulan.
   Parámetros fáciles de tocar en CONFIG (abajo).
   ============================================================ */
const DOT_CONFIG = {
  pitch: 24,          // separación entre puntos (px)
  dotSize: 3,         // lado del cuadradito (px)
  // Difusión ambiental: parches de puntos que se encienden solos y fluyen
  // (campo tipo "plasma"). Los puntos aparecen por su cuenta, como en Junie.
  noiseScale: 0.012,  // tamaño de los parches (más chico = parches más grandes)
  noiseSpeed: 0.00034,// velocidad a la que fluye la difusión
  diffusionThreshold: 0.62, // solo se encienden los parches por encima de esto
                            // (más alto = menos puntos, grid más "vacío")
  autoRippleMin: 2600,// cada cuánto nace un bloom solo (ms, mín)
  autoRippleMax: 5200,// (ms, máx)
  // Bloom del click (y de los auto-blooms)
  ringSpeed: 0.42,    // px por ms que crece el anillo
  ringSigma: 42,      // grosor del anillo (px)
  rippleLife: 1500,   // duración del bloom (ms)
};

function hexToRgb(hex) {
  const h = hex.trim().replace('#', '');
  const s = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(s, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function initDotField() {
  const canvas = document.getElementById('dot-field');
  const host = document.getElementById('inicio');
  if (!canvas || !host) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const C = DOT_CONFIG;

  // Color de los puntos + opacidades, según el tema. Se recalcula al cambiar tema.
  let color, floorAlpha, peakAlpha, brightAlpha, maxAlpha;
  const readTheme = () => {
    const css = getComputedStyle(document.documentElement).getPropertyValue('--c-lime') || '#d7ff3f';
    color = hexToRgb(css);
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    floorAlpha = 0;                    // grid invisible por defecto
    peakAlpha = light ? 0.22 : 0.28;   // punto encendido por la difusión
    brightAlpha = light ? 0.6 : 0.9;   // brillo máximo del bloom (click/auto)
    maxAlpha = light ? 0.7 : 0.95;     // tope para no saturar
  };
  readTheme();

  let dots = [];   // {x, y}
  let W = 0, H = 0, dpr = 1, cx = 0, cy = 0;

  // Campo de difusión: valor 0..1 por posición y tiempo. Parches que fluyen.
  const plasma = (x, y, t) => {
    const s = C.noiseScale, ts = t * C.noiseSpeed;
    const v =
      Math.sin(x * s + ts) +
      Math.sin(y * s * 1.3 - ts * 0.9) +
      Math.sin((x + y) * s * 0.7 + ts * 1.3) +
      Math.sin(Math.hypot(x - cx, y - cy) * s * 0.9 - ts * 1.1);
    return (v + 4) / 8; // normaliza a 0..1
  };

  const build = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = host.clientWidth;
    H = host.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2;
    cy = H / 2;

    dots = [];
    const p = C.pitch;
    const offX = (W % p) / 2;
    const offY = (H % p) / 2;
    for (let y = offY + p / 2; y < H; y += p) {
      for (let x = offX + p / 2; x < W; x += p) {
        dots.push({ x, y });
      }
    }
  };

  const ripples = []; // {x, y, t0, amp}

  const draw = (now) => {
    ctx.clearRect(0, 0, W, H);
    const half = C.dotSize / 2;
    const twoSig2 = 2 * C.ringSigma * C.ringSigma;

    // limpiar ondas vencidas
    for (let i = ripples.length - 1; i >= 0; i--) {
      if (now - ripples[i].t0 > C.rippleLife) ripples.splice(i, 1);
    }

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      // brillo ambiental por difusión: parches que se encienden y fluyen
      let a = floorAlpha;
      if (!reduceMotion) {
        const f = plasma(d.x, d.y, now);
        // umbral: por debajo el punto queda invisible; por encima aparece
        let t = (f - C.diffusionThreshold) / (1 - C.diffusionThreshold);
        if (t < 0) t = 0; else if (t > 1) t = 1;
        const lit = t * t * (3 - 2 * t); // smoothstep suave
        a = peakAlpha * lit;
      }
      // sumar el aporte de cada onda (click o auto-bloom)
      for (let r = 0; r < ripples.length; r++) {
        const rp = ripples[r];
        const el = now - rp.t0;
        const radius = el * C.ringSpeed;
        const dx = d.x - rp.x, dy = d.y - rp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > radius + 3 * C.ringSigma) continue; // fuera del frente de onda
        const decay = 1 - el / C.rippleLife;
        const ring = Math.exp(-((dist - radius) * (dist - radius)) / twoSig2);
        a += brightAlpha * rp.amp * decay * ring;
      }
      if (a <= 0.012) continue;
      if (a > maxAlpha) a = maxAlpha;
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${a.toFixed(3)})`;
      ctx.fillRect(d.x - half, d.y - half, C.dotSize, C.dotSize);
    }
  };

  // Bucle de animación (se pausa cuando el hero no está en pantalla)
  let raf = 0;
  let running = false;
  let nextAuto = 0;
  const rand = (a, b) => a + Math.random() * (b - a);
  const loop = (now) => {
    // auto-bloom: de vez en cuando nace un bloom solo en un punto al azar
    if (!reduceMotion && now >= nextAuto) {
      ripples.push({ x: rand(0, W), y: rand(0, H), t0: now, amp: 0.55 });
      nextAuto = now + rand(C.autoRippleMin, C.autoRippleMax);
    }
    draw(now);
    // la difusión anima siempre; en reduced-motion solo mientras haya ondas
    if (running && (!reduceMotion || ripples.length)) raf = requestAnimationFrame(loop);
    else raf = 0;
  };
  const kick = () => {
    if (!raf && running) raf = requestAnimationFrame(loop);
  };
  const startLoop = () => {
    running = true;
    if (!nextAuto) nextAuto = performance.now() + rand(C.autoRippleMin, C.autoRippleMax);
    kick();
  };
  const stopLoop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };

  // Click → nueva onda (solo si cae dentro del hero)
  window.addEventListener('pointerdown', (e) => {
    if (reduceMotion) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
    ripples.push({ x, y, t0: performance.now(), amp: 1 });
    kick();
  });

  // Rebuild al cambiar tamaño
  let rt;
  const onResize = () => {
    clearTimeout(rt);
    rt = setTimeout(() => { build(); if (reduceMotion) draw(performance.now()); }, 150);
  };
  window.addEventListener('resize', onResize);

  // Re-leer color al cambiar de tema
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn && themeBtn.addEventListener('click', () => setTimeout(() => { readTheme(); draw(performance.now()); }, 0));

  // Pausar cuando el hero sale de la pantalla
  if ('IntersectionObserver' in window && !reduceMotion) {
    new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? startLoop() : stopLoop()));
    }, { threshold: 0 }).observe(host);
  }

  build();
  if (reduceMotion) {
    draw(performance.now()); // campo estático, sin animación ni clicks
  } else {
    startLoop();
  }
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
initDotField();
