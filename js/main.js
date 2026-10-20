/* Redline — page behaviour: nav, solar estimator, services, process track,
   coverage plot and the WhatsApp contact form. */
(() => {
  const WA = "573186505684";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nf = (n, d = 0) => new Intl.NumberFormat("es-CO", { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);
  const SVGNS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent?.appendChild(n);
    return n;
  };

  /* ---------------- nav ---------------- */
  const nav = $("[data-nav]");
  const toggle = $("[data-menu-toggle]");
  const waFloat = $("[data-wa-float]");
  const contact = $("#contacto");
  let contactInView = false, calcInView = false;

  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("is-solid", y > 24);
    waFloat?.classList.toggle("is-shown", y >= innerHeight * 0.85 && !contactInView && !calcInView);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
    toggle.querySelector(".sr-only").textContent = open ? "Cerrar menú" : "Abrir menú";
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle?.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("#menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); } });

  // current section in nav
  const navLinks = $$('.nav__links a[href^="#"]');
  const sectionIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      navLinks.forEach((a) => a.toggleAttribute("aria-current", a.getAttribute("href") === `#${e.target.id}`));
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["solar", "servicios", "proceso", "cobertura", "contacto"].forEach((id) => { const s = document.getElementById(id); s && sectionIO.observe(s); });

  if (contact) {
    new IntersectionObserver(([e]) => { contactInView = e.isIntersecting; onScroll(); }, { threshold: 0.15 }).observe(contact);
  }
  const calcEl = $("#estimador");
  if (calcEl) {
    new IntersectionObserver(([e]) => { calcInView = e.isIntersecting; onScroll(); }, { threshold: 0.05 }).observe(calcEl);
  }

  /* ---------------- solar estimator ---------------- */
  const HSP = 4.5, PR = 0.8, PANEL_W = 580, CO2 = 0.126;
  const kwh = $("#kwh"), range = $("#kwh-range"), tarifa = $("#tarifa"), cob = $("#cobertura");
  const out = (k) => $(`[data-out="${k}"]`);
  const err = $("[data-calc-error]");
  const cta = $("[data-calc-cta]");
  const wedgesG = $("[data-dial-wedges]");

  function dialPath(r0, r1, a0, a1) {
    // a in degrees, clockwise from 12 h at the top
    const p = (r, a) => {
      const t = (a * Math.PI) / 180;
      return `${(r * Math.sin(t)).toFixed(2)} ${(-r * Math.cos(t)).toFixed(2)}`;
    };
    return `M${p(r0, a0)} L${p(r1, a0)} A${r1} ${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0} ${r0} 0 0 0 ${p(r0, a0)} Z`;
  }

  function drawDial(kwp) {
    if (!wedgesG) return;
    wedgesG.replaceChildren();
    const R0 = 108;
    const L = 22 + 52 * Math.min(1, Math.sqrt(kwp / 320));
    for (let h = 0; h < 24; h++) {
      const a0 = ((h - 12) / 24) * 360 + 1.4;
      const a1 = a0 + 15 - 2.8;
      const x = (h + 0.5 - 6) / 12;
      const g = x > 0 && x < 1 ? Math.pow(Math.sin(Math.PI * x), 1.25) : 0;
      if (g < 0.02) {
        el("path", { d: dialPath(R0, R0 + 5, a0, a1), class: "w-night" }, wedgesG);
        continue;
      }
      const len = g * L;
      const bars = Math.max(1, Math.round(len / 6.5));
      for (let b = 0; b < bars; b++) {
        const r0 = R0 + (len * b) / bars;
        const r1 = r0 + (len / bars) * 0.66;
        el("path", { d: dialPath(r0, r1, a0, a1), class: "w-gen", opacity: (0.55 + 0.45 * (1 - b / bars)).toFixed(2) }, wedgesG);
      }
    }
  }

  function calc() {
    const c = Number(kwh.value);
    const valid = Number.isFinite(c) && c >= 100 && c <= 500000;
    err.hidden = valid;
    kwh.setAttribute("aria-invalid", String(!valid));
    if (!valid) return;
    const t = Math.max(0, Number(tarifa.value) || 0);
    const cov = Number(cob.value);
    const kwp = (c * cov) / (HSP * 30 * PR);
    const panels = Math.ceil((kwp * 1000) / PANEL_W);
    const area = Math.round(panels * 2.6 * 1.15);
    const gen = kwp * HSP * 30 * PR;
    const save = gen * t;
    const co2 = (gen * 12 * CO2) / 1000;

    out("kwp").textContent = nf(kwp, kwp < 100 ? 1 : 0);
    out("panels").textContent = nf(panels);
    out("area").textContent = `${nf(area)} m²`;
    out("gen").textContent = `${nf(gen)} kWh/mes`;
    out("save").textContent = `$ ${nf(save)}`;
    out("co2").textContent = `${nf(co2, 1)} t`;
    drawDial(kwp);

    const msg = `Hola Redline, quiero cotizar un sistema de energía solar.\n• Consumo: ${nf(c)} kWh/mes\n• Cobertura deseada: ${Math.round(cov * 100)} %\n• Sistema estimado en la web: ${nf(kwp, 1)} kWp (${nf(panels)} módulos)`;
    cta.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  }

  const syncFill = () => {
    const p = ((range.value - range.min) / (range.max - range.min)) * 100;
    range.style.setProperty("--p", `${p}%`);
  };
  if (kwh && range) {
    range.addEventListener("input", () => { kwh.value = range.value; syncFill(); calc(); });
    kwh.addEventListener("input", () => {
      const v = Number(kwh.value);
      if (Number.isFinite(v)) range.value = Math.min(Math.max(v, range.min), range.max);
      syncFill(); calc();
    });
    tarifa.addEventListener("input", calc);
    cob.addEventListener("change", calc);
    syncFill();
    calc();
  }

  /* ---------------- services: ring follows the row in focus ---------------- */
  const services = $("[data-services]");
  if (services) {
    const ticks = $("[data-layer-ticks]");
    for (let a = 0; a < 360; a += 15) {
      const t = (a * Math.PI) / 180;
      el("line", { x1: (30 * Math.sin(t)).toFixed(1), y1: (-30 * Math.cos(t)).toFixed(1), x2: (178 * Math.sin(t)).toFixed(1), y2: (-178 * Math.cos(t)).toFixed(1) }, ticks);
    }
    const rows = $$("[data-layer-key]", services);
    const activate = (row) => {
      services.dataset.active = row.dataset.layerKey;
      rows.forEach((r) => r.classList.toggle("is-active", r === row));
    };
    rows.forEach((row) => {
      row.addEventListener("pointerenter", () => activate(row));
      row.addEventListener("focusin", () => activate(row));
    });
    const rowIO = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) activate(e.target);
    }, { rootMargin: "-40% 0px -55% 0px" });
    rows.forEach((r) => rowIO.observe(r));
    activate(rows[0]);
  }

  /* ---------------- process track: one track through five detector layers ---------------- */
  const proc = $("[data-process]");
  const live = $("[data-track-path]");
  const glow = $("[data-track-glow]");
  const layersG = $("[data-track-layers]");
  const steps = $$(".step");
  if (proc && live && layersG) {
    const V = [40, 260];
    const RADII = [150, 385, 620, 855, 1090];
    // gently curving track (constant curvature), integrated in viewBox units
    const pts = [];
    let x = V[0], y = V[1], a = (-11 * Math.PI) / 180;
    const ds = 2, k = 1 / 2600;
    while (x < 1240 && pts.length < 2000) { pts.push([x, y]); a += k * ds; x += Math.cos(a) * ds; y += Math.sin(a) * ds; }
    const d = pts.filter((_, i) => i % 3 === 0).map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    live.setAttribute("d", d);
    glow.setAttribute("d", d);
    glow.setAttribute("pathLength", "1");

    const layers = RADII.map((r) => {
      const c = 2 * Math.PI * r, seg = c / Math.round(r / 11);
      el("circle", { cx: V[0], cy: V[1], r: r - 17, class: "track__layer-edge" }, layersG);
      el("circle", { cx: V[0], cy: V[1], r: r + 17, class: "track__layer-edge" }, layersG);
      return el("circle", { cx: V[0], cy: V[1], r, class: "track__layer", "stroke-dasharray": `${(seg * 0.86).toFixed(2)} ${(seg * 0.14).toFixed(2)}` }, layersG);
    });

    const hits = RADII.map((r) => {
      const i = pts.findIndex((p) => Math.hypot(p[0] - V[0], p[1] - V[1]) >= r);
      return { p: pts[i], at: i / (pts.length - 1) };
    });
    steps.forEach((s, i) => {
      const h = hits[i];
      if (!h || !h.p) return;
      s.style.setProperty("--x", `${((h.p[0] / 1200) * 100).toFixed(2)}%`);
      s.style.setProperty("--y", `${((h.p[1] / 520) * 100).toFixed(2)}%`);
    });

    live.style.strokeDasharray = glow.style.strokeDasharray = "1";
    const update = () => {
      const r = proc.getBoundingClientRect();
      const p = reduceMotion ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / (r.height * 0.7)));
      live.style.strokeDashoffset = glow.style.strokeDashoffset = String(1 - p);
      hits.forEach((h, i) => {
        const on = p >= h.at;
        steps[i]?.classList.toggle("is-lit", on);
        layers[i].classList.toggle("is-hit", on);
      });
    };
    let ticking = false;
    addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }, { passive: true });
    addEventListener("resize", update);
    update();
  }

  /* ---------------- coverage: polar plot from real coordinates ---------------- */
  const polar = $("[data-polar]");
  if (polar) {
    const BASE = [7.065, -73.854];
    const CITIES = [
      ["Bucaramanga", 7.119, -73.123, "start"],
      ["Puerto Berrío", 6.491, -74.403, "end"],
      ["Aguachica", 8.31, -73.616, "start"],
      ["Cúcuta", 7.894, -72.508, "start"],
      ["Tunja", 5.535, -73.367, "start"],
      ["Bogotá", 4.711, -74.072, "end"],
      ["Medellín", 6.244, -75.581, "end"],
      ["Valledupar", 10.463, -73.253, "start"],
      ["Cartagena", 10.391, -75.479, "end"],
      ["Barranquilla", 10.964, -74.796, "start"],
    ];
    const K = 230 / 500; // 500 km → 230 units
    const toXY = (lat, lon) => {
      const dx = (lon - BASE[1]) * Math.cos((BASE[0] * Math.PI) / 180) * 111.32;
      const dy = (lat - BASE[0]) * 110.57;
      return { x: dx * K, y: -dy * K, km: Math.hypot(dx, dy) };
    };
    el("line", { x1: -245, y1: 0, x2: 245, y2: 0, class: "axis" }, polar);
    el("line", { x1: 0, y1: -245, x2: 0, y2: 245, class: "axis" }, polar);
    for (let km = 100; km <= 500; km += 100) {
      el("circle", { r: km * K, class: `r${km % 200 ? " r--dash" : ""}` }, polar);
      if (km % 200 === 0) continue;
      const t = el("text", { x: -km * K + 4, y: -6, class: "rlbl" }, polar);
      t.textContent = km === 500 ? "500 km" : String(km);
    }
    [["N", 0, -252], ["S", 0, 260], ["E", 254, 4], ["O", -254, 4]].forEach(([s, x, y]) => {
      const t = el("text", { x, y, class: "rlbl", "text-anchor": "middle" }, polar);
      t.textContent = s;
    });
    for (const [name, lat, lon, side] of CITIES) {
      const p = toXY(lat, lon);
      el("line", { x1: 0, y1: 0, x2: p.x.toFixed(1), y2: p.y.toFixed(1), class: "ray" }, polar);
      const g = el("g", { class: "city", transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})` }, polar);
      el("circle", { r: 4.5 }, g);
      const dx = side === "start" ? 10 : -10;
      const tn = el("text", { x: dx, y: -1, "text-anchor": side }, g);
      tn.textContent = name;
      const tk = el("text", { x: dx, y: 12, "text-anchor": side, class: "km" }, g);
      tk.textContent = `${nf(Math.round(p.km / 5) * 5)} km`;
    }
    el("circle", { r: 15, class: "base-ring" }, polar);
    el("circle", { r: 7.5, class: "base-dot" }, polar);
    const bl = el("text", { x: -22, y: -22, class: "base-lbl", "text-anchor": "end" }, polar);
    bl.textContent = "BARRANCABERMEJA";
  }

  /* ---------------- contact form → WhatsApp ---------------- */
  const form = $("[data-contact]");
  if (form) {
    const nombre = $("#f-nombre");
    const fieldOf = (input) => input.closest(".field");
    nombre.addEventListener("input", () => {
      if (nombre.value.trim()) { fieldOf(nombre).classList.remove("has-error"); nombre.removeAttribute("aria-invalid"); }
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const name = String(d.get("nombre") || "").trim();
      if (!name) {
        fieldOf(nombre).classList.add("has-error");
        nombre.setAttribute("aria-invalid", "true");
        nombre.setAttribute("aria-describedby", "err-nombre");
        nombre.focus();
        return;
      }
      const lines = [
        `Hola Redline, soy ${name}${d.get("empresa") ? ` de ${String(d.get("empresa")).trim()}` : ""}.`,
        `Me interesa un proyecto de ${d.get("tipo")}${d.get("ciudad") ? ` en ${String(d.get("ciudad")).trim()}` : ""}.`,
      ];
      const msg = String(d.get("mensaje") || "").trim();
      if (msg) lines.push(msg);
      const url = `https://wa.me/${WA}?text=${encodeURIComponent(lines.join("\n"))}`;
      const w = window.open(url, "_blank", "noopener");
      if (!w) location.href = url;
    });
  }

  $$("[data-year]").forEach((n) => { n.textContent = String(new Date().getFullYear()); });
})();
