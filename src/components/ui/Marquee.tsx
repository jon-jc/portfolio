"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  /** Seconds for one full pass. */
  duration?: number;
  reverse?: boolean;
};

/**
 * Seamless horizontal scroll. The track holds two identical copies and
 * translates by exactly -50%, so the loop point is invisible.
 *
 * With reduced motion it becomes a normal horizontally scrollable strip
 * rather than a frozen one, so the content stays reachable.
 */
export function Marquee({
  children,
  className,
  duration = 42,
  reverse = false,
}: MarqueeProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return (
      <div className={cn("mask-fade-x overflow-x-auto", className)}>
        <div className="flex w-max items-center">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn("mask-fade-x group relative overflow-hidden", className)}
      aria-hidden
    >
      <div
        className="flex w-max animate-[marquee_var(--duration)_linear_infinite] items-center group-hover:[animation-play-state:paused]"
        style={
          {
            "--duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {children}
        {children}
      </div>
    </div>
  );
}
