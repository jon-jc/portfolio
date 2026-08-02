import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { experience } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Roles as cards rather than a timeline.
 *
 * Two roles do not need a spine to be read in order, and the markers were
 * competing with the company marks sitting right beside them. The card gives
 * each role its own frame and lets the logo run at a size where it is actually
 * recognisable.
 */
export function Experience() {
  return (
    <Section
      id="experience"
      index="01"
      eyebrow="Experience"
      title={
        <>
          Three years shipping to people{" "}
          <span className="text-ink-faint">who had to use it on Monday.</span>
        </>
      }
    >
      <ol className="flex flex-col gap-5 sm:gap-6">
        {experience.map((role, index) => (
          <li key={role.company}>
            <Reveal delay={index * 0.08}>
              <article className="rounded-2xl border border-line bg-surface/40 p-6 transition-colors duration-500 hover:border-line-hi sm:p-8">
                <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
                  <div className="flex items-center gap-4 sm:gap-5">
                    {/* Decorative: the company name sits right beside it, so a
                        screen reader announcing the mark would just repeat it.
                        Fixed tile so both marks share a baseline despite very
                        different aspect ratios. */}
                    <span className="grid h-16 w-[8.5rem] shrink-0 place-items-center rounded-xl border border-line bg-canvas px-4">
                      <Image
                        src={role.logo.src}
                        alt=""
                        aria-hidden
                        width={role.logo.width}
                        height={role.logo.height}
                        className={cn(
                          "max-h-7 w-auto max-w-[7rem] object-contain",
                          role.logo.invertOnDark && "logo-invert",
                        )}
                      />
                    </span>

                    <div>
                      <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
                        {role.company}
                      </h3>
                      <p className="mt-1 text-sm text-ink-muted">
                        {role.title}
                        <span aria-hidden className="mx-2 text-ink-faint">
                          ·
                        </span>
                        <span className="text-ink-faint">{role.mode}</span>
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-xs tabular-nums text-ink-faint">
                    {role.period}
                  </span>
                </header>

                <ul className="mt-7 space-y-3.5 border-t border-line pt-6">
                  {role.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-pretty leading-relaxed text-ink-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-2.5 size-1 shrink-0 rounded-full bg-line-hi"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {role.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-faint"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
