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
}: {
  links: NavLink[];
  right?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="site-container flex items-center justify-between py-6 md:py-8">
      <Link
        href="/"
        className="font-sans text-sm tracking-wide text-neutral-900 transition hover:opacity-60 dark:text-neutral-100"
      >
        taskflow
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        {links.map((link) =>
          link.href ? (
            <Link
              key={link.label}
              href={link.href}
              className={`nav-link ${link.active ? "nav-link-active" : ""}`}
            >
              {link.label}
            </Link>
          ) : (
            <button
              key={link.label}
              type="button"
              onClick={link.onClick}
              className={`nav-link ${link.active ? "nav-link-active" : ""}`}
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
          className="text-neutral-900 dark:text-neutral-100"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[4.5rem] z-50 border-b border-neutral-200 bg-[#f5f5f5] px-6 py-6 dark:border-neutral-800 dark:bg-neutral-950 md:hidden">
          <div className="flex flex-col gap-5">
            {links.map((link) =>
              link.href ? (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`nav-link text-left ${link.active ? "nav-link-active" : ""}`}
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
                  className={`nav-link text-left ${link.active ? "nav-link-active" : ""}`}
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
