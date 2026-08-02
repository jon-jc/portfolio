import { ArrowUpRight } from "lucide-react";

import { GithubIcon } from "@/components/ui/BrandIcons";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { sideProjects } from "@/lib/data";

export function Lab() {
  return (
    <Section
      id="lab"
      index="04"
      eyebrow="The lab"
      title={
        <>
          Smaller things, built to learn{" "}
          <span className="text-ink-faint">something specific.</span>
        </>
      }
      lede="Audio plugins, storefronts, a game engine detour. Not everything needs to be a platform — some of these exist because the problem was interesting."
    >
      <RevealGroup className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {sideProjects.map((project) => (
          <RevealItem key={project.name} className="bg-canvas">
            <div className="group relative flex h-full flex-col p-6 transition-colors duration-500 hover:bg-surface/70">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-medium tracking-tight">
                  {project.name}
                </h3>
                <span className="mt-0.5 flex items-center gap-2 text-ink-faint">
                  {project.live ? (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} — live site`}
                      data-cursor-label="Visit"
                      className="transition-colors hover:text-accent"
                    >
                      <ArrowUpRight className="size-4" />
                    </a>
                  ) : null}
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.name} — source`}
                    data-cursor-label="Code"
                    className="transition-colors hover:text-accent"
                  >
                    <GithubIcon className="size-4" />
                  </a>
                </span>
              </div>

              <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-ink-muted">
                {project.blurb}
              </p>

              <p className="mt-5 font-mono text-[11px] text-ink-faint">
                {project.stack}
              </p>

              {/* Lit rule that fills on hover — the whole cell's hover state. */}
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-transparent transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
              />
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
