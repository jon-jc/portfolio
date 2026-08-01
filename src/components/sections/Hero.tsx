"use client";

import { useEffect } from "react";
import { ArrowDown, FileText } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { RotatingText } from "@/components/ui/RotatingText";
import { TextScramble } from "@/components/ui/TextScramble";
import { stats } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { site } from "@/lib/site";

const disciplines = [
  "data systems",
  "GIS dashboards",
  "ETL pipelines",
  "REST APIs",
  "3D interfaces",
  "audio engines",
] as const;

/**
 * Ambient backdrop: a hairline grid, three tinted blooms, and a parallax that
 * tracks the pointer.
 *
 * The parallax reads the pointer at the window level and drives springs, so
 * the blooms drift a beat behind the cursor instead of snapping to it. All of
 * it is decorative and disabled outright under reduced motion.
 */
function Aurora() {
  const reducedMotion = usePrefersReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springX = useSpring(pointerX, { stiffness: 42, damping: 22, mass: 1.2 });
  const springY = useSpring(pointerY, { stiffness: 42, damping: 22, mass: 1.2 });

  const driftX = useTransform(springX, [-1, 1], [-34, 34]);
  const driftY = useTransform(springY, [-1, 1], [-22, 22]);
  const counterX = useTransform(springX, [-1, 1], [26, -26]);
  const counterY = useTransform(springY, [-1, 1], [18, -18]);

  useEffect(() => {
    if (reducedMotion) return;

    const onMove = (event: PointerEvent) => {
      // Normalised to [-1, 1] so the transforms below stay resolution-agnostic.
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerX, pointerY, reducedMotion]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Grid, faded out toward the edges so it never meets a hard border. */}
      <div className="grid-lines absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_38%,black,transparent)]" />

      <motion.div
        style={reducedMotion ? undefined : { x: driftX, y: driftY }}
        className="absolute -left-24 -top-24 size-[42rem] rounded-full opacity-60 blur-[110px]"
      >
        <div className="size-full rounded-full bg-[radial-gradient(circle_at_center,var(--accent),transparent_66%)] opacity-25" />
      </motion.div>

      <motion.div
        style={reducedMotion ? undefined : { x: counterX, y: counterY }}
        className="absolute -right-32 top-8 size-[38rem] rounded-full opacity-60 blur-[120px]"
      >
        <div className="size-full rounded-full bg-[radial-gradient(circle_at_center,var(--iris),transparent_66%)] opacity-30" />
      </motion.div>

      <motion.div
        style={reducedMotion ? undefined : { x: driftY, y: counterX }}
        className="absolute bottom-[-10rem] left-1/3 size-[34rem] rounded-full opacity-50 blur-[130px]"
      >
        <div className="size-full rounded-full bg-[radial-gradient(circle_at_center,var(--flare),transparent_68%)] opacity-20" />
      </motion.div>

      {/* Hands the eye off to the next section instead of ending abruptly. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-32"
    >
      <Aurora />

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <Reveal>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
              <span className="relative grid size-1.5 place-items-center">
                <span className="absolute size-1.5 rounded-full bg-accent motion-safe:animate-[pulse-ring_2.6s_var(--ease-out-quart)_infinite]" />
                <span className="size-1.5 rounded-full bg-accent" />
              </span>
              {site.availability}
            </span>
            <span className="label">
              {site.role} · {site.location}
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          {/* The name is a wordmark, not the message — it sits one step above
              body copy so the line underneath can carry the actual claim. */}
          <h1 className="mt-7 text-[clamp(1.75rem,3.4vw,2.5rem)] font-medium tracking-[-0.02em]">
            <span className="text-ink">
              <TextScramble text="Jonathan" speed={1.4} />
            </span>{" "}
            <span className="font-display font-normal italic text-ink-muted">
              <TextScramble text="Cho" speed={1.8} delay={0.14} />
            </span>
          </h1>
        </Reveal>

        <div className="mt-6 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <Reveal delay={0.14}>
            <p className="max-w-2xl text-[clamp(2.25rem,5.4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.038em]">
              <span className="block">I build</span>
              {/* The rotating word gets a line of its own. It can't wrap — the
                  animation needs a single unbroken run — so sharing a line
                  means it gets clipped the moment the viewport narrows. */}
              <RotatingText
                items={disciplines}
                // The gradient has to land on the moving word itself: a
                // background-clipped wrapper only paints its own text, and
                // children would inherit the transparent colour and vanish.
                wordClassName="gradient-accent"
              />
              <span className="block text-ink-muted">— end to end.</span>
            </p>
            <p className="mt-7 max-w-xl text-pretty leading-relaxed text-ink-muted">
              {site.description} Three years of it in production, most recently
              across two e-commerce platforms and the dashboards their teams ran
              on.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href="#work"
                  data-cursor-label="Scroll"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-shadow hover:shadow-[0_0_44px_-6px_var(--glow)]"
                >
                  See the work
                  <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </Magnetic>

              <Magnetic>
                <a
                  href="/resume"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-5 py-3 text-sm font-medium text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
                >
                  <FileText className="size-4" />
                  Résumé
                </a>
              </Magnetic>

              <div className="flex items-center gap-2">
                {[
                  { href: site.links.github, label: "GitHub", Icon: GithubIcon },
                  { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
                ].map(({ href, label, Icon }) => (
                  <Magnetic key={label} radius={70}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      data-cursor-label="Open"
                      className="grid size-11 place-items-center rounded-full border border-line bg-surface/60 text-ink-faint transition-colors hover:border-line-hi hover:text-ink"
                    >
                      <Icon className="size-[18px]" />
                    </a>
                  </Magnetic>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-canvas/70 p-5 backdrop-blur-sm">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-mono text-2xl font-medium tracking-tight text-ink sm:text-3xl">
                      {stat.value}
                    </span>
                    <span className="mt-2 block text-xs leading-snug text-ink-faint">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="mx-auto mt-16 w-full max-w-6xl px-6 sm:px-8"
      >
        <div className="flex items-center gap-3">
          <span className="label">Scroll</span>
          <span className="h-px w-16 bg-gradient-to-r from-line-hi to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
