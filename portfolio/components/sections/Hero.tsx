"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import StatusPill from "@/components/ui/StatusPill";

const SPRING = { type: "spring" as const, stiffness: 120, damping: 20 };

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: SPRING },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="section-shell flex min-h-screen flex-col justify-center pt-32 pb-24"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-3xl"
      >
        <motion.div variants={item}>
          <StatusPill>
            STATUS: AVAILABLE FOR IMPACTFUL ROLES // LOC: HYDERABAD / REMOTE
          </StatusPill>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
        >
          <span className="text-gradient">Rishabh Varshney</span>
          <br />
          Software &amp; AI/ML Engineer
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          I build systems end to end — from low-latency backend pipelines and
          scalable service architectures to transformer-based ML models and
          the full-stack products that put them in front of users.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
          <Button href="#projects" variant="primary">
            Explore Work
          </Button>
          <Button
            href="/resume/rishabh-varshney-resume.pdf"
            variant="secondary"
            download
          >
            View ATS Resume
          </Button>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-8 flex items-center gap-5 font-mono text-xs text-muted"
        >
          <a
            href="https://github.com/var-rishabh"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-accent transition-colors"
          >
            github.com/var-rishabh
          </a>
          <span className="text-white/15">/</span>
          <a
            href="https://www.linkedin.com/in/var-rishabh"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-accent transition-colors"
          >
            linkedin.com/in/var-rishabh
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
