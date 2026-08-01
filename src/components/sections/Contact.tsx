"use client";

import { ArrowUpRight, Check, Copy, MapPin } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useCopy } from "@/lib/hooks";
import { site } from "@/lib/site";

export function Contact() {
  const { copied, copy } = useCopy();

  return (
    <Section
      id="contact"
      index="06"
      eyebrow="Contact"
      title={
        <>
          Hiring for data, platform or product engineering?{" "}
          <span className="text-ink-faint">Let&apos;s talk.</span>
        </>
      }
      lede="Open to full-time roles and contract work. The fastest way to reach me is email — I answer everything."
    >
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/50 p-8 sm:p-12">
          {/* One bloom, anchored to the corner the eye exits through. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[radial-gradient(circle_at_center,var(--accent),transparent_65%)] opacity-[0.14] blur-3xl"
          />

          <div className="relative">
            <a
              href={site.links.email}
              data-cursor-label="Email"
              className="group inline-block text-balance text-2xl font-medium tracking-tight transition-colors hover:text-accent sm:text-4xl"
            >
              {site.email}
              <span
                aria-hidden
                className="mt-2 block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
              />
            </a>

            <div className="mt-9 flex flex-wrap items-center gap-2.5">
              <Magnetic>
                <a
                  href={site.links.email}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-shadow hover:shadow-[0_0_44px_-6px_var(--glow)]"
                >
                  Send an email
                  <ArrowUpRight className="size-4" />
                </a>
              </Magnetic>

              <button
                type="button"
                onClick={() => copy(site.email)}
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
              >
                {copied ? (
                  <Check className="size-4 text-accent" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? "Copied" : "Copy address"}
              </button>

              {[
                { href: site.links.github, label: "GitHub", Icon: GithubIcon },
                { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-label="Open"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
                >
                  <Icon className="size-4" />
                  {label}
                </a>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-8 text-sm text-ink-faint">
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-3.5" />
                {site.location} — open to remote
              </span>
              <span className="font-mono">{site.phone}</span>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
