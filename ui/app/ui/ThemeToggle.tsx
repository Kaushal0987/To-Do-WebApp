"use client";

import { useTheme } from "../lib/ThemeProvider";

export default function ThemeToggle({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { theme, toggleTheme } = useTheme();
  const ghostClass = variant === "dark" ? "btn-ghost-dark" : "btn-ghost-light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn-ghost ${ghostClass}`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "dark" : "light"}
    </button>
  );
}
