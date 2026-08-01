import { ImageResponse } from "next/og";

import { caseStudies } from "@/lib/case-studies";
import { featuredProjects, getProject } from "@/lib/data";
import { site } from "@/lib/site";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }));
}

/** Per-project share card, keyed to the project's own accent. */
const tones: Record<string, string> = {
  accent: "240,178,90",
  iris: "126,158,214",
  flare: "214,124,86",
};

export default async function CaseStudyImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  const study = project ? caseStudies[project.slug] : undefined;

  if (!project || !study) {
    return new ImageResponse(<div style={{ background: "#141210" }} />, size);
  }

  const tone = tones[project.accent] ?? tones.accent;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#141210",
          padding: 72,
          fontFamily: "sans-serif",
          color: "#f7f4f1",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -160,
            width: 700,
            height: 700,
            borderRadius: 999,
            background: `radial-gradient(circle at center, rgba(${tone},0.30), rgba(${tone},0) 65%)`,
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#a49c95",
          }}
        >
          {project.tagline}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 600,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            {project.name}
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 32,
              lineHeight: 1.3,
              color: "#c2bab3",
              maxWidth: 940,
            }}
          >
            {study.problem}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 44 }}>
            {study.facts.slice(0, 3).map((fact) => (
              <div
                key={fact.label}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 600,
                    color: `rgb(${tone})`,
                  }}
                >
                  {fact.value}
                </div>
                <div style={{ marginTop: 6, fontSize: 19, color: "#a49c95" }}>
                  {fact.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", fontSize: 22, color: "#a49c95" }}>
            {site.name}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
