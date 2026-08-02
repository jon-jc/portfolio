import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Lock } from "lucide-react";

import { SubNav } from "@/components/layout/SubNav";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectPoster } from "@/components/visuals/ProjectPoster";
import { caseStudies } from "@/lib/case-studies";
import { featuredProjects, getProject } from "@/lib/data";
import { site } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: `${project.name} — ${project.tagline}`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${project.slug}`,
      title: `${project.name} — ${project.tagline}`,
      description: project.summary,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  const study = project ? caseStudies[project.slug] : undefined;

  if (!project || !study) notFound();

  // Wrap around, so the last case study still offers somewhere to go.
  const index = featuredProjects.findIndex((item) => item.slug === project.slug);
  const next = featuredProjects[(index + 1) % featuredProjects.length];

  return (
    <>
      <SubNav />

      <main id="main" className="flex-1">
        {/* Header ------------------------------------------------------- */}
        <section className="relative isolate overflow-hidden border-b border-line">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <ProjectPoster
              slug={project.slug}
              tone={project.accent}
              className="absolute inset-0 opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-canvas/70 via-canvas/85 to-canvas" />
          </div>

          <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="label tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-12 bg-line" aria-hidden />
                <span className="label">{project.tagline}</span>
              </div>

              <h1 className="mt-8 text-balance text-[clamp(2.5rem,7vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.038em]">
                {project.name}
              </h1>

              <p className="mt-7 max-w-3xl text-pretty text-lg leading-relaxed text-ink-muted sm:text-xl">
                {study.problem}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-2.5">
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-label="Visit"
                    className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-shadow hover:shadow-[0_0_44px_-6px_var(--glow)]"
                  >
                    {project.liveLabel
                      ? `Open the ${project.liveLabel.toLowerCase()}`
                      : "Open the live site"}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ) : null}

                {project.repo ? (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-label="Code"
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-5 py-3 text-sm font-medium text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
                  >
                    <GithubIcon className="size-4" />
                    Read the source
                  </a>
                ) : null}

                {project.access ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-line px-5 py-3 text-sm text-ink-faint">
                    <Lock className="size-3.5" />
                    {project.access}
                  </span>
                ) : null}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Spec strip ---------------------------------------------------- */}
        <section className="border-b border-line">
          <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px bg-line sm:grid-cols-4">
            {study.facts.map((fact) => (
              <div key={fact.label} className="bg-canvas px-6 py-7 sm:px-8">
                <dt className="label">{fact.label}</dt>
                <dd className="mt-3 font-mono text-2xl font-medium tracking-tight">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          {/* Context ----------------------------------------------------- */}
          <section className="py-20 sm:py-24">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-16">
                <p className="label lg:pt-2">Context</p>
                <div className="space-y-5 text-pretty text-lg leading-relaxed text-ink-muted">
                  {study.context.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>

          {/* Chapters ---------------------------------------------------- */}
          <section className="border-t border-line py-20 sm:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.28fr_0.72fr] lg:gap-16">
              <p className="label lg:pt-2">How it works</p>

              <div className="space-y-14">
                {study.chapters.map((chapter, chapterIndex) => (
                  <Reveal key={chapter.title} delay={chapterIndex * 0.04}>
                    <article>
                      <h2 className="flex items-baseline gap-4 text-xl font-medium tracking-tight sm:text-2xl">
                        <span className="font-mono text-sm text-accent tabular-nums">
                          {String(chapterIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="text-balance">{chapter.title}</span>
                      </h2>
                      <p className="mt-4 text-pretty leading-relaxed text-ink-muted sm:pl-10">
                        {chapter.body}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Architecture ------------------------------------------------ */}
          <section className="border-t border-line py-20 sm:py-24">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-16">
                <p className="label lg:pt-2">Architecture</p>

                <dl className="divide-y divide-line border-y border-line">
                  {study.architecture.map((layer) => (
                    <div
                      key={layer.layer}
                      className="grid gap-2 py-4 sm:grid-cols-[16rem_1fr] sm:gap-6"
                    >
                      <dt className="font-mono text-sm text-ink">{layer.layer}</dt>
                      <dd className="text-pretty text-sm leading-relaxed text-ink-muted">
                        {layer.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </section>

          {/* Decisions --------------------------------------------------- */}
          <section className="border-t border-line py-20 sm:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.28fr_0.72fr] lg:gap-16">
              <div className="lg:pt-2">
                <p className="label">Decisions</p>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-faint">
                  The choices worth defending, and what they cost.
                </p>
              </div>

              <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {study.decisions.map((decision) => (
                  <div key={decision.choice} className="bg-canvas p-7">
                    <h3 className="text-balance font-medium tracking-tight">
                      {decision.choice}
                    </h3>
                    <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-muted">
                      {decision.because}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Verification + stack ---------------------------------------- */}
          <section className="border-t border-line py-20 sm:py-24">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-16">
                <p className="label lg:pt-2">Verification</p>
                <div>
                  <p className="text-pretty text-lg leading-relaxed text-ink-muted">
                    {study.verification}
                  </p>

                  <ul className="mt-10 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-ink-faint"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </section>
        </div>

        {/* Next ---------------------------------------------------------- */}
        <section className="border-t border-line">
          <Link
            href={`/work/${next.slug}`}
            className="group block transition-colors duration-500 hover:bg-surface/50"
          >
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-6 px-6 py-16 sm:px-8 sm:py-20">
              <div>
                <p className="label">Next case study</p>
                <p className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                  {next.name}
                </p>
                <p className="mt-2 text-sm text-ink-muted">{next.tagline}</p>
              </div>
              <ArrowRight className="size-8 text-ink-faint transition-all duration-500 group-hover:translate-x-2 group-hover:text-accent" />
            </div>
          </Link>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-4" />
              Back to all work by {site.name}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
