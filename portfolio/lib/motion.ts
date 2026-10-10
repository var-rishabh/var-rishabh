import type { Transition, Variants } from "framer-motion";

/** House spring for every interactive element. */
export const SPRING: Transition = { type: "spring", stiffness: 120, damping: 20 };

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

/** Parent: staggers its children in when the chapter panel comes into view. */
export const revealGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: SPRING },
};

/** Headline lines slide up from behind an overflow mask. */
export const revealLine: Variants = {
  hidden: { y: "108%" },
  visible: { y: "0%", transition: { duration: 1, ease: EXPO_OUT } },
};
