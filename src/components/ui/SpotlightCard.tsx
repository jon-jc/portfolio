"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** Tint of the spotlight and the lit border. */
  tone?: "accent" | "iris" | "flare";
};

const tones = {
  accent: "var(--accent)",
  iris: "var(--iris)",
  flare: "var(--flare)",
} as const;

/**
 * Card whose border and interior light up around the pointer.
 *
 * Position is written to CSS custom properties on pointermove and consumed by
 * two gradient layers, so the effect costs no React renders — the only work
 * per frame is two `style.setProperty` calls on an element already in the
 * compositor.
 */
export function SpotlightCard({
  children,
  className,
  tone = "accent",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || frame.current) return;

    const { clientX, clientY } = event;

    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      node.style.setProperty("--mx", `${clientX - rect.left}px`);
      node.style.setProperty("--my", `${clientY - rect.top}px`);
      node.style.setProperty("--spot", "1");
    });
  };

  const handleLeave = () => {
    ref.current?.style.setProperty("--spot", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={
        {
          "--tone": tones[tone],
          "--spot": "0",
          "--mx": "50%",
          "--my": "50%",
        } as React.CSSProperties
      }
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-line bg-surface/60",
        "transition-colors duration-500 hover:border-line-hi",
        className,
      )}
    >
      {/* Lit border: a gradient ring masked to the 1px edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-[var(--spot)] transition-opacity duration-500"
        style={{
          background: `radial-gradient(340px circle at var(--mx) var(--my), color-mix(in oklab, var(--tone) 55%, transparent), transparent 70%)`,
          padding: 1,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Interior wash. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[var(--spot)] transition-opacity duration-500"
        style={{
          background: `radial-gradient(420px circle at var(--mx) var(--my), color-mix(in oklab, var(--tone) 9%, transparent), transparent 65%)`,
        }}
      />

      <div className="relative">{children}</div>
    </div>
  );
}
