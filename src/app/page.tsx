import { ArrowUpRight } from "lucide-react";

import { CommandHint } from "@/components/ui/CommandPalette";
import { Magnetic } from "@/components/ui/Magnetic";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TextScramble } from "@/components/ui/TextScramble";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { featuredProjects, skillGroups } from "@/lib/data";
import { site } from "@/lib/site";

/**
 * Interim harness for the primitives landed in this milestone. Milestone 4
 * replaces it with the real page composition.
 */
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-24">
      <header className="mb-20 flex items-center justify-between gap-4">
        <p className="label">Primitives</p>
        <div className="flex items-center gap-3">
          <CommandHint />
          <ThemeToggle />
        </div>
      </header>

      <Reveal>
        <h1 className="gradient-ink text-6xl font-medium tracking-tight">
          <TextScramble text={site.name} />
        </h1>
        <p className="mt-4 max-w-lg text-pretty text-ink-muted">{site.tagline}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <Magnetic className="inline-block">
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-label="Open"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink"
          >
            GitHub
            <ArrowUpRight className="size-4" />
          </a>
        </Magnetic>
      </Reveal>

      <RevealGroup className="mt-24 grid gap-4 sm:grid-cols-2">
        {featuredProjects.map((project) => (
          <RevealItem key={project.slug}>
            <SpotlightCard tone={project.accent} className="h-full p-6">
              <p className="label">{project.year}</p>
              <h2 className="mt-3 text-xl font-medium">{project.name}</h2>
              <p className="mt-2 text-sm text-ink-muted">{project.tagline}</p>
              <div className="mt-6 flex gap-6">
                {project.metrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="font-mono text-lg text-ink">{metric.value}</p>
                    <p className="text-xs text-ink-faint">{metric.label}</p>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </RevealItem>
        ))}
      </RevealGroup>

      <Marquee className="mt-24" duration={38}>
        {skillGroups.flatMap((group) => group.items).map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="mx-3 whitespace-nowrap rounded-full border border-line px-4 py-2 text-sm text-ink-muted"
          >
            {item}
          </span>
        ))}
      </Marquee>
    </main>
  );
}
