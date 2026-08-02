"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CountUp } from "@/components/ui/CountUp";
import { featuredProjects, stats, type HeadlineStat } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Micro-visuals for the headline stats.
 *
 * Each one is a different shape on purpose: three identical bar charts would
 * imply the three numbers are the same kind of measurement, and they aren't —
 * a duration, a delta, and a count.
 */
function StatVisual({ visual, fill }: Pick<HeadlineStat, "visual" | "fill">) {
  if (visual === "ring") {
    const radius = 15;
    const circumference = 2 * Math.PI * radius;

    return (
      <svg viewBox="0 0 36 36" className="size-9" aria-hidden>
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="var(--line-hi)"
          strokeWidth="2.5"
        />
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fill)}
          transform="rotate(-90 18 18)"
        />
      </svg>
    );
  }

  if (visual === "bars") {
    // A rising series, with the last bar carrying the lift.
    const heights = [0.32, 0.4, 0.36, 0.52, 1];

    return (
      <svg viewBox="0 0 36 36" className="size-9" aria-hidden>
        {heights.map((height, index) => (
          <rect
            key={index}
            x={index * 7.4 + 1}
            y={34 - height * 28}
            width="5"
            height={height * 28}
            rx="1.5"
            fill="var(--accent)"
            fillOpacity={index === heights.length - 1 ? 1 : 0.28}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 36 36" className="size-9" aria-hidden>
      {Array.from({ length: 6 }, (_, index) => (
        <rect
          key={index}
          x={(index % 3) * 12 + 3}
          y={Math.floor(index / 3) * 12 + 6}
          width="9"
          height="9"
          rx="2"
          fill="var(--accent)"
          // Five of six filled: the sixth is the space the next one goes in.
          fillOpacity={index < 5 * fill ? 0.9 : 0.16}
        />
      ))}
    </svg>
  );
}

/**
 * The panel that has to do the convincing in the first screen.
 *
 * Three claims with their provenance attached, then the systems behind the
 * third claim as links — so a recruiter who wants to check the number is one
 * click from the thing itself rather than scrolling to find it.
 */
export function ProofPanel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface/40 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <p className="label">Track record</p>
        <p className="font-mono text-[11px] text-ink-faint">2022 — now</p>
      </div>

      <dl className="divide-y divide-line">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group flex items-start gap-4 px-5 py-4 transition-colors duration-500 hover:bg-surface/60"
          >
            <span className="mt-0.5 shrink-0 opacity-80 transition-opacity duration-500 group-hover:opacity-100">
              <StatVisual visual={stat.visual} fill={stat.fill} />
            </span>

            <div className="min-w-0">
              <dd className="font-mono text-2xl font-medium leading-none tracking-tight text-ink">
                <CountUp value={stat.value} />
              </dd>
              <dt className="mt-2 text-sm font-medium leading-snug text-ink">
                {stat.label}
              </dt>
              <p className="mt-1 text-pretty text-xs leading-relaxed text-ink-faint">
                {stat.detail}
              </p>
            </div>
          </div>
        ))}
      </dl>

      <div className="border-t border-line px-5 py-4">
        <p className="label">The five</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {featuredProjects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/work/${project.slug}`}
                className="group/chip inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-muted transition-colors hover:border-accent/40 hover:text-ink"
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    project.accent === "iris" && "bg-iris",
                    project.accent === "flare" && "bg-flare",
                    project.accent === "accent" && "bg-accent",
                  )}
                />
                {project.name}
                <ArrowUpRight className="size-3 text-ink-faint transition-transform duration-300 group-hover/chip:-translate-y-0.5 group-hover/chip:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
