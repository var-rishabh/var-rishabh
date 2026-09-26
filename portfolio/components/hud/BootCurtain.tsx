"use client";

import { AnimatePresence, motion } from "framer-motion";

/**
 * Covers the first frames while WebGL compiles shaders. Lifts when the
 * canvas reports ready (or on the page's timeout fallback); a CSS
 * animation also fades it out after a few seconds so content can never
 * stay hidden if JavaScript fails.
 */
export default function BootCurtain({ ready }: { ready: boolean }) {
  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="boot-curtain"
          aria-hidden
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] } }}
          className="boot-curtain fixed inset-0 z-50 grid place-items-center bg-void"
        >
          <div className="w-60 text-telemetry uppercase text-graphite">
            <div className="flex justify-between">
              <span className="text-silver">Machine Room</span>
              <span className="animate-blink text-amber">▮</span>
            </div>
            <div className="mt-3 h-px w-full overflow-hidden bg-line">
              <motion.div
                className="h-full origin-left bg-amber"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className="mt-3">Initializing procedural systems</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
