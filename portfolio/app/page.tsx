"use client";

import { useScroll } from "framer-motion";
import SceneCanvas from "@/components/canvas/SceneCanvas";
import Overlay from "@/components/ui/Overlay";
import Hero from "@/components/sections/Hero";
import ProjectGrid from "@/components/showcase/ProjectGrid";
import TechStack from "@/components/sections/TechStack";
import Contact from "@/components/sections/Contact";

/**
 * Single-page cinematic portfolio. `scrollYProgress` (whole-document
 * scroll, 0..1) is the one shared signal driving both the fixed 3D
 * canvas behind everything and any scroll-linked DOM motion in the
 * sections below it.
 */
export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <main>
      <div className="canvas-layer">
        <SceneCanvas scrollProgress={scrollYProgress} />
      </div>
      <div className="overlay-layer">
        <Overlay>
          <Hero />
          <ProjectGrid />
          <TechStack />
          <Contact />
        </Overlay>
      </div>
    </main>
  );
}
