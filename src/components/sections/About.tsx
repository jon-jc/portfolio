import { GraduationCap, Users } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { education } from "@/lib/data";

/** What I optimise for, stated plainly enough to be checked against the code. */
const principles = [
  {
    title: "Correctness at the boundary",
    body: "Constraints belong in the database, not in a comment. Natural keys, restricted deletes and indexes matched to the query paths that actually run.",
  },
  {
    title: "Failures you can read",
    body: "A rejected row keeps its raw line and every reason it failed. An import that half-worked should be obvious, re-runnable and auditable.",
  },
  {
    title: "One filter, every panel",
    body: "Interfaces are where the data model gets judged. If a filter changes the map but not the chart, the model leaked.",
  },
  {
    title: "Tests on the invariants",
    body: "Integration tests against real migrations, contract tests in CI. Cover what breaks silently, not what breaks loudly.",
  },
];

export function About() {
  return (
    <Section
      id="about"
      index="03"
      eyebrow="About"
      title={
        <>
          I like the part of the job where the data model{" "}
          <span className="text-ink-faint">meets a real person.</span>
        </>
      }
    >
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <Reveal>
          <div className="space-y-5 text-pretty leading-relaxed text-ink-muted">
            <p>
              I&apos;m a software engineer in Lacey, Washington. For three years
              I built React and TypeScript applications end to end for two small
              companies — the storefronts customers bought from, and the internal
              dashboards the people running those companies made decisions in.
              The second half of that work is the part that stuck with me.
            </p>
            <p>
              A dashboard is only as honest as the schema underneath it. So the
              projects I&apos;ve built since have started further down: designing
              the relational model, writing the ETL that fills it, keeping
              imports idempotent and their failures auditable, then exposing the
              whole thing through an API with filters composable enough that the
              map, the charts and the table can never disagree.
            </p>
            <p>
              Right now I&apos;m aiming at data and AI platform work — the systems
              that make information trustworthy before anyone builds on top of
              it. Outside that: guitar, which is how ChordLab happened, and
              Tokyo&apos;s rail network, which is how the other two did.
            </p>
          </div>

          <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {principles.map((principle) => (
              <div key={principle.title} className="bg-canvas p-6">
                <dt className="text-sm font-medium tracking-tight text-ink">
                  {principle.title}
                </dt>
                <dd className="mt-2.5 text-pretty text-sm leading-relaxed text-ink-muted">
                  {principle.body}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-line bg-surface/50 p-7">
            <div className="flex items-center gap-3">
              <GraduationCap className="size-4 text-accent" />
              <p className="label">Education</p>
            </div>

            <p className="mt-6 text-lg font-medium tracking-tight">
              {education.degree}
            </p>
            <p className="mt-1.5 text-sm text-ink-muted">{education.school}</p>

            <div className="mt-6 flex items-center gap-4 font-mono text-xs text-ink-faint">
              <span>{education.period}</span>
              <span aria-hidden className="h-3 w-px bg-line-hi" />
              <span>GPA {education.gpa}</span>
            </div>

            <div className="mt-7 border-t border-line pt-6">
              <p className="label">Coursework</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {education.coursework.map((course) => (
                  <li
                    key={course}
                    className="rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-muted"
                  >
                    {course}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 border-t border-line pt-6">
              <p className="label">Activity</p>
              <div className="mt-4 flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-accent"
                >
                  <Users className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">
                    {education.activity.role}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-ink-muted">
                    {education.activity.org}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
