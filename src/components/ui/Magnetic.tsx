"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { usePrefersReducedMotion } from "@/lib/hooks";

type MagneticProps = {
  children: ReactNode;
  /** How far the element travels toward the pointer, as a fraction of offset. */
  strength?: number;
  /** Pointer distance in px at which the pull starts. */
  radius?: number;
  className?: string;
};

/**
 * Pulls its child toward the pointer as the pointer approaches, then springs
 * back on leave. Falls off with distance so the element doesn't snap when the
 * cursor enters the hit area.
 */
export function Magnetic({
  children,
  strength = 0.38,
  radius = 120,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);

    // Linear falloff to zero at the radius edge.
    const falloff = Math.max(0, 1 - distance / (radius + rect.width / 2));

    x.set(dx * strength * falloff);
    y.set(dy * strength * falloff);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reducedMotion ? undefined : { x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
