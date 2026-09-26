import SceneCanvas from "@/components/canvas/SceneCanvas";
import Overlay from "@/components/ui/Overlay";

// Landing route. The 3D canvas renders full-bleed behind the UI overlay.
// Scene contents (geometry, lighting, camera rig) are intentionally left
// as stubs — see components/canvas — until the visual theme is decided.
export default function Home() {
  return (
    <main>
      <div className="canvas-layer">
        <SceneCanvas />
      </div>
      <div className="overlay-layer">
        <Overlay />
      </div>
    </main>
  );
}
