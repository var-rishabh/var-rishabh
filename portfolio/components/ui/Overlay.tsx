"use client";

import type { ReactNode } from "react";
import Navigation from "@/components/ui/Navigation";

/**
 * DOM layer stacked above the R3F canvas (see app/globals.css
 * .overlay-layer). Holds the floating nav plus whatever section content
 * the page passes in — everything that should stay crisp text/DOM
 * rather than being drawn in WebGL.
 */
export default function Overlay({ children }: { children: ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
