"use client";

import Navigation from "@/components/ui/Navigation";
import Loader from "@/components/ui/Loader";

/**
 * DOM layer stacked above the R3F canvas (see app/globals.css .overlay-layer).
 * Holds navigation, section content, and any 2D HUD chrome — everything
 * that should stay crisp text/DOM rather than being drawn in WebGL.
 */
export default function Overlay() {
  return (
    <>
      <Loader />
      <Navigation />
      {/* Section content (hero copy, project showcase, contact) mounts here
          once the layout/theme is decided. */}
    </>
  );
}
