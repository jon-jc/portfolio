import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

import { SubNav } from "@/components/layout/SubNav";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { PrintButton } from "@/components/ui/PrintButton";
import {
  education,
  experience,
  featuredProjects,
  skillGroups,
} from "@/lib/data";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${site.name} — ${site.role.toLowerCase()} working across React, TypeScript, .NET and relational data systems.`,
  alternates: { canonical: "/resume" },
};

/**
 * The resume as a page rather than a file.
 *
 * A linked PDF goes stale the moment anything else on the site changes; this
 * renders from the same content the rest of the site reads, and the print
 * stylesheet in `globals.css` turns it into a clean single document via the
 * browser's own Save as PDF.
 */
export default function ResumePage() {
  return (
    <>
      <div className="print:hidden">
        <SubNav backLabel="Home" />
      </div>

      <main id="main" className="flex-1 print:block">
        <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8 sm:py-20 print:max-w-none print:px-0 print:py-0">
          {/* Header ---------------------------------------------------- */}
          <header className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-medium tracking-tight sm:text-5xl print:text-3xl">
                {site.name}
              </h1>
              <p className="mt-2 text-ink-muted">{site.role}</p>
            </div>

            <PrintButton />
          </header>

          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-line py-4 text-sm text-ink-muted">
            <li className="inline-flex items-center gap-2">
              <MapPin className="size-3.5 text-ink-faint" />
              {site.location}
            </li>
            <li className="inline-flex items-center gap-2">
              <Phone className="size-3.5 text-ink-faint" />
              {site.phone}
            </li>
            <li>
              <a
                href={site.links.email}
                className="inline-flex items-center gap-2 transition-colors hover:text-accent"
              >
                <Mail className="size-3.5 text-ink-faint" />
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-accent"
              >
                <GithubIcon className="size-3.5 text-ink-faint" />
                github.com/jon-jc
              </a>
            </li>
            <li>
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-accent"
              >
                <LinkedinIcon className="size-3.5 text-ink-faint" />
                linkedin.com/in/jon-jc
              </a>
            </li>
          </ul>

          <ResumeSection title="Summary">
            <p className="text-pretty leading-relaxed text-ink-muted">
              {site.description} Experienced with SQL, validated ETL pipelines
              and structured enterprise datasets; looking to grow into data and
              AI platform work.
            </p>
          </ResumeSection>

          <ResumeSection title="Technical skills">
            <dl className="space-y-3">
              {skillGroups.map((group) => (
                <div
                  key={group.title}
                  className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4"
                >
                  <dt className="text-sm font-medium text-ink">{group.title}</dt>
                  <dd className="text-sm leading-relaxed text-ink-muted">
                    {group.items.join(", ")}
                  </dd>
                </div>
              ))}
            </dl>
          </ResumeSection>

          <ResumeSection title="Professional experience">
            <div className="space-y-8">
              {experience.map((role) => (
                <article key={role.company} className="break-inside-avoid">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 place-items-center rounded-lg border border-line bg-surface px-3 print:hidden">
                        <Image
                          src={role.logo.src}
                          alt=""
                          aria-hidden
                          width={role.logo.width}
                          height={role.logo.height}
                          className={cn(
                            "h-3 w-auto",
                            role.logo.invertOnDark && "logo-invert",
                          )}
                        />
                      </span>
                      <h3 className="font-medium tracking-tight">
                        {role.company}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-ink-faint">
                      {role.period}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-ink-muted">
                    {role.title} · {role.mode}
                  </p>

                  <ul className="mt-3 space-y-2">
                    {role.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-2.5 text-sm leading-relaxed text-ink-muted"
                      >
                        <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-ink-faint" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Projects">
            <div className="space-y-6">
              {featuredProjects.map((project) => (
                <article key={project.slug} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-medium tracking-tight">
                      {project.name}
                      <span className="ml-3 font-normal text-ink-faint">
                        {project.stack.slice(0, 5).join(", ")}
                      </span>
                    </h3>
                    <span className="font-mono text-xs text-ink-faint">
                      {(project.live ?? project.repo)?.replace("https://", "")}
                    </span>
                  </div>

                  <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-muted">
                    {project.summary}
                  </p>
                </article>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Education">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-medium tracking-tight">{education.degree}</h3>
              <span className="font-mono text-xs text-ink-faint">
                {education.period}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-muted">{education.school}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              GPA {education.gpa} · Coursework:{" "}
              {education.coursework.join(", ")} · {education.extra}
            </p>
          </ResumeSection>
        </div>
      </main>
    </>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 break-inside-avoid">
      <h2 className="label border-b border-line pb-3">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
