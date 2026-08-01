"use client";

import { motion, useScroll, useSpring } from "motion/react";

import { usePrefersReducedMotion } from "@/lib/hooks";

/** Hairline read-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = usePrefersReducedMotion();

  // Spring the raw progress so trackpad momentum doesn't make it twitch.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reducedMotion ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-px origin-left bg-gradient-to-r from-accent to-flare"
    />
  );
}
