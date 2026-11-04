import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { MONTHS, type Company } from "@/data/content";
import { pluck } from "@/lib/sound";

/*
 * The whole site is one sculpture: 64 objects, one per month since Aug 2021,
 * that morph between five forms as the page scrolls (one form per section):
 * pendulum wave → harp → month grid → card deck → ribbon.
 */

const N = MONTHS.length;
const K = 8; // points per thread, so harp strings can bend when plucked
const V3 = THREE.Vector3;

interface Pose {
  p: THREE.Vector3; // position
  q: THREE.Quaternion;
  s: THREE.Vector3; // scale
  a: THREE.Vector3; // thread start
  b: THREE.Vector3; // thread end
}
const pose = (): Pose => ({ p: new V3(), q: new THREE.Quaternion(), s: new V3(), a: new V3(), b: new V3() });

// Interaction state, one slot per month.
const kick = new Float32Array(N); // extra pendulum swing
const vib = new Float32Array(N); // harp string vibration
const lift = new Float32Array(N); // hover: grid blocks rise, cards slide out
const glow = new Float32Array(N).fill(1); // per-month brightness

const X = new V3(1, 0, 0);
const Y = new V3(0, 1, 0);
const Z = new V3(0, 0, 1);
const tmp = new V3();
const side = new V3();
const up = new V3();
const basis = new THREE.Matrix4();
const twist = new THREE.Quaternion();
const pointerWorld = new V3();
let pointerOnScene = false;

const u = (i: number) => i / (N - 1);
const isProject = (i: number) => MONTHS[i].company === "xev" || MONTHS[i].company === "fin";

type Form = (i: number, t: number, o: Pose) => void;

const pendulum: Form = (i, t, o) => {
  const x = (u(i) - 0.5) * 8;
  const length = 3.4 - 1.4 * u(i);
  // Pendulum wave: frequencies (24 + i) / 60 Hz drift in and out of phase.
  const angle = (0.32 + kick[i]) * Math.cos(((2 * Math.PI * (24 + i)) / 60) * t);
  o.a.set(x, 4.8, 0);
  o.p.set(x, 4.8 - length * Math.cos(angle), length * Math.sin(angle));
  o.b.copy(o.p);
  o.q.setFromAxisAngle(X, angle);
  o.s.setScalar(0.17);
};

const harp: Form = (i, _t, o) => {
  const arch = Math.sin(u(i) * Math.PI);
  const x = (u(i) - 0.5) * 7.4;
  const z = -arch * 1.5;
  o.a.set(x, 2.9 + 1.4 * arch, z);
  o.b.set(x, 0.25, z);
  o.p.copy(o.a);
  o.q.identity();
  o.s.setScalar(0.1);
};

const grid: Form = (i, _t, o) => {
  const { year, month } = MONTHS[i];
  const h = i === N - 1 ? 1 : 0.46 + lift[i] * 0.35;
  const x = (month - 5.5) * 0.64;
  const z = (year - 2023.5) * 0.64;
  o.p.set(x, h / 2, z);
  o.s.set(0.52, h, 0.52);
  o.q.identity();
  o.a.set(x, h, z);
  o.b.copy(o.a);
};

const deck: Form = (i, _t, o) => {
  const angle = (u(i) - 0.5) * 2.3;
  const r = 2 + lift[i] * 0.45 + (isProject(i) ? 0.35 : 0);
  o.p.set(-Math.sin(angle) * r, 0.4 + Math.cos(angle) * r, -i * 0.008);
  o.q.setFromAxisAngle(Z, angle);
  o.s.set(0.95, 1.75, 0.025);
  o.a.copy(o.p);
  o.b.copy(o.p);
};

const ribbonAt = (v: number, t: number, out: THREE.Vector3) => {
  out.set(Math.sin(v * 6.6 + 0.4) * 3, 2.3 + Math.sin(v * 9.4 + t * 0.6) * 0.9, Math.cos(v * 5 + t * 0.3) * 1.5);
  if (pointerOnScene) {
    // The ribbon leans toward the cursor like fabric.
    const pull = Math.max(0, 1 - out.distanceTo(pointerWorld) / 1.8) * 0.45;
    out.lerp(pointerWorld, pull);
  }
  return out;
};

const ribbon: Form = (i, t, o) => {
  const v = u(i);
  ribbonAt(v, t, o.p);
  ribbonAt(v + 0.01, t, tmp).sub(o.p).normalize();
  side.crossVectors(Y, tmp).normalize();
  up.crossVectors(tmp, side);
  o.q.setFromRotationMatrix(basis.makeBasis(side, up, tmp)).multiply(twist.setFromAxisAngle(Z, v * Math.PI * 2));
  o.s.set(0.55, 0.035, 0.38);
  o.a.copy(o.p);
  ribbonAt(Math.min(1, v + 1 / (N - 1)), t, o.b);
};

const FORMS = [pendulum, harp, grid, deck, ribbon];
// Per form: camera position, look-at, thread opacity, halo size, emissive glow.
const LOOK = [
  { pos: new V3(2.6, 3.4, 11.5), at: new V3(0, 3.1, 0), thread: 0.35, halo: 0.5, glow: 1.1 },
  { pos: new V3(0, 2.6, 9.8), at: new V3(0, 2.3, 0), thread: 0.6, halo: 0.4, glow: 1.2 },
  { pos: new V3(1.2, 8.8, 8.6), at: new V3(0, 0, 0.3), thread: 0, halo: 0, glow: 0.35 },
  { pos: new V3(0, 2.1, 11), at: new V3(0, 1.8, 0), thread: 0, halo: 0, glow: 0.55 },
  { pos: new V3(0.6, 2.6, 11.5), at: new V3(0, 2.3, 0), thread: 0.3, halo: 0.3, glow: 0.9 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export interface StageOptions {
  canvas: HTMLCanvasElement;
  tooltip: HTMLElement;
  sections: HTMLElement[];
  reducedMotion: boolean;
  lite: boolean;
}

export function startStage({ canvas, tooltip, sections, reducedMotion, lite }: StageOptions) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lite, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.AgXToneMapping;
  let dpr = Math.min(window.devicePixelRatio, lite ? 1.25 : 1.75);
  renderer.setPixelRatio(dpr);

  const css = getComputedStyle(document.documentElement);
  const color = (name: string) => new THREE.Color(css.getPropertyValue(name).trim());
  const voidColor = color("--void");
  const companyColor = (c: Company | null) => color(`--c-${c ?? "none"}`);
  const base = MONTHS.map((m) => companyColor(m.company));

  const scene = new THREE.Scene();
  scene.background = voidColor;
  scene.fog = new THREE.FogExp2(voidColor, 0.045);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
  scene.add(new THREE.HemisphereLight(0x9fb3d1, 0x000000, 0.6));
  const key = new THREE.DirectionalLight(0xdfe6f0, 1.1);
  key.position.set(-4, 8, 6);
  const cursorLight = new THREE.PointLight(0xffe6c8, 0, 6, 1.6);
  scene.add(key, cursorLight);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x0b0c0f, roughness: 0.85 }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // The 64 months. Emissive light comes from each month's own colour.
  const glowUniform = { value: 1 };
  const material = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.1 });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uGlow = glowUniform;
    shader.fragmentShader = `uniform float uGlow;\n${shader.fragmentShader}`.replace(
      "#include <emissivemap_fragment>",
      "#include <emissivemap_fragment>\ntotalEmissiveRadiance += vColor * uGlow;",
    );
  };
  const months = new THREE.InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 2, 0.12), material, N);
  months.frustumCulled = false;
  // Instances move every frame, so give raycasting a fixed bound instead of a stale one.
  months.boundingSphere = new THREE.Sphere(new V3(), 40);

  const haloTexture = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,0.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  const halos = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: haloTexture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }),
    N,
  );
  halos.frustumCulled = false;

  const threadPositions = new Float32Array(N * (K - 1) * 6);
  const threadColors = new Float32Array(N * (K - 1) * 6);
  for (let i = 0; i < N; i++) for (let v = 0; v < (K - 1) * 2; v++) base[i].toArray(threadColors, (i * (K - 1) * 2 + v) * 3);
  const threadGeometry = new THREE.BufferGeometry();
  threadGeometry.setAttribute("position", new THREE.BufferAttribute(threadPositions, 3));
  threadGeometry.setAttribute("color", new THREE.BufferAttribute(threadColors, 3));
  const threadMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false });
  const threads = new THREE.LineSegments(threadGeometry, threadMaterial);
  threads.frustumCulled = false;

  const dust = new THREE.BufferGeometry();
  dust.setAttribute("position", new THREE.Float32BufferAttribute(Array.from({ length: 900 }, (_, j) => (j % 3 === 1 ? Math.random() * 7 : (Math.random() - 0.5) * 18)), 3));
  scene.add(months, halos, threads, new THREE.Points(dust, new THREE.PointsMaterial({ color: 0xcfd6e0, size: 0.02, transparent: true, opacity: 0.4 })));

  // Layout: where each section starts, so scroll maps to (form, progress).
  let tops: number[] = [];
  let width = 0;
  let height = 0;
  const measure = () => {
    tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === width && h === height) return;
    width = w;
    height = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Desktop: sculpture sits right of the copy. Phones: it sits above the copy.
    if (w >= 900) camera.setViewOffset(w, h, -w * 0.2, 0, w, h);
    else camera.setViewOffset(w, h, 0, h * 0.17, w, h);
    camera.updateProjectionMatrix();
  };
  /** The section the visitor is in, and how far the next one has come into view (0..1). */
  const formAt = (y: number): [number, number] => {
    for (let i = 0; i < tops.length - 1; i++) {
      if (y >= tops[i + 1]) continue;
      const span = Math.min(window.innerHeight, tops[i + 1] - tops[i]);
      return [i, clamp01((y - (tops[i + 1] - span)) / span)];
    }
    return [Math.max(0, tops.length - 1), 0];
  };

  // Pointer, in normalised device coordinates.
  const pointer = Object.assign(new THREE.Vector2(), { lastX: 0, lastY: 0, downX: 0, downY: 0 });
  const raycaster = new THREE.Raycaster();
  const facing = new THREE.Plane(Z, 0); // vertical plane through the sculpture, facing the camera
  let hovered = -1;
  let tipTimer = 0;
  let focus: Company | null = null;
  const toNdc = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  const pick = (e: PointerEvent) => {
    raycaster.setFromCamera(pointer, camera);
    hovered = raycaster.intersectObject(months)[0]?.instanceId ?? -1;
    if (hovered < 0) {
      tooltip.hidden = true;
      return;
    }
    const m = MONTHS[hovered];
    tooltip.textContent = m.name ? `${m.label}, ${m.name}` : m.label;
    tooltip.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, calc(-100% - 14px))`;
    tooltip.hidden = false;
  };
  // The copy column owns its own pointer; the sculpture reacts everywhere else.
  const overCopy = (e: PointerEvent) => (e.target as Element).closest?.("a, button, .copy") !== null;
  const onMove = (e: PointerEvent) => {
    toNdc(e);
    pointerOnScene = !overCopy(e);
    if (e.pointerType === "mouse") {
      if (pointerOnScene) pick(e);
      else tooltip.hidden = true;
    }
  };
  const onDown = (e: PointerEvent) => {
    toNdc(e);
    pointer.downX = e.clientX;
    pointer.downY = e.clientY;
  };
  const onUp = (e: PointerEvent) => {
    if (e.pointerType === "mouse" || overCopy(e) || Math.hypot(e.clientX - pointer.downX, e.clientY - pointer.downY) > 8) return;
    // A tap on touch screens: show the month for a moment.
    toNdc(e);
    pick(e);
    clearTimeout(tipTimer);
    tipTimer = window.setTimeout(onLeave, 2400);
  };
  const onLeave = () => {
    pointerOnScene = false;
    hovered = -1;
    tooltip.hidden = true;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  window.addEventListener("resize", measure);
  const observer = new ResizeObserver(measure);
  observer.observe(document.body);
  measure();

  const A = pose();
  const B = pose();
  const P = new V3();
  const Q = new THREE.Quaternion();
  const S = new V3();
  const ta = new V3();
  const tb = new V3();
  const m4 = new THREE.Matrix4();
  const tint = new THREE.Color();
  const look = new V3();
  const parallax = { x: 0, y: 0 };
  const screenA = new V3();
  const screenB = new V3();
  // Start mid-cycle so the pendulum wave is already spread; reduced motion freezes it there.
  let time = 12;
  let last = performance.now();
  let slowFrames = 0;
  let frames = 0;

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reducedMotion) time += dt;

    // Adaptive quality: drop resolution once if the device can't hold ~45 fps.
    frames++;
    if (dt > 1 / 45) slowFrames++;
    if (frames === 90) {
      if (slowFrames > 45 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.5);
        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height, false);
      }
      frames = slowFrames = 0;
    }

    const [fa, ft] = formAt(window.scrollY);
    const fb = Math.min(fa + 1, FORMS.length - 1);
    const e = ease(ft);
    const from = LOOK[fa];
    const to = LOOK[fb];
    const dx = pointer.x - pointer.lastX;
    const dy = pointer.y - pointer.lastY;
    const pointerMoved = pointerOnScene && (dx !== 0 || dy !== 0);
    const pendulumWeight = fa === 0 ? 1 - e : 0;
    const harpWeight = fa === 1 ? 1 - e : fb === 1 ? e : 0;

    // Camera: blend the two forms' views; on phones pull back to fit the narrow screen.
    look.lerpVectors(from.at, to.at, e);
    camera.position.lerpVectors(from.pos, to.pos, e).sub(look).multiplyScalar(Math.min(2.4, Math.max(1, 1.25 / camera.aspect))).add(look);
    if (!reducedMotion) {
      parallax.x += (pointer.x * 0.5 - parallax.x) * Math.min(1, dt * 3);
      parallax.y += (pointer.y * 0.3 - parallax.y) * Math.min(1, dt * 3);
      camera.position.x += parallax.x;
      camera.position.y += parallax.y;
    }
    camera.lookAt(look);
    camera.updateMatrixWorld();

    if (pointerOnScene) {
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.ray.intersectPlane(facing, pointerWorld)) {
        cursorLight.position.copy(pointerWorld).setZ(1.2);
        cursorLight.intensity += (5 - cursorLight.intensity) * Math.min(1, dt * 4);
      }
    } else cursorLight.intensity *= 1 - Math.min(1, dt * 4);

    glowUniform.value = mix(from.glow, to.glow, e);
    threadMaterial.opacity = mix(from.thread, to.thread, e);
    const haloSize = mix(from.halo, to.halo, e);

    for (let i = 0; i < N; i++) {
      // Months morph one after another, so each change ripples along the timeline.
      const local = ease(clamp01(ft * 1.5 - u(i) * 0.5));
      FORMS[fa](i, time, A);
      FORMS[fb](i, time, B);
      P.lerpVectors(A.p, B.p, local);
      Q.slerpQuaternions(A.q, B.q, local);
      S.lerpVectors(A.s, B.s, local);
      months.setMatrixAt(i, m4.compose(P, Q, S));
      halos.setMatrixAt(i, m4.compose(P, camera.quaternion, S.setScalar(haloSize)));
      ta.lerpVectors(A.a, B.a, local);
      tb.lerpVectors(A.b, B.b, local);

      if (!reducedMotion && pointerMoved) {
        screenA.copy(ta).project(camera);
        screenB.copy(tb).project(camera);
        // Pendulums: a nearby flick adds swing.
        if (pendulumWeight > 0.5 && Math.hypot(screenB.x - pointer.x, screenB.y - pointer.y) < 0.12) {
          kick[i] = Math.min(0.55, kick[i] + Math.hypot(dx, dy) * 2);
        }
        // Harp: crossing a string plucks it.
        const sx = (screenA.x + screenB.x) / 2;
        if (harpWeight > 0.5 && (pointer.lastX - sx) * (pointer.x - sx) < 0 && pointer.y < Math.max(screenA.y, screenB.y) && pointer.y > Math.min(screenA.y, screenB.y)) {
          vib[i] = 0.32;
          pluck(Math.round(u(i) * 14));
        }
      }
      kick[i] *= Math.exp(-dt * 0.6);
      vib[i] *= Math.exp(-dt * 2.2);
      lift[i] += ((hovered === i ? 1 : 0) - lift[i]) * Math.min(1, dt * 8);

      for (let j = 0; j < K - 1; j++) {
        for (let end = 0; end < 2; end++) {
          const w = (j + end) / (K - 1);
          tmp.lerpVectors(ta, tb, w);
          tmp.x += vib[i] * harpWeight * Math.sin(w * Math.PI) * Math.sin(time * 38 + i);
          tmp.toArray(threadPositions, (i * (K - 1) * 2 + j * 2 + end) * 3);
        }
      }

      const company = MONTHS[i].company;
      const target = (focus ? (company === focus ? 1.7 : 0.25) : 1) + lift[i] * 0.8 + vib[i] * 4 + (i === N - 1 ? 0.5 : 0);
      glow[i] += (target - glow[i]) * Math.min(1, dt * 8);
      tint.copy(base[i]).multiplyScalar(glow[i]);
      months.setColorAt(i, tint);
      halos.setColorAt(i, tint);
    }
    pointer.lastX = pointer.x;
    pointer.lastY = pointer.y;
    months.instanceMatrix.needsUpdate = halos.instanceMatrix.needsUpdate = true;
    months.instanceColor!.needsUpdate = halos.instanceColor!.needsUpdate = true;
    threadGeometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(frame);

  const onLost = (e: Event) => {
    e.preventDefault();
    renderer.setAnimationLoop(null);
  };
  canvas.addEventListener("webglcontextlost", onLost);

  return {
    focus(company: Company | null) {
      focus = company;
    },
    dispose() {
      renderer.setAnimationLoop(null);
      clearTimeout(tipTimer);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", measure);
      canvas.removeEventListener("webglcontextlost", onLost);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        (mesh.material as THREE.Material | undefined)?.dispose();
      });
      haloTexture.dispose();
      renderer.dispose();
    },
  };
}
