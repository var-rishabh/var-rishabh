"use client";

import { useEffect } from "react";

/** Wheel/trackpad: a new gesture needs a quiet gap, or a clear re-acceleration. */
const WHEEL_GAP_MS = 140;
const WHEEL_REACCEL = 1.6;
/** Touch: minimum drag (px), or a faster flick over a shorter drag. */
const SWIPE_DISTANCE_PX = 30;
const SWIPE_FLICK_PX = 12;
const SWIPE_FLICK_SPEED = 0.35;
const TOUCH_SLOP_PX = 8;

const INTERACTIVE = "a,button,input,textarea,select,summary,[contenteditable],[role='button']";

/** Resting positions published by <SnapStops />. */
function stopOffsets(): number[] {
  return [...document.querySelectorAll<HTMLElement>(".snap-stop")]
    .map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY))
    .sort((a, b) => a - b);
}

function nextStop(direction: 1 | -1): number | null {
  const y = window.scrollY;
  const stops = stopOffsets();
  if (direction > 0) return stops.find((s) => s > y + 2) ?? null;
  for (let i = stops.length - 1; i >= 0; i -= 1) if (stops[i] < y - 2) return stops[i];
  return null;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** True when an ancestor can scroll vertically by itself (let it). */
function inNestedScroller(target: EventTarget | null, dy: number): boolean {
  for (let el = target instanceof Element ? target : null; el && el !== document.body; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) {
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      if ((dy < 0 && !atTop) || (dy > 0 && !atBottom)) return true;
    }
  }
  return false;
}

const isZoomed = () => (window.visualViewport?.scale ?? 1) > 1.01;

/**
 * One gesture = one stop. Wheel, trackpad, touch and keyboard each advance the
 * page to the next (or previous) `.snap-stop`, then ignore the rest of that
 * gesture's momentum. Native scrolling is untouched for everything else
 * (scrollbar drag, find-in-page, focus, zoom, horizontal pans), and the CSS
 * `scroll-snap-type` on <html> settles those on a stop too.
 */
export function useSectionScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let travelling = false;
    let lastWheelAt = 0;
    let lastWheelAbs = 0;

    const travel = (direction: 1 | -1) => {
      const target = nextStop(direction);
      if (target === null) return;
      const from = window.scrollY;
      const distance = Math.abs(target - from);

      if (reduced.matches) {
        window.scrollTo({ top: target, behavior: "instant" });
        return;
      }

      travelling = true;
      root.classList.add("is-travelling");
      const duration = Math.min(1100, 520 + distance * 0.22);
      const began = performance.now();

      const step = (now: number) => {
        const t = Math.min((now - began) / duration, 1);
        window.scrollTo({ top: from + (target - from) * easeInOut(t), behavior: "instant" });
        if (t < 1) {
          frame = requestAnimationFrame(step);
        } else {
          travelling = false;
          root.classList.remove("is-travelling");
        }
      };
      frame = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || isZoomed()) return;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const dy = e.deltaY * unit;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || inNestedScroller(e.target, dy)) return;

      e.preventDefault();
      const now = performance.now();
      const gap = now - lastWheelAt;
      const previous = lastWheelAbs;
      lastWheelAt = now;
      lastWheelAbs = Math.abs(dy);

      if (travelling || lastWheelAbs < 2) return;
      if (gap > WHEEL_GAP_MS || lastWheelAbs > previous * WHEEL_REACCEL + 4) travel(dy > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest(INTERACTIVE)) return;

      let direction: 1 | -1 | 0 = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown") direction = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") direction = -1;
      else if (e.key === " ") direction = e.shiftKey ? -1 : 1;
      else if (e.key === "Home" || e.key === "End") {
        const stops = stopOffsets();
        const top = e.key === "Home" ? stops[0] : stops[stops.length - 1];
        e.preventDefault();
        if (!travelling && top !== undefined) window.scrollTo({ top, behavior: reduced.matches ? "instant" : "smooth" });
        return;
      }
      if (!direction) return;

      e.preventDefault();
      if (!travelling) travel(direction);
    };

    let touch: { x: number; y: number; at: number; claimed: boolean } | null = null;

    const onTouchStart = (e: TouchEvent) => {
      touch = e.touches.length === 1 && !isZoomed() ? { x: e.touches[0].clientX, y: e.touches[0].clientY, at: performance.now(), claimed: false } : null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touch) return;
      if (e.touches.length !== 1 || isZoomed()) {
        touch = null;
        return;
      }
      const dx = e.touches[0].clientX - touch.x;
      const dy = e.touches[0].clientY - touch.y;
      if (!touch.claimed && Math.max(Math.abs(dx), Math.abs(dy)) > TOUCH_SLOP_PX) {
        if (Math.abs(dy) > Math.abs(dx) && !inNestedScroller(e.target, -dy)) touch.claimed = true;
        else touch = null;
      }
      if (touch?.claimed && e.cancelable) e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const gesture = touch;
      touch = null;
      if (!gesture?.claimed || travelling) return;
      const dy = gesture.y - e.changedTouches[0].clientY;
      const speed = Math.abs(dy) / Math.max(performance.now() - gesture.at, 1);
      if (Math.abs(dy) >= SWIPE_DISTANCE_PX || (Math.abs(dy) >= SWIPE_FLICK_PX && speed >= SWIPE_FLICK_SPEED)) {
        travel(dy > 0 ? 1 : -1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", () => (touch = null), { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("is-travelling");
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);
}
