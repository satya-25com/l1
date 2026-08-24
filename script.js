/* ============================================================
   CINEMATIC LOVE WORLD — Shared Script
   ============================================================
   >>> EDIT THE CONFIG OBJECT BELOW to personalize the site <<<
   Replace: partnerName, password, passwordHint, music path,
   video paths, photo paths, and any personal messages.
   ============================================================ */

const CONFIG = {
  // 👇 Replace with your partner's name
  partnerName: "YOUR PARTNER NAME",

  // 👇 Replace with your secret password (frontend-only)
  password: "YOUR_PASSWORD",

  // 👇 Replace with your password hint
  passwordHint: "Something only we know ❤️",

  // 👇 Replace with your song file
  music: "music/our-song.mp3",

  // 👇 Replace with your 7 video files
  videos: [
    "videos/video1.mp4",
    "videos/video2.mp4",
    "videos/video3.mp4",
    "videos/video4.mp4",
    "videos/video5.mp4",
    "videos/video6.mp4",
    "videos/video7.mp4"
  ],

  // 👇 Replace with your photo files
  photos: [
    "images/photo1.jpg",
    "images/photo2.jpg",
    "images/photo3.jpg",
    "images/photo4.jpg",
    "images/photo5.jpg"
  ],

  // 👇 Optional photo captions / dates / messages for the lightbox
  photoMeta: [
    { date: "", caption: "", message: "" },
    { date: "", caption: "", message: "" },
    { date: "", caption: "", message: "" },
    { date: "", caption: "", message: "" },
    { date: "", caption: "", message: "" }
  ]
};

/* ===== PARTICLE SYSTEM ===== */
const ParticleSystem = (() => {
  let canvas, ctx, particles = [], rafId = null, mouseX = 0, mouseY = 0;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init(opts = {}) {
    canvas = document.getElementById('particles');
    if (!canvas || prefersReduced) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    const count = opts.count || 60;
    for (let i = 0; i < count; i++) particles.push(create());
    animate();
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function create() {
    const types = ['star', 'bokeh', 'heart'];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.1,
      size: Math.random() * 3 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      type: types[Math.floor(Math.random() * types.length)],
      phase: Math.random() * Math.PI * 2
    };
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.02;
      const flicker = 0.7 + Math.sin(p.phase) * 0.3;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.save();
      ctx.globalAlpha = p.opacity * flicker;

      if (p.type === 'heart') {
        drawHeart(p.x, p.y, p.size, 'rgba(240, 182, 194,');
      } else if (p.type === 'bokeh') {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grad.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(245, 236, 217, 1)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    rafId = requestAnimationFrame(animate);
  }

  function drawHeart(x, y, s, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s / 10, s / 10);
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(-5, -3, -10, 0, 0, 8);
    ctx.bezierCurveTo(10, 0, 5, -3, 0, 3);
    ctx.fillStyle = color + ' 0.6)';
    ctx.fill();
    ctx.restore();
  }

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    particles = [];
  }

  return { init, destroy };
})();

/* ===== CURSOR GLOW ===== */
function initCursorGlow() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  function loop() {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(loop);
  }
  loop();
}

/* ===== MOUSE PARALLAX ===== */
function initParallax(selector, strength = 15) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    els.forEach((el, i) => {
      const s = strength * (1 + i * 0.2);
      el.style.transform = `translate(${dx * s}px, ${dy * s}px)`;
    });
  });
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
}

/* ===== MUSIC PLAYER ===== */
const MusicPlayer = (() => {
  let audio = null, btn = null, isPlaying = false;

  function init() {
    audio = new Audio(CONFIG.music);
    audio.loop = true;
    audio.volume = 0.4;
    btn = document.querySelector('.music-btn');
    if (!btn) return;
    btn.addEventListener('click', toggle);
    btn.setAttribute('aria-label', 'Play music');
  }

  function toggle() {
    if (isPlaying) {
      audio.pause();
      btn.classList.remove('playing');
      btn.setAttribute('aria-label', 'Play music');
    } else {
      audio.play().catch(() => {});
      btn.classList.add('playing');
      btn.setAttribute('aria-label', 'Pause music');
    }
    isPlaying = !isPlaying;
  }

  function play() {
    if (!audio) return;
    audio.play().then(() => {
      isPlaying = true;
      if (btn) { btn.classList.add('playing'); btn.setAttribute('aria-label', 'Pause music'); }
    }).catch(() => {});
  }

  return { init, toggle, play };
})();

/* ===== PAGE TRANSITION ===== */
function pageTransition(url) {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));
  setTimeout(() => { window.location.href = url; }, 1200);
}

/* ===== EXPLOSION EFFECT ===== */
function explodeParticles(x, y, count = 40, colors = ['#d4af37', '#f0b6c2', '#f5ecd9']) {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const parts = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
    const speed = Math.random() * 6 + 2;
    parts.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  function loop() {
    parts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life -= 0.015;
    });
    // We draw on top of existing canvas — use a separate overlay
    parts.forEach(p => {
      if (p.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    if (parts.some(p => p.life > 0)) requestAnimationFrame(loop);
  }
  loop();
}

/* ===== PETALS ===== */
function spawnPetals(count = 15) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal-fall';
    petal.setAttribute('aria-hidden', 'true');
    petal.style.cssText = `
      position: fixed;
      left: ${Math.random() * 100}vw;
      top: -20px;
      width: ${Math.random() * 12 + 8}px;
      height: ${Math.random() * 12 + 8}px;
      background: radial-gradient(circle, var(--pink), var(--pink-soft));
      border-radius: 50% 0 50% 50%;
      z-index: 9990;
      pointer-events: none;
      opacity: ${Math.random() * 0.6 + 0.3};
      transform: rotate(${Math.random() * 360}deg);
      animation: petalFall ${Math.random() * 4 + 4}s linear forwards;
    `;
    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), 9000);
  }
}

/* ===== COMMON INIT ===== */
function initCommon() {
  // Inject background layers if not present
  if (!document.querySelector('.cinematic-bg')) {
    const bg = document.createElement('div');
    bg.className = 'cinematic-bg';
    document.body.prepend(bg);
  }
  if (!document.querySelector('.film-grain')) {
    document.createElement('div');
    const fg = document.createElement('div');
    fg.className = 'film-grain';
    document.body.appendChild(fg);
  }
  if (!document.querySelector('.vignette')) {
    const v = document.createElement('div');
    v.className = 'vignette';
    document.body.appendChild(v);
  }
  if (!document.querySelector('.light-leak')) {
    const l = document.createElement('div');
    l.className = 'light-leak';
    document.body.appendChild(l);
  }
  if (!document.getElementById('particles')) {
    const c = document.createElement('canvas');
    c.id = 'particles';
    c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
  }

  ParticleSystem.init({ count: 50 });
  initCursorGlow();
  initScrollReveal();

  // Music button if present
  if (document.querySelector('.music-btn')) {
    MusicPlayer.init();
  }
}

// Petal keyframe
const petalStyle = document.createElement('style');
petalStyle.textContent = `
@keyframes petalFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
}`;
document.head.appendChild(petalStyle);

// Expose globally
window.CONFIG = CONFIG;
window.ParticleSystem = ParticleSystem;
window.MusicPlayer = MusicPlayer;
window.pageTransition = pageTransition;
window.explodeParticles = explodeParticles;
window.spawnPetals = spawnPetals;
window.initParallax = initParallax;
window.initCommon = initCommon;
