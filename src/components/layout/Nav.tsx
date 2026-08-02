"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

import { CommandHint } from "@/components/ui/CommandPalette";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useActiveSection, useScrollLock } from "@/lib/hooks";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const sectionIds = navItems.map((item) => item.id);

/**
 * Sticky navigation.
 *
 * Two behaviours worth naming: the bar only grows a background once the page
 * has actually scrolled (so the hero reads full-bleed), and the active link is
 * marked by a single shared pill that animates between items via `layoutId`
 * rather than six independent highlights fading in and out.
 */
export function Nav() {
  const active = useActiveSection(sectionIds);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useScrollLock(menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A resize into desktop layout would otherwise leave the mobile sheet open
  // and body scroll locked. Escape closes it, the way any dialog should.
  useEffect(() => {
    if (!menuOpen) return;

    const media = window.matchMedia("(min-width: 768px)");
    const close = () => setMenuOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    media.addEventListener("change", close);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      media.removeEventListener("change", close);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-line bg-canvas/72 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 sm:h-18 sm:px-8"
        >
          <a
            href="#top"
            className="group flex items-center gap-2.5 rounded-full"
            aria-label={`${site.name} — back to top`}
          >
            <span className="grid size-8 place-items-center rounded-full border border-line bg-surface font-mono text-[11px] font-medium tracking-tight text-ink transition-colors group-hover:border-accent group-hover:text-accent">
              {site.initials}
            </span>
            <span className="hidden whitespace-nowrap text-sm font-medium tracking-tight sm:block">
              {site.name}
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  // "location" rather than "page": these are positions within
                  // the current document, not separate pages.
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300",
                    isActive ? "text-ink" : "text-ink-faint hover:text-ink-muted",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-line bg-surface"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <CommandHint />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="grid size-9 place-items-center rounded-full border border-line bg-surface/60 text-ink-muted transition-colors hover:text-ink md:hidden"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[70] bg-canvas/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-16 items-center justify-end px-6">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                autoFocus
                className="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <nav aria-label="Mobile" className="px-6 pt-6">
              <ul className="flex flex-col">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + index * 0.045, duration: 0.4 }}
                    className="border-b border-line"
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-baseline justify-between py-5 text-2xl font-medium tracking-tight"
                    >
                      {item.label}
                      <span className="label tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
