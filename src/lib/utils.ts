import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Fractional position of `value` within [from, to], clamped to 0–1. */
export function progress(value: number, from: number, to: number) {
  if (to === from) return 0;
  return clamp((value - from) / (to - from), 0, 1);
}

/**
 * Subsequence match, the same rule editors use for fuzzy file search:
 * every character of `query` must appear in `text`, in order.
 * Returns a score (lower is better) or null when there is no match.
 */
export function fuzzyScore(text: string, query: string): number | null {
  if (!query) return 0;

  const haystack = text.toLowerCase();
  const needle = query.toLowerCase();

  let score = 0;
  let cursor = 0;
  let lastHit = -1;

  for (const char of needle) {
    const hit = haystack.indexOf(char, cursor);
    if (hit === -1) return null;

    // Gaps between matched characters cost; consecutive hits are free.
    if (lastHit !== -1) score += hit - lastHit - 1;
    // Matches at a word boundary are worth more than matches mid-word.
    if (hit === 0 || /[\s\-_/.]/.test(haystack[hit - 1])) score -= 3;

    lastHit = hit;
    cursor = hit + 1;
  }

  return score + (haystack.length - needle.length) * 0.05;
}
