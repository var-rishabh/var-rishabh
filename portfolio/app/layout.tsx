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
  title: "Rishabh Varshney — Systems & AI Engineer",
  description:
    "The Machine Room: a procedurally generated WebGL portfolio. Explore Rishabh Varshney's AI/ML systems, backend infrastructure and full-stack work by descending through a working machine.",
  authors: [{ name: "Rishabh Varshney", url: "https://github.com/var-rishabh" }],
  openGraph: {
    title: "Rishabh Varshney — Systems & AI Engineer",
    description: "Descend through the Machine Room: AI/ML, backend systems and full-stack engineering.",
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
