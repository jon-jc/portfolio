import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SubNav } from "@/components/layout/SubNav";
import { featuredProjects } from "@/lib/data";

export default function NotFound() {
  return (
    <>
      <SubNav backLabel="Home" />

      <main id="main" className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
          <p className="label">404</p>

          <h1 className="mt-8 text-balance text-[clamp(2.5rem,7vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.038em]">
            That page doesn&apos;t exist.
          </h1>

          <p className="mt-6 max-w-lg text-pretty leading-relaxed text-ink-muted">
            Nothing lives at this address. The work is all one scroll away —
            or jump straight into a case study.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="group flex items-center justify-between gap-4 bg-canvas p-6 transition-colors hover:bg-surface/60"
              >
                <span>
                  <span className="block font-medium tracking-tight">
                    {project.name}
                  </span>
                  <span className="mt-1 block text-sm text-ink-faint">
                    {project.tagline}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-ink-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
