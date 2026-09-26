import { cn } from "@/lib/utils";

interface StatusPillProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Monospace metadata pill — used for the hero availability status and
 * project tag labels, per the terminal/HUD styling language.
 */
export default function StatusPill({ children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-accent",
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      {children}
    </span>
  );
}
