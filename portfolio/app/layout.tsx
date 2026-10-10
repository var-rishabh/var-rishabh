import type { Metadata, Viewport } from "next";
import { Syne } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rishabh Varshney — Software Engineer · Full-Stack, Cloud & Real-time",
  description:
    "The Machine Room: a procedurally generated WebGL portfolio. Descend through a working machine to explore Rishabh Varshney's cloud telephony, real-time and AI work across 8 fields.",
  authors: [{ name: "Rishabh Varshney", url: "https://github.com/var-rishabh" }],
  openGraph: {
    title: "Rishabh Varshney — Software Engineer · Full-Stack, Cloud & Real-time",
    description: "Descend through the Machine Room: cloud telephony, EV charging, fintech and more — 8 fields, one engineer.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${GeistMono.variable}`}>
      <body className="bg-void font-mono text-silver antialiased">{children}</body>
    </html>
  );
}
