import { ImageResponse } from "next/og";

import { site } from "@/lib/site";
import { stats } from "@/lib/data";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card that shows up when the site is pasted into Slack, LinkedIn or a
 * DM — often the first thing anyone sees of it.
 *
 * Generated rather than designed as a file so it can't fall out of sync with
 * the copy, and written in hex rather than the site's oklch tokens because
 * Satori resolves neither CSS variables nor oklch().
 */
export default function OpengraphImage() {
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
            top: -160,
            left: -120,
            width: 620,
            height: 620,
            borderRadius: 999,
            background:
              "radial-gradient(circle at center, rgba(240,178,90,0.30), rgba(240,178,90,0) 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            right: -140,
            width: 640,
            height: 640,
            borderRadius: 999,
            background:
              "radial-gradient(circle at center, rgba(214,124,86,0.24), rgba(214,124,86,0) 65%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#f0b25a",
            }}
          />
          {/* Interpolated into one string: Satori treats each text run as a
              separate child and rejects a div with several unless it is
              explicitly flex. */}
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#a49c95",
            }}
          >
            {`${site.role} · ${site.location}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 600,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 38,
              lineHeight: 1.25,
              color: "#c2bab3",
              maxWidth: 900,
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div style={{ display: "flex", gap: 56 }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{ display: "flex", flexDirection: "column", maxWidth: 300 }}
            >
              <div style={{ fontSize: 44, fontWeight: 600, color: "#f0b25a" }}>
                {stat.value}
              </div>
              <div style={{ marginTop: 8, fontSize: 20, color: "#a49c95" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
