import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { experience } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Experience() {
  return (
    <Section
      id="experience"
      index="04"
      eyebrow="Experience"
      title={
        <>
          Three years shipping to people{" "}
          <span className="text-ink-faint">who had to use it on Monday.</span>
        </>
      }
    >
      <ol className="relative">
        {/* The spine. Sits behind the markers and stops at the last one. */}
        <span
          aria-hidden
          className="absolute bottom-8 left-[7px] top-3 w-px bg-gradient-to-b from-accent/50 via-line-hi to-transparent sm:left-[7px]"
        />

        {experience.map((role, index) => (
          <li key={role.company} className="relative pl-8 pb-14 last:pb-0 sm:pl-12">
            <Reveal delay={index * 0.08}>
              <span
                aria-hidden
                className="absolute left-0 top-2.5 grid size-[15px] place-items-center rounded-full border border-line-hi bg-canvas"
              >
                <span className="size-1.5 rounded-full bg-accent" />
              </span>

              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Decorative: the company name sits right beside it, so a
                      screen reader announcing the mark would just repeat it. */}
                  <span className="grid h-11 place-items-center rounded-xl border border-line bg-surface px-4">
                    <Image
                      src={role.logo.src}
                      alt=""
                      aria-hidden
                      width={role.logo.width}
                      height={role.logo.height}
                      className={cn(
                        "h-[18px] w-auto",
                        role.logo.invertOnDark && "logo-invert",
                      )}
                    />
                  </span>

                  <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
                    {role.company}
                  </h3>
                </div>

                <span className="font-mono text-xs tabular-nums text-ink-faint">
                  {role.period}
                </span>
              </div>

              <p className="mt-1.5 text-sm text-ink-muted">
                {role.title}
                <span aria-hidden className="mx-2 text-ink-faint">
                  ·
                </span>
                <span className="text-ink-faint">{role.mode}</span>
              </p>

              <ul className="mt-6 space-y-3.5">
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
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
