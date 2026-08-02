import { describe, expect, it } from "vitest";

import { caseStudies } from "@/lib/case-studies";
import {
  education,
  experience,
  featuredProjects,
  getProject,
  sideProjects,
  skillGroups,
  stats,
} from "@/lib/data";
import { navItems, site } from "@/lib/site";

/**
 * The content layer feeds the page, the routes, the sitemap, the palette and
 * the OG images. Nothing here fails loudly at runtime — a project without a
 * case study renders a 404 from a link the site published itself, and a
 * mistyped URL is a dead link nobody notices. These are the invariants worth
 * pinning down.
 */

describe("featured projects", () => {
  it("has unique slugs", () => {
    const slugs = featuredProjects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("resolves every slug through getProject", () => {
    for (const project of featuredProjects) {
      expect(getProject(project.slug)?.name).toBe(project.name);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProject("not-a-project")).toBeUndefined();
  });

  it("points every live and repo link at https", () => {
    for (const project of featuredProjects) {
      if (project.repo) {
        expect(project.repo.startsWith("https://github.com/")).toBe(true);
      }
      if (project.live) expect(project.live.startsWith("https://")).toBe(true);
    }
  });

  it("explains itself when there is no public repository", () => {
    // A card with no source button and no reason reads as an oversight.
    for (const project of featuredProjects) {
      if (!project.repo) expect(project.access?.length).toBeGreaterThan(10);
    }
  });

  it("carries exactly three metrics per card", () => {
    // The card lays them out in a three-column grid; a fourth silently wraps.
    for (const project of featuredProjects) {
      expect(project.metrics).toHaveLength(3);
    }
  });

  it("gives every project a non-empty summary, stack and highlights", () => {
    for (const project of featuredProjects) {
      expect(project.summary.length).toBeGreaterThan(40);
      expect(project.stack.length).toBeGreaterThan(0);
      expect(project.highlights.length).toBeGreaterThan(0);
    }
  });
});

describe("case studies", () => {
  it("covers every featured project", () => {
    for (const project of featuredProjects) {
      expect(caseStudies[project.slug]).toBeDefined();
    }
  });

  it("has no orphans without a project behind them", () => {
    for (const slug of Object.keys(caseStudies)) {
      expect(getProject(slug)).toBeDefined();
    }
  });

  it("supplies the four facts the spec strip and OG card expect", () => {
    // The strip is a four-column grid and the OG card takes the first three.
    for (const study of Object.values(caseStudies)) {
      expect(study.facts).toHaveLength(4);
    }
  });

  it("has a problem statement, context, chapters, decisions and verification", () => {
    for (const study of Object.values(caseStudies)) {
      expect(study.problem.length).toBeGreaterThan(40);
      expect(study.context.length).toBeGreaterThan(0);
      expect(study.chapters.length).toBeGreaterThan(2);
      expect(study.decisions.length).toBeGreaterThan(1);
      expect(study.verification.length).toBeGreaterThan(40);
    }
  });

  it("gives every decision a reason", () => {
    // A decision without a "because" is a technology list entry.
    for (const study of Object.values(caseStudies)) {
      for (const decision of study.decisions) {
        expect(decision.because.length).toBeGreaterThan(30);
      }
    }
  });
});

describe("site metadata", () => {
  it("has no trailing slash on the canonical URL", () => {
    // Metadata, the sitemap and JSON-LD all concatenate onto it.
    expect(site.url.endsWith("/")).toBe(false);
    expect(site.url.startsWith("https://")).toBe(true);
  });

  it("keeps the mailto link and the displayed address in sync", () => {
    expect(site.links.email).toBe(`mailto:${site.email}`);
  });

  it("has unique nav ids", () => {
    const ids = navItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("resume content", () => {
  it("lists experience newest first", () => {
    const years = experience.map((role) => Number(role.start));
    expect([...years].sort((a, b) => b - a)).toEqual(years);
  });

  it("gives every role a logo with real dimensions", () => {
    for (const role of experience) {
      expect(role.logo.src.startsWith("/logos/")).toBe(true);
      expect(role.logo.width).toBeGreaterThan(0);
      expect(role.logo.height).toBeGreaterThan(0);
    }
  });

  it("has bullets on every role", () => {
    for (const role of experience) {
      expect(role.bullets.length).toBeGreaterThan(0);
    }
  });

  it("has three headline stats and non-empty skill groups", () => {
    expect(stats).toHaveLength(3);
    for (const group of skillGroups) {
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("records coursework for the degree", () => {
    expect(education.coursework.length).toBeGreaterThan(0);
  });
});

describe("side projects", () => {
  it("always has a repository, and https links when live", () => {
    for (const project of sideProjects) {
      expect(project.repo.startsWith("https://github.com/")).toBe(true);
      if (project.live) expect(project.live.startsWith("https://")).toBe(true);
    }
  });
});
