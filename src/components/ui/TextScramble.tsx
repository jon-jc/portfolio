"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

import { usePrefersReducedMotion } from "@/lib/hooks";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*#%$";

type TextScrambleProps = {
  text: string;
  className?: string;
  /** Frames each character stays scrambled before locking, on average. */
  speed?: number;
  delay?: number;
};

/**
 * Resolves text out of noise when it scrolls into view.
 *
 * Characters lock left to right on a per-character schedule, so the word
 * assembles rather than all settling at once. Whitespace is never scrambled —
 * that keeps the line's shape stable and stops layout from jittering.
 *
 * The animation is decorative: with reduced motion the final text renders
 * immediately, and the real string is always in the DOM for screen readers.
 *
 * Renders a span so the ref type stays honest — nest it inside whatever
 * heading the section actually calls for.
 */
export function TextScramble({
  text,
  className,
  speed = 1.6,
  delay = 0,
}: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reducedMotion = usePrefersReducedMotion();

  // Empty until the animation runs. The static case is handled at render time
  // rather than by seeding state from an effect.
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!inView || reducedMotion) return;

    let frame = 0;
    let raf = 0;

    // Each character gets a window [start, end) during which it shows noise.
    const schedule = Array.from(text, (_, index) => {
      const start = index * speed;
      return { start, end: start + speed * 3 + Math.random() * speed * 4 };
    });

    const tick = () => {
      let settled = 0;

      const output = Array.from(text, (char, index) => {
        if (char === " ") return " ";

        const { start, end } = schedule[index];
        if (frame >= end) {
          settled += 1;
          return char;
        }
        if (frame < start) return "";

        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join("");

      setDisplay(output);

      if (settled === text.replace(/ /g, "").length) return;

      frame += 1;
      raf = requestAnimationFrame(tick);
    };

    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [inView, reducedMotion, text, speed, delay]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden>{reducedMotion ? text : display}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
