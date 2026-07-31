"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

type CursorState = {
  variant: "default" | "focus" | "view";
  label: string | null;
};

const INTERACTIVE = "a, button, [role='button'], input, textarea, [data-cursor]";

/**
 * Two-part cursor: a hard dot that tracks the pointer exactly, and a soft ring
 * that lags behind on a spring. The lag is the whole effect — it reads as
 * weight, and it's what makes hover state changes legible.
 *
 * Renders only for fine pointers with motion enabled. Everything else keeps
 * the native cursor, which is the correct behaviour rather than a fallback.
 */
export function Cursor() {
  const finePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const enabled = finePointer && !reducedMotion;

  const [state, setState] = useState<CursorState>({
    variant: "default",
    label: null,
  });
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 380, damping: 34, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 34, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const hit = target?.closest<HTMLElement>(INTERACTIVE);

      if (!hit) {
        setState((prev) =>
          prev.variant === "default" && prev.label === null
            ? prev
            : { variant: "default", label: null },
        );
        return;
      }

      const label = hit.dataset.cursorLabel ?? null;
      const variant: CursorState["variant"] = label ? "view" : "focus";

      setState((prev) =>
        prev.variant === variant && prev.label === label
          ? prev
          : { variant, label },
      );
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const { variant, label } = state;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 220ms" }}
    >
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-accent"
        style={{ x, y }}
        animate={{
          width: variant === "default" ? 6 : 4,
          height: variant === "default" ? 6 : 4,
          marginLeft: variant === "default" ? -3 : -2,
          marginTop: variant === "default" ? -3 : -2,
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-accent/60 backdrop-blur-[1px]"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: variant === "view" ? 76 : variant === "focus" ? 44 : 28,
          height: variant === "view" ? 76 : variant === "focus" ? 44 : 28,
          marginLeft: variant === "view" ? -38 : variant === "focus" ? -22 : -14,
          marginTop: variant === "view" ? -38 : variant === "focus" ? -22 : -14,
          backgroundColor:
            variant === "default"
              ? "color-mix(in oklab, var(--accent) 0%, transparent)"
              : "color-mix(in oklab, var(--accent) 12%, transparent)",
          borderWidth: variant === "view" ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        {label ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="select-none text-[10px] font-medium uppercase tracking-[0.14em] text-accent"
          >
            {label}
          </motion.span>
        ) : null}
      </motion.div>
    </div>
  );
}
