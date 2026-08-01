import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CommandHint } from "@/components/ui/CommandPalette";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { site } from "@/lib/site";

/**
 * Header for pages that aren't the home page.
 *
 * The main nav marks the active section as you scroll, which has no meaning
 * once you've left the single-page scroll — so subpages get a header whose
 * job is just "go back", and whose links point at absolute anchors on the
 * home route rather than fragments that don't exist here.
 */
export function SubNav({ backLabel = "All work" }: { backLabel?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/72 backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 sm:px-8"
      >
        <Link
          href="/#work"
          className="group inline-flex items-center gap-2.5 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <span className="grid size-8 place-items-center rounded-full border border-line bg-surface transition-colors group-hover:border-accent">
            <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </span>
          {backLabel}
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden text-sm font-medium tracking-tight transition-colors hover:text-accent sm:block"
          >
            {site.name}
          </Link>
          <CommandHint />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
