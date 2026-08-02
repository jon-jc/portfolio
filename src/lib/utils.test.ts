import { describe, expect, it } from "vitest";

import { clamp, fuzzyScore, progress } from "@/lib/utils";

describe("clamp", () => {
  it("passes values inside the range through untouched", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to each bound", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
  });
});

describe("progress", () => {
  it("maps a value onto 0–1 within the range", () => {
    expect(progress(5, 0, 10)).toBe(0.5);
    expect(progress(0, 0, 10)).toBe(0);
    expect(progress(10, 0, 10)).toBe(1);
  });

  it("clamps outside the range rather than extrapolating", () => {
    expect(progress(-5, 0, 10)).toBe(0);
    expect(progress(15, 0, 10)).toBe(1);
  });

  it("returns 0 for a zero-width range instead of dividing by zero", () => {
    expect(progress(5, 5, 5)).toBe(0);
  });
});

describe("fuzzyScore", () => {
  it("treats an empty query as a match on everything", () => {
    expect(fuzzyScore("SpillSense", "")).toBe(0);
  });

  it("matches a subsequence, not just a substring", () => {
    expect(fuzzyScore("SpillSense", "sps")).not.toBeNull();
    expect(fuzzyScore("Tokyo Move-in Cost Calculator", "tmc")).not.toBeNull();
  });

  it("rejects characters that appear out of order", () => {
    expect(fuzzyScore("SpillSense", "esp")).toBeNull();
    expect(fuzzyScore("ChordLab", "z")).toBeNull();
  });

  it("is case insensitive in both directions", () => {
    expect(fuzzyScore("ChordLab", "CHORD")).not.toBeNull();
    expect(fuzzyScore("CHORDLAB", "chord")).not.toBeNull();
  });

  it("scores consecutive matches better than scattered ones", () => {
    const consecutive = fuzzyScore("chord finder", "chord");
    const scattered = fuzzyScore("chord finder", "cdn");

    expect(consecutive).not.toBeNull();
    expect(scattered).not.toBeNull();
    expect(consecutive!).toBeLessThan(scattered!);
  });

  it("rewards matches that land on word boundaries", () => {
    // Same length and the same gap between the two hits, so the boundary
    // bonus is the only thing that differs. Comparing strings that also
    // differ in gap just measures the gap penalty instead.
    const boundary = fuzzyScore("chord lab", "cl");
    const midWord = fuzzyScore("chordxlab", "cl");

    expect(boundary).not.toBeNull();
    expect(midWord).not.toBeNull();
    expect(boundary!).toBeLessThan(midWord!);
  });

  it("ranks a shorter haystack ahead of a longer one for the same query", () => {
    const short = fuzzyScore("lab", "lab");
    const long = fuzzyScore("laboratory equipment", "lab");

    expect(short!).toBeLessThan(long!);
  });
});
