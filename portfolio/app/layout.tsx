import type { Metadata, Viewport } from "next";
import { Syne } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-display", display: "swap" });

const description =
  "Rishabh Varshney, software engineer in Hyderabad: real-time calling, cloud and AI systems across 10+ fields. Five years of work as one interactive sculpture.";

export const metadata: Metadata = {
  title: "Rishabh Varshney, Software Engineer",
  description,
  authors: [{ name: "Rishabh Varshney", url: "https://github.com/var-rishabh" }],
  openGraph: { title: "Rishabh Varshney, Software Engineer", description, type: "website" },
};

export const viewport: Viewport = { themeColor: "#050506", colorScheme: "dark" };

// Hides reveal targets before first paint, only when JS runs and motion is welcome.
// If the app bundle never boots, the class is removed after 3 s so content always shows.
const revealScript = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var r=document.documentElement;r.classList.add('anim');setTimeout(function(){if(!window.__ready)r.classList.remove('anim')},3000)}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${GeistSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
