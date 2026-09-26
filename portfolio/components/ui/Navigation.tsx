"use client";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

/**
 * Fixed top nav rendered in the DOM overlay layer, above the canvas.
 * Styling intentionally minimal — swap in the final HUD/terminal theme
 * once it's picked.
 */
export default function Navigation() {
  return (
    <nav className="fixed top-0 inset-x-0 flex items-center justify-between px-6 py-4 text-sm font-mono text-foreground">
      <span className="text-accent">rishabh.dev</span>
      <ul className="flex gap-6">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="hover:text-accent transition-colors">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
