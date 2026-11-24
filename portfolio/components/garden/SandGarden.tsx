"use client";

import { useEffect, useRef, useState } from "react";
import { CHAPTERS, CONTACT } from "@/data/chapters";
import { GARDEN_LEDE, STONES } from "@/data/garden";
import styles from "./SandGarden.module.css";

const NAV = [
  { label: "Work", href: `#${CHAPTERS[1].id}` },
  { label: "Projects", href: `#${CHAPTERS[3].id}` },
  { label: "Contact", href: `#${CHAPTERS[4].id}` },
];

/**
 * Hero: five stones for five companies in raked basalt sand. Move (or drag
 * on touch) to rake; hover a stone to read its headline figure.
 */
export default function SandGarden() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tagsRef = useRef<HTMLSpanElement[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    import("./garden").then(({ mountGarden }) => {
      if (cancelled) return;
      try {
        cleanup = mountGarden(canvas, STONES, tagsRef.current, () => setReady(true));
      } catch {
        setReady(true); // no WebGL: copy still shows on the plain ground
      }
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section className={`${styles.garden} ${ready ? styles.ready : ""}`} aria-labelledby="garden-title">
      <nav className={styles.bar} aria-label="Sections">
        <a className={styles.mark} href="#">RV</a>
        <ul className={styles.links}>
          {NAV.map((n) => (
            <li key={n.label}><a href={n.href}>{n.label}</a></li>
          ))}
        </ul>
      </nav>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
      <div className={styles.copy}>
        <h1 id="garden-title" className={styles.title}>Rishabh<br />Varshney</h1>
        <p className={styles.lede}>{GARDEN_LEDE}</p>
        <div className={styles.cta}>
          <a className={styles.primary} href={`#${CHAPTERS[1].id}`}>See the work</a>
          <a className={styles.secondary} href={CONTACT.resume} target="_blank" rel="noreferrer">Resume</a>
        </div>
      </div>
      {STONES.map((s, i) => (
        <span key={s.company} className={styles.tag} ref={(el) => { if (el) tagsRef.current[i] = el; }}>
          <b>{s.company}</b>{s.years}<i>{s.fact}</i>
        </span>
      ))}
    </section>
  );
}
