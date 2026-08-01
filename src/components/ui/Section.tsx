import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  /** Two-digit index rendered in the rule beside the eyebrow. */
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * The shell every section shares: consistent rhythm, one heading structure,
 * and a numbered rule that gives the page a spine to read down.
 *
 * `id` doubles as the scroll target used by the nav, the command palette and
 * `useActiveSection`, so the section owns its anchor rather than a wrapper.
 */
export function Section({
  id,
  index,
  eyebrow,
  title,
  lede,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      // Offset the anchor so a section never lands under the sticky nav.
      className={cn("scroll-mt-24 py-24 sm:py-32", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="label tabular-nums">{index}</span>
            <span className="h-px flex-1 bg-line" aria-hidden />
            <span className="label">{eyebrow}</span>
          </div>

          <h2 className="mt-8 max-w-3xl text-balance text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h2>

          {lede ? (
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
              {lede}
            </p>
          ) : null}
        </Reveal>

        <div className="mt-14 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}
