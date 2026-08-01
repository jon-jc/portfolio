"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type RotatingTextProps = {
  items: readonly string[];
  /** Milliseconds each word holds before the next one takes over. */
  interval?: number;
  className?: string;
  /**
   * Applied to the word itself rather than the wrapper. Anything that paints
   * text — a clipped gradient, a colour — belongs here, because the wrapper
   * is only a sizing box.
   */
  wordClassName?: string;
};

/**
 * Cycles through a list of words in place.
 *
 * The widest word is rendered once, invisible, to reserve the inline box —
 * without it the line reflows on every swap and the text after it jitters.
 * Under reduced motion the first item is simply printed.
 */
export function RotatingText({
  items,
  interval = 2600,
  className,
  wordClassName,
}: RotatingTextProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || items.length < 2) return;

    const id = setInterval(
      () => setIndex((current) => (current + 1) % items.length),
      interval,
    );
    return () => clearInterval(id);
  }, [items.length, interval, reducedMotion]);

  if (reducedMotion) {
    return <span className={cn(className, wordClassName)}>{items[0]}</span>;
  }

  return (
    // Width simply follows the current word. Reserving the longest word leaves
    // a hole at headline scale, and animating the width lets the box lag
    // behind its contents and collide with whatever follows — so callers put
    // this at the end of a line instead, where reflow costs nothing.
    //
    // The padding/margin pair gives descenders room inside the clip.
    <span
      className={cn(
        "relative -mb-[0.16em] block overflow-hidden pb-[0.16em]",
        className,
      )}
    >
      {/* A non-breaking space holds exactly one line of height. The words
          themselves are positioned out of flow, so the box never resizes —
          neither when a longer word arrives, nor during the frame between an
          exit finishing and the next entrance starting. */}
      <span aria-hidden className="invisible block select-none">
        &nbsp;
      </span>

      {/* `wait` rather than `popLayout`: with two children briefly in flow the
          incoming word is laid out *after* the outgoing one and visibly starts
          from the wrong place. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={items[index]}
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-70%", opacity: 0 }}
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "absolute inset-x-0 top-0 block whitespace-nowrap",
            wordClassName,
          )}
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
