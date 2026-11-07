/* Animated isolines: slowly evolving scalar fields contoured with marching squares.
   Static SVG masks remain the no-JS and reduced-motion fallback. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const instances = [];
  const icons = [];
  let sharedTime = 0;
  const STORAGE_KEY = 'contour-motion';
  let motionOverride = null;
  try {
    const stored = window.localStorage?.getItem(STORAGE_KEY);
    if (stored === 'on' || stored === 'off') motionOverride = stored;
  } catch (_) { /* localStorage may be unavailable */ }
  const motionEnabled = () => motionOverride
    ? motionOverride === 'on'
    : !reduce.matches;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const hills = [
    // cx, cy, rx, ry, amplitude, ax, ay, sx, sy, phase
    [0.78, 0.36, 0.27, 0.33, 1.00, 0.045, 0.036, 0.150, 0.125, 0.0],
    [0.56, 0.60, 0.30, 0.22, -0.40, 0.036, 0.045, 0.135, 0.155, 1.7],
    [0.88, 0.66, 0.18, 0.20, 0.34, 0.030, 0.038, 0.160, 0.120, 3.2],
    [0.64, 0.20, 0.20, 0.17, 0.28, 0.038, 0.027, 0.145, 0.170, 4.4],
    [0.92, 0.18, 0.15, 0.17, -0.22, 0.027, 0.036, 0.155, 0.160, 5.1],
  ];

  function heroField(x, y, t, peaks) {
    const xw = x + 0.020 * Math.sin(y * 5.0 + t * 0.22) + 0.011 * Math.sin((x + y) * 8.0 - t * 0.18);
    const yw = y + 0.020 * Math.cos(x * 4.5 - t * 0.19) + 0.011 * Math.cos((x - y) * 7.0 + t * 0.15);
    let value = 0;
    for (const [cx, cy, rx, ry, amp, ax, ay, sx, sy, phase] of hills) {
      const px = cx + ax * Math.sin(t * sx + phase);
      const py = cy + ay * Math.cos(t * sy + phase * 1.2);
      const breathe = 1 + 0.14 * Math.sin(t * 0.18 + phase);
      value += amp * breathe * Math.exp(-(((xw - px) / rx) ** 2 + ((yw - py) / ry) ** 2));
    }
    for (const peak of peaks) {
      const age = t - peak.born;
      if (age < 0 || age > peak.life) continue;
      const fade = 1 - age / peak.life;
      value += peak.amp * fade * Math.exp(-(((xw - peak.x) / peak.rx) ** 2 + ((yw - peak.y) / peak.ry) ** 2));
    }
    return value;
  }

  function timelineField(x, y, t) {
    // Strata: nearly horizontal bands running across the narrow spine.
    const sway = 0.008 * Math.sin(x * 6 + t * 0.10) + 0.004 * Math.sin(x * 13 - t * 0.07);
    const yy = y + 0.006 * Math.sin(x * 7 + t * 0.08);
    return Math.sin((yy + sway) * 22 + t * 0.20) + 0.28 * Math.sin(yy * 44 - t * 0.13);
  }

  function visionField(x, y, t) {
    // Flow ribbons: contours run down the strip, distinct from the hero's hills.
    const warp = 0.09 * Math.sin(y * 5.0 + t * 0.12) + 0.035 * Math.sin(y * 11.0 - t * 0.08);
    const xx = x + warp;
    return (
      Math.sin(xx * 9 + t * 0.14) +
      0.35 * Math.sin(xx * 17 - y * 3.5 + t * 0.09) +
      0.20 * Math.cos(xx * 5 + y * 7 - t * 0.05)
    );
  }

  function segments(field, cols, rows, level) {
    const out = [];
    const table = {
      1: [[3, 0]], 2: [[0, 1]], 3: [[3, 1]], 4: [[1, 2]],
      5: [[3, 0], [1, 2]], 6: [[0, 2]], 7: [[3, 2]], 8: [[2, 3]],
      9: [[0, 2]], 10: [[0, 1], [2, 3]], 11: [[1, 2]], 12: [[1, 3]],
      13: [[0, 1]], 14: [[3, 0]],
    };
    for (let j = 0; j < rows - 1; j += 1) {
      for (let i = 0; i < cols - 1; i += 1) {
        const a = field[j * cols + i];
        const b = field[j * cols + i + 1];
        const c = field[(j + 1) * cols + i + 1];
        const d = field[(j + 1) * cols + i];
        let idx = 0;
        if (a > level) idx |= 1;
        if (b > level) idx |= 2;
        if (c > level) idx |= 4;
        if (d > level) idx |= 8;
        if (idx === 0 || idx === 15) continue;
        const top = [i + (level - a) / (b - a || 1e-6), j];
        const right = [i + 1, j + (level - b) / (c - b || 1e-6)];
        const bottom = [i + (level - d) / (c - d || 1e-6), j + 1];
        const left = [i, j + (level - a) / (d - a || 1e-6)];
        const pts = [top, right, bottom, left];
        for (const [p, q] of table[idx] || []) out.push([pts[p], pts[q]]);
      }
    }
    return out;
  }

  function init(el) {
    if (el.dataset.contourReady === 'true') return;
    el.dataset.contourReady = 'true';
    const canvas = document.createElement('canvas');
    canvas.className = 'contour-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    el.appendChild(canvas);
    el.classList.add('has-contour-motion');
    el.style.background = 'transparent';
    el.style.opacity = '1';
    el.style.mask = 'none';
    el.style.webkitMask = 'none';

    const ctx = canvas.getContext('2d');
    const mode = el.dataset.contourMode || 'hero';
    const fieldFn = mode === 'timeline' ? timelineField : mode === 'vision' ? visionField : heroField;
    const fade = el.dataset.fade || 'right';
    const baseAlpha = clamp(parseFloat(el.dataset.alpha || '0.55'), 0.05, 1);
    let w = 0, h = 0, cols = 0, rows = 0, field = null;
    canvas.style.maskImage = fade === 'left'
      ? 'linear-gradient(to right, transparent 0%, #000 38%)'
      : fade === 'vertical'
        ? 'linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)'
        : 'linear-gradient(to right, transparent 38%, rgba(0,0,0,.8) 60%, #000 90%)';
    canvas.style.webkitMaskImage = canvas.style.maskImage;
    let visible = true, running = false, frame = 0, last = 0;
    let simTime = 0, previous = 0, gustUntil = 0, lastSpawn = -10, lastGust = -Infinity;
    const GUST_MS = 43200;
    const GUST_SPEED = 2.2;
    const GUST_COOLDOWN_MS = 432000;
    const peaks = [];
    let detach = null;

    function resize() {
      const rect = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = clamp(Math.floor(w / 8), 28, 220);
      rows = clamp(Math.floor(h / 8), 28, 220);
      field = new Float32Array(cols * rows);
    }

    function renderFrame(t) {
      for (let j = 0; j < rows; j += 1) {
        for (let i = 0; i < cols; i += 1) {
          field[j * cols + i] = fieldFn(i / (cols - 1), j / (rows - 1), t, peaks);
        }
      }
      let min = Infinity;
      let max = -Infinity;
      for (let j = 0; j < rows; j += 1) {
        for (let i = 0; i < cols; i += 1) {
          const v = field[j * cols + i];
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
      for (let i = peaks.length - 1; i >= 0; i -= 1) {
        if (t - peaks[i].born > peaks[i].life) peaks.splice(i, 1);
      }
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = baseAlpha * (window.innerWidth < 680 ? 0.55 : 1);
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--rule').trim() || '#cfc7b6';
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      const lo = min + (max - min) * 0.07;
      const hi = max - (max - min) * 0.05;
      const levelShift = 0.10 * (max - min) * Math.sin(t * 0.24);
      for (let k = 0; k < 12; k += 1) {
        const level = lo + ((hi - lo) * k) / 11 + levelShift;
        const segs = segments(field, cols, rows, level);
        if (!segs.length) continue;
        ctx.beginPath();
        for (const [a, b] of segs) {
          ctx.moveTo((a[0] / (cols - 1)) * w, (a[1] / (rows - 1)) * h);
          ctx.lineTo((b[0] / (cols - 1)) * w, (b[1] / (rows - 1)) * h);
        }
        ctx.stroke();
      }
    }

    function draw(now) {
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      if (now - last < (window.innerWidth < 680 ? 50 : 33)) {
        requestAnimationFrame(draw);
        return;
      }
      last = now;
      const dt = previous ? Math.min(0.1, (now - previous) / 1000) : 0;
      previous = now;
      simTime += dt * (now < gustUntil ? GUST_SPEED : 1);
      sharedTime = simTime;
      renderFrame(simTime);
      if (!motionEnabled()) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(draw);
    }

    function startLoop() {
      if (running) return;
      running = true;
      last = 0;
      previous = 0;
      frame = requestAnimationFrame(draw);
    }

    function stopLoop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    if (mode === 'hero') {
      const host = el.parentElement;
      const onPointerDown = (event) => {
        const target = event.target;
        if (target && target.closest && target.closest('a')) return;
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        if (x < 0 || x > 1 || y < 0 || y > 1) return;
        const stamp = performance.now();
        if (stamp - lastSpawn < 1200) return;
        lastSpawn = stamp;
        const sign = Math.random() < 0.35 ? -1 : 1;
        peaks.push({
          x,
          y,
          amp: sign * (1.0 + Math.random() * 0.6),
          rx: 0.15 + Math.random() * 0.07,
          ry: 0.15 + Math.random() * 0.09,
          born: simTime,
          life: 2.2 + Math.random() * 0.8,
        });
        if (peaks.length > 5) peaks.shift();
        // A rare gust: 43.2 s of faster field time, at most once per 7.2 min.
        if (stamp - lastGust > GUST_COOLDOWN_MS && Math.random() < 0.45) {
          gustUntil = stamp + GUST_MS;
          lastGust = stamp;
        }
      };
      if (host) {
        host.addEventListener('pointerdown', onPointerDown, { passive: true });
        detach = () => host.removeEventListener('pointerdown', onPointerDown);
      }
    }

    resize();
    if (!motionEnabled()) renderFrame(0.6);
    const ro = new ResizeObserver(() => {
      resize();
      if (!motionEnabled()) renderFrame(0.6);
      if (visible && motionEnabled()) startLoop();
    });
    ro.observe(el);
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible && motionEnabled()) startLoop();
      else stopLoop();
    }, { threshold: 0.01 });
    io.observe(el);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopLoop();
      else if (visible && motionEnabled()) startLoop();
    });
    if (motionEnabled()) startLoop();
    instances.push({ el, canvas, ro, io, stopLoop, startLoop, renderFrame, detach });
  }

  function startAll() {
    document.querySelectorAll('[data-contour-motion]').forEach(init);
  }

  function updateMotionToggle() {
    document.querySelectorAll('[data-motion-toggle]').forEach((button) => {
      button.setAttribute('aria-pressed', String(motionEnabled()));
      button.title = motionEnabled() ? 'Isoline animation on' : 'Isoline animation off';
    });
  }

  function syncMotion() {
    for (const item of instances) {
      if (motionEnabled()) {
        item.startLoop();
      } else {
        item.stopLoop();
        item.renderFrame(0.6);
      }
    }
    for (const icon of icons) icon.sync();
    updateMotionToggle();
  }

  function setMotionSetting(next) {
    motionOverride = next;
    try {
      window.localStorage?.setItem(STORAGE_KEY, next);
    } catch (_) { /* localStorage may be unavailable */ }
    syncMotion();
  }

  function setupIcon(button) {
    if (button.querySelector('.motion-icon')) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'motion-icon';
    canvas.setAttribute('aria-hidden', 'true');
    button.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const source = document.querySelector('[data-contour-motion]');
    const mode = source?.dataset.contourMode || 'hero';
    const fieldFn = mode === 'timeline' ? timelineField : mode === 'vision' ? visionField : heroField;
    const STATIC_T = 2.4;
    const view = { cx: 0.82, cy: 0.24, span: 0.42 };

    let w = 44;
    let h = 44;
    let hover = false;
    let running = false;
    let frame = 0;
    let last = 0;
    let iconTime = STATIC_T;

    function resize() {
      const rect = button.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(rect.width + 10));
      h = Math.max(1, Math.round(rect.height + 10));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function paint(t) {
      const fcols = 26;
      const frows = 26;
      const field = new Float32Array(fcols * frows);
      const x0 = view.cx - view.span / 2;
      const y0 = view.cy - view.span / 2;
      let min = Infinity;
      let max = -Infinity;
      for (let j = 0; j < frows; j += 1) {
        for (let i = 0; i < fcols; i += 1) {
          const v = fieldFn(x0 + (i / (fcols - 1)) * view.span, y0 + (j / (frows - 1)) * view.span, t, []);
          field[j * fcols + i] = v;
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#544e44';
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      const lo = min + (max - min) * 0.1;
      const hi = max - (max - min) * 0.1;
      const cx = w / 2;
      const cy = h / 2;
      const edge = w * 0.27;
      const smoke = [];
      for (let k = 0; k < 5; k += 1) {
        const level = lo + ((hi - lo) * k) / 4;
        const segs = segments(field, fcols, frows, level);
        if (!segs.length) continue;
        ctx.beginPath();
        for (const [a, b] of segs) {
          const x1 = (a[0] / (fcols - 1)) * w;
          const y1 = (a[1] / (frows - 1)) * h;
          const x2 = (b[0] / (fcols - 1)) * w;
          const y2 = (b[1] / (frows - 1)) * h;
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          if (Math.hypot((x1 + x2) / 2 - cx, (y1 + y2) / 2 - cy) > edge) {
            smoke.push([x1, y1, x2, y2]);
          }
        }
        ctx.stroke();
      }
      if (smoke.length) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.filter = 'blur(1.2px)';
        ctx.beginPath();
        for (let i = 0; i < smoke.length; i += 1) {
          const [x1, y1, x2, y2] = smoke[i];
          const jx = Math.sin(i * 12.9898 + t * 2.2) * 1.4;
          const jy = Math.cos(i * 7.233 + t * 1.7) * 1.4;
          ctx.moveTo(x1 + jx, y1 + jy);
          ctx.lineTo(x2 + jy, y2 + jx);
        }
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = 0.16;
        ctx.filter = 'blur(2.4px)';
        ctx.beginPath();
        for (let i = 0; i < smoke.length; i += 1) {
          const [x1, y1, x2, y2] = smoke[i];
          const jx = Math.sin(i * 5.71 + t * 1.3) * 2.8;
          const jy = Math.cos(i * 3.17 + t * 1.1) * 2.8;
          ctx.moveTo(x1 + jx, y1 + jy);
          ctx.lineTo(x2 + jy, y2 + jx);
        }
        ctx.stroke();
        ctx.restore();
      }
    }

    function loop(now) {
      if (!hover || motionEnabled()) {
        running = false;
        paint(STATIC_T);
        return;
      }
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      iconTime += dt * 1.5;
      paint(iconTime);
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (motionEnabled()) {
        paint(STATIC_T);
        return;
      }
      if (running) return;
      running = true;
      last = 0;
      iconTime = STATIC_T;
      frame = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
      paint(STATIC_T);
    }

    function sync() {
      if (motionEnabled()) {
        stop();
      } else if (hover) {
        start();
      } else {
        stop();
      }
    }

    button.addEventListener('pointerenter', () => { hover = true; start(); });
    button.addEventListener('pointerleave', () => { hover = false; stop(); });
    button.addEventListener('focus', () => { hover = true; start(); });
    button.addEventListener('blur', () => { hover = false; stop(); });

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) paint(STATIC_T);
    });
    ro.observe(button);

    resize();
    paint(STATIC_T);
    icons.push({ sync, start, stop });
  }

  startAll();
  document.querySelectorAll('[data-motion-toggle]').forEach(setupIcon);
  document.querySelectorAll('[data-motion-toggle]').forEach((button) => {
    button.addEventListener('click', () => setMotionSetting(motionEnabled() ? 'off' : 'on'));
  });
  updateMotionToggle();
  reduce.addEventListener('change', syncMotion);
})();
