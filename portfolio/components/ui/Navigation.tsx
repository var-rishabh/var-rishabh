"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#projects", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

const SPRING = { type: "spring" as const, stiffness: 120, damping: 20 };

/**
 * Fixed floating glassmorphic navbar. Tracks the section currently in
 * view via IntersectionObserver and animates a shared-layout pill behind
 * the active link.
 */
export default function Navigation() {
  const [active, setActive] = useState("#hero");

  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.querySelector(link.href),
    ).filter((el): el is Element => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActive(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0.1, 0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...SPRING, delay: 0.2 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <div className="glass-panel flex items-center gap-1 rounded-full p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <span className="hidden pl-3 pr-1 font-mono text-xs text-accent sm:inline">
          rishabh.dev
        </span>
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-background" : "text-foreground/80 hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={SPRING}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
