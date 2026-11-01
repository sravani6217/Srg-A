
"use strict";

/* ==========================================
   SAGITTARIUS A* — BLACK HOLE LABORATORY
   Complete simulation engine
========================================== */

const $ = id => document.getElementById(id);

const canvasIds = [
  "blackholeCanvas",
  "structureCanvas",
  "gridCanvas",
  "lightCanvas",
  "objectCanvas"
];

const contexts = {};

let angle = 0;
let paused = false;
let animationFrame = null;

/* ==========================================
   1. CANVAS INITIALIZATION
========================================== */

function setupCanvas(id) {
  const canvas = $(id);
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();

  if (rect.width <= 0 || rect.height <= 0) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const width = Math.round(rect.width * dpr);
  const height = Math.round(rect.height * dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext("2d");

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  contexts[id] = {
    canvas,
    ctx,
    width: rect.width,
    height: rect.height
  };
}

function resizeAll() {
  canvasIds.forEach(setupCanvas);

  drawStructure();
  drawGrid();
  drawLight();
  drawObject();
}

/* ==========================================
   2. COMMON DRAWING FUNCTIONS
========================================== */

function clearCanvas(id) {
  const o = contexts[id];

  if (!o) return null;

  const {ctx, width, height} = o;

  ctx.clearRect(0, 0, width, height);

  return {ctx, width, height};
}

function drawBackground(ctx, width, height) {
  ctx.fillStyle = "#070b18";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 100; i++) {
    const x = (i * 137.5) % width;
    const y = (i * 83.7) % height;

    ctx.fillStyle = "rgba(190,210,255,0.45)";
    ctx.fillRect(x, y, 1.3, 1.3);
  }
}

function drawCircle(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLabel(ctx, text, x, y, color = "#ffffff") {
  ctx.fillStyle = color;
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
}

/* ==========================================
   3. MAIN BLACK HOLE ANIMATION
========================================== */

function drawMain() {
  const o = clearCanvas("blackholeCanvas");

  if (!o) {
    animationFrame = requestAnimationFrame(drawMain);
    return;
  }

  const {ctx, width:w, height:h} = o;

  drawBackground(ctx, w, h);

  const cx = w / 2;
  const cy = h / 2;

  const radius = Math.min(w, h) * 0.19;

  // Gravitational glow
  const glow = ctx.createRadialGradient(
    cx, cy, radius,
    cx, cy, radius * 2.8
  );

  glow.addColorStop(0, "rgba(255,100,30,0.20)");
  glow.addColorStop(1, "rgba(255,100,30,0)");

  drawCircle(ctx, cx, cy, radius * 2.8, glow);

  // Accretion disk
  ctx.save();

  ctx.translate(cx, cy);
  ctx.rotate(-0.22);

  for (let i = 0; i < 5; i++) {
    ctx.beginPath();

    ctx.ellipse(
      0, 0,
      radius * (1.45 + i * 0.12),
      radius * (0.42 + i * 0.04),
      0, 0, Math.PI * 2
    );

    ctx.strokeStyle = `rgba(255,${150-i*20},65,${0.8-i*0.12})`;
    ctx.lineWidth = 7 - i;
    ctx.stroke();
  }

  // Rotating bright particles
  for (let i = 0; i < 90; i++) {
    const a = angle + i * Math.PI * 2 / 90;

    const x = Math.cos(a) * radius * 1.55;
    const y = Math.sin(a) * radius * 0.45;

    drawCircle(
      ctx, x, y, 2,
      i % 2 ? "#ffc17b" : "#ff6c37"
    );
  }

  ctx.restore();

  // Photon ring illustration
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.12, 0, Math.PI * 2);

  ctx.strokeStyle = "#ffd3a0";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Event horizon
  drawCircle(ctx, cx, cy, radius, "#000000");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "#a7a7b5";
  ctx.lineWidth = 1;
  ctx.stroke();

  drawLabel(ctx, "EVENT HORIZON", cx, cy + radius + 24);
  drawLabel(ctx, "ACCRETION FLOW", cx, cy - radius * 1.8);
  drawLabel(ctx, "Illustrative visualization — not to scale", cx, h - 15, "#aab7ce");

  if (!paused) {
    angle += 0.012;
  }

  animationFrame = requestAnimationFrame(drawMain);
}

/* Animation controls */

const pauseBtn = $("pauseBtn");
const resetBtn = $("resetBtn");

if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    paused = !paused;

    pauseBtn.textContent = paused
      ? "Resume animation"
      : "Pause animation";
  });
}

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    angle = 0;
    paused = false;

    if (pauseBtn) {
      pauseBtn.textContent = "Pause animation";
    }
  });
}

/* ==========================================
   4. BLACK HOLE STRUCTURE DIAGRAM
========================================== */

function drawStructure() {
  const o = clearCanvas("structureCanvas");

  if (!o) return;

  const {ctx, width:w, height:h} = o;

  drawBackground(ctx, w, h);

  const cx = w / 2;
  const cy = h / 2;

  const radius = Math.min(w, h) * 0.17;

  // Accretion disk
  ctx.save();

  ctx.translate(cx, cy);
  ctx.scale(1, 0.48);

  for (let i = 0; i < 5; i++) {
    ctx.beginPath();

    ctx.arc(
      0, 0,
      radius * (1.5 + i * 0.15),
      0, Math.PI * 2
    );

    ctx.strokeStyle = i % 2 ? "#ffbd76" : "#ff7840";
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  ctx.restore();

  // Photon sphere
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);

  ctx.strokeStyle = "#58d7ff";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Event horizon
  drawCircle(ctx, cx, cy, radius, "#000");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);

  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  drawLabel(ctx, "CENTRAL REGION", cx, cy + 4);
  drawLabel(ctx, "EVENT HORIZON", cx + radius + 65, cy - 10);
  drawLabel(ctx, "PHOTON SPHERE", cx + radius * 1.7, cy - 45);
  drawLabel(ctx, "ACCRETION DISK", cx - radius * 1.8, cy - radius * 1.4);
  drawLabel(ctx, "Conceptual illustration", cx, h - 15, "#aab7ce");
}

/* ==========================================
   5. SPACETIME CURVATURE GRID
========================================== */

function drawGrid() {
  const o = clearCanvas("gridCanvas");

  if (!o) return;

  const {ctx, width:w, height:h} = o;

  drawBackground(ctx, w, h);

  const cx = w / 2;
  const cy = h / 2 + 15;

  const spacingX = Math.max(17, w / 36);
  const spacingY = Math.max(16, h / 19);

  const radius = Math.min(w, h) * 0.22;

  // Horizontal curved grid lines
  for (let row = -8; row <= 8; row++) {
    ctx.beginPath();

    for (let col = -16; col <= 16; col++) {
      const x = cx + col * spacingX;
      const y = cy + row * spacingY;

      const d = Math.sqrt(
        (x - cx) ** 2 +
        (y - cy) ** 2
      );

      const dip =
        radius * radius /
        (d + radius * 0.5);

      const yy = y + dip * 0.65;

      if (col === -16) {
        ctx.moveTo(x, yy);
      } else {
        ctx.lineTo(x, yy);
      }
    }

    ctx.strokeStyle = "rgba(75,174,255,0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Vertical curved grid lines
  for (let col = -16; col <= 16; col++) {
    ctx.beginPath();

    for (let row = -8; row <= 8; row++) {
      const x = cx + col * spacingX;
      const y = cy + row * spacingY;

      const d = Math.sqrt(
        (x - cx) ** 2 +
        (y - cy) ** 2
      );

      const dip =
        radius * radius /
        (d + radius * 0.5);

      const yy = y + dip * 0.65;

      if (row === -8) {
        ctx.moveTo(x, yy);
      } else {
        ctx.lineTo(x, yy);
      }
    }

    ctx.strokeStyle = "rgba(75,174,255,0.6)";
    ctx.stroke();
  }

  drawCircle(ctx, cx, cy, 12, "#000");

  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);

  ctx.strokeStyle = "#ff9b55";
  ctx.lineWidth = 2;
  ctx.stroke();

  drawLabel(ctx, "MASS CURVES SPACETIME", cx, 25);
  drawLabel(ctx, "Conceptual grid — not a literal fabric", cx, h - 15, "#aab7ce");
}

/* ==========================================
   6. GRAVITATIONAL LENSING / LIGHT PATH
========================================== */

function drawLight() {
  const o = clearCanvas("lightCanvas");

  if (!o) return;

  const {ctx, width:w, height:h} = o;

  drawBackground(ctx, w, h);

  const cx = w / 2;
  const cy = h / 2;

  const radius = Math.min(w, h) * 0.15;

  const slider = $("lightDistance");
  const distance = slider ? Number(slider.value) : 5;

  const value = $("lightDistanceValue");

  if (value) {
    value.textContent = distance + " Rs";
  }

  // Photon region
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);

  ctx.strokeStyle = "#ff9b55";
  ctx.setLineDash([4, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Horizon
  drawCircle(ctx, cx, cy, radius, "#000");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "#fff";
  ctx.stroke();

  // Incoming ray
  const impact = Math.max(
    radius * 1.12,
    Math.min(h * 0.4, distance * radius * 0.4)
  );

  const startY = cy - impact;
  const endY = cy - impact;

  // Escape path, conceptual
  ctx.beginPath();
  ctx.moveTo(0, startY);

  ctx.bezierCurveTo(
    w * 0.25,
    startY + radius * 1.1,
    w * 0.72,
    endY + radius * 1.1,
    w,
    endY
  );

  ctx.strokeStyle = "#65d8ff";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Captured path illustration at closest settings
  if (distance < 3.5) {
    ctx.beginPath();

    ctx.moveTo(0, startY);

    ctx.bezierCurveTo(
      w * 0.25,
      cy - radius * 0.7,
      cx - radius * 0.7,
      cy,
      cx,
      cy
    );

    ctx.strokeStyle = "#ff7952";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  drawLabel(ctx, "INCOMING LIGHT", 75, 25);
  drawLabel(ctx, "ESCAPING RAY — CONCEPTUAL", w - 115, h - 20, "#65d8ff");
}

/* ==========================================
   7. OBJECT APPROACH EXPERIMENT
========================================== */

function drawObject() {
  const o = clearCanvas("objectCanvas");

  if (!o) return;

  const {ctx, width:w, height:h} = o;

  drawBackground(ctx, w, h);

  const cx = w / 2;
  const cy = h / 2;

  const radius = Math.min(w, h) * 0.15;

  const distance = Number($("objectDistance")?.value ?? 6);
  const speed = Number($("objectSpeed")?.value ?? 40);
  const type = $("objectType")?.value ?? "star";

  $("objectDistanceValue").textContent =
    distance.toFixed(1) + " Rs";

  $("objectSpeedValue").textContent = speed + "%";

  const orbitRadius =
    radius * Math.max(1.3, Math.min(4, distance / 2.4));

  // Reference orbit
  ctx.beginPath();
  ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2);

  ctx.strokeStyle = "rgba(90,160,255,0.5)";
  ctx.setLineDash([4, 6]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Photon sphere
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);

  ctx.strokeStyle = "#ffb17a";
  ctx.setLineDash([4, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Black hole
  drawCircle(ctx, cx, cy, radius, "#000");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "#fff";
  ctx.stroke();

  // Object marker
  const x = cx + orbitRadius * 0.85;
  const y = cy - orbitRadius * 0.52;

  const colors = {
    star: "#ffe5a2",
    planet: "#64c6ff",
    spacecraft: "#c7d7e8",
    gas: "#ff785c"
  };

  drawCircle(
    ctx,
    x,
    y,
    type === "star" ? 8 : 6,
    colors[type]
  );

  // Object trajectory indicator
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 24, y - 17);

  ctx.strokeStyle = colors[type];
  ctx.lineWidth = 2;
  ctx.stroke();

  // Result classification
  let message;

  if (distance <= 1.5) {
    message =
      "Extremely close to the event horizon. If the object's trajectory crosses the horizon, it cannot return.";
  } else if (distance < 3) {
    message =
      "Strong-field region. Light bending and relativistic effects are important. The object's fate depends on its trajectory.";
  } else if (distance < 6) {
    message =
      "Strong gravitational environment. Orbital motion and close encounters are possible depending on velocity and angular momentum.";
  } else {
    message =
      "Farther from the black hole. Gravity still controls the object's motion, but relativistic effects are generally weaker.";
  }

  if (speed === 0 && distance > 1.5) {
    message +=
      " Zero tangential speed does not produce a circular orbit.";
  }

  $("objectResult").textContent = message;

  drawLabel(ctx, type.toUpperCase() + " APPROACH EXPERIMENT", cx, h - 15);
}

/* ==========================================
   8. TIME DILATION CALCULATOR
========================================== */

function updateTime() {
  const slider = $("timeDistance");

  if (!slider) return;

  const r = Number(slider.value);

  // Schwarzschild stationary clock rate
  const rate = Math.sqrt(1 - 1 / r);

  $("timeDistanceValue").textContent =
    r.toFixed(2) + " Rs";

  $("clockRate").textContent =
    rate.toFixed(4);

  $("clockExplanation").textContent =
    "A stationary clock at this radius runs at about " +
    (rate * 100).toFixed(2) +
    "% of the rate of a clock far away.";
}

/* ==========================================
   9. EVENT LISTENERS
========================================== */

function connectControls() {

  // Light ray slider
  $("lightDistance")?.addEventListener("input", drawLight);

  // Object experiment
  ["objectDistance", "objectSpeed", "objectType"].forEach(id => {
    $(id)?.addEventListener("input", drawObject);
    $(id)?.addEventListener("change", drawObject);
  });

  // Time dilation
  $("timeDistance")?.addEventListener("input", updateTime);

}

/* ==========================================
   10. NAVIGATION
========================================== */

function connectNavigation() {

  document.querySelectorAll("nav button").forEach(button => {

    button.addEventListener("click", () => {

      document.querySelectorAll("nav button")
        .forEach(b => b.classList.remove("active"));

      document.querySelectorAll(".page")
        .forEach(p => p.classList.remove("active"));

      button.classList.add("active");

      const target = $(button.dataset.target);

      if (!target) return;

      target.classList.add("active");

      // Redraw after the selected page becomes visible
      requestAnimationFrame(() => {
        resizeAll();
      });

    });

  });

}

/* ==========================================
   11. INITIALIZATION
========================================== */

function initializeSimulation() {

  resizeAll();

  connectControls();
  connectNavigation();

  updateTime();

  // Start continuous black-hole animation
  drawMain();

  // Initial static diagrams
  drawStructure();
  drawGrid();
  drawLight();
  drawObject();

  console.log(
    "Sagittarius A* Black Hole Laboratory initialized successfully."
  );
}

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initializeSimulation,
    {once: true}
  );

} else {

  initializeSimulation();

}

/* ==========================================
   12. HANDLE WINDOW RESIZING
========================================== */

let resizeTimeout;

window.addEventListener("resize", () => {

  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    resizeAll();
  }, 150);

});
