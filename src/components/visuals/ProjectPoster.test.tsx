import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProjectPoster } from "@/components/visuals/ProjectPoster";
import { featuredProjects } from "@/lib/data";

/**
 * The posters are generated from a seeded PRNG on both the server and the
 * client. That claim is only true if the generator is order-dependent but not
 * time- or environment-dependent — so the test that matters is that two
 * independent renders produce byte-identical markup. If it ever stops holding,
 * the symptom in production is a hydration mismatch on every project card.
 */
describe("ProjectPoster", () => {
  it("renders identical markup across independent renders", () => {
    for (const project of featuredProjects) {
      const first = renderToStaticMarkup(
        <ProjectPoster slug={project.slug} tone={project.accent} />,
      );
      const second = renderToStaticMarkup(
        <ProjectPoster slug={project.slug} tone={project.accent} />,
      );

      expect(first).toBe(second);
      expect(first.length).toBeGreaterThan(500);
    }
  });

  it("draws a poster for every featured project", () => {
    for (const project of featuredProjects) {
      const markup = renderToStaticMarkup(
        <ProjectPoster slug={project.slug} tone={project.accent} />,
      );
      expect(markup).toContain("<svg");
    }
  });

  it("renders nothing for an unknown slug rather than throwing", () => {
    expect(renderToStaticMarkup(<ProjectPoster slug="nope" />)).toBe("");
  });

  it("emits no NaN or undefined coordinates", () => {
    // A bad arithmetic path shows up as attributes SVG silently ignores.
    for (const project of featuredProjects) {
      const markup = renderToStaticMarkup(
        <ProjectPoster slug={project.slug} tone={project.accent} />,
      );
      expect(markup).not.toContain("NaN");
      expect(markup).not.toContain("undefined");
    }
  });

  it("keeps generated numbers to two decimals", () => {
    // Longer floats are where server and client formatting can diverge.
    const markup = renderToStaticMarkup(<ProjectPoster slug="spillsense" />);
    const overlyPrecise = markup.match(/\d+\.\d{3,}/g);
    expect(overlyPrecise).toBeNull();
  });
});
