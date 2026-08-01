import { Marquee } from "@/components/ui/Marquee";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { skillGroups } from "@/lib/data";

/** The marquee band — one flat pass of the things I reach for most. */
const band = [
  "TypeScript",
  "React",
  "Next.js",
  "C#",
  "ASP.NET Core",
  "PostgreSQL",
  "EF Core",
  "SQL Server",
  "Prisma",
  "Three.js",
  "Tailwind CSS",
  "Node.js",
  "Docker",
  "Vitest",
  "GitHub Actions",
  "OpenAPI",
  "Python",
  "Web Audio API",
];

export function Stack() {
  return (
    <Section
      id="stack"
      index="05"
      eyebrow="Stack"
      title={
        <>
          The tools, roughly in the order{" "}
          <span className="text-ink-faint">I reach for them.</span>
        </>
      }
      lede="Listed by how often they show up in something I shipped, not by how good they'd look on a keyword scan."
    >
      <RevealGroup className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-2">
        {skillGroups.map((group) => (
          <RevealItem key={group.title} className="bg-canvas">
            <div className="h-full p-7 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-base font-medium tracking-tight">
                  {group.title}
                </h3>
                <span className="font-mono text-[11px] text-ink-faint">
                  {group.hint}
                </span>
              </div>

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line bg-surface/50 px-3 py-1.5 text-[13px] text-ink-muted transition-colors hover:border-accent/40 hover:text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Marquee className="mt-10 py-2" duration={46}>
        {band.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="mx-4 whitespace-nowrap font-mono text-sm text-ink-faint"
          >
            {item}
            <span aria-hidden className="ml-4 text-line-hi">
              /
            </span>
          </span>
        ))}
      </Marquee>
    </Section>
  );
}
