/* Animated isolines: a slowly evolving scalar field contoured with marching squares.
   Static SVG masks remain the no-JS and reduced-motion fallback. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const instances = [];

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const hills = [
    // cx, cy, rx, ry, amplitude, ax, ay, sx, sy, phase
    [0.78, 0.36, 0.27, 0.33, 1.00, 0.045, 0.036, 0.150, 0.125, 0.0],
    [0.56, 0.60, 0.30, 0.22, -0.40, 0.036, 0.045, 0.135, 0.155, 1.7],
    [0.88, 0.66, 0.18, 0.20, 0.34, 0.030, 0.038, 0.160, 0.120, 3.2],
    [0.64, 0.20, 0.20, 0.17, 0.28, 0.038, 0.027, 0.145, 0.170, 4.4],
    [0.92, 0.18, 0.15, 0.17, -0.22, 0.027, 0.036, 0.155, 0.160, 5.1],
  ];

  function fieldValue(x, y, t) {
    const xw = x + 0.020 * Math.sin(y * 5.0 + t * 0.22) + 0.011 * Math.sin((x + y) * 8.0 - t * 0.18);
    const yw = y + 0.020 * Math.cos(x * 4.5 - t * 0.19) + 0.011 * Math.cos((x - y) * 7.0 + t * 0.15);
    let value = 0;
    for (const [cx, cy, rx, ry, amp, ax, ay, sx, sy, phase] of hills) {
      const px = cx + ax * Math.sin(t * sx + phase);
      const py = cy + ay * Math.cos(t * sy + phase * 1.2);
      const breathe = 1 + 0.14 * Math.sin(t * 0.18 + phase);
      value += amp * breathe * Math.exp(-(((xw - px) / rx) ** 2 + ((yw - py) / ry) ** 2));
    }
    return value;
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
    const start = performance.now();

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

    function draw(now) {
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      if (now - last < (window.innerWidth < 680 ? 80 : 55)) {
        requestAnimationFrame(draw);
        return;
      }
      last = now;
      const t = (now - start) / 1000;
      for (let j = 0; j < rows; j += 1) {
        for (let i = 0; i < cols; i += 1) {
          field[j * cols + i] = fieldValue(i / (cols - 1), j / (rows - 1), t);
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
      frame = requestAnimationFrame(draw);
    }

    function startLoop() {
      if (running) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(draw);
    }

    function stopLoop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (visible) startLoop();
    });
    ro.observe(el);
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible) startLoop();
      else stopLoop();
    }, { threshold: 0.01 });
    io.observe(el);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopLoop();
      else if (visible) startLoop();
    });
    startLoop();
    instances.push({ el, canvas, ro, io, stopLoop });
  }

  function startAll() {
    document.querySelectorAll('[data-contour-motion]').forEach(init);
  }

  function stopAll() {
    for (const item of instances.splice(0)) {
      item.stopLoop();
      item.ro.disconnect();
      item.io.disconnect();
      item.canvas.remove();
      item.el.classList.remove('has-contour-motion');
      item.el.dataset.contourReady = 'false';
      item.el.style.background = '';
      item.el.style.opacity = '';
      item.el.style.mask = '';
      item.el.style.webkitMask = '';
    }
  }

  if (!reduce.matches) startAll();
  reduce.addEventListener('change', (event) => {
    if (event.matches) stopAll();
    else startAll();
  });
})();
