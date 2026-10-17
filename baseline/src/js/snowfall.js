// Canvas-based snowfall overlay (realistic enhancements)
// - Multi-layer flakes for depth (parallax)
// - Gentle wind, sway, rotation + radial gradients for soft edges
// - Fixed canvas scaling and RAF handling
// - Respects prefers-reduced-motion, dismissible, persists dismissal

const RUN_TIME = 120000; // 2 minutes
const FADE_DURATION = 1000;
const LOCALSTORAGE_KEY = 'snowfall.dismissed_v1';

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function createOverlay() {
  const wrapper = document.createElement('div');
  wrapper.id = 'snowfall-overlay';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '0';
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.zIndex = '1040';
  wrapper.style.opacity = '1';
  wrapper.style.transition = `opacity ${FADE_DURATION}ms ease`;

  const canvas = document.createElement('canvas');
  canvas.id = 'snowfall-canvas';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  wrapper.appendChild(canvas);

  const dismiss = document.createElement('button');
  dismiss.id = 'snowfall-dismiss';
  dismiss.className = 'snowfall-dismiss';
  dismiss.type = 'button';
  dismiss.innerHTML = '\u00D7';
  dismiss.setAttribute('aria-label', 'Dismiss festive overlay');
  dismiss.style.pointerEvents = 'auto';
  wrapper.appendChild(dismiss);

  return { wrapper, canvas, dismiss };
}

export function initSnowfall() {
  if (typeof window === 'undefined') return;
  if (prefersReducedMotion()) return;
  if (localStorage.getItem(LOCALSTORAGE_KEY) === '1') return;

  const { wrapper, canvas, dismiss } = createOverlay();
  document.body.appendChild(wrapper);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    width = Math.max(1, Math.floor(window.innerWidth));
    height = Math.max(1, Math.floor(window.innerHeight));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    // Use setTransform to avoid accumulating scales
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  // World state
  const flakes = [];
  let running = true;
  let rafId = null;
  let last = performance.now();

  // Global wind that drifts slowly over time
  const wind = { t: 0, value: 0 };

  function createFlake() {
    // depth z: 0.3 (far) .. 1 (near)
    const z = 0.3 + Math.random() * 0.7;
    const baseSize = (Math.random() * 3 + 1) * (1 + z * 1.6); // larger when nearer
    const x = Math.random() * width;
    const y = -10 - Math.random() * 200 * z;
    // slower, gentler motion: reduced base speed and sway for less distraction
    // Halve the computed speed to make flakes 50% slower overall
    const speed = (8 + Math.random() * 22) * (0.5 + z * 0.5) * 0.5; // px/sec (50% slower)
    const sway = 6 + Math.random() * 25 * z; // amplitude (reduced)
    const swaySpeed = 0.15 + Math.random() * 0.9; // slower sway cycles
    const opacity = Math.min(0.9, 0.25 + Math.random() * 0.7) * (0.6 + 0.4 * z);
    const rot = Math.random() * Math.PI * 2;
    const rotSpeed = (Math.random() - 0.5) * 1.0 * (0.15 + z * 0.2); // gentler rotation
    return { x, y, baseSize, size: baseSize, speed, sway, swaySpeed, opacity, t: Math.random() * 1000, rot, rotSpeed, z };
  }

  const isMobile = width < 768;
  const targetCount = isMobile ? 18 : 48;
  for (let i = 0; i < targetCount; i++) flakes.push(createFlake());

  function drawFlake(f) {
    ctx.save();
    ctx.globalAlpha = f.opacity;
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rot);

    // Soft radial gradient for subtle realistic look
    const r = Math.max(0.5, f.size);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.6, 'rgba(255,255,255,0.85)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Simple soft circular flakes only (no star spokes) to avoid sharp shapes

    ctx.restore();
  }

  function step(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000); // clamp dt to avoid jumps
    last = now;

    // slowly vary wind
    wind.t += dt * 0.05;
    wind.value = Math.sin(wind.t * 0.7) * 20 + Math.sin(wind.t * 0.23) * 8;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.t += dt;
      // horizontal drift includes global wind and local sway
      const swayX = Math.sin(f.t * f.swaySpeed) * f.sway * Math.min(1, dt * 60);
      // reduce horizontal movement influence (wind + sway) to keep flakes gentle
      f.x += (wind.value * 0.01 * f.z + swayX * 0.45);
      f.y += f.speed * dt;
      f.rot += f.rotSpeed * dt;

      // size gently oscillates by depth to simulate perspective shimmer
      f.size = f.baseSize * (0.9 + 0.1 * Math.sin(f.t * 1.2));

      drawFlake(f);

      // recycle flakes off-screen
      if (f.y > height + 30 || f.x < -80 || f.x > width + 80) {
        flakes[i] = createFlake();
      }
    }

    rafId = requestAnimationFrame(step);
  }

  rafId = requestAnimationFrame(step);

  const timeoutId = setTimeout(() => stop(true), RUN_TIME);

  function stop(fade = false) {
    if (!running) return;
    running = false;
    clearTimeout(timeoutId);
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    if (fade) {
      wrapper.style.opacity = '0';
      setTimeout(() => { wrapper.remove(); }, FADE_DURATION + 50);
    } else {
      wrapper.remove();
    }
  }

  dismiss.addEventListener('click', () => {
    localStorage.setItem(LOCALSTORAGE_KEY, '1');
    stop(true);
  });

  if (!window.snowfall) window.snowfall = {};
  window.snowfall.disable = function (persist = false) {
    if (persist) localStorage.setItem(LOCALSTORAGE_KEY, '1');
    stop(true);
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initSnowfall());
} else {
  initSnowfall();
}

export default { initSnowfall };
