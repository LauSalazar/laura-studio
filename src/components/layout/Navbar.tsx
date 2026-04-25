"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const links = [
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
      <Link
        href="/"
        className="font-display font-light text-sm tracking-widest uppercase text-ink-muted hover:text-ink transition-colors"
      >
        Laura
      </Link>

      <ul className="flex items-center gap-8">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={clsx(
                "font-body text-sm transition-colors",
                pathname === href
                  ? "text-ink"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
