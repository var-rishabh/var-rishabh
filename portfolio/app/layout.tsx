import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rishabh Varshney — Interactive Portfolio",
  description:
    "3D interactive developer portfolio built with Next.js, React Three Fiber, and Drei.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
