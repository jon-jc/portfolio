"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

import { usePrefersReducedMotion } from "@/lib/hooks";

type CountUpProps = {
  /** The finished string, e.g. "55%", "3+", "12 s", "28 KB". */
  value: string;
  className?: string;
  /** Seconds for the full count. */
  duration?: number;
};

/** Splits "28 KB" into "", "28", " KB" so only the number animates. */
const PARTS = /^(\D*?)([\d][\d,]*(?:\.\d+)?)(.*)$/;

/**
 * Counts a metric up when it scrolls into view.
 *
 * Only the numeric run animates — prefixes, units and the "+" on "3+" are
 * held constant, so the string never reflows mid-count and a value like
 * "12 s" doesn't briefly read as a different unit.
 *
 * The real value is always in the DOM for assistive tech; the animated copy
 * is `aria-hidden`, matching how TextScramble handles the same problem.
 */
export function CountUp({ value, className, duration = 1.5 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reducedMotion = usePrefersReducedMotion();

  const match = value.match(PARTS);
  const [prefix, digits, suffix] = match
    ? [match[1], match[2], match[3]]
    : ["", "", ""];

  const target = digits ? Number(digits.replace(/,/g, "")) : 0;
  const decimals = digits.split(".")[1]?.length ?? 0;
  const grouped = digits.includes(",");
  // A boolean, not the match array: the array is a fresh object every render,
  // so depending on it restarts the animation on the first frame it paints
  // and the number never leaves zero.
  const animatable = match !== null;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!animatable || !inView || reducedMotion) return;

    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / (duration * 1000));
      // Cubic ease-out: fast enough to feel responsive, settles rather than
      // stopping dead on the final digit.
      setCurrent(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animatable, inView, reducedMotion, target, duration]);

  // Anything the pattern doesn't recognise is printed as-is rather than
  // guessed at.
  if (!match || reducedMotion) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  const shown = current.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });

  return (
    <span ref={ref} className={className}>
      <span aria-hidden>
        {prefix}
        {shown}
        {suffix}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
