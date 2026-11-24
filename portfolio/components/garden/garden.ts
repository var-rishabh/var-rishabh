import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Stone } from "@/data/garden";

const GW = 24; // garden width, world units
const GD = 15; // garden depth
const PX = 80; // height-map pixels per world unit
const PER = 0.16; // groove spacing, world units

/**
 * Builds the sand garden scene into `canvas` and returns a cleanup function.
 * Raked basalt sand (a canvas height map used as bump + displacement), five
 * stones casting long low-sun shadows, and a five-tine rake on the pointer.
 */
export function mountGarden(
  canvas: HTMLCanvasElement,
  stonesIn: Stone[],
  tags: HTMLElement[],
  onReady: () => void,
): () => void {
  const narrow = innerWidth < 720;
  const stones = stonesIn.map((s) => {
    const [x, z] = narrow ? s.atPhone : s.at;
    return { x, z, r: (0.32 + Math.sqrt(s.months) * 0.11) * (narrow ? 0.62 : 1) };
  });

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#1a1917");
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);

  // Height field: straight rake lines, concentric rings around each stone.
  const hc = document.createElement("canvas");
  hc.width = GW * PX;
  hc.height = GD * PX;
  const g = hc.getContext("2d")!;
  const img = g.createImageData(hc.width, hc.height);
  for (let y = 0; y < hc.height; y++) {
    for (let x = 0; x < hc.width; x++) {
      const wx = x / PX - GW / 2;
      const wz = y / PX - GD / 2;
      let v = Math.sin((wz / PER) * Math.PI * 2);
      for (const s of stones) {
        const d = Math.hypot(wx - s.x, wz - s.z) - s.r;
        if (d < s.r * 1.1 + 0.55) {
          v = Math.sin((d / PER) * Math.PI * 2);
          break;
        }
      }
      const k = (y * hc.width + x) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = 128 + 90 * v;
      img.data[k + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const height = new THREE.CanvasTexture(hc);

  // Grain so the sand reads as sand up close.
  const gc = document.createElement("canvas");
  gc.width = gc.height = 512;
  const gg = gc.getContext("2d")!;
  gg.fillStyle = "#5a5650";
  gg.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 60000; i++) {
    gg.fillStyle = `hsl(35,6%,${30 + Math.random() * 60}%)`;
    gg.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
  }
  const grain = new THREE.CanvasTexture(gc);
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.repeat.set(12, 7.5);
  grain.colorSpace = THREE.SRGBColorSpace;

  const bed = new THREE.Mesh(
    new THREE.PlaneGeometry(GW, GD, narrow ? 320 : 640, narrow ? 200 : 400),
    new THREE.MeshStandardMaterial({ map: grain, roughness: 1, bumpMap: height, bumpScale: 3, displacementMap: height, displacementScale: 0.035 }),
  );
  bed.rotation.x = -Math.PI / 2;
  bed.receiveShadow = true;
  scene.add(bed);

  const stoneMat = new THREE.MeshStandardMaterial({ color: "#8d887e", roughness: 0.95 });
  const meshes = stones.map((s, i) => {
    const geo = mergeVertices(new THREE.IcosahedronGeometry(1, 6));
    const p = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let k = 0; k < p.count; k++) {
      v.fromBufferAttribute(p, k);
      v.multiplyScalar(1 + 0.12 * Math.sin(v.x * 3.1 + i) * Math.sin(v.y * 2.7 + i * 2) + 0.06 * Math.sin(v.z * 7 + v.x * 5));
      v.y = Math.max(v.y, -0.2);
      p.setXYZ(k, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, stoneMat);
    m.scale.set(s.r, s.r * (0.55 + 0.25 * (((i * 7) % 3) / 2)), s.r * 0.9);
    m.rotation.y = i * 1.3;
    m.position.set(s.x, s.r * 0.12, s.z);
    m.castShadow = m.receiveShadow = true;
    scene.add(m);
    return m;
  });

  scene.add(new THREE.HemisphereLight("#d8d2c6", "#1a1917", 0.35));
  const sun = new THREE.DirectionalLight("#ffe2bd", 3.6);
  sun.position.set(-9, 3.2, -3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 8, bottom: -8, far: 40 });
  sun.shadow.bias = -0.0008;
  sun.shadow.radius = 4;
  scene.add(sun);

  const box = () => canvas.getBoundingClientRect();
  function frame() {
    const { width, height: h } = box();
    renderer.setSize(width, h, false);
    camera.aspect = width / h;
    if (narrow) {
      camera.position.set(0, 13, 7.6);
      camera.lookAt(0, 0, 2.2);
      camera.setViewOffset(width, h, 0, -h * 0.12, width, h);
    } else {
      camera.position.set(1.4, 11, 8.6);
      camera.lookAt(1.4, 0, 0);
      camera.clearViewOffset();
    }
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }
  frame();
  const ro = new ResizeObserver(frame);
  ro.observe(canvas);

  // Labels follow their stones.
  const pv = new THREE.Vector3();
  const placeTags = () => {
    const { width, height: h } = box();
    stones.forEach((s, i) => {
      pv.set(s.x, 0, s.z + s.r + 0.15).project(camera);
      tags[i].style.transform = `translate(${((pv.x + 1) / 2) * width}px, ${((1 - pv.y) / 2) * h}px) translateX(-50%)`;
    });
  };

  // Five-tine rake along the pointer path, clipped around the stones.
  const toPx = (x: number, z: number): [number, number] => [(x + GW / 2) * PX, (z + GD / 2) * PX];
  let dirty = false;
  function rake(a: [number, number], b: [number, number]) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    if (len < 8) return false;
    const nx = -dy / len;
    const ny = dx / len;
    const sp = PER * PX;
    g.save();
    g.beginPath();
    g.rect(0, 0, hc.width, hc.height);
    for (const s of stones) {
      const [cx, cy] = toPx(s.x, s.z);
      g.moveTo(cx + s.r * PX * 1.15, cy);
      g.arc(cx, cy, s.r * PX * 1.15, 0, Math.PI * 2);
    }
    g.clip("evenodd");
    g.lineCap = "butt";
    g.strokeStyle = "rgb(200,200,200)";
    g.lineWidth = sp * 5;
    g.beginPath();
    g.moveTo(...a);
    g.lineTo(...b);
    g.stroke();
    for (const [w, c] of [[0.62, "rgba(70,70,70,.7)"], [0.34, "rgb(30,30,30)"]] as const) {
      g.strokeStyle = c;
      g.lineWidth = sp * w;
      g.beginPath();
      for (let k = -2; k <= 2; k++) {
        g.moveTo(a[0] + nx * k * sp, a[1] + ny * k * sp);
        g.lineTo(b[0] + nx * k * sp, b[1] + ny * k * sp);
      }
      g.stroke();
    }
    g.restore();
    return true;
  }

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let prev: [number, number] | null = null;
  const onMove = (e: PointerEvent) => {
    const r = box();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const over = ray.intersectObjects(meshes)[0];
    const hover = over ? meshes.findIndex((m) => m === over.object) : -1;
    tags.forEach((t, i) => t.toggleAttribute("data-on", i === hover));
    const hit = ray.intersectObject(bed)[0];
    if (!hit) return void (prev = null);
    const p = toPx(hit.point.x, hit.point.z);
    if (!prev) return void (prev = p);
    if ((e.buttons || e.pointerType === "mouse") && rake(prev, p)) {
      dirty = true;
      prev = p;
    }
  };
  const onLeave = () => (prev = null);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);

  // Render only while the garden is on screen.
  let visible = true;
  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  io.observe(canvas);

  let raf = 0;
  let first = true;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!visible && !first) return;
    if (dirty) {
      height.needsUpdate = true;
      dirty = false;
    }
    placeTags();
    renderer.render(scene, camera);
    if (first) {
      first = false;
      onReady();
    }
  };
  tick();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerleave", onLeave);
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
    });
    height.dispose();
    grain.dispose();
    renderer.dispose();
  };
}
