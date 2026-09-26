"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Button from "@/components/ui/Button";

const SPRING = { type: "spring" as const, stiffness: 120, damping: 20 };
const EMAIL = "right.rishabh@gmail.com";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/var-rishabh" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/var-rishabh" },
];

/**
 * Terminal-styled resume/contact console — closing section of the
 * single-page layout. Copy-to-clipboard has a plain manual fallback for
 * browsers/contexts where the Clipboard API is unavailable.
 */
export default function Contact() {
  const [copied, setCopied] = useState(false);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="contact" className="section-shell py-24 sm:py-32">
      <div className="mb-12 max-w-2xl">
        <span className="font-mono text-xs text-accent">{"// CONTACT"}</span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Let&apos;s build something
        </h2>
        <p className="mt-3 text-sm text-muted sm:text-base">
          Open to impactful roles in AI/ML and backend engineering. Reach out
          directly or pull the ATS-formatted resume below.
        </p>
      </div>

      <SpotlightCard className="p-0">
        <div className="rounded-2xl border-b border-white/10 bg-black/30 px-6 py-3 font-mono text-xs text-muted">
          ~/rishabh-varshney/contact — zsh
        </div>
        <div className="p-6 font-mono text-sm sm:p-8">
          <p className="text-muted">
            <span className="text-accent">$</span> whoami
          </p>
          <p className="mt-1 text-foreground">Rishabh Varshney — Software &amp; AI/ML Engineer</p>

          <p className="mt-5 text-muted">
            <span className="text-accent">$</span> cat contact.json
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="text-foreground">{EMAIL}</span>
            <motion.button
              type="button"
              onClick={handleCopyEmail}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-foreground/80 transition-colors hover:text-accent"
            >
              {copied ? "copied ✓" : "copy"}
            </motion.button>
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-muted transition-colors hover:text-accent"
              >
                {link.label} ↗
              </a>
            ))}
          </div>

          <p className="mt-6 text-muted">
            <span className="text-accent">$</span> ./download-resume --format ats
          </p>
          <div className="mt-3">
            <Button
              href="/resume/rishabh-varshney-resume.pdf"
              variant="primary"
              download
              className="font-mono"
            >
              resume.pdf ↓
            </Button>
          </div>
        </div>
      </SpotlightCard>

      <p className="mt-10 text-center font-mono text-xs text-muted/60">
        © {new Date().getFullYear()} Rishabh Varshney — built with Next.js &amp; Three.js
      </p>
    </section>
  );
}
