/* Redline — event display.
   A cross-section of a particle detector drawn on canvas: the brand's red dot is
   the collision vertex, each service leaves a labelled track, solar dominates the
   calorimeter. Drag rotates the barrel in 3D with inertia. */
(() => {
  const root = document.querySelector("[data-detector]");
  if (!root) return;

  const canvas = root.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const labelEls = [...root.querySelectorAll("[data-track]")];
  const statusEl = root.querySelector("[data-status]");
  const replayBtn = root.querySelector("[data-replay]");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const css = getComputedStyle(document.documentElement);
  const col = (name, fb) => (css.getPropertyValue(name).trim() || fb);
  const C = {
    yellow: col("--solar", "#ffd23a"),
    cyan: col("--signal", "#35d0ff"),
    red: col("--red", "#ff3b2f"),
    ring: col("--ring", "#3a5a7a"),
    steel: col("--steel", "#1a2635"),
    steel2: col("--steel-2", "#223244"),
    text: col("--text", "#e8edf2"),
    steelText: col("--steel-text", "#a7b3c2"),
  };

  /* ---------- geometry ---------- */
  const LAYERS = {
    pipe: 0.035,
    tracker: [0.07, 0.115, 0.16, 0.205, 0.25, 0.295, 0.34, 0.385],
    ecal: [0.43, 0.555, 72],
    hcal: [0.585, 0.775, 40],
    muon: [0.815, 0.975, 12],
  };
  const DEPTH = 0.55; // barrel half-length for the ghost back face
  const TAU = Math.PI * 2;

  // Seeded RNG so every "event" is reproducible.
  const rng = (seed) => () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Helix integration in the transverse plane, slow drift along z.
  function buildTrack({ phi, q, rc, rMax, ct = 0, loss = 0, steps = 90, sMax = 2.4 }) {
    const pts = [];
    let x = 0, y = 0, a = phi, s = 0;
    const ds = sMax / steps;
    for (let i = 0; i <= steps; i++) {
      pts.push([x, y, s * ct]);
      const r = Math.hypot(x, y);
      if (r >= rMax) break;
      const rEff = Math.max(0.02, rc * (1 - loss * (s / sMax)));
      a += (q * ds) / rEff;
      x += Math.cos(a) * ds;
      y += Math.sin(a) * ds;
      s += ds;
    }
    return pts;
  }

  const deg = (d) => (d * Math.PI) / 180;

  // The five services. Order matches data-track in the markup.
  const HERO = [
    { phi: deg(30), q: 1, rc: 9, rMax: 0.78, color: C.yellow, w: 3, dep: 1.0, tower: true }, // solar
    { phi: deg(-38), q: -1, rc: 1.1, rMax: 0.57, color: C.yellow, w: 2, dep: 0.55 },        // eléctricas
    { phi: deg(122), q: 1, rc: 4.2, rMax: 1.12, color: C.cyan, w: 2, dep: 0.25 },            // telecom
    { phi: deg(192), q: -1, rc: 1.8, rMax: 0.78, color: C.steelText, w: 2, dep: 0.6 },       // civil
    { phi: deg(-118), q: 1, rc: 2.8, rMax: 1.06, color: C.cyan, w: 2, dep: 0.2 },            // seguridad
  ].map((t) => ({ ...t, pts: buildTrack({ ...t, ct: 0.04, sMax: 1.4, steps: 70 }) }));

  let bg = [];
  let deposits = [];

  function makeEvent(seed) {
    const r = rng(seed);
    bg = [];
    const n = innerWidth < 700 ? 70 : 120;
    for (let i = 0; i < n; i++) {
      const neutral = r() < 0.12;
      const curl = r();
      const rc = neutral ? 50 : 0.05 + curl * curl * 1.6;
      bg.push({
        pts: buildTrack({
          phi: r() * TAU,
          q: r() < 0.5 ? -1 : 1,
          rc,
          rMax: neutral ? 0.5 : 0.36 + r() * 0.06,
          ct: (r() - 0.5) * 0.5,
          loss: rc < 0.35 ? 0.55 : 0.1,
          sMax: rc < 0.35 ? rc * TAU * (1.2 + r() * 1.4) : 1.2,
          steps: 60,
        }),
        color: neutral ? C.yellow : r() < 0.62 ? C.yellow : C.cyan,
        alpha: 0.28 + r() * 0.42,
        dashed: neutral,
        delay: r() * 0.35,
      });
    }

    // Calorimeter deposits: big ones where service tracks land, noise elsewhere.
    deposits = [];
    const wedgeOf = (phi, n) => ((Math.round((phi / TAU) * n) % n) + n) % n;
    HERO.forEach((t, ti) => {
      const end = t.pts[t.pts.length - 1];
      const phi = Math.atan2(end[1], end[0]);
      const e = wedgeOf(phi, LAYERS.ecal[2]);
      const h = wedgeOf(phi, LAYERS.hcal[2]);
      deposits.push({ layer: "ecal", i: e, e: t.dep, track: ti });
      deposits.push({ layer: "ecal", i: (e + 1) % LAYERS.ecal[2], e: t.dep * 0.55, track: ti });
      deposits.push({ layer: "ecal", i: (e - 1 + LAYERS.ecal[2]) % LAYERS.ecal[2], e: t.dep * 0.4, track: ti });
      deposits.push({ layer: "hcal", i: h, e: t.dep * 0.9, track: ti });
      if (t.tower) {
        deposits.push({ layer: "hcal", i: (h + 1) % LAYERS.hcal[2], e: 0.7, track: ti });
        deposits.push({ layer: "hcal", i: (h - 1 + LAYERS.hcal[2]) % LAYERS.hcal[2], e: 0.55, track: ti });
        deposits.push({ layer: "tower", i: h, e: 1, track: ti });
        deposits.push({ layer: "tower", i: (h + 1) % LAYERS.hcal[2], e: 0.6, track: ti });
      }
    });
    for (let i = 0; i < 18; i++) {
      deposits.push({ layer: r() < 0.6 ? "ecal" : "hcal", i: Math.floor(r() * 72), e: 0.08 + r() * 0.25, track: -1 });
    }
  }

  /* ---------- view ---------- */
  let W = 0, H = 0, DPR = 1, S = 1, CX = 0, CY = 0;
  let yaw = 0.42, pitch = -0.3, vYaw = 0, vPitch = 0;
  let touched = false, dragging = false, lastX = 0, lastY = 0;
  let iso = -1;
  let t0 = performance.now();
  let running = false, visible = true, rafId = 0, armedOff = false;

  function resize() {
    const r = root.getBoundingClientRect();
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const small = W < 620;
    S = Math.min(W, H) * 0.5 * (small ? 0.74 : 0.8);
    CX = W / 2;
    CY = H / 2 + (small ? 4 : 0);
    if (!running) draw(performance.now());
  }

  const cy0 = { c: 1, s: 0 }, cp0 = { c: 1, s: 0 };
  function setRot() {
    cy0.c = Math.cos(yaw); cy0.s = Math.sin(yaw);
    cp0.c = Math.cos(pitch); cp0.s = Math.sin(pitch);
  }
  // Rotate then project with gentle perspective.
  function P(x, y, z) {
    const x1 = x * cy0.c + z * cy0.s;
    const z1 = -x * cy0.s + z * cy0.c;
    const y2 = y * cp0.c - z1 * cp0.s;
    const z2 = y * cp0.s + z1 * cp0.c;
    const f = 3.4 / (3.4 - z2);
    return [CX + x1 * S * f, CY - y2 * S * f];
  }

  /* ---------- easing ---------- */
  const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const expo = (v) => (v >= 1 ? 1 : 1 - Math.pow(2, -10 * v));
  const phase = (t, start, dur) => expo(clamp((t - start) / dur));

  /* ---------- drawing ---------- */
  function ring(r, z, alpha, color = C.ring, width = 1, dash = null, sweep = 1) {
    ctx.beginPath();
    const n = 96;
    const end = Math.ceil(n * sweep);
    for (let i = 0; i <= end; i++) {
      const a = (i / n) * TAU + Math.PI / 2;
      const [px, py] = P(Math.cos(a) * r, Math.sin(a) * r, z);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash || []);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function wedge(r0, r1, a0, a1, z) {
    const n = 4;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      const [px, py] = P(Math.cos(a) * r1, Math.sin(a) * r1, z);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    for (let i = n; i >= 0; i--) {
      const a = a0 + ((a1 - a0) * i) / n;
      const [px, py] = P(Math.cos(a) * r0, Math.sin(a) * r0, z);
      ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function segmentedLayer([r0, r1, n], gapDeg, fill, stroke, alpha, z, grow) {
    const gap = deg(gapDeg);
    const step = TAU / n;
    for (let i = 0; i < n; i++) {
      // segments assemble outward from the top, clockwise
      const order = i / n;
      const a = phase(grow, order * 0.5, 0.5);
      if (a <= 0.001) continue;
      const a0 = i * step - step / 2 + gap / 2;
      const a1 = a0 + step - gap;
      wedge(r0, r0 + (r1 - r0) * a, a0, a1, z);
      ctx.globalAlpha = alpha * a;
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function drawDeposits(grow) {
    if (grow <= 0) return;
    for (const d of deposits) {
      const dim = iso >= 0 && d.track !== iso ? 0.25 : 1;
      let r0, r1, n;
      if (d.layer === "ecal") [r0, r1, n] = LAYERS.ecal;
      else if (d.layer === "hcal") [r0, r1, n] = LAYERS.hcal;
      else { r0 = LAYERS.muon[0] - 0.01; r1 = 1.04; n = LAYERS.hcal[2]; }
      const step = TAU / n;
      const a0 = d.i * step - step / 2 + deg(0.8);
      const a1 = a0 + step - deg(1.6);
      const len = (r1 - r0) * d.e * grow;
      // stacked thin bars, the calorimeter's own texture
      const bars = Math.max(2, Math.round(len / 0.012));
      for (let b = 0; b < bars; b++) {
        const br0 = r0 + (len * b) / bars;
        const br1 = br0 + (len / bars) * 0.62;
        wedge(br0, br1, a0, a1, 0);
        ctx.globalAlpha = (0.55 + 0.45 * (1 - b / bars)) * dim;
        ctx.fillStyle = C.red;
        ctx.fill();
      }
    }
  }

  function strokePath(pts, upto, color, width, alpha, dash) {
    const n = Math.max(1, Math.floor(pts.length * upto));
    if (n < 2) return null;
    ctx.beginPath();
    let last;
    for (let i = 0; i < n; i++) {
      const p = P(pts[i][0], pts[i][1], pts[i][2]);
      i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
      last = p;
    }
    ctx.setLineDash(dash || []);
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.setLineDash([]);
    return last;
  }

  // Label anchor: push the track's end radially outward, keep inside the box.
  const labelState = labelEls.map(() => ({ shown: false, w: 0, h: 0 }));
  function measureLabels() {
    labelEls.forEach((el, i) => { labelState[i].w = el.offsetWidth; labelState[i].h = el.offsetHeight; });
  }

  function placeLabel(i, end, show) {
    const el = labelEls[i];
    if (!el) return null;
    const st = labelState[i];
    const dx = end[0] - CX, dy = end[1] - CY;
    const d = Math.hypot(dx, dy) || 1;
    const push = Math.max(26, S * 1.12 - d);
    let ax = end[0] + (dx / d) * push;
    let ay = end[1] + (dy / d) * push;
    const right = dx >= 0;
    const pad = 6;
    let lx = right ? ax : ax - st.w;
    let ly = ay - st.h / 2;
    const top = 34, bottom = H - 34;
    lx = Math.min(Math.max(lx, pad), W - st.w - pad);
    ly = Math.min(Math.max(ly, top), bottom - st.h);
    ax = right ? lx : lx + st.w;
    ay = Math.min(Math.max(ay, ly + 6), ly + st.h - 6);
    el.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0)`;
    if (show !== st.shown) { el.classList.toggle("is-on", show); st.shown = show; }
    return [ax, ay];
  }

  function draw(now) {
    const t = reduceMotion ? 99 : (now - t0) / 1000;
    setRot();
    ctx.clearRect(0, 0, W, H);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const assemble = phase(t, 0.05, 1.1);

    // back face ghost: gives the barrel its depth when tilted
    for (const r of [LAYERS.ecal[0], LAYERS.hcal[1], LAYERS.muon[1]]) ring(r, -DEPTH, 0.22 * assemble, C.ring);
    // barrel staves
    ctx.globalAlpha = 0.16 * assemble;
    ctx.strokeStyle = C.ring;
    ctx.lineWidth = 1;
    for (let i = 0; i < LAYERS.muon[2]; i++) {
      const a = (i / LAYERS.muon[2]) * TAU + deg(15);
      const r = LAYERS.muon[1];
      const p1 = P(Math.cos(a) * r, Math.sin(a) * r, 0);
      const p2 = P(Math.cos(a) * r, Math.sin(a) * r, -DEPTH);
      ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
    }

    // front face
    segmentedLayer(LAYERS.muon, 3.2, C.steel, "rgba(58,90,122,.65)", 0.9, 0, phase(t, 0.25, 1.2));
    segmentedLayer(LAYERS.hcal, 0.9, "#111a24", "rgba(58,90,122,.45)", 1, 0, phase(t, 0.15, 1.1));
    segmentedLayer(LAYERS.ecal, 0.5, "#0f1720", "rgba(58,90,122,.38)", 1, 0, phase(t, 0.05, 1.0));
    LAYERS.tracker.forEach((r, i) => {
      ring(r, 0, 0.5 * phase(t, 0.02 * i, 0.9), C.ring, 1, i % 2 ? [2, 3] : null, phase(t, 0.02 * i, 0.9));
    });
    ring(LAYERS.pipe, 0, 0.8 * assemble, C.steelText, 1);

    // collision
    const hit = 0.85;
    const tracksT = phase(t, hit, 1.1);
    drawDeposits(phase(t, hit + 0.45, 0.9));

    if (t > hit) {
      for (const b of bg) {
        const p = phase(t, hit + b.delay, 0.9);
        const dim = iso >= 0 ? 0.25 : 1;
        strokePath(b.pts, p, b.color, 1, b.alpha * dim, b.dashed ? [2, 4] : null);
      }
    }

    // service tracks + leaders + labels
    const anchors = [];
    HERO.forEach((tr, i) => {
      const p = t > hit ? phase(t, hit + 0.05 * i, 1.0) : 0;
      const dim = iso >= 0 && iso !== i ? 0.22 : 1;
      if (p > 0) {
        // light bleed: wide soft passes, the solar track blooms
        strokePath(tr.pts, p, tr.color, tr.w + 12, (i === 0 ? 0.09 : 0.05) * dim);
        strokePath(tr.pts, p, tr.color, tr.w + 5, 0.14 * dim);
        if (i === 0) { ctx.shadowColor = tr.color; ctx.shadowBlur = 22 * dim; }
        const end = strokePath(tr.pts, p, i === 0 ? "#fff1b8" : tr.color, tr.w, dim);
        ctx.shadowBlur = 0;
        anchors[i] = end;
      }
    });

    const labelsOn = t > hit + 1.0;
    HERO.forEach((tr, i) => {
      const last = tr.pts[tr.pts.length - 1];
      const end = P(last[0], last[1], last[2]);
      const a = placeLabel(i, end, labelsOn);
      if (labelsOn && a) {
        const dim = iso >= 0 && iso !== i ? 0.25 : 1;
        ctx.globalAlpha = 0.85 * dim * phase(t, hit + 1.0, 0.5);
        ctx.strokeStyle = tr.color;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(end[0], end[1]); ctx.lineTo(a[0], a[1]); ctx.stroke();
        ctx.strokeRect(end[0] - 4, end[1] - 4, 8, 8);
      }
    });

    // flash at the vertex
    if (t > hit - 0.05 && t < hit + 1.2) {
      const f = 1 - clamp((t - hit) / 1.2);
      const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, S * (0.15 + (1 - f) * 0.9));
      g.addColorStop(0, `rgba(255,236,170,${0.85 * f})`);
      g.addColorStop(0.35, `rgba(255,120,60,${0.35 * f})`);
      g.addColorStop(1, "rgba(255,59,47,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // vertex: the brand's red point inside its ring
    const v = P(0, 0, 0);
    const pulse = reduceMotion ? 0 : (Math.sin(now / 520) + 1) / 2;
    ctx.globalAlpha = 1;
    ctx.fillStyle = C.red;
    ctx.beginPath(); ctx.arc(v[0], v[1], Math.max(4, S * 0.022), 0, TAU); ctx.fill();
    ctx.globalAlpha = 0.25 + 0.35 * (1 - pulse);
    ctx.strokeStyle = C.red;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(v[0], v[1], S * (0.04 + pulse * 0.03), 0, TAU); ctx.stroke();

    ctx.globalAlpha = 1;

    if (t > hit + 1.4 && statusEl && !statusEl.classList.contains("is-live")) {
      statusEl.classList.add("is-live");
      statusEl.textContent = "ENERGIZADO";
    }
    if (t > hit + 0.1 && !armedOff) {
      armedOff = true;
      document.documentElement.classList.remove("is-arming");
    }
  }

  /* ---------- loop ---------- */
  function frame(now) {
    rafId = 0;
    const t = (now - t0) / 1000;
    if (!dragging) {
      if (Math.abs(vYaw) > 0.0001 || Math.abs(vPitch) > 0.0001) {
        yaw += vYaw; pitch += vPitch;
        vYaw *= 0.94; vPitch *= 0.94;
      } else if (!touched && !reduceMotion) {
        yaw = 0.42 + Math.sin(t * 0.16) * 0.2;
        pitch = -0.3 + Math.sin(t * 0.11) * 0.07;
      }
    }
    pitch = Math.max(-1.1, Math.min(1.1, pitch));
    draw(now);
    if (visible && !document.hidden && !reduceMotion) rafId = requestAnimationFrame(frame);
    else running = false;
  }
  function start() {
    if (rafId || reduceMotion) { if (reduceMotion) draw(performance.now()); return; }
    running = true;
    rafId = requestAnimationFrame(frame);
  }

  /* ---------- interaction ---------- */
  root.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button")) return;
    dragging = true; touched = true;
    lastX = e.clientX; lastY = e.clientY;
    vYaw = vPitch = 0;
    root.classList.add("is-dragging");
    root.setPointerCapture(e.pointerId);
  });
  root.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    const k = 0.006;
    vYaw = dx * k;
    vPitch = e.pointerType === "touch" ? 0 : -dy * k;
    yaw += vYaw; pitch += vPitch;
    if (reduceMotion) draw(performance.now());
  });
  const end = () => { dragging = false; root.classList.remove("is-dragging"); };
  root.addEventListener("pointerup", end);
  root.addEventListener("pointercancel", end);

  labelEls.forEach((el, i) => {
    const on = () => { iso = i; root.classList.add("is-isolating"); el.classList.add("is-iso"); if (reduceMotion) draw(performance.now()); };
    const off = () => { iso = -1; root.classList.remove("is-isolating"); el.classList.remove("is-iso"); if (reduceMotion) draw(performance.now()); };
    el.addEventListener("pointerenter", on);
    el.addEventListener("pointerleave", off);
    el.addEventListener("focus", on);
    el.addEventListener("blur", off);
  });

  let seed = 742;
  replayBtn?.addEventListener("click", () => {
    seed += 1;
    makeEvent(seed);
    t0 = performance.now();
    if (statusEl) { statusEl.classList.remove("is-live"); statusEl.textContent = "ENERGIZANDO"; }
    labelState.forEach((s, i) => { s.shown = false; labelEls[i].classList.remove("is-on"); });
    start();
  });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  }).observe(root);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) start(); });

  const relayout = () => { resize(); measureLabels(); if (!running) draw(performance.now()); };
  new ResizeObserver(relayout).observe(root);
  document.fonts?.ready.then(relayout);

  makeEvent(seed);
  resize();
  measureLabels();
  t0 = performance.now();
  start();
})();
