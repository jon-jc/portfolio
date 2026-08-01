import { ArrowUp } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { site } from "@/lib/site";

const built = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "Motion",
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-2xl italic tracking-tight">
              {site.name}
            </p>
            <p className="mt-2 max-w-sm text-pretty text-sm text-ink-faint">
              {site.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { href: site.links.github, label: "GitHub", Icon: GithubIcon },
              { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-line text-ink-faint transition-colors hover:border-line-hi hover:text-ink"
              >
                <Icon className="size-4" />
              </a>
            ))}
            <a
              href="#top"
              aria-label="Back to top"
              className="grid size-10 place-items-center rounded-full border border-line text-ink-faint transition-colors hover:border-line-hi hover:text-ink"
            >
              <ArrowUp className="size-4" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Source on{" "}
            <a
              href={`${site.links.github}/portfolio`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              GitHub
            </a>
            .
          </p>
          <p className="font-mono">{built.join(" · ")}</p>
        </div>
      </div>
    </footer>
  );
}
