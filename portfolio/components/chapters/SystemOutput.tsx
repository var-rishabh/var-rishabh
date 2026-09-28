"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Chapter from "@/components/hud/Chapter";
import { ChapterTag, Headline } from "@/components/hud/Typography";
import { CONTACT } from "@/data/chapters";
import { copyText } from "@/lib/clipboard";
import { revealItem, SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ConsoleCommand {
  id: string;
  command: string;
  output: string;
  copy?: string;
  href: string;
  download?: boolean;
  actionLabel: string;
}

const COMMANDS: ConsoleCommand[] = [
  {
    id: "resume",
    command: "./export --resume --format=ats",
    output: "rishabh-varshney-resume.pdf",
    href: CONTACT.resume,
    download: true,
    actionLabel: "Download ↓",
  },
  {
    id: "email",
    command: "contact --email",
    output: CONTACT.email,
    copy: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    actionLabel: "Mail ↗",
  },
  {
    id: "github",
    command: "contact --github",
    output: "github.com/var-rishabh",
    copy: CONTACT.github,
    href: CONTACT.github,
    actionLabel: "Open ↗",
  },
  {
    id: "linkedin",
    command: "contact --linkedin",
    output: "linkedin.com/in/rishabh-builds",
    copy: CONTACT.linkedin,
    href: CONTACT.linkedin,
    actionLabel: "Open ↗",
  },
];

function ConsoleAction({ className, ...props }: React.ComponentProps<typeof motion.a>) {
  return (
    <motion.a
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING}
      className={cn("border border-line px-2 py-1 text-telemetry uppercase text-chrome transition-colors hover:border-amber/60 hover:text-amber", className)}
      {...props}
    />
  );
}

function OutputConsole() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleCopy(entry: ConsoleCommand) {
    if (!entry.copy) return;
    const ok = await copyText(entry.copy);
    if (!ok) return;
    setCopied(entry.id);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1800);
  }

  return (
    <motion.div variants={revealItem} className="panel corner-marks mt-7">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-telemetry uppercase text-graphite">
        <span>rishabh@machine-room: ~/output</span>
        <span aria-hidden className="flex gap-1.5">
          <i className="h-1.5 w-1.5 bg-graphite/60" />
          <i className="h-1.5 w-1.5 bg-graphite/60" />
          <i className="h-1.5 w-1.5 bg-amber" />
        </span>
      </div>

      <ul className="space-y-4 p-4 text-[12.5px] sm:p-5">
        {COMMANDS.map((entry) => (
          <li key={entry.id}>
            <p className="text-graphite">
              <span className="text-amber">$</span> {entry.command}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="break-all text-chrome">
                <span aria-hidden className="text-titanium">→ </span>
                {entry.output}
              </span>
              <span className="flex gap-2">
                {entry.copy && (
                  <motion.button
                    type="button"
                    onClick={() => handleCopy(entry)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    transition={SPRING}
                    aria-label={`Copy ${entry.id}`}
                    className={cn(
                      "border px-2 py-1 text-telemetry uppercase transition-colors",
                      copied === entry.id
                        ? "border-amber text-amber"
                        : "border-line text-chrome hover:border-amber/60 hover:text-amber",
                    )}
                  >
                    {copied === entry.id ? "Copied ✓" : "Copy"}
                  </motion.button>
                )}
                <ConsoleAction
                  href={entry.href}
                  download={entry.download || undefined}
                  target={entry.download || entry.id === "email" ? undefined : "_blank"}
                  rel={entry.download || entry.id === "email" ? undefined : "noreferrer noopener"}
                  className={entry.download ? "border-amber bg-amber text-void hover:bg-[#ffb066] hover:text-void" : undefined}
                >
                  {entry.actionLabel}
                </ConsoleAction>
              </span>
            </div>
          </li>
        ))}
        <li className="text-silver">
          <span className="text-amber">$</span> <span className="animate-blink text-amber">▮</span>
        </li>
      </ul>
      <p aria-live="polite" className="sr-only">
        {copied ? `${copied} copied to clipboard` : ""}
      </p>
    </motion.div>
  );
}

/** Chapter 04 — the output gate opens: resume export + contact commands. */
export default function SystemOutput() {
  return (
    <Chapter index={3}>
      <div className="scrim w-full max-w-2xl">
        <ChapterTag index={3} aside="EXIT CODE 0" />
        <Headline id="output-title" lines={["System", "Ready."]} className="mt-4" />
        <OutputConsole />
        <motion.p variants={revealItem} className="mt-5 text-telemetry uppercase text-graphite">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Rishabh Varshney {"//"} Procedural
          R3F — zero external 3D assets
        </motion.p>
      </div>
    </Chapter>
  );
}
