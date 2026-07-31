"use client";

import { Moon, Sun } from "lucide-react";

import { setTheme, useMounted, useTheme } from "@/lib/hooks";

/**
 * Reads the theme the pre-paint script already applied rather than deciding
 * again, so the icon always matches what's on screen — including when the
 * command palette is what changed it.
 */
export function ThemeToggle() {
  const mounted = useMounted();
  const theme = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="grid size-9 place-items-center rounded-full border border-line bg-surface/60 text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
    >
      {/* The server can't know the resolved theme, so render no icon until
          mounted — a wrong icon on first paint is worse than none. */}
      {mounted ? (
        theme === "light" ? (
          <Moon className="size-4" />
        ) : (
          <Sun className="size-4" />
        )
      ) : (
        <span className="size-4" />
      )}
    </button>
  );
}
