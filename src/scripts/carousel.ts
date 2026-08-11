// Transform-based infinite carousel. CL clones each side of REAL real slides.
const CL = 2;
const AUTOPLAY_MS = 5000;

export function initCarousel() {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach(setup);
}

function setup(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('[data-track]');
  const viewport = root.querySelector<HTMLElement>('[data-viewport]');
  const dotsWrap = root.parentElement?.querySelector<HTMLElement>('[data-dots]');
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-next]');
  if (!track) return;

  const slides = Array.from(track.children) as HTMLElement[];
  const REAL = slides.length - CL * 2;
  if (REAL <= 0) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = CL;
  let step = 0;
  let timer: number | undefined;
  let animating = false;

  const measure = () => {
    step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : slides[0].offsetWidth;
  };

  const place = (animate: boolean) => {
    // center the active slide inside the viewport (symmetric peek of neighbours)
    const vw = viewport ? viewport.clientWidth : track.clientWidth;
    const slideW = slides[0].getBoundingClientRect().width;
    const offset = Math.max(0, (vw - slideW) / 2);
    track.style.transition = animate && !reduce ? 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' : 'none';
    track.style.transform = `translate3d(${-step * index + offset}px,0,0)`;
  };

  const realIndex = () => ((index - CL) % REAL + REAL) % REAL;

  const syncDots = () => {
    if (!dotsWrap) return;
    const r = realIndex();
    dotsWrap.querySelectorAll('button').forEach((d, i) => {
      const on = i === r;
      d.classList.toggle('is-active', on);
      d.setAttribute('aria-current', on ? 'true' : 'false');
    });
  };

  const go = (i: number) => {
    if (animating) return;
    animating = true;
    index = i;
    place(true);
    syncDots();
    if (reduce) normalize();
  };

  const normalize = () => {
    if (index >= CL + REAL) index -= REAL;
    else if (index <= CL - 1) index += REAL;
    else { animating = false; return; }
    place(false);
    animating = false;
  };

  track.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'transform') normalize();
  });

  const nextSlide = () => go(index + 1);
  const prevSlide = () => go(index - 1);

  // dots
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

  next?.addEventListener('click', () => { nextSlide(); restart(); });
  prev?.addEventListener('click', () => { prevSlide(); restart(); });

  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); restart(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); restart(); }
  });

  const start = () => {
    if (reduce) return;
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

  let rt: number | undefined;
  window.addEventListener('resize', () => {
    window.clearTimeout(rt);
    rt = window.setTimeout(() => { measure(); place(false); }, 120);
  });

  measure();
  place(false);
  syncDots();
  start();
}
