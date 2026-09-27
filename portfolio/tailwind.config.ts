import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Literal hex (mirrors the CSS vars in globals.css) so opacity modifiers
      // like `bg-void/90` or `text-silver/85` work — Tailwind can't apply
      // alpha to a plain `var(--…)` colour and silently drops those classes.
      colors: {
        void: "#050505",
        chrome: "#eceef0",
        silver: "#bfc3c9",
        graphite: "#7b8087",
        amber: "#ff9a3c",
        titanium: "#86a9d9",
        line: "var(--color-line)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        mega: ["clamp(2.25rem, min(8.2vw, 13.5vh), 8.5rem)", { lineHeight: "0.86", letterSpacing: "-0.03em" }],
        giga: ["clamp(2rem, min(4.6vw, 8.5vh), 4.75rem)", { lineHeight: "0.88", letterSpacing: "-0.025em" }],
        telemetry: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.14em" }],
      },
      screens: {
        short: { raw: "(max-height: 820px)" },
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "scan-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        blink: "blink 1.1s steps(1) infinite",
        "scan-down": "scan-down 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
