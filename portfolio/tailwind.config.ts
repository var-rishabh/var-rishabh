import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "var(--color-void)",
        chrome: "var(--color-chrome)",
        silver: "var(--color-silver)",
        graphite: "var(--color-graphite)",
        amber: "var(--color-amber)",
        titanium: "var(--color-titanium)",
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
