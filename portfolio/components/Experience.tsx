"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import type { Company } from "@/data/content";

/**
 * Client-side layer over the static page: the WebGL sculpture (code-split,
 * loaded after first paint), scroll reveals, and the active nav link.
 */
export default function Experience() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    (window as Window & { __ready?: boolean }).__ready = true; // cancels the no-JS failsafe in layout.tsx
    const sections = [...document.querySelectorAll<HTMLElement>("main > section")];
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lite = matchMedia("(pointer: coarse)").matches || navigator.hardwareConcurrency <= 4;

    let stage: { focus(c: Company | null): void; dispose(): void } | undefined;
    let cancelled = false;
    import("@/lib/stage").then(({ startStage }) => {
      if (cancelled || !canvas.current || !tooltip.current) return;
      try {
        stage = startStage({ canvas: canvas.current, tooltip: tooltip.current, sections, reducedMotion, lite });
      } catch {
        // No WebGL: the page is complete without the sculpture.
      }
    });

    // Hovering or focusing a role lights up its months in the sculpture.
    const onFocus = (e: Event) => {
      const el = (e.target as Element).closest?.<HTMLElement>("[data-company]");
      stage?.focus((el?.dataset.company as Company | undefined) ?? null);
    };
    document.addEventListener("pointerover", onFocus);
    document.addEventListener("focusin", onFocus);

    const links = [...document.querySelectorAll<HTMLAnchorElement>(".nav nav a")];
    const active = new IntersectionObserver(
      (entries) => {
        for (const { isIntersecting, target } of entries) {
          if (!isIntersecting) continue;
          for (const a of links) {
            if (a.hash === `#${target.id}`) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => active.observe(s));

    // Reveals: whatever enters the viewport together rises in together, staggered.
    const reveal = new IntersectionObserver(
      (entries) => {
        const shown = entries.filter((e) => e.isIntersecting).map((e) => e.target);
        shown.forEach((el) => reveal.unobserve(el));
        if (shown.length) animate(shown, { opacity: [0, 1], y: [28, 0], duration: 900, delay: stagger(70), ease: "outExpo" });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    if (root.classList.contains("anim")) document.querySelectorAll("[data-r]").forEach((el) => reveal.observe(el));

    return () => {
      cancelled = true;
      stage?.dispose();
      active.disconnect();
      reveal.disconnect();
      document.removeEventListener("pointerover", onFocus);
      document.removeEventListener("focusin", onFocus);
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} className="stage" aria-hidden />
      <div ref={tooltip} className="tip" role="status" hidden />
    </>
  );
}
