import * as THREE from 'three';

const canvas = document.getElementById('scene');
const label = document.getElementById('assembly');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const BG = 0x261d17;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(BG, 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(BG, 34, 70);

const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);
const target = new THREE.Vector3(0.6, 1.4, 0.4);

scene.add(new THREE.HemisphereLight(0xfff7ec, 0x8c6c52, 1.35));
const sun = new THREE.DirectionalLight(0xfff0dc, 1.7);
sun.position.set(-10, 18, 12);
scene.add(sun);
const fill = new THREE.DirectionalLight(0xe9d6c0, 0.45);
fill.position.set(12, 6, -10);
scene.add(fill);

// Drafting table grid
const grid = new THREE.GridHelper(80, 80, 0xc39669, 0xc39669);
grid.material.transparent = true;
grid.material.opacity = 0.08;
grid.position.y = -0.001;
scene.add(grid);

// Palette
const C = {
  walnut: 0x4a3122,
  walnut2: 0x6a4630,
  board: 0xd8cab5,
  cork: 0xb48b64,
  cork2: 0x9f7752,
  bass: 0xe7d6ba,
  bass2: 0xd9c19c,
  white: 0xf1e9dd,
  path: 0x8d6c50,
  acryl: 0xb9c4c0,
  tree: 0xb7895c,
  trunk: 0x6a4630,
};

const EDGE = 0x3b2a1e;
const pieces = [];
const model = new THREE.Group();
scene.add(model);

function piece(geo, color, x, y, z, delay, opts = {}) {
  const mat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity: 0, flatShading: true });
  if (opts.glass) { mat.depthWrite = false; }
  const mesh = new THREE.Mesh(geo, mat);
  const edgeMat = new THREE.LineBasicMaterial({ color: EDGE, transparent: true, opacity: 0 });
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), edgeMat);
  mesh.add(edges);
  const r = (a) => (Math.random() - 0.5) * a;
  const drop = opts.drop ?? 6 + Math.random() * 4;
  const p = {
    mesh, mat, edgeMat,
    to: new THREE.Vector3(x, y, z),
    from: new THREE.Vector3(x + r(opts.spread ?? 3), y + drop, z + r(opts.spread ?? 3)),
    rot: new THREE.Euler(r(1.2), r(2.2), r(1.2)),
    delay, dur: opts.dur ?? 1.5,
    alpha: opts.alpha ?? 1,
    edgeAlpha: opts.edgeAlpha ?? 0.42,
    done: false,
  };
  mesh.position.copy(p.from);
  mesh.rotation.copy(p.rot);
  model.add(mesh);
  pieces.push(p);
  return p;
}
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

// ---------- Build the model ----------
let t = 0.2;
// plinth
piece(box(14, 0.6, 10), C.walnut, 0, 0.3, 0, t, { drop: 4, spread: 0, dur: 1.8 });
t += 0.35;
piece(box(13.6, 0.06, 9.6), C.board, 0, 0.63, 0, t, { drop: 3, spread: 0.6, dur: 1.6 });
t += 0.4;

// terrain layers (back-left)
const terr = [[6.6, 4.8], [5.4, 3.9], [4.2, 3.0], [3.0, 2.1], [1.8, 1.3]];
terr.forEach(([w, d], i) => {
  piece(box(w, 0.22, d), i % 2 ? C.cork2 : C.cork, -3.4 + i * 0.22, 0.77 + i * 0.22, -2.3 + i * 0.14, t, { spread: 2 });
  t += 0.16;
});

// paths
piece(box(13.6, 0.03, 0.7), C.path, 0, 0.675, 3.2, t, { spread: 1, drop: 4 }); t += 0.12;
piece(box(0.7, 0.03, 3.6), C.path, -1.2, 0.675, 1.3, t, { spread: 1, drop: 4 }); t += 0.2;

// pool
piece(box(2.6, 0.05, 1.2), C.acryl, -3.6, 0.68, 1.4, t, { alpha: 0.75, spread: 1.5 }); t += 0.25;

// building — level 0
const bx = 2.2, bz = 0.2;
const s0 = 0.66 + 0.09; // slab center
piece(box(7, 0.18, 4.4), C.white, bx, s0, bz, t, { spread: 1.5 }); t += 0.25;
const top0 = s0 + 0.09, H = 1.3;
piece(box(5.4, H - 0.02, 3.0), C.acryl, bx - 0.3, top0 + H / 2, bz, t, { alpha: 0.45, glass: true, edgeAlpha: 0.3 }); t += 0.2;
for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) {
  piece(box(0.12, H, 0.12), C.bass2, bx - 3.1 + i * 1.55, top0 + H / 2, bz - 1.9 + j * 3.8, t, { spread: 2, dur: 1.2 });
  t += 0.05;
}
t += 0.1;
// level 1 slab (cantilever)
const s1 = top0 + H + 0.09;
piece(box(8.2, 0.18, 4.6), C.white, bx + 0.7, s1, bz, t, { spread: 1.5 }); t += 0.25;
const top1 = s1 + 0.09;
// side walls
piece(box(0.14, H, 4.2), C.bass, bx - 3.25, top1 + H / 2, bz, t, { spread: 2 }); t += 0.12;
piece(box(0.14, H, 4.2), C.bass, bx + 4.65, top1 + H / 2, bz, t, { spread: 2 }); t += 0.12;
// inner glass
piece(box(7.6, H - 0.02, 3.6), C.acryl, bx + 0.7, top1 + H / 2, bz, t, { alpha: 0.4, glass: true, edgeAlpha: 0.25 }); t += 0.15;
// fins front & back
const fins = 24;
for (let i = 0; i < fins; i++) {
  const x = bx - 3.0 + (i / (fins - 1)) * 7.4;
  piece(box(0.06, H, 0.3), C.bass, x, top1 + H / 2, bz + 2.1, t, { spread: 1.6, dur: 1.1, drop: 5 + Math.random() * 2 });
  piece(box(0.06, H, 0.3), C.bass, x, top1 + H / 2, bz - 2.1, t + 0.02, { spread: 1.6, dur: 1.1, drop: 5 + Math.random() * 2 });
  t += 0.035;
}
t += 0.15;
// roof
const s2 = top1 + H + 0.09;
piece(box(8.4, 0.18, 4.8), C.white, bx + 0.7, s2, bz, t, { spread: 1.5, dur: 1.7 }); t += 0.3;
piece(box(2.2, 0.8, 1.6), C.bass2, bx + 2.6, s2 + 0.09 + 0.4, bz - 0.8, t, { spread: 2 }); t += 0.15;
piece(box(1.2, 0.5, 1.2), C.board, bx - 1.6, s2 + 0.09 + 0.25, bz + 0.6, t, { spread: 2 }); t += 0.25;

// annex
piece(box(2.4, 1.0, 1.8), C.walnut2, -1.0, 0.66 + 0.5, -0.3 + 3.0 - 1.6, t, { spread: 2 }); t += 0.2;

// trees
const trunkGeo = new THREE.CylinderGeometry(0.035, 0.05, 0.55, 6);
const crownGeo = new THREE.IcosahedronGeometry(0.34, 0);
const groundY = (x, z) => {
  let y = 0.66;
  terr.forEach(([w, d], i) => {
    const cx = -3.4 + i * 0.22, cz = -2.3 + i * 0.14;
    if (Math.abs(x - cx) < w / 2 - 0.12 && Math.abs(z - cz) < d / 2 - 0.12) y = 0.88 + i * 0.22;
  });
  return y;
};
const treeSpots = [
  [-5.4, -3.6], [-4.4, -1.4], [-2.6, -3.0], [-5.9, -0.2], [-1.8, -0.9], [-3.6, -2.4],
  [-5.6, 2.2], [-6.2, 4.0], [-4.6, 4.2], [-2.0, 4.3],
  [0.8, 4.2], [3.2, 4.3], [5.6, 4.2], [6.2, 2.6], [6.3, -3.6], [4.5, -4.1], [-0.2, -4.2],
].map(([x, z]) => [x, groundY(x, z), z]);
treeSpots.forEach(([x, y, z]) => {
  const s = 0.8 + Math.random() * 0.5;
  piece(trunkGeo, C.trunk, x, y + 0.275 * s, z, t, { spread: 1, dur: 1.1, edgeAlpha: 0 }).mesh.scale.setScalar(s);
  piece(crownGeo, Math.random() > 0.5 ? C.tree : C.cork2, x, y + 0.55 * s + 0.28 * s, z, t + 0.08, { spread: 1, dur: 1.2, edgeAlpha: 0.25 }).mesh.scale.setScalar(s);
  t += 0.08;
});

const total = pieces.length;
const pad = n => String(n).padStart(3, '0');
label.textContent = `Сборка ${pad(0)} / ${pad(total)}`;

// ---------- Animation ----------
const easeOut = x => 1 - Math.pow(1 - x, 4);
const easeAlpha = x => Math.min(1, x / 0.35);

let lastW = 0, lastH = 0;
function resize() {
  const host = canvas.parentElement;
  const w = host.clientWidth, h = host.clientHeight;
  if (w === lastW && h === lastH) return;
  lastW = w; lastH = h;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const mobile = w < 760;
  camera.fov = mobile ? 40 : 28;
  if (mobile) camera.setViewOffset(w, h, 0, h * 0.22, w, h);
  else camera.setViewOffset(w, h, -w * 0.2, h * 0.07, w, h);
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

let mx = 0, my = 0, cx = 0, cy = 0;
addEventListener('pointermove', e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });

const clock = new THREE.Clock();
let elapsed = reduce ? 999 : 0;
let placed = 0;
const R = 41;

function frame() {
  requestAnimationFrame(frame);
  const p = window.heroProgress || 0;
  if (p >= 1 || document.hidden) { clock.getDelta(); return; }
  const dt = Math.min(clock.getDelta(), 0.05);
  elapsed += dt;

  let count = 0;
  for (const pc of pieces) {
    if (pc.done) { count++; continue; }
    const k = Math.max(0, Math.min(1, (elapsed - pc.delay) / pc.dur));
    if (k <= 0) continue;
    const e = easeOut(k);
    pc.mesh.position.lerpVectors(pc.from, pc.to, e);
    pc.mesh.rotation.set(pc.rot.x * (1 - e), pc.rot.y * (1 - e), pc.rot.z * (1 - e));
    const a = easeAlpha(k);
    pc.mat.opacity = a * pc.alpha;
    pc.edgeMat.opacity = a * pc.edgeAlpha;
    if (k >= 1) {
      pc.done = true;
      pc.mesh.position.copy(pc.to);
      pc.mesh.rotation.set(0, 0, 0);
      if (pc.alpha === 1) { pc.mat.transparent = false; pc.mat.opacity = 1; pc.mat.needsUpdate = true; }
      count++;
    }
  }
  if (count !== placed) { placed = count; label.textContent = `Сборка ${pad(placed)} / ${pad(total)}`; }

  // camera: slow orbit + pointer parallax + scroll lift
  cx += (mx - cx) * 0.04; cy += (my - cy) * 0.04;
  const ang = 0.72 + elapsed * 0.035 + cx * 0.25;
  const elev = 0.6 + cy * 0.08 + p * 0.25;
  const dist = R * (1 + p * 0.15) * (innerWidth < 760 ? 1.3 : 1);
  camera.position.set(
    target.x + Math.cos(ang) * Math.cos(elev) * dist,
    target.y + Math.sin(elev) * dist,
    target.z + Math.sin(ang) * Math.cos(elev) * dist
  );
  scene.fog.near = dist * 0.85; scene.fog.far = dist * 1.9;
  camera.lookAt(target);
  renderer.render(scene, camera);
}
frame();
