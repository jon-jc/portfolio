"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown, Lock } from "lucide-react";

import { GithubIcon } from "@/components/ui/BrandIcons";
import { CountUp } from "@/components/ui/CountUp";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ProjectPoster } from "@/components/visuals/ProjectPoster";
import type { Project } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  index: number;
};

/**
 * A featured project.
 *
 * The card leads with the poster and one sentence; the engineering detail sits
 * behind a disclosure. That ordering is deliberate — a recruiter scanning four
 * cards gets four clean summaries, and an engineer who wants to know how the
 * imports stay idempotent can open the notes without leaving the page.
 *
 * Layout alternates side to side on wide screens; the poster is always first
 * in the DOM, and only the visual order swaps, so reading order stays stable.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const notesId = useId();

  const flipped = index % 2 === 1;

  return (
    <SpotlightCard tone={project.accent} className="rounded-2xl">
      <article className="grid lg:grid-cols-2">
        <div
          className={cn(
            // A ratio rather than a height while stacked: a fixed height on a
            // full-width panel makes the slice crop scale with the viewport,
            // and at tablet widths it eats most of the poster.
            "relative aspect-[5/2] overflow-hidden border-line max-lg:border-b lg:aspect-auto lg:min-h-[18rem]",
            flipped ? "lg:order-2 lg:border-l" : "lg:border-r",
          )}
        >
          <div className="absolute inset-0 bg-canvas-deep/40" />
          <ProjectPoster
            slug={project.slug}
            tone={project.accent}
            className="absolute inset-0 opacity-90 transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <span className="font-mono text-xs tabular-nums text-ink-faint">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-xs tabular-nums text-ink-faint">
              {project.year}
            </span>
          </div>

          {/* Softens the poster into the card rather than cutting it off. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface/70 to-transparent" />
        </div>

        <div className="flex flex-col p-5 sm:p-7">
          <p className="label">{project.tagline}</p>

          <h3 className="mt-3 text-xl font-medium tracking-tight sm:text-2xl">
            {project.name}
          </h3>

          <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-muted">
            {project.summary}
          </p>

          <dl className="mt-5 grid grid-cols-3 gap-4 border-y border-line py-4">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <CountUp
                    value={metric.value}
                    className="block font-mono text-lg font-medium tracking-tight text-ink"
                  />
                  <span className="mt-1.5 block text-[11px] leading-tight text-ink-faint">
                    {metric.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls={notesId}
              className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              Engineering notes
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-300",
                  open && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  id={notesId}
                  key="notes"
                  initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2 size-1 shrink-0 rounded-full bg-accent"
                        />
                        <span className="text-pretty">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-faint"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            <Link
              href={`/work/${project.slug}`}
              className="group/case inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-shadow hover:shadow-[0_0_36px_-8px_var(--glow)]"
            >
              Case study
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/case:translate-x-0.5" />
            </Link>

            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="Visit"
                className="group/link inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
              >
                {project.liveLabel ?? "Live site"}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </a>
            ) : null}

            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="Code"
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
              >
                <GithubIcon className="size-4" />
                Source
              </a>
            ) : null}

            {/* Said plainly rather than left as a missing button, so nobody
                goes looking for a repository that isn't public. */}
            {project.access ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-line px-5 py-2.5 text-sm text-ink-faint">
                <Lock className="size-3.5" />
                {project.access}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}
