"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

type NavLink = {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
};

export default function Nav({
  links,
  right,
  variant = "light",
}: {
  links: NavLink[];
  right?: React.ReactNode;
  variant?: "dark" | "light";
}) {
  const [open, setOpen] = useState(false);
  const isDark = variant === "dark";

  const linkBase = isDark ? "nav-link-dark" : "nav-link-light";
  const linkActive = isDark ? "nav-link-dark-active" : "nav-link-light-active";
  const logoClass = isDark
    ? "text-white hover:opacity-70"
    : "text-brand-black hover:opacity-70";
  const menuIconClass = isDark ? "text-white" : "text-brand-black";
  const mobileMenuBg = isDark
    ? "border-white/10 bg-brand-black"
    : "border-brand-black/10 bg-brand-cream";

  return (
    <nav className="site-container flex items-center justify-between py-6 md:py-8">
      <Link
        href="/"
        className={`font-sans text-sm font-medium tracking-wide transition ${logoClass}`}
      >
        taskflow
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        {links.map((link) =>
          link.href ? (
            <Link
              key={link.label}
              href={link.href}
              className={`nav-link ${linkBase} ${link.active ? linkActive : ""}`}
            >
              {link.label}
            </Link>
          ) : (
            <button
              key={link.label}
              type="button"
              onClick={link.onClick}
              className={`nav-link ${linkBase} ${link.active ? linkActive : ""}`}
            >
              {link.label}
            </button>
          ),
        )}
        {right}
      </div>

      <div className="flex items-center gap-4 md:hidden">
        {right}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={menuIconClass}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div
          className={`absolute left-0 right-0 top-[4.5rem] z-50 border-b px-6 py-6 md:hidden ${mobileMenuBg}`}
        >
          <div className="flex flex-col gap-5">
            {links.map((link) =>
              link.href ? (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`nav-link text-left ${linkBase} ${link.active ? linkActive : ""}`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    link.onClick?.();
                    setOpen(false);
                  }}
                  className={`nav-link text-left ${linkBase} ${link.active ? linkActive : ""}`}
                >
                  {link.label}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
