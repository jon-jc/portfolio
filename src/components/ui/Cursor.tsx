"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

type CursorState = {
  variant: "default" | "focus" | "view";
  label: string | null;
};

const INTERACTIVE = "a, button, [role='button'], input, textarea, [data-cursor]";

/**
 * Custom cursor in three parts: a dot that tracks the pointer exactly, a ring
 * that lags behind it on a spring, and a label pill that takes over from both
 * when the thing under the pointer has something to say about itself.
 *
 * The dot is painted with `mix-blend-difference`, so it inverts whatever is
 * behind it. That is what stops it disappearing over a light card or a filled
 * accent button — no theme-aware colour logic, and it stays legible over the
 * project posters, which are the busiest surfaces on the site.
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
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Softer than the dot's exact tracking: the gap between the two is the
  // effect, and it's what makes a state change read as a change.
  const trailX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.55 });
  const trailY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.55 });

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

      // Bail out when nothing changed: pointerover fires for every descendant
      // crossed inside the same control.
      setState((prev) =>
        prev.variant === variant && prev.label === label
          ? prev
          : { variant, label },
      );
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const { variant, label } = state;
  const showLabel = variant === "view" && label !== null;

  const spring = { type: "spring", stiffness: 420, damping: 32, mass: 0.7 } as const;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 220ms" }}
    >
      {/* Ring and pill share the lagged position, so the pill grows out of
          exactly where the ring was rather than arriving from elsewhere. */}
      <motion.div className="absolute left-0 top-0" style={{ x: trailX, y: trailY }}>
        <motion.div
          className="absolute rounded-full border border-accent/55 bg-accent/8"
          animate={{
            width: variant === "focus" ? 46 : 32,
            height: variant === "focus" ? 46 : 32,
            marginLeft: variant === "focus" ? -23 : -16,
            marginTop: variant === "focus" ? -23 : -16,
            opacity: showLabel ? 0 : 1,
            scale: pressed ? 0.82 : 1,
          }}
          transition={spring}
        />

        <AnimatePresence>
          {showLabel ? (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.6, y: 6 }}
              animate={{ opacity: 1, scale: pressed ? 0.94 : 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={spring}
              style={{ transformOrigin: "top left" }}
              // Offset down-right rather than centred on the point: a pill
              // sitting on the pointer covers the very thing it is labelling.
              // The translate is the element's own; the parent owns the
              // transform, so the two never fight over one property.
              className="absolute translate-x-4 translate-y-4 whitespace-nowrap rounded-full bg-accent px-3.5 py-2 text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-accent-ink shadow-[0_8px_30px_-8px_var(--glow)]"
            >
              {label}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {/* The dot. Inverts its background, so it never needs a theme. */}
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-white mix-blend-difference"
        style={{ x, y }}
        animate={{
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          // Stays put while a label is up — it is the thing marking the
          // actual point the offset pill is describing.
          scale: pressed ? 0.55 : variant === "focus" ? 0.5 : 1,
        }}
        transition={spring}
      />
    </div>
  );
}
